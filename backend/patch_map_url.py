import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import get_db

db = get_db()
DEFAULT_MAP_URL = (
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d110204.7463722212"
    "!2d-97.85023909778248!3d30.307982264627263!2m3!1f0!2f0!3f0!3m2!1i1024!2i768"
    "!4f13.1!3m3!1m2!1s0x8644b599a0ef5441%3A0x11a34b8d74542bb2!2sAustin%2C%20TX"
    "!5e0!3m2!1sen!2sus!4v1680000000000!5m2!1sen!2sus"
)

result = db.site_settings.update_one(
    {"map_url": {"$exists": False}},
    {"$set": {"map_url": DEFAULT_MAP_URL}}
)
print(f"Matched: {result.matched_count} | Modified: {result.modified_count}")
if result.modified_count:
    print("map_url field added to existing site_settings document successfully.")
else:
    print("Document already has map_url or no document found. No change needed.")
