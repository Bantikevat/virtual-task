@echo off
title AURA — Starting all servers
echo.
echo  ██████████████████████████████████████
echo  █   AURA Virtual Workspace Starting  █
echo  ██████████████████████████████████████
echo.
echo  Frontend  →  http://localhost:5173
echo  Backend   →  http://localhost:5001
echo  AI Server →  http://localhost:5002
echo.
echo  Press Ctrl+C to stop everything.
echo.

cd /d "%~dp0"
npm run dev:all
pause
