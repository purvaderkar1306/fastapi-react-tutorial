"""Create the tables and load starting data from data/students.json (only when the table is empty)."""

import json
import logging

from app.core.config import BASE_DIR
from app.crud import student as crud
from app.db.database import Base, SessionLocal, engine
from app.schemas.student import StudentCreate
import app.models  # noqa: F401  (import the models so Base knows about every table)

log = logging.getLogger("uvicorn.error")

SEED_FILE = BASE_DIR / "data" / "students.json"


def create_tables() -> None:
    """CREATE TABLE IF NOT EXISTS for every model."""
    Base.metadata.create_all(bind=engine)


def seed_students() -> int:
    """Insert the students from the JSON file if the table has no rows. Returns how many were added."""
    with SessionLocal() as db:
        if crud.count_students(db) > 0:
            return 0
        raw = json.loads(SEED_FILE.read_text(encoding="utf-8"))
        for item in raw:
            crud.create_student(db, StudentCreate.model_validate(item))
        log.info("Seeded %d students from %s", len(raw), SEED_FILE.name)
        return len(raw)
