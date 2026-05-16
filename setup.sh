#!/bin/bash

# ==========================================
# Hotel Kiosk - Script de Instalacion
# ==========================================

set -e

echo "=========================================="
echo "  Hotel Kiosk - Instalacion Automatica"
echo "=========================================="
echo ""

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Funcion para imprimir mensajes
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Verificar que estamos en el directorio correcto
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    print_error "Error: Ejecuta este script desde la raiz del proyecto hotel-kiosk/"
    exit 1
fi

# Verificar Python
echo "Verificando Python..."
if command -v python3 &> /dev/null; then
    PYTHON_CMD="python3"
    print_status "Python3 encontrado: $(python3 --version)"
elif command -v python &> /dev/null; then
    PYTHON_CMD="python"
    print_status "Python encontrado: $(python --version)"
else
    print_error "Python no encontrado. Por favor instala Python 3.9+"
    exit 1
fi

# Verificar version de Python
PYTHON_VERSION=$($PYTHON_CMD -c 'import sys; print(f"{sys.version_info.major}.{sys.version_info.minor}")')
REQUIRED_VERSION="3.9"

if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$PYTHON_VERSION" | sort -V | head -n1)" != "$REQUIRED_VERSION" ]; then
    print_error "Se requiere Python 3.9 o superior. Tienes: $PYTHON_VERSION"
    exit 1
fi

# ==========================================
# BACKEND SETUP
# ==========================================
echo ""
echo "--- Configurando Backend ---"
cd backend

# Crear entorno virtual si no existe
if [ ! -d "venv" ]; then
    echo "Creando entorno virtual..."
    $PYTHON_CMD -m venv venv
    print_status "Entorno virtual creado"
else
    print_status "Entorno virtual ya existe"
fi

# Activar entorno virtual
echo "Activando entorno virtual..."
if [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
    source venv/Scripts/activate
else
    source venv/bin/activate
fi
print_status "Entorno virtual activado"

# Actualizar pip
echo "Actualizando pip..."
pip install --upgrade pip -q
print_status "Pip actualizado"

# Instalar dependencias
echo "Instalando dependencias (esto puede tardar unos minutos)..."
pip install -r requirements.txt -q
print_status "Dependencias instaladas"

# Crear archivo .env si no existe
if [ ! -f ".env" ]; then
    echo "Creando archivo .env..."
    cp .env.example .env
    print_status "Archivo .env creado desde .env.example"
else
    print_status "Archivo .env ya existe"
fi

# Ejecutar seed_data para crear base de datos y datos de prueba
echo "Inicializando base de datos..."
$PYTHON_CMD seed_data.py
print_status "Base de datos inicializada con datos de prueba"

cd ..

# ==========================================
# RESUMEN FINAL
# ==========================================
echo ""
echo "=========================================="
echo -e "${GREEN}  INSTALACION COMPLETADA${NC}"
echo "=========================================="
echo ""
echo "Para iniciar el proyecto:"
echo ""
echo "  1. Backend (Terminal 1):"
echo "     cd backend"
echo "     source venv/bin/activate  # Linux/Mac"
echo "     # o: venv\\Scripts\\activate  # Windows"
echo "     uvicorn app.main:app --reload"
echo ""
echo "  2. Frontend (Terminal 2):"
echo "     cd frontend"
echo "     python3 -m http.server 3000"
echo ""
echo "  3. Abrir en navegador:"
echo "     - Kiosko: http://localhost:3000/public/index.html"
echo "     - API Docs: http://localhost:8000/docs"
echo ""
echo "Credenciales de prueba:"
echo "  - Super Admin: admin@hotelkiosk.com / admin123"
echo "  - Hotel Admin: admin@hotelplaza.com / hotel123"
echo ""
