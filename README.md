# Hotel Kiosk - Sistema de Check-in/Check-out Automatizado

<p align="center">
  <img src="https://img.shields.io/badge/Python-3.9+-blue.svg" alt="Python">
  <img src="https://img.shields.io/badge/FastAPI-0.100+-green.svg" alt="FastAPI">
  <img src="https://img.shields.io/badge/SQLAlchemy-2.0+-red.svg" alt="SQLAlchemy">
  <img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License">
</p>

<p align="center">
  <strong>Sistema completo para automatizar el proceso de check-in y check-out en hoteles mediante kioscos interactivos con escaneo de codigo QR.</strong>
</p>

---

## Tabla de Contenidos

- [Descripcion](#descripcion)
- [Caracteristicas](#caracteristicas)
- [Arquitectura](#arquitectura)
- [Requisitos](#requisitos)
- [Instalacion](#instalacion)
- [Configuracion](#configuracion)
- [Uso](#uso)
- [API Endpoints](#api-endpoints)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Base de Datos](#base-de-datos)
- [Seguridad](#seguridad)
- [Internacionalizacion](#internacionalizacion)
- [Contribuir](#contribuir)
- [Licencia](#licencia)

---

## Inicio Rapido (Quick Start)

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/hotel-kiosk.git
cd hotel-kiosk

# 2. Ejecutar script de instalacion
# En Mac/Linux:
./setup.sh

# En Windows:
setup.bat

# 3. Iniciar Backend (Terminal 1)
cd backend
source venv/bin/activate  # Mac/Linux
# venv\Scripts\activate   # Windows
uvicorn app.main:app --reload

# 4. Iniciar Frontend (Terminal 2)
cd frontend
python3 -m http.server 3000

# 5. Abrir en navegador
# Kiosko: http://localhost:3000/public/index.html
# API:    http://localhost:8000/docs
```

**Credenciales de prueba:**
- Super Admin: `admin@hotelkiosk.com` / `admin123`
- Hotel Admin: `admin@hotelplaza.com` / `hotel123`

---

## Descripcion

**Hotel Kiosk** es una solucion moderna y completa para la gestion automatizada del proceso de check-in y check-out en hoteles. El sistema permite a los huespedes realizar su registro de entrada y salida de forma autonoma mediante terminales de autoservicio (kioscos), reduciendo tiempos de espera y optimizando la operacion hotelera.

### El Problema

Los hoteles tradicionales enfrentan varios desafios:
- Largas filas en recepcion durante horas pico
- Personal limitado para atender multiples huespedes simultaneamente
- Procesos manuales propensos a errores
- Experiencia del huesped afectada por tiempos de espera

### La Solucion

Hotel Kiosk automatiza el proceso completo:
1. El huesped recibe un codigo QR unico al hacer su reservacion
2. Al llegar al hotel, escanea el QR en el kiosko
3. Confirma sus datos y acepta los terminos
4. Recibe su numero de habitacion y llave digital
5. Al salir, ingresa su numero de habitacion para hacer check-out

---

## Caracteristicas

### Para Huespedes (Kiosko)

| Caracteristica | Descripcion |
|----------------|-------------|
| **Escaneo QR** | Camara integrada para escanear codigo QR de reservacion |
| **Entrada Manual** | Teclado virtual para ingresar codigo de confirmacion |
| **Check-in Rapido** | Proceso completo en menos de 60 segundos |
| **Check-out Sencillo** | Solo ingresa el numero de habitacion |
| **Multi-idioma** | Soporte para Espanol, Ingles y Chino |
| **Llave Digital** | Generacion automatica de codigo de acceso |
| **Interfaz Tactil** | Disenada para pantallas touch de kiosko |

### Para Administradores de Hotel

| Caracteristica | Descripcion |
|----------------|-------------|
| **Dashboard** | Vista general de ocupacion y actividad |
| **Gestion de Habitaciones** | CRUD completo de habitaciones |
| **Gestion de Reservaciones** | Crear, modificar y cancelar reservaciones |
| **Gestion de Huespedes** | Base de datos de huespedes |
| **Reportes** | Estadisticas de ocupacion y check-ins |
| **Configuracion** | Personalizar precios y politicas |

### Para Super Administradores (Multi-Hotel)

| Caracteristica | Descripcion |
|----------------|-------------|
| **Multi-Hotel** | Gestionar multiples propiedades |
| **Administradores** | Crear y gestionar usuarios admin por hotel |
| **Kioscos** | Registrar y monitorear kioscos |
| **Reportes Globales** | Metricas consolidadas de todos los hoteles |
| **Configuracion Global** | Politicas y configuraciones centralizadas |

### Caracteristicas Tecnicas

- **API RESTful** completa con documentacion OpenAPI/Swagger
- **Autenticacion JWT** con tokens seguros
- **Base de datos relacional** con SQLAlchemy ORM
- **Generacion de QR** automatica para cada reservacion
- **Notificaciones por email** para confirmaciones
- **Responsive Design** adaptable a diferentes tamanos de pantalla
- **PWA Ready** para instalacion en dispositivos

---

## Arquitectura

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                 │
├─────────────────┬─────────────────┬─────────────────────────────┤
│   Kiosko UI     │   Admin Panel   │      Super Admin Panel      │
│   (Vanilla JS)  │    (React)      │         (React)             │
└────────┬────────┴────────┬────────┴──────────────┬──────────────┘
         │                 │                       │
         └─────────────────┼───────────────────────┘
                           │
                    ┌──────▼──────┐
                    │   FastAPI   │
                    │   Backend   │
                    └──────┬──────┘
                           │
         ┌─────────────────┼─────────────────┐
         │                 │                 │
    ┌────▼────┐      ┌─────▼─────┐     ┌─────▼─────┐
    │ SQLite/ │      │    QR     │     │   Email   │
    │ Postgres│      │  Service  │     │  Service  │
    └─────────┘      └───────────┘     └───────────┘
```

### Stack Tecnologico

**Backend:**
- Python 3.9+
- FastAPI (Framework web asincrono)
- SQLAlchemy 2.0 (ORM)
- Pydantic (Validacion de datos)
- Python-Jose (JWT tokens)
- Passlib + Bcrypt (Hashing de passwords)
- QRCode (Generacion de codigos QR)
- Python-multipart (Manejo de archivos)

**Frontend Kiosko:**
- HTML5 / CSS3
- JavaScript Vanilla (ES6+)
- HTML5-QRCode (Escaneo de QR)
- CSS Variables (Theming)
- Responsive Design

**Base de Datos:**
- SQLite (Desarrollo)
- PostgreSQL (Produccion)

---

## Requisitos

### Sistema

- Python 3.9 o superior
- pip (gestor de paquetes de Python)
- Node.js 16+ (opcional, para admin panel)
- Git

### Hardware para Kiosko (Recomendado)

- Pantalla tactil de 15" o superior (1024x768 minimo)
- Camara web HD para escaneo QR
- Procesador: Intel i3 o equivalente
- RAM: 4GB minimo
- Almacenamiento: 50GB SSD
- Conexion a internet estable

---

## Instalacion

### 1. Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/hotel-kiosk.git
cd hotel-kiosk
```

### 2. Configurar el Backend

```bash
# Crear entorno virtual
cd backend
python -m venv venv

# Activar entorno virtual
# En macOS/Linux:
source venv/bin/activate
# En Windows:
.\venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt
```

### 3. Configurar Variables de Entorno

```bash
# Copiar archivo de ejemplo
cp .env.example .env

# Editar con tus configuraciones
nano .env
```

### 4. Inicializar la Base de Datos

```bash
# Crear tablas y datos iniciales
python -c "from app.core.database import engine, Base; from app.models import *; Base.metadata.create_all(bind=engine)"

# Crear datos de prueba
python seed_data.py
```

### 5. Iniciar el Backend

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 6. Iniciar el Frontend (Kiosko)

```bash
# En otra terminal
cd frontend
python -m http.server 3000
```

### 7. Acceder a la Aplicacion

| Componente | URL |
|------------|-----|
| Kiosko | http://localhost:3000/public/index.html |
| API Docs | http://localhost:8000/docs |
| API ReDoc | http://localhost:8000/redoc |

---

## Configuracion

### Variables de Entorno

Crear archivo `.env` en la carpeta `backend/`:

```env
# Base de datos
DATABASE_URL=sqlite:///./hotel_kiosk.db
# Para PostgreSQL:
# DATABASE_URL=postgresql://user:password@localhost/hotel_kiosk

# Seguridad
SECRET_KEY=tu-clave-secreta-muy-segura-de-al-menos-32-caracteres
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Email (opcional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASSWORD=tu-app-password
SMTP_FROM=noreply@tuhotel.com

# Configuracion general
DEBUG=true
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8000
```

### Configuracion del Kiosko

Editar `frontend/src/services/api.js`:

```javascript
const API_BASE_URL = 'http://tu-servidor:8000/api/v1';
```

---

## Uso

### Flujo de Check-in

```
1. Huesped llega al kiosko
         │
         ▼
2. Selecciona "Escanear QR" o "Ingresar Codigo"
         │
         ├──► Escanea QR con camara
         │           │
         │           ▼
         │    Sistema valida reservacion
         │           │
         └──► Ingresa codigo manual (RES-XXXXXX)
                     │
                     ▼
3. Sistema muestra datos de reservacion
         │
         ▼
4. Huesped confirma datos y acepta terminos
         │
         ▼
5. Sistema procesa check-in
         │
         ▼
6. Huesped recibe:
   - Numero de habitacion
   - Llave digital (codigo)
   - Codigo de pulsera (opcional)
         │
         ▼
7. Pantalla se reinicia automaticamente (30s)
```

### Flujo de Check-out

```
1. Huesped selecciona "Check-out"
         │
         ▼
2. Ingresa numero de habitacion
         │
         ▼
3. Sistema muestra resumen de estancia:
   - Fechas de entrada/salida
   - Noches hospedado
   - Cargos pendientes (si hay)
         │
         ▼
4. Huesped confirma check-out
         │
         ▼
5. Sistema procesa salida
         │
         ▼
6. Mensaje de despedida
         │
         ▼
7. Pantalla se reinicia automaticamente (30s)
```

### Credenciales por Defecto

| Rol | Usuario | Password |
|-----|---------|----------|
| Super Admin | admin@hotelkiosk.com | admin123 |
| Hotel Admin | admin@hotelplaza.com | hotel123 |

> **Importante:** Cambiar estas credenciales en produccion.

---

## API Endpoints

### Autenticacion

| Metodo | Endpoint | Descripcion |
|--------|----------|-------------|
| POST | `/api/v1/auth/login` | Iniciar sesion |
| POST | `/api/v1/auth/register` | Registrar usuario |
| GET | `/api/v1/auth/me` | Obtener usuario actual |

### Hoteles

| Metodo | Endpoint | Descripcion |
|--------|----------|-------------|
| GET | `/api/v1/hotels/` | Listar hoteles |
| POST | `/api/v1/hotels/` | Crear hotel |
| GET | `/api/v1/hotels/{id}` | Obtener hotel |
| PUT | `/api/v1/hotels/{id}` | Actualizar hotel |
| DELETE | `/api/v1/hotels/{id}` | Eliminar hotel |

### Habitaciones

| Metodo | Endpoint | Descripcion |
|--------|----------|-------------|
| GET | `/api/v1/rooms/` | Listar habitaciones |
| POST | `/api/v1/rooms/` | Crear habitacion |
| GET | `/api/v1/rooms/{id}` | Obtener habitacion |
| PUT | `/api/v1/rooms/{id}` | Actualizar habitacion |
| DELETE | `/api/v1/rooms/{id}` | Eliminar habitacion |
| GET | `/api/v1/rooms/available` | Habitaciones disponibles |

### Huespedes

| Metodo | Endpoint | Descripcion |
|--------|----------|-------------|
| GET | `/api/v1/guests/` | Listar huespedes |
| POST | `/api/v1/guests/` | Crear huesped |
| GET | `/api/v1/guests/{id}` | Obtener huesped |
| PUT | `/api/v1/guests/{id}` | Actualizar huesped |
| GET | `/api/v1/guests/search` | Buscar huesped |

### Reservaciones

| Metodo | Endpoint | Descripcion |
|--------|----------|-------------|
| GET | `/api/v1/reservations/` | Listar reservaciones |
| POST | `/api/v1/reservations/` | Crear reservacion |
| GET | `/api/v1/reservations/{id}` | Obtener reservacion |
| PUT | `/api/v1/reservations/{id}` | Actualizar reservacion |
| DELETE | `/api/v1/reservations/{id}` | Cancelar reservacion |
| GET | `/api/v1/reservations/code/{code}` | Buscar por codigo |
| GET | `/api/v1/reservations/room/{room}/active` | Reservacion activa por habitacion |

### Check-in/Check-out

| Metodo | Endpoint | Descripcion |
|--------|----------|-------------|
| GET | `/api/v1/check-in/verify/{qr_code}` | Verificar QR |
| POST | `/api/v1/check-in/` | Procesar check-in |
| POST | `/api/v1/check-in/checkout` | Procesar check-out |
| GET | `/api/v1/check-in/history` | Historial de check-ins |

### Kioscos

| Metodo | Endpoint | Descripcion |
|--------|----------|-------------|
| GET | `/api/v1/kiosks/` | Listar kioscos |
| POST | `/api/v1/kiosks/` | Registrar kiosko |
| POST | `/api/v1/kiosks/{id}/heartbeat` | Heartbeat de kiosko |
| GET | `/api/v1/kiosks/{id}/status` | Estado de kiosko |

---

## Estructura del Proyecto

```
hotel-kiosk/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── deps.py              # Dependencias (auth, db)
│   │   │   └── v1/
│   │   │       ├── endpoints/
│   │   │       │   ├── auth.py      # Autenticacion
│   │   │       │   ├── hotels.py    # CRUD hoteles
│   │   │       │   ├── rooms.py     # CRUD habitaciones
│   │   │       │   ├── guests.py    # CRUD huespedes
│   │   │       │   ├── reservations.py  # CRUD reservaciones
│   │   │       │   ├── check_in.py  # Check-in/out
│   │   │       │   ├── kiosks.py    # Gestion kioscos
│   │   │       │   └── users.py     # Gestion usuarios
│   │   │       └── router.py        # Router principal
│   │   ├── core/
│   │   │   ├── config.py            # Configuracion
│   │   │   ├── database.py          # Conexion DB
│   │   │   └── security.py          # JWT, hashing
│   │   ├── models/
│   │   │   ├── hotel.py             # Modelo Hotel
│   │   │   ├── room.py              # Modelo Room
│   │   │   ├── guest.py             # Modelo Guest
│   │   │   ├── reservation.py       # Modelo Reservation
│   │   │   ├── check_in.py          # Modelo CheckIn
│   │   │   ├── kiosk.py             # Modelo Kiosk
│   │   │   └── user.py              # Modelo User
│   │   ├── schemas/
│   │   │   ├── hotel.py             # Schemas Hotel
│   │   │   ├── room.py              # Schemas Room
│   │   │   ├── guest.py             # Schemas Guest
│   │   │   ├── reservation.py       # Schemas Reservation
│   │   │   ├── check_in.py          # Schemas CheckIn
│   │   │   └── user.py              # Schemas User
│   │   ├── services/
│   │   │   ├── qr_service.py        # Generacion QR
│   │   │   └── email_service.py     # Envio emails
│   │   └── main.py                  # Aplicacion principal
│   ├── tests/
│   │   ├── test_auth.py
│   │   ├── test_reservations.py
│   │   └── test_checkin.py
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── public/
│   │   └── index.html               # Pagina principal kiosko
│   └── src/
│       ├── components/
│       │   └── kiosk.js             # Logica del kiosko
│       ├── services/
│       │   └── api.js               # Cliente API
│       └── styles/
│           └── kiosk.css            # Estilos del kiosko
├── screenshots/                      # Capturas de pantalla
├── CLAUDE.md                         # Guia para Claude AI
├── README.md                         # Este archivo
└── .gitignore
```

---

## Base de Datos

### Diagrama Entidad-Relacion

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│   hotels    │       │    users    │       │   kiosks    │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ id (PK)     │◄──┐   │ id (PK)     │   ┌──►│ id (PK)     │
│ name        │   │   │ email       │   │   │ hotel_id(FK)│──┐
│ address     │   │   │ password    │   │   │ location    │  │
│ phone       │   │   │ role        │   │   │ status      │  │
│ email       │   │   │ hotel_id(FK)│───┘   │ last_ping   │  │
│ created_at  │   │   │ created_at  │       └─────────────┘  │
└─────────────┘   │   └─────────────┘                        │
       ▲          │                                          │
       │          │   ┌─────────────┐       ┌─────────────┐  │
       │          │   │   guests    │       │   rooms     │  │
       │          │   ├─────────────┤       ├─────────────┤  │
       │          │   │ id (PK)     │       │ id (PK)     │  │
       │          │   │ first_name  │       │ hotel_id(FK)│──┤
       │          │   │ last_name   │       │ room_number │  │
       │          │   │ email       │       │ room_type   │  │
       │          │   │ phone       │       │ price       │  │
       │          │   │ id_number   │       │ status      │  │
       │          │   └─────────────┘       └─────────────┘  │
       │          │          │                    │          │
       │          │          │                    │          │
       │          │          ▼                    ▼          │
       │          │   ┌─────────────────────────────┐        │
       │          │   │       reservations         │        │
       │          │   ├─────────────────────────────┤        │
       │          └───│ hotel_id (FK)              │        │
       │              │ guest_id (FK)              │◄───────┘
       │              │ room_id (FK)               │
       │              │ check_in_date              │
       │              │ check_out_date             │
       │              │ confirmation_code          │
       │              │ qr_code                    │
       │              │ status                     │
       │              │ total_amount               │
       │              └─────────────────────────────┘
       │                           │
       │                           ▼
       │              ┌─────────────────────────────┐
       │              │        check_ins           │
       │              ├─────────────────────────────┤
       └──────────────│ hotel_id (FK)              │
                      │ reservation_id (FK)        │
                      │ kiosk_id (FK)              │
                      │ check_in_time              │
                      │ check_out_time             │
                      │ digital_key_code           │
                      │ wristband_code             │
                      └─────────────────────────────┘
```

### Modelos Principales

#### Hotel
```python
- id: Integer (PK)
- name: String(100)
- address: String(200)
- city: String(50)
- country: String(50)
- phone: String(20)
- email: String(100)
- logo_url: String(255)
- created_at: DateTime
- updated_at: DateTime
```

#### Room
```python
- id: Integer (PK)
- hotel_id: Integer (FK)
- room_number: String(10)
- room_type: Enum(standard, deluxe, suite, presidential)
- floor: Integer
- price_per_night: Decimal(10,2)
- max_guests: Integer
- status: Enum(available, occupied, maintenance, cleaning)
- amenities: JSON
```

#### Reservation
```python
- id: Integer (PK)
- hotel_id: Integer (FK)
- guest_id: Integer (FK)
- room_id: Integer (FK)
- check_in_date: Date
- check_out_date: Date
- num_guests: Integer
- confirmation_code: String(20) UNIQUE
- qr_code: String(50) UNIQUE
- status: Enum(pending, confirmed, checked_in, checked_out, cancelled)
- total_amount: Decimal(10,2)
- amount_paid: Decimal(10,2)
- special_requests: Text
- created_at: DateTime
```

---

## Seguridad

### Autenticacion

- **JWT Tokens**: Tokens firmados con algoritmo HS256
- **Expiracion**: Tokens expiran en 30 minutos (configurable)
- **Refresh**: Sistema de refresh tokens para sesiones largas

### Passwords

- **Hashing**: Bcrypt con salt automatico
- **Requisitos**: Minimo 8 caracteres (configurable)

### Roles y Permisos

| Rol | Permisos |
|-----|----------|
| `super_admin` | Acceso total a todos los hoteles y configuraciones |
| `hotel_admin` | Acceso total a su hotel asignado |
| `receptionist` | Ver reservaciones, procesar check-in/out |
| `viewer` | Solo lectura |

### CORS

Configurado para permitir solo origenes autorizados:

```python
origins = [
    "http://localhost:3000",
    "http://localhost:8000",
    "https://tu-dominio.com"
]
```

### Recomendaciones para Produccion

1. Usar HTTPS en todos los endpoints
2. Configurar rate limiting
3. Implementar logging de auditoria
4. Usar PostgreSQL en lugar de SQLite
5. Configurar backups automaticos
6. Cambiar SECRET_KEY a un valor seguro
7. Deshabilitar DEBUG mode
8. Configurar firewall apropiado

---

## Internacionalizacion

El sistema soporta multiples idiomas mediante un sistema de traducciones en el frontend.

### Idiomas Soportados

| Codigo | Idioma | Completado |
|--------|--------|------------|
| `es` | Espanol | 100% |
| `en` | English | 100% |
| `zh` | 中文 (Chino) | 100% |

### Agregar un Nuevo Idioma

1. Editar `frontend/src/components/kiosk.js`
2. Agregar el nuevo idioma al objeto `translations`:

```javascript
const translations = {
    es: { ... },
    en: { ... },
    zh: { ... },
    // Agregar nuevo idioma:
    fr: {
        step_identify: 'Identifier',
        step_confirm: 'Confirmer',
        step_done: 'Termine',
        // ... resto de traducciones
    }
};
```

3. Agregar boton de idioma en `index.html`:

```html
<button class="lang-btn" data-lang="fr">FR</button>
```

### Claves de Traduccion Principales

| Clave | Descripcion |
|-------|-------------|
| `welcome_title` | Titulo de bienvenida |
| `welcome_subtitle` | Subtitulo de bienvenida |
| `scan_qr` | Boton escanear QR |
| `manual_code` | Boton codigo manual |
| `checkout` | Boton check-out |
| `confirm_checkin` | Boton confirmar check-in |
| `checkin_success` | Mensaje de exito |
| `checkout_success` | Mensaje de exito checkout |

---

## Pruebas

### Ejecutar Tests

```bash
cd backend
pytest
```

### Tests con Coverage

```bash
pytest --cov=app --cov-report=html
```

### Tests Especificos

```bash
# Solo tests de autenticacion
pytest tests/test_auth.py

# Solo tests de reservaciones
pytest tests/test_reservations.py -v
```

---

## Deployment

### Docker (Recomendado)

```dockerfile
# Dockerfile
FROM python:3.9-slim

WORKDIR /app
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ .
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  backend:
    build: .
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db/hotel
    depends_on:
      - db
  
  db:
    image: postgres:14
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
      - POSTGRES_DB=hotel
    volumes:
      - pgdata:/var/lib/postgresql/data

  frontend:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./frontend:/usr/share/nginx/html

volumes:
  pgdata:
```

### Configuracion de Kiosko Fisico

Para configurar una terminal de kiosko:

1. Instalar navegador en modo kiosko (Chrome Kiosk Mode)
2. Configurar inicio automatico
3. Deshabilitar barra de tareas
4. Configurar URL del frontend

```bash
# Ejemplo en Linux
chromium-browser --kiosk --disable-infobars http://localhost:3000/public/index.html

# Ejemplo en Windows (PowerShell)
Start-Process chrome.exe -ArgumentList "--kiosk", "--disable-infobars", "http://localhost:3000/public/index.html"
```

---

## Troubleshooting

### Problemas Comunes

| Problema | Solucion |
|----------|----------|
| Error de CORS | Verificar ALLOWED_ORIGINS en .env |
| Token invalido | Revisar SECRET_KEY, regenerar tokens |
| QR no escanea | Verificar permisos de camara, iluminacion |
| Base de datos vacia | Ejecutar `python seed_data.py` |
| Bcrypt error | Instalar `pip install bcrypt==4.0.1` |
| Hora no se muestra | Verificar que JavaScript cargue correctamente |

### Logs

```bash
# Ver logs del backend en tiempo real
uvicorn app.main:app --log-level debug

# Verificar conexion a la base de datos
python -c "from app.core.database import engine; print(engine.url)"
```

---

## Contribuir

1. Fork el repositorio
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abrir Pull Request

### Guia de Estilo

- **Python**: Seguir PEP 8
- **JavaScript**: ES6+, camelCase
- **CSS**: BEM metodologia
- **Commits**: Mensajes descriptivos en espanol o ingles

---

## Roadmap

- [ ] App movil para huespedes
- [ ] Integracion con cerraduras inteligentes
- [ ] Panel de analytics avanzado
- [ ] Integracion con PMS externos (Opera, etc.)
- [ ] Soporte para pagos en kiosko
- [ ] Reconocimiento facial (opcional)
- [ ] Chatbot de asistencia
- [ ] Modo offline para kiosko
- [ ] Notificaciones SMS
- [ ] Dashboard en tiempo real con WebSockets

---

## Licencia

Este proyecto esta licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

---

## Soporte

- **Issues**: [Reportar problema](https://github.com/tu-usuario/hotel-kiosk/issues)
- **Documentacion**: [Wiki del proyecto](https://github.com/tu-usuario/hotel-kiosk/wiki)

---

<p align="center">
  Hecho con ❤️ para la industria hotelera
</p>
