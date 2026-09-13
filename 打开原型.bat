@echo off
REM Open prototype via English junction to avoid Chinese path ERR_FILE_NOT_FOUND
set "REPO=%~dp0"
set "LINK=C:\Users\user\BMS"

if not exist "%REPO%prototype\index.html" (
  echo [ERROR] prototype\index.html not found
  echo REPO: %REPO%
  pause
  exit /b 1
)

if not exist "%LINK%\prototype\index.html" (
  echo Creating junction: %LINK%
  if exist "%LINK%" rd "%LINK%" 2>nul
  mklink /J "%LINK%" "%REPO%"
  if errorlevel 1 (
    echo [ERROR] mklink failed. Run as Admin or:
    echo   mklink /J C:\Users\user\BMS "%REPO%"
    start "" "%REPO%prototype\index.html"
    pause
    exit /b 1
  )
)

echo Opening: %LINK%\prototype\index.html
start "" "%LINK%\prototype\index.html"
exit /b 0
