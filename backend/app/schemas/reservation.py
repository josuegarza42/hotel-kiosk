from pydantic import BaseModel
from typing import Optional
from datetime import datetime, date
from decimal import Decimal
from app.models.reservation import ReservationStatus, PaymentStatus


class ReservationBase(BaseModel):
    hotel_id: int
    room_id: int
    guest_id: int
    check_in_date: date
    check_out_date: date
    num_guests: int = 1
    special_requests: Optional[str] = None


class ReservationCreate(ReservationBase):
    pass


class ReservationUpdate(BaseModel):
    room_id: Optional[int] = None
    check_in_date: Optional[date] = None
    check_out_date: Optional[date] = None
    num_guests: Optional[int] = None
    status: Optional[ReservationStatus] = None
    payment_status: Optional[PaymentStatus] = None
    amount_paid: Optional[Decimal] = None
    special_requests: Optional[str] = None


class ReservationResponse(ReservationBase):
    id: int
    confirmation_code: str
    qr_code: str
    total_amount: Optional[Decimal]
    amount_paid: Decimal
    status: ReservationStatus
    payment_status: PaymentStatus
    created_at: datetime

    class Config:
        from_attributes = True


class ReservationWithQR(ReservationResponse):
    qr_image_base64: str
