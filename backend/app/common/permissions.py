"""Multi-tenant Organization Context & RBAC Security Dependencies."""

from typing import Optional, List, Callable, Tuple
import uuid
from fastapi import Depends, HTTPException, Header, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.config import settings
from app.database import get_db
from app.auth.security import decode_access_token
from app.models.user import User
from app.models.organization import Organization
from app.models.membership import Membership

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login", auto_error=False)

# Canonical role hierarchy levels
ROLE_HIERARCHY = {
    # Organization roles
    "organization_owner": 5,
    "owner": 5,
    "organization_manager": 4,
    "manager": 4,
    "admin": 4,
    "property_editor": 3,
    "editor": 3,
    "agent": 2,
    "read_only": 1,
    "viewer": 1,
}


async def get_current_user(
    token: Optional[str] = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db),
) -> User:
    """Dependency that decodes JWT access token and returns current active User."""
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication token missing",
            headers={"WWW-Authenticate": "Bearer"},
        )

    try:
        payload = decode_access_token(token)
        user_id_str: str = payload.get("sub")
        if not user_id_str:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token payload",
            )
        user_id = uuid.UUID(user_id_str)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid or expired token: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )

    query = (
        select(User)
        .options(selectinload(User.memberships).selectinload(Membership.organization))
        .where(User.id == user_id, User.is_active == True)
    )
    result = await db.execute(query)
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or account deactivated",
        )

    return user


async def require_platform_admin(
    current_user: User = Depends(get_current_user),
) -> User:
    """Dependency enforcing platform administrator privileges."""
    if not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Platform administrator privilege required",
        )
    return current_user


async def get_current_org_context(
    x_organization_id: Optional[str] = Header(None, alias="X-Organization-ID"),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> Tuple[Organization, str, Membership]:
    """
    Dependency that resolves the active organization context for multi-tenant isolation.
    Returns (Organization, role_string, Membership).
    """
    if not current_user.memberships:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User is not a member of any organization",
        )

    selected_org_id: Optional[uuid.UUID] = None

    if x_organization_id:
        try:
            selected_org_id = uuid.UUID(x_organization_id)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid X-Organization-ID header UUID format",
            )

    target_membership: Optional[Membership] = None

    if selected_org_id:
        for m in current_user.memberships:
            if m.organization_id == selected_org_id and m.is_active and m.organization.is_active:
                target_membership = m
                break
        if not target_membership:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied to requested organization",
            )
    else:
        # Default to first active membership
        for m in current_user.memberships:
            if m.is_active and m.organization.is_active:
                target_membership = m
                break

    if not target_membership:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No active organization membership found",
        )

    return target_membership.organization, target_membership.role, target_membership


def require_role(min_role: str) -> Callable:
    """
    Dependency generator for RBAC role authorization.
    Usage: Depends(require_role("organization_manager"))
    """
    min_level = ROLE_HIERARCHY.get(min_role.lower(), 1)

    async def role_checker(
        org_context: Tuple[Organization, str, Membership] = Depends(get_current_org_context)
    ) -> Tuple[Organization, str, Membership]:
        org, role, membership = org_context
        user_level = ROLE_HIERARCHY.get(role.lower(), 0)

        if user_level < min_level:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Action requires minimum '{min_role}' role in this organization",
            )

        return org, role, membership

    return role_checker
