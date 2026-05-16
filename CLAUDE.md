# Hotel Kiosk - Sistema de Check-in Automatizado

## Descripción del Proyecto
Sistema web para automatizar el proceso de check-in/check-out en hoteles mediante kioscos con código QR.

## Arquitectura
- **Backend**: Python con FastAPI
- **Base de datos**: PostgreSQL con SQLAlchemy
- **Frontend**: HTML/CSS/JS vanilla (para kiosko) + React (admin)
- **Autenticación**: JWT tokens
- **QR**: qrcode library para generación

## Tres Portales

### 1. Portal de Usuario (Kiosko)
- Escanear QR de reservación
- Proceso de check-in automatizado
- Firma digital de términos
- Asignación de habitación
- Generación de llave digital/código
- Check-out y facturación

### 2. Portal de Administrador de Hotel
- Dashboard del hotel
- Gestión de habitaciones
- Gestión de reservaciones
- Reportes de ocupación
- Configuración de precios

### 3. Portal Super Admin (Multi-hotel)
- Gestión de múltiples hoteles
- Alta de nuevos hoteles
- Gestión de administradores
- Reportes globales
- Configuración de kioscos

## Comandos
```bash
# Backend
cd backend && uvicorn app.main:app --reload

# Frontend kiosko
cd frontend && python -m http.server 3000

# Tests
cd backend && pytest
```

## Estructura de Base de Datos
- hotels: Información de hoteles
- users: Usuarios del sistema (admins, super admins)
- guests: Huéspedes
- rooms: Habitaciones por hotel
- reservations: Reservaciones
- check_ins: Registros de check-in
- kiosks: Kioscos registrados por hotel
