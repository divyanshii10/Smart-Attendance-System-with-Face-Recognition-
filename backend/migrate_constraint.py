import os
import sys

# Add backend directory to sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import text
from database.db import engine

def fix_unique_constraint():
    print("--- Starting Constraint Fix Migration ---")
    
    with engine.begin() as conn:
        try:
            print("[attendance_sessions] Attempting to drop old global date unique constraint...")
            conn.execute(text("ALTER TABLE attendance_sessions DROP CONSTRAINT IF EXISTS attendance_sessions_date_key"))
            print("Successfully dropped 'attendance_sessions_date_key'")
        except Exception as e:
            print(f"Failed to drop constraint. It might have a different name. Error: {e}")
            
        try:
            print("[attendance_sessions] Applying new composite unique constraint (date, admin_id)...")
            conn.execute(text("ALTER TABLE attendance_sessions ADD CONSTRAINT uq_attendance_session_date_admin UNIQUE (date, admin_id)"))
            print("Successfully added new composite unique constraint.")
        except Exception as e:
            print(f"Composite constraint logic failed. It may already exist. Error: {e}")

    print("--- Migration Finished ---")

if __name__ == "__main__":
    fix_unique_constraint()
