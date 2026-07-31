# Vattal Studios - Project Enquiry Management System

A comprehensive project enquiry management system built for Vattal Studios, a cinema and film production company. This system streamlines the process of managing project enquiries from clients, providing a professional platform for both customers and internal teams.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Setup Instructions](#setup-instructions)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Test Credentials](#test-credentials)
- [Load Testing Results](#load-testing-results)
- [Project Structure](#project-structure)
- [Incomplete Features](#incomplete-features)
- [Assumptions](#assumptions)
- [Troubleshooting](#troubleshooting)

---

## Overview

Vattal Studios Project Enquiry Management System is a full-stack web application designed to handle film and cinema project enquiries. The system provides:

- A professional customer-facing enquiry form for film projects
- Admin dashboard with real-time analytics and charts
- Role-based access control for team members
- Secure authentication and authorization
- Comprehensive audit logging
- File upload capabilities

---

## Features

### Customer Features
- Submit film project enquiries with detailed specifications
- Upload project-related files (PDF, DOC, DOCX, PNG, JPG)
- Receive confirmation with reference ID
- Responsive and mobile-friendly interface

### Admin Features
- Dashboard with real-time statistics and charts
- View and manage all enquiries
- Filter enquiries by status and project type
- Update enquiry status (Pending, In Review, Approved, Rejected)
- Delete enquiries
- Audit logging for all admin actions
- Role-based access control

### Employee Features
- Submit new enquiries
- View their own enquiry history
- Limited access to admin functions

### Security Features
- JWT-based authentication
- Password hashing with bcrypt
- Role-based authorization
- Input validation and sanitization
- CORS configuration
- Audit logging
- Rate limiting

---

## Tech Stack

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Python | 3.11+ | Programming language |
| FastAPI | 0.104.1 | Web framework |
| SQLAlchemy | 2.0.31 | ORM |
| PostgreSQL | 18 | Database |
| pg8000 | 1.30.5 | PostgreSQL driver |
| python-jose | 3.3.0 | JWT handling |
| passlib | 1.7.4 | Password hashing |
| pydantic | 2.5.0 | Data validation |

### Frontend
| Technology | Purpose |
|------------|---------|
| HTML5 | Structure |
| Tailwind CSS | Styling and responsiveness |
| JavaScript | Functionality |
| Chart.js | Data visualization |
| Font Awesome | Icons |

### Testing & Monitoring
| Tool | Purpose |
|------|---------|
| k6 | Load testing |
| Swagger UI | API documentation |

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                           Client Browser                           │
└─────────────────────────────┬───────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      Frontend (Static Files)                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐   │
│  │  index.html  │  │  login.html │  │  dashboard.html         │   │
│  │  (Enquiry    │  │  (Admin     │  │  (Analytics & Charts)   │   │
│  │   Form)      │  │   Login)    │  │                         │   │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘   │
└─────────────────────────────┬───────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     Backend API (FastAPI)                          │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │                        Routes                                │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │  │
│  │  │  /auth/login │  │  /enquiries  │  │  /admin/*        │  │  │
│  │  └──────────────┘  └──────────────┘  └──────────────────┘  │  │
│  └─────────────────────────────────────────────────────────────┘  │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │                       Services                              │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │  │
│  │  │     Auth     │  │   Enquiry    │  │  Audit           │  │  │
│  │  │   Service    │  │   Service    │  │  Service         │  │  │
│  │  └──────────────┘  └──────────────┘  └──────────────────┘  │  │
│  └─────────────────────────────────────────────────────────────┘  │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │                      Security                               │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │  │
│  │  │     JWT      │  │  Password    │  │     CORS         │  │  │
│  │  │   Handler    │  │  Handler     │  │  Middleware      │  │  │
│  │  └──────────────┘  └──────────────┘  └──────────────────┘  │  │
│  └─────────────────────────────────────────────────────────────┘  │
└─────────────────────────────┬───────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      PostgreSQL Database                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐   │
│  │  enquiries  │  │    users    │  │      audit_logs          │   │
│  │   Table     │  │   Table     │  │       Table              │   │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Setup Instructions

### Prerequisites
- Python 3.11 or higher
- PostgreSQL 18 or higher
- WAMP (for local development)
- Git

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/enquiry-system.git
cd enquiry-system
```

### Step 2: Backend Setup

#### Create Virtual Environment

```bash
cd backend
python -m venv venv

# On Windows
venv\Scripts\activate

# On macOS/Linux
source venv/bin/activate
```

#### Install Dependencies

```bash
pip install -r requirements.txt
```

#### Environment Variables

Create a `.env` file in the backend directory:

```env
DATABASE_URL=postgresql://postgres:1234@localhost:5432/enquiry_db
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
UPLOAD_DIR=./uploads
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
```

### Step 3: Database Setup

#### Create Database

```sql
CREATE DATABASE enquiry_db;
```

#### Run Migrations

```bash
python -c "from app.database import engine, Base; Base.metadata.create_all(bind=engine)"
```

#### Insert Admin User

```sql
\c enquiry_db;
INSERT INTO users (username, email, password_hash, role) 
VALUES ('admin', 'admin@example.com', 'admin123', 'admin');
```

---

## Running the Application

### Start Backend Server

```bash
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Access Frontend

Open your browser and navigate to:
```
http://localhost/enquiry-system/frontend/
```

### API Documentation

Swagger UI is available at:
```
http://localhost:8000/docs
```

---

## API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/v1/auth/login` | Login and get JWT token | No |
| GET | `/api/v1/auth/me` | Get current user info | Yes |

### Public Enquiry Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/v1/enquiries` | Submit a new enquiry | No |
| POST | `/api/v1/enquiries/upload` | Upload file for enquiry | No |

### Admin Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/v1/admin/enquiries` | Get all enquiries (paginated) | Yes (Admin) |
| GET | `/api/v1/admin/enquiries/{id}` | Get single enquiry | Yes (Admin) |
| PUT | `/api/v1/admin/enquiries/{id}/status` | Update enquiry status | Yes (Admin) |
| DELETE | `/api/v1/admin/enquiries/{id}` | Delete enquiry | Yes (Admin) |
| GET | `/api/v1/admin/stats` | Get dashboard statistics | Yes (Admin) |
| GET | `/api/v1/admin/audit-logs` | Get audit logs | Yes (Admin) |
| POST | `/api/v1/admin/users` | Create new user | Yes (Admin) |
| GET | `/api/v1/admin/users` | Get all users | Yes (Admin) |
| PUT | `/api/v1/admin/users/{id}/toggle` | Toggle user status | Yes (Admin) |

### Example API Requests

#### Login

```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'
```

#### Submit Enquiry

```bash
curl -X POST http://localhost:8000/api/v1/enquiries \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1 234-567-8900",
    "company": "ABC Productions",
    "project_type": "feature-film",
    "project_description": "A feature film about...",
    "production_stage": "pre-production",
    "services": "full-production",
    "captcha": true
  }'
```

#### Get Enquiries (Admin)

```bash
curl -X GET http://localhost:8000/api/v1/admin/enquiries?page=1&per_page=10 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@example.com | admin123 |
| Employee | employee@example.com | employee123 |

---

## Load Testing Results

### Test Configuration

| Parameter | Value |
|-----------|-------|
| **Tool** | k6 |
| **Test Date** | July 30, 2026 |
| **Base URL** | http://localhost:8000/api/v1 |
| **Test Duration** | 4 minutes |
| **Users** | 10 → 50 → 100 (ramp-up) |

### Test Scenarios

| Scenario | Endpoint | Method | Authentication |
|----------|----------|--------|----------------|
| Login | /auth/login | POST | None |
| Get Enquiries | /admin/enquiries | GET | Admin Token |
| Get Stats | /admin/stats | GET | Admin Token |
| Create Enquiry | /enquiries | POST | None |

### Performance Metrics

| Metric | Value | Status |
|--------|-------|--------|
| **Total Requests** | 9,750 | - |
| **Success Rate** | 99.82% | Passed (>99%) |
| **Average Response Time** | 122ms | Passed |
| **95th Percentile Response** | 212ms | Passed (<500ms) |
| **Error Rate** | 0.18% | Passed (<1%) |

### Endpoint Performance

| Endpoint | Avg (ms) | P95 (ms) | Success Rate |
|----------|----------|----------|--------------|
| Login | 89 | 156 | 99.88% |
| Get Enquiries | 134 | 245 | 99.88% |
| Get Stats | 78 | 134 | 99.92% |
| Create Enquiry | 189 | 312 | 99.60% |

### Recommendations

1. **Database Indexes** - Already implemented on status, email, and created_at
2. **Pagination** - Already implemented (10 items per page)
3. **Caching** - Consider Redis for frequently accessed data
4. **Connection Pooling** - Already configured with SQLAlchemy

---

## Project Structure

```
enquiry-system/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py          # FastAPI application entry point
│   │   ├── config.py        # Configuration management
│   │   ├── database.py      # Database connection and session management
│   │   ├── models.py        # SQLAlchemy models (Enquiry, User, AuditLog)
│   │   ├── schemas.py       # Pydantic schemas for request/response
│   │   ├── routes.py        # API route definitions
│   │   └── auth.py          # Authentication functions (JWT, password)
│   ├── uploads/             # Uploaded files storage
│   ├── requirements.txt     # Python dependencies
│   └── .env                 # Environment variables
├── frontend/
│   ├── index.html           # Customer enquiry form
│   ├── login.html           # Admin login page
│   ├── dashboard.html       # Admin dashboard with charts
│   ├── report.html          # Enquiry reports page
│   ├── employee.html        # Employee restricted page
│   └── assets/
│       ├── css/
│       │   └── style.css    # Custom styles
│       └── js/
│           ├── api.js       # API client
│           ├── auth.js      # Authentication functions
│           ├── enquiry.js   # Enquiry form handling
│           ├── dashboard.js # Dashboard functions
│           ├── report.js    # Report page functions
│           ├── employee.js  # Employee page functions
│           ├── utils.js     # Utility functions
│           └── chatbot.js   # Chatbot functionality
├── database/
│   └── init.sql             # Database initialization script
├── load-tests/
│   ├── k6-script.js         # k6 load test script
│   └── results.json         # Load test results
├── README.md                # This file
├── requirements.txt         # Python dependencies
└── .gitignore               # Git ignore file
```

---

## Incomplete Features

The following features were not implemented due to time constraints:

| Feature | Priority | Reason |
|---------|----------|--------|
| Email Notifications | Medium | Requires email service integration |
| Advanced Search | Low | Full-text search across all fields |
| Bulk Actions | Low | Bulk status updates and deletions |
| PDF Export | Low | Export enquiry details as PDF |
| Two-Factor Authentication | Low | Additional security for admin accounts |

---

## Assumptions

| Area | Assumption |
|------|------------|
| **User Load** | Less than 1000 concurrent users |
| **Data Volume** | Less than 100,000 enquiries |
| **File Types** | PDF, DOC, DOCX, PNG, JPG |
| **File Size** | Maximum 5MB |
| **Admin Users** | 1-5 users |
| **Availability** | 99.9% uptime |
| **Timezone** | UTC for timestamps |
| **Language** | English only |

---

## Troubleshooting

### Backend Won't Start

**Issue**: `Address already in use`

**Solution**:
```bash
# Check if port 8000 is in use
netstat -ano | findstr :8000

# Kill the process (replace PID)
taskkill /PID 12345 /F

# Or use a different port
uvicorn app.main:app --reload --host 0.0.0.0 --port 8080
```

### Database Connection Issues

**Issue**: `No module named 'psycopg2'`

**Solution**:
```bash
pip install psycopg2-binary
```

**Issue**: `password authentication failed`

**Solution**:
1. Check your PostgreSQL password in `.env`
2. Reset PostgreSQL password if needed

### CORS Issues

**Issue**: `No 'Access-Control-Allow-Origin' header`

**Solution**:
Ensure CORS middleware is configured in `main.py`:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost", "http://127.0.0.1"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 404 Not Found

**Issue**: API endpoints returning 404

**Solution**:
1. Check if backend is running
2. Verify the route is registered
3. Check the URL prefix (`/api/v1`)

---

## License

This project is proprietary and confidential.

---

## Author

**Harish Perumal**

---

## Acknowledgments

- FastAPI for the excellent web framework
- Tailwind CSS for the styling system
- Chart.js for data visualization
- PostgreSQL for the robust database

---

**Vattal Studios - All Under One Roof** 