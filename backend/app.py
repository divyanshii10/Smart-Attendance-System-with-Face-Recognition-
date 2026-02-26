from flask import Flask
from flask_cors import CORS
from database.db import engine
from database.db import Base
from database import models
from routes.student import student_bp
from routes.attendance import attendance_bp
from routes.reports import reports_bp
from routes.dashboard import dashboard_bp
from routes.settings import settings_bp
from routes.notifications import notifications_bp
from routes.auth import auth_bp
import os

# Create Flask server instance
app = Flask(__name__)

# Enable CORS — allow any origin in dev, or restrict to FRONTEND_URL in prod
frontend_url = os.environ.get("FRONTEND_URL", "*")
CORS(app, origins=frontend_url)

# Create / migrate tables in DB
Base.metadata.create_all(bind=engine)

# Register routes
app.register_blueprint(student_bp, url_prefix="/students")
app.register_blueprint(attendance_bp, url_prefix="/attendance")
app.register_blueprint(reports_bp, url_prefix="/reports")
app.register_blueprint(dashboard_bp, url_prefix="/dashboard")
app.register_blueprint(settings_bp, url_prefix="/settings")
app.register_blueprint(notifications_bp, url_prefix="/notifications")
app.register_blueprint(auth_bp, url_prefix="/auth")

# Health check
@app.route("/")
def home():
    return {"message": "Smart Attendance Backend Running ✅"}


# Server start point
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    print(f"Starting Flask server on port {port}...")
    app.run(host="0.0.0.0", debug=False, port=port)

