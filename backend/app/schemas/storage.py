"""Storage, Property Images, and Property Documents Pydantic Schemas."""

from datetime import datetime
from typing import Optional
import uuid
from pydantic import BaseModel, ConfigDict


class PropertyImageResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    property_id: uuid.UUID
    storage_path: str
    file_name: str
    mime_type: str
    file_size_bytes: int
    is_cover: bool
    display_order: int
    signed_url: Optional[str] = None
    created_at: datetime


class PropertyDocumentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    property_id: uuid.UUID
    storage_path: str
    file_name: str
    document_type: str
    mime_type: str
    file_size_bytes: int
    signed_url: Optional[str] = None
    created_at: datetime


class SignedUrlResponse(BaseModel):
    storage_path: str
    signed_url: str
    expires_in_seconds: int
