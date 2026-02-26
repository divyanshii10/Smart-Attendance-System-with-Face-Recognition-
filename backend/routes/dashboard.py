from flask import Blueprint, jsonify
from datetime import datetime, timedelta
from sqlalchemy import func
from database.db import SessionLocal
from database.models import Student, AttendanceSession, Attendance

dashboard_bp = Blueprint("dashboard", __name__)

@dashboard_bp.route("/stats", methods=["GET"])
def get_stats():
    db = SessionLocal()
    try:
        total_students = db.query(Student).count()
        today_str = datetime.now().strftime("%Y-%m-%d")
        
        # Today's attendance
        today_session = db.query(AttendanceSession).filter_by(date=today_str).first()
        today_present = 0
        if today_session:
            today_present = db.query(Attendance).filter_by(session_id=today_session.id).count()
            
        today_absent = max(total_students - today_present, 0)
        
        # Calculate overall attendance percentage across all sessions
        all_sessions = db.query(AttendanceSession).all()
        total_possible = len(all_sessions) * total_students
        total_present = db.query(Attendance).count()
        
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
def get_weekly_data():
    db = SessionLocal()
    try:
        total_students = db.query(Student).count()
        if total_students == 0:
            return jsonify([])

        # Get the last 7 days
        today = datetime.now()
        dates = [(today - timedelta(days=i)).strftime("%Y-%m-%d") for i in range(6, -1, -1)]
        
        result = []
        for date_str in dates:
            session = db.query(AttendanceSession).filter_by(date=date_str).first()
            
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
def get_recent_activity():
    db = SessionLocal()
    try:
        today_str = datetime.now().strftime("%Y-%m-%d")
        today_session = db.query(AttendanceSession).filter_by(date=today_str).first()
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
def get_department_stats():
    db = SessionLocal()
    try:
        today_str = datetime.now().strftime("%Y-%m-%d")
        today_session = db.query(AttendanceSession).filter_by(date=today_str).first()
        
        # Determine all distinct departments
        departments = db.query(Student.department).distinct().all()
        
        result = []
        for (dept_name,) in departments:
            total_in_dept = db.query(Student).filter_by(department=dept_name).count()
            
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
