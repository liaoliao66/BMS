@echo off
chcp 65001 >nul
REM 直接打开 v1.0.0（经英文联接路径，避免中文路径乱码）
set "REPO=%~dp0"
set "LINK=C:\Users\user\BMS"
set "PAGE=prototype\versions\v1.0.0\index.html"

if not exist "%REPO%%PAGE%" (
  echo [错误] 未找到 %REPO%%PAGE%
  pause
  exit /b 1
)

if not exist "%LINK%\%PAGE%" (
  echo 正在创建英文短路径联接: %LINK%
  if exist "%LINK%" rd "%LINK%" 2>nul
  mklink /J "%LINK%" "%REPO%"
  if errorlevel 1 (
    echo [错误] 创建联接失败。仍尝试直接打开...
    start "" "%REPO%%PAGE%"
    pause
    exit /b 1
  )
)

echo 正在打开: %LINK%\%PAGE%
start "" "%LINK%\%PAGE%"
exit /b 0
