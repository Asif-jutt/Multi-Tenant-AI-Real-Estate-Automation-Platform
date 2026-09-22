"""Platform Admin API Router for superuser platform operations."""

from typing import List, Optional
import uuid
from fastapi import APIRouter, Depends, HTTPException, Request, status
from pydantic import BaseModel, ConfigDict
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.common.permissions import require_platform_admin
from app.models.user import User
from app.models.organization import Organization
from app.models.membership import Membership
from app.models.property import Property
from app.services.audit_service import AuditLogService

router = APIRouter(prefix="/api/v1/platform", tags=["Platform Admin"])


class PlatformOrgResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    name: str
    slug: str
    is_active: bool
    member_count: int = 0
    property_count: int = 0
    created_at: str


class OrgStatusUpdate(BaseModel):
    is_active: bool


@router.get("/organizations", response_model=List[PlatformOrgResponse])
async def list_platform_organizations(
    request: Request,
    admin_user: User = Depends(require_platform_admin),
    db: AsyncSession = Depends(get_db),
):
    """
    Platform Admin endpoint to inspect all registered tenant organizations.
    Access to tenant summary is audited.
    """
    stmt = select(Organization).order_by(Organization.created_at.desc())
    results = await db.execute(stmt)
    orgs = list(results.scalars().all())

    output = []
    for org in orgs:
        # Member count
        mem_count_res = await db.execute(
            select(func.count(Membership.id)).where(Membership.organization_id == org.id)
        )
        mem_count = mem_count_res.scalar_one() or 0

        # Property count
        prop_count_res = await db.execute(
            select(func.count(Property.id)).where(Property.organization_id == org.id)
        )
        prop_count = prop_count_res.scalar_one() or 0

        output.append(
            PlatformOrgResponse(
                id=org.id,
                name=org.name,
                slug=org.slug,
                is_active=org.is_active,
                member_count=mem_count,
                property_count=prop_count,
                created_at=org.created_at.isoformat(),
            )
        )

    await AuditLogService.log_event(
        db=db,
        action="platform.list_organizations",
        resource_type="platform",
        actor_user_id=admin_user.id,
        payload={"total_orgs": len(output)},
        request=request,
    )

    return output


@router.patch("/organizations/{org_id}/status", response_model=PlatformOrgResponse)
async def update_organization_status(
    org_id: uuid.UUID,
    payload: OrgStatusUpdate,
    request: Request,
    admin_user: User = Depends(require_platform_admin),
    db: AsyncSession = Depends(get_db),
):
    """Platform Admin endpoint to suspend or reactivate an organization."""
    stmt = select(Organization).where(Organization.id == org_id)
    org = (await db.execute(stmt)).scalar_one_or_none()

    if not org:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Organization not found")

    org.is_active = payload.is_active
    await db.commit()
    await db.refresh(org)

    await AuditLogService.log_event(
        db=db,
        action="platform.suspend_organization" if not payload.is_active else "platform.reactivate_organization",
        resource_type="organization",
        resource_id=str(org_id),
        actor_user_id=admin_user.id,
        payload={"is_active": payload.is_active},
        request=request,
    )

    mem_count = (
        await db.execute(select(func.count(Membership.id)).where(Membership.organization_id == org.id))
    ).scalar_one() or 0
    prop_count = (
        await db.execute(select(func.count(Property.id)).where(Property.organization_id == org.id))
    ).scalar_one() or 0

    return PlatformOrgResponse(
        id=org.id,
        name=org.name,
        slug=org.slug,
        is_active=org.is_active,
        member_count=mem_count,
        property_count=prop_count,
        created_at=org.created_at.isoformat(),
    )


@router.get("/health")
async def platform_health_metrics(
    admin_user: User = Depends(require_platform_admin),
    db: AsyncSession = Depends(get_db),
):
    """Get platform health metrics and aggregate counts."""
    total_users = (await db.execute(select(func.count(User.id)))).scalar_one() or 0
    total_orgs = (await db.execute(select(func.count(Organization.id)))).scalar_one() or 0
    total_props = (await db.execute(select(func.count(Property.id)))).scalar_one() or 0

    return {
        "status": "healthy",
        "ai_enabled": False,
        "ai_status": "not_implemented",
        "future_integrations": [],
        "metrics": {
            "total_users": total_users,
            "total_organizations": total_orgs,
            "total_properties": total_props,
        },
    }
