# Hotel Kiosk - Sistema de Check-in Automatizado

Sistema web para automatizar el proceso de check-in/check-out en hoteles mediante kioscos con codigo QR.

## Arquitectura

```
hotel-kiosk/
├── backend/           # API REST con FastAPI
│   ├── app/
│   │   ├── api/       # Endpoints de la API
│   │   ├── core/      # Configuracion, seguridad, DB
│   │   ├── models/    # Modelos SQLAlchemy
│   │   ├── schemas/   # Schemas Pydantic
│   │   └── services/  # Logica de negocio
│   └── requirements.txt
│
└── frontend/          # Interfaces web
    ├── public/
    │   ├── index.html # Kiosko (usuario final)
    │   └── admin.html # Panel de administracion
    └── src/
        ├── components/
        ├── services/
        └── styles/
```

## Tres Portales

### 1. Portal de Kiosko (Usuario Final)
- Escaneo de codigo QR
- Check-in automatizado
- Firma de terminos y condiciones
- Generacion de llave digital y codigo de pulsera

### 2. Portal de Admin de Hotel
- Dashboard con metricas
- Gestion de habitaciones
- Gestion de reservaciones (con QR)
- Gestion de huespedes
- Configuracion de kioscos

### 3. Portal Super Admin
- Gestion de multiples hoteles
- Alta de administradores
- Reportes globales

## Instalacion

### Backend

```bash
cd backend

# Crear entorno virtual
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt

# Copiar configuracion
cp .env.example .env

# Poblar base de datos con datos de prueba
python seed_data.py

# Iniciar servidor
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend

# Servir con Python (desarrollo)
python -m http.server 3000

# O usar cualquier servidor estatico
npx serve public
```

## Uso

### Acceso

- **API Docs**: http://localhost:8000/docs
- **Kiosko**: http://localhost:3000/public/index.html
- **Admin**: http://localhost:3000/public/admin.html

### Credenciales de prueba

| Usuario | Email | Password | Rol |
|---------|-------|----------|-----|
| Super Admin | admin@hotelkiosk.com | admin123 | Administrador global |
| Hotel Admin | admin@hotelplaza.com | hotel123 | Admin de hotel |

## Flujo de Check-in

1. El huesped recibe un codigo QR al hacer su reservacion
2. En el kiosko, escanea el QR o ingresa su codigo de confirmacion
3. El sistema verifica la reservacion y fecha
4. El huesped acepta los terminos y condiciones
5. El sistema genera:
   - Llave digital (codigo para acceso a habitacion)
   - Codigo de pulsera (opcional, para servicios del hotel)
6. La habitacion se marca como ocupada

## API Endpoints

### Autenticacion
- `POST /api/v1/auth/login` - Iniciar sesion
- `GET /api/v1/auth/me` - Usuario actual

### Hoteles
- `GET/POST /api/v1/hotels/` - Listar/Crear hoteles
- `GET/PUT/DELETE /api/v1/hotels/{id}` - CRUD hotel

### Habitaciones
- `GET/POST /api/v1/rooms/` - Listar/Crear habitaciones
- `GET/PUT/DELETE /api/v1/rooms/{id}` - CRUD habitacion

### Reservaciones
- `GET/POST /api/v1/reservations/` - Listar/Crear reservaciones
- `GET /api/v1/reservations/code/{code}` - Buscar por codigo

### Check-in/Check-out
- `POST /api/v1/check-in/` - Procesar check-in
- `POST /api/v1/check-in/checkout` - Procesar check-out
- `GET /api/v1/check-in/verify/{qr}` - Verificar QR

### Huespedes
- `GET/POST /api/v1/guests/` - Listar/Crear huespedes

### Kioscos
- `GET/POST /api/v1/kiosks/` - Listar/Crear kioscos
- `POST /api/v1/kiosks/{id}/heartbeat` - Latido de kiosko

## Tecnologias

- **Backend**: Python 3.10+, FastAPI, SQLAlchemy, Pydantic
- **Base de datos**: SQLite (dev) / PostgreSQL (prod)
- **Autenticacion**: JWT
- **QR**: qrcode + html5-qrcode
- **Frontend**: HTML5, CSS3, JavaScript vanilla

## Proximos pasos

- [ ] Integracion con sistemas de cerraduras electronicas
- [ ] Pagos en linea
- [ ] Notificaciones por email/SMS
- [ ] App movil para huespedes
- [ ] Reportes avanzados con graficas
- [ ] Integracion con PMS existentes
