from flask import Blueprint, request, jsonify

from services.recognize_service import recognize_face
from services.attendance_service import mark_attendance

# ✅ Create Blueprint
attendance_bp = Blueprint("attendance", __name__)


# ✅ Recognition + Attendance Marking Route
@attendance_bp.route("/recognize", methods=["POST"])
def recognize():

    data = request.json
    image_base64 = data["image_base64"]

    # Step 1 — Recognize student
    student = recognize_face(image_base64)

    if student:

        # Step 2 — Mark attendance
        mark_attendance(student)

        return jsonify({
            "name": student.name,
            "roll_number": student.roll_number,
            "department": student.department,
            "status": "Attendance Marked"
        })

    return jsonify({"message": "No match found"}), 404