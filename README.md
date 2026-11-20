# FastAPI + React Tutorial: Student Management

A step-by-step learning project that builds the same **student management app** three times. Each version adds one new technology.

| Step | Folder | Backend | Data stored in | Frontend |
|---|---|---|---|---|
| 1 | [`fastapi-app/`](fastapi-app/) | FastAPI (single `main.py`) | Python dictionary (in memory) | HTML + CSS + jQuery AJAX |
| 2 | [`fastapi-mysql-app/`](fastapi-mysql-app/) | FastAPI (layered: routers, crud, models, schemas) | **MySQL** via SQLAlchemy | the same jQuery frontend |
| 3 | [`student-react-app/`](student-react-app/) | uses step 2's API | MySQL | **React** + Vite + Axios |

Every folder has its own beginner-friendly README that explains the code in simple language.

```
fastapitutorials/
├── fastapi-app/           Step 1: FastAPI basics, CRUD, Swagger, jQuery frontend at /ui
├── fastapi-mysql-app/     Step 2: the same API saved in MySQL, proper folder structure
└── student-react-app/     Step 3: React frontend for the MySQL API
```

## Quick start

You need **Python 3.12+**, **MySQL 8**, and **Node.js 20+**.

### Step 1: `fastapi-app` (no database needed)

```
cd fastapi-app
python -m venv venv
venv\Scripts\activate
pip install "fastapi[standard]" email-validator
uvicorn main:app --reload
```

Open http://127.0.0.1:8000/ui/ (frontend) or http://127.0.0.1:8000/docs (Swagger).

### Step 2: `fastapi-mysql-app`

1. Create the database in MySQL:
   ```sql
   CREATE DATABASE studentfastapi CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
2. Copy `.env.example` to `.env` and put **your own** MySQL username and password in it. (`.env` is git-ignored, so it never reaches GitHub.)
3. Install and run:
   ```
   cd fastapi-mysql-app
   python -m venv venv
   venv\Scripts\activate
   pip install -r requirements.txt
   uvicorn app.main:app --reload
   ```

The table is created and filled with sample students automatically on the first start.

### Step 3: `student-react-app` (keep step 2 running)

```
cd student-react-app
npm install
npm run dev
```

Open http://localhost:5173.

> Steps 1 and 2 both use port 8000, so run only one of them at a time, or start one with `--port 8001`.
