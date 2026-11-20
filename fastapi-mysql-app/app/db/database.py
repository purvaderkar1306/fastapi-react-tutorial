"""Database connection: engine, session factory, base class, and the get_db dependency."""

from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from app.core.config import get_settings

settings = get_settings()

# The engine manages a pool of connections to MySQL.
engine = create_engine(
    settings.database_url,
    echo=settings.db_echo,   # print SQL to the terminal when DB_ECHO=true
    pool_pre_ping=True,      # test a connection before using it (MySQL closes idle ones)
    pool_recycle=3600,       # replace connections older than one hour
)

# Each request gets its own Session made by this factory.
SessionLocal = sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)


class Base(DeclarativeBase):
    """Parent class for all ORM models (tables)."""


def get_db() -> Generator[Session, None, None]:
    """FastAPI dependency: open a session for one request and always close it afterwards."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
