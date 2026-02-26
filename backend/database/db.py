import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# PostgreSQL connection string
DATABASE_URL = os.environ.get("DATABASE_URL")

if not DATABASE_URL:
    raise RuntimeError(
        "DATABASE_URL environment variable is not set. "
        "Please set it to your PostgreSQL connection string, e.g.: "
        "postgresql://postgres:password@localhost:5432/attendance_db"
    )

# Render sometimes provides 'postgres://' URLs; SQLAlchemy 1.4+ requires 'postgresql://'
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# Create engine
engine = create_engine(DATABASE_URL, echo=False)

# Session for queries
SessionLocal = sessionmaker(bind=engine)

# Base class for models
Base = declarative_base()
