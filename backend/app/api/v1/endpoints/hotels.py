from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.hotel import Hotel
from app.models.user import User
from app.schemas.hotel import HotelCreate, HotelUpdate, HotelResponse
from app.api.deps import get_current_active_superuser, get_current_hotel_admin

router = APIRouter()


@router.get("/", response_model=List[HotelResponse])
def list_hotels(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_hotel_admin),
    skip: int = 0,
    limit: int = 100
):
    if current_user.role.value == "super_admin":
        hotels = db.query(Hotel).offset(skip).limit(limit).all()
    else:
        hotels = db.query(Hotel).filter(Hotel.id == current_user.hotel_id).all()
    return hotels


@router.post("/", response_model=HotelResponse)
def create_hotel(
    hotel_in: HotelCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_superuser)
):
    hotel = Hotel(**hotel_in.model_dump())
    db.add(hotel)
    db.commit()
    db.refresh(hotel)
    return hotel


@router.get("/{hotel_id}", response_model=HotelResponse)
def get_hotel(
    hotel_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_hotel_admin)
):
    hotel = db.query(Hotel).filter(Hotel.id == hotel_id).first()
    if not hotel:
        raise HTTPException(status_code=404, detail="Hotel no encontrado")

    if current_user.role.value != "super_admin" and current_user.hotel_id != hotel_id:
        raise HTTPException(status_code=403, detail="No tiene acceso a este hotel")

    return hotel


@router.put("/{hotel_id}", response_model=HotelResponse)
def update_hotel(
    hotel_id: int,
    hotel_in: HotelUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_hotel_admin)
):
    hotel = db.query(Hotel).filter(Hotel.id == hotel_id).first()
    if not hotel:
        raise HTTPException(status_code=404, detail="Hotel no encontrado")

    if current_user.role.value != "super_admin" and current_user.hotel_id != hotel_id:
        raise HTTPException(status_code=403, detail="No tiene acceso a este hotel")

    update_data = hotel_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(hotel, field, value)

    db.commit()
    db.refresh(hotel)
    return hotel


@router.delete("/{hotel_id}")
def delete_hotel(
    hotel_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_superuser)
):
    hotel = db.query(Hotel).filter(Hotel.id == hotel_id).first()
    if not hotel:
        raise HTTPException(status_code=404, detail="Hotel no encontrado")

    hotel.is_active = False
    db.commit()
    return {"message": "Hotel desactivado exitosamente"}
