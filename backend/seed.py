import sys
import os
from datetime import datetime

# Adjust Python path to load modules correctly
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import get_db
from auth import hash_password
from config import Config

def seed_database():
    print("Connecting to database for seeding...")
    db = get_db()
    
    # 1. Seed Admin
    print("\n--- Checking Admin Collection ---")
    admins_count = db.admins.count_documents({})
    if admins_count == 0:
        username = Config.ADMIN_USERNAME
        password = Config.ADMIN_PASSWORD
        hashed = hash_password(password)
        
        db.admins.insert_one({
            "username": username,
            "password_hash": hashed
        })
        print(f"Admin collection seeded successfully! Default Admin:")
        print(f"  Username: {username}")
        print(f"  Password: {password}")
        print("  WARNING: Please change these default credentials in production.")
    else:
        print(f"Admins collection already contains {admins_count} document(s). Skipping seeding.")

    # 2. Seed Site Settings
    print("\n--- Checking Site Settings ---")
    settings_count = db.site_settings.count_documents({})
    if settings_count == 0:
        default_settings = {
            "company_name": "NovaBuild Group",
            "hero_title": "Pioneering Modern Architecture & Engineering",
            "hero_subtitle": "Delivering premium residential complexes, commercial landmarks, and modern interior renovations with exceptional structural precision.",
            "about_text": "At NovaBuild Group, we have spent over 15 years crafting the future of architecture. As a multi-disciplinary construction company, we merge advanced engineering practices with visual aesthetics, setting the gold standard in construction management, scheduling, and project execution. Our mission is to shape communities through landmark structures designed to last lifetimes.",
            "phone": "+1 (555) 382-9182",
            "email": "info@novabuildgroup.com",
            "whatsapp": "+15553829182",
            "address": "782 Construction Boulevard, Floor 14, Austin, TX 78701",
            "map_url": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d110204.7463722212!2d-97.85023909778248!3d30.307982264627263!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8644b599a0ef5441%3A0x11a34b8d74542bb2!2sAustin%2C%20TX!5e0!3m2!1sen!2sus!4v1680000000000!5m2!1sen!2sus"
        }
        db.site_settings.insert_one(default_settings)
        print("Default Site Settings seeded successfully!")
    else:
        print("Site settings document already exists. Skipping.")

    # 3. Seed Projects
    print("\n--- Checking Projects ---")
    projects_count = db.projects.count_documents({})
    if projects_count == 0:
        sample_projects = [
            {
                "title": "The Glass Pavilion (Residential)",
                "description": "A high-end residential luxury villa built on the outskirts of Austin. The building incorporates solar-panel integrations, triple-glazed glass facades, and a fully automated smart-home energy system. Spanning 6,500 square feet, this architectural masterpiece blends indoor living with outdoor nature.",
                "location": "West Lake Hills, Austin, TX",
                "year": 2024,
                "thumbnail": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
                "gallery": [
                    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80"
                ],
                "createdAt": datetime.utcnow()
            },
            {
                "title": "Apex Heights Corporate Office (Commercial)",
                "description": "An 18-story sustainable commercial tower in Seattle. Certified LEED Gold, the corporate headquarters features state-of-the-art HVAC systems, double-pane heat-reflective glass panels, and rainwater harvesting infrastructure. The building hosts multiple high-profile tech companies.",
                "location": "Downtown, Seattle, WA",
                "year": 2025,
                "thumbnail": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
                "gallery": [
                    "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80"
                ],
                "createdAt": datetime.utcnow()
            },
            {
                "title": "Elysian Lofts (Renovation & Re-engineering)",
                "description": "A historic brick warehouse built in 1912, re-engineered and structurally retrofitted into 45 premium loft apartments. The project preserved the rustic brick facade and steel girders while upgrading the foundation, insulation, wiring, and installing elevator cores.",
                "location": "Brooklyn, New York, NY",
                "year": 2023,
                "thumbnail": "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
                "gallery": [
                    "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=800&q=80"
                ],
                "createdAt": datetime.utcnow()
            },
            {
                "title": "Vanguard Tech Center Lobby (Interior Works)",
                "description": "A futuristic corporate lobby refurbishment featuring customized wood slats, acoustic ceiling elements, modern LED strip lighting layouts, and integrated touchscreens. Designed to offer a premium, warm welcome to visitors.",
                "location": "Palo Alto, CA",
                "year": 2024,
                "thumbnail": "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80",
                "gallery": [
                    "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=800&q=80"
                ],
                "createdAt": datetime.utcnow()
            }
        ]
        db.projects.insert_many(sample_projects)
        print(f"Successfully seeded {len(sample_projects)} sample projects!")
    else:
        print(f"Projects collection already contains {projects_count} document(s). Skipping seeding.")

    print("\nDatabase seeding completed successfully.")

if __name__ == "__main__":
    seed_database()
