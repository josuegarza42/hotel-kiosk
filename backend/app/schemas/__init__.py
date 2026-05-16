from app.schemas.user import UserCreate, UserUpdate, UserResponse, Token, TokenPayload
from app.schemas.hotel import HotelCreate, HotelUpdate, HotelResponse
from app.schemas.room import RoomCreate, RoomUpdate, RoomResponse
from app.schemas.guest import GuestCreate, GuestUpdate, GuestResponse
from app.schemas.reservation import ReservationCreate, ReservationUpdate, ReservationResponse
from app.schemas.check_in import CheckInCreate, CheckInResponse
from app.schemas.kiosk import KioskCreate, KioskUpdate, KioskResponse

__all__ = [
    "UserCreate", "UserUpdate", "UserResponse", "Token", "TokenPayload",
    "HotelCreate", "HotelUpdate", "HotelResponse",
    "RoomCreate", "RoomUpdate", "RoomResponse",
    "GuestCreate", "GuestUpdate", "GuestResponse",
    "ReservationCreate", "ReservationUpdate", "ReservationResponse",
    "CheckInCreate", "CheckInResponse",
    "KioskCreate", "KioskUpdate", "KioskResponse"
]
