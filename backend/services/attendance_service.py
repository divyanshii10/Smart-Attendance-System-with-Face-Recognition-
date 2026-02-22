import uuid
from datetime import datetime
from database.db import SessionLocal
from database.models import Attendance, FailedScan

# Simple in-memory session tracking
_active_session_id = None
_marked_students_in_session = set()

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
    global _active_session_id, _marked_students_in_session
    _active_session_id = str(uuid.uuid4())
    _marked_students_in_session = set()
    return _active_session_id

def clear_active_session():
    global _active_session_id, _marked_students_in_session
    _active_session_id = None
    _marked_students_in_session = set()

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
    # No longer using in-memory tracking for duplicates

    db = SessionLocal()

    now = datetime.now()

    record = Attendance(
        student_id=student.id,
        date=now.strftime("%Y-%m-%d"),
        time=now.strftime("%H:%M:%S"),
        confidence=95.0   # temporary fixed
    )

    db.add(record)
    db.commit()
    db.close()
