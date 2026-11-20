# Student API with MySQL

This is the MySQL version of [`fastapi-app`](../fastapi-app/). A React frontend for it is in [`student-react-app`](../student-react-app/). It has the **same student API and the same frontend**, but the students are saved in a **MySQL database** instead of a Python dictionary, so **your data is kept when the server restarts**.

| | `fastapi-app` | `fastapi-mysql-app` (this project) |
|---|---|---|
| Where students are stored | a Python `dict` in memory | MySQL table `students` in database `studentfastapi` |
| After restarting the server | changes are lost | changes are kept |
| Code layout | everything in `main.py` | split into folders by job |
| Duplicate emails | allowed | refused with **409 Conflict** |
| Extra fields returned | none | `created_at`, `updated_at` |

---

## 1. Folder structure

```
fastapi-mysql-app/
├── app/                        ← the Python code (a "package")
│   ├── __init__.py             marks the folder as a package
│   ├── main.py                 creates the FastAPI app, plugs everything together
│   ├── core/
│   │   └── config.py           reads settings (DB password etc.) from .env
│   ├── db/
│   │   ├── database.py         connection to MySQL: engine, sessions, get_db()
│   │   └── seed.py             creates the table + loads starting data
│   ├── models/
│   │   └── student.py          the `students` TABLE (SQLAlchemy ORM model)
│   ├── schemas/
│   │   └── student.py          what the API ACCEPTS and RETURNS (Pydantic)
│   ├── crud/
│   │   └── student.py          functions that read/write the database
│   └── routers/
│       └── students.py         the HTTP endpoints: GET/POST/PUT/PATCH/DELETE /students
├── data/
│   └── students.json           starting students, loaded when the table is empty
├── frontend/                   the same HTML/CSS/jQuery page as fastapi-app, served at /ui/
├── sql/
│   └── schema.sql              the table written as plain SQL (for reference)
├── .env                        YOUR settings, including the DB password (private!)
├── .env.example                a template of .env without the real password
├── .gitignore                  files git must never save (.env, venv, ...)
├── requirements.txt            the Python packages this project needs
└── venv/                       this project's own virtual environment
```

### Why so many folders?

Each folder has **one job**. This is called **layered architecture**:

```
HTTP request
    ▼
routers/   "Which URL and method? Check the input, choose the status code."
    ▼
crud/      "Read or write the database."
    ▼
models/    "What does the table look like?"
    ▼
MySQL
```

`schemas/` sits beside them and describes the JSON going in and out. `core/` and `db/` are the setup that everything else uses.

**Why bother?** When something breaks, you know where to look. If you later switch from MySQL to PostgreSQL, only `config.py` changes. If you add a "teachers" API, you add one file in each folder and nothing existing changes.

---

## 2. How to run it

You only need to do steps 1–2 once.

**1. Create the database** (already done for you):

```sql
CREATE DATABASE IF NOT EXISTS studentfastapi CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

You **don't** need to create the table yourself. The app creates it on startup.

**2. Install the packages** (already done; the `venv` folder exists):

```
cd d:\PythonTutorials\fastapitutorials\fastapi-mysql-app
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

**3. Start the server** (every time):

```
cd d:\PythonTutorials\fastapitutorials\fastapi-mysql-app
venv\Scripts\activate
uvicorn app.main:app --reload
```

Note it's **`app.main:app`** (the `main.py` file **inside the `app` folder**), not `main:app` as in the old project.

**4. Open:**

| Address | What it is |
|---|---|
| http://127.0.0.1:8000/ui/ | the frontend |
| http://127.0.0.1:8000/docs | Swagger, to try every endpoint |
| http://127.0.0.1:8000/health/db | checks the connection to MySQL |

⚠️ Both projects use port **8000**. Stop the other one first (Ctrl+C in its terminal), or run this one on another port: `uvicorn app.main:app --reload --port 8001`. (The frontend works on any port when opened through `/ui/`.)

---

## 3. Settings: the `.env` file

```
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=...
DB_NAME=studentfastapi
DB_ECHO=false
SEED_ON_STARTUP=true
```

- **Why not write the password in the Python code?** Code gets shared (GitHub, colleagues, screenshots). `.env` stays on your computer: it's listed in `.gitignore`, so git never uploads it. `.env.example` is the safe copy to share; it shows *which* settings exist, without real values.
- **`DB_ECHO=true`**: prints every SQL statement SQLAlchemy sends to MySQL in the terminal. Turn it on to *see* the `SELECT`, `INSERT`, `UPDATE` and `DELETE` statements your clicks cause. It's very useful for learning.
- **`SEED_ON_STARTUP`**: when `true`, the 5 students in `data/students.json` are added **only if the table is empty**. Your own data is never overwritten.

