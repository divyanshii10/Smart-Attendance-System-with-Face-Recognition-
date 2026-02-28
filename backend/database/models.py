from sqlalchemy import Column, Integer, String, Float, Text, DateTime, Boolean, ForeignKey
from database.db import Base


class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    roll_number = Column(String, unique=True, nullable=False)
    department = Column(String, nullable=False)
    year = Column(String, nullable=True)
    email = Column(String, nullable=True)
    admin_id = Column(Integer, ForeignKey("admin_users.id"), nullable=False, default=1)

    # Image stored as base64-encoded string — no filesystem writes
    photo_data = Column(Text, nullable=True)
    face_encoding = Column(Text)


class AttendanceSession(Base):
    """One row per attendance session (one per class / day)."""
    __tablename__ = "attendance_sessions"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(String, unique=True, nullable=False)  # "YYYY-MM-DD" — ONE session per day

    start_time = Column(DateTime, nullable=True)
    end_time = Column(DateTime, nullable=True)
    status = Column(String(20), default="active")  # active | completed
    admin_id = Column(Integer, ForeignKey("admin_users.id"), nullable=False, default=1)


class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, nullable=True)   # plain int — references students.id
    session_id = Column(Integer, nullable=True)   # plain int — references attendance_sessions.id
    date = Column(String)
    time = Column(String)
    confidence = Column(Float)
    admin_id = Column(Integer, ForeignKey("admin_users.id"), nullable=False, default=1)


class FailedScan(Base):
    __tablename__ = "failed_scans"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(String)
    time = Column(String)
    admin_id = Column(Integer, ForeignKey("admin_users.id"), nullable=False, default=1)


class SystemSettings(Base):
    __tablename__ = "system_settings"

    id = Column(Integer, primary_key=True, index=True)
    confidence_threshold = Column(Float, default=0.85)
    auto_export = Column(Boolean, default=False)
    admin_id = Column(Integer, ForeignKey("admin_users.id"), nullable=False, default=1)


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    message = Column(String(255), nullable=False)
    type = Column(String(50), nullable=False) # 'success', 'warning', 'info'
    created_at = Column(DateTime, nullable=False)
    is_read = Column(Boolean, default=False)
    admin_id = Column(Integer, ForeignKey("admin_users.id"), nullable=False, default=1)


class AdminUser(Base):
    __tablename__ = "admin_users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    created_at = Column(DateTime)

