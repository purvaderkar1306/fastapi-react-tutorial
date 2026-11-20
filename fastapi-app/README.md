# FastAPI Tutorial App

A beginner-friendly FastAPI project. It has:

- a small **items** API, to show the basics
- a **students** API where you can create, read, update and delete students
- automatic **Swagger** documentation, a web page where you can try every endpoint without writing any extra code

This README explains everything from the beginning. You don't need to know anything about web APIs already.

---

## Contents

1. [Words you need to know](#1-words-you-need-to-know)
2. [The project's files](#2-the-projects-files)
3. [Running the app](#3-running-the-app)
4. [Using Swagger to try endpoints](#4-using-swagger-to-try-endpoints)
5. [File 1: `model.py`, the student schema](#5-file-1-modelpy-the-student-schema)
6. [File 2: `students.json`, the starting data](#6-file-2-studentsjson-the-starting-data)
7. [File 3: `main.py`, the app](#7-file-3-mainpy-the-app)
8. [Every endpoint, one by one](#8-every-endpoint-one-by-one)
9. [Status codes cheat sheet](#9-status-codes-cheat-sheet)
10. [Practice exercises](#10-practice-exercises)

---

## 1. Words you need to know

**API (Application Programming Interface):** a way for one program to talk to another. Here, our Python app is a web API: other programs (or you, in a browser) send it requests over the internet, and it sends back answers.

**Server:** the program that waits for requests and answers them. When you run this app, your own computer becomes the server.

**Request and response:** the client (browser, app, Swagger) sends a **request** ("give me student 1"). The server sends back a **response** ("here is student 1").

**Endpoint:** one specific address that the API answers on, combined with a method. For example, `GET /students` is one endpoint and `POST /students` is a different one, even though the address is the same.

**HTTP method:** the kind of action you're asking for:

| Method | Meaning | Example in this app |
|---|---|---|
| `GET` | Read data (doesn't change anything) | Get the list of students |
| `POST` | Create something new | Add a new student |
| `PUT` | Replace something completely | Replace all of a student's details |
| `PATCH` | Change part of something | Change only a student's age |
| `DELETE` | Remove something | Delete a student |

**CRUD:** short for **C**reate, **R**ead, **U**pdate, **D**elete, the four basic things you can do with data. Most APIs are built around CRUD.

**JSON:** the text format used to send data. It looks very like a Python dictionary:

```json
{ "name": "Asha Patil", "age": 20 }
```

- `{ ... }` is an **object** (like a Python `dict`).
- `[ ... ]` is an **array** (like a Python `list`).
- Text goes in double quotes `"..."`. Numbers don't.

**Path parameter:** a value written inside the address itself. In `/students/3`, the `3` is a path parameter: it tells the API *which* student.

**Query parameter:** an optional extra value added after a `?`. In `/students?limit=2`, `limit=2` is a query parameter. Several are joined with `&`: `/students?skip=1&limit=2`.

**Request body:** data sent along with the request, as JSON. Used by `POST`, `PUT` and `PATCH` to send the student's details.

**Status code:** a number in every response that says how it went. `200` means OK, `404` means "not found", and so on. See the [cheat sheet](#9-status-codes-cheat-sheet).

**Schema / model:** a description of what data must look like: which fields, what type each is, and any rules (such as "age must be between 1 and 120").

**Validation:** checking that data follows the schema. If it doesn't, FastAPI refuses the request automatically and explains what's wrong.

---

## 2. The project's files

```
fastapi-app/
├── main.py          ← the app: creates it and defines every endpoint
├── model.py         ← the student schema: what a student looks like
├── students.json    ← the five students that exist when the server starts
├── README.md        ← this file
└── venv/            ← the virtual environment (installed packages live here)
```

How they work together:

1. When the server starts, `main.py` reads `students.json`.
2. It checks every student in that file against the schema in `model.py`.
3. It keeps the students in memory and answers requests about them.

---

## 3. Running the app

Open a terminal in the `fastapi-app` folder and run:

```bash
# 1. Turn on the virtual environment (Windows)
venv\Scripts\activate

# 2. Install the packages the app needs (only the first time)
pip install "fastapi[standard]" email-validator

# 3. Start the server
uvicorn main:app --reload
```

What each part means:

- **`venv\Scripts\activate`** switches to the project's own Python, so packages install into this project only. Your prompt will start with `(venv)`.
- **`fastapi[standard]`** is FastAPI plus `uvicorn`, the program that runs the server.
- **`email-validator`** is needed to check that email addresses are valid.
- **`uvicorn main:app`** means "run the object called `app` inside `main.py`".
- **`--reload`** restarts the server automatically every time you save a file. Very handy while learning.

When it's running, you'll see a line like:

```
Uvicorn running on http://127.0.0.1:8000
```

`127.0.0.1` means "this computer", and `8000` is the port number. Leave this terminal open; closing it stops the server. To stop it yourself, press **Ctrl + C**.

---

## 4. Using Swagger to try endpoints

FastAPI creates a documentation page for you automatically. With the server running, open:

**http://127.0.0.1:8000/docs**

You'll see every endpoint listed in coloured boxes, grouped into **general**, **items** and **students**. To try one:

1. Click the endpoint to open it.
2. Click **Try it out**.
3. Fill in any boxes (path parameters, query parameters, or the JSON body).
4. Click **Execute**.
5. Scroll down to **Responses** to see the status code and the data the server sent back.

Other addresses:

| Address | What it shows |
|---|---|
| http://127.0.0.1:8000/docs | **Swagger UI**: try endpoints interactively |
| http://127.0.0.1:8000/redoc | **ReDoc**: the same documentation in a read-only layout |
| http://127.0.0.1:8000/openapi.json | The raw description both pages are built from |

Tip: `GET` endpoints can also be opened straight in the browser's address bar, for example http://127.0.0.1:8000/students.

---

## 5. File 1: `model.py`, the student schema

This file describes what a student looks like. It uses **Pydantic**, a library that FastAPI uses for checking data.

```python
from pydantic import BaseModel, EmailStr, Field
```

- **`BaseModel`**: every schema is a class that inherits from this.
- **`Field`**: lets you add rules, a description and example values to a field.
- **`EmailStr`**: a type that only accepts valid email addresses.

### `StudentBase`: the fields every student has

```python
class StudentBase(BaseModel):
    name: str = Field(..., min_length=1, description="Full name", examples=["Asha Patil"])
    age: int = Field(..., ge=1, le=120, description="Age in years", examples=[20])
    email: EmailStr = Field(..., description="Email address", examples=["asha@example.com"])
    course: str = Field(..., description="Enrolled course", examples=["Computer Science"])
```

Read each line as "field name : type = rules":

| Field | Type | Rules |
|---|---|---|
| `name` | text (`str`) | Required. `min_length=1` means it can't be empty. |
| `age` | whole number (`int`) | Required. `ge=1` ("greater than or equal to 1") and `le=120` ("less than or equal to 120"). |
| `email` | email (`EmailStr`) | Required. Must be a real-looking email address. |
| `course` | text (`str`) | Required. |

- The `...` (three dots) as the first value of `Field` means **required**: there's no default, so it must be sent.
- `description` and `examples` don't change any behaviour. They're shown on the Swagger page to help people using the API.

### `StudentCreate`: data for creating a student

```python
class StudentCreate(StudentBase):
    pass
```

- `StudentCreate(StudentBase)` means "`StudentCreate` gets everything from `StudentBase`". This is called **inheritance**.
- `pass` means "add nothing extra".
- Why have it at all? It has **no `id`**. When you create a student, you don't choose the ID; the server does. Having a separate name makes that clear.

### `StudentUpdate`: data for changing part of a student

```python
class StudentUpdate(BaseModel):
    name: str | None = Field(None, min_length=1)
    age: int | None = Field(None, ge=1, le=120)
    email: EmailStr | None = None
    course: str | None = None
```

- `str | None` means "text, or nothing".
- `= None` (or `Field(None, ...)`) makes the field **optional**.
- So every field is optional here. You only send the fields you want to change. The rules still apply to anything you do send.

### `Student`: a stored student, as the API returns it

```python
class Student(StudentBase):
    id: int
```

The same as `StudentBase`, plus an `id`. Every response about a student uses this shape.

### Summary

| Schema | Used for | Has `id`? | Fields required? |
|---|---|---|---|
| `StudentCreate` | `POST` and `PUT` request bodies | No | All required |
| `StudentUpdate` | `PATCH` request body | No | All optional |
| `Student` | Every response | Yes | All present |

---

## 6. File 2: `students.json`, the starting data

This file holds the students that exist as soon as the server starts. It's written in **raw JSON**:

```json
[
  {
    "name": "Asha Patil",
    "age": 20,
    "email": "asha.patil@example.com",
    "course": "Computer Science"
  },
  {
    "name": "Rahul Sharma",
    "age": 22,
    "email": "rahul.sharma@example.com",
    "course": "Mechanical Engineering"
  },
  ...
]
```

- The outer `[ ... ]` is a list.
- Each `{ ... }` inside it is one student.
- Each student has exactly the fields from `StudentCreate`. There's **no `id`**: the app numbers them 1, 2, 3, ... in the order they appear.

The five students, and the IDs they get:

| ID | Name | Age | Course |
|---|---|---|---|
| 1 | Asha Patil | 20 | Computer Science |
| 2 | Rahul Sharma | 22 | Mechanical Engineering |
| 3 | Priya Deshmukh | 19 | Mathematics |
| 4 | Arjun Mehta | 21 | Physics |
| 5 | Sneha Kulkarni | 23 | Electronics |

**To change the starting students:** edit this file, save it, and restart the server.

JSON is strict. Common mistakes:

- Use double quotes `"`, never single quotes `'`.
- Put a comma between items, but **not** after the last one.
- Numbers like `20` have no quotes; text like `"Physics"` does.

---

## 7. File 3: `main.py`, the app

### 7.1 Imports

```python
import json
from pathlib import Path

from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel, Field

from model import Student, StudentCreate, StudentUpdate
```

| Import | What it's for |
|---|---|
| `json` | Python's built-in tool for reading JSON files |
| `Path` | Builds file paths that work on any computer |
| `FastAPI` | Creates the web app |
| `HTTPException` | Sends an error response, such as 404 Not Found |
| `status` | Named status codes, so you can write `status.HTTP_201_CREATED` instead of the bare number `201` |
| `BaseModel`, `Field` | Used for the small `Item` schema in this file |
| `from model import ...` | Brings in the student schemas from `model.py` |

### 7.2 Creating the app

```python
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
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)
```

- **`app = FastAPI(...)`** creates the application. This is the `app` in `uvicorn main:app`.
- **`title`, `description`, `version`** appear at the top of the Swagger page.
- **`tags_metadata`** lists the groups shown on the Swagger page. Each endpoint picks its group with `tags=["students"]` and so on.
- **`docs_url`, `redoc_url`, `openapi_url`** are the addresses of the documentation pages.

### 7.3 Loading the starting students

```python
STUDENTS_FILE = Path(__file__).parent / "students.json"

with open(STUDENTS_FILE, encoding="utf-8") as f:
    raw_students = json.load(f)

students_db: dict[int, Student] = {}
next_student_id = 1

for raw in raw_students:
    s = StudentCreate.model_validate(raw)
    students_db[next_student_id] = Student(id=next_student_id, **s.model_dump())
    next_student_id += 1
```

Line by line:

1. **`Path(__file__).parent / "students.json"`**: `__file__` is the path of `main.py`. `.parent` is the folder it's in. `/ "students.json"` adds the file name. So the JSON file is found even if you start the server from another folder.
2. **`with open(...) as f:`** opens the file and closes it again automatically afterwards.
3. **`json.load(f)`** reads the JSON and turns it into Python: a list of dictionaries.
4. **`students_db`** is where students are stored: a dictionary with the ID as the key, like `{1: <Asha>, 2: <Rahul>, ...}`. It's our pretend database.
5. **`next_student_id`** is a counter for handing out IDs.
6. The **`for` loop** handles each student from the file:
   - **`StudentCreate.model_validate(raw)`** checks the dictionary against the schema. If something is wrong (say, an age of 200), the server stops with an error explaining which student and which field.
   - **`s.model_dump()`** turns the checked student back into a dictionary.
   - **`**`** "unpacks" a dictionary into named arguments. So `Student(id=1, **{"name": "Asha", "age": 20, ...})` is the same as `Student(id=1, name="Asha", age=20, ...)`.
   - The student is saved under its ID, then the counter goes up by one.

After the loop, `students_db` holds 5 students and `next_student_id` is **6**.

> ⚠️ **Data is kept in memory only.** Anything you add, change or delete through the API is lost when the server stops or reloads (including when `--reload` restarts it after you save a file). It then starts again from the five students in `students.json`. Real apps save data in a database.

### 7.4 The "not found" helper

```python
def _get_student_or_404(student_id: int) -> Student:
    student = students_db.get(student_id)
    if student is None:
        raise HTTPException(status_code=404, detail=f"Student {student_id} not found")
    return student
```

- `students_db.get(student_id)` looks up the ID. If it isn't there, it returns `None` instead of crashing.
- If there's no student, `raise HTTPException(...)` stops the endpoint and sends a **404** response with a message.
- Otherwise it returns the student.

Four endpoints need to "find the student or say not found", so this code is written once and reused. The leading `_` in the name is a Python convention meaning "used inside this file only".

### 7.5 How an endpoint is written

Every endpoint follows the same pattern:

```python
@app.get("/students/{student_id}", response_model=Student, tags=["students"], summary="Get a student by ID")
def get_student(student_id: int):
    return _get_student_or_404(student_id)
```

- **`@app.get(...)`** is a **decorator**. It tells FastAPI: "when a `GET` request arrives at this address, run the function below." There's also `@app.post`, `@app.put`, `@app.patch` and `@app.delete`.
- **`"/students/{student_id}"`** is the address. Curly brackets mark a path parameter.
- **`response_model=Student`** says what shape the response has. FastAPI uses it for the docs and to tidy the output.
- **`status_code=...`** (on some endpoints) sets the success code, such as 201 or 204. If it's not given, the default is 200.
- **`tags`** and **`summary`** only affect the Swagger page.
- **The function's parameters** tell FastAPI where to find the input:
  - A name that matches `{...}` in the address → **path parameter**.
  - A simple type (`int`, `str`) that isn't in the address → **query parameter**.
  - A Pydantic model (such as `StudentCreate`) → **JSON request body**.
- **Whatever the function returns** is sent back as JSON.

---

## 8. Every endpoint, one by one

Quick overview:

| # | Method | Address | What it does |
|---|---|---|---|
| 1 | `GET` | `/` | Says hello |
| 2 | `GET` | `/items/{item_id}` | Echoes back an item ID |
| 3 | `POST` | `/items` | Echoes back an item you send |
| 4 | `GET` | `/students` | Lists students |
| 5 | `GET` | `/students/{student_id}` | Gets one student |
| 6 | `POST` | `/students` | Creates a student |
| 7 | `PUT` | `/students/{student_id}` | Replaces a student completely |
| 8 | `PATCH` | `/students/{student_id}` | Changes some of a student's fields |
| 9 | `DELETE` | `/students/{student_id}` | Deletes a student |

The examples below assume you've just started the server, so the five starting students are there. If you've already made changes, your results will differ.

---

### Endpoint 1: `GET /` (say hello)

**What it does:** returns a fixed welcome message. Useful for checking the server is running.

**Code:**

```python
@app.get("/", tags=["general"], summary="Root endpoint")
def root():
    return {"message": "Hello from FastAPI"}
```

**Try it:** open http://127.0.0.1:8000/ in your browser.

**Response (200 OK):**

```json
{ "message": "Hello from FastAPI" }
```

---

### Endpoint 2: `GET /items/{item_id}` (get an item)

**What it does:** returns the ID you put in the address and an optional `q` value. It doesn't store anything; it's here to show how path and query parameters work.

**Code:**

```python
@app.get("/items/{item_id}", tags=["items"], summary="Get an item by ID")
def get_item(item_id: int, q: str | None = None):
    return {"item_id": item_id, "q": q}
```

**Input:**

| Name | Where | Required? | Type |
|---|---|---|---|
| `item_id` | path | Yes | whole number |
| `q` | query | No | text |

**Try it:** open http://127.0.0.1:8000/items/5?q=hello

**Response (200 OK):**

```json
{ "item_id": 5, "q": "hello" }
```

Without `?q=...`, `q` is `null` (JSON's word for "nothing", like Python's `None`).

**Error:** http://127.0.0.1:8000/items/abc returns **422**, because `abc` isn't a whole number. FastAPI does this check for you because of `item_id: int`.

---

### Endpoint 3: `POST /items` (create an item)

**What it does:** accepts an item as JSON, checks it, and sends it back. Like endpoint 2, it doesn't store anything.

**Code:**

```python
class Item(BaseModel):
    name: str = Field(..., description="Name of the item", examples=["Laptop"])
    price: float = Field(..., gt=0, description="Price of the item", examples=[999.99])

@app.post("/items", tags=["items"], summary="Create an item", status_code=201)
def create_item(item: Item):
    return {"created": item}
```

- `float` means a number that can have decimals.
- `gt=0` means "greater than 0".

**Request body:**

```json
{ "name": "Laptop", "price": 999.99 }
```

**Response (201 Created):**

```json
{ "created": { "name": "Laptop", "price": 999.99 } }
```

**Error:** a price of `0` or below, or a missing `name`, returns **422**.

**Try it in Swagger:** open **POST /items** → **Try it out** → edit the body → **Execute**.

---

### Endpoint 4: `GET /students` (list students)

**What it does:** returns students as a list. You can ask for just part of the list.

**Code:**

```python
@app.get("/students", response_model=list[Student], tags=["students"], summary="List students")
def list_students(skip: int = 0, limit: int = 100):
    return list(students_db.values())[skip: skip + limit]
```

- `students_db.values()` gets all the students out of the dictionary, and `list(...)` makes them a list.
- `[skip: skip + limit]` is **slicing**: "start after the first `skip` students, and give at most `limit` of them".

**Input:**

| Name | Where | Required? | Default | Meaning |
|---|---|---|---|---|
| `skip` | query | No | `0` | How many students to skip from the start |
| `limit` | query | No | `100` | The most students to return |

Using `skip` and `limit` together like this is called **pagination**: getting results one page at a time.

**Try it:** open http://127.0.0.1:8000/students

**Response (200 OK):**

```json
[
  { "name": "Asha Patil", "age": 20, "email": "asha.patil@example.com", "course": "Computer Science", "id": 1 },
  { "name": "Rahul Sharma", "age": 22, "email": "rahul.sharma@example.com", "course": "Mechanical Engineering", "id": 2 },
  { "name": "Priya Deshmukh", "age": 19, "email": "priya.deshmukh@example.com", "course": "Mathematics", "id": 3 },
  { "name": "Arjun Mehta", "age": 21, "email": "arjun.mehta@example.com", "course": "Physics", "id": 4 },
  { "name": "Sneha Kulkarni", "age": 23, "email": "sneha.kulkarni@example.com", "course": "Electronics", "id": 5 }
]
```

**With pagination:** http://127.0.0.1:8000/students?skip=1&limit=2 skips Asha and returns the next two:

```json
[
  { "name": "Rahul Sharma", "age": 22, "email": "rahul.sharma@example.com", "course": "Mechanical Engineering", "id": 2 },
  { "name": "Priya Deshmukh", "age": 19, "email": "priya.deshmukh@example.com", "course": "Mathematics", "id": 3 }
]
```

---

### Endpoint 5: `GET /students/{student_id}` (get one student)

**What it does:** returns the student with the given ID.

**Code:**

```python
@app.get("/students/{student_id}", response_model=Student, tags=["students"], summary="Get a student by ID")
def get_student(student_id: int):
    return _get_student_or_404(student_id)
```

All the work is done by the helper from [section 7.4](#74-the-not-found-helper).

**Input:**

| Name | Where | Required? | Type |
|---|---|---|---|
| `student_id` | path | Yes | whole number |

**Try it:** open http://127.0.0.1:8000/students/1

**Response (200 OK):**

```json
{ "name": "Asha Patil", "age": 20, "email": "asha.patil@example.com", "course": "Computer Science", "id": 1 }
```

**Error:** http://127.0.0.1:8000/students/99 returns **404 Not Found**:

```json
{ "detail": "Student 99 not found" }
```

---

### Endpoint 6: `POST /students` (create a student)

**What it does:** adds a new student. The server gives it the next free ID.

**Code:**

```python
@app.post("/students", response_model=Student, status_code=status.HTTP_201_CREATED,
          tags=["students"], summary="Create a student")
def create_student(student: StudentCreate):
    global next_student_id
    new_student = Student(id=next_student_id, **student.model_dump())
    students_db[next_student_id] = new_student
    next_student_id += 1
    return new_student
```

Step by step:

1. `student: StudentCreate` tells FastAPI to read the JSON body and check it against `StudentCreate`. Bad data never reaches your code; FastAPI answers with 422 by itself.
2. `global next_student_id` is needed because the function **changes** a variable that was created outside it. Without `global`, Python would think it's a new local variable.
3. A `Student` is built with the next ID plus the data that was sent.
4. It's saved in `students_db`, and the counter goes up.
5. The new student, with its ID, is sent back.

**Request body** (all four fields required):

```json
{
  "name": "Vikram Joshi",
  "age": 24,
  "email": "vikram.joshi@example.com",
  "course": "Chemistry"
}
```

**Response (201 Created):**

```json
{ "name": "Vikram Joshi", "age": 24, "email": "vikram.joshi@example.com", "course": "Chemistry", "id": 6 }
```

The ID is 6 because the starting students use 1 to 5.

**Errors (422):**

- a missing field, for example no `"course"`
- `"age": 0` or `"age": 150`
- `"email": "vikram"` (not a valid email)
- `"name": ""` (empty name)

A 422 response tells you exactly what's wrong. For example, a bad email gives (shortened):

```json
{
  "detail": [
    {
      "loc": ["body", "email"],
      "msg": "value is not a valid email address: An email address must have an @-sign."
    }
  ]
}
```

`"loc": ["body", "email"]` means "the problem is in the request body, in the `email` field".

**Try it in Swagger:** open **POST /students** → **Try it out** → edit the body → **Execute**. Then run **GET /students** again to see your new student in the list.

---

### Endpoint 7: `PUT /students/{student_id}` (replace a student)

**What it does:** replaces **all** of a student's details. The ID stays the same.

**Code:**

```python
@app.put("/students/{student_id}", response_model=Student, tags=["students"], summary="Replace a student")
def replace_student(student_id: int, student: StudentCreate):
    _get_student_or_404(student_id)
    updated = Student(id=student_id, **student.model_dump())
    students_db[student_id] = updated
    return updated
```

1. Check the student exists (or send 404).
2. Build a new `Student` with the **same ID** and the new data.
3. Save it over the old one, and send it back.

**Input:** `student_id` in the path, and a body with **all four fields** (the same as creating).

**Example:** `PUT /students/2` with:

```json
{
  "name": "Rahul Sharma",
  "age": 23,
  "email": "rahul.s@example.com",
  "course": "Civil Engineering"
}
```

**Response (200 OK):**

```json
{ "name": "Rahul Sharma", "age": 23, "email": "rahul.s@example.com", "course": "Civil Engineering", "id": 2 }
```

**Errors:** **404** if the student doesn't exist. **422** if any field is missing or invalid. With PUT you must send every field, even ones you don't want to change.

---

### Endpoint 8: `PATCH /students/{student_id}` (change some fields)

**What it does:** changes **only the fields you send**. Everything else stays as it was.

**Code:**

```python
@app.patch("/students/{student_id}", response_model=Student, tags=["students"], summary="Partially update a student")
def update_student(student_id: int, student: StudentUpdate):
    existing = _get_student_or_404(student_id)
    updated = existing.model_copy(update=student.model_dump(exclude_unset=True, exclude_none=True))
    students_db[student_id] = updated
    return updated
```

1. Find the existing student (or send 404).
2. `student.model_dump(exclude_unset=True, exclude_none=True)` makes a dictionary of **only the fields that were actually sent**:
   - `exclude_unset=True` leaves out fields you didn't send at all.
   - `exclude_none=True` leaves out fields sent as `null`, so you can't accidentally erase a value.
3. `existing.model_copy(update=...)` copies the existing student and swaps in just those fields.
4. Save it and send it back.

**Input:** `student_id` in the path, and a body with **any of** the four fields (uses `StudentUpdate`, where all fields are optional).

**Example:** `PATCH /students/3` with:

```json
{ "course": "Statistics" }
```

**Response (200 OK):** only the course changed:

```json
{ "name": "Priya Deshmukh", "age": 19, "email": "priya.deshmukh@example.com", "course": "Statistics", "id": 3 }
```

**Errors:** **404** if the student doesn't exist. **422** if a field you sent breaks a rule, for example `{"age": 500}`.

**PUT or PATCH?**

| | `PUT` | `PATCH` |
|---|---|---|
| Fields you must send | All of them | Only the ones you're changing |
| Fields you don't send | Not allowed (422 error) | Stay the same |
| Schema used | `StudentCreate` | `StudentUpdate` |

---

### Endpoint 9: `DELETE /students/{student_id}` (delete a student)

**What it does:** removes a student.

**Code:**

```python
@app.delete("/students/{student_id}", status_code=status.HTTP_204_NO_CONTENT,
            tags=["students"], summary="Delete a student")
def delete_student(student_id: int):
    _get_student_or_404(student_id)
    del students_db[student_id]
```

1. Check the student exists (or send 404).
2. `del students_db[student_id]` removes it from the dictionary.

**Example:** `DELETE /students/5`

**Response:** **204 No Content**, with an empty body. 204 means "it worked, and there's nothing to send back".

Afterwards, `GET /students/5` returns 404, and `GET /students` lists only four students.

**Error:** **404** if the student doesn't exist (for example, if you delete the same ID twice).

**Note:** IDs aren't reused. After deleting student 5, the next student you create still gets the next number from the counter, not 5.

---

## 9. Status codes cheat sheet

| Code | Name | Meaning | When this app sends it |
|---|---|---|---|
| **200** | OK | It worked; here's the data | `GET`, `PUT`, `PATCH` succeeded |
| **201** | Created | It worked; something new was made | `POST /students`, `POST /items` |
| **204** | No Content | It worked; nothing to send back | `DELETE /students/{id}` |
| **404** | Not Found | That thing doesn't exist | A student ID that isn't there |
| **422** | Unprocessable Entity | Your data broke the rules | Missing field, wrong type, bad email, age out of range |

A simple way to remember: **2xx = success**, **4xx = the request had a problem**, **5xx = the server had a problem**.

You never write code to send 422: FastAPI does it automatically using the rules in your schemas.

---

## 10. Practice exercises

Try these in Swagger to check your understanding:

1. List all students. How many are there?
2. Get the student with ID 4. What course are they on?
3. Create a student for yourself. What ID do you get?
4. Use `PATCH` to change only your age.
5. Try to use `PUT` while sending only `name`. What status code do you get, and why?
6. Delete student 1, then try to get student 1. What happens?
7. Create a student with the email `"hello"`. Read the 422 response and find which field it complains about.
8. Use `skip` and `limit` to get only the 3rd and 4th students.
9. Stop the server (Ctrl + C) and start it again. Are your changes still there? Why not?
10. Add a sixth student to `students.json`, restart the server, and check they appear.

### Ideas for when you're ready for more

- Add a new field, such as `phone`, to the schema in `model.py` and to every student in `students.json`.
- Add an endpoint that searches students by course, such as `GET /students?course=Physics`.
- Save students in a real database (SQLite) so changes survive a restart.
- Move the student endpoints into their own file with FastAPI's `APIRouter`.
