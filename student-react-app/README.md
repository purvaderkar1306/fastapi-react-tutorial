# Student Manager: React Frontend

A **React** version of the student management page. It talks to the **FastAPI + MySQL** backend in [`../fastapi-mysql-app`](../fastapi-mysql-app/).

It does everything the jQuery version does: table, search, course filter, sorting, pages, summary cards, Add/Edit/View modals, confirm and alert pop-ups, and dark mode. It even uses the **same CSS files**. The difference is *how* the code is written.

Built with:

| Tool | What it does |
|---|---|
| **React 19** | builds the page out of reusable **components** |
| **Vite** | the development server and build tool (very fast) |
| **Axios** | sends requests to the API (the React-world version of `$.ajax`) |
| **React Router** | gives each page its own address (`/students`, later `/courses`...) |
| **Oxlint** | checks the code for mistakes (`npm run lint`) |

---

## 1. How to run it

You need **two terminals**: one for the backend, one for the frontend.

**Terminal 1: the API (FastAPI + MySQL)**

```
cd d:\PythonTutorials\fastapitutorials\fastapi-mysql-app
venv\Scripts\activate
uvicorn app.main:app --reload
```

**Terminal 2: the React app**

```
cd d:\PythonTutorials\fastapitutorials\student-react-app
npm install        ← only the first time (downloads packages into node_modules)
npm run dev
```

Open **http://localhost:5173**. The page goes straight to `/students`.

While `npm run dev` is running, saving any `.jsx` or `.css` file updates the browser **instantly**, without a reload. This is called **HMR** (Hot Module Replacement).

### All npm commands

| Command | What it does |
|---|---|
| `npm install` | installs everything listed in `package.json` into `node_modules/` |
| `npm run dev` | starts the development server on port 5173 |
| `npm run lint` | checks the code for mistakes |
| `npm run build` | makes an optimised version for production in `dist/` |
| `npm run preview` | serves the `dist/` build locally, to test it |

---

## 2. How the frontend reaches the API: the Vite proxy

```
Browser ──▶ http://localhost:5173/api/students
              │
              │  vite.config.js:  /api/...  →  http://127.0.0.1:8000/...
              ▼
           http://127.0.0.1:8000/students   (FastAPI)  ──▶  MySQL
```

- In the code, every request goes to **`/api/...`** (set in [src/api/client.js](src/api/client.js)).
- During development, Vite **forwards** (proxies) those requests to FastAPI and removes the `/api` part.
- The browser only ever talks to port 5173, so there are **no CORS problems**.

**Why the `/api` prefix?** The React page itself lives at `/students`. If the API were also at `/students`, refreshing the page would hit the API and show raw JSON instead of the page. The prefix keeps the two apart.

---

## 3. Folder structure

```
student-react-app/
├── index.html                  the single HTML page; React draws everything inside <div id="root">
├── vite.config.js              Vite settings + the /api proxy
├── package.json                project name, scripts, and the list of packages
├── .env.example                example settings (VITE_API_BASE_URL)
├── public/
│   └── favicon.svg             files copied as-is (logo)
└── src/
    ├── main.jsx                START HERE: mounts <App> and loads the CSS
    ├── App.jsx                 the routes: which URL shows which page
    │
    ├── api/                    ── talking to the backend ──
    │   ├── client.js           one shared Axios instance (base URL, timeout)
    │   ├── students.js         studentsApi.list/get/create/update/remove + healthApi
    │   └── errors.js           parseApiError(): turns 404/409/422 into friendly messages
    │
    ├── components/             ── reusable building blocks ──
    │   ├── layout/
    │   │   ├── Layout.jsx      header + page + footer frame
    │   │   └── Header.jsx      logo, menu, API status, theme button
    │   └── ui/
    │       ├── Modal.jsx       THE modal window (animation, Esc, focus trap, portal)
    │       ├── AlertDialog.jsx success/error/confirm pop-up, built on Modal
    │       ├── Pagination.jsx  ‹ 1 … 4 5 6 … 12 ›
    │       ├── Avatar.jsx      coloured circle with initials
    │       ├── CourseBadge.jsx coloured course pill
    │       └── Icon.jsx        all the SVG icons
    │
    ├── context/                ── data shared by the whole app ──
    │   ├── dialog-context.js   the Context object
    │   └── DialogProvider.jsx  the queue of alert/confirm dialogs
    │
    ├── hooks/                  ── reusable logic (functions starting with "use") ──
    │   ├── useDialog.js        const dialog = useDialog(); dialog.success(...)
    │   ├── useDebounce.js      waits until you stop typing
    │   ├── useTheme.js         light/dark mode, remembered in localStorage
    │   ├── useApiStatus.js     checks /health/db every 30 seconds
    │   └── useCountUp.js       animated numbers in the stat cards
    │
    ├── features/students/      ── everything about the Students page ──
    │   ├── StudentsPage.jsx    the page: holds the state, connects the pieces
    │   ├── useStudents.js      loads the list from the API
    │   ├── StudentStats.jsx    the 4 summary cards
    │   ├── StudentToolbar.jsx  search, filter, page size, reload
    │   ├── StudentTable.jsx    the table and its action buttons
    │   ├── StudentFormModal.jsx Add/Edit form (validation, POST/PATCH)
    │   └── StudentViewModal.jsx details card
    │
    ├── pages/
    │   └── NotFoundPage.jsx    the 404 page
    ├── utils/
    │   └── student.js          initials, colours, form ↔ API conversion, validation
    └── styles/                 the same CSS as the jQuery version, plus app.css
```

