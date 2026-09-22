"""FastAPI Application Main Entry Point for EstateFlow AI Backend."""

from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import settings
from app.logging_config import configure_logging, logger
from app.database import check_db_health
from app.routers import (
    auth_router,
    organization_router,
    property_router,
    storage_router,
    audit_router,
    invitation_router,
    platform_router,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    configure_logging()
    logger.info("estateflow_api_startup", version=settings.APP_VERSION, env=settings.ENVIRONMENT)
    yield
    logger.info("estateflow_api_shutdown")


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Multi-tenant Real Estate Operations Platform Backend API",
    lifespan=lifespan,
    docs_url="/docs" if settings.ENVIRONMENT == "development" else None,
    redoc_url="/redoc" if settings.ENVIRONMENT == "development" else None,
)

# CORS Middleware Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS if isinstance(settings.CORS_ORIGINS, list) else [settings.CORS_ORIGINS],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Exception Handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error("unhandled_exception", path=request.url.path, error=str(exc))
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "An internal server error occurred. Please try again later."},
    )

# Include Routers
app.include_router(auth_router.router)
app.include_router(organization_router.router)
app.include_router(property_router.router)
app.include_router(storage_router.router)
app.include_router(audit_router.router)
app.include_router(invitation_router.router)
app.include_router(platform_router.router)


@app.get("/health/live", tags=["Health"])
async def liveness_probe():
    """Liveness probe indicating application container is running."""
    return {
        "status": "alive",
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "ai_enabled": False,
        "ai_status": "not_implemented",
        "future_integrations": [],
    }


@app.get("/health/ready", tags=["Health"])
async def readiness_probe():
    """Readiness probe checking database connectivity."""
    db_ok = await check_db_health()
    if not db_ok:
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content={"status": "unhealthy", "database": "disconnected"},
        )
    return {
        "status": "ready",
        "database": "connected",
        "ai_enabled": False,
        "ai_status": "not_implemented",
        "future_integrations": [],
    }
