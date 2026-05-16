from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.guest import Guest
from app.models.user import User
from app.schemas.guest import GuestCreate, GuestUpdate, GuestResponse
from app.api.deps import get_current_hotel_admin

router = APIRouter()


@router.get("/", response_model=List[GuestResponse])
def list_guests(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_hotel_admin),
    skip: int = 0,
    limit: int = 100
):
    return db.query(Guest).offset(skip).limit(limit).all()


@router.post("/", response_model=GuestResponse)
def create_guest(
    guest_in: GuestCreate,
    db: Session = Depends(get_db)
):
    existing = db.query(Guest).filter(Guest.email == guest_in.email).first()
    if existing:
        return existing

    guest = Guest(**guest_in.model_dump())
    db.add(guest)
    db.commit()
    db.refresh(guest)
    return guest


@router.get("/{guest_id}", response_model=GuestResponse)
def get_guest(
    guest_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_hotel_admin)
):
    guest = db.query(Guest).filter(Guest.id == guest_id).first()
    if not guest:
        raise HTTPException(status_code=404, detail="Huésped no encontrado")
    return guest


@router.get("/email/{email}", response_model=GuestResponse)
def get_guest_by_email(
    email: str,
    db: Session = Depends(get_db)
):
    guest = db.query(Guest).filter(Guest.email == email).first()
    if not guest:
        raise HTTPException(status_code=404, detail="Huésped no encontrado")
    return guest


@router.put("/{guest_id}", response_model=GuestResponse)
def update_guest(
    guest_id: int,
    guest_in: GuestUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_hotel_admin)
):
    guest = db.query(Guest).filter(Guest.id == guest_id).first()
    if not guest:
        raise HTTPException(status_code=404, detail="Huésped no encontrado")

    update_data = guest_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(guest, field, value)

    db.commit()
    db.refresh(guest)
    return guest
