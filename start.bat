@echo off
title MindMirror - Psychological Web App
cls
echo ========================================================
echo   Starting MindMirror Psychological Web Application...
echo ========================================================
echo.

cd /d "%~dp0"

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo Node.js was not found in your PATH.
    echo Opening index.html directly in your default browser...
    start "" "index.html"
    exit /b
)

echo Starting local server on http://localhost:3000...
node server.js
pause
