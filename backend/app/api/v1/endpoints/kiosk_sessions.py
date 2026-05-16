from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict
from datetime import datetime, timedelta

router = APIRouter()

# Almacenamiento en memoria para sesiones (en produccion usar Redis)
active_sessions: Dict[str, dict] = {}

class LinkReservationRequest(BaseModel):
    confirmation_code: str

class SessionResponse(BaseModel):
    session_id: str
    hotel_id: int
    kiosk_id: str
    reservation: Optional[dict] = None
    created_at: datetime


@router.post("/")
def create_session(hotel_id: int, kiosk_id: str):
    """Crear una nueva sesion de kiosco"""
    session_id = f"SESSION-{datetime.now().timestamp()}-{hotel_id}"

    active_sessions[session_id] = {
        "session_id": session_id,
        "hotel_id": hotel_id,
        "kiosk_id": kiosk_id,
        "reservation": None,
        "created_at": datetime.now()
    }

    # Limpiar sesiones viejas (mas de 10 minutos)
    cleanup_old_sessions()

    return active_sessions[session_id]


@router.get("/{session_id}")
def get_session(session_id: str):
    """Verificar estado de una sesion"""
    if session_id not in active_sessions:
        raise HTTPException(status_code=404, detail="Session not found")

    session = active_sessions[session_id]

    # Verificar si la sesion expiro (10 minutos)
    if datetime.now() - session["created_at"] > timedelta(minutes=10):
        del active_sessions[session_id]
        raise HTTPException(status_code=404, detail="Session expired")

    return session


@router.post("/{session_id}/link")
def link_reservation(session_id: str, request: LinkReservationRequest, db = None):
    """Vincular una reservacion a una sesion (llamado desde la app del usuario)"""
    from app.core.database import SessionLocal
    from app.models.reservation import Reservation

    if session_id not in active_sessions:
        raise HTTPException(status_code=404, detail="Session not found or expired")

    db = SessionLocal()

    try:
        # Buscar la reservacion
        reservation = db.query(Reservation).filter(
            Reservation.confirmation_code == request.confirmation_code
        ).first()

        if not reservation:
            raise HTTPException(status_code=404, detail="Reservation not found")

        # Verificar que la reservacion es para hoy
        from datetime import date
        if reservation.check_in_date != date.today():
            raise HTTPException(status_code=400, detail="Check-in date is not today")

        # Verificar estado de la reservacion
        if reservation.status == "checked_in":
            raise HTTPException(status_code=400, detail="Already checked in")

        if reservation.status == "cancelled":
            raise HTTPException(status_code=400, detail="Reservation cancelled")

        # Vincular la reservacion a la sesion
        guest = reservation.guest
        room = reservation.room
        hotel = reservation.hotel

        active_sessions[session_id]["reservation"] = {
            "id": reservation.id,
            "confirmation_code": reservation.confirmation_code,
            "qr_code": reservation.qr_code,
            "guest_name": f"{guest.first_name} {guest.last_name}",
            "room_number": room.room_number,
            "check_in_date": str(reservation.check_in_date),
            "check_out_date": str(reservation.check_out_date),
            "hotel_name": hotel.name,
            "status": reservation.status
        }

        return {"message": "Reservation linked successfully", "session": active_sessions[session_id]}

    finally:
        db.close()


@router.delete("/{session_id}")
def delete_session(session_id: str):
    """Eliminar una sesion"""
    if session_id in active_sessions:
        del active_sessions[session_id]
    return {"message": "Session deleted"}


def cleanup_old_sessions():
    """Limpiar sesiones viejas"""
    now = datetime.now()
    expired = [
        sid for sid, session in active_sessions.items()
        if now - session["created_at"] > timedelta(minutes=10)
    ]
    for sid in expired:
        del active_sessions[sid]
