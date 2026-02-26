from flask import Blueprint, jsonify, request
from flask_cors import CORS
from datetime import datetime
from database.db import SessionLocal
from database.models import Notification

notifications_bp = Blueprint("notifications", __name__)
CORS(notifications_bp)

def create_notification(message, n_type="info"):
    db = SessionLocal()
    try:
        new_notif = Notification(
            message=message,
            type=n_type,
            created_at=datetime.now(),
            is_read=False
        )
        db.add(new_notif)
        db.commit()
    finally:
        db.close()

@notifications_bp.route("", methods=["GET"])
def get_notifications():
    db = SessionLocal()
    try:
        # Fetch latest 20 notifications
        notifs = db.query(Notification).order_by(Notification.created_at.desc()).limit(20).all()
        result = []
        for n in notifs:
            result.append({
                "id": n.id,
                "message": n.message,
                "type": n.type,
                "created_at": n.created_at.isoformat(),
                "is_read": n.is_read
            })
        
        unread_count = db.query(Notification).filter_by(is_read=False).count()
        return jsonify({
            "notifications": result,
            "unread_count": unread_count
        })
    finally:
        db.close()

@notifications_bp.route("/<int:notif_id>/read", methods=["POST"])
def mark_read(notif_id):
    db = SessionLocal()
    try:
        notif = db.query(Notification).filter_by(id=notif_id).first()
        if notif:
            notif.is_read = True
            db.commit()
            return jsonify({"success": True})
        return jsonify({"error": "Not found"}), 404
    finally:
        db.close()

@notifications_bp.route("/read-all", methods=["POST"])
def mark_all_read():
    db = SessionLocal()
    try:
        db.query(Notification).filter_by(is_read=False).update({"is_read": True})
        db.commit()
        return jsonify({"success": True})
    finally:
        db.close()
