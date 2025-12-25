@echo off
chcp 65001 >nul
setlocal

pushd "%~dp0"

echo [1/6] Kill node (if running)...
taskkill /F /IM node.exe >nul 2>&1

echo [2/6] Remove .next...
if exist ".next" rmdir /s /q ".next"

echo [3/6] Remove node_modules and lock...
if exist "node_modules" rmdir /s /q "node_modules"
if exist "package-lock.json" del /f /q "package-lock.json"

echo [4/6] Install deps...
call npm cache verify
call npm install

echo [5/6] Check next exists...
if not exist "node_modules\.bin\next.cmd" (
  echo [ERROR] next.cmd not found. Installation failed or wrong folder.
  echo Current folder: %CD%
  dir /a
  pause
  popd
  exit /b 1
)

echo [6/6] Build...
call npm run build

echo Done.
pause
popd
endlocal
