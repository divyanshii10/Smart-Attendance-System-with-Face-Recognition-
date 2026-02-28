import os
import sys

# Add backend directory to sys.path so we can import from database
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import inspect, text
from database.db import engine, SessionLocal
from database.models import AdminUser

def run_migration():
    print("Starting database migration for Multi-Tenancy (admin_id)...")
    
    # 1. Create a default admin if none exists
    db = SessionLocal()
    default_admin = db.query(AdminUser).first()
    if not default_admin:
        print("No AdminUser found. Creating a default admin user...")
        from werkzeug.security import generate_password_hash
        from datetime import datetime
        default_admin = AdminUser(
            name="Default Admin",
            email="admin@example.com",
            password_hash=generate_password_hash("admin123"),
            created_at=datetime.now()
        )
        db.add(default_admin)
        db.commit()
        db.refresh(default_admin)
        print(f"Created default admin with ID: {default_admin.id} (admin@example.com / admin123)")
    
    admin_id = default_admin.id
    db.close()

    # 2. Alter tables to add admin_id safely using raw SQL
    inspector = inspect(engine)
    tables = [
        "students",
        "attendance_sessions",
        "failed_scans",
        "system_settings"
    ]
    
    with engine.begin() as conn:
        for table in tables:
            if table in inspector.get_table_names():
                columns = [c['name'] for c in inspector.get_columns(table)]
                if "admin_id" not in columns:
                    print(f"Adding admin_id column to {table}...")
                    conn.execute(text(f"ALTER TABLE {table} ADD COLUMN admin_id INTEGER DEFAULT {admin_id}"))
                    conn.execute(text(f"UPDATE {table} SET admin_id = {admin_id} WHERE admin_id IS NULL"))
                    conn.execute(text(f"ALTER TABLE {table} ALTER COLUMN admin_id SET NOT NULL"))
                    conn.execute(text(f"ALTER TABLE {table} ADD CONSTRAINT fk_{table}_admin_id FOREIGN KEY (admin_id) REFERENCES admin_users(id)"))
                    print(f"Successfully migrated {table}.")
                else:
                    print(f"Table {table} already has admin_id column. Skipping.")
    
    print("Migration completed successfully!")

if __name__ == "__main__":
    run_migration()
