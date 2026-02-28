import os
from flask import Blueprint, jsonify, request, send_file
from database.db import SessionLocal
from database.models import SystemSettings
from middleware.auth import require_auth

settings_bp = Blueprint("settings", __name__)

def get_or_create_settings(db, admin_id):
    settings = db.query(SystemSettings).filter_by(admin_id=admin_id).first()
    if not settings:
        settings = SystemSettings(confidence_threshold=0.85, auto_export=False, admin_id=admin_id)
        db.add(settings)
        db.commit()
    return settings

@settings_bp.route("", methods=["GET"])
@require_auth
def get_settings(current_admin_id):
    db = SessionLocal()
    try:
        settings = get_or_create_settings(db, current_admin_id)
        return jsonify({
            "confidenceThreshold": settings.confidence_threshold,
            "autoExport": settings.auto_export
        })
    finally:
        db.close()

@settings_bp.route("", methods=["POST"])
@require_auth
def update_settings(current_admin_id):
    db = SessionLocal()
    try:
        data = request.json
        settings = get_or_create_settings(db, current_admin_id)
        
        if "confidenceThreshold" in data:
            settings.confidence_threshold = float(data["confidenceThreshold"])
        if "autoExport" in data:
            settings.auto_export = bool(data["autoExport"])
            
        db.commit()
        return jsonify({
            "message": "Settings updated successfully",
            "confidenceThreshold": settings.confidence_threshold,
            "autoExport": settings.auto_export
        })
    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()

@settings_bp.route("/backup", methods=["GET"])
@require_auth
def backup_database(current_admin_id):
    # In a real PostgreSQL environment, you would use pg_dump logic here. 
    # For simplicity and given the user request mentions "Return: PostgreSQL -> exported dump",
    # let's trigger a pg_dump to a temp file and serve it.
    
    # Check if we are running sqlite or postgresql
    database_url = os.environ.get("DATABASE_URL", "")
    
    # If it's the old sqlite file (fallback)
    if "sqlite" in database_url or not database_url:
        if os.path.exists("attendance.db"):
            return send_file("../attendance.db", as_attachment=True, download_name="attendance_backup.db")
        return jsonify({"error": "No local sqlite database found"}), 404
        
    # If PostgreSQL
    try:
        import subprocess
        # Parse the DATABASE_URL to get credentials a simple way
        # e.g. postgresql://user:pass@host:port/dbname
        
        # We will attempt pg_dump using connection string
        # Warning: Requires pg_dump to be installed on the host system.
        # This works if Postgres is installed locally.
        
        dump_file = "postgres_backup.sql"
        # Run pg_dump command (you might need to ensure credentials are correct)
        # For security, standard pg_dump might prompt, but we can try to pass string if pg_dump supports it or use PGPASSWORD
        
        # To avoid complex username/password parsing in Python, use the standard url format supported by pg_dump
        process = subprocess.run(
            ["pg_dump", "-d", database_url, "-f", dump_file, "--clean", "--if-exists", "--no-owner"],
            capture_output=True, text=True
        )
        
        if process.returncode != 0:
            return jsonify({"error": f"pg_dump failed: {process.stderr}"}), 500
            
        return send_file(f"../{dump_file}", as_attachment=True, download_name="postgres_backup.sql")
    except Exception as e:
        return jsonify({"error": str(e)}), 500
