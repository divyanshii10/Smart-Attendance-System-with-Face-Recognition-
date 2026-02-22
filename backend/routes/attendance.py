from flask import Blueprint, request, jsonify

from services.attendance_service import mark_attendance, get_active_session, set_active_session, clear_active_session, \
    already_marked, get_recent_attendance, get_today_stats, log_failed_scan

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
    status = "marked"

    if not student:
        log_failed_scan()
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
    mark_attendance(student, session)

    return jsonify({
        "success": True,
        "status": status,
        "student": student.name,
        "message": "Attendance process complete"
    })

@attendance_bp.route("/recent", methods=["GET"])
def recent_attendance():
    try:
        records = get_recent_attendance()
        return jsonify({"success": True, "records": records})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@attendance_bp.route("/today-stats", methods=["GET"])
def today_stats():
    try:
        stats = get_today_stats()
        return jsonify({
            "verified": stats["verified"],
            "failed": stats["failed"]
        })
    except Exception as e:
        return jsonify({"verified": 0, "failed": 0}), 500
