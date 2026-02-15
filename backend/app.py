from flask import Flask
from flask_cors import CORS
from database.db import engine
from database.db import Base
from database import models
from routes.student import student_bp
from routes.attendance import attendance_bp

# Create Flask server instance
app = Flask(__name__)

# Enable CORS so frontend can call backend
CORS(app)

# Create tables in DB
Base.metadata.create_all(bind=engine)

# Register student routes
app.register_blueprint(student_bp, url_prefix="/students")
app.register_blueprint(attendance_bp, url_prefix="/attendance")

# Test route
@app.route("/")
def home():
    return {"message": "Smart Attendance Backend Running ✅"}


# Server start point
if __name__ == "__main__":
    print("Starting Flask server...")
    app.run(debug=True, port=8000)







