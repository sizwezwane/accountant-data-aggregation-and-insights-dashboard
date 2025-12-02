from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()

# Get database URL from environment variable
# Default to PostgreSQL, fallback to SQLite if not available
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    # Try PostgreSQL first
    DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/accountant_dashboard"
    
# SQLite fallback for development
USE_SQLITE = os.getenv("USE_SQLITE", "false").lower() == "true"
if USE_SQLITE:
    DATABASE_URL = "sqlite:///./sql_app.db"
    print("Using SQLite database")
else:
    print(f"Using database: {DATABASE_URL.split('@')[0]}@...")

# Create engine with appropriate settings
if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(
        DATABASE_URL, 
        connect_args={"check_same_thread": False}
    )
else:
    engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
