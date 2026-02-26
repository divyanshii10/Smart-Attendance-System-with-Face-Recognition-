from datetime import datetime
from database.db import SessionLocal
from database.models import Attendance, AttendanceSession, FailedScan

# In-memory pointer to the active DB session id (integer)
_active_session_id = None


def get_today_stats():
    db = SessionLocal()
    today = datetime.now().strftime("%Y-%m-%d")

    verified_count = db.query(Attendance).filter(
        Attendance.date == today
    ).count()

    failed_count = db.query(FailedScan).filter(
        FailedScan.date == today
    ).count()

    db.close()

    return {
        "verified": verified_count,
        "failed": failed_count
    }


def log_failed_scan():
    db = SessionLocal()
    now = datetime.now()
    record = FailedScan(
        date=now.strftime("%Y-%m-%d"),
        time=now.strftime("%H:%M:%S")
    )
    db.add(record)
    db.commit()
    db.close()


def get_recent_attendance():
    db = SessionLocal()
    today = datetime.now().strftime("%Y-%m-%d")

    records = (
        db.query(Attendance)
        .filter(Attendance.date == today)
        .order_by(Attendance.time.desc())
        .limit(10)
        .all()
    )

    result = [
        {
            "student_id": r.student_id,
            "date": r.date,
            "time": r.time,
            "confidence": r.confidence
        }
        for r in records
    ]

    db.close()
    return result


def get_active_session():
    global _active_session_id
    return _active_session_id


def set_active_session():
    """Find today's AttendanceSession or create one, and cache its id."""
    global _active_session_id
    db = SessionLocal()
    now = datetime.now()
    today_str = now.strftime("%Y-%m-%d")

    session = db.query(AttendanceSession).filter_by(date=today_str).first()

    if not session:
        session = AttendanceSession(
            date=today_str,
            start_time=now,
            status="active"
        )
        db.add(session)
        db.commit()
        db.refresh(session)
        
        from routes.notifications import create_notification
        create_notification("🚀 Attendance session started.", "info")
    else:
        # If it already existed, just mark it active again
        if session.status != "active":
            session.status = "active"
            db.commit()

    _active_session_id = session.id
    db.close()
    return _active_session_id


def clear_active_session():
    """Mark the active session as completed (updates end_time) and clear memory."""
    global _active_session_id
    if _active_session_id is not None:
        db = SessionLocal()
        session = db.query(AttendanceSession).filter_by(id=_active_session_id).first()
        if session:
            session.end_time = datetime.now()
            session.status = "completed"
            
            # Auto-export if enabled
            from database.models import SystemSettings
            from routes.reports import generate_excel_for_session
            settings = db.query(SystemSettings).first()
            if settings and settings.auto_export:
                import os
                os.makedirs("exports", exist_ok=True)
                excel_bytes = generate_excel_for_session(session.id)
                with open(f"exports/session_{session.id}_autoexport.xlsx", "wb") as f:
                    f.write(excel_bytes.getvalue())
                
                from routes.notifications import create_notification
                create_notification("📊 Daily report automatically generated.", "success")
            
            db.commit()
            
            from routes.notifications import create_notification
            create_notification("🛑 Attendance session completed.", "info")
        db.close()
    _active_session_id = None


def already_marked(student_id, session_id=None):
    db = SessionLocal()
    today = datetime.now().strftime("%Y-%m-%d")

    existing = db.query(Attendance).filter_by(
        student_id=student_id,
        date=today
    ).first()

    db.close()
    return existing is not None


def mark_attendance(student, session_id=None):
    db = SessionLocal()
    now = datetime.now()

    record = Attendance(
        student_id=student.id,
        session_id=session_id,       # FK to AttendanceSession
        date=now.strftime("%Y-%m-%d"),
        time=now.strftime("%H:%M:%S"),
        confidence=95.0              # temporary fixed
    )

    db.add(record)
    db.commit()
    db.close()

    from routes.notifications import create_notification
    create_notification(f"✅ {student.name} marked present.", "success")
