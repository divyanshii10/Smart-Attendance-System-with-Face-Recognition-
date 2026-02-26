import base64
import io
import os

import face_recognition
import numpy as np
from flask import Blueprint, request, jsonify, send_file
from PIL import Image

from database.db import SessionLocal
from database.models import Student

student_bp = Blueprint("students", __name__)


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
            "email": s.email or "",
            # Expose a URL clients can use to fetch the photo
            "photo_url": f"/students/{s.id}/photo" if s.photo_data else None
        }
        for s in students
    ])


@student_bp.route("/<int:student_id>/photo", methods=["GET"])
def get_student_photo(student_id):
    """Serve a student's photo directly from the database — no filesystem required."""
    db = SessionLocal()
    student = db.query(Student).filter(Student.id == student_id).first()
    db.close()

    if not student or not student.photo_data:
        return jsonify({"error": "Photo not found"}), 404

    # photo_data is stored as a plain base64 string (no data-URI prefix)
    img_bytes = base64.b64decode(student.photo_data)
    return send_file(
        io.BytesIO(img_bytes),
        mimetype="image/jpeg",
        as_attachment=False
    )


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

    # ── Read & validate image ──────────────────────────────────────────────────
    img_bytes = image_file.read()
    image = Image.open(io.BytesIO(img_bytes)).convert("RGB")
    image_np = np.array(image)

    # ── Extract face encoding ──────────────────────────────────────────────────
    encodings = face_recognition.face_encodings(image_np)
    if not encodings:
        return jsonify({"error": "No face detected in the image"}), 400

    encoding = encodings[0].tolist()

    # ── Convert image to base64 for DB storage (JPEG, q=85) ───────────────────
    buf = io.BytesIO()
    image.save(buf, format="JPEG", quality=85)
    photo_b64 = base64.b64encode(buf.getvalue()).decode("utf-8")

    # ── Persist to DB ──────────────────────────────────────────────────────────
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
        photo_data=photo_b64,           # stored in DB, not on disk
        face_encoding=str(encoding)
    )

    db.add(student)
    db.commit()
    db.close()

    return jsonify({"message": f"Student '{name}' registered successfully", "success": True})


@student_bp.route("/<int:student_id>", methods=["DELETE"])
def delete_student(student_id):
    from database.models import Attendance
    db = SessionLocal()
    try:
        student = db.query(Student).filter_by(id=student_id).first()
        if not student:
            return jsonify({"error": "Student not found"}), 404

        # Delete associated attendance records to keep DB clean
        db.query(Attendance).filter_by(student_id=student_id).delete()
        
        db.delete(student)
        db.commit()
        return jsonify({"message": "Student deleted successfully", "success": True})
    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()

