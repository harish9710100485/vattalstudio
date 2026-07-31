@echo off
echo ========================================
echo   Enquiry System - Starting...
echo ========================================
echo.

echo Starting Backend Server...
cd backend
call venv\Scripts\activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

pause