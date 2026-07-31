# backend/app/__init__.py
from .models import Enquiry, User, AuditLog
from .database import engine, SessionLocal, Base
from .routes import router  # Export the router