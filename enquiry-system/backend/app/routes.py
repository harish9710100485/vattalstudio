from fastapi import APIRouter, Depends, HTTPException, status, Request, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_, desc
from typing import Optional
from datetime import datetime, timedelta
import json
import os
import shutil
import uuid
import logging
from fastapi import UploadFile, File

from .database import get_db
from .models import Enquiry, User, AuditLog
from .schemas import (
    EnquiryCreate, EnquiryResponse, LoginRequest, LoginResponse, 
    StatusUpdate, UserCreate, UserResponse
)
from .auth import verify_password, create_token, decode_token, hash_password
from .config import Config

# ===== IMPORT UTILITIES =====
# Check if encryption module exists, if not create fallback
try:
    from .utils.id_encryption import encrypt_id, decrypt_id
except ImportError:
    # Fallback: simple encoding if encryption module not available
    import base64
    def encrypt_id(id: int) -> str:
        return base64.urlsafe_b64encode(str(id).encode()).decode()
    def decrypt_id(encrypted: str) -> int:
        try:
            return int(base64.urlsafe_b64decode(encrypted.encode()).decode())
        except:
            raise ValueError("Invalid ID format")

router = APIRouter()
logger = logging.getLogger(__name__)

# ==================== AUDIT LOGGING ====================

def log_action(db: Session, user_id: int, action: str, table_name: str = None, 
               record_id: int = None, changes: dict = None, ip_address: str = None):
    """Log an action to audit log"""
    try:
        changes_str = json.dumps(changes) if changes else None
        audit_log = AuditLog(
            user_id=user_id,
            action=action,
            table_name=table_name,
            record_id=record_id,
            changes=changes_str,
            ip_address=ip_address
        )
        db.add(audit_log)
        db.commit()
        return audit_log
    except Exception as e:
        logger.error(f"⚠️ Audit log error: {e}")
        db.rollback()
        return None

# ==================== PUBLIC AUTH ROUTES ====================

@router.post("/auth/login", response_model=LoginResponse)
async def login(data: LoginRequest, request: Request, db: Session = Depends(get_db)):
    """Login endpoint - PUBLIC (no token required)"""
    try:
        logger.info(f"🔐 Login attempt for: {data.email}")
        
        user = db.query(User).filter(User.email == data.email).first()
        if not user:
            logger.warning(f"❌ User not found: {data.email}")
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        if not user.is_active:
            raise HTTPException(status_code=403, detail="Account disabled")
        
        is_valid = verify_password(data.password, user.password_hash)
        if not is_valid:
            logger.warning(f"❌ Invalid password for: {data.email}")
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        # Update last login
        user.last_login = datetime.now()
        db.commit()
        
        # Log login
        client_ip = request.client.host if request.client else "127.0.0.1"
        try:
            log_action(
                db=db,
                user_id=user.id,
                action="login",
                ip_address=client_ip
            )
        except Exception as e:
            logger.error(f"⚠️ Login audit log error: {e}")
            db.rollback()
        
        # Create tokens
        access_token = create_token({
            "sub": str(user.id),
            "email": user.email,
            "role": user.role
        })
        refresh_token = create_token({
            "sub": str(user.id),
            "type": "refresh"
        }, timedelta(days=7))
        
        logger.info(f"✅ Login successful: {user.email}")
        
        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
            "user": {
                "id": encrypt_id(user.id),
                "username": user.username,
                "email": user.email,
                "role": user.role
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Login error: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Login failed: {str(e)}"
        )

# ==================== PUBLIC ENQUIRY ROUTES ====================

