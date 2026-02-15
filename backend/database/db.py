from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# SQLite database URL
DATABASE_URL = "sqlite:///attendance.db"

# Create DB engine
engine = create_engine(DATABASE_URL, echo=True)

# Session for queries
SessionLocal = sessionmaker(bind=engine)

# Base class for models
Base = declarative_base()