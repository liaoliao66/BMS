@echo off
chcp 65001 >nul
REM 用英文联接路径打开，避免「存档/产品」等中文路径在浏览器 file:// 下乱码报「系统找不到指定的文件」
set "REPO=%~dp0"
set "LINK=C:\Users\user\BMS"

if not exist "%REPO%prototype\index.html" (
  echo [错误] 未找到 prototype\index.html
  echo 当前目录: %REPO%
  pause
  exit /b 1
)

if not exist "%LINK%\prototype\index.html" (
  echo 正在创建英文短路径联接: %LINK%
  if exist "%LINK%" rd "%LINK%" 2>nul
  mklink /J "%LINK%" "%REPO%"
  if errorlevel 1 (
    echo [错误] 创建联接失败，请右键「以管理员身份运行」本 bat，或手动执行:
    echo   mklink /J C:\Users\user\BMS "%REPO%"
    echo.
    echo 仍尝试直接打开（可能因中文路径失败）...
    start "" "%REPO%prototype\index.html"
    pause
    exit /b 1
  )
)

echo 正在打开: %LINK%\prototype\index.html
start "" "%LINK%\prototype\index.html"
exit /b 0
