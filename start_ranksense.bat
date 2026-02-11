@echo off
echo Starting RankSense AI...

:: Start Backend
echo Ensuring dependencies...
python -m pip install python-docx
echo Launching Backend (Port 8000)...
start "RankSense Backend" cmd /k "python -m uvicorn main:app --host 0.0.0.0 --port 8000"

:: Wait a moment for backend to initialize
timeout /t 3

:: Start Frontend (Simple HTTP Server)
echo Launching Frontend (Port 3000)...
start "RankSense Frontend" cmd /k "python frontend_server.py"

echo.
echo System Active.
echo Backend: http://127.0.0.1:8000
echo Frontend: http://localhost:3000
echo.
echo If "Disconnected" appears in UI, check the Backend terminal for errors.
echo.
pause
