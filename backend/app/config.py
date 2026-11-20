import os
from pydantic import BaseModel

class Settings(BaseModel):
    APP_NAME: str = "JobGuard AI"
    APP_VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "jobguard-super-secure-cybersecurity-secret-key-2026")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./jobguard.db")
    UPLOAD_DIR: str = os.getenv("UPLOAD_DIR", "./uploads")
    MODEL_DIR: str = os.getenv("MODEL_DIR", "./ml/model_artifacts")

settings = Settings()
