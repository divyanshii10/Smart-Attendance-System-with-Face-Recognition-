from flask import Flask, send_from_directory
from flask_cors import CORS
from database.db import engine
from database.db import Base
from database import models
from routes.student import student_bp
from routes.attendance import attendance_bp
import os

# Create Flask server instance
app = Flask(__name__)

# Enable CORS — allow any origin in dev, or restrict to FRONTEND_URL in prod
frontend_url = os.environ.get("FRONTEND_URL", "*")
CORS(app, origins=frontend_url)

# Create tables in DB
Base.metadata.create_all(bind=engine)

# Register student routes
app.register_blueprint(student_bp, url_prefix="/students")
app.register_blueprint(attendance_bp, url_prefix="/attendance")

# Serve uploaded student photos
@app.route("/uploads/<path:filename>")
def serve_upload(filename):
    return send_from_directory(os.path.join(os.getcwd(), "uploads"), filename)

# Test route
@app.route("/")
def home():
    return {"message": "Smart Attendance Backend Running ✅"}


# Server start point
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    print(f"Starting Flask server on port {port}...")
    app.run(host="0.0.0.0", debug=False, port=port)