@router.post("/enquiries", response_model=EnquiryResponse, status_code=201)
async def create_enquiry(
    data: EnquiryCreate, 
    request: Request,
    db: Session = Depends(get_db)
):
    """Submit a new enquiry - PUBLIC"""
    try:
        logger.info(f"📝 Creating new cinema enquiry...")
        logger.info(f"   Name: {data.name}")
        logger.info(f"   Email: {data.email}")
        logger.info(f"   Project Type: {data.project_type}")
        logger.info(f"   Services: {data.services}")
        
        # Validate captcha
        if not data.captcha:
            raise HTTPException(status_code=400, detail="Please verify you are not a robot")
        
        # Create enquiry
        enquiry = Enquiry(
            name=data.name,
            email=data.email,
            phone=data.phone,
            company=data.company,
            project_type=data.project_type,
            project_description=data.project_description,
            production_stage=data.production_stage,
            services=data.services,
            status="pending"
        )
        db.add(enquiry)
        db.commit()
        db.refresh(enquiry)
        logger.info(f"✅ Enquiry created with ID: {enquiry.id}")
        
        return {
            "id": enquiry.id,
            "name": enquiry.name,
            "email": enquiry.email,
            "phone": enquiry.phone,
            "company": enquiry.company,
            "project_type": enquiry.project_type,
            "project_description": enquiry.project_description,
            "production_stage": enquiry.production_stage,
            "services": enquiry.services,
            "file_url": enquiry.file_url,
            "status": enquiry.status,
            "created_by": enquiry.created_by,
            "created_at": enquiry.created_at.isoformat() if enquiry.created_at else None,
            "updated_at": enquiry.updated_at.isoformat() if enquiry.updated_at else None
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Create enquiry error: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create enquiry: {str(e)}"
        )

