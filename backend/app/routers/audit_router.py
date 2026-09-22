"""Audit Logs API Router."""

from typing import Optional, List, Tuple
from math import ceil
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy import select, func, desc
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.common.permissions import get_current_org_context, require_role
from app.models.organization import Organization
from app.models.membership import Membership
from app.models.audit_log import AuditLog
from app.schemas.audit_log import AuditLogResponse, PaginatedAuditLogsResponse

router = APIRouter(prefix="/api/v1/audit-logs", tags=["Audit Logs"])


@router.get("", response_model=PaginatedAuditLogsResponse)
async def list_audit_logs(
    action: Optional[str] = Query(None, description="Filter by action name"),
    resource_type: Optional[str] = Query(None, description="Filter by resource type"),
    page: int = Query(1, ge=1),
    size: int = Query(50, ge=1, le=200),
    org_context: Tuple[Organization, str, Membership] = Depends(require_role("admin")),
    db: AsyncSession = Depends(get_db),
):
    """Retrieve tenant audit trail for security and activity tracking (Admin/Owner only)."""
    org, _, _ = org_context

    stmt = select(AuditLog).where(AuditLog.organization_id == org.id)

    if action:
        stmt = stmt.where(AuditLog.action.ilike(f"%{action.strip()}%"))
    if resource_type:
        stmt = stmt.where(AuditLog.resource_type.ilike(f"%{resource_type.strip()}%"))

    # Count total
    count_stmt = select(func.count()).select_from(stmt.subquery())
    total_res = await db.execute(count_stmt)
    total = total_res.scalar_one() or 0

    # Paginate
    offset = (page - 1) * size
    stmt = stmt.order_by(desc(AuditLog.created_at)).offset(offset).limit(size)

    results = await db.execute(stmt)
    items = list(results.scalars().all())

    pages = ceil(total / size) if total > 0 else 0

    return PaginatedAuditLogsResponse(
        items=[AuditLogResponse.model_validate(item) for item in items],
        total=total,
        page=page,
        size=size,
        pages=pages,
    )
