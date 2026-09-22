"""Property Pydantic Schemas."""

from datetime import datetime
from decimal import Decimal
from typing import Optional, List, Any
import uuid
from pydantic import BaseModel, Field, ConfigDict
from app.schemas.storage import PropertyImageResponse, PropertyDocumentResponse


class PropertyCreate(BaseModel):
    title: str = Field(..., min_length=3, max_length=255)
    description: Optional[str] = None
    property_type: str = Field(..., description="house, apartment, plot, commercial, villa")
    listing_type: str = Field(..., description="sale, rent")
    price: Decimal = Field(..., gt=0)
    currency: str = Field("PKR", max_length=10)
    area_sqft: Optional[Decimal] = Field(None, gt=0)
    bedrooms: Optional[int] = Field(None, ge=0)
    bathrooms: Optional[int] = Field(None, ge=0)
    city: str = Field(..., min_length=2, max_length=100)
    locality: str = Field(..., min_length=2, max_length=100)
    address: Optional[str] = None
    features: Optional[List[str]] = Field(default_factory=list)
    meta_json: Optional[dict] = Field(default_factory=dict)
    assigned_agent_id: Optional[uuid.UUID] = None


class PropertyUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=3, max_length=255)
    description: Optional[str] = None
    property_type: Optional[str] = None
    listing_type: Optional[str] = None
    price: Optional[Decimal] = Field(None, gt=0)
    currency: Optional[str] = None
    area_sqft: Optional[Decimal] = Field(None, gt=0)
    bedrooms: Optional[int] = Field(None, ge=0)
    bathrooms: Optional[int] = Field(None, ge=0)
    city: Optional[str] = None
    locality: Optional[str] = None
    address: Optional[str] = None
    features: Optional[List[str]] = None
    meta_json: Optional[dict] = None
    assigned_agent_id: Optional[uuid.UUID] = None


class PropertyStatusUpdate(BaseModel):
    status: str = Field(..., description="draft, pending_approval, published, paused, archived")


class PropertyResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    organization_id: uuid.UUID
    title: str
    slug: str
    description: Optional[str] = None
    property_type: str
    listing_type: str
    status: str
    price: Decimal
    currency: str
    area_sqft: Optional[Decimal] = None
    bedrooms: Optional[int] = None
    bathrooms: Optional[int] = None
    city: str
    locality: str
    address: Optional[str] = None
    features: Optional[Any] = None
    meta_json: Optional[Any] = None
    created_by_user_id: Optional[uuid.UUID] = None
    assigned_agent_id: Optional[uuid.UUID] = None
    published_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    images: List[PropertyImageResponse] = []
    documents: List[PropertyDocumentResponse] = []


class PaginatedPropertiesResponse(BaseModel):
    items: List[PropertyResponse]
    total: int
    page: int
    size: int
    pages: int
