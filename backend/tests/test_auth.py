"""Integration tests for Authentication API endpoints."""

import uuid
import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_register_and_login_flow(client: AsyncClient):
    unique_suffix = uuid.uuid4().hex[:6]
    test_email = f"testuser_{unique_suffix}@estateflow.com"
    test_password = "SecurePassword123!"

    # 1. Register new user + organization
    reg_payload = {
        "email": test_email,
        "password": test_password,
        "first_name": "Test",
        "last_name": "User",
        "phone": "+923000000000",
        "organization_name": f"Agency {unique_suffix}",
    }
    reg_resp = await client.post("/api/v1/auth/register", json=reg_payload)
    assert reg_resp.status_code == 201
    data = reg_resp.json()
    assert "access_token" in data
    assert "refresh_token" in data

    access_token = data["access_token"]
    refresh_token = data["refresh_token"]

    # 2. Get profile with access token
    me_resp = await client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {access_token}"},
    )
    assert me_resp.status_code == 200
    user_data = me_resp.json()
    assert user_data["email"] == test_email
    assert len(user_data["memberships"]) == 1
    assert user_data["memberships"][0]["role"] == "owner"

    # 3. Test refresh token endpoint
    refresh_resp = await client.post(
        "/api/v1/auth/refresh",
        json={"refresh_token": refresh_token},
    )
    assert refresh_resp.status_code == 200
    new_tokens = refresh_resp.json()
    assert "access_token" in new_tokens
    assert new_tokens["access_token"] != access_token

    # 4. Login endpoint
    login_resp = await client.post(
        "/api/v1/auth/login",
        json={
            "email": test_email,
            "password": test_password,
        },
    )
    assert login_resp.status_code == 200
    login_data = login_resp.json()
    assert "access_token" in login_data
