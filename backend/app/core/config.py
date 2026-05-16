from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    PROJECT_NAME: str = "Hotel Kiosk API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"

    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    DATABASE_URL: str = "sqlite:///./hotel_kiosk.db"

    FIRST_SUPERUSER_EMAIL: str = "admin@hotelkiosk.com"
    FIRST_SUPERUSER_PASSWORD: str = "admin123"

    # Email/SMTP Configuration
    SMTP_HOST: Optional[str] = None
    SMTP_PORT: int = 587
    SMTP_USER: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None
    SMTP_USE_TLS: bool = True
    EMAIL_FROM_NAME: str = "Hotel Kiosk"
    EMAIL_FROM_ADDRESS: Optional[str] = None

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
