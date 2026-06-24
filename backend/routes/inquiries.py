from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from bson import ObjectId
from database import get_db, serialize_doc, serialize_docs
from datetime import datetime

inquiries_bp = Blueprint("inquiries", __name__)

@inquiries_bp.route("", methods=["POST"])
def create_inquiry():
    try:
        data = request.get_json() or {}
        name = data.get("name", "").strip()
        phone = data.get("phone", "").strip()
        email = data.get("email", "").strip()
        message = data.get("message", "").strip()
        
        if not name or not phone or not email or not message:
            return jsonify({"message": "All fields (name, phone, email, message) are required"}), 400
            
        new_inquiry = {
            "name": name,
            "phone": phone,
            "email": email,
            "message": message,
            "created_at": datetime.utcnow(),
            "status": "pending" # default status is pending
        }
        
        db = get_db()
        result = db.contacts.insert_one(new_inquiry)
        new_inquiry["_id"] = str(result.inserted_id)
        
        return jsonify({
            "message": "Inquiry submitted successfully", 
            "inquiry": serialize_doc(new_inquiry)
        }), 201
    except Exception as e:
        return jsonify({"message": "Error submitting inquiry", "error": str(e)}), 500

@inquiries_bp.route("", methods=["GET"])
@jwt_required()
def get_inquiries():
    try:
        db = get_db()
        # Sort inquiries by date descending
        inquiries = list(db.contacts.find().sort("created_at", -1))
        return jsonify(serialize_docs(inquiries)), 200
    except Exception as e:
        return jsonify({"message": "Error fetching inquiries", "error": str(e)}), 500

@inquiries_bp.route("/<id>/status", methods=["PUT"])
@jwt_required()
def update_inquiry_status(id):
    try:
        db = get_db()
        if not ObjectId.is_valid(id):
            return jsonify({"message": "Invalid inquiry ID format"}), 400
            
        data = request.get_json() or {}
        status = data.get("status", "").strip()
        
        if status not in ["pending", "contacted"]:
            return jsonify({"message": "Status must be 'pending' or 'contacted'"}), 400
            
        result = db.contacts.update_one(
            {"_id": ObjectId(id)},
            {"$set": {"status": status}}
        )
        
        if result.matched_count == 0:
            return jsonify({"message": "Inquiry not found"}), 404
            
        return jsonify({"message": f"Inquiry status updated to {status}"}), 200
    except Exception as e:
        return jsonify({"message": "Error updating inquiry status", "error": str(e)}), 500

@inquiries_bp.route("/<id>", methods=["DELETE"])
@jwt_required()
def delete_inquiry(id):
    try:
        db = get_db()
        if not ObjectId.is_valid(id):
            return jsonify({"message": "Invalid inquiry ID format"}), 400
            
        result = db.contacts.delete_one({"_id": ObjectId(id)})
        
        if result.deleted_count == 0:
            return jsonify({"message": "Inquiry not found"}), 404
            
        return jsonify({"message": "Inquiry deleted successfully"}), 200
    except Exception as e:
        return jsonify({"message": "Error deleting inquiry", "error": str(e)}), 500
