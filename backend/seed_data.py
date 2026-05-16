"""Script para poblar la base de datos con datos de prueba."""
import sys
sys.path.append('.')

from datetime import date, timedelta
from app.core.database import SessionLocal, engine, Base
from app.models import User, Hotel, Room, Guest, Reservation, Kiosk
from app.models.user import UserRole
from app.models.room import RoomType, RoomStatus
from app.core.security import get_password_hash

Base.metadata.create_all(bind=engine)

db = SessionLocal()

try:
    # Crear Super Admin si no existe
    admin = db.query(User).filter(User.email == "admin@hotelkiosk.com").first()
    if not admin:
        admin = User(
            email="admin@hotelkiosk.com",
            hashed_password=get_password_hash("admin123"),
            full_name="Super Administrador",
            role=UserRole.SUPER_ADMIN,
            is_active=True
        )
        db.add(admin)
        db.commit()
        print("✓ Super Admin creado: admin@hotelkiosk.com / admin123")

    # Crear Hotel de prueba
    hotel = db.query(Hotel).filter(Hotel.name == "Hotel Plaza Centro").first()
    if not hotel:
        hotel = Hotel(
            name="Hotel Plaza Centro",
            address="Av. Reforma 500, Col. Centro",
            city="Ciudad de Mexico",
            state="CDMX",
            country="Mexico",
            phone="+52 55 1234 5678",
            email="contacto@hotelplaza.com",
            check_in_time="15:00",
            check_out_time="12:00"
        )
        db.add(hotel)
        db.commit()
        print(f"✓ Hotel creado: {hotel.name}")

    # Crear Admin de Hotel
    hotel_admin = db.query(User).filter(User.email == "admin@hotelplaza.com").first()
    if not hotel_admin:
        hotel_admin = User(
            email="admin@hotelplaza.com",
            hashed_password=get_password_hash("hotel123"),
            full_name="Administrador Hotel Plaza",
            role=UserRole.HOTEL_ADMIN,
            hotel_id=hotel.id,
            is_active=True
        )
        db.add(hotel_admin)
        db.commit()
        print("✓ Admin de Hotel creado: admin@hotelplaza.com / hotel123")

    # Crear Habitaciones
    rooms_data = [
        {"room_number": "101", "room_type": RoomType.SINGLE, "floor": 1, "price": 800, "max_guests": 1},
        {"room_number": "102", "room_type": RoomType.SINGLE, "floor": 1, "price": 800, "max_guests": 1},
        {"room_number": "103", "room_type": RoomType.DOUBLE, "floor": 1, "price": 1200, "max_guests": 2},
        {"room_number": "201", "room_type": RoomType.DOUBLE, "floor": 2, "price": 1200, "max_guests": 2},
        {"room_number": "202", "room_type": RoomType.SUITE, "floor": 2, "price": 2500, "max_guests": 4},
        {"room_number": "301", "room_type": RoomType.DELUXE, "floor": 3, "price": 3500, "max_guests": 4},
        {"room_number": "401", "room_type": RoomType.PRESIDENTIAL, "floor": 4, "price": 8000, "max_guests": 6},
    ]

    for room_data in rooms_data:
        existing = db.query(Room).filter(
            Room.hotel_id == hotel.id,
            Room.room_number == room_data["room_number"]
        ).first()
        if not existing:
            room = Room(
                hotel_id=hotel.id,
                room_number=room_data["room_number"],
                room_type=room_data["room_type"],
                floor=room_data["floor"],
                price_per_night=room_data["price"],
                max_guests=room_data["max_guests"],
                status=RoomStatus.AVAILABLE
            )
            db.add(room)
    db.commit()
    print(f"✓ {len(rooms_data)} habitaciones creadas/verificadas")

    # Crear Huespedes de prueba
    guests_data = [
        {"first_name": "Juan", "last_name": "Perez", "email": "juan.perez@email.com", "phone": "+52 55 1111 2222", "nationality": "Mexicana"},
        {"first_name": "Maria", "last_name": "Garcia", "email": "maria.garcia@email.com", "phone": "+52 55 3333 4444", "nationality": "Mexicana"},
        {"first_name": "Carlos", "last_name": "Lopez", "email": "carlos.lopez@email.com", "phone": "+52 55 5555 6666", "nationality": "Mexicana"},
        {"first_name": "Ana", "last_name": "Martinez", "email": "ana.martinez@email.com", "phone": "+1 555 1234", "nationality": "Estadounidense"},
    ]

    for guest_data in guests_data:
        existing = db.query(Guest).filter(Guest.email == guest_data["email"]).first()
        if not existing:
            guest = Guest(**guest_data)
            db.add(guest)
    db.commit()
    print(f"✓ {len(guests_data)} huespedes creados/verificados")

    # Crear Kioscos
    kiosk = db.query(Kiosk).filter(Kiosk.device_id == "KIOSK-001").first()
    if not kiosk:
        kiosk = Kiosk(
            hotel_id=hotel.id,
            name="Kiosko Lobby Principal",
            location="Lobby - Entrada Principal",
            device_id="KIOSK-001",
            is_active=True
        )
        db.add(kiosk)
        db.commit()
        print("✓ Kiosko creado: KIOSK-001")

    # Crear Reservaciones de prueba
    guest1 = db.query(Guest).filter(Guest.email == "juan.perez@email.com").first()
    room1 = db.query(Room).filter(Room.hotel_id == hotel.id, Room.room_number == "101").first()

    if guest1 and room1:
        existing_res = db.query(Reservation).filter(Reservation.guest_id == guest1.id).first()
        if not existing_res:
            today = date.today()
            reservation = Reservation(
                confirmation_code=Reservation.generate_confirmation_code(),
                qr_code=Reservation.generate_qr_code(),
                hotel_id=hotel.id,
                room_id=room1.id,
                guest_id=guest1.id,
                check_in_date=today,
                check_out_date=today + timedelta(days=3),
                num_guests=1,
                total_amount=room1.price_per_night * 3
            )
            db.add(reservation)
            db.commit()
            print(f"✓ Reservacion creada: {reservation.confirmation_code}")
            print(f"  QR Code para pruebas: {reservation.qr_code}")

    print("\n" + "="*50)
    print("DATOS DE PRUEBA CREADOS EXITOSAMENTE")
    print("="*50)
    print("\nCredenciales de acceso:")
    print("  Super Admin: admin@hotelkiosk.com / admin123")
    print("  Hotel Admin: admin@hotelplaza.com / hotel123")
    print("\nPara iniciar el servidor:")
    print("  cd backend && uvicorn app.main:app --reload")
    print("\nPara ver la documentacion de la API:")
    print("  http://localhost:8000/docs")

except Exception as e:
    print(f"Error: {e}")
    db.rollback()
finally:
    db.close()
