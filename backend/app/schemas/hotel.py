from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class HotelBase(BaseModel):
    name: str
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    logo_url: Optional[str] = None
    check_in_time: str = "15:00"
    check_out_time: str = "11:00"


class HotelCreate(HotelBase):
    pass


class HotelUpdate(BaseModel):
    name: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    logo_url: Optional[str] = None
    check_in_time: Optional[str] = None
    check_out_time: Optional[str] = None
    is_active: Optional[bool] = None


class HotelResponse(HotelBase):
    id: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True
