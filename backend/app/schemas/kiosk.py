from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class KioskBase(BaseModel):
    name: str
    location: Optional[str] = None
    device_id: str


class KioskCreate(KioskBase):
    hotel_id: int


class KioskUpdate(BaseModel):
    name: Optional[str] = None
    location: Optional[str] = None
    is_active: Optional[bool] = None


class KioskResponse(KioskBase):
    id: int
    hotel_id: int
    is_active: bool
    last_heartbeat: Optional[datetime]
    created_at: datetime

    class Config:
        from_attributes = True
