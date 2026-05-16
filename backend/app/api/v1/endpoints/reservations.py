from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import date
from app.core.database import get_db
from app.models.reservation import Reservation
from app.models.room import Room
from app.models.guest import Guest
from app.models.user import User
from app.schemas.reservation import ReservationCreate, ReservationUpdate, ReservationResponse, ReservationWithQR
from app.services.qr_service import QRService
from app.api.deps import get_current_hotel_admin

router = APIRouter()


@router.get("/", response_model=List[ReservationResponse])
def list_reservations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_hotel_admin),
    hotel_id: int = None,
    status: str = None,
    check_in_date: date = None,
    skip: int = 0,
    limit: int = 100
):
    query = db.query(Reservation)

    if current_user.role.value != "super_admin":
        query = query.filter(Reservation.hotel_id == current_user.hotel_id)
    elif hotel_id:
        query = query.filter(Reservation.hotel_id == hotel_id)

    if status:
        query = query.filter(Reservation.status == status)

    if check_in_date:
        query = query.filter(Reservation.check_in_date == check_in_date)

    return query.order_by(Reservation.check_in_date.desc()).offset(skip).limit(limit).all()


@router.post("/", response_model=ReservationWithQR)
def create_reservation(
    reservation_in: ReservationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_hotel_admin)
):
    if current_user.role.value != "super_admin" and current_user.hotel_id != reservation_in.hotel_id:
        raise HTTPException(status_code=403, detail="No tiene acceso a este hotel")

    room = db.query(Room).filter(Room.id == reservation_in.room_id).first()
    if not room:
        raise HTTPException(status_code=404, detail="Habitación no encontrada")

    guest = db.query(Guest).filter(Guest.id == reservation_in.guest_id).first()
    if not guest:
        raise HTTPException(status_code=404, detail="Huésped no encontrado")

    if reservation_in.check_out_date <= reservation_in.check_in_date:
        raise HTTPException(status_code=400, detail="La fecha de check-out debe ser posterior al check-in")

    nights = (reservation_in.check_out_date - reservation_in.check_in_date).days
    total_amount = float(room.price_per_night) * nights

    reservation = Reservation(
        **reservation_in.model_dump(),
        confirmation_code=Reservation.generate_confirmation_code(),
        qr_code=Reservation.generate_qr_code(),
        total_amount=total_amount
    )

    db.add(reservation)
    db.commit()
    db.refresh(reservation)

    qr_image = QRService.generate_check_in_qr(reservation.qr_code, reservation.hotel_id)

    return ReservationWithQR(
        **ReservationResponse.model_validate(reservation).model_dump(),
        qr_image_base64=qr_image
    )


@router.get("/{reservation_id}", response_model=ReservationResponse)
def get_reservation(
    reservation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_hotel_admin)
):
    reservation = db.query(Reservation).filter(Reservation.id == reservation_id).first()
    if not reservation:
        raise HTTPException(status_code=404, detail="Reservación no encontrada")

    if current_user.role.value != "super_admin" and current_user.hotel_id != reservation.hotel_id:
        raise HTTPException(status_code=403, detail="No tiene acceso a esta reservación")

    return reservation


@router.get("/code/{confirmation_code}", response_model=ReservationWithQR)
def get_reservation_by_code(
    confirmation_code: str,
    db: Session = Depends(get_db)
):
    reservation = db.query(Reservation).filter(
        Reservation.confirmation_code == confirmation_code
    ).first()
    if not reservation:
        raise HTTPException(status_code=404, detail="Reservación no encontrada")

    qr_image = QRService.generate_check_in_qr(reservation.qr_code, reservation.hotel_id)

    return ReservationWithQR(
        **ReservationResponse.model_validate(reservation).model_dump(),
        qr_image_base64=qr_image
    )


@router.put("/{reservation_id}", response_model=ReservationResponse)
def update_reservation(
    reservation_id: int,
    reservation_in: ReservationUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_hotel_admin)
):
    reservation = db.query(Reservation).filter(Reservation.id == reservation_id).first()
    if not reservation:
        raise HTTPException(status_code=404, detail="Reservación no encontrada")

    if current_user.role.value != "super_admin" and current_user.hotel_id != reservation.hotel_id:
        raise HTTPException(status_code=403, detail="No tiene acceso a esta reservación")

    update_data = reservation_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(reservation, field, value)

    db.commit()
    db.refresh(reservation)
    return reservation


@router.delete("/{reservation_id}")
def cancel_reservation(
    reservation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_hotel_admin)
):
    reservation = db.query(Reservation).filter(Reservation.id == reservation_id).first()
    if not reservation:
        raise HTTPException(status_code=404, detail="Reservación no encontrada")

    if current_user.role.value != "super_admin" and current_user.hotel_id != reservation.hotel_id:
        raise HTTPException(status_code=403, detail="No tiene acceso a esta reservación")

    reservation.status = "cancelled"
    db.commit()
    return {"message": "Reservación cancelada exitosamente"}
