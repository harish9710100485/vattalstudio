from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
from datetime import datetime
import logging

from .config import Config
from .database import engine, Base, SessionLocal, test_connection
from .routes import router
from .models import User
from .auth import hash_password

# ===== LOGGING CONFIGURATION =====
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ===== DATABASE SETUP =====
logger.info("📊 Creating database tables...")
try:
    Base.metadata.create_all(bind=engine)
    logger.info("✅ Database tables created/verified")
except Exception as e:
    logger.error(f"❌ Database creation error: {e}")

# ===== CREATE DEFAULT USERS =====
def create_default_users():
    """Create default admin and employee users if they don't exist"""
    db = SessionLocal()
    try:
        # Create admin user
        admin = db.query(User).filter(User.email == Config.ADMIN_EMAIL).first()
        if not admin:
            admin = User(
                username="admin",
                email=Config.ADMIN_EMAIL,
                password_hash=hash_password(Config.ADMIN_PASSWORD),
                role="admin",
                is_active=True
            )
            db.add(admin)
            logger.info(f"✅ Admin user created: {Config.ADMIN_EMAIL}")
        else:
            logger.info(f"✅ Admin user already exists: {Config.ADMIN_EMAIL}")
        
        # Create employee user
        employee = db.query(User).filter(User.email == "employee@example.com").first()
        if not employee:
            employee = User(
                username="employee",
                email="employee@example.com",
                password_hash=hash_password("employee123"),
                role="employee",
                is_active=True
            )
            db.add(employee)
            logger.info("✅ Employee user created: employee@example.com")
        else:
            logger.info("✅ Employee user already exists: employee@example.com")
        
        db.commit()
    except Exception as e:
        logger.error(f"❌ Error creating users: {e}")
        db.rollback()
        import traceback
        traceback.print_exc()
    finally:
        db.close()

# Run default user creation
create_default_users()

# ===== TEST DATABASE CONNECTION =====
if test_connection():
    logger.info("✅ Database connection successful")
else:
    logger.warning("⚠️ Database connection failed - check DATABASE_URL")

# ===== CREATE FASTAPI APP =====
app = FastAPI(
    title="Vattal Studios API",
    version="1.0.0",
    description="Project Enquiry Management System",
    docs_url="/docs",
    redoc_url="/redoc"
)

# ===== CORS CONFIGURATION =====
allowed_origins = Config.ALLOWED_ORIGINS if Config.ALLOWED_ORIGINS else [
    "https://vattal-studio.vercel.app",
    "https://vattalstudio.vercel.app",
    "https://*.vercel.app",
    "http://localhost:3000",
    "http://localhost:5500",
    "http://localhost:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
)

logger.info(f"🌐 CORS allowed origins: {allowed_origins}")

# ===== CREATE UPLOADS DIRECTORY =====
try:
    os.makedirs(Config.UPLOAD_DIR, exist_ok=True)
    logger.info(f"📁 Upload directory: {Config.UPLOAD_DIR}")
except Exception as e:
    logger.error(f"❌ Failed to create upload directory: {e}")

# Mount static files for uploads
try:
    app.mount("/uploads", StaticFiles(directory=Config.UPLOAD_DIR), name="uploads")
except Exception as e:
    logger.warning(f"⚠️ Could not mount uploads directory: {e}")

# ===== INCLUDE ROUTES =====
app.include_router(router, prefix="/api/v1")

# ===== ROOT ENDPOINT =====
@app.get("/")
async def root():
    return {
        "message": "Vattal Studios API",
        "status": "running",
        "version": "1.0.0",
        "environment": Config.ENVIRONMENT,
        "docs": "/docs",
        "health": "/health"
    }

# ===== HEALTH CHECK =====
@app.get("/health")
async def health():
    db_status = "connected" if test_connection() else "disconnected"
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "database": db_status,
        "environment": Config.ENVIRONMENT,
        "upload_dir": Config.UPLOAD_DIR
    }

# ===== STARTUP EVENT =====
@app.on_event("startup")
async def startup():
    logger.info("=" * 60)
    logger.info("🚀 Vattal Studios API Started")
    logger.info(f"📡 Environment: {Config.ENVIRONMENT}")
    logger.info(f"🗄️  Database: {Config.DATABASE_URL.split('@')[0] if '@' in Config.DATABASE_URL else 'Configured'}")
    logger.info(f"📁 Uploads: {Config.UPLOAD_DIR}")
    logger.info(f"🔐 Admin: {Config.ADMIN_EMAIL}")
    logger.info("=" * 60)

# ===== SHUTDOWN EVENT =====
@app.on_event("shutdown")
async def shutdown():
    logger.info("👋 Vattal Studios API Shutting Down...")