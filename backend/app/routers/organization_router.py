"""Organization & Multi-tenant Team Management API Router."""

from typing import List, Tuple
import uuid
from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.common.permissions import get_current_user, get_current_org_context, require_role
from app.models.user import User
from app.models.organization import Organization
from app.models.membership import Membership
from app.schemas.organization import (
    OrganizationResponse,
    OrganizationUpdate,
    MembershipResponse,
    AddMemberRequest,
    UpdateRoleRequest,
)
from app.services.audit_service import AuditLogService

router = APIRouter(prefix="/api/v1/organizations", tags=["Organizations"])

VALID_ORG_ROLES = {
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


@router.get("/me", response_model=OrganizationResponse)
async def get_current_organization(
    org_context: Tuple[Organization, str, Membership] = Depends(require_role("read_only")),
):
    """Get details of the currently active organization context."""
    org, _, _ = org_context
    return org


@router.put("/me", response_model=OrganizationResponse)
async def update_current_organization(
    payload: OrganizationUpdate,
    request: Request,
    org_context: Tuple[Organization, str, Membership] = Depends(require_role("organization_owner")),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update active organization profile details (Organization Owner only)."""
    org, role, _ = org_context

    if payload.name is not None:
        org.name = payload.name
    if payload.slug is not None:
        slug_check = await db.execute(
            select(Organization).where(Organization.slug == payload.slug, Organization.id != org.id)
        )
        if slug_check.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Organization slug is already in use",
            )
        org.slug = payload.slug
    if payload.is_active is not None and role in ("organization_owner", "owner"):
        org.is_active = payload.is_active

    await db.commit()
    await db.refresh(org)

    await AuditLogService.log_event(
        db=db,
        action="organization.update",
        resource_type="organization",
        resource_id=str(org.id),
        organization_id=org.id,
        actor_user_id=current_user.id,
        payload=payload.model_dump(exclude_unset=True),
        request=request,
    )

    return org


@router.get("/me/members", response_model=List[MembershipResponse])
async def list_organization_members(
    org_context: Tuple[Organization, str, Membership] = Depends(require_role("read_only")),
    db: AsyncSession = Depends(get_db),
):
    """List all team members of the active organization."""
    org, _, _ = org_context

    stmt = (
        select(Membership)
        .options(selectinload(Membership.user))
        .where(Membership.organization_id == org.id)
        .order_by(Membership.created_at.asc())
    )
    result = await db.execute(stmt)
    memberships = list(result.scalars().all())

    return memberships


@router.post("/me/members", response_model=MembershipResponse, status_code=status.HTTP_201_CREATED)
async def add_organization_member(
    payload: AddMemberRequest,
    request: Request,
    org_context: Tuple[Organization, str, Membership] = Depends(require_role("organization_manager")),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Add existing user directly to the organization by email (Owner/Manager only)."""
    org, actor_role, _ = org_context

    target_role = payload.role.lower().strip()
    if target_role not in VALID_ORG_ROLES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid role '{payload.role}'. Must be one of {VALID_ORG_ROLES}",
        )

    if target_role in ("organization_owner", "owner") and actor_role not in ("organization_owner", "owner"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only Organization Owners can assign another Owner role",
        )

    user_stmt = select(User).where(User.email == payload.email.lower())
    target_user = (await db.execute(user_stmt)).scalar_one_or_none()

    if not target_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User with specified email not found. Send an invitation link instead.",
        )

    existing_mem = await db.execute(
        select(Membership).where(
            Membership.organization_id == org.id, Membership.user_id == target_user.id
        )
    )
    if existing_mem.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User is already a member of this organization",
        )

    new_mem = Membership(
        user_id=target_user.id,
        organization_id=org.id,
        role=target_role,
        is_active=True,
    )
    db.add(new_mem)
    await db.commit()

    res_stmt = (
        select(Membership)
        .options(selectinload(Membership.user))
        .where(Membership.id == new_mem.id)
    )
    loaded_mem = (await db.execute(res_stmt)).scalar_one()

    await AuditLogService.log_event(
        db=db,
        action="organization.add_member",
        resource_type="membership",
        resource_id=str(loaded_mem.id),
        organization_id=org.id,
        actor_user_id=current_user.id,
        payload={"target_user_id": str(target_user.id), "role": target_role},
        request=request,
    )

    return loaded_mem


@router.patch("/me/members/{membership_id}/role", response_model=MembershipResponse)
async def update_member_role(
    membership_id: uuid.UUID,
    payload: UpdateRoleRequest,
    request: Request,
    org_context: Tuple[Organization, str, Membership] = Depends(require_role("organization_manager")),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Change a team member's organization role (Owner/Manager only)."""
    org, actor_role, _ = org_context

    new_role = payload.role.lower().strip()
    if new_role not in VALID_ORG_ROLES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid role '{payload.role}'. Must be one of {VALID_ORG_ROLES}",
        )

    stmt = (
        select(Membership)
        .options(selectinload(Membership.user))
        .where(Membership.id == membership_id, Membership.organization_id == org.id)
    )
    target_mem = (await db.execute(stmt)).scalar_one_or_none()

    if not target_mem:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Membership record not found in this organization",
        )

    if (new_role in ("organization_owner", "owner") or target_mem.role in ("organization_owner", "owner")) and actor_role not in ("organization_owner", "owner"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only Organization Owners can change Owner roles",
        )

    target_mem.role = new_role
    await db.commit()

    await AuditLogService.log_event(
        db=db,
        action="organization.update_member_role",
        resource_type="membership",
        resource_id=str(membership_id),
        organization_id=org.id,
        actor_user_id=current_user.id,
        payload={"new_role": new_role},
        request=request,
    )

    return target_mem


@router.delete("/me/members/{membership_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_organization_member(
    membership_id: uuid.UUID,
    request: Request,
    org_context: Tuple[Organization, str, Membership] = Depends(require_role("organization_manager")),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Remove a team member from the organization (Owner/Manager only)."""
    org, actor_role, _ = org_context

    stmt = select(Membership).where(
        Membership.id == membership_id, Membership.organization_id == org.id
    )
    target_mem = (await db.execute(stmt)).scalar_one_or_none()

    if not target_mem:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Membership record not found in this organization",
        )

    if target_mem.role in ("organization_owner", "owner") and actor_role not in ("organization_owner", "owner"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only Organization Owners can remove an Owner",
        )

    await db.delete(target_mem)
    await db.commit()

    await AuditLogService.log_event(
        db=db,
        action="organization.remove_member",
        resource_type="membership",
        resource_id=str(membership_id),
        organization_id=org.id,
        actor_user_id=current_user.id,
        request=request,
    )
