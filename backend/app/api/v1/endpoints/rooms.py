from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.room import Room
from app.models.user import User
from app.schemas.room import RoomCreate, RoomUpdate, RoomResponse
from app.api.deps import get_current_hotel_admin

router = APIRouter()


@router.get("/", response_model=List[RoomResponse])
def list_rooms(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_hotel_admin),
    hotel_id: int = None,
    skip: int = 0,
    limit: int = 100
):
    query = db.query(Room)

    if current_user.role.value != "super_admin":
        query = query.filter(Room.hotel_id == current_user.hotel_id)
    elif hotel_id:
        query = query.filter(Room.hotel_id == hotel_id)

    return query.offset(skip).limit(limit).all()


@router.post("/", response_model=RoomResponse)
def create_room(
    room_in: RoomCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_hotel_admin)
):
    if current_user.role.value != "super_admin" and current_user.hotel_id != room_in.hotel_id:
        raise HTTPException(status_code=403, detail="No tiene acceso a este hotel")

    existing = db.query(Room).filter(
        Room.hotel_id == room_in.hotel_id,
        Room.room_number == room_in.room_number
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Ya existe una habitación con ese número")

    room = Room(**room_in.model_dump())
    db.add(room)
    db.commit()
    db.refresh(room)
    return room


@router.get("/{room_id}", response_model=RoomResponse)
def get_room(
    room_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_hotel_admin)
):
    room = db.query(Room).filter(Room.id == room_id).first()
    if not room:
        raise HTTPException(status_code=404, detail="Habitación no encontrada")

    if current_user.role.value != "super_admin" and current_user.hotel_id != room.hotel_id:
        raise HTTPException(status_code=403, detail="No tiene acceso a esta habitación")

    return room


@router.put("/{room_id}", response_model=RoomResponse)
def update_room(
    room_id: int,
    room_in: RoomUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_hotel_admin)
):
    room = db.query(Room).filter(Room.id == room_id).first()
    if not room:
        raise HTTPException(status_code=404, detail="Habitación no encontrada")

    if current_user.role.value != "super_admin" and current_user.hotel_id != room.hotel_id:
        raise HTTPException(status_code=403, detail="No tiene acceso a esta habitación")

    update_data = room_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(room, field, value)

    db.commit()
    db.refresh(room)
    return room


@router.delete("/{room_id}")
def delete_room(
    room_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_hotel_admin)
):
    room = db.query(Room).filter(Room.id == room_id).first()
    if not room:
        raise HTTPException(status_code=404, detail="Habitación no encontrada")

    if current_user.role.value != "super_admin" and current_user.hotel_id != room.hotel_id:
        raise HTTPException(status_code=403, detail="No tiene acceso a esta habitación")

    room.is_active = False
    db.commit()
    return {"message": "Habitación desactivada exitosamente"}
