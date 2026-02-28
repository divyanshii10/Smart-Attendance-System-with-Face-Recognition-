import os
import jwt
from functools import wraps
from flask import request, jsonify

# Should ideally be loaded from environment, defaulting to dev secret
JWT_SECRET = os.environ.get("JWT_SECRET", "super-secret-attendance-key-1234")
JWT_ALGORITHM = "HS256"

def require_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return jsonify({"success": False, "message": "Missing or invalid Authorization header"}), 401
            
        token = auth_header.split(" ")[1]
        
        try:
            payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
            current_admin_id = payload.get("admin_id")
            
            if not current_admin_id:
                return jsonify({"success": False, "message": "Invalid token payload"}), 401
                
        except jwt.ExpiredSignatureError:
            return jsonify({"success": False, "message": "Token has expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"success": False, "message": "Invalid token"}), 401
            
        # Add the extracted admin_id to the kwargs so the route handler can use it
        return f(current_admin_id=current_admin_id, *args, **kwargs)
        
    return decorated
