from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.check_in import CheckInCreate, CheckInResponse, CheckOutRequest
from app.services.check_in_service import CheckInService

router = APIRouter()


@router.post("/", response_model=CheckInResponse)
def process_check_in(
    check_in_data: CheckInCreate,
    db: Session = Depends(get_db)
):
    try:
        result = CheckInService.process_check_in(
            db=db,
            qr_code=check_in_data.qr_code,
            kiosk_id=check_in_data.kiosk_id,
            terms_accepted=check_in_data.terms_accepted,
            signature_url=check_in_data.signature_url
        )

        check_in = result["check_in"]
        reservation = result["reservation"]
        room = result["room"]
        guest = result["guest"]
        hotel = result["hotel"]

        return CheckInResponse(
            id=check_in.id,
            reservation_id=check_in.reservation_id,
            kiosk_id=check_in.kiosk_id,
            check_in_time=check_in.check_in_time,
            check_out_time=check_in.check_out_time,
            digital_key_code=check_in.digital_key_code,
            wristband_code=check_in.wristband_code,
            terms_accepted=check_in.terms_accepted,
            room_number=room.room_number,
            hotel_name=hotel.name,
            guest_name=f"{guest.first_name} {guest.last_name}"
        )

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/checkout")
def process_check_out(
    checkout_data: CheckOutRequest,
    db: Session = Depends(get_db)
):
    try:
        result = CheckInService.process_check_out(
            db=db,
            reservation_id=checkout_data.reservation_id,
            notes=checkout_data.notes
        )
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/verify/{qr_code}")
def verify_qr_code(
    qr_code: str,
    db: Session = Depends(get_db)
):
    from app.models.reservation import Reservation

    reservation = db.query(Reservation).filter(
        Reservation.qr_code == qr_code
    ).first()

    if not reservation:
        raise HTTPException(status_code=404, detail="QR no válido")

    return {
        "valid": True,
        "confirmation_code": reservation.confirmation_code,
        "guest_name": f"{reservation.guest.first_name} {reservation.guest.last_name}",
        "room_number": reservation.room.room_number,
        "check_in_date": reservation.check_in_date,
        "check_out_date": reservation.check_out_date,
        "status": reservation.status.value,
        "hotel_name": reservation.hotel.name
    }
