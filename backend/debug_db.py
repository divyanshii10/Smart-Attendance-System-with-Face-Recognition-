import sys, os, traceback
sys.path.insert(0, '.')
os.environ.pop('DATABASE_URL', None)

from database.db import SessionLocal, engine, Base
from database import models
Base.metadata.create_all(bind=engine)

db = SessionLocal()
try:
    n = db.query(models.Student).count()
    print(f"Student count: {n}")
except Exception as e:
    with open('debug_error.txt', 'w') as f:
        traceback.print_exc(file=f)
        f.write(f"\nException: {type(e).__name__}: {e}\n")
    print("Error written to debug_error.txt")
finally:
    db.close()
