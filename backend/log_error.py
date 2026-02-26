import os, sys, traceback
sys.path.insert(0, '.')
from sqlalchemy import create_engine, text

DATABASE_URL = os.environ.get('DATABASE_URL')
engine = create_engine(DATABASE_URL)
try:
    with engine.connect() as conn:
        conn.execute(text('ALTER TABLE attendance_sessions ADD CONSTRAINT unique_date UNIQUE (date);'))
        conn.commit()
    print('Added UNIQUE constraint successfully.')
except Exception as e:
    with open("db_error.txt", "w") as f:
        traceback.print_exc(file=f)
    print("Error logged to db_error.txt")
