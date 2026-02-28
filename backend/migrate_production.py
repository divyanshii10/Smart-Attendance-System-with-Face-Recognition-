import os
import sys

# Add backend directory to sys.path so we can import from database
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import inspect, text
from database.db import engine, SessionLocal
from database.models import AdminUser

def run_production_migration():
    print("--- Starting Production Multi-Tenant Migration ---")
    
    db = SessionLocal()
    default_admin = db.query(AdminUser).first()
    if not default_admin:
        print("CRITICAL: No AdminUser found in the database!")
        print("You must create at least one Admin account (via Frontend Signup) before running this migration.")
        print("The migration needs a default admin to assign all existing records to.")
        db.close()
        return
        
    admin_id = default_admin.id
    db.close()
    
    print(f"Found default admin. Assigning existing records to Admin ID: {admin_id}")

    inspector = inspect(engine)
    
    # All tables that require the admin_id foreign key
    tables_to_migrate = [
        "students",
        "attendance_sessions",
        "attendance",
        "system_settings",
        "failed_scans",
        "notifications"
    ]
    
    with engine.begin() as conn:
        for table in tables_to_migrate:
            if table in inspector.get_table_names():
                columns = [c['name'] for c in inspector.get_columns(table)]
                if "admin_id" not in columns:
                    print(f"[{table}] Adding admin_id column...")
                    
                    # 1. Add nullable column
                    conn.execute(text(f"ALTER TABLE {table} ADD COLUMN admin_id INTEGER DEFAULT {admin_id}"))
                    
                    # 2. Backfill existing rows
                    conn.execute(text(f"UPDATE {table} SET admin_id = {admin_id} WHERE admin_id IS NULL"))
                    
                    # 3. Apply constraints
                    conn.execute(text(f"ALTER TABLE {table} ALTER COLUMN admin_id SET NOT NULL"))
                    conn.execute(text(f"ALTER TABLE {table} ADD CONSTRAINT fk_{table}_admin_id FOREIGN KEY (admin_id) REFERENCES admin_users(id)"))
                    
                    print(f"[{table}] Success!")
                else:
                    print(f"[{table}] Already migrated. Skipping.")
            else:
                print(f"[{table}] WARNING: Table does not exist in the database.")
                
    print("--- Production Migration Completed Successfully! ---")

if __name__ == "__main__":
    run_production_migration()
