from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from app.core.database import get_db
from app.models.kiosk import Kiosk
from app.models.user import User, UserRole
from app.schemas.kiosk import KioskCreate, KioskUpdate, KioskResponse
from app.api.deps import get_current_hotel_admin

router = APIRouter()


@router.get("/", response_model=List[KioskResponse])
def list_kiosks(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_hotel_admin),
    hotel_id: int = None,
    skip: int = 0,
    limit: int = 100
):
    query = db.query(Kiosk)

    if current_user.role != UserRole.SUPER_ADMIN:
        query = query.filter(Kiosk.hotel_id == current_user.hotel_id)
    elif hotel_id:
        query = query.filter(Kiosk.hotel_id == hotel_id)

    return query.offset(skip).limit(limit).all()


@router.post("/", response_model=KioskResponse)
def create_kiosk(
    kiosk_in: KioskCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_hotel_admin)
):
    if current_user.role != UserRole.SUPER_ADMIN and current_user.hotel_id != kiosk_in.hotel_id:
        raise HTTPException(status_code=403, detail="No tiene acceso a este hotel")

    existing = db.query(Kiosk).filter(Kiosk.device_id == kiosk_in.device_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Ya existe un kiosko con ese device_id")

    kiosk = Kiosk(**kiosk_in.model_dump())
    db.add(kiosk)
    db.commit()
    db.refresh(kiosk)
    return kiosk


@router.get("/{kiosk_id}", response_model=KioskResponse)
def get_kiosk(
    kiosk_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_hotel_admin)
):
    kiosk = db.query(Kiosk).filter(Kiosk.id == kiosk_id).first()
    if not kiosk:
        raise HTTPException(status_code=404, detail="Kiosko no encontrado")

    if current_user.role != UserRole.SUPER_ADMIN and current_user.hotel_id != kiosk.hotel_id:
        raise HTTPException(status_code=403, detail="No tiene acceso a este kiosko")

    return kiosk


@router.put("/{kiosk_id}", response_model=KioskResponse)
def update_kiosk(
    kiosk_id: int,
    kiosk_in: KioskUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_hotel_admin)
):
    kiosk = db.query(Kiosk).filter(Kiosk.id == kiosk_id).first()
    if not kiosk:
        raise HTTPException(status_code=404, detail="Kiosko no encontrado")

    if current_user.role != UserRole.SUPER_ADMIN and current_user.hotel_id != kiosk.hotel_id:
        raise HTTPException(status_code=403, detail="No tiene acceso a este kiosko")

    update_data = kiosk_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(kiosk, field, value)

    db.commit()
    db.refresh(kiosk)
    return kiosk


@router.post("/{kiosk_id}/heartbeat")
def kiosk_heartbeat(
    kiosk_id: int,
    db: Session = Depends(get_db)
):
    kiosk = db.query(Kiosk).filter(Kiosk.id == kiosk_id).first()
    if not kiosk:
        raise HTTPException(status_code=404, detail="Kiosko no encontrado")

    kiosk.last_heartbeat = datetime.utcnow()
    db.commit()
    return {"status": "ok", "timestamp": kiosk.last_heartbeat}


@router.delete("/{kiosk_id}")
def deactivate_kiosk(
    kiosk_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_hotel_admin)
):
    kiosk = db.query(Kiosk).filter(Kiosk.id == kiosk_id).first()
    if not kiosk:
        raise HTTPException(status_code=404, detail="Kiosko no encontrado")

    if current_user.role != UserRole.SUPER_ADMIN and current_user.hotel_id != kiosk.hotel_id:
        raise HTTPException(status_code=403, detail="No tiene acceso a este kiosko")

    kiosk.is_active = False
    db.commit()
    return {"message": "Kiosko desactivado exitosamente"}
