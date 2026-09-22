"""Property Management & Publishing API Router."""

from typing import Optional, List, Tuple
from decimal import Decimal
from datetime import datetime, timezone
import uuid
from math import ceil
from fastapi import APIRouter, Depends, HTTPException, Query, Request, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.config import settings
from app.common.permissions import get_current_user, get_current_org_context, require_role
from app.models.user import User
from app.models.organization import Organization
from app.models.membership import Membership
from app.models.property import Property
from app.schemas.property import (
    PropertyCreate,
    PropertyUpdate,
    PropertyStatusUpdate,
    PropertyResponse,
    PaginatedPropertiesResponse,
)
from app.repositories.property_repository import PropertyRepository
from app.services.storage_service import storage_service
from app.services.audit_service import AuditLogService

router = APIRouter(prefix="/api/v1/properties", tags=["Properties"])


def enrich_property_with_signed_urls(prop: Property) -> PropertyResponse:
    """Helper to convert Property ORM object to PropertyResponse with signed URLs."""
    resp = PropertyResponse.model_validate(prop)

    for img in resp.images:
        img.signed_url = storage_service.get_signed_url(
            bucket=settings.SUPABASE_IMAGES_BUCKET,
            storage_path=img.storage_path,
        )

    for doc in resp.documents:
        doc.signed_url = storage_service.get_signed_url(
            bucket=settings.SUPABASE_DOCUMENTS_BUCKET,
            storage_path=doc.storage_path,
        )

    return resp


