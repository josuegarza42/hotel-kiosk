from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from decimal import Decimal
from app.models.room import RoomStatus, RoomType


class RoomBase(BaseModel):
    room_number: str
    room_type: RoomType = RoomType.SINGLE
    floor: Optional[int] = None
    price_per_night: Decimal
    max_guests: int = 2
    amenities: Optional[str] = None


class RoomCreate(RoomBase):
    hotel_id: int


class RoomUpdate(BaseModel):
    room_number: Optional[str] = None
    room_type: Optional[RoomType] = None
    floor: Optional[int] = None
    price_per_night: Optional[Decimal] = None
    max_guests: Optional[int] = None
    status: Optional[RoomStatus] = None
    amenities: Optional[str] = None
    is_active: Optional[bool] = None


class RoomResponse(RoomBase):
    id: int
    hotel_id: int
    status: RoomStatus
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True
