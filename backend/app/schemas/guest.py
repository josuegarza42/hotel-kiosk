from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime, date


class GuestBase(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str
    phone: Optional[str] = None
    id_type: Optional[str] = None
    id_number: Optional[str] = None
    nationality: Optional[str] = None
    date_of_birth: Optional[date] = None
    address: Optional[str] = None


class GuestCreate(GuestBase):
    pass


class GuestUpdate(BaseModel):
    email: Optional[EmailStr] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    id_type: Optional[str] = None
    id_number: Optional[str] = None
    nationality: Optional[str] = None
    date_of_birth: Optional[date] = None
    address: Optional[str] = None


class GuestResponse(GuestBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
