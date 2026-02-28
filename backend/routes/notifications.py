from flask import Blueprint, jsonify, request
from flask_cors import CORS
from datetime import datetime
from database.db import SessionLocal
from database.models import Notification
from middleware.auth import require_auth

notifications_bp = Blueprint("notifications", __name__)
CORS(notifications_bp)

def create_notification(message, n_type="info", admin_id=1):
    db = SessionLocal()
    try:
        # Notice: Assuming database model Notification has admin_id (which we should add in models.py)
        # Using a fallback if not available yet on this branch. We'll update models.py right after.
        new_notif = Notification(
            message=message,
            type=n_type,
            created_at=datetime.now(),
            is_read=False,
            admin_id=admin_id
        )
        db.add(new_notif)
        db.commit()
    finally:
        db.close()

@notifications_bp.route("", methods=["GET"])
@require_auth
def get_notifications(current_admin_id):
    db = SessionLocal()
    try:
        # Fetch latest 20 notifications
        notifs = db.query(Notification).filter_by(admin_id=current_admin_id).order_by(Notification.created_at.desc()).limit(20).all()
        result = []
        for n in notifs:
            result.append({
                "id": n.id,
                "message": n.message,
                "type": n.type,
                "created_at": n.created_at.isoformat(),
                "is_read": n.is_read
            })
        
        unread_count = db.query(Notification).filter_by(is_read=False, admin_id=current_admin_id).count()
        return jsonify({
            "notifications": result,
            "unread_count": unread_count
        })
    finally:
        db.close()

@notifications_bp.route("/<int:notif_id>/read", methods=["POST"])
@require_auth
def mark_read(current_admin_id, notif_id):
    db = SessionLocal()
    try:
        notif = db.query(Notification).filter_by(id=notif_id, admin_id=current_admin_id).first()
        if notif:
            notif.is_read = True
            db.commit()
            return jsonify({"success": True})
        return jsonify({"error": "Not found"}), 404
    finally:
        db.close()

@notifications_bp.route("/read-all", methods=["POST"])
@require_auth
def mark_all_read(current_admin_id):
    db = SessionLocal()
    try:
        db.query(Notification).filter_by(is_read=False, admin_id=current_admin_id).update({"is_read": True})
        db.commit()
        return jsonify({"success": True})
    finally:
        db.close()
