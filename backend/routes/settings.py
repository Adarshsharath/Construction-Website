from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from database import get_db, serialize_doc

settings_bp = Blueprint("settings", __name__)

@settings_bp.route("", methods=["GET"])
def get_settings():
    try:
        db = get_db()
        settings = db.site_settings.find_one()
        if not settings:
            # Fallback mock/skeleton settings
            fallback = {
                "company_name": "Apex Structures",
                "hero_title": "Constructing Excellence, Delivering Trust",
                "hero_subtitle": "Leading premium industrial, commercial, and residential projects with top-tier safety and architectural standards.",
                "about_text": "Founded in 2010, Apex Structures has established itself as a premier construction and engineering firm. We pride ourselves on executing high-quality, sustainable projects that shape skylines and empower communities.",
                "phone": "+1 (555) 019-2834",
                "email": "contact@apexstructures.com",
                "whatsapp": "+15550192834",
                "address": "452 Industrial Parkway, Suite A, New York, NY 10001",
                "map_url": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d110204.7463722212!2d-97.85023909778248!3d30.307982264627263!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8644b599a0ef5441%3A0x11a34b8d74542bb2!2sAustin%2C%20TX!5e0!3m2!1sen!2sus!4v1680000000000!5m2!1sen!2sus"
            }
            return jsonify(fallback), 200
        return jsonify(serialize_doc(settings)), 200
    except Exception as e:
        return jsonify({"message": "Error retrieving site settings", "error": str(e)}), 500

@settings_bp.route("", methods=["PUT"])
@jwt_required()
def update_settings():
    try:
        db = get_db()
        data = request.get_json() or {}
        
        # List of fields that the administrator can edit
        allowed_fields = [
            "company_name", 
            "hero_title", 
            "hero_subtitle", 
            "about_text", 
            "phone", 
            "email", 
            "whatsapp", 
            "address",
            "map_url"
        ]
        
        update_doc = {field: data.get(field, "").strip() for field in allowed_fields}
        
        existing = db.site_settings.find_one()
        if existing:
            db.site_settings.update_one({"_id": existing["_id"]}, {"$set": update_doc})
            update_doc["_id"] = str(existing["_id"])
        else:
            result = db.site_settings.insert_one(update_doc)
            update_doc["_id"] = str(result.inserted_id)
            
        return jsonify({"message": "Site settings updated successfully", "settings": update_doc}), 200
    except Exception as e:
        return jsonify({"message": "Error updating site settings", "error": str(e)}), 500
