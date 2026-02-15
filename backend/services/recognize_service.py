import face_recognition
import numpy as np
import base64
import io
from PIL import Image

from database.db import SessionLocal
from database.models import Student


def recognize_face(image_base64):
    # Decode base64
    header, encoded = image_base64.split(",", 1)
    img_bytes = base64.b64decode(encoded)

    # Convert to image
    image = Image.open(io.BytesIO(img_bytes)).convert("RGB")
    image_np = np.array(image)

    # Extract live encoding
    live_encodings = face_recognition.face_encodings(image_np)

    if not live_encodings:
        return None

    live_encoding = live_encodings[0]

    # Load DB encodings
    db = SessionLocal()
    students = db.query(Student).all()

    known_encodings = []
    student_data = []

    for s in students:
        known_encodings.append(np.array(eval(s.face_encoding)))
        student_data.append(s)

    # Compare
    matches = face_recognition.compare_faces(
        known_encodings,
        live_encoding,
        tolerance=0.5
    )

    if True in matches:
        idx = matches.index(True)
        return student_data[idx]

    return None