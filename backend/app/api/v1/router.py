from fastapi import APIRouter
from app.api.v1.endpoints import auth, hotels, rooms, reservations, check_in, guests, users, kiosks

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Autenticación"])
api_router.include_router(hotels.router, prefix="/hotels", tags=["Hoteles"])
api_router.include_router(rooms.router, prefix="/rooms", tags=["Habitaciones"])
api_router.include_router(reservations.router, prefix="/reservations", tags=["Reservaciones"])
api_router.include_router(check_in.router, prefix="/check-in", tags=["Check-in/Check-out"])
api_router.include_router(guests.router, prefix="/guests", tags=["Huéspedes"])
api_router.include_router(users.router, prefix="/users", tags=["Usuarios"])
api_router.include_router(kiosks.router, prefix="/kiosks", tags=["Kioscos"])
