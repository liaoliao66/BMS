@echo off
REM Open PRD via English junction path (file:// works after md is embedded)
set "LINK=C:\Users\user\BMS"
set "REPO=%~dp0"
set "PRD=%LINK%\docs\versions\v1.0.0\prd.html"

if not exist "%LINK%\docs\versions\v1.0.0\prd.html" (
  if exist "%LINK%" rd "%LINK%" 2>nul
  mklink /J "%LINK%" "%REPO%"
)

REM Refresh embed from prd.md (optional; ignore errors)
powershell -NoProfile -ExecutionPolicy Bypass -File "%LINK%\docs\versions\v1.0.0\sync-prd-embed.ps1" >nul 2>&1

start "" "%PRD%"
exit /b 0
