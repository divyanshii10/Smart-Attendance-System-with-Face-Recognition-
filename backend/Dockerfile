# Use pre-built image with dlib + face_recognition already compiled
# This bypasses the 4-8GB RAM compilation problem entirely
FROM animcogn/face_recognition:cpu

WORKDIR /app

# Install only our app-specific dependencies (dlib/face_recognition already in base image)
COPY requirements_server.txt .
RUN pip install --no-cache-dir -r requirements_server.txt

COPY . .

# Render injects PORT as an environment variable
CMD gunicorn app:app --bind 0.0.0.0:${PORT:-10000} --timeout 120
