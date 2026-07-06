@echo off
echo ===================================================
echo   Anaemia Sense - Premium Diagnostics Setup
echo ===================================================
echo.

:: Check for Python installation
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python is not installed or not in your PATH.
    echo Please install Python 3.8+ and try again.
    pause
    exit /b 1
)

:: Create virtual environment if it doesn't exist
if not exist .venv (
    echo [INFO] Creating Python virtual environment (.venv)...
    python -m venv .venv
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to create virtual environment.
        pause
        exit /b 1
    )
)

:: Activate environment and install dependencies
echo [INFO] Activating virtual environment...
call .venv\Scripts\activate

echo [INFO] Installing required dependencies (this may take a minute)...
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install dependencies.
    pause
    exit /b 1
)

echo.
echo ===================================================
echo   Starting local Flask server...
echo   Open your browser at: http://127.0.0.1:5000
echo ===================================================
echo.

python app.py

pause
