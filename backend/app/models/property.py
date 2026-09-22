"""Property ORM Model."""

import uuid
from decimal import Decimal
from datetime import datetime
from typing import List, Optional, Any, TYPE_CHECKING
from sqlalchemy import String, Text, Numeric, Integer, ForeignKey, DateTime, JSON
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base, TimestampMixin

if TYPE_CHECKING:
    from app.models.organization import Organization
    from app.models.property_image import PropertyImage
    from app.models.property_document import PropertyDocument


class Property(Base, TimestampMixin):
    __tablename__ = "properties"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )
    organization_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("organizations.id", ondelete="CASCADE"),
        index=True,
        nullable=False,
    )
    title: Mapped[str] = mapped_column(String(255), index=True, nullable=False)
    slug: Mapped[str] = mapped_column(String(255), index=True, nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    # Types & Status
    property_type: Mapped[str] = mapped_column(String(50), index=True, nullable=False)  # house, apartment, plot, commercial, villa
    listing_type: Mapped[str] = mapped_column(String(50), index=True, nullable=False)   # sale, rent
    status: Mapped[str] = mapped_column(
        String(50), index=True, default="draft", nullable=False
    )  # draft, pending_approval, published, archived, paused

    # Financials & Specifications
    price: Mapped[Decimal] = mapped_column(Numeric(15, 2), index=True, nullable=False)
    currency: Mapped[str] = mapped_column(String(10), default="PKR", nullable=False)
    area_sqft: Mapped[Optional[Decimal]] = mapped_column(Numeric(10, 2), nullable=True)
    bedrooms: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    bathrooms: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)

    # Location
    city: Mapped[str] = mapped_column(String(100), index=True, nullable=False)
    locality: Mapped[str] = mapped_column(String(100), index=True, nullable=False)
    address: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    # Rich Details
    features: Mapped[Optional[Any]] = mapped_column(JSONB, nullable=True)
    meta_json: Mapped[Optional[Any]] = mapped_column(JSONB, nullable=True)

    # Assignments & Publishing
    created_by_user_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    assigned_agent_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    published_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), nullable=True
    )

    # Relationships
    organization: Mapped["Organization"] = relationship("Organization", back_populates="properties")
    images: Mapped[List["PropertyImage"]] = relationship(
        "PropertyImage", back_populates="property", cascade="all, delete-orphan", order_by="PropertyImage.display_order"
    )
    documents: Mapped[List["PropertyDocument"]] = relationship(
        "PropertyDocument", back_populates="property", cascade="all, delete-orphan"
    )
