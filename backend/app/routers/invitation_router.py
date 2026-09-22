"""Team Invitation & Acceptance API Router."""

from datetime import datetime, timedelta, timezone
from typing import List, Tuple, Optional
import uuid
import secrets
from fastapi import APIRouter, Depends, HTTPException, Request, status
from pydantic import BaseModel, EmailStr, Field, ConfigDict
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.common.permissions import get_current_user, get_current_org_context, require_role
from app.models.user import User
from app.models.organization import Organization
from app.models.membership import Membership
from app.models.invitation import Invitation
from app.services.audit_service import AuditLogService

router = APIRouter(prefix="/api/v1", tags=["Team Invitations"])


class CreateInvitationRequest(BaseModel):
    email: EmailStr
    role: str = Field(
        "agent",
        description="Role: organization_owner, organization_manager, property_editor, agent, read_only",
    )


class InvitationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    organization_id: uuid.UUID
    organization_name: Optional[str] = None
    email: str
    role: str
    token: str
    status: str
    expires_at: datetime
    created_at: datetime


@router.post("/organizations/me/invitations", response_model=InvitationResponse, status_code=status.HTTP_201_CREATED)
async def create_invitation(
    payload: CreateInvitationRequest,
    request: Request,
    org_context: Tuple[Organization, str, Membership] = Depends(require_role("organization_manager")),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a new team invitation link for the active organization (Owner/Manager only)."""
    org, actor_role, _ = org_context

    valid_roles = {
        "organization_owner",
        "organization_manager",
        "property_editor",
        "agent",
        "read_only",
        "owner",
        "admin",
        "manager",
        "editor",
        "viewer",
    }
    target_role = payload.role.lower().strip()
    if target_role not in valid_roles:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid role '{payload.role}'. Must be one of {valid_roles}",
        )

    # Only owners can invite another owner
    if target_role in ("organization_owner", "owner") and actor_role not in ("organization_owner", "owner"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only Organization Owners can invite another Owner",
        )

    # Check if target email already has an active pending invitation
    pending_stmt = select(Invitation).where(
        Invitation.organization_id == org.id,
        Invitation.email == payload.email.lower(),
        Invitation.status == "pending",
    )
    existing_inv = (await db.execute(pending_stmt)).scalar_one_or_none()
    if existing_inv:
        # Extend expiration and return existing
        existing_inv.expires_at = datetime.now(timezone.utc) + timedelta(days=7)
        await db.commit()
        await db.refresh(existing_inv)
        resp = InvitationResponse.model_validate(existing_inv)
        resp.organization_name = org.name
        return resp

    inv_token = f"inv_{secrets.token_urlsafe(32)}"
    expires_at = datetime.now(timezone.utc) + timedelta(days=7)

    db_inv = Invitation(
        organization_id=org.id,
        email=payload.email.lower(),
        role=target_role,
        token=inv_token,
        status="pending",
        invited_by_user_id=current_user.id,
        expires_at=expires_at,
    )
    db.add(db_inv)
    await db.commit()
    await db.refresh(db_inv)

    await AuditLogService.log_event(
        db=db,
        action="organization.create_invitation",
        resource_type="invitation",
        resource_id=str(db_inv.id),
        organization_id=org.id,
        actor_user_id=current_user.id,
        payload={"invitee_email": db_inv.email, "role": db_inv.role},
        request=request,
    )

    resp = InvitationResponse.model_validate(db_inv)
    resp.organization_name = org.name
    return resp


@router.get("/organizations/me/invitations", response_model=List[InvitationResponse])
async def list_organization_invitations(
    org_context: Tuple[Organization, str, Membership] = Depends(require_role("organization_manager")),
    db: AsyncSession = Depends(get_db),
):
    """List all team invitations for the organization (Owner/Manager only)."""
    org, _, _ = org_context

    stmt = (
        select(Invitation)
        .options(selectinload(Invitation.organization))
        .where(Invitation.organization_id == org.id)
        .order_by(Invitation.created_at.desc())
    )
    results = await db.execute(stmt)
    invites = list(results.scalars().all())

    out = []
    for inv in invites:
        item = InvitationResponse.model_validate(inv)
        item.organization_name = org.name
        out.append(item)

    return out


@router.delete("/organizations/me/invitations/{invitation_id}", status_code=status.HTTP_204_NO_CONTENT)
async def revoke_invitation(
    invitation_id: uuid.UUID,
    request: Request,
    org_context: Tuple[Organization, str, Membership] = Depends(require_role("organization_manager")),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Revoke a pending team invitation (Owner/Manager only)."""
    org, _, _ = org_context

    stmt = select(Invitation).where(
        Invitation.id == invitation_id, Invitation.organization_id == org.id
    )
    inv = (await db.execute(stmt)).scalar_one_or_none()

    if not inv:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Invitation not found")

    inv.status = "revoked"
    await db.commit()

    await AuditLogService.log_event(
        db=db,
        action="organization.revoke_invitation",
        resource_type="invitation",
        resource_id=str(invitation_id),
        organization_id=org.id,
        actor_user_id=current_user.id,
        request=request,
    )


@router.get("/invitations/{token}", response_model=InvitationResponse)
async def inspect_invitation(
    token: str,
    db: AsyncSession = Depends(get_db),
):
    """Public endpoint to inspect an invitation token details."""
    stmt = (
        select(Invitation)
        .options(selectinload(Invitation.organization))
        .where(Invitation.token == token)
    )
    inv = (await db.execute(stmt)).scalar_one_or_none()

    if not inv or inv.status != "pending":
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invitation token is invalid, expired, or already used",
        )

    if inv.expires_at < datetime.now(timezone.utc):
        inv.status = "expired"
        await db.commit()
        raise HTTPException(
            status_code=status.HTTP_410_GONE,
            detail="Invitation token has expired",
        )

    resp = InvitationResponse.model_validate(inv)
    resp.organization_name = inv.organization.name if inv.organization else None
    return resp


@router.post("/invitations/{token}/accept", status_code=status.HTTP_200_OK)
async def accept_invitation(
    token: str,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Accept invitation and create user membership in the organization."""
    stmt = (
        select(Invitation)
        .options(selectinload(Invitation.organization))
        .where(Invitation.token == token, Invitation.status == "pending")
    )
    inv = (await db.execute(stmt)).scalar_one_or_none()

    if not inv:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invitation token is invalid or already processed",
        )

    if inv.expires_at < datetime.now(timezone.utc):
        inv.status = "expired"
        await db.commit()
        raise HTTPException(status_code=status.HTTP_410_GONE, detail="Invitation token expired")

    # Check if membership already exists
    existing_mem = await db.execute(
        select(Membership).where(
            Membership.user_id == current_user.id,
            Membership.organization_id == inv.organization_id,
        )
    )
    mem = existing_mem.scalar_one_or_none()

    if not mem:
        mem = Membership(
            user_id=current_user.id,
            organization_id=inv.organization_id,
            role=inv.role,
            is_active=True,
        )
        db.add(mem)

    inv.status = "accepted"
    await db.commit()

    await AuditLogService.log_event(
        db=db,
        action="organization.accept_invitation",
        resource_type="membership",
        resource_id=str(mem.id),
        organization_id=inv.organization_id,
        actor_user_id=current_user.id,
        payload={"role": inv.role},
        request=request,
    )

    return {
        "detail": f"Successfully joined organization '{inv.organization.name}' as '{inv.role}'",
        "organization_id": str(inv.organization_id),
        "role": inv.role,
    }