**Why `features/`?** Everything about students is in **one folder**. When you add courses, you'll create `features/courses/` with its own page, table and form. Shared pieces like `Modal` stay in `components/`.

---

## 4. React in 10 ideas (with this project's code)

### 4.1 Components are functions that return HTML-like code (JSX)

```jsx
// src/components/ui/Avatar.jsx
export default function Avatar({ name, large = false }) {
  return (
    <span className={`avatar ${large ? 'avatar-lg' : ''}`} style={{ '--hue': hueFromString(name) }}>
      {initials(name)}
    </span>
  )
}
```

- A **component** is a function whose name starts with a **capital letter**. You use it like a tag: `<Avatar name="Asha Patil" />`.
- **JSX** looks like HTML but is JavaScript. The differences:
  - `className` instead of `class`, and `htmlFor` instead of `for`.
  - `{ ... }` puts any JavaScript value or expression into the markup.
  - `style` takes an **object**: `style={{ '--hue': 120 }}`. The outer braces mean "JavaScript here", the inner ones are the object.
  - Every tag must be closed: `<input />`.

### 4.2 Props: passing data into a component

```jsx
<StudentTable students={pageItems} loading={loading} onDelete={confirmDelete} />
```

**Props** are like function arguments. `StudentTable` receives them as one object, and `{ students, loading, onDelete }` unpacks it (destructuring). Props flow **down** from parent to child. To send something **up**, the parent passes a function (like `onDelete`), and the child calls it.

### 4.3 State: data that changes, with `useState`

```jsx
const [search, setSearch] = useState('')
```

- `search` is the current value. `setSearch('asha')` changes it.
- **Changing state re-runs the component and updates the screen.** You never touch the page directly.

**This is the biggest difference from jQuery:**

| jQuery version | React version |
|---|---|
| Change a variable, then call `render()` to rebuild the table by hand | Call `setSearch(...)`; React updates the table itself |
| `$("#fName").val(student.name)` | `value={values.name}`: the input always shows the state |
| `$row.addClass("flash")` | `className={s.id === highlightId ? 'flash' : undefined}` |

### 4.4 Lists need a `key`

```jsx
{students.map((s) => (
  <tr key={s.id}> ... </tr>
))}
```

`.map()` turns each student into a row. **`key`** gives each row a stable name, so when the list changes, React knows which rows are new, moved or removed. Always use a real id, not the array index.

### 4.5 Events

```jsx
<button onClick={() => onDelete(s)}>...</button>
<input onChange={(e) => onSearchChange(e.target.value)} />
<form onSubmit={handleSubmit}>
```

Like `.on("click", ...)` in jQuery, but written on the element itself. **Pass a function**: `onClick={() => onDelete(s)}`, not `onClick={onDelete(s)}` (that would call it straight away, while rendering). Event delegation happens automatically.

### 4.6 Controlled inputs (forms)

```jsx
const [values, setValues] = useState({ name: '', age: '', email: '', course: '' })

<input name="name" value={values.name} onChange={handleChange} />

function handleChange(e) {
  const { name, value } = e.target
  setValues((current) => ({ ...current, [name]: value }))
}
```

