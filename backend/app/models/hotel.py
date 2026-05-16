from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base


class Hotel(Base):
    __tablename__ = "hotels"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    address = Column(Text)
    city = Column(String(100))
    state = Column(String(100))
    country = Column(String(100))
    phone = Column(String(50))
    email = Column(String(255))
    logo_url = Column(String(500))
    check_in_time = Column(String(10), default="15:00")
    check_out_time = Column(String(10), default="11:00")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    users = relationship("User", back_populates="hotel")
    rooms = relationship("Room", back_populates="hotel")
    reservations = relationship("Reservation", back_populates="hotel")
    kiosks = relationship("Kiosk", back_populates="hotel")
