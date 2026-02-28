from flask import Blueprint, jsonify
from datetime import datetime, timedelta
from sqlalchemy import func
from database.db import SessionLocal
from database.models import Student, AttendanceSession, Attendance
from middleware.auth import require_auth

dashboard_bp = Blueprint("dashboard", __name__)

@dashboard_bp.route("/stats", methods=["GET"])
@require_auth
def get_stats(current_admin_id):
    db = SessionLocal()
    try:
        total_students = db.query(Student).filter_by(admin_id=current_admin_id).count()
        today_str = datetime.now().strftime("%Y-%m-%d")
        
        # Today's attendance
        today_session = db.query(AttendanceSession).filter_by(date=today_str, admin_id=current_admin_id).first()
        today_present = 0
        if today_session:
            today_present = db.query(Attendance).filter_by(session_id=today_session.id).count()
            
        today_absent = max(total_students - today_present, 0)
        
        # Calculate overall attendance percentage across all sessions for this admin
        all_sessions = db.query(AttendanceSession).filter_by(admin_id=current_admin_id).all()
        total_possible = len(all_sessions) * total_students
        
        # We need to filter attendance records for this admin's sessions
        session_ids = [s.id for s in all_sessions]
        total_present = db.query(Attendance).filter(Attendance.session_id.in_(session_ids)).count() if session_ids else 0
        
        attendance_percentage = 0
        if total_possible > 0:
            attendance_percentage = round((total_present / total_possible) * 100)
            
        return jsonify({
            "totalStudents": total_students,
            "todayPresent": today_present,
            "todayAbsent": today_absent,
            "attendancePercentage": attendance_percentage
        })
    finally:
        db.close()


@dashboard_bp.route("/weekly", methods=["GET"])
@require_auth
def get_weekly_data(current_admin_id):
    db = SessionLocal()
    try:
        total_students = db.query(Student).filter_by(admin_id=current_admin_id).count()
        if total_students == 0:
            return jsonify([])

        # Get the last 7 days
        today = datetime.now()
        dates = [(today - timedelta(days=i)).strftime("%Y-%m-%d") for i in range(6, -1, -1)]
        
        result = []
        for date_str in dates:
            session = db.query(AttendanceSession).filter_by(date=date_str, admin_id=current_admin_id).first()
            
            present = 0
            absent = total_students
            percentage = 0
            
            if session:
                present = db.query(Attendance).filter_by(session_id=session.id).count()
                absent = max(total_students - present, 0)
                percentage = round((present / total_students) * 100)
                
            # Convert date block to shortened day name, e.g., 'Mon'
            dt = datetime.strptime(date_str, "%Y-%m-%d")
            day_name = dt.strftime("%a")
            
            result.append({
                "date": day_name,
                "present": present,
                "absent": absent,
                "percentage": percentage
            })
            
        return jsonify(result)
    finally:
        db.close()

@dashboard_bp.route("/recent", methods=["GET"])
@require_auth
def get_recent_activity(current_admin_id):
    db = SessionLocal()
    try:
        today_str = datetime.now().strftime("%Y-%m-%d")
        today_session = db.query(AttendanceSession).filter_by(date=today_str, admin_id=current_admin_id).first()
        records = []
        if today_session:
            records = db.query(Attendance).filter_by(session_id=today_session.id).order_by(Attendance.time.desc()).limit(5).all()
        
        result = []
        for r in records:
            student = db.query(Student).filter_by(id=r.student_id).first()
            if student:
                # Approximate "2 mins ago" using current time vs record time
                time_obj = datetime.strptime(r.time, "%H:%M:%S").time()
                record_dt = datetime.combine(datetime.today(), time_obj)
                diff = datetime.now() - record_dt
                mins = int(diff.total_seconds() / 60)
                
                if mins < 1:
                    time_str = "just now"
                elif mins < 60:
                    time_str = f"{mins} mins ago"
                else:
                    hours = int(mins / 60)
                    time_str = f"{hours} hours ago"
                    
                result.append({
                    "name": student.name,
                    "action": "marked present",
                    "time": time_str
                })
        return jsonify(result)
    finally:
        db.close()


@dashboard_bp.route("/departments", methods=["GET"])
@require_auth
def get_department_stats(current_admin_id):
    db = SessionLocal()
    try:
        today_str = datetime.now().strftime("%Y-%m-%d")
        today_session = db.query(AttendanceSession).filter_by(date=today_str, admin_id=current_admin_id).first()
        
        # Determine all distinct departments
        departments = db.query(Student.department).filter_by(admin_id=current_admin_id).distinct().all()
        
        result = []
        for (dept_name,) in departments:
            total_in_dept = db.query(Student).filter_by(department=dept_name, admin_id=current_admin_id).count()
            
            present_in_dept = 0
            if today_session:
                present_in_dept = db.query(Attendance).join(
                    Student, Attendance.student_id == Student.id
                ).filter(
                    Attendance.session_id == today_session.id,
                    Student.department == dept_name
                ).count()
                
            percentage = 0
            if total_in_dept > 0:
                percentage = round((present_in_dept / total_in_dept) * 100)
                
            result.append({
                "name": dept_name,
                "percentage": percentage
            })
            
        # Sort highest percentage first
        result.sort(key=lambda x: x["percentage"], reverse=True)
        return jsonify(result)
    finally:
        db.close()
