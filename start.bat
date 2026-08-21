@echo off
setlocal

cd /d "%~dp0"

echo Starting EduCore development environment...
echo Frontend: http://localhost:5173
echo API:      http://localhost:4000
echo.

start "EduCore API" /D "%~dp0apps\api" cmd /k "..\..\node_modules\.bin\tsx.cmd watch src\server.ts"
start "EduCore Web" /D "%~dp0apps\web" cmd /k "..\..\node_modules\.bin\vite.cmd --port 5173 --host"

echo API and Web development servers were started in separate windows.
echo Close those windows to stop EduCore.

endlocal
