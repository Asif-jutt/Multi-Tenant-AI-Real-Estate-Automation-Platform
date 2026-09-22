"""Property Media, Images & Documents Storage API Router."""

from typing import List, Tuple
import uuid
from fastapi import APIRouter, Depends, File, Form, HTTPException, Request, UploadFile, status
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.config import settings
from app.common.permissions import get_current_user, get_current_org_context, require_role
from app.models.user import User
from app.models.organization import Organization
from app.models.membership import Membership
from app.models.property import Property
from app.models.property_image import PropertyImage
from app.models.property_document import PropertyDocument
from app.schemas.storage import PropertyImageResponse, PropertyDocumentResponse
from app.services.storage_service import storage_service
from app.services.audit_service import AuditLogService

router = APIRouter(prefix="/api/v1/properties", tags=["Media & Storage"])


@router.post("/{property_id}/images", response_model=PropertyImageResponse, status_code=status.HTTP_201_CREATED)
async def upload_property_image(
    property_id: uuid.UUID,
    file: UploadFile = File(...),
    is_cover: bool = Form(False),
    request: Request = None,
    org_context: Tuple[Organization, str, Membership] = Depends(require_role("agent")),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Upload property photo/image to private Supabase bucket and record metadata."""
    org, _, _ = org_context

    # Verify property belongs to organization
    prop_stmt = select(Property).where(Property.id == property_id, Property.organization_id == org.id)
    prop_res = await db.execute(prop_stmt)
    prop = prop_res.scalar_one_or_none()

    if not prop:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Property listing not found",
        )

    # Perform upload to Supabase Storage
    storage_res = await storage_service.upload_property_image(
        organization_id=org.id,
        property_id=property_id,
        file=file,
    )

    # Determine display order
    order_stmt = select(PropertyImage).where(PropertyImage.property_id == property_id)
    existing_imgs = await db.execute(order_stmt)
    display_order = len(list(existing_imgs.scalars().all()))

    # If first image or requested cover, handle cover logic
    if display_order == 0:
        is_cover = True

    if is_cover:
        # Reset previous cover images
        await db.execute(
            update(PropertyImage)
            .where(PropertyImage.property_id == property_id)
            .values(is_cover=False)
        )

    db_image = PropertyImage(
        property_id=property_id,
        storage_path=storage_res["storage_path"],
        file_name=storage_res["file_name"],
        mime_type=storage_res["mime_type"],
        file_size_bytes=storage_res["file_size_bytes"],
        is_cover=is_cover,
        display_order=display_order,
    )
    db.add(db_image)
    await db.commit()
    await db.refresh(db_image)

    signed_url = storage_service.get_signed_url(
        bucket=settings.SUPABASE_IMAGES_BUCKET,
        storage_path=db_image.storage_path,
    )

    resp = PropertyImageResponse.model_validate(db_image)
    resp.signed_url = signed_url

    await AuditLogService.log_event(
        db=db,
        action="property.image_upload",
        resource_type="property_image",
        resource_id=str(db_image.id),
        organization_id=org.id,
        actor_user_id=current_user.id,
        payload={"file_name": db_image.file_name, "size": db_image.file_size_bytes},
        request=request,
    )

    return resp


@router.patch("/{property_id}/images/{image_id}/cover", response_model=PropertyImageResponse)
async def set_cover_image(
    property_id: uuid.UUID,
    image_id: uuid.UUID,
    org_context: Tuple[Organization, str, Membership] = Depends(require_role("agent")),
    db: AsyncSession = Depends(get_db),
):
    """Set specified image as the cover image for a property."""
    org, _, _ = org_context

    prop_stmt = select(Property).where(Property.id == property_id, Property.organization_id == org.id)
    if not (await db.execute(prop_stmt)).scalar_one_or_none():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Property not found")

    img_stmt = select(PropertyImage).where(PropertyImage.id == image_id, PropertyImage.property_id == property_id)
    target_img = (await db.execute(img_stmt)).scalar_one_or_none()

    if not target_img:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Property image not found")

    await db.execute(
        update(PropertyImage).where(PropertyImage.property_id == property_id).values(is_cover=False)
    )
    target_img.is_cover = True
    await db.commit()
    await db.refresh(target_img)

    resp = PropertyImageResponse.model_validate(target_img)
    resp.signed_url = storage_service.get_signed_url(
        bucket=settings.SUPABASE_IMAGES_BUCKET,
        storage_path=target_img.storage_path,
    )
    return resp


@router.delete("/{property_id}/images/{image_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_property_image(
    property_id: uuid.UUID,
    image_id: uuid.UUID,
    request: Request,
    org_context: Tuple[Organization, str, Membership] = Depends(require_role("agent")),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Delete property image from DB and Supabase Storage bucket."""
    org, _, _ = org_context

    prop_stmt = select(Property).where(Property.id == property_id, Property.organization_id == org.id)
    if not (await db.execute(prop_stmt)).scalar_one_or_none():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Property not found")

    img_stmt = select(PropertyImage).where(PropertyImage.id == image_id, PropertyImage.property_id == property_id)
    target_img = (await db.execute(img_stmt)).scalar_one_or_none()

    if not target_img:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Property image not found")

    storage_service.delete_file(settings.SUPABASE_IMAGES_BUCKET, target_img.storage_path)

    await db.delete(target_img)
    await db.commit()

    await AuditLogService.log_event(
        db=db,
        action="property.image_delete",
        resource_type="property_image",
        resource_id=str(image_id),
        organization_id=org.id,
        actor_user_id=current_user.id,
        request=request,
    )


@router.post("/{property_id}/documents", response_model=PropertyDocumentResponse, status_code=status.HTTP_201_CREATED)
async def upload_property_document(
    property_id: uuid.UUID,
    document_type: str = Form(..., description="title_deed, NOC, tax_record, floor_plan, contract"),
    file: UploadFile = File(...),
    request: Request = None,
    org_context: Tuple[Organization, str, Membership] = Depends(require_role("agent")),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Upload legal or technical property document to private Supabase bucket."""
    org, _, _ = org_context

    prop_stmt = select(Property).where(Property.id == property_id, Property.organization_id == org.id)
    if not (await db.execute(prop_stmt)).scalar_one_or_none():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Property not found")

    storage_res = await storage_service.upload_property_document(
        organization_id=org.id,
        property_id=property_id,
        document_type=document_type.lower().strip(),
        file=file,
    )

    db_doc = PropertyDocument(
        property_id=property_id,
        storage_path=storage_res["storage_path"],
        file_name=storage_res["file_name"],
        document_type=storage_res["document_type"],
        mime_type=storage_res["mime_type"],
        file_size_bytes=storage_res["file_size_bytes"],
    )
    db.add(db_doc)
    await db.commit()
    await db.refresh(db_doc)

    signed_url = storage_service.get_signed_url(
        bucket=settings.SUPABASE_DOCUMENTS_BUCKET,
        storage_path=db_doc.storage_path,
    )

    resp = PropertyDocumentResponse.model_validate(db_doc)
    resp.signed_url = signed_url

    await AuditLogService.log_event(
        db=db,
        action="property.document_upload",
        resource_type="property_document",
        resource_id=str(db_doc.id),
        organization_id=org.id,
        actor_user_id=current_user.id,
        payload={"file_name": db_doc.file_name, "document_type": db_doc.document_type},
        request=request,
    )

    return resp


@router.delete("/{property_id}/documents/{document_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_property_document(
    property_id: uuid.UUID,
    document_id: uuid.UUID,
    request: Request,
    org_context: Tuple[Organization, str, Membership] = Depends(require_role("agent")),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Delete property document from DB and Supabase Storage bucket."""
    org, _, _ = org_context

    doc_stmt = select(PropertyDocument).where(
        PropertyDocument.id == document_id, PropertyDocument.property_id == property_id
    )
    target_doc = (await db.execute(doc_stmt)).scalar_one_or_none()

    if not target_doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found")

    storage_service.delete_file(settings.SUPABASE_DOCUMENTS_BUCKET, target_doc.storage_path)

    await db.delete(target_doc)
    await db.commit()

    await AuditLogService.log_event(
        db=db,
        action="property.document_delete",
        resource_type="property_document",
        resource_id=str(document_id),
        organization_id=org.id,
        actor_user_id=current_user.id,
        request=request,
    )
