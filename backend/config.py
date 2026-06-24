import os
from datetime import timedelta
from dotenv import load_dotenv

# Load environment variables from a .env file if it exists
load_dotenv()

class Config:
    MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/construction_db")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "construction-company-secret-jwt-key-2026")
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)
    
    # Path settings
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")
    ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif", "webp"}
    
    # Admin defaults
    ADMIN_USERNAME = os.getenv("ADMIN_USERNAME", "admin")
    ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "admin12345")
    
    # Server port
    PORT = int(os.getenv("PORT", 5000))
