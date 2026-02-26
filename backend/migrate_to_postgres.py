"""
migrate_to_postgres.py
======================
One-time migration script: copies all data from local SQLite (attendance.db)
to a target PostgreSQL database.

Usage (run from the backend/ directory):
    set DATABASE_URL=postgresql://postgres:<password>@localhost:5432/attendance_db
    python migrate_to_postgres.py

The script will:
  1. Read every row from attendance.db (students, attendance, failed_scans)
  2. Create the same tables in PostgreSQL (safe — skips if they already exist)
  3. Insert all rows, preserving original IDs
"""

import os
import sys
import sqlite3

from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

# ── Source: SQLite ─────────────────────────────────────────────────────────────
SQLITE_PATH = os.path.join(os.path.dirname(__file__), "attendance.db")

if not os.path.exists(SQLITE_PATH):
    print(f"[ERROR] SQLite database not found at: {SQLITE_PATH}")
    sys.exit(1)

sqlite_conn = sqlite3.connect(SQLITE_PATH)
sqlite_conn.row_factory = sqlite3.Row
sqlite_cur = sqlite_conn.cursor()

# ── Target: PostgreSQL ─────────────────────────────────────────────────────────
PG_URL = os.environ.get("DATABASE_URL")
if not PG_URL:
    print("[ERROR] DATABASE_URL environment variable is not set.")
    print("  Example: set DATABASE_URL=postgresql://postgres:pass@localhost:5432/attendance_db")
    sys.exit(1)

if PG_URL.startswith("postgres://"):
    PG_URL = PG_URL.replace("postgres://", "postgresql://", 1)

pg_engine = create_engine(PG_URL, echo=False)
PGSession = sessionmaker(bind=pg_engine)
pg_session = PGSession()


def create_tables():
    """Create tables in PostgreSQL if they don't already exist."""
    with pg_engine.connect() as conn:
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS students (
                id            SERIAL PRIMARY KEY,
                name          VARCHAR NOT NULL,
                roll_number   VARCHAR UNIQUE NOT NULL,
                department    VARCHAR NOT NULL,
                year          VARCHAR,
                email         VARCHAR,
                photo_path    VARCHAR,
                face_encoding TEXT
            )
        """))
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS attendance (
                id          SERIAL PRIMARY KEY,
                student_id  INTEGER,
                date        VARCHAR,
                time        VARCHAR,
                confidence  FLOAT
            )
        """))
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS failed_scans (
                id    SERIAL PRIMARY KEY,
                date  VARCHAR,
                time  VARCHAR
            )
        """))
        conn.commit()
    print("[✓] Tables created / verified in PostgreSQL.")


def migrate_students():
    sqlite_cur.execute("SELECT * FROM students")
    rows = sqlite_cur.fetchall()
    if not rows:
        print("[INFO] No students to migrate.")
        return

    with pg_engine.connect() as conn:
        for row in rows:
            conn.execute(text("""
                INSERT INTO students (id, name, roll_number, department, year, email, photo_path, face_encoding)
                VALUES (:id, :name, :roll_number, :department, :year, :email, :photo_path, :face_encoding)
                ON CONFLICT (id) DO NOTHING
            """), dict(row))
        # Sync the sequence so future inserts get correct IDs
        conn.execute(text("SELECT setval('students_id_seq', (SELECT MAX(id) FROM students))"))
        conn.commit()
    print(f"[✓] Migrated {len(rows)} student(s).")


def migrate_attendance():
    sqlite_cur.execute("SELECT * FROM attendance")
    rows = sqlite_cur.fetchall()
    if not rows:
        print("[INFO] No attendance records to migrate.")
        return

    with pg_engine.connect() as conn:
        for row in rows:
            conn.execute(text("""
                INSERT INTO attendance (id, student_id, date, time, confidence)
                VALUES (:id, :student_id, :date, :time, :confidence)
                ON CONFLICT (id) DO NOTHING
            """), dict(row))
        conn.execute(text("SELECT setval('attendance_id_seq', (SELECT MAX(id) FROM attendance))"))
        conn.commit()
    print(f"[✓] Migrated {len(rows)} attendance record(s).")


def migrate_failed_scans():
    sqlite_cur.execute("SELECT * FROM failed_scans")
    rows = sqlite_cur.fetchall()
    if not rows:
        print("[INFO] No failed_scans to migrate.")
        return

    with pg_engine.connect() as conn:
        for row in rows:
            conn.execute(text("""
                INSERT INTO failed_scans (id, date, time)
                VALUES (:id, :date, :time)
                ON CONFLICT (id) DO NOTHING
            """), dict(row))
        conn.execute(text("SELECT setval('failed_scans_id_seq', (SELECT MAX(id) FROM failed_scans))"))
        conn.commit()
    print(f"[✓] Migrated {len(rows)} failed scan record(s).")


if __name__ == "__main__":
    print("=" * 60)
    print("  Smart Attendance System — SQLite → PostgreSQL Migration")
    print("=" * 60)
    print(f"  Source : {SQLITE_PATH}")
    print(f"  Target : {PG_URL[:40]}...")
    print()

    create_tables()
    migrate_students()
    migrate_attendance()
    migrate_failed_scans()

    sqlite_conn.close()
    pg_session.close()

    print()
    print("[✓] Migration complete!")
