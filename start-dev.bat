@echo off
echo 🚀 Starting AI Interview Assistant Development Environment
echo.

echo 📊 Starting Backend Server...
start "Backend" cmd /k "cd server && npm run dev"

echo ⏳ Waiting for backend to start...
timeout /t 3 /nobreak > nul

echo 🎨 Starting Frontend...
start "Frontend" cmd /k "npm start"

echo.
echo ✅ Development environment started!
echo 📡 Backend: http://localhost:4000
echo 🎨 Frontend: http://localhost:3000
echo.
echo Press any key to exit...
pause > nul