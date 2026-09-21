@echo off
setlocal
cd /d "%~dp0"
title Bassam Portfolio Launcher

where npm >nul 2>nul
if errorlevel 1 (
  echo Node.js is required to run the portfolio.
  echo Install Node.js, then double-click this file again.
  pause
  exit /b 1
)

if not exist "node_modules" (
  echo Preparing the portfolio for first use...
  call npm install
  if errorlevel 1 (
    echo Setup failed. Please check your internet connection and try again.
    pause
    exit /b 1
  )
)

if not exist "dist\index.html" (
  echo Building the portfolio...
  call npm run build
  if errorlevel 1 (
    echo The portfolio could not be built.
    pause
    exit /b 1
  )
)

curl.exe -fsS --max-time 1 "http://127.0.0.1:4173/" >nul 2>nul
if errorlevel 1 (
  start "Bassam Portfolio Server" /min node "local-server.mjs"
)

echo Opening your portfolio...
for /l %%I in (1,1,12) do (
  curl.exe -fsS --max-time 1 "http://127.0.0.1:4173/" >nul 2>nul
  if not errorlevel 1 goto portfolio_ready
  timeout /t 1 /nobreak >nul
)

echo The local server did not start. Please keep this window open and try again.
pause
exit /b 1

:portfolio_ready

if exist "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" (
  start "" "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" "http://127.0.0.1:4173/"
) else if exist "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe" (
  start "" "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe" "http://127.0.0.1:4173/"
) else (
  start "" "http://127.0.0.1:4173/"
)

endlocal
