from flask import Blueprint, request, jsonify
from database.db import SessionLocal
from database.models import Student
from services.face_service import extract_face_encoding
import base64
import os

student_bp = Blueprint("students", __name__)

UPLOAD_FOLDER = "uploads/students"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@student_bp.route("/register", methods=["POST"])
def register_student():

    data = request.json

    name = data["name"]
    roll_number = data["rollNumber"]
    department = data["department"]
    image_base64 = data["image_base64"]

    # Extract face encoding
    encoding = extract_face_encoding(image_base64)

    if encoding is None:
        return jsonify({"error": "No face detected"}), 400

    # Save image locally
    file_path = f"{UPLOAD_FOLDER}/{roll_number}.jpg"

    header, encoded = image_base64.split(",", 1)
    img_bytes = base64.b64decode(encoded)

    with open(file_path, "wb") as f:
        f.write(img_bytes)

    # Store in DB
    db = SessionLocal()

    student = Student(
        name=name,
        roll_number=roll_number,
        department=department,
        photo_path=file_path,
        face_encoding=str(encoding)
    )

    db.add(student)
    db.commit()

    return jsonify({"message": "Student registered successfully"})