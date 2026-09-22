"""Supabase Storage Service for secure file uploads and signed URL generation."""

from typing import Optional, Dict, Any
import uuid
from fastapi import HTTPException, UploadFile, status
from supabase import create_client, Client
from app.config import settings
from app.logging_config import logger


class SupabaseStorageService:
    def __init__(self):
        self.url = settings.SUPABASE_URL
        self.key = settings.SUPABASE_SERVICE_ROLE_KEY
        self.client: Client = create_client(self.url, self.key)
        self.images_bucket = settings.SUPABASE_IMAGES_BUCKET
        self.documents_bucket = settings.SUPABASE_DOCUMENTS_BUCKET

    async def upload_property_image(
        self,
        organization_id: uuid.UUID,
        property_id: uuid.UUID,
        file: UploadFile,
    ) -> Dict[str, Any]:
        """
        Upload property image to private Supabase Storage bucket.
        Validates mime type and file size.
        """
        # Validate MIME
        if file.content_type not in settings.ALLOWED_IMAGE_TYPES:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid image content-type '{file.content_type}'. Allowed: {settings.ALLOWED_IMAGE_TYPES}",
            )

        content = await file.read()
        file_size_bytes = len(content)
        max_bytes = settings.MAX_IMAGE_SIZE_MB * 1024 * 1024

        if file_size_bytes > max_bytes:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Image file exceeds maximum limit of {settings.MAX_IMAGE_SIZE_MB}MB",
            )

        ext = file.filename.split(".")[-1] if "." in file.filename else "jpg"
        unique_filename = f"{uuid.uuid4().hex}.{ext}"
        storage_path = f"{organization_id}/{property_id}/images/{unique_filename}"

        try:
            res = self.client.storage.from_(self.images_bucket).upload(
                path=storage_path,
                file=content,
                file_options={"content-type": file.content_type, "x-upsert": "true"},
            )
        except Exception as e:
            logger.error("supabase_storage_image_upload_failed", error=str(e), path=storage_path)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Storage upload failed: {str(e)}",
            )

        return {
            "storage_path": storage_path,
            "file_name": file.filename,
            "mime_type": file.content_type,
            "file_size_bytes": file_size_bytes,
        }

    async def upload_property_document(
        self,
        organization_id: uuid.UUID,
        property_id: uuid.UUID,
        document_type: str,
        file: UploadFile,
    ) -> Dict[str, Any]:
        """
        Upload property document to private Supabase Storage bucket.
        """
        if file.content_type not in settings.ALLOWED_DOCUMENT_TYPES:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid document content-type '{file.content_type}'. Allowed: {settings.ALLOWED_DOCUMENT_TYPES}",
            )

        content = await file.read()
        file_size_bytes = len(content)
        max_bytes = settings.MAX_DOCUMENT_SIZE_MB * 1024 * 1024

        if file_size_bytes > max_bytes:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Document file exceeds maximum limit of {settings.MAX_DOCUMENT_SIZE_MB}MB",
            )

        ext = file.filename.split(".")[-1] if "." in file.filename else "pdf"
        unique_filename = f"{uuid.uuid4().hex}.{ext}"
        storage_path = f"{organization_id}/{property_id}/documents/{document_type}/{unique_filename}"

        try:
            res = self.client.storage.from_(self.documents_bucket).upload(
                path=storage_path,
                file=content,
                file_options={"content-type": file.content_type, "x-upsert": "true"},
            )
        except Exception as e:
            logger.error("supabase_storage_doc_upload_failed", error=str(e), path=storage_path)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Document storage upload failed: {str(e)}",
            )

        return {
            "storage_path": storage_path,
            "file_name": file.filename,
            "document_type": document_type,
            "mime_type": file.content_type,
            "file_size_bytes": file_size_bytes,
        }

    def get_signed_url(
        self,
        bucket: str,
        storage_path: str,
        expires_in: int = settings.SIGNED_URL_EXPIRE_SECONDS,
    ) -> str:
        """Generate short-lived signed URL for private bucket file access."""
        try:
            res = self.client.storage.from_(bucket).create_signed_url(
                path=storage_path, expires_in=expires_in
            )
            if isinstance(res, dict) and "signedUrl" in res:
                return res["signedUrl"]
            elif hasattr(res, "signed_url"):
                return res.signed_url
            elif isinstance(res, dict) and "signed_url" in res:
                return res["signed_url"]
            return str(res)
        except Exception as e:
            logger.warning("create_signed_url_warning", error=str(e), path=storage_path)
            return ""

    def delete_file(self, bucket: str, storage_path: str) -> bool:
        """Delete file from Supabase Storage bucket."""
        try:
            self.client.storage.from_(bucket).remove([storage_path])
            return True
        except Exception as e:
            logger.error("delete_storage_file_failed", error=str(e), path=storage_path)
            return False


storage_service = SupabaseStorageService()
