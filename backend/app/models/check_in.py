from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base


class CheckIn(Base):
    __tablename__ = "check_ins"

    id = Column(Integer, primary_key=True, index=True)
    reservation_id = Column(Integer, ForeignKey("reservations.id"), nullable=False)
    kiosk_id = Column(Integer, ForeignKey("kiosks.id"), nullable=True)
    check_in_time = Column(DateTime, default=datetime.utcnow)
    check_out_time = Column(DateTime, nullable=True)
    digital_key_code = Column(String(100))
    wristband_code = Column(String(100))
    terms_accepted = Column(Boolean, default=False)
    signature_url = Column(String(500))
    notes = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

    reservation = relationship("Reservation", back_populates="check_ins")
    kiosk = relationship("Kiosk", back_populates="check_ins")
