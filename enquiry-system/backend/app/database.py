from sqlalchemy import create_engine, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from .config import Config
import os
import logging

logger = logging.getLogger(__name__)

# Get DATABASE_URL from config
DATABASE_URL = Config.DATABASE_URL

logger.info(f"Attempting to connect to: {DATABASE_URL.split('@')[0] if '@' in DATABASE_URL else 'Invalid URL'}")

# Add SSL parameters for Render PostgreSQL
if 'render.com' in DATABASE_URL or 'onrender.com' in DATABASE_URL:
    logger.info("Detected Render PostgreSQL - adding SSL")
    if '?' not in DATABASE_URL:
        DATABASE_URL = f"{DATABASE_URL}?sslmode=require"
    elif 'sslmode' not in DATABASE_URL:
        DATABASE_URL = f"{DATABASE_URL}&sslmode=require"

# Create engine with connection pooling
try:
    engine = create_engine(
        DATABASE_URL,
        pool_pre_ping=True,
        pool_size=5,
        max_overflow=10,
        echo=False,
    )
    logger.info("Database engine created successfully")
except Exception as e:
    logger.error(f"Failed to create database engine: {e}")
    engine = None

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine) if engine else None
Base = declarative_base()

def get_db():
    """Dependency for FastAPI routes"""
    if SessionLocal is None:
        logger.error("Database not initialized")
        raise Exception("Database not initialized")
    
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
    if engine is None:
        logger.error("No database engine available")
        return False
    
    try:
        if SessionLocal is None:
            logger.error("No session available")
            return False
        
        db = SessionLocal()
        result = db.execute(text("SELECT 1"))
        db.close()
        logger.info("Database connection test successful")
        return True
    except Exception as e:
        logger.error(f"❌ Database connection test failed: {e}")
        return False
