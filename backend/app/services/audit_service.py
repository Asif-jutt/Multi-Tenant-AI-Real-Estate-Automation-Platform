"""Audit Logging Service for compliance and activity tracking."""

from typing import Optional, Any, Dict
import uuid
from fastapi import Request
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.audit_log import AuditLog
from app.logging_config import logger

SENSITIVE_KEYS = {"password", "token", "secret", "refresh_token", "access_token", "hashed_password"}


def redact_sensitive_data(data: Any) -> Any:
    """Recursively redact sensitive key values from audit payload logs."""
    if isinstance(data, dict):
        cleaned = {}
        for k, v in data.items():
            if k.lower() in SENSITIVE_KEYS:
                cleaned[k] = "[REDACTED]"
            else:
                cleaned[k] = redact_sensitive_data(v)
        return cleaned
    elif isinstance(data, list):
        return [redact_sensitive_data(item) for item in data]
    return data


class AuditLogService:
    @staticmethod
    async def log_event(
        db: AsyncSession,
        action: str,
        resource_type: str,
        resource_id: Optional[str] = None,
        organization_id: Optional[uuid.UUID] = None,
        actor_user_id: Optional[uuid.UUID] = None,
        payload: Optional[Dict[str, Any]] = None,
        request: Optional[Request] = None,
    ) -> AuditLog:
        ip_address = None
        user_agent = None

        if request:
            ip_address = request.client.host if request.client else None
            user_agent = request.headers.get("user-agent")

        clean_payload = redact_sensitive_data(payload) if payload else None

        audit_entry = AuditLog(
            organization_id=organization_id,
            actor_user_id=actor_user_id,
            action=action,
            resource_type=resource_type,
            resource_id=resource_id,
            payload=clean_payload,
            ip_address=ip_address,
            user_agent=user_agent[:255] if user_agent else None,
        )

        db.add(audit_entry)
        await db.commit()
        await db.refresh(audit_entry)

        logger.info(
            "audit_event",
            action=action,
            resource_type=resource_type,
            resource_id=resource_id,
            org_id=str(organization_id) if organization_id else None,
            user_id=str(actor_user_id) if actor_user_id else None,
        )

        return audit_entry
