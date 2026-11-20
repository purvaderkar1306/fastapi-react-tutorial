"""Database operations for students. Routers call these; they never write SQL themselves."""

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.student import Student
from app.schemas.student import StudentCreate, StudentUpdate


def list_students(db: Session, skip: int = 0, limit: int = 100) -> list[Student]:
    stmt = select(Student).order_by(Student.id).offset(skip).limit(limit)
    return list(db.scalars(stmt))


def count_students(db: Session) -> int:
    return db.scalar(select(func.count()).select_from(Student)) or 0


def get_student(db: Session, student_id: int) -> Student | None:
    return db.get(Student, student_id)


def get_student_by_email(db: Session, email: str) -> Student | None:
    return db.scalar(select(Student).where(Student.email == email))


def create_student(db: Session, data: StudentCreate) -> Student:
    student = Student(**data.model_dump())
    db.add(student)
    db.commit()
    db.refresh(student)  # reload to get the id and timestamps MySQL filled in
    return student


def replace_student(db: Session, student: Student, data: StudentCreate) -> Student:
    for field, value in data.model_dump().items():
        setattr(student, field, value)
    db.commit()
    db.refresh(student)
    return student


def update_student(db: Session, student: Student, data: StudentUpdate) -> Student:
    changes = data.model_dump(exclude_unset=True, exclude_none=True)
    for field, value in changes.items():
        setattr(student, field, value)
    db.commit()
    db.refresh(student)
    return student


def delete_student(db: Session, student: Student) -> None:
    db.delete(student)
    db.commit()
