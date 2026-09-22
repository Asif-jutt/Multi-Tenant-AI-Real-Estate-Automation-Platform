"""Integration tests for Property Management & Tenant Isolation."""

import uuid
import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_property_crud_and_tenant_isolation(client: AsyncClient):
    suffix1 = uuid.uuid4().hex[:6]
    suffix2 = uuid.uuid4().hex[:6]

    # 1. Register Org 1 User
    user1_reg = await client.post(
        "/api/v1/auth/register",
        json={
            "email": f"org1agent_{suffix1}@estateflow.com",
            "password": "Password123!",
            "first_name": "Org1",
            "last_name": "Agent",
            "organization_name": f"Prime Realty {suffix1}",
        },
    )
    assert user1_reg.status_code == 201
    token1 = user1_reg.json()["access_token"]
    headers1 = {"Authorization": f"Bearer {token1}"}

    # 2. Register Org 2 User
    user2_reg = await client.post(
        "/api/v1/auth/register",
        json={
            "email": f"org2agent_{suffix2}@estateflow.com",
            "password": "Password123!",
            "first_name": "Org2",
            "last_name": "Agent",
            "organization_name": f"Apex Properties {suffix2}",
        },
    )
    assert user2_reg.status_code == 201
    token2 = user2_reg.json()["access_token"]
    headers2 = {"Authorization": f"Bearer {token2}"}

    # 3. Create property in Org 1
    create_prop_resp = await client.post(
        "/api/v1/properties",
        headers=headers1,
        json={
            "title": f"Prime Commercial Plaza {suffix1}",
            "property_type": "commercial",
            "listing_type": "sale",
            "price": 50000000.00,
            "city": "Lahore",
            "locality": "Gulberg",
            "bedrooms": 0,
            "bathrooms": 2,
        },
    )
    assert create_prop_resp.status_code == 201
    prop1 = create_prop_resp.json()
    prop1_id = prop1["id"]

    # 4. Org 1 searches and finds property
    search_org1 = await client.get("/api/v1/properties?city=Lahore", headers=headers1)
    assert search_org1.status_code == 200
    assert search_org1.json()["total"] >= 1

    # 5. Org 2 searches and CANNOT see Org 1 property (Tenant Isolation)
    search_org2 = await client.get("/api/v1/properties?city=Lahore", headers=headers2)
    assert search_org2.status_code == 200
    org2_ids = [p["id"] for p in search_org2.json()["items"]]
    assert prop1_id not in org2_ids

    # 6. Direct access attempt by Org 2 should fail with 404 Not Found
    direct_get = await client.get(f"/api/v1/properties/{prop1_id}", headers=headers2)
    assert direct_get.status_code == 404
