"""Database Seeding Script for EstateFlow AI (Fictional Pakistani Real Estate Data)."""

import asyncio
from decimal import Decimal
from datetime import datetime, timezone
import uuid
import sys
import os

# Add parent dir to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.database import AsyncSessionLocal
from app.auth.security import hash_password
from app.models.user import User
from app.models.organization import Organization
from app.models.membership import Membership
from app.models.property import Property
from app.models.property_image import PropertyImage
from app.models.property_document import PropertyDocument


async def seed():
    print("Starting database seeding...")
    async with AsyncSessionLocal() as session:
        # Check if already seeded
        from sqlalchemy import select
        existing_org = await session.execute(
            select(Organization).where(Organization.slug == "al-rehman-real-estate")
        )
        if existing_org.scalar_one_or_none():
            print("Database already seeded with Al-Rehman Real Estate org. Skipping.")
            return

        # 1. Create Organization
        org = Organization(
            name="Al-Rehman Real Estate",
            slug="al-rehman-real-estate",
            is_active=True,
        )
        session.add(org)
        await session.flush()

        # 2. Create Users
        owner_user = User(
            email="admin@alrehman.com",
            hashed_password=hash_password("Admin123!"),
            first_name="Tariq",
            last_name="Rehman",
            phone="+923001234567",
            is_active=True,
            is_superuser=True,
            is_email_verified=True,
        )
        agent_user = User(
            email="agent@alrehman.com",
            hashed_password=hash_password("Agent123!"),
            first_name="Zain",
            last_name="Malik",
            phone="+923219876543",
            is_active=True,
            is_superuser=False,
            is_email_verified=True,
        )
        viewer_user = User(
            email="viewer@alrehman.com",
            hashed_password=hash_password("Viewer123!"),
            first_name="Sara",
            last_name="Khan",
            phone="+923335557788",
            is_active=True,
            is_superuser=False,
            is_email_verified=True,
        )
        session.add_all([owner_user, agent_user, viewer_user])
        await session.flush()

        # 3. Create Memberships
        m1 = Membership(user_id=owner_user.id, organization_id=org.id, role="owner", is_active=True)
        m2 = Membership(user_id=agent_user.id, organization_id=org.id, role="agent", is_active=True)
        m3 = Membership(user_id=viewer_user.id, organization_id=org.id, role="viewer", is_active=True)
        session.add_all([m1, m2, m3])
        await session.flush()

        # 4. Create Properties
        properties_data = [
            {
                "title": "1 Kanal Luxury Designer Villa",
                "slug": "1-kanal-luxury-designer-villa-lh01",
                "description": "Stunning brand new 1 Kanal Spanish architecture villa featuring imported Italian marble floors, swimming pool, basement cinema, and smart automation.",
                "property_type": "villa",
                "listing_type": "sale",
                "status": "published",
                "price": Decimal("85000000.00"),
                "currency": "PKR",
                "area_sqft": Decimal("4500.00"),
                "bedrooms": 5,
                "bathrooms": 6,
                "city": "Lahore",
                "locality": "DHA Phase 6, Block MB",
                "address": "House 142, Block MB, DHA Phase 6",
                "features": ["Swimming Pool", "Smart Home", "Basement Cinema", "Central AC", "Solar Powered"],
                "meta_json": {"corner_plot": True, "facing_park": True},
                "assigned_agent_id": agent_user.id,
                "published_at": datetime.now(timezone.utc),
            },
            {
                "title": "Modern Executive Apartment in E-11",
                "slug": "modern-executive-apartment-e11-isb02",
                "description": "Spacious 3 bedroom luxury apartment on 8th floor with panoramic Margalla Hills view. High speed elevators, 24/7 security & backup generator.",
                "property_type": "apartment",
                "listing_type": "sale",
                "status": "published",
                "price": Decimal("24000000.00"),
                "currency": "PKR",
                "area_sqft": Decimal("2100.00"),
                "bedrooms": 3,
                "bathrooms": 3,
                "city": "Islamabad",
                "locality": "Sector E-11/2",
                "address": "Flat 804, Fortune Heights, E-11/2",
                "features": ["Margalla View", "Backup Generator", "Reserved Parking", "High Speed Elevator"],
                "meta_json": {"floor_number": 8, "total_floors": 14},
                "assigned_agent_id": agent_user.id,
                "published_at": datetime.now(timezone.utc),
            },
            {
                "title": "Commercial Plot Main Main Boulevard Gulberg",
                "slug": "commercial-plot-gulberg-lh03",
                "description": "Prime commercial land suitable for high-rise commercial plaza or corporate headquarters. Approved RDA plaza layout.",
                "property_type": "commercial",
                "listing_type": "sale",
                "status": "published",
                "price": Decimal("120000000.00"),
                "currency": "PKR",
                "area_sqft": Decimal("2250.00"),
                "bedrooms": 0,
                "bathrooms": 0,
                "city": "Lahore",
                "locality": "Gulberg III",
                "address": "Plot 18, Main Boulevard, Gulberg III",
                "features": ["Main Road Facing", "Commercial LDA Approved", "Corner Plot"],
                "meta_json": {"frontage_ft": 45},
                "assigned_agent_id": owner_user.id,
                "published_at": datetime.now(timezone.utc),
            },
            {
                "title": "Sea Facing Luxury Studio Flat Clifton",
                "slug": "sea-facing-studio-clifton-khi04",
                "description": "Furnished sea-facing studio apartment in Clifton Block 5. Ideal for corporate rentals or executive living.",
                "property_type": "apartment",
                "listing_type": "rent",
                "status": "draft",
                "price": Decimal("185000.00"),
                "currency": "PKR",
                "area_sqft": Decimal("850.00"),
                "bedrooms": 1,
                "bathrooms": 1,
                "city": "Karachi",
                "locality": "Clifton Block 5",
                "address": "Tower B, Ocean Towers, Clifton",
                "features": ["Sea View", "Fully Furnished", "Gym Access"],
                "meta_json": {"monthly_rent": True},
                "assigned_agent_id": agent_user.id,
                "published_at": None,
            },
        ]

        for pdata in properties_data:
            p = Property(
                organization_id=org.id,
                created_by_user_id=owner_user.id,
                **pdata,
            )
            session.add(p)
            await session.flush()

            # Add sample image record
            img = PropertyImage(
                property_id=p.id,
                storage_path=f"{org.id}/{p.id}/images/cover.jpg",
                file_name="cover.jpg",
                mime_type="image/jpeg",
                file_size_bytes=1024000,
                is_cover=True,
                display_order=0,
            )
            doc = PropertyDocument(
                property_id=p.id,
                storage_path=f"{org.id}/{p.id}/documents/title_deed/deed.pdf",
                file_name="title_deed.pdf",
                document_type="title_deed",
                mime_type="application/pdf",
                file_size_bytes=2048000,
            )
            session.add_all([img, doc])

        await session.commit()
        print("Database seeding completed successfully!")
        print("Demo Credentials Created:")
        print("  Owner: admin@alrehman.com / Admin123!")
        print("  Agent: agent@alrehman.com / Agent123!")
        print("  Viewer: viewer@alrehman.com / Viewer123!")


if __name__ == "__main__":
    asyncio.run(seed())