@router.get("/public/marketplace", response_model=PaginatedPropertiesResponse)
async def list_public_marketplace_properties(
    q: Optional[str] = Query(None),
    city: Optional[str] = Query(None),
    property_type: Optional[str] = Query(None),
    listing_type: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    """Public marketplace endpoint for unauthenticated visitors on landing page."""
    stmt = select(Property).where(Property.status == "published")

    if city:
        stmt = stmt.where(Property.city.ilike(f"%{city.strip()}%"))
    if property_type:
        stmt = stmt.where(Property.property_type == property_type.lower())
    if listing_type:
        stmt = stmt.where(Property.listing_type == listing_type.lower())
    if q:
        stmt = stmt.where(Property.title.ilike(f"%{q.strip()}%"))

    count_stmt = select(Property.id).where(Property.status == "published")
    total_res = await db.execute(count_stmt)
    total = len(list(total_res.scalars().all()))

    offset = (page - 1) * size
    stmt = stmt.order_by(Property.published_at.desc()).offset(offset).limit(size).options(
        selectinload(Property.images),
        selectinload(Property.documents),
    )

    results = await db.execute(stmt)
    items = list(results.scalars().all())

    enriched_items = [enrich_property_with_signed_urls(item) for item in items]
    total_pages = ceil(total / size) if total > 0 else 0

    return PaginatedPropertiesResponse(
        items=enriched_items,
        total=total,
        page=page,
        size=size,
        pages=total_pages,
    )


@router.get("", response_model=PaginatedPropertiesResponse)
async def list_properties(
    q: Optional[str] = Query(None, description="Free text search on title, description, city, locality"),
    city: Optional[str] = Query(None),
    locality: Optional[str] = Query(None),
    property_type: Optional[str] = Query(None, description="house, apartment, plot, commercial, villa"),
    listing_type: Optional[str] = Query(None, description="sale, rent"),
    status: Optional[str] = Query(None, description="draft, pending_approval, published, paused, archived"),
    min_price: Optional[Decimal] = Query(None, ge=0),
    max_price: Optional[Decimal] = Query(None, ge=0),
    min_area: Optional[Decimal] = Query(None, ge=0),
    max_area: Optional[Decimal] = Query(None, ge=0),
    bedrooms: Optional[int] = Query(None, ge=0),
    bathrooms: Optional[int] = Query(None, ge=0),
    assigned_agent_id: Optional[uuid.UUID] = Query(None),
    sort_by: str = Query("created_at", description="Field to sort by: created_at, price, title"),
    sort_order: str = Query("desc", description="asc or desc"),
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    org_context: Tuple[Organization, str, Membership] = Depends(require_role("read_only")),
    db: AsyncSession = Depends(get_db),
):
    """Tenant-isolated property inventory search for authorized organization members."""
    org, _, _ = org_context
    repo = PropertyRepository(db, org.id)

    items, total = await repo.search(
        query_text=q,
        city=city,
        locality=locality,
        property_type=property_type,
        listing_type=listing_type,
        status_filter=status,
        min_price=min_price,
        max_price=max_price,
        min_area=min_area,
        max_area=max_area,
        bedrooms=bedrooms,
        bathrooms=bathrooms,
        assigned_agent_id=assigned_agent_id,
        sort_by=sort_by,
        sort_order=sort_order,
        page=page,
        size=size,
    )

    enriched_items = [enrich_property_with_signed_urls(item) for item in items]
    total_pages = ceil(total / size) if total > 0 else 0

    return PaginatedPropertiesResponse(
        items=enriched_items,
        total=total,
        page=page,
        size=size,
        pages=total_pages,
    )


@router.post("", response_model=PropertyResponse, status_code=status.HTTP_201_CREATED)
async def create_property(
    payload: PropertyCreate,
    request: Request,
    org_context: Tuple[Organization, str, Membership] = Depends(require_role("property_editor")),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a new property listing in draft status (Property Editor / Manager / Owner)."""
    org, _, _ = org_context
    repo = PropertyRepository(db, org.id)

    prop = await repo.create(payload, created_by_user_id=current_user.id)

    await AuditLogService.log_event(
        db=db,
        action="property.create",
        resource_type="property",
        resource_id=str(prop.id),
        organization_id=org.id,
        actor_user_id=current_user.id,
        payload=payload.model_dump(exclude_none=True, mode="json"),
        request=request,
    )

    return enrich_property_with_signed_urls(prop)


@router.get("/{property_id}", response_model=PropertyResponse)
async def get_property(
    property_id: uuid.UUID,
    org_context: Tuple[Organization, str, Membership] = Depends(require_role("read_only")),
    db: AsyncSession = Depends(get_db),
):
    """Get single property listing by ID (Tenant isolated)."""
    org, _, _ = org_context
    repo = PropertyRepository(db, org.id)

    prop = await repo.get_by_id(property_id)
    if not prop:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Property listing not found",
        )

    return enrich_property_with_signed_urls(prop)


@router.put("/{property_id}", response_model=PropertyResponse)
async def update_property(
    property_id: uuid.UUID,
    payload: PropertyUpdate,
    request: Request,
    org_context: Tuple[Organization, str, Membership] = Depends(require_role("property_editor")),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update existing property listing details (Property Editor / Manager / Owner)."""
    org, _, _ = org_context
    repo = PropertyRepository(db, org.id)

    prop = await repo.get_by_id(property_id)
    if not prop:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Property listing not found",
        )

    updated_prop = await repo.update(prop, payload)

    await AuditLogService.log_event(
        db=db,
        action="property.update",
        resource_type="property",
        resource_id=str(prop.id),
        organization_id=org.id,
        actor_user_id=current_user.id,
        payload=payload.model_dump(exclude_unset=True, mode="json"),
        request=request,
    )

    return enrich_property_with_signed_urls(updated_prop)


@router.patch("/{property_id}/status", response_model=PropertyResponse)
async def transition_property_status(
    property_id: uuid.UUID,
    payload: PropertyStatusUpdate,
    request: Request,
    org_context: Tuple[Organization, str, Membership] = Depends(require_role("property_editor")),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Transition property through publishing workflow states:
    draft -> pending_approval -> published -> paused / archived.
    Publishing requires Organization Owner or Organization Manager role.
    """
    org, role, _ = org_context
    repo = PropertyRepository(db, org.id)

    prop = await repo.get_by_id(property_id)
    if not prop:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Property listing not found",
        )

    new_status = payload.status.lower()
    valid_statuses = {"draft", "pending_approval", "published", "paused", "archived"}
    if new_status not in valid_statuses:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid status '{new_status}'. Allowed: {valid_statuses}",
        )

    # Publishing enforcement: Only Organization Owner or Manager can publish
    normalized_role = role.lower()
    if new_status == "published" and normalized_role not in (
        "organization_owner",
        "owner",
        "organization_manager",
        "manager",
        "admin",
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only Organization Owners or Managers can publish property listings to public",
        )

    old_status = prop.status
    prop.status = new_status
    if new_status == "published" and old_status != "published":
        prop.published_at = datetime.now(timezone.utc)

    await db.commit()
    await db.refresh(prop)

    await AuditLogService.log_event(
        db=db,
        action=f"property.status_change.{new_status}",
        resource_type="property",
        resource_id=str(prop.id),
        organization_id=org.id,
        actor_user_id=current_user.id,
        payload={"from_status": old_status, "to_status": new_status},
        request=request,
    )

    return enrich_property_with_signed_urls(prop)


@router.delete("/{property_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_property(
    property_id: uuid.UUID,
    request: Request,
    org_context: Tuple[Organization, str, Membership] = Depends(require_role("organization_manager")),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Delete property listing (Organization Owner or Manager only)."""
    org, _, _ = org_context
    repo = PropertyRepository(db, org.id)

    prop = await repo.get_by_id(property_id)
    if not prop:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Property listing not found",
        )

    await repo.delete(prop)

    await AuditLogService.log_event(
        db=db,
        action="property.delete",
        resource_type="property",
        resource_id=str(property_id),
        organization_id=org.id,
        actor_user_id=current_user.id,
        request=request,
    )