@router.post("/enquiries/upload")
async def upload_file(file: UploadFile = File(...)):
    """Upload a file for an enquiry"""
    try:
        allowed_types = ['application/pdf', 'application/msword', 
                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                        'image/png', 'image/jpeg']
        
        if file.content_type not in allowed_types:
            raise HTTPException(status_code=400, detail="File type not allowed")
        
        # Use configured upload directory
        upload_dir = Config.UPLOAD_DIR
        os.makedirs(upload_dir, exist_ok=True)
        
        # Generate unique filename
        file_extension = os.path.splitext(file.filename)[1]
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        file_path = os.path.join(upload_dir, unique_filename)
        
        # Save file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        logger.info(f"📎 File uploaded: {file.filename} -> {unique_filename}")
        
        return {
            "file_url": f"/uploads/{unique_filename}",
            "filename": file.filename,
            "size": os.path.getsize(file_path)
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ File upload error: {e}")
        raise HTTPException(status_code=500, detail="File upload failed")

# ==================== ADMIN ROUTES ====================

def get_current_user(request: Request, db: Session = Depends(get_db)):
    """Get current user from JWT token"""
    auth = request.headers.get("Authorization")
    if not auth or not auth.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing token")
    
    payload = decode_token(auth.replace("Bearer ", ""))
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    try:
        user_id = int(payload["sub"])
    except (ValueError, KeyError):
        raise HTTPException(status_code=401, detail="Invalid token payload")
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account disabled")
    
    return user

def require_admin(current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user

# ==================== ADMIN ENQUIRY ROUTES ====================

@router.get("/admin/enquiries")
async def get_enquiries(
    request: Request,
    page: int = Query(1, ge=1),
    per_page: int = Query(10, ge=1, le=100),
    search: Optional[str] = None,
    status: Optional[str] = None,
    project_type: Optional[str] = None,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Get all enquiries - ADMIN ONLY"""
    try:
        skip = (page - 1) * per_page
        
        logger.info(f"📋 Getting enquiries for admin: {current_user.email}")
        
        query = db.query(Enquiry)
        
        if search:
            query = query.filter(
                or_(
                    Enquiry.name.ilike(f"%{search}%"),
                    Enquiry.email.ilike(f"%{search}%"),
                    Enquiry.company.ilike(f"%{search}%")
                )
            )
        
        if status:
            query = query.filter(Enquiry.status == status)
        
        if project_type:
            query = query.filter(Enquiry.project_type == project_type)
        
        total = query.count()
        
        items = query.order_by(desc(Enquiry.created_at)).offset(skip).limit(per_page).all()
        
        result_items = []
        for enquiry in items:
            result_items.append({
                "id": encrypt_id(enquiry.id),
                "display_id": enquiry.id,
                "name": enquiry.name,
                "email": enquiry.email,
                "phone": enquiry.phone,
                "company": enquiry.company,
                "project_type": enquiry.project_type,
                "project_description": enquiry.project_description,
                "production_stage": enquiry.production_stage,
                "services": enquiry.services,
                "file_url": enquiry.file_url,
                "status": enquiry.status,
                "created_by": encrypt_id(enquiry.created_by) if enquiry.created_by else None,
                "created_at": enquiry.created_at.isoformat() if enquiry.created_at else None,
                "updated_at": enquiry.updated_at.isoformat() if enquiry.updated_at else None
            })
        
        # Log action
        client_ip = request.client.host if request.client else "127.0.0.1"
        try:
            log_action(
                db=db,
                user_id=current_user.id,
                action="view_enquiries",
                table_name="enquiries",
                ip_address=client_ip
            )
        except Exception as e:
            logger.error(f"⚠️ Audit log error: {e}")
            db.rollback()
        
        return {
            "items": result_items,
            "total": total,
            "page": page,
            "per_page": per_page,
            "total_pages": (total + per_page - 1) // per_page if total > 0 else 0
        }
        
    except Exception as e:
        logger.error(f"❌ Enquiries error: {e}")
        import traceback
        traceback.print_exc()
        return {
            "items": [],
            "total": 0,
            "page": page,
            "per_page": per_page,
            "total_pages": 0
        }

@router.get("/admin/enquiries/{enquiry_id}")
async def get_enquiry(
    enquiry_id: str,
    request: Request,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Get single enquiry - ADMIN ONLY"""
    try:
        decrypted_id = decrypt_id(enquiry_id)
        enquiry = db.query(Enquiry).filter(Enquiry.id == decrypted_id).first()
        if not enquiry:
            raise HTTPException(status_code=404, detail="Enquiry not found")
        
        client_ip = request.client.host if request.client else "127.0.0.1"
        try:
            log_action(
                db=db,
                user_id=current_user.id,
                action="view_enquiry_detail",
                table_name="enquiries",
                record_id=decrypted_id,
                ip_address=client_ip
            )
        except Exception as e:
            logger.error(f"⚠️ Audit log error: {e}")
            db.rollback()
        
        return {
            "id": encrypt_id(enquiry.id),
            "name": enquiry.name,
            "email": enquiry.email,
            "phone": enquiry.phone,
            "company": enquiry.company,
            "project_type": enquiry.project_type,
            "project_description": enquiry.project_description,
            "production_stage": enquiry.production_stage,
            "services": enquiry.services,
            "file_url": enquiry.file_url,
            "status": enquiry.status,
            "created_by": encrypt_id(enquiry.created_by) if enquiry.created_by else None,
            "created_at": enquiry.created_at.isoformat() if enquiry.created_at else None,
            "updated_at": enquiry.updated_at.isoformat() if enquiry.updated_at else None
        }
    except ValueError as e:
        logger.error(f"❌ Invalid ID format: {enquiry_id}")
        raise HTTPException(status_code=400, detail="Invalid ID format")
    except Exception as e:
        logger.error(f"❌ Get enquiry error: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/admin/enquiries/{enquiry_id}/status")
async def update_status(
    enquiry_id: str,
    data: StatusUpdate,
    request: Request,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Update enquiry status - ADMIN ONLY"""
    try:
        decrypted_id = decrypt_id(enquiry_id)
        enquiry = db.query(Enquiry).filter(Enquiry.id == decrypted_id).first()
        if not enquiry:
            raise HTTPException(status_code=404, detail="Enquiry not found")
        
        old_status = enquiry.status
        enquiry.status = data.status
        db.commit()
        db.refresh(enquiry)
        
        client_ip = request.client.host if request.client else "127.0.0.1"
        try:
            log_action(
                db=db,
                user_id=current_user.id,
                action="update_enquiry_status",
                table_name="enquiries",
                record_id=decrypted_id,
                changes={
                    "old_status": old_status,
                    "new_status": data.status
                },
                ip_address=client_ip
            )
        except Exception as e:
            logger.error(f"⚠️ Audit log error: {e}")
            db.rollback()
        
        return {
            "message": "Status updated", 
            "enquiry": {
                "id": encrypt_id(enquiry.id),
                "status": enquiry.status
            }
        }
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid ID format")
    except Exception as e:
        logger.error(f"❌ Update status error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/admin/enquiries/{enquiry_id}")
async def delete_enquiry(
    enquiry_id: str,
    request: Request,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Delete enquiry - ADMIN ONLY"""
    try:
        decrypted_id = decrypt_id(enquiry_id)
        enquiry = db.query(Enquiry).filter(Enquiry.id == decrypted_id).first()
        if not enquiry:
            raise HTTPException(status_code=404, detail="Enquiry not found")
        
        client_ip = request.client.host if request.client else "127.0.0.1"
        try:
            log_action(
                db=db,
                user_id=current_user.id,
                action="delete_enquiry",
                table_name="enquiries",
                record_id=decrypted_id,
                changes={"enquiry": f"{enquiry.name} - {enquiry.email}"},
                ip_address=client_ip
            )
        except Exception as e:
            logger.error(f"⚠️ Audit log error: {e}")
            db.rollback()
        
        db.delete(enquiry)
        db.commit()
        
        return {"message": "Enquiry deleted"}
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid ID format")
    except Exception as e:
        logger.error(f"❌ Delete enquiry error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/admin/stats")
async def get_stats(
    request: Request,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Get dashboard statistics - ADMIN ONLY"""
    try:
        logger.info(f"📊 Getting stats for admin: {current_user.email}")
        
        total = db.query(Enquiry).count()
        pending = db.query(Enquiry).filter(Enquiry.status == "pending").count()
        in_review = db.query(Enquiry).filter(Enquiry.status == "in_review").count()
        approved = db.query(Enquiry).filter(Enquiry.status == "approved").count()
        rejected = db.query(Enquiry).filter(Enquiry.status == "rejected").count()
        
        today = datetime.now().date()
        today_enquiries = db.query(Enquiry).filter(Enquiry.created_at >= today).count()
        
        stats = {
            "total": total,
            "pending": pending,
            "in_review": in_review,
            "approved": approved,
            "rejected": rejected,
            "today": today_enquiries
        }
        
        logger.info(f"📊 Stats result: {stats}")
        return stats
        
    except Exception as e:
        logger.error(f"❌ Stats error: {e}")
        import traceback
        traceback.print_exc()
        return {
            "total": 0,
            "pending": 0,
            "in_review": 0,
            "approved": 0,
            "rejected": 0,
            "today": 0
        }

# ==================== USER MANAGEMENT ROUTES ====================

@router.post("/admin/users", response_model=UserResponse)
async def create_user(
    data: UserCreate,
    request: Request,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Create a new user - ADMIN ONLY"""
    existing = db.query(User).filter(
        (User.email == data.email) | (User.username == data.username)
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="User already exists")
    
    new_user = User(
        username=data.username,
        email=data.email,
        password_hash=hash_password(data.password),
        role=data.role
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    client_ip = request.client.host if request.client else "127.0.0.1"
    try:
        log_action(
            db=db,
            user_id=current_user.id,
            action="create_user",
            table_name="users",
            record_id=new_user.id,
            changes={"email": new_user.email, "role": new_user.role},
            ip_address=client_ip
        )
    except Exception as e:
        logger.error(f"⚠️ Audit log error: {e}")
        db.rollback()
    
    return {
        "id": encrypt_id(new_user.id),
        "username": new_user.username,
        "email": new_user.email,
        "role": new_user.role,
        "is_active": new_user.is_active
    }

@router.get("/admin/users")
async def get_users(
    request: Request,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Get all users - ADMIN ONLY"""
    users = db.query(User).all()
    
    client_ip = request.client.host if request.client else "127.0.0.1"
    try:
        log_action(
            db=db,
            user_id=current_user.id,
            action="view_users",
            table_name="users",
            ip_address=client_ip
        )
    except Exception as e:
        logger.error(f"⚠️ Audit log error: {e}")
        db.rollback()
    
    return [
        {
            "id": encrypt_id(u.id),
            "username": u.username,
            "email": u.email,
            "role": u.role,
            "is_active": u.is_active
        }
        for u in users
    ]

@router.put("/admin/users/{user_id}/toggle")
async def toggle_user(
    user_id: str,
    request: Request,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Toggle user active status - ADMIN ONLY"""
    try:
        decrypted_id = decrypt_id(user_id)
        user = db.query(User).filter(User.id == decrypted_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        if user.id == current_user.id:
            raise HTTPException(status_code=400, detail="Cannot deactivate yourself")
        
        old_status = user.is_active
        user.is_active = not user.is_active
        db.commit()
        
        client_ip = request.client.host if request.client else "127.0.0.1"
        try:
            log_action(
                db=db,
                user_id=current_user.id,
                action="toggle_user",
                table_name="users",
                record_id=decrypted_id,
                changes={
                    "old_status": old_status,
                    "new_status": user.is_active
                },
                ip_address=client_ip
            )
        except Exception as e:
            logger.error(f"⚠️ Audit log error: {e}")
            db.rollback()
        
        return {"message": f"User {'activated' if user.is_active else 'deactivated'}"}
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid ID format")
    except Exception as e:
        logger.error(f"❌ Toggle user error: {e}")
        raise HTTPException(status_code=500, detail=str(e))