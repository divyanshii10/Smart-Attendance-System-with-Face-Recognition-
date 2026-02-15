import face_recognition
import numpy as np
from PIL import Image
import base64
import io


def extract_face_encoding(image_base64: str):
    """
    Converts Base64 image → Face Encoding Vector
    """

    # Remove header
    if "," in image_base64:
        header, encoded = image_base64.split(",", 1)
    else:
        encoded = image_base64
        
    # Decode Base64 → bytes
    img_bytes = base64.b64decode(encoded)

    # Convert to image -> Loads image into Python
    image = Image.open(io.BytesIO(img_bytes))

    # Convert to numpy array
    rgb_image = np.array(image)

    # Extract face encodings
    encodings = face_recognition.face_encodings(rgb_image)

    if len(encodings) == 0:
        return None

    # Return first face encoding
    return encodings[0].tolist()