[`app/core/config.py`](app/core/config.py) reads these with **pydantic-settings**. Each setting has a type (`db_port: int`), so a typo like `DB_PORT=abc` gives a clear error at startup. It also builds the connection URL:

```
mysql+pymysql://root:<password>@127.0.0.1:3306/studentfastapi?charset=utf8mb4
└─┬─┘ └──┬──┘   └┬─┘ └───┬────┘ └───┬───┘ └┬─┘ └─────┬──────┘ └──────┬──────┘
database driver  user  password    host    port   database name   full Unicode
```

---

## 4. Each file explained

### `app/db/database.py`: the connection

```python
engine = create_engine(settings.database_url, echo=..., pool_pre_ping=True, pool_recycle=3600)
```

- The **engine** keeps a **pool** of open connections to MySQL and reuses them, because opening a new connection for every request would be slow.
- `pool_pre_ping=True`: before using a connection, quickly check it's still alive. MySQL closes connections that sit unused for a long time; without this you'd see "MySQL server has gone away" errors.
- `pool_recycle=3600`: replace connections older than one hour.

```python
SessionLocal = sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)
```

- A **session** is one "conversation" with the database: you add, change and delete objects, then `commit()` saves them all at once.

```python
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

- A **dependency**. Every endpoint that needs the database asks for it with `db: DbSession`. FastAPI calls `get_db()`, hands the session to the endpoint, and after the response, the `finally` block **always** closes it, even if the endpoint raised an error. This way connections are never leaked.

### `app/models/student.py`: the table (ORM model)

```python
class Student(Base):
    __tablename__ = "students"
    id:     Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name:   Mapped[str] = mapped_column(String(100), nullable=False)
    email:  Mapped[str] = mapped_column(String(255), nullable=False, unique=True, index=True)
    ...
```

**ORM** (Object-Relational Mapper) means **one Python class = one table**, and **one object = one row**. SQLAlchemy turns Python into SQL for you:

| Python | SQL that SQLAlchemy sends |
|---|---|
| `db.add(Student(name="Asha", ...)); db.commit()` | `INSERT INTO students (name, ...) VALUES ('Asha', ...)` |
| `db.get(Student, 3)` | `SELECT ... FROM students WHERE id = 3` |
| `student.age = 21; db.commit()` | `UPDATE students SET age = 21 WHERE id = 3` |
| `db.delete(student); db.commit()` | `DELETE FROM students WHERE id = 3` |

The column options:

- `primary_key=True, autoincrement=True`: MySQL gives each new row the next number (1, 2, 3...).
- `String(100)`: becomes `VARCHAR(100)`, text up to 100 characters.
- `nullable=False`: becomes `NOT NULL`; the value is required.
- `unique=True`: no two rows may have the same email.
- `index=True`: MySQL builds an index so searching by this column is fast.
- `server_default=func.now()`: MySQL fills in the current time itself.

### `app/schemas/student.py`: the API's input and output (Pydantic)

**Why both a model *and* a schema?** They describe different things:

- The **model** is *how data is stored* (table columns, indexes).
- The **schemas** are *what the API accepts and returns* (validation rules, which fields are allowed).

| Schema | Used for | Notes |
|---|---|---|
| `StudentCreate` | body of `POST` and `PUT` | no `id`: MySQL assigns it |
| `StudentUpdate` | body of `PATCH` | every field optional |
| `StudentRead` | every response | adds `id`, `created_at`, `updated_at` |

`model_config = ConfigDict(from_attributes=True)` on `StudentRead` lets FastAPI build the JSON response **straight from a SQLAlchemy object** (it reads `student.name`, `student.age`... as attributes).

### `app/crud/student.py`: database functions

**CRUD** = Create, Read, Update, Delete. Each function takes the session `db` and does one job:

```python
def create_student(db, data):
    student = Student(**data.model_dump())   # Pydantic object → dict → ORM object
    db.add(student)                          # stage the INSERT
    db.commit()                              # send it to MySQL and save it permanently
    db.refresh(student)                      # reload: now student.id and created_at are filled in
    return student
