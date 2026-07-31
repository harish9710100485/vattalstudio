import os
from dotenv import load_dotenv
import logging

# Try to load .env file
try:
    load_dotenv()
except:
    pass

logger = logging.getLogger(__name__)

class Config:
    # Database URL - from environment
    DATABASE_URL = os.getenv('DATABASE_URL')
    
    # Debug: Log what we're getting
    logger.info(f"🔍 DATABASE_URL from env: {DATABASE_URL}")
    
    # If not found, use fallback
    if not DATABASE_URL:
        logger.warning("⚠️ DATABASE_URL not found in environment! Using fallback.")
        DATABASE_URL = 'postgresql://postgres:1234@localhost:5432/enquiry_db'
    
    # Convert postgres:// to postgresql:// if needed
    if DATABASE_URL and DATABASE_URL.startswith('postgres://'):
        DATABASE_URL = DATABASE_URL.replace('postgres://', 'postgresql://', 1)
    
    # Security
    SECRET_KEY = os.getenv('SECRET_KEY', 'your-secret-key-change-this-in-production')
    ALGORITHM = os.getenv('ALGORITHM', 'HS256')
    ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv('ACCESS_TOKEN_EXPIRE_MINUTES', 1440))
    
    # File Upload
    UPLOAD_DIR = os.getenv('UPLOAD_DIR', './uploads')
    logger.info(f"📁 UPLOAD_DIR from env: {UPLOAD_DIR}")
    
    # Admin Credentials
    ADMIN_EMAIL = os.getenv('ADMIN_EMAIL', 'admin@vattalstudios.com')
    ADMIN_PASSWORD = os.getenv('ADMIN_PASSWORD', 'admin123')
    
    # CORS
    ALLOWED_ORIGINS = os.getenv('ALLOWED_ORIGINS', '').split(',') if os.getenv('ALLOWED_ORIGINS') else [
        "https://vattal-studio.vercel.app",
        "https://vattalstudio.vercel.app",
        "https://*.vercel.app",
        "http://localhost:3000",
        "http://localhost:5500",
        "http://localhost:8000",
    ]
    
    # Encryption
    ENCRYPTION_KEY = os.getenv('ENCRYPTION_KEY', '')
    
    # Environment
    ENVIRONMENT = os.getenv('ENVIRONMENT', 'development')
    logger.info(f"🌍 ENVIRONMENT from env: {ENVIRONMENT}")
