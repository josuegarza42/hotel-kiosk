from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class CheckInCreate(BaseModel):
    qr_code: str
    kiosk_id: Optional[int] = None
    terms_accepted: bool = True
    signature_url: Optional[str] = None


class CheckInResponse(BaseModel):
    id: int
    reservation_id: int
    kiosk_id: Optional[int]
    check_in_time: datetime
    check_out_time: Optional[datetime]
    digital_key_code: str
    wristband_code: Optional[str]
    terms_accepted: bool
    room_number: str
    hotel_name: str
    guest_name: str

    class Config:
        from_attributes = True


class CheckOutRequest(BaseModel):
    reservation_id: int
    notes: Optional[str] = None
