import os
from flask import Flask, send_from_directory, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import Config
from database import get_db, init_db
from bootstrap import ensure_database_ready
from routes import register_blueprints

def create_app():
    app = Flask(__name__)
    
    # Load configuration
    app.config.from_object(Config)
    
    # Enable CORS for the frontend development and production
    CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)
    
    # Setup JWT management
    jwt = JWTManager(app)
    
    # Verify and initialize Database connection
    try:
        db = init_db()
        ensure_database_ready(db)
    except Exception as e:
        print(f"Warning: Database failed to initialize on startup ({e}). Will attempt lazy loading.")

    # Create uploads directory if it doesn't exist
    os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)
    
    # Serve project uploads statically
    @app.route("/uploads/<path:filename>")
    def serve_uploads(filename):
        return send_from_directory(app.config["UPLOAD_FOLDER"], filename)
    
    # Register API blueprints
    register_blueprints(app)
    
    # Base check endpoint
    @app.route("/health", methods=["GET"])
    def health_check():
        database = {"status": "connected"}
        status_code = 200
        try:
            db = get_db()
            db.client.admin.command("ping")
            database["name"] = db.name
        except Exception as e:
            database = {"status": "unavailable", "error": str(e)}
            status_code = 503

        return jsonify({
            "status": "healthy" if status_code == 200 else "degraded",
            "message": "Flask REST API for Construction Website is running",
            "database": database
        }), status_code
        
    # Global HTTP error handler
    @app.errorhandler(404)
    def page_not_found(e):
        return jsonify({"message": "Resource not found"}), 404
        
    @app.errorhandler(500)
    def internal_server_error(e):
        return jsonify({"message": "Internal server error occurred", "error": str(e)}), 500
        
    return app

app = create_app()

if __name__ == "__main__":
    print(f"Starting server on port {Config.PORT}...")
    app.run(host="0.0.0.0", port=Config.PORT, debug=True)
