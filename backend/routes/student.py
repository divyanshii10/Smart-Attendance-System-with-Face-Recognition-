from flask import Blueprint, request, jsonify
from database.db import SessionLocal
from database.models import Student
import numpy as np
import io
import os
from PIL import Image

student_bp = Blueprint("students", __name__)

UPLOAD_FOLDER = "uploads/students"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@student_bp.route("/", methods=["GET"])
def get_students():
    db = SessionLocal()
    students = db.query(Student).all()
    db.close()
    return jsonify([
        {
            "id": s.id,
            "name": s.name,
            "roll_number": s.roll_number,
            "department": s.department,
            "year": s.year or "",
            "email": s.email or ""
        }
        for s in students
    ])

@student_bp.route("/register", methods=["POST"])
def register_student():

    name = request.form.get("name")
    roll_number = request.form.get("roll_number")
    department = request.form.get("department")
    year = request.form.get("year", "")
    email = request.form.get("email", "")

    if not name or not roll_number or not department:
        return jsonify({"error": "Missing required fields"}), 400

    image_file = request.files.get("image")
    if not image_file:
        return jsonify({"error": "No image uploaded"}), 400

    # Read image bytes and extract face encoding
    img_bytes = image_file.read()
    image = Image.open(io.BytesIO(img_bytes)).convert("RGB")
    image_np = np.array(image)

    import face_recognition
    encodings = face_recognition.face_encodings(image_np)
    if not encodings:
        return jsonify({"error": "No face detected in the image"}), 400

    encoding = encodings[0].tolist()

    # Save image to disk
    file_path = f"{UPLOAD_FOLDER}/{roll_number}.jpg"
    image.save(file_path)

    # Check for duplicate roll number
    db = SessionLocal()
    existing = db.query(Student).filter_by(roll_number=roll_number).first()
    if existing:
        db.close()
        return jsonify({"error": "Roll number already exists"}), 409

    student = Student(
        name=name,
        roll_number=roll_number,
        department=department,
        year=year,
        email=email,
        photo_path=file_path,
        face_encoding=str(encoding)
    )

    db.add(student)
    db.commit()
    db.close()

    return jsonify({"message": f"Student '{name}' registered successfully", "success": True})
