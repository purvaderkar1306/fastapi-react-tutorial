"""Application entry point: `uvicorn app.main:app --reload`"""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from fastapi.staticfiles import StaticFiles
from sqlalchemy import text

from app.core.config import BASE_DIR, get_settings
from app.db.database import engine
from app.db.seed import create_tables, seed_students
from app.routers import students

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Runs once when the server starts
    create_tables()
    if settings.seed_on_startup:
        seed_students()
    yield
    # Runs once when the server stops
    engine.dispose()


app = FastAPI(
    title=settings.app_name,
    description="CRUD API for students, stored in the MySQL database `studentfastapi`.",
    version="1.0.0",
    lifespan=lifespan,
)

# Allow the frontend to call the API from another origin (e.g. VS Code Live Server)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(students.router)


@app.get("/", tags=["general"], summary="Health check")
def root():
    return {"message": "Student API (MySQL) is running", "docs": "/docs", "frontend": "/ui/"}


@app.get("/health/db", tags=["general"], summary="Check the database connection")
def db_health():
    with engine.connect() as conn:
        version = conn.execute(text("SELECT VERSION()")).scalar()
    return {"database": settings.db_name, "mysql_version": version, "status": "ok"}


@app.get("/ui", include_in_schema=False)
def ui_redirect():
    return RedirectResponse("/ui/")


# Serve the HTML/CSS/JS frontend at http://127.0.0.1:8000/ui/
app.mount("/ui", StaticFiles(directory=BASE_DIR / "frontend", html=True), name="frontend")
