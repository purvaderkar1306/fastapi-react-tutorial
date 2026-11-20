"""App settings, read from environment variables or the .env file."""

from functools import lru_cache
from pathlib import Path
from urllib.parse import quote_plus

from pydantic_settings import BaseSettings, SettingsConfigDict

# fastapi-mysql-app/  (two levels up from this file: app/core/config.py)
BASE_DIR = Path(__file__).resolve().parent.parent.parent


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=BASE_DIR / ".env", env_file_encoding="utf-8")

    app_name: str = "Student API (MySQL)"

    db_host: str = "127.0.0.1"
    db_port: int = 3306
    db_user: str = "root"
    db_password: str = ""
    db_name: str = "studentfastapi"
    db_echo: bool = False

    seed_on_startup: bool = True

    @property
    def database_url(self) -> str:
        """SQLAlchemy connection URL, e.g. mysql+pymysql://root:***@127.0.0.1:3306/studentfastapi"""
        password = quote_plus(self.db_password)  # escape special characters such as @ or :
        return (
            f"mysql+pymysql://{self.db_user}:{password}@{self.db_host}:{self.db_port}"
            f"/{self.db_name}?charset=utf8mb4"
        )


@lru_cache
def get_settings() -> Settings:
    """Read the settings once and reuse them."""
    return Settings()
