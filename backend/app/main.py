from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from app.core.config import settings
from app.core.database import engine, Base, SessionLocal
from app.api.v1.router import api_router
from app.models import User, Hotel, Room, Guest, Reservation, CheckIn, Kiosk
from app.models.user import UserRole
from app.core.security import get_password_hash
import os

Base.metadata.create_all(bind=engine)

FRONTEND_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "frontend")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_STR)


@app.on_event("startup")
def create_initial_data():
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == settings.FIRST_SUPERUSER_EMAIL).first()
        if not user:
            user = User(
                email=settings.FIRST_SUPERUSER_EMAIL,
                hashed_password=get_password_hash(settings.FIRST_SUPERUSER_PASSWORD),
                full_name="Super Administrador",
                role=UserRole.SUPER_ADMIN,
                is_active=True
            )
            db.add(user)
            db.commit()
            print(f"Super admin creado: {settings.FIRST_SUPERUSER_EMAIL}")
    finally:
        db.close()


@app.get("/health")
def health_check():
    return {"status": "healthy"}


@app.get("/api-info")
def api_info():
    return {
        "message": "Hotel Kiosk API",
        "version": settings.VERSION,
        "docs": f"{settings.API_V1_STR}/docs"
    }


# Serve frontend static files
if os.path.exists(FRONTEND_PATH):
    app.mount("/src", StaticFiles(directory=os.path.join(FRONTEND_PATH, "src")), name="src")
    app.mount("/public", StaticFiles(directory=os.path.join(FRONTEND_PATH, "public")), name="public")

    @app.get("/")
    def serve_frontend():
        return FileResponse(os.path.join(FRONTEND_PATH, "public", "index.html"))

    @app.get("/guest-app")
    def serve_guest_app():
        return FileResponse(os.path.join(FRONTEND_PATH, "public", "guest-app.html"))
else:
    @app.get("/")
    def root():
        return {
            "message": "Hotel Kiosk API",
            "version": settings.VERSION,
            "docs": f"{settings.API_V1_STR}/docs"
        }
