import json
from pathlib import Path

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

from model import Student, StudentCreate, StudentUpdate

tags_metadata = [
    {"name": "general", "description": "General endpoints."},
    {"name": "items", "description": "Operations on items."},
    {"name": "students", "description": "CRUD operations on students."},
]

app = FastAPI(
    title="FastAPI Tutorial App",
    description="A simple FastAPI app with Swagger (OpenAPI) documentation.",
    version="1.0.0",
    openapi_tags=tags_metadata,
    docs_url="/docs",        # Swagger UI
    redoc_url="/redoc",      # ReDoc UI
    openapi_url="/openapi.json",
)

# Allow the frontend to call the API when it is opened from another origin
# (e.g. VS Code Live Server on port 5500, or straight from the file system).
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve the HTML/CSS/JS frontend at http://127.0.0.1:8000/ui/
FRONTEND_DIR = Path(__file__).parent / "frontend"
app.mount("/ui", StaticFiles(directory=FRONTEND_DIR, html=True), name="frontend")


class Item(BaseModel):
    name: str = Field(..., description="Name of the item", examples=["Laptop"])
    price: float = Field(..., gt=0, description="Price of the item", examples=[999.99])


@app.get("/", tags=["general"], summary="Root endpoint")
def root():
    return {"message": "Hello from FastAPI"}


@app.get("/items/{item_id}", tags=["items"], summary="Get an item by ID")
def get_item(item_id: int, q: str | None = None):
    """Fetch an item by its ID, with an optional query string `q`."""
    return {"item_id": item_id, "q": q}


@app.post("/items", tags=["items"], summary="Create an item", status_code=201)
def create_item(item: Item):
    """Create a new item with a name and a price."""
    return {"created": item}


# ---------------- Students CRUD ----------------

# Starting data: loaded from students.json (raw JSON) when the server starts.
STUDENTS_FILE = Path(__file__).parent / "students.json"

with open(STUDENTS_FILE, encoding="utf-8") as f:
    raw_students = json.load(f)  # a list of plain dictionaries

# In-memory storage (changes are lost when the server restarts)
students_db: dict[int, Student] = {}
next_student_id = 1

for raw in raw_students:
    s = StudentCreate.model_validate(raw)  # check each entry against the schema
    students_db[next_student_id] = Student(id=next_student_id, **s.model_dump())
    next_student_id += 1


def _get_student_or_404(student_id: int) -> Student:
    student = students_db.get(student_id)
    if student is None:
        raise HTTPException(status_code=404, detail=f"Student {student_id} not found")
    return student


@app.post("/students", response_model=Student, status_code=status.HTTP_201_CREATED,
          tags=["students"], summary="Create a student")
def create_student(student: StudentCreate):
    global next_student_id
    new_student = Student(id=next_student_id, **student.model_dump())
    students_db[next_student_id] = new_student
    next_student_id += 1
    return new_student


@app.get("/students", response_model=list[Student], tags=["students"], summary="List students")
def list_students(skip: int = 0, limit: int = 100):
    return list(students_db.values())[skip: skip + limit]


@app.get("/students/{student_id}", response_model=Student, tags=["students"],
         summary="Get a student by ID")
def get_student(student_id: int):
    return _get_student_or_404(student_id)


@app.put("/students/{student_id}", response_model=Student, tags=["students"],
         summary="Replace a student")
def replace_student(student_id: int, student: StudentCreate):
    _get_student_or_404(student_id)
    updated = Student(id=student_id, **student.model_dump())
    students_db[student_id] = updated
    return updated


@app.patch("/students/{student_id}", response_model=Student, tags=["students"],
           summary="Partially update a student")
def update_student(student_id: int, student: StudentUpdate):
    existing = _get_student_or_404(student_id)
    updated = existing.model_copy(update=student.model_dump(exclude_unset=True, exclude_none=True))
    students_db[student_id] = updated
    return updated


@app.delete("/students/{student_id}", status_code=status.HTTP_204_NO_CONTENT,
            tags=["students"], summary="Delete a student")
def delete_student(student_id: int):
    _get_student_or_404(student_id)
    del students_db[student_id]
