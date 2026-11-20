"""HTTP endpoints for students: /students ..."""

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.crud import student as crud
from app.db.database import get_db
from app.models.student import Student
from app.schemas.student import StudentCreate, StudentRead, StudentUpdate

router = APIRouter(prefix="/students", tags=["students"])

DbSession = Annotated[Session, Depends(get_db)]


def _get_or_404(db: Session, student_id: int) -> Student:
    student = crud.get_student(db, student_id)
    if student is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Student {student_id} not found")
    return student


def _ensure_email_free(db: Session, email: str | None, current_id: int | None = None) -> None:
    """Emails are UNIQUE in the table: answer 409 instead of letting MySQL raise an error."""
    if email is None:
        return
    other = crud.get_student_by_email(db, email)
    if other is not None and other.id != current_id:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,
                            detail=f"Email {email} is already used by student {other.id}")


@router.get("", response_model=list[StudentRead], summary="List students")
def list_students(
    db: DbSession,
    skip: Annotated[int, Query(ge=0)] = 0,
    limit: Annotated[int, Query(ge=1, le=1000)] = 100,
):
    return crud.list_students(db, skip=skip, limit=limit)


@router.get("/{student_id}", response_model=StudentRead, summary="Get a student by ID")
def get_student(student_id: int, db: DbSession):
    return _get_or_404(db, student_id)


@router.post("", response_model=StudentRead, status_code=status.HTTP_201_CREATED, summary="Create a student")
def create_student(data: StudentCreate, db: DbSession):
    _ensure_email_free(db, data.email)
    return crud.create_student(db, data)


@router.put("/{student_id}", response_model=StudentRead, summary="Replace a student")
def replace_student(student_id: int, data: StudentCreate, db: DbSession):
    student = _get_or_404(db, student_id)
    _ensure_email_free(db, data.email, current_id=student_id)
    return crud.replace_student(db, student, data)


@router.patch("/{student_id}", response_model=StudentRead, summary="Partially update a student")
def update_student(student_id: int, data: StudentUpdate, db: DbSession):
    student = _get_or_404(db, student_id)
    _ensure_email_free(db, data.email, current_id=student_id)
    return crud.update_student(db, student, data)


@router.delete("/{student_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Delete a student")
def delete_student(student_id: int, db: DbSession):
    crud.delete_student(db, _get_or_404(db, student_id))
