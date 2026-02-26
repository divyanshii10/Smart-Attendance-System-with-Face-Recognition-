import os, sys
sys.path.insert(0, '.')
from database.db import SessionLocal, engine
from database.models import AttendanceSession, Attendance
from sqlalchemy import text

db = SessionLocal()

# Find all sessions for today
today_sessions = db.query(AttendanceSession).filter_by(date='2026-02-26').order_by(AttendanceSession.id).all()

if len(today_sessions) > 1:
    primary_session = today_sessions[0]
    duplicate_sessions = today_sessions[1:]
    
    # 1. Reassign all attendance records from duplicates to primary
    duplicate_ids = [s.id for s in duplicate_sessions]
    print(f"Consolidating sessions {duplicate_ids} into session {primary_session.id}")
    
    db.query(Attendance).filter(Attendance.session_id.in_(duplicate_ids)).update(
        {"session_id": primary_session.id}, synchronize_session=False
    )
    
    # 2. Delete duplicates
    for s in duplicate_sessions:
        db.delete(s)
        
    db.commit()

db.close()

# Now apply constraint
try:
    with engine.connect() as conn:
        conn.execute(text('ALTER TABLE attendance_sessions ADD CONSTRAINT unique_date UNIQUE (date);'))
        conn.commit()
    print('Added UNIQUE constraint successfully.')
except Exception as e:
    print(f"Error ADD CONSTRAINT: {e}")