The input shows the **state**, and every keystroke **updates the state**. React is the "single source of truth". One `handleChange` works for every field, because `[name]` uses the input's `name` attribute as the key.

### 4.7 `useEffect`: doing things *after* rendering

```jsx
// src/hooks/useDebounce.js
useEffect(() => {
  const timer = setTimeout(() => setDebounced(value), delay)
  return () => clearTimeout(timer)      // cleanup: runs before the next effect, or when removed
}, [value, delay])                      // dependencies: run again when these change
```

Use effects for things **outside** React: timers, API calls, `document` event listeners, `localStorage`. The **cleanup function** undoes what the effect did (cancels the timer, removes the listener).

> In development, **StrictMode** (in `main.jsx`) runs every effect **twice** on purpose, to catch missing cleanups. That's why `useStudents` ignores the answer from the first run. It doesn't happen in production.

### 4.8 `useMemo`: don't recalculate unless needed

```jsx
const visible = useMemo(() => { /* filter + sort */ }, [students, debouncedSearch, selectedCourse, sort])
```

The filtering and sorting only run again when one of those four values changes, not on every render (for example when a modal opens).

### 4.9 Custom hooks: reusable logic

Any function whose name starts with **`use`** and that uses other hooks is a **custom hook**:

```jsx
const { students, loading, error, reload } = useStudents()
const { theme, toggleTheme } = useTheme()
const debouncedSearch = useDebounce(search, 250)
```

Hooks keep components short: `StudentsPage` doesn't need to know *how* students are loaded.

**Rules of hooks:** only call hooks at the **top level** of a component (never inside `if`, loops or nested functions), so React can match them up on every render. `npm run lint` checks this.

### 4.10 Context: sharing without passing props through every level

Every component may need to show an alert. Instead of passing a `dialog` prop through every layer, `DialogProvider` (in `main.jsx`) wraps the whole app, and any component can do:

```jsx
const dialog = useDialog()
dialog.success('Student created', 'Asha was added.')
const yes = await dialog.confirm({ title: 'Delete student?', okText: 'Delete', danger: true })
```

`confirm` returns a **Promise** that resolves to `true`/`false` when the user clicks a button, so `await` waits for the answer.

---

## 5. How the modal works (`components/ui/Modal.jsx`)

```jsx
<Modal open={form.open} onClose={closeForm} title="Add Student" footer={<>...buttons...</>}>
  ...form...
</Modal>
```

The parent only decides **`open={true/false}`**. The Modal does the rest:

1. **`open` becomes true** → `mounted` becomes true → the modal is added to the page (invisible).
2. **Next frame** → `visible` becomes true → the class `show` is added → the CSS from `modal.css` animates it in. (The same "reflow, then add `.show`" trick as the jQuery version.)
3. **`open` becomes false** → `show` is removed → the closing animation plays → after **240 ms** it's removed from the page → `onExited` is called → focus goes back to the button that opened it.

Also inside `Modal.jsx`:
- **`createPortal(..., document.body)`** draws the modal at the end of `<body>`, outside the page layout, so no parent's CSS can clip it.
- **Esc** calls `onClose`, but only for the **top-most** modal (a shared `openStack` list keeps track, so an alert above the form closes first).
- **Tab trap:** focus stays inside the modal.
- **Scroll lock:** `body.modal-open` stops the page behind it from scrolling.
- **`closeOnBackdrop={false}`** makes it **shake** instead of closing (used by alerts).

**The Add/Edit form starts fresh every time** because `StudentsPage` gives it a new **`key`** whenever it opens. When a component's `key` changes, React throws away the old one and creates a new one, with brand-new state.

**The Save button is in the modal footer, outside the `<form>`**. It still submits the form thanks to the HTML attribute `form="student-form"`.

---

## 6. How API calls work (`src/api/`)

```js
// client.js: one shared Axios instance
export const api = axios.create({ baseURL: '/api', timeout: 10000 })

// students.js: one function per endpoint
export const studentsApi = {
  list:   (skip = 0, limit = 1000) => api.get('/students', { params: { skip, limit } }).then((res) => res.data),
  create: (student)     => api.post('/students', student).then((res) => res.data),
  update: (id, changes) => api.patch(`/students/${id}`, changes).then((res) => res.data),
  remove: (id)          => api.delete(`/students/${id}`),
  ...
}
```

