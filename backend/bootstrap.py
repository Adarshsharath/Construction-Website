from datetime import datetime

from auth import hash_password
from config import Config


DEFAULT_SETTINGS = {
    "company_name": "NovaBuild Group",
    "hero_title": "Pioneering Modern Architecture & Engineering",
    "hero_subtitle": "Delivering premium residential complexes, commercial landmarks, and modern interior renovations with exceptional structural precision.",
    "about_text": "At NovaBuild Group, we have spent over 15 years crafting the future of architecture. As a multi-disciplinary construction company, we merge advanced engineering practices with visual aesthetics, setting the gold standard in construction management, scheduling, and project execution. Our mission is to shape communities through landmark structures designed to last lifetimes.",
    "phone": "+1 (555) 382-9182",
    "email": "info@novabuildgroup.com",
    "whatsapp": "+15553829182",
    "address": "782 Construction Boulevard, Floor 14, Austin, TX 78701",
    "map_url": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d110204.7463722212!2d-97.85023909778248!3d30.307982264627263!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8644b599a0ef5441%3A0x11a34b8d74542bb2!2sAustin%2C%20TX!5e0!3m2!1sen!2sus!4v1680000000000!5m2!1sen!2sus",
}


def ensure_database_ready(db):
    db.admins.create_index("username", unique=True)
    db.contacts.create_index("created_at")
    db.projects.create_index("createdAt")

    if db.admins.count_documents({}) == 0:
        db.admins.insert_one({
            "username": Config.ADMIN_USERNAME,
            "password_hash": hash_password(Config.ADMIN_PASSWORD),
            "created_at": datetime.utcnow(),
        })
        print(f"Created initial admin user '{Config.ADMIN_USERNAME}'.")

    if db.site_settings.count_documents({}) == 0:
        db.site_settings.insert_one(DEFAULT_SETTINGS.copy())
        print("Created default site settings.")
