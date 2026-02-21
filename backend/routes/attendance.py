from flask import Blueprint, request, jsonify

from services.attendance_service import mark_attendance, get_active_session, set_active_session, clear_active_session, \
    already_marked

from services.recognize_service import recognize_face

# ✅ Create Blueprint
attendance_bp = Blueprint("attendance", __name__)


@attendance_bp.route("/start", methods=["POST"])
def start_session():
    session_id = set_active_session()
    return jsonify({"success": True, "sessionId": session_id})


@attendance_bp.route("/stop", methods=["POST"])
def stop_session():
    clear_active_session()
    return jsonify({"success": True})


# ✅ Recognition + Attendance Marking Route
@attendance_bp.route("/verify", methods=["POST"])
def verify_face():
    print("✅ VERIFY API HIT")
    data = request.json
    image_base64 = data.get("image")

    if not image_base64:
        return jsonify({"success": False, "message": "No image provided"}), 400

    # 1. check active session
    session = get_active_session()
    if not session:
        return jsonify({"success": False, "message": "No active session"})

    # 2 & 3. extract encoding & recognize student
    student = recognize_face(image_base64)

    if not student:
        return jsonify({"success": False, "message": "Unknown face"})

    # 4. prevent duplicate attendance
    if already_marked(student.id, session):
        return jsonify({"success": True, "message": "Already marked", "student": student.name})

    # 5. store attendance
    mark_attendance(student, session)

    return jsonify({
        "success": True,
        "student": student.name,
        "message": "Attendance Marked"
    })
