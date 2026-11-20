"""Student schemas (Pydantic models) used by the API in main.py."""

from pydantic import BaseModel, EmailStr, Field


class StudentBase(BaseModel):
    """Fields that every student has, with their validation rules."""
    name: str = Field(..., min_length=1, description="Full name", examples=["Asha Patil"])
    age: int = Field(..., ge=1, le=120, description="Age in years", examples=[20])
    email: EmailStr = Field(..., description="Email address", examples=["asha@example.com"])
    course: str = Field(..., description="Enrolled course", examples=["Computer Science"])


class StudentCreate(StudentBase):
    """Body for creating (POST) or replacing (PUT) a student. No id: the server assigns it."""
    pass


class StudentUpdate(BaseModel):
    """Body for PATCH. All fields optional: only the fields sent are updated."""
    name: str | None = Field(None, min_length=1)
    age: int | None = Field(None, ge=1, le=120)
    email: EmailStr | None = None
    course: str | None = None


class Student(StudentBase):
    """A stored student, as returned by the API."""
    id: int
