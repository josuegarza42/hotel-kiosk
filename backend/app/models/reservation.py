from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Date, Numeric, Enum, Text
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
import uuid
from app.core.database import Base


class ReservationStatus(str, enum.Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    CHECKED_IN = "checked_in"
    CHECKED_OUT = "checked_out"
    CANCELLED = "cancelled"
    NO_SHOW = "no_show"


class PaymentStatus(str, enum.Enum):
    PENDING = "pending"
    PARTIAL = "partial"
    PAID = "paid"
    REFUNDED = "refunded"


class Reservation(Base):
    __tablename__ = "reservations"

    id = Column(Integer, primary_key=True, index=True)
    confirmation_code = Column(String(50), unique=True, index=True, nullable=False)
    qr_code = Column(String(100), unique=True, index=True)
    hotel_id = Column(Integer, ForeignKey("hotels.id"), nullable=False)
    room_id = Column(Integer, ForeignKey("rooms.id"), nullable=False)
    guest_id = Column(Integer, ForeignKey("guests.id"), nullable=False)
    check_in_date = Column(Date, nullable=False)
    check_out_date = Column(Date, nullable=False)
    num_guests = Column(Integer, default=1)
    total_amount = Column(Numeric(10, 2))
    amount_paid = Column(Numeric(10, 2), default=0)
    status = Column(Enum(ReservationStatus), default=ReservationStatus.PENDING)
    payment_status = Column(Enum(PaymentStatus), default=PaymentStatus.PENDING)
    special_requests = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    hotel = relationship("Hotel", back_populates="reservations")
    room = relationship("Room", back_populates="reservations")
    guest = relationship("Guest", back_populates="reservations")
    check_ins = relationship("CheckIn", back_populates="reservation")

    @staticmethod
    def generate_confirmation_code():
        return f"RES-{uuid.uuid4().hex[:8].upper()}"

    @staticmethod
    def generate_qr_code():
        return f"QR-{uuid.uuid4().hex[:12].upper()}"
