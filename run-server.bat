@echo off
setlocal
cd /d "C:\Users\i TECH COMPUTER\Desktop\school-management-system"

echo Starting School Management App...
where npm >nul 2>nul
if errorlevel 1 (
  echo Node.js/NPM not found. Please install from https://nodejs.org
  pause
  exit /b 1
)

if not exist "node_modules" (
  echo Installing dependencies first time...
  npm install
  if errorlevel 1 (
    echo Failed to install dependencies.
    pause
    exit /b 1
  )
)

start "" "http://localhost:3000"
npm start
