import os
import uuid
import json
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from bson import ObjectId
from database import get_db, serialize_doc, serialize_docs
from config import Config
from werkzeug.utils import secure_filename

projects_bp = Blueprint("projects", __name__)

def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in Config.ALLOWED_EXTENSIONS

def save_uploaded_file(file):
    if not file or file.filename == "":
        return None
    if not allowed_file(file.filename):
        raise ValueError(f"File extension not allowed. Supported: {', '.join(Config.ALLOWED_EXTENSIONS)}")
    
    # Create unique filename
    ext = file.filename.rsplit(".", 1)[1].lower()
    unique_name = f"{uuid.uuid4().hex}.{ext}"
    
    # Ensure upload directory exists
    os.makedirs(Config.UPLOAD_FOLDER, exist_ok=True)
    
    filepath = os.path.join(Config.UPLOAD_FOLDER, unique_name)
    file.save(filepath)
    return f"/uploads/{unique_name}"

@projects_bp.route("", methods=["GET"])
def get_projects():
    try:
        db = get_db()
        # Allow limiting results (e.g. limit=3 for home page featured projects)
        limit = request.args.get("limit", type=int)
        
        query = db.projects.find().sort("createdAt", -1)
        if limit:
            query = query.limit(limit)
            
        projects = list(query)
        return jsonify(serialize_docs(projects)), 200
    except Exception as e:
        return jsonify({"message": "Error fetching projects", "error": str(e)}), 500

@projects_bp.route("/<id>", methods=["GET"])
def get_project(id):
    try:
        db = get_db()
        if not ObjectId.is_valid(id):
            return jsonify({"message": "Invalid project ID format"}), 400
            
        project = db.projects.find_one({"_id": ObjectId(id)})
        if not project:
            return jsonify({"message": "Project not found"}), 404
            
        return jsonify(serialize_doc(project)), 200
    except Exception as e:
        return jsonify({"message": "Error fetching project details", "error": str(e)}), 500

@projects_bp.route("", methods=["POST"])
@jwt_required()
def create_project():
    try:
        # Check form data
        title = request.form.get("title", "").strip()
        description = request.form.get("description", "").strip()
        location = request.form.get("location", "").strip()
        year_str = request.form.get("year", "").strip()
        
        if not title or not description or not location or not year_str:
            return jsonify({"message": "Missing required fields: title, description, location, year"}), 400
            
        try:
            year = int(year_str)
        except ValueError:
            return jsonify({"message": "Year must be a valid integer"}), 400
            
        # Get files
        thumbnail_file = request.files.get("thumbnail")
        gallery_files = request.files.getlist("gallery")
        
        if not thumbnail_file:
            return jsonify({"message": "Thumbnail image is required"}), 400
            
        # Save thumbnail
        try:
            thumbnail_url = save_uploaded_file(thumbnail_file)
        except ValueError as ve:
            return jsonify({"message": str(ve)}), 400
            
        # Save gallery images
        gallery_urls = []
        for g_file in gallery_files:
            if g_file and g_file.filename != "":
                try:
                    url = save_uploaded_file(g_file)
                    if url:
                        gallery_urls.append(url)
                except ValueError as ve:
                    return jsonify({"message": f"Gallery error: {str(ve)}"}), 400
                    
        # Construct DB Document
        from datetime import datetime
        new_project = {
            "title": title,
            "description": description,
            "location": location,
            "year": year,
            "thumbnail": thumbnail_url,
            "gallery": gallery_urls,
            "createdAt": datetime.utcnow()
        }
        
        db = get_db()
        result = db.projects.insert_one(new_project)
        new_project["_id"] = str(result.inserted_id)
        
        return jsonify({"message": "Project created successfully", "project": serialize_doc(new_project)}), 201
    except Exception as e:
        return jsonify({"message": "Error creating project", "error": str(e)}), 500

@projects_bp.route("/<id>", methods=["PUT"])
@jwt_required()
def update_project(id):
    try:
        db = get_db()
        if not ObjectId.is_valid(id):
            return jsonify({"message": "Invalid project ID format"}), 400
            
        existing_project = db.projects.find_one({"_id": ObjectId(id)})
        if not existing_project:
            return jsonify({"message": "Project not found"}), 404
            
        # Parse fields
        title = request.form.get("title", "").strip() or existing_project.get("title")
        description = request.form.get("description", "").strip() or existing_project.get("description")
        location = request.form.get("location", "").strip() or existing_project.get("location")
        year_str = request.form.get("year", "").strip()
        
        year = existing_project.get("year")
        if year_str:
            try:
                year = int(year_str)
            except ValueError:
                return jsonify({"message": "Year must be a valid integer"}), 400
                
        # Parse existing gallery items to keep
        existing_gallery_raw = request.form.get("existingGallery")
        if existing_gallery_raw is not None:
            try:
                gallery_urls = json.loads(existing_gallery_raw)
            except json.JSONDecodeError:
                gallery_urls = existing_project.get("gallery", [])
        else:
            gallery_urls = existing_project.get("gallery", [])
            
        # Parse thumbnail
        thumbnail_file = request.files.get("thumbnail")
        if thumbnail_file:
            try:
                thumbnail_url = save_uploaded_file(thumbnail_file)
            except ValueError as ve:
                return jsonify({"message": str(ve)}), 400
        else:
            thumbnail_url = existing_project.get("thumbnail")
            
        # Append new gallery files
        new_gallery_files = request.files.getlist("gallery")
        for g_file in new_gallery_files:
            if g_file and g_file.filename != "":
                try:
                    url = save_uploaded_file(g_file)
                    if url:
                        gallery_urls.append(url)
                except ValueError as ve:
                    return jsonify({"message": f"Gallery error: {str(ve)}"}), 400
                    
        # Update document
        update_data = {
            "title": title,
            "description": description,
            "location": location,
            "year": year,
            "thumbnail": thumbnail_url,
            "gallery": gallery_urls
        }
        
        db.projects.update_one({"_id": ObjectId(id)}, {"$set": update_data})
        update_data["_id"] = id
        
        return jsonify({"message": "Project updated successfully", "project": update_data}), 200
    except Exception as e:
        return jsonify({"message": "Error updating project", "error": str(e)}), 500

@projects_bp.route("/<id>", methods=["DELETE"])
@jwt_required()
def delete_project(id):
    try:
        db = get_db()
        if not ObjectId.is_valid(id):
            return jsonify({"message": "Invalid project ID format"}), 400
            
        project = db.projects.find_one({"_id": ObjectId(id)})
        if not project:
            return jsonify({"message": "Project not found"}), 404
            
        # Optionally, delete physical files from the uploads folder to keep disk clean
        def delete_static_file(file_url):
            if file_url and file_url.startswith("/uploads/"):
                filename = file_url.replace("/uploads/", "")
                filepath = os.path.join(Config.UPLOAD_FOLDER, filename)
                if os.path.exists(filepath):
                    try:
                        os.remove(filepath)
                    except Exception as ex:
                        print(f"Failed to remove file {filepath}: {ex}")
                        
        # Delete thumbnail
        delete_static_file(project.get("thumbnail"))
        # Delete gallery files
        for url in project.get("gallery", []):
            delete_static_file(url)
            
        db.projects.delete_one({"_id": ObjectId(id)})
        return jsonify({"message": "Project deleted successfully"}), 200
    except Exception as e:
        return jsonify({"message": "Error deleting project", "error": str(e)}), 500
