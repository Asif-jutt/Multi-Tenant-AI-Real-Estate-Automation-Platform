"""Property Repository for tenant-isolated database access and advanced search."""

from typing import Optional, List, Tuple
from decimal import Decimal
import uuid
import re
from sqlalchemy import select, func, or_, and_, asc, desc
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.property import Property
from app.models.property_image import PropertyImage
from app.models.property_document import PropertyDocument
from app.schemas.property import PropertyCreate, PropertyUpdate


def slugify(text: str) -> str:
    """Simple slug generator for property title."""
    text = text.lower().strip()
    text = re.sub(r"[^\w\s-]", "", text)
    return re.sub(r"[\s_-]+", "-", text)[:200]


class PropertyRepository:
    def __init__(self, db: AsyncSession, organization_id: uuid.UUID):
        self.db = db
        self.organization_id = organization_id

    async def create(self, data: PropertyCreate, created_by_user_id: uuid.UUID) -> Property:
        base_slug = slugify(data.title)
        unique_slug = f"{base_slug}-{uuid.uuid4().hex[:6]}"

        prop = Property(
            organization_id=self.organization_id,
            title=data.title,
            slug=unique_slug,
            description=data.description,
            property_type=data.property_type.lower(),
            listing_type=data.listing_type.lower(),
            status="draft",
            price=data.price,
            currency=data.currency or "PKR",
            area_sqft=data.area_sqft,
            bedrooms=data.bedrooms,
            bathrooms=data.bathrooms,
            city=data.city,
            locality=data.locality,
            address=data.address,
            features=data.features or [],
            meta_json=data.meta_json or {},
            created_by_user_id=created_by_user_id,
            assigned_agent_id=data.assigned_agent_id,
        )
        self.db.add(prop)
        await self.db.commit()
        await self.db.refresh(prop)
        return await self.get_by_id(prop.id)

    async def get_by_id(self, property_id: uuid.UUID) -> Optional[Property]:
        query = (
            select(Property)
            .options(
                selectinload(Property.images),
                selectinload(Property.documents),
            )
            .where(
                Property.id == property_id,
                Property.organization_id == self.organization_id,
            )
        )
        result = await self.db.execute(query)
        return result.scalar_one_or_none()

    async def update(self, prop: Property, data: PropertyUpdate) -> Property:
        update_data = data.model_dump(exclude_unset=True)
        if "title" in update_data and update_data["title"]:
            base_slug = slugify(update_data["title"])
            update_data["slug"] = f"{base_slug}-{uuid.uuid4().hex[:6]}"

        for key, value in update_data.items():
            setattr(prop, key, value)

        await self.db.commit()
        await self.db.refresh(prop)
        return await self.get_by_id(prop.id)

    async def delete(self, prop: Property) -> None:
        await self.db.delete(prop)
        await self.db.commit()

    async def search(
        self,
        query_text: Optional[str] = None,
        city: Optional[str] = None,
        locality: Optional[str] = None,
        property_type: Optional[str] = None,
        listing_type: Optional[str] = None,
        status_filter: Optional[str] = None,
        min_price: Optional[Decimal] = None,
        max_price: Optional[Decimal] = None,
        min_area: Optional[Decimal] = None,
        max_area: Optional[Decimal] = None,
        bedrooms: Optional[int] = None,
        bathrooms: Optional[int] = None,
        assigned_agent_id: Optional[uuid.UUID] = None,
        sort_by: str = "created_at",
        sort_order: str = "desc",
        page: int = 1,
        size: int = 20,
    ) -> Tuple[List[Property], int]:
        """Tenant-isolated multi-criteria search and filtering."""
        stmt = select(Property).where(Property.organization_id == self.organization_id)

        if status_filter:
            stmt = stmt.where(Property.status == status_filter.lower())
        if property_type:
            stmt = stmt.where(Property.property_type == property_type.lower())
        if listing_type:
            stmt = stmt.where(Property.listing_type == listing_type.lower())
        if city:
            stmt = stmt.where(Property.city.ilike(f"%{city.strip()}%"))
        if locality:
            stmt = stmt.where(Property.locality.ilike(f"%{locality.strip()}%"))
        if min_price is not None:
            stmt = stmt.where(Property.price >= min_price)
        if max_price is not None:
            stmt = stmt.where(Property.price <= max_price)
        if min_area is not None:
            stmt = stmt.where(Property.area_sqft >= min_area)
        if max_area is not None:
            stmt = stmt.where(Property.area_sqft <= max_area)
        if bedrooms is not None:
            stmt = stmt.where(Property.bedrooms == bedrooms)
        if bathrooms is not None:
            stmt = stmt.where(Property.bathrooms == bathrooms)
        if assigned_agent_id:
            stmt = stmt.where(Property.assigned_agent_id == assigned_agent_id)

        if query_text:
            search_pattern = f"%{query_text.strip()}%"
            stmt = stmt.where(
                or_(
                    Property.title.ilike(search_pattern),
                    Property.description.ilike(search_pattern),
                    Property.locality.ilike(search_pattern),
                    Property.city.ilike(search_pattern),
                )
            )

        # Count total matches
        count_stmt = select(func.count()).select_from(stmt.subquery())
        total_result = await self.db.execute(count_stmt)
        total = total_result.scalar_one() or 0

        # Sorting
        sort_col = getattr(Property, sort_by, Property.created_at)
        if sort_order.lower() == "asc":
            stmt = stmt.order_by(asc(sort_col))
        else:
            stmt = stmt.order_by(desc(sort_col))

        # Pagination & Eager Loading
        offset = (page - 1) * size
        stmt = stmt.offset(offset).limit(size).options(
            selectinload(Property.images),
            selectinload(Property.documents),
        )

        results = await self.db.execute(stmt)
        items = list(results.scalars().all())

        return items, total
