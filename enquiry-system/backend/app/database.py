from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from .config import Config
import os
import logging

logger = logging.getLogger(__name__)

# Get DATABASE_URL from config
DATABASE_URL = Config.DATABASE_URL

# Add SSL parameters for Render PostgreSQL
if 'render.com' in DATABASE_URL or 'onrender.com' in DATABASE_URL:
    # Render requires SSL
    if '?' not in DATABASE_URL:
        DATABASE_URL = f"{DATABASE_URL}?sslmode=require"
    elif 'sslmode' not in DATABASE_URL:
        DATABASE_URL = f"{DATABASE_URL}&sslmode=require"

logger.info(f"🔗 Database connection: {DATABASE_URL.split('@')[0] if '@' in DATABASE_URL else 'Configured'}")

# Create engine with connection pooling for production
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=20,
    echo=False,  # Set to True for debugging
    connect_args={
        "connect_timeout": 10,
    } if 'postgresql' in DATABASE_URL else {}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    """Dependency for FastAPI routes"""
    db = SessionLocal()
    try:
        yield db
    except Exception as e:
        logger.error(f"Database error: {e}")
        db.rollback()
        raise
    finally:
        db.close()

def test_connection():
    """Test database connection"""
    try:
        db = SessionLocal()
        db.execute("SELECT 1")
        db.close()
        return True
    except Exception as e:
        logger.error(f"Database connection test failed: {e}")
        return False