from flask import Blueprint, request, jsonify

from services.attendance_service import mark_attendance, get_active_session, set_active_session, clear_active_session, \
    already_marked, get_recent_attendance, get_today_stats, log_failed_scan

from services.recognize_service import recognize_face

# ✅ Create Blueprint
attendance_bp = Blueprint("attendance", __name__)
from middleware.auth import require_auth


@attendance_bp.route("/start", methods=["POST"])
@require_auth
def start_session(current_admin_id):
    session_id = set_active_session(current_admin_id)
    return jsonify({"success": True, "sessionId": session_id})


@attendance_bp.route("/stop", methods=["POST"])
@require_auth
def stop_session(current_admin_id):
    clear_active_session(current_admin_id)
    return jsonify({"success": True})


# ✅ Recognition + Attendance Marking Route
@attendance_bp.route("/verify", methods=["POST"])
@require_auth
def verify_face(current_admin_id):
    print("✅ VERIFY API HIT")
    data = request.json
    image_base64 = data.get("image")

    if not image_base64:
        return jsonify({"success": False, "message": "No image provided"}), 400

    # 1. check active session
    session = get_active_session(current_admin_id)
    if not session:
        return jsonify({"success": False, "message": "No active session"})

    # 2 & 3. extract encoding & recognize student
    student = recognize_face(image_base64)
    status = "marked"

    if not student:
        log_failed_scan(current_admin_id)
        return jsonify({
            "success": True,
            "status": "not_found",
            "message": "no records found failure"
        })
    else:
        # 4. prevent duplicate attendance
        if already_marked(student.id, session):
            status = "already_marked"
            return jsonify({
                "success": True, 
                "status": status,
                "student": student.name,
                "message": "Already marked"
            })

    # 5. store attendance
    mark_attendance(student, session, current_admin_id)

    return jsonify({
        "success": True,
        "status": status,
        "student": student.name,
        "message": "Attendance process complete"
    })

@attendance_bp.route("/recent", methods=["GET"])
@require_auth
def recent_attendance(current_admin_id):
    try:
        records = get_recent_attendance(current_admin_id)
        return jsonify({"success": True, "records": records})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@attendance_bp.route("/today-stats", methods=["GET"])
@require_auth
def today_stats(current_admin_id):
    try:
        stats = get_today_stats(current_admin_id)
        return jsonify({
            "verified": stats["verified"],
            "failed": stats["failed"]
        })
    except Exception as e:
        return jsonify({"verified": 0, "failed": 0}), 500
