"""Organization and Membership Pydantic Schemas."""

from datetime import datetime
from typing import Optional, List
import uuid
from pydantic import BaseModel, EmailStr, Field, ConfigDict
from app.schemas.auth import UserResponse


class OrganizationCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=255)
    slug: Optional[str] = Field(None, max_length=100)


class OrganizationUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=255)
    slug: Optional[str] = Field(None, max_length=100)
    is_active: Optional[bool] = None


class OrganizationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    name: str
    slug: str
    is_active: bool
    created_at: datetime
    updated_at: datetime


class MembershipResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    user_id: uuid.UUID
    organization_id: uuid.UUID
    role: str
    is_active: bool
    created_at: datetime
    user: Optional[UserResponse] = None


class AddMemberRequest(BaseModel):
    email: EmailStr
    role: str = Field("agent", description="Role: owner, admin, agent, viewer")


class UpdateRoleRequest(BaseModel):
    role: str = Field(..., description="Role: owner, admin, agent, viewer")
