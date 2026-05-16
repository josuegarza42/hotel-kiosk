from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, Numeric, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from app.core.database import Base


class RoomStatus(str, enum.Enum):
    AVAILABLE = "available"
    OCCUPIED = "occupied"
    CLEANING = "cleaning"
    MAINTENANCE = "maintenance"


class RoomType(str, enum.Enum):
    SINGLE = "single"
    DOUBLE = "double"
    SUITE = "suite"
    DELUXE = "deluxe"
    PRESIDENTIAL = "presidential"


class Room(Base):
    __tablename__ = "rooms"

    id = Column(Integer, primary_key=True, index=True)
    hotel_id = Column(Integer, ForeignKey("hotels.id"), nullable=False)
    room_number = Column(String(20), nullable=False)
    room_type = Column(Enum(RoomType), default=RoomType.SINGLE)
    floor = Column(Integer)
    price_per_night = Column(Numeric(10, 2), nullable=False)
    max_guests = Column(Integer, default=2)
    status = Column(Enum(RoomStatus), default=RoomStatus.AVAILABLE)
    amenities = Column(String(500))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    hotel = relationship("Hotel", back_populates="rooms")
    reservations = relationship("Reservation", back_populates="room")