Using it with `async`/`await`:

```js
try {
  const saved = await studentsApi.create(data)    // waits for the answer
  onSaved(saved)
} catch (err) {                                    // any 4xx/5xx, timeout or network error
  const problem = parseApiError(err)
  dialog.error(problem.title, problem.message, problem.items)
} finally {
  setSaving(false)                                 // runs either way
}
```

**Axios vs `$.ajax`:**

| `$.ajax` (jQuery version) | Axios (this version) |
|---|---|
| `JSON.stringify(data)` + `contentType` | automatic: just pass the object |
| `dataType: "json"` | automatic: the answer is in `res.data` |
| `.done / .fail / .always` | `try / catch / finally` with `await` |
| `jqXHR.status`, `jqXHR.responseJSON` | `err.response.status`, `err.response.data` |
| `$.param({...})` | `{ params: {...} }` |

**`parseApiError`** turns FastAPI's errors into `{ title, message, items, fieldErrors }`:
- **422** → a list of field problems; the form marks those boxes red.
- **409** (duplicate email) → the Email box turns red.
- **404** → "Not found".
- **No answer** → "Cannot reach the API" (the backend isn't running).

**Safety:** React **escapes all text automatically**, so there's no `escapeHtml` function in this project. `{student.name}` can never inject HTML or scripts. Messages with bold text are written as JSX (`<><strong>{name}</strong> was removed.</>`), not as HTML strings.

---

## 7. jQuery version → React version: where each thing went

| jQuery version (`fastapi-mysql-app/frontend`) | React version (`src/`) |
|---|---|
| `index.html` (all the markup) | split into components: `Header`, `StudentTable`, `StudentFormModal`... |
| `config.js` | `vite.config.js` (proxy) + `api/client.js` + `.env` |
| `utils.js` | `utils/student.js` + `hooks/useDebounce.js` |
| `api.js` | `api/students.js` + `api/errors.js` |
| `modal.js` → `Modal` | `components/ui/Modal.jsx` |
| `modal.js` → `Dialog` | `context/DialogProvider.jsx` + `components/ui/AlertDialog.jsx` + `hooks/useDialog.js` |
| `app.js` → `state` object | `useState` calls in `StudentsPage.jsx` |
| `app.js` → `render()` | automatic: React re-renders when state changes |
| `app.js` → `bindEvents()` | `onClick`, `onChange`, `onSubmit` on the elements |
| `app.js` → `rowHtml()` string building | JSX in `StudentTable.jsx` |
| CSS files | **the same files**, in `src/styles/` |

---

## 8. Building for production

```
npm run build
```

This creates the `dist/` folder: plain HTML, one CSS file and one JS file, minified. The proxy doesn't exist in production, so either:

- serve `dist/` from the **same address** as the API (and route `/api` to FastAPI with a web server such as Nginx), or
- serve it from anywhere, and set the API's full address before building, in a file called `.env.production`:

  ```
  VITE_API_BASE_URL=http://127.0.0.1:8000
  ```

  (The backend already allows other origins through its CORS settings.)

Only variables starting with **`VITE_`** are visible to the frontend code, and they're **built into** the JavaScript file, so never put secrets in them.

---

## 9. Common problems

| What you see | Reason | Fix |
|---|---|---|
| Red "API offline" pill + "Cannot reach the API" | FastAPI isn't running | Start it in Terminal 1 (section 1). |
| `'vite' is not recognized` / `Cannot find module` | packages not installed | `npm install` |
| `Port 5173 is in use` | `npm run dev` is already running somewhere | Close the other terminal, or use the port Vite suggests. |
| Changes don't appear | the dev server stopped, or a syntax error | Check Terminal 2 and the browser console (F12) for red errors. |
| Two network requests for the student list in DevTools | StrictMode in development (section 4.7) | Normal; it doesn't happen in production. |
| `Invalid hook call` | a hook was used outside a component, or inside `if`/a loop | Move it to the top level of the component. |

---

## 10. Next steps

1. Read [StudentsPage.jsx](src/features/students/StudentsPage.jsx) from top to bottom: it uses almost every idea above.
2. Practise: add a "Clear search" button to `StudentToolbar.jsx` (hint: call `onSearchChange('')`).
3. When the backend gets a `courses` table, add `features/courses/`, a route in `App.jsx`, and a `NavLink` in `Header.jsx`.
