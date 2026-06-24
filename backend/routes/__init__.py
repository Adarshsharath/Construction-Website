from routes.auth import auth_bp
from routes.projects import projects_bp
from routes.settings import settings_bp
from routes.inquiries import inquiries_bp

# Register all blueprints into a single registry function
def register_blueprints(app):
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(projects_bp, url_prefix="/api/projects")
    app.register_blueprint(settings_bp, url_prefix="/api/settings")
    app.register_blueprint(inquiries_bp, url_prefix="/api/inquiries")
