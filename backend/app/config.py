"""Configuration module using pydantic-settings."""

import os
from typing import List, Union
from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=True,
    )

    ENVIRONMENT: str = "development"
    APP_NAME: str = "EstateFlow API"
    APP_VERSION: str = "0.1.0"

    # Database
    DATABASE_URL: str
    DATABASE_SYNC_URL: str

    # JWT
    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"
    JWT_ISSUER: str = "estateflow-api"
    JWT_AUDIENCE: str = "estateflow-client"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 30

    # CORS
    CORS_ORIGINS: Union[str, List[str]] = "http://localhost:3000,http://localhost:3001"

    # Supabase Credentials
    SUPABASE_URL: str
    SUPABASE_SERVICE_ROLE_KEY: str

    # Supabase Buckets
    SUPABASE_IMAGES_BUCKET: str = "property-images"
    SUPABASE_DOCUMENTS_BUCKET: str = "property-documents"
    SIGNED_URL_EXPIRE_SECONDS: int = 900

    MAX_IMAGE_SIZE_MB: int = 10
    MAX_DOCUMENT_SIZE_MB: int = 20

    ALLOWED_IMAGE_TYPES: Union[str, List[str]] = "image/jpeg,image/png,image/webp"
    ALLOWED_DOCUMENT_TYPES: Union[str, List[str]] = "application/pdf,text/csv,application/vnd.openxmlformats-officedocument.wordprocessingml.document"

    LOG_LEVEL: str = "INFO"

    @field_validator("CORS_ORIGINS", mode="before")
    def parse_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(",") if origin.strip()]
        return v

    @field_validator("ALLOWED_IMAGE_TYPES", mode="before")
    def parse_image_types(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str):
            return [t.strip() for t in v.split(",") if t.strip()]
        return v

    @field_validator("ALLOWED_DOCUMENT_TYPES", mode="before")
    def parse_doc_types(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str):
            return [t.strip() for t in v.split(",") if t.strip()]
        return v


settings = Settings()
