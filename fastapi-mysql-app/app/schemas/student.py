"""Pydantic schemas: what the API accepts and returns (separate from the database model)."""

from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class StudentBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100, description="Full name", examples=["Asha Patil"])
    age: int = Field(..., ge=1, le=120, description="Age in years", examples=[20])
    email: EmailStr = Field(..., max_length=255, description="Email address", examples=["asha@example.com"])
    course: str = Field(..., min_length=1, max_length=100, description="Enrolled course",
                        examples=["Computer Science"])


class StudentCreate(StudentBase):
    """Body for POST (create) and PUT (replace). The id is assigned by MySQL."""


class StudentUpdate(BaseModel):
    """Body for PATCH. Every field is optional: only the fields sent are changed."""
    name: str | None = Field(None, min_length=1, max_length=100)
    age: int | None = Field(None, ge=1, le=120)
    email: EmailStr | None = Field(None, max_length=255)
    course: str | None = Field(None, min_length=1, max_length=100)


class StudentRead(StudentBase):
    """A student as returned by the API."""
    model_config = ConfigDict(from_attributes=True)  # allow building it from an ORM object

    id: int
    created_at: datetime
    updated_at: datetime
