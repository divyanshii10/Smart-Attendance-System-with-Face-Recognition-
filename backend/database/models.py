from sqlalchemy import Column, Integer, String, Float
from database.db import Base


class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    roll_number = Column(String, unique=True, nullable=False)
    department = Column(String, nullable=False)

    photo_path = Column(String)
    face_encoding = Column(String)


class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer)
    date = Column(String)
    time = Column(String)
    confidence = Column(Float)


class FailedScan(Base):
    __tablename__ = "failed_scans"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(String)
    time = Column(String)