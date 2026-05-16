import uuid
import logging
from datetime import datetime
from sqlalchemy.orm import Session
from app.models.reservation import Reservation, ReservationStatus
from app.models.check_in import CheckIn
from app.models.room import Room, RoomStatus
from app.services.email_service import EmailService

logger = logging.getLogger(__name__)


class CheckInService:
    @staticmethod
    def generate_digital_key() -> str:
        return f"KEY-{uuid.uuid4().hex[:8].upper()}"

    @staticmethod
    def generate_wristband_code() -> str:
        return f"WB-{uuid.uuid4().hex[:6].upper()}"

    @staticmethod
    def process_check_in(
        db: Session,
        qr_code: str,
        kiosk_id: int = None,
        terms_accepted: bool = True,
        signature_url: str = None
    ) -> dict:
        reservation = db.query(Reservation).filter(
            Reservation.qr_code == qr_code
        ).first()

        if not reservation:
            raise ValueError("Reservación no encontrada")

        if reservation.status == ReservationStatus.CHECKED_IN:
            raise ValueError("Ya se realizó el check-in para esta reservación")

        if reservation.status == ReservationStatus.CANCELLED:
            raise ValueError("Esta reservación fue cancelada")

        if reservation.status == ReservationStatus.CHECKED_OUT:
            raise ValueError("Esta reservación ya fue completada")

        today = datetime.now().date()
        if reservation.check_in_date > today:
            raise ValueError(f"El check-in está programado para {reservation.check_in_date}")

        check_in = CheckIn(
            reservation_id=reservation.id,
            kiosk_id=kiosk_id,
            digital_key_code=CheckInService.generate_digital_key(),
            wristband_code=CheckInService.generate_wristband_code(),
            terms_accepted=terms_accepted,
            signature_url=signature_url
        )

        reservation.status = ReservationStatus.CHECKED_IN
        reservation.room.status = RoomStatus.OCCUPIED

        db.add(check_in)
        db.commit()
        db.refresh(check_in)

        # Send check-in confirmation email (non-blocking)
        try:
            guest = reservation.guest
            if guest.email:
                EmailService.send_check_in_confirmation(
                    guest_email=guest.email,
                    guest_name=f"{guest.first_name} {guest.last_name}",
                    hotel_name=reservation.hotel.name,
                    room_number=reservation.room.room_number,
                    digital_key_code=check_in.digital_key_code,
                    wristband_code=check_in.wristband_code,
                    check_in_date=reservation.check_in_date,
                    check_out_date=reservation.check_out_date
                )
        except Exception as e:
            # Email failure should not block check-in process
            logger.error(f"Failed to send check-in confirmation email: {str(e)}")

        return {
            "check_in": check_in,
            "reservation": reservation,
            "room": reservation.room,
            "guest": reservation.guest,
            "hotel": reservation.hotel
        }

    @staticmethod
    def process_check_out(
        db: Session,
        reservation_id: int,
        notes: str = None
    ) -> dict:
        reservation = db.query(Reservation).filter(
            Reservation.id == reservation_id
        ).first()

        if not reservation:
            raise ValueError("Reservación no encontrada")

        if reservation.status != ReservationStatus.CHECKED_IN:
            raise ValueError("No se puede hacer check-out sin check-in previo")

        check_in = db.query(CheckIn).filter(
            CheckIn.reservation_id == reservation_id,
            CheckIn.check_out_time.is_(None)
        ).first()

        if check_in:
            check_in.check_out_time = datetime.utcnow()
            check_in.notes = notes

        reservation.status = ReservationStatus.CHECKED_OUT
        reservation.room.status = RoomStatus.CLEANING

        db.commit()

        # Send check-out confirmation email (non-blocking)
        try:
            guest = reservation.guest
            if guest.email:
                # Calculate total nights
                check_in_date = reservation.check_in_date
                check_out_date = reservation.check_out_date
                if hasattr(check_in_date, 'date'):
                    check_in_date = check_in_date.date() if callable(getattr(check_in_date, 'date', None)) else check_in_date
                if hasattr(check_out_date, 'date'):
                    check_out_date = check_out_date.date() if callable(getattr(check_out_date, 'date', None)) else check_out_date
                total_nights = (check_out_date - check_in_date).days

                EmailService.send_check_out_confirmation(
                    guest_email=guest.email,
                    guest_name=f"{guest.first_name} {guest.last_name}",
                    hotel_name=reservation.hotel.name,
                    room_number=reservation.room.room_number,
                    check_in_date=reservation.check_in_date,
                    check_out_date=reservation.check_out_date,
                    total_nights=max(total_nights, 1)
                )
        except Exception as e:
            # Email failure should not block check-out process
            logger.error(f"Failed to send check-out confirmation email: {str(e)}")

        return {
            "reservation": reservation,
            "room": reservation.room,
            "message": "Check-out completado exitosamente"
        }
