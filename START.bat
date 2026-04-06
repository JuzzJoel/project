@echo off
REM Quick Start Script for Windows

echo.
echo ================================
echo 🚀 Auth App - Quick Starter
echo ================================
echo.
echo This will start everything you need:
echo   1. Docker containers (MySQL + phpMyAdmin)
echo   2. Backend server
echo   3. Frontend dev server
echo.

echo Starting Docker containers...
docker-compose up -d

if %ERRORLEVEL% neq 0 (
    echo ❌ Docker failed! Make sure Docker Desktop is running.
    pause
    exit /b 1
)

echo ✅ Docker containers started!
echo.
echo Waiting 3 seconds for database to be ready...
timeout /t 3 /nobreak

echo.
echo Opening terminals for backend and frontend...
echo.
echo Terminal 1 (Backend):
start cmd /k "cd backend && title Backend Server && pnpm dev"

timeout /t 2 /nobreak

echo Terminal 2 (Frontend):
start cmd /k "cd frontend && title Frontend Dev Server && pnpm dev"

echo.
echo ================================
echo ✅ All services starting!
echo ================================
echo.
echo 🌐 Soon available at:
echo    • App:       http://localhost:5173
echo    • Database:  http://localhost:8080
echo    • API:       http://localhost:5000
echo.
echo 📊 Database Viewer:
echo    • Login with user: root
echo    • Password: fuck_yall_niggas
echo.
echo 📝 See START.md or LOCAL_HOSTING_GUIDE.md for more info
echo.
pause
