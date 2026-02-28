from flask import Blueprint, request, jsonify
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

from database.db import SessionLocal
from database.models import AdminUser
import jwt
import os
from datetime import datetime, timedelta

# Should ideally be loaded from environment, defaulting to dev secret
JWT_SECRET = os.environ.get("JWT_SECRET", "super-secret-attendance-key-1234")
JWT_ALGORITHM = "HS256"

auth_bp = Blueprint("auth", __name__)
CORS(auth_bp)

@auth_bp.route("/signup", methods=["POST"])
def signup():
    data = request.json
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not name or not email or not password:
        return jsonify({"success": False, "message": "Missing required fields"}), 400

    db = SessionLocal()
    try:
        # Check if email is already registered
        existing_user = db.query(AdminUser).filter(AdminUser.email == email).first()
        if existing_user:
            return jsonify({"success": False, "message": "Email already registered"}), 400

        # Hash password and create user
        password_hash = generate_password_hash(password)
        new_user = AdminUser(
            name=name,
            email=email,
            password_hash=password_hash,
            created_at=datetime.now()
        )
        
        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        user_data = {
            "id": str(new_user.id),
            "name": new_user.name,
            "email": new_user.email,
            "role": "admin"
        }

        # Generate JWT token
        payload = {
            "admin_id": new_user.id,
            "exp": datetime.utcnow() + timedelta(days=7) # Token expires in 7 days
        }
        token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

        return jsonify({
            "success": True, 
            "message": "User registered successfully",
            "user": user_data,
            "token": token
        })

    except Exception as e:
        db.rollback()
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        db.close()

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"success": False, "message": "Missing required fields"}), 400

    db = SessionLocal()
    try:
        user = db.query(AdminUser).filter(AdminUser.email == email).first()
        
        if not user or not check_password_hash(user.password_hash, password):
            return jsonify({"success": False, "message": "Invalid email or password"}), 401

        user_data = {
            "id": str(user.id),
            "name": user.name,
            "email": user.email,
            "role": "admin"
        }

        # Generate JWT token
        payload = {
            "admin_id": user.id,
            "exp": datetime.utcnow() + timedelta(days=7) # Token expires in 7 days
        }
        token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

        return jsonify({
            "success": True, 
            "message": "Login successful",
            "user": user_data,
            "token": token
        })

    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        db.close()