```

```python
def update_student(db, student, data):
    changes = data.model_dump(exclude_unset=True, exclude_none=True)   # only fields the client sent
    for field, value in changes.items():
        setattr(student, field, value)       # same as student.age = 21
    db.commit()
```

`select(Student).order_by(Student.id).offset(skip).limit(limit)` is SQLAlchemy 2.0's way of writing `SELECT * FROM students ORDER BY id LIMIT 100 OFFSET 0`.

### `app/routers/students.py`: the endpoints

```python
router = APIRouter(prefix="/students", tags=["students"])
DbSession = Annotated[Session, Depends(get_db)]
```

- An **APIRouter** is a mini-app holding related endpoints. `prefix="/students"` is added in front of every path in it, and `main.py` plugs it in with `app.include_router(students.router)`.
- `DbSession` is a short name for "a database session from `get_db`", so each endpoint just writes `db: DbSession`.

The endpoints are the same as in `fastapi-app`:

| Method & path | Success | Errors |
|---|---|---|
| `GET /students?skip=0&limit=100` | 200 + list | 422 if `limit` is outside 1–1000 |
| `GET /students/{id}` | 200 + student | 404 |
| `POST /students` | **201** + new student | 409 duplicate email, 422 invalid data |
| `PUT /students/{id}` | 200 + student | 404, 409, 422 |
| `PATCH /students/{id}` | 200 + student | 404, 409, 422 |
| `DELETE /students/{id}` | **204** (no body) | 404 |

**New: 409 Conflict.** `_ensure_email_free()` checks whether another student already has that email *before* saving. Without this check, MySQL would refuse the `INSERT` because of the `UNIQUE` rule and the user would see a confusing **500 Internal Server Error**. The check ignores the student's *own* email (`current_id`), so you can edit a student without changing their email.

### `app/db/seed.py`: creating the table and starting data

- `Base.metadata.create_all(bind=engine)` runs `CREATE TABLE IF NOT EXISTS` for every model. It **never changes or deletes** an existing table.
- `seed_students()` adds the JSON students only if `count_students()` is 0.
- `import app.models` makes sure every model class has been loaded, so `Base` knows which tables exist.

> **Changing a table later:** because `create_all` never alters existing tables, adding a column to the model will *not* add it to MySQL. While learning, you can drop the table (`DROP TABLE students;`) and restart the server to recreate it. Real projects use a migration tool called **Alembic** for this.

### `app/main.py`: putting it together

```python
@asynccontextmanager
async def lifespan(app):
    create_tables()            # runs ONCE when the server starts
    if settings.seed_on_startup:
        seed_students()
    yield                      # ← the server runs and handles requests here
    engine.dispose()           # runs ONCE when the server stops: close all connections
```

- **lifespan** is FastAPI's place for start-up and shut-down code.
- `app.include_router(...)` adds the student endpoints.
- `GET /health/db` runs `SELECT VERSION()` to prove the database connection works.
- `app.mount("/ui", StaticFiles(...))` serves the frontend, exactly as in `fastapi-app`.

---

## 5. Looking at the data in MySQL

Open **MySQL Workbench** (installed on this computer) or the `mysql` command line:

```
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p studentfastapi
```

Then try:

```sql
SHOW TABLES;
DESCRIBE students;
SELECT * FROM students;
SELECT course, COUNT(*) FROM students GROUP BY course;
```

Add a student in the web page, run `SELECT * FROM students;` again, and the new row is there. Restart the server: it's still there.

---

## 6. Common problems

| Error | Reason | Fix |
|---|---|---|
| `Access denied for user 'root'@'localhost'` | wrong password in `.env` | Fix `DB_PASSWORD` in `.env`, then restart. |
| `Unknown database 'studentfastapi'` | the database doesn't exist | Run the `CREATE DATABASE` command from section 2. |
| `Can't connect to MySQL server on '127.0.0.1'` | MySQL isn't running | Start the **MySQL80** service (Windows: Services app, or `net start MySQL80` as administrator). |
| `'cryptography' package is required` | a package is missing | `pip install -r requirements.txt` with the venv active. |
| `No module named 'app'` | uvicorn was started from the wrong folder | `cd` into `fastapi-mysql-app` first, then `uvicorn app.main:app --reload`. |
| `[Errno 10048] ... address already in use` | the other project is using port 8000 | Stop it, or add `--port 8001`. |
| You added a column to the model but MySQL doesn't have it | `create_all` doesn't change existing tables | Drop the table and restart (you lose its data), or learn Alembic. |
