import face_recognition
import numpy as np
import base64
import io
from PIL import Image

from database.db import SessionLocal
from database.models import Student


def recognize_face(image_base64):
    print(f"[recognize_face] Received image string of length: {len(image_base64) if image_base64 else 0}")
    # Decode base64
    header, encoded = image_base64.split(",", 1)
    img_bytes = base64.b64decode(encoded)

    # Convert to image
    image = Image.open(io.BytesIO(img_bytes)).convert("RGB")
    image_np = np.array(image)

    # Extract live encoding
    live_encodings = face_recognition.face_encodings(image_np)
    print(f"[recognize_face] Detected {len(live_encodings)} faces in the frame.")

    if not live_encodings:
        print("[recognize_face] ❌ No face detected in the webcam frame.")
        return None

    live_encoding = live_encodings[0]

    # Load DB encodings
    db = SessionLocal()
    try:
        students = db.query(Student).all()

        known_encodings = []
        student_data = []

        for s in students:
            known_encodings.append(np.array(eval(s.face_encoding)))
            student_data.append(s)

        # Compare
        if not known_encodings:
            print("[recognize_face] Zero known encodings in database.")
            return None

        # Static, stable tolerance (standard for dlib / face_recognition library)
        tolerance = 0.6
        distances = face_recognition.face_distance(known_encodings, live_encoding)
        
        print("[recognize_face] DB Students compared against:")
        for i, sd in enumerate(student_data):
            print(f"  - {sd.name}: Distance {distances[i]:.3f} (Is match: {distances[i] <= tolerance})")

        matches = list(distances <= tolerance)

        if True in matches:
            # Get the match with the lowest distance instead of the first True
            best_match_index = np.argmin(distances)
            if matches[best_match_index]:
                student = student_data[best_match_index]
                print(f"[recognize_face] ✅ Matched student: {student.name} (distance: {distances[best_match_index]:.3f})")
                return student

        print(f"[recognize_face] ❌ No match found within {tolerance:.3f} tolerance.")
        
        from routes.notifications import create_notification
        from datetime import datetime
        time_str = datetime.now().strftime("%H:%M")
        create_notification(f"⚠️ Unknown person detected at {time_str}", "warning")
        
        return None
    finally:
        db.close()