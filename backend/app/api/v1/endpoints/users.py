from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.core.security import get_password_hash
from app.models.user import User, UserRole
from app.schemas.user import UserCreate, UserUpdate, UserResponse
from app.api.deps import get_current_active_superuser, get_current_hotel_admin

router = APIRouter()


@router.get("/", response_model=List[UserResponse])
def list_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_hotel_admin),
    hotel_id: int = None,
    skip: int = 0,
    limit: int = 100
):
    query = db.query(User)

    if current_user.role != UserRole.SUPER_ADMIN:
        query = query.filter(User.hotel_id == current_user.hotel_id)
    elif hotel_id:
        query = query.filter(User.hotel_id == hotel_id)

    return query.offset(skip).limit(limit).all()


@router.post("/", response_model=UserResponse)
def create_user(
    user_in: UserCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_hotel_admin)
):
    if current_user.role != UserRole.SUPER_ADMIN:
        if user_in.role == UserRole.SUPER_ADMIN:
            raise HTTPException(status_code=403, detail="No puede crear super administradores")
        if user_in.hotel_id and user_in.hotel_id != current_user.hotel_id:
            raise HTTPException(status_code=403, detail="No tiene acceso a este hotel")
        user_in.hotel_id = current_user.hotel_id

    existing = db.query(User).filter(User.email == user_in.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Ya existe un usuario con ese email")

    user = User(
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password),
        full_name=user_in.full_name,
        role=user_in.role,
        hotel_id=user_in.hotel_id
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.get("/{user_id}", response_model=UserResponse)
def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_hotel_admin)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    if current_user.role != UserRole.SUPER_ADMIN and current_user.hotel_id != user.hotel_id:
        raise HTTPException(status_code=403, detail="No tiene acceso a este usuario")

    return user


@router.put("/{user_id}", response_model=UserResponse)
def update_user(
    user_id: int,
    user_in: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_hotel_admin)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    if current_user.role != UserRole.SUPER_ADMIN:
        if current_user.hotel_id != user.hotel_id:
            raise HTTPException(status_code=403, detail="No tiene acceso a este usuario")
        if user_in.role == UserRole.SUPER_ADMIN:
            raise HTTPException(status_code=403, detail="No puede asignar rol de super admin")

    update_data = user_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(user, field, value)

    db.commit()
    db.refresh(user)
    return user


@router.delete("/{user_id}")
def deactivate_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_hotel_admin)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    if current_user.role != UserRole.SUPER_ADMIN and current_user.hotel_id != user.hotel_id:
        raise HTTPException(status_code=403, detail="No tiene acceso a este usuario")

    if user.id == current_user.id:
        raise HTTPException(status_code=400, detail="No puede desactivar su propio usuario")

    user.is_active = False
    db.commit()
    return {"message": "Usuario desactivado exitosamente"}
