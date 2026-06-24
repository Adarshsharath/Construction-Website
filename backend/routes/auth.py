from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from database import get_db
from auth import check_password

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/login", methods=["POST"])
def login():
    try:
        data = request.get_json() or {}
        username = data.get("username", "").strip()
        password = data.get("password", "").strip()
        
        if not username or not password:
            return jsonify({"message": "Username and password are required"}), 400
            
        db = get_db()
        admin = db.admins.find_one({"username": username})
        
        if not admin or not check_password(password, admin.get("password_hash", "")):
            return jsonify({"message": "Invalid username or password"}), 401
            
        # Create token
        access_token = create_access_token(identity=username)
        return jsonify({
            "access_token": access_token,
            "username": username
        }), 200
    except Exception as e:
        return jsonify({"message": "An error occurred during login", "error": str(e)}), 500

@auth_bp.route("/verify", methods=["GET"])
@jwt_required()
def verify():
    try:
        current_user = get_jwt_identity()
        return jsonify({"valid": True, "username": current_user}), 200
    except Exception as e:
        return jsonify({"message": "Token verification failed", "error": str(e)}), 401
