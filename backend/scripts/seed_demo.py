"""Database Seeding Script for EstateFlow AI (Single Agency Seed: asifhussain5115@gmail.com / 11111111)."""

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
        from sqlalchemy import select
        existing_user = await session.execute(
            select(User).where(User.email == "asifhussain5115@gmail.com")
        )
        if existing_user.scalar_one_or_none():
            print("Database user 'asifhussain5115@gmail.com' already exists.")
            return

        # 1. Create Primary Agency Organization
        org = Organization(
            name="EstateFlow Prime Real Estate",
            slug="estateflow-prime-real-estate",
            is_active=True,
        )
        session.add(org)
        await session.flush()

        # 2. Create Owner User
        owner_user = User(
            email="asifhussain5115@gmail.com",
            hashed_password=hash_password("11111111"),
            first_name="Asif",
            last_name="Hussain",
            phone="+923001234567",
            is_active=True,
            is_superuser=True,
            is_email_verified=True,
        )
        session.add(owner_user)
        await session.flush()

        # 3. Create Ownership Membership
        m1 = Membership(user_id=owner_user.id, organization_id=org.id, role="owner", is_active=True)
        session.add(m1)
        await session.flush()

        # 4. Create 20 Verified Properties
        properties_data = [
            {
                "title": "Modern 3-Bedroom Luxury Apartment",
                "slug": "modern-3bed-luxury-apartment-gulberg",
                "description": "Corner 3-bedroom apartment with panoramic skyline views, modern kitchen fittings, 24/7 power backup, and basement parking.",
                "property_type": "apartment",
                "listing_type": "sale",
                "status": "published",
                "price": Decimal("24500000.00"),
                "currency": "PKR",
                "area_sqft": Decimal("1850.00"),
                "bedrooms": 3,
                "bathrooms": 3,
                "city": "Lahore",
                "locality": "Gulberg III, Near MM Alam Road",
                "address": "Tower 4, Gulberg Heights, MM Alam Road",
                "features": ["Elevator", "24/7 Security", "Power Backup Generator", "Covered Parking"],
            },
            {
                "title": "1 Kanal Brand New Designer House",
                "slug": "1-kanal-brand-new-designer-house-dha6",
                "description": "Architecturally designed double-story house in Phase 6 DHA, featuring imported marble flooring, 5 master beds, swimming pool, and solar system.",
                "property_type": "house",
                "listing_type": "sale",
                "status": "published",
                "price": Decimal("88000000.00"),
                "currency": "PKR",
                "area_sqft": Decimal("4500.00"),
                "bedrooms": 5,
                "bathrooms": 6,
                "city": "Lahore",
                "locality": "DHA Phase 6",
                "address": "House 142, Sector MB, DHA Phase 6",
                "features": ["Swimming Pool", "Solar System", "Servant Quarters", "Lawn"],
            },
            {
                "title": "Executive Office Suite in Blue Area",
                "slug": "executive-office-suite-blue-area",
                "description": "Fully furnished commercial office space in prime Blue Area Islamabad with high-speed elevator access, fiber internet, and executive meeting room.",
                "property_type": "commercial",
                "listing_type": "sale",
                "status": "published",
                "price": Decimal("38000000.00"),
                "currency": "PKR",
                "area_sqft": Decimal("2100.00"),
                "bedrooms": 0,
                "bathrooms": 2,
                "city": "Islamabad",
                "locality": "Blue Area",
                "address": "Floor 7, Prime Tower, Blue Area",
                "features": ["Central Air Conditioning", "High Speed Elevators", "CCTV Monitoring"],
            },
            {
                "title": "Sea Facing 4-Bed Flat in Clifton Block 4",
                "slug": "sea-facing-4bed-flat-clifton",
                "description": "Spacious sea-view apartment with large balcony, renovated interiors, dedicated water filtration plant, and secure complex entry.",
                "property_type": "apartment",
                "listing_type": "sale",
                "status": "published",
                "price": Decimal("49000000.00"),
                "currency": "PKR",
                "area_sqft": Decimal("2800.00"),
                "bedrooms": 4,
                "bathrooms": 4,
                "city": "Karachi",
                "locality": "Clifton Block 4",
                "address": "Ocean Heights, Clifton Block 4",
                "features": ["Sea View", "Balcony", "RO Water Plant", "Reserved Parking"],
            },
            {
                "title": "10 Marla Mediterranean Villa in Bahria Town",
                "slug": "10-marla-mediterranean-villa-bahria",
                "description": "Beautiful 10 Marla Spanish elevation house in Sector C Bahria Town, near commercial hub and Grand Mosque.",
                "property_type": "house",
                "listing_type": "sale",
                "status": "published",
                "price": Decimal("36000000.00"),
                "currency": "PKR",
                "area_sqft": Decimal("3100.00"),
                "bedrooms": 4,
                "bathrooms": 5,
                "city": "Lahore",
                "locality": "Bahria Town Sector C",
                "address": "Street 12, Sector C, Bahria Town",
                "features": ["Gated Community", "24/7 Security Patrol", "Near Mosque"],
            },
            {
                "title": "2 Bed Smart Apartment in Gulberg Greens",
                "slug": "2-bed-smart-apartment-gulberg-greens",
                "description": "Modern luxury 2-bed apartment in high-rise tower at Gulberg Greens with scenic Margalla hill views.",
                "property_type": "apartment",
                "listing_type": "sale",
                "status": "published",
                "price": Decimal("18500000.00"),
                "currency": "PKR",
                "area_sqft": Decimal("1350.00"),
                "bedrooms": 2,
                "bathrooms": 2,
                "city": "Islamabad",
                "locality": "Gulberg Greens",
                "address": "Gulberg Heights, Executive Block",
                "features": ["Hill View", "Smart Locks", "Gym", "Covered Parking"],
            },
            {
                "title": "500 Sq Yds Luxury Residence in DHA Phase 8",
                "slug": "500-sq-yds-luxury-residence-dha8",
                "description": "Brand new minimalist modern house built on 500 sq yds with basement theater room and rooftop terrace garden.",
                "property_type": "house",
                "listing_type": "sale",
                "status": "published",
                "price": Decimal("115000000.00"),
                "currency": "PKR",
                "area_sqft": Decimal("5200.00"),
                "bedrooms": 6,
                "bathrooms": 7,
                "city": "Karachi",
                "locality": "DHA Phase 8",
                "address": "Zone B, DHA Phase 8",
                "features": ["Home Theater", "Rooftop Garden", "Servant Quarters"],
            },
            {
                "title": "10 Marla Modern House in DHA Phase 2",
                "slug": "10-marla-modern-house-dha2-isb",
                "description": "Solid construction 10 Marla house featuring double unit layout, solid ash wood doors, and imported sanitary fittings.",
                "property_type": "house",
                "listing_type": "sale",
                "status": "published",
                "price": Decimal("42000000.00"),
                "currency": "PKR",
                "area_sqft": Decimal("3200.00"),
                "bedrooms": 5,
                "bathrooms": 5,
                "city": "Islamabad",
                "locality": "DHA Phase 2",
                "address": "Sector D, DHA Phase 2",
                "features": ["Double Unit", "Ash Wood Doors", "2 Car Porch"],
            },
            {
                "title": "Commercial Showroom Plaza on MM Alam Road",
                "slug": "commercial-showroom-plaza-mm-alam",
                "description": "Prime commercial building with front glass facade, dual elevators, high footfall location ideal for retail or bank branch.",
                "property_type": "commercial",
                "listing_type": "sale",
                "status": "published",
                "price": Decimal("130000000.00"),
                "currency": "PKR",
                "area_sqft": Decimal("6500.00"),
                "bedrooms": 0,
                "bathrooms": 6,
                "city": "Lahore",
                "locality": "Gulberg III",
                "address": "Main Boulevard MM Alam Road",
                "features": ["Glass Facade", "Elevators", "Basement Parking"],
            },
            {
                "title": "3 Bed Executive Apartment in F-11 Markaz",
                "slug": "3-bed-executive-apartment-f11",
                "description": "Spacious 3-bedroom apartment with separate drawing/dining, servant quarter, and immediate transfer paperwork.",
                "property_type": "apartment",
                "listing_type": "sale",
                "status": "published",
                "price": Decimal("32500000.00"),
                "currency": "PKR",
                "area_sqft": Decimal("2200.00"),
                "bedrooms": 3,
                "bathrooms": 4,
                "city": "Islamabad",
                "locality": "F-11 Markaz",
                "address": "Markaz F-11, Islamabad",
                "features": ["Markaz Vicinity", "Generator", "Dedicated Parking"],
            },
            {
                "title": "Corner Commercial Plot in DHA Phase 9 Prism",
                "slug": "corner-commercial-plot-dha9-prism",
                "description": "4 Marla commercial plot on 100ft wide main boulevard in DHA Phase 9 Prism. High investment potential.",
                "property_type": "commercial",
                "listing_type": "sale",
                "status": "published",
                "price": Decimal("28000000.00"),
                "currency": "PKR",
                "area_sqft": Decimal("1080.00"),
                "bedrooms": 0,
                "bathrooms": 0,
                "city": "Lahore",
                "locality": "DHA Phase 9",
                "address": "Main Boulevard, DHA Phase 9 Prism",
                "features": ["Corner Plot", "100ft Boulevard", "DHA Transferable"],
            },
            {
                "title": "Sea View Penthouse in Emaar Crescent Bay",
                "slug": "sea-view-penthouse-emaar-khi",
                "description": "Luxury 4-bed penthouse in Pearl Tower Emaar with private jacuzzi, wraparound balcony, and ocean panorama.",
                "property_type": "apartment",
                "listing_type": "sale",
                "status": "published",
                "price": Decimal("85000000.00"),
                "currency": "PKR",
                "area_sqft": Decimal("3600.00"),
                "bedrooms": 4,
                "bathrooms": 5,
                "city": "Karachi",
                "locality": "DHA Phase 8",
                "address": "Pearl Tower 1, Crescent Bay",
                "features": ["Jacuzzi", "Emaar Security", "Infinity Pool"],
            },
            {
                "title": "1 Kanal Park Facing House in Askari 11",
                "slug": "1-kanal-park-facing-house-askari11",
                "description": "Well-maintained 1 Kanal house directly facing sector park with lush front lawn and 5 spacious bedrooms.",
                "property_type": "house",
                "listing_type": "sale",
                "status": "published",
                "price": Decimal("62000000.00"),
                "currency": "PKR",
                "area_sqft": Decimal("4500.00"),
                "bedrooms": 5,
                "bathrooms": 6,
                "city": "Lahore",
                "locality": "Askari 11",
                "address": "Sector B, Askari 11",
                "features": ["Park Facing", "Army Security Entry", "Lawn"],
            },
            {
                "title": "Corporate Office Floor on I.I. Chundrigar Road",
                "slug": "corporate-office-floor-chundrigar",
                "description": "Entire 4,500 sqft commercial floor in financial district with server room setup, central HVAC, and 24/7 security.",
                "property_type": "commercial",
                "listing_type": "sale",
                "status": "published",
                "price": Decimal("75000000.00"),
                "currency": "PKR",
                "area_sqft": Decimal("4500.00"),
                "bedrooms": 0,
                "bathrooms": 4,
                "city": "Karachi",
                "locality": "Financial District",
                "address": "I.I. Chundrigar Road, Karachi",
                "features": ["Server Room", "Central HVAC", "Elevators"],
            },
            {
                "title": "10 Marla House in Bahria Town Phase 8",
                "slug": "10-marla-house-bahria-phase8-rwp",
                "description": "Modern 5-bedroom house with elegant TV lounge, dirty kitchen, terrace, and close proximity to Bahria Hospital.",
                "property_type": "house",
                "listing_type": "sale",
                "status": "published",
                "price": Decimal("34000000.00"),
                "currency": "PKR",
                "area_sqft": Decimal("3100.00"),
                "bedrooms": 5,
                "bathrooms": 6,
                "city": "Rawalpindi",
                "locality": "Bahria Town Phase 8",
                "address": "Sector C, Bahria Phase 8",
                "features": ["Near Hospital", "Dirty Kitchen", "Terrace"],
            },
            {
                "title": "2 Kanal Luxury Farmhouse Estate on Bedian Road",
                "slug": "2-kanal-luxury-farmhouse-bedian",
                "description": "Exclusive 2 Kanal private farmhouse with landscaped lawns, swimming pool, gazebo, and perimeter security wall.",
                "property_type": "house",
                "listing_type": "sale",
                "status": "published",
                "price": Decimal("140000000.00"),
                "currency": "PKR",
                "area_sqft": Decimal("9000.00"),
                "bedrooms": 4,
                "bathrooms": 5,
                "city": "Lahore",
                "locality": "Bedian Road",
                "address": "Bedian Road, Near Ring Road Interchange",
                "features": ["Private Pool", "Gazebo", "Landscaped Lawns"],
            },
            {
                "title": "Prime Commercial Shop in Civil Lines",
                "slug": "prime-commercial-shop-civil-lines-fsd",
                "description": "Ground floor 650 sqft commercial shop in main Civil Lines market with high customer traffic.",
                "property_type": "commercial",
                "listing_type": "sale",
                "status": "published",
                "price": Decimal("22000000.00"),
                "currency": "PKR",
                "area_sqft": Decimal("650.00"),
                "bedrooms": 0,
                "bathrooms": 1,
                "city": "Faisalabad",
                "locality": "Civil Lines",
                "address": "Civil Lines Market, Faisalabad",
                "features": ["Ground Floor Front", "High Footfall", "Commercial Meter"],
            },
            {
                "title": "1 Kanal Designer Villa in Naval Anchorage",
                "slug": "1-kanal-designer-villa-naval-anchorage",
                "description": "Modern elevation 1 Kanal house with 5 bedrooms, solar energy system, double garage, and basement hall.",
                "property_type": "house",
                "listing_type": "sale",
                "status": "published",
                "price": Decimal("58000000.00"),
                "currency": "PKR",
                "area_sqft": Decimal("4500.00"),
                "bedrooms": 5,
                "bathrooms": 6,
                "city": "Islamabad",
                "locality": "Naval Anchorage",
                "address": "Sector M, Naval Anchorage",
                "features": ["Solar Power", "Basement Hall", "Double Garage"],
            },
            {
                "title": "Modern Studio Apartment in DHA Raya Golf Club",
                "slug": "modern-studio-apartment-dha-raya",
                "description": "Fully furnished studio apartment overlooking the 18-hole Raya Golf Course with access to luxury clubhouse facilities.",
                "property_type": "apartment",
                "listing_type": "sale",
                "status": "published",
                "price": Decimal("16800000.00"),
                "currency": "PKR",
                "area_sqft": Decimal("750.00"),
                "bedrooms": 1,
                "bathrooms": 1,
                "city": "Lahore",
                "locality": "DHA Phase 6",
                "address": "Fairways Commercial, DHA Raya",
                "features": ["Golf Course View", "Clubhouse Access", "Valet Parking"],
            },
            {
                "title": "5 Bed Luxury Villa in PECHS Block 6",
                "slug": "5-bed-luxury-villa-pechs-khi",
                "description": "Spacious 500 sq yds classic villa in quiet residential lane of PECHS Block 6 with lush front garden and updated wiring.",
                "property_type": "house",
                "listing_type": "sale",
                "status": "published",
                "price": Decimal("92000000.00"),
                "currency": "PKR",
                "area_sqft": Decimal("4800.00"),
                "bedrooms": 5,
                "bathrooms": 6,
                "city": "Karachi",
                "locality": "PECHS",
                "address": "Block 6, PECHS, Karachi",
                "features": ["Lush Garden", "Quiet Neighborhood", "Underground Water Tank"],
            },
        ]

        for pdata in properties_data:
            p = Property(
                organization_id=org.id,
                created_by_user_id=owner_user.id,
                published_at=datetime.now(timezone.utc),
                **pdata,
            )
            session.add(p)

        await session.commit()
        print("Database seeding completed successfully!")
        print("Single Agency Owner Created:")
        print("  Email: asifhussain5115@gmail.com")
        print("  Password: 11111111")
        print("  Properties Seeded: 20")


if __name__ == "__main__":
    asyncio.run(seed())
