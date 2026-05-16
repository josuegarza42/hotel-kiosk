@echo off
REM ==========================================
REM Hotel Kiosk - Script de Instalacion (Windows)
REM ==========================================

echo ==========================================
echo   Hotel Kiosk - Instalacion Automatica
echo ==========================================
echo.

REM Verificar que estamos en el directorio correcto
if not exist "backend" (
    echo ERROR: Ejecuta este script desde la raiz del proyecto hotel-kiosk/
    pause
    exit /b 1
)

REM Verificar Python
echo Verificando Python...
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python no encontrado. Por favor instala Python 3.9+
    pause
    exit /b 1
)
echo [OK] Python encontrado

REM ==========================================
REM BACKEND SETUP
REM ==========================================
echo.
echo --- Configurando Backend ---
cd backend

REM Crear entorno virtual si no existe
if not exist "venv" (
    echo Creando entorno virtual...
    python -m venv venv
    echo [OK] Entorno virtual creado
) else (
    echo [OK] Entorno virtual ya existe
)

REM Activar entorno virtual
echo Activando entorno virtual...
call venv\Scripts\activate.bat
echo [OK] Entorno virtual activado

REM Actualizar pip
echo Actualizando pip...
python -m pip install --upgrade pip -q
echo [OK] Pip actualizado

REM Instalar dependencias
echo Instalando dependencias (esto puede tardar unos minutos)...
pip install -r requirements.txt -q
echo [OK] Dependencias instaladas

REM Crear archivo .env si no existe
if not exist ".env" (
    echo Creando archivo .env...
    copy .env.example .env
    echo [OK] Archivo .env creado
) else (
    echo [OK] Archivo .env ya existe
)

REM Ejecutar seed_data
echo Inicializando base de datos...
python seed_data.py
echo [OK] Base de datos inicializada

cd ..

REM ==========================================
REM RESUMEN FINAL
REM ==========================================
echo.
echo ==========================================
echo   INSTALACION COMPLETADA
echo ==========================================
echo.
echo Para iniciar el proyecto:
echo.
echo   1. Backend (Terminal 1):
echo      cd backend
echo      venv\Scripts\activate
echo      uvicorn app.main:app --reload
echo.
echo   2. Frontend (Terminal 2):
echo      cd frontend
echo      python -m http.server 3000
echo.
echo   3. Abrir en navegador:
echo      - Kiosko: http://localhost:3000/public/index.html
echo      - API Docs: http://localhost:8000/docs
echo.
echo Credenciales de prueba:
echo   - Super Admin: admin@hotelkiosk.com / admin123
echo   - Hotel Admin: admin@hotelplaza.com / hotel123
echo.
pause
