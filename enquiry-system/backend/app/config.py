import os
from dotenv import load_dotenv
import logging

# Try to load .env file, but don't fail if it doesn't exist
try:
    load_dotenv()
except:
    pass

logger = logging.getLogger(__name__)

class Config:
    # Database URL - Render will inject this via environment variable
    DATABASE_URL = os.getenv('DATABASE_URL', 'postgresql://postgres:1234@localhost:5432/enquiry_db')
    
    # If using Render's internal PostgreSQL, convert postgres:// to postgresql://
    if DATABASE_URL and DATABASE_URL.startswith('postgres://'):
        DATABASE_URL = DATABASE_URL.replace('postgres://', 'postgresql://', 1)
    
    # Security
    SECRET_KEY = os.getenv('SECRET_KEY', 'your-secret-key-change-this-in-production')
    ALGORITHM = os.getenv('ALGORITHM', 'HS256')
    ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv('ACCESS_TOKEN_EXPIRE_MINUTES', 1440))
    
    # File Upload
    UPLOAD_DIR = os.getenv('UPLOAD_DIR', './uploads')
    
    # Admin Credentials
    ADMIN_EMAIL = os.getenv('ADMIN_EMAIL', 'admin@vattalstudios.com')
    ADMIN_PASSWORD = os.getenv('ADMIN_PASSWORD', 'admin123')
    
    # CORS - Allow multiple origins
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
    
    @classmethod
    def validate(cls):
        """Validate required configuration"""
        if not cls.SECRET_KEY or cls.SECRET_KEY == 'your-secret-key-change-this-in-production':
            logger.warning("⚠️ Using default SECRET_KEY - Change this in production!")
        if not cls.ENCRYPTION_KEY:
            logger.warning("⚠️ ENCRYPTION_KEY not set - IDs will not be encrypted!")
        if cls.ENVIRONMENT == 'production' and cls.DATABASE_URL and 'localhost' in cls.DATABASE_URL:
            logger.warning("⚠️ Using localhost database in production!")

# Validate on import
Config.validate()