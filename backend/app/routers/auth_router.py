"""Authentication API Router."""

from datetime import datetime, timezone
import uuid
from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.config import settings
from app.auth.security import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
    hash_token,
)
from app.common.permissions import get_current_user
from app.models.user import User
from app.models.organization import Organization
from app.models.membership import Membership
from app.models.refresh_token import RefreshToken
from app.schemas.auth import (
    RegisterRequest,
    LoginRequest,
    RefreshTokenRequest,
    TokenResponse,
    UserProfileResponse,
    MembershipInfo,
)
from app.services.audit_service import AuditLogService
import re

router = APIRouter(prefix="/api/v1/auth", tags=["Authentication"])


def slugify_org(name: str) -> str:
    text = name.lower().strip()
    text = re.sub(r"[^\w\s-]", "", text)
    return re.sub(r"[\s_-]+", "-", text)[:80]


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(
    payload: RegisterRequest,
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    """Register a new user and create their initial tenant organization."""
    # Check if user email already exists
    existing_user_query = select(User).where(User.email == payload.email.lower())
    existing_user_res = await db.execute(existing_user_query)
    if existing_user_res.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists",
        )

    # Generate org slug
    base_slug = slugify_org(payload.organization_name)
    unique_slug = f"{base_slug}-{uuid.uuid4().hex[:6]}"

    # Create User
    new_user = User(
        email=payload.email.lower(),
        hashed_password=hash_password(payload.password),
        first_name=payload.first_name,
        last_name=payload.last_name,
        phone=payload.phone,
        is_active=True,
        is_superuser=False,
        is_email_verified=False,
    )
    db.add(new_user)
    await db.flush()

    # Create Organization
    new_org = Organization(
        name=payload.organization_name,
        slug=unique_slug,
        is_active=True,
    )
    db.add(new_org)
    await db.flush()

    # Create Membership as Owner
    new_membership = Membership(
        user_id=new_user.id,
        organization_id=new_org.id,
        role="owner",
        is_active=True,
    )
    db.add(new_membership)

    # Issue Tokens
    raw_refresh, token_hash_val, expires_at = create_refresh_token(new_user.id)
    db_refresh = RefreshToken(
        user_id=new_user.id,
        token_hash=token_hash_val,
        expires_at=expires_at,
        is_revoked=False,
    )
    db.add(db_refresh)

    await db.commit()

    access_token = create_access_token(
        user_id=new_user.id,
        email=new_user.email,
        organization_id=new_org.id,
    )

    await AuditLogService.log_event(
        db=db,
        action="user.register",
        resource_type="user",
        resource_id=str(new_user.id),
        organization_id=new_org.id,
        actor_user_id=new_user.id,
        payload={"email": new_user.email, "org_name": new_org.name},
        request=request,
    )

    return TokenResponse(
        access_token=access_token,
        refresh_token=raw_refresh,
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    )


@router.post("/login", response_model=TokenResponse)
async def login(
    payload: LoginRequest,
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    """Authenticate user credentials and return access + refresh tokens."""
    query = (
        select(User)
        .options(selectinload(User.memberships).selectinload(Membership.organization))
        .where(User.email == payload.email.lower())
    )
    result = await db.execute(query)
    user = result.scalar_one_or_none()

    if not user or not verify_password(payload.password, user.hashed_password):
        await AuditLogService.log_event(
            db=db,
            action="user.login_failed",
            resource_type="user",
            payload={"email": payload.email},
            request=request,
        )
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is deactivated",
        )

    # Select default active organization ID
    default_org_id = None
    if user.memberships:
        for m in user.memberships:
            if m.is_active and m.organization.is_active:
                default_org_id = m.organization_id
                break

    raw_refresh, token_hash_val, expires_at = create_refresh_token(user.id)
    db_refresh = RefreshToken(
        user_id=user.id,
        token_hash=token_hash_val,
        expires_at=expires_at,
        is_revoked=False,
    )
    db.add(db_refresh)
    await db.commit()

    access_token = create_access_token(
        user_id=user.id,
        email=user.email,
        organization_id=default_org_id,
    )

    await AuditLogService.log_event(
        db=db,
        action="user.login_success",
        resource_type="user",
        resource_id=str(user.id),
        organization_id=default_org_id,
        actor_user_id=user.id,
        request=request,
    )

    return TokenResponse(
        access_token=access_token,
        refresh_token=raw_refresh,
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    )


@router.post("/refresh", response_model=TokenResponse)
async def refresh_tokens(
    payload: RefreshTokenRequest,
    db: AsyncSession = Depends(get_db),
):
    """Exchange valid refresh token for a new access token and rotated refresh token."""
    incoming_hash = hash_token(payload.refresh_token)

    query = select(RefreshToken).where(
        RefreshToken.token_hash == incoming_hash,
        RefreshToken.is_revoked == False,
    )
    result = await db.execute(query)
    token_entry = result.scalar_one_or_none()

    if not token_entry:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or revoked refresh token",
        )

    if token_entry.expires_at < datetime.now(timezone.utc):
        token_entry.is_revoked = True
        await db.commit()
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token has expired",
        )

    # Revoke current refresh token (Token rotation)
    token_entry.is_revoked = True

    # Get User
    user_query = (
        select(User)
        .options(selectinload(User.memberships))
        .where(User.id == token_entry.user_id, User.is_active == True)
    )
    user_res = await db.execute(user_query)
    user = user_res.scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or deactivated",
        )

    default_org_id = user.memberships[0].organization_id if user.memberships else None

    # Issue new rotated refresh token
    new_raw_refresh, new_hash, new_expires = create_refresh_token(user.id)
    new_refresh_entry = RefreshToken(
        user_id=user.id,
        token_hash=new_hash,
        expires_at=new_expires,
        is_revoked=False,
    )
    db.add(new_refresh_entry)
    await db.commit()

    new_access_token = create_access_token(
        user_id=user.id,
        email=user.email,
        organization_id=default_org_id,
    )

    return TokenResponse(
        access_token=new_access_token,
        refresh_token=new_raw_refresh,
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    )


@router.post("/logout", status_code=status.HTTP_200_OK)
async def logout(
    payload: RefreshTokenRequest,
    db: AsyncSession = Depends(get_db),
):
    """Revoke specific refresh token on logout."""
    incoming_hash = hash_token(payload.refresh_token)
    query = select(RefreshToken).where(RefreshToken.token_hash == incoming_hash)
    result = await db.execute(query)
    token_entry = result.scalar_one_or_none()

    if token_entry:
        token_entry.is_revoked = True
        await db.commit()

    return {"detail": "Logged out successfully"}


@router.get("/me", response_model=UserProfileResponse)
async def get_my_profile(
    current_user: User = Depends(get_current_user),
):
    """Get profile and active organization memberships for the current user."""
    memberships_info = []
    for m in current_user.memberships:
        if m.is_active and m.organization.is_active:
            memberships_info.append(
                MembershipInfo(
                    id=m.id,
                    organization_id=m.organization_id,
                    organization_name=m.organization.name,
                    organization_slug=m.organization.slug,
                    role=m.role,
                    is_active=m.is_active,
                )
            )

    return UserProfileResponse(
        id=current_user.id,
        email=current_user.email,
        first_name=current_user.first_name,
        last_name=current_user.last_name,
        phone=current_user.phone,
        is_active=current_user.is_active,
        is_superuser=current_user.is_superuser,
        is_email_verified=current_user.is_email_verified,
        created_at=current_user.created_at,
        memberships=memberships_info,
    )
