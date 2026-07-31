from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from enum import Enum

class EnquiryStatus(str, Enum):
    PENDING = "pending"
    IN_REVIEW = "in_review"
    APPROVED = "approved"
    REJECTED = "rejected"

class EnquiryCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str
    company: Optional[str] = None
    project_type: str
    project_description: str
    production_stage: Optional[str] = None
    services: str
    captcha: bool = True

class EnquiryResponse(BaseModel):
    id: int
    name: str
    email: str
    phone: str
    company: Optional[str] = None
    project_type: str
    project_description: str
    production_stage: Optional[str] = None
    services: str
    file_url: Optional[str] = None
    status: EnquiryStatus
    created_by: Optional[int] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class LoginResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: Optional[dict] = None

class StatusUpdate(BaseModel):
    status: EnquiryStatus

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    role: str = "employee"

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    role: str
    is_active: bool
    
    class Config:
        from_attributes = True