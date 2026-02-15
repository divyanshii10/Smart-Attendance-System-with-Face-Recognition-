from datetime import datetime
from database.db import SessionLocal
from database.models import Attendance

def mark_attendance(student):

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