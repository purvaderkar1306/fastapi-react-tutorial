# Student Manager Frontend

This folder holds the **frontend** of the app: the web page you see in the browser. You can use it to add, view, edit and delete students without opening Swagger.

The page is built from three plain web languages:

- **HTML** sets out what is on the page (buttons, a table, forms).
- **CSS** sets how the page looks (colours, spacing, animations).
- **JavaScript** (with the **jQuery** library) sets how the page behaves (what happens when you click, and how it talks to the API).

This README explains every file, every important piece of code, and what happens step by step when you click something. It assumes you have read the main [README.md](../README.md) for the API, but you don't need to know anything about frontend code already.

---

## Contents

1. [Words you need to know](#1-words-you-need-to-know)
2. [How to run the frontend](#2-how-to-run-the-frontend)
3. [The folder structure](#3-the-folder-structure)
4. [How the pieces fit together](#4-how-the-pieces-fit-together)
5. [File: `index.html`, the page](#5-file-indexhtml-the-page)
6. [The CSS files, the look](#6-the-css-files-the-look)
7. [The JavaScript files, the behaviour](#7-the-javascript-files-the-behaviour)
8. [What happens when you click: step-by-step walkthroughs](#8-what-happens-when-you-click-step-by-step-walkthroughs)
9. [What was changed in `main.py`](#9-what-was-changed-in-mainpy)
10. [Watching the AJAX calls in your browser](#10-watching-the-ajax-calls-in-your-browser)
11. [Common problems and how to fix them](#11-common-problems-and-how-to-fix-them)
12. [jQuery cheat sheet (only what this project uses)](#12-jquery-cheat-sheet-only-what-this-project-uses)
13. [Practice exercises](#13-practice-exercises)

---

## 1. Words you need to know

**Frontend and backend:** the **backend** is the server program (our FastAPI app in `main.py`). It stores the data and answers requests. The **frontend** is what the user sees and clicks in the browser. The frontend asks the backend for data and shows it.

**HTML (HyperText Markup Language):** describes the *content* of a page using **tags** such as `<button>`, `<table>` and `<input>`. Most tags come in pairs: `<h1>Students</h1>`.

**Element:** one piece of the page created by a tag, such as one button.

**Attribute:** extra information written inside a tag, such as `id="searchInput"` or `type="email"`.

**`id` and `class`:**
- An `id` is a unique name for **one** element: `id="studentModal"`. JavaScript uses it to find that exact element.
- A `class` is a group label that **many** elements can share: `class="btn btn-primary"`. CSS uses it to style all of them the same way. One element can have several classes, separated by spaces.

**CSS (Cascading Style Sheets):** rules that say how elements look. A rule has a **selector** (which elements) and **declarations** (what to change):

```css
.btn {               /* selector: every element with class="btn" */
    padding: 0 16px; /* declaration: property: value; */
    border-radius: 8px;
}
```

**Selector cheat sheet:**

| Selector | Picks | Example |
|---|---|---|
| `button` | every `<button>` tag | |
| `.btn` | every element with class `btn` | `<a class="btn">` |
| `#studentModal` | the element with id `studentModal` | |
| `.modal .btn` | a `.btn` that is *inside* a `.modal` | |
| `.btn:hover` | a `.btn` while the mouse is over it | |
| `[data-sort]` | any element that has a `data-sort` attribute | |

**JavaScript (JS):** the programming language that runs inside the browser. It can change the page, react to clicks and send requests to servers.

**DOM (Document Object Model):** the browser's live, in-memory version of the HTML page. When JavaScript "adds a row to the table", it is changing the DOM, and the screen updates straight away.

**jQuery:** a popular JavaScript **library** (ready-made code) that makes common jobs shorter. For example, `$("#searchInput")` finds the element with id `searchInput`. The `$` sign is jQuery's name.

**Event:** something that happens on the page, such as a `click`, a key press (`keydown`) or typing into a box (`input`). An **event handler** is a function that runs when the event happens.

**AJAX (Asynchronous JavaScript And XML):** sending a request to the server *in the background* without reloading the page. Despite the name, today we send JSON, not XML. In this project every API call is made with jQuery's `$.ajax(...)`.

**Asynchronous:** "doesn't wait". When you send an AJAX request, the code carries on straight away. The answer arrives later, and a **callback** function runs when it does.

**Promise:** an object that stands for "an answer that will arrive later". You attach functions to it:
- `.done(fn)` runs if the request **succeeded**
- `.fail(fn)` runs if it **failed**
- `.always(fn)` runs **either way**
- `.then(fn)` runs when the promise finishes (used by our dialogs)

**Modal (modal window):** a box that appears **on top** of the page and blocks the page behind it until you close it. Our Add/Edit form, the details card and all the alert messages are modals.

**Static files:** files that the server sends exactly as they are, without running any code: `.html`, `.css`, `.js`, images. FastAPI sends our frontend as static files.

**CDN (Content Delivery Network):** a public server that hosts popular libraries. We load jQuery and the Inter font from CDNs instead of keeping copies in our folder.

**Origin:** the start of a web address: protocol + host + port, for example `http://127.0.0.1:8000`. Two pages with different ports are **different origins**.

**CORS (Cross-Origin Resource Sharing):** a browser safety rule. By default a page from one origin is **not allowed** to read answers from a different origin. The server must say "this is allowed" with special headers. We switched this on in `main.py` (see [section 9](#9-what-was-changed-in-mainpy)).

**XSS (Cross-Site Scripting):** an attack where someone saves text containing HTML or JavaScript (for example a student named `<script>…</script>`), and another page runs it by mistake. We stop this by **escaping** text before showing it (see `escapeHtml` in [utils.js](#72-utilsjs-small-helpers)).

---

## 2. How to run the frontend

The frontend needs the API to be running, because it gets all its data from the API.

### Way 1 (recommended): let FastAPI serve it

1. Open a terminal in the `fastapi-app` folder.
2. Turn on the virtual environment and start the server:

   ```
   venv\Scripts\activate
   uvicorn main:app --reload
   ```

3. Open this address in your browser: **http://127.0.0.1:8000/ui/**

The page and the API now come from the same address, so everything just works.

### Way 2: open it some other way

You can also open `index.html` with VS Code's **Live Server** extension (it opens something like `http://127.0.0.1:5500/...`) or by double-clicking the file.

In that case the page and the API are on **different origins**, so:
- the API must still be running on port 8000, and
- CORS must be switched on in `main.py` (it already is).

`config.js` notices how the page was opened and picks the right API address for you (see [section 7.1](#71-configjs-settings)).

### Checking it works

- In the top-right corner of the page there's a small pill. A **green dot and "API online"** means the page reached the API.
- A **red dot and "API offline"**, plus an error pop-up saying "Cannot reach the API", means the server isn't running.

---

## 3. The folder structure

```
fastapi-app/
├── main.py                ← the API (backend). Also serves this folder at /ui
├── model.py
├── students.json
└── frontend/              ← everything in here is the frontend
    ├── index.html         ← the one and only page
    ├── README.md          ← this file
    └── assets/            ← everything the page needs, grouped by type
        ├── css/           ← how things LOOK
        │   ├── variables.css    colours, sizes, light & dark themes
        │   ├── base.css         basic reset, fonts, helper classes
        │   ├── layout.css       header, page width, grids, footer
        │   ├── components.css   buttons, cards, table, forms, badges...
        │   └── modal.css        modal windows and alert pop-ups
        ├── js/            ← how things BEHAVE
        │   ├── config.js        settings (API address, page size...)
        │   ├── utils.js         small helper functions
        │   ├── api.js           every call to the API ($.ajax)
        │   ├── modal.js         open/close modals, alert & confirm pop-ups
        │   └── app.js           the main logic: table, forms, buttons
        └── img/           ← pictures
            └── favicon.svg      the logo (also the little icon in the browser tab)
```

### Why split the code into so many files?

You *could* put everything in one huge `index.html`. It would work, but it would be very hard to read and change. Splitting by **job** is called **separation of concerns**:

- If you want to change a **colour**, you only open `variables.css`.
- If an **API call** is broken, you only look in `api.js`.
- If a **popup** misbehaves, you only look in `modal.js` and `modal.css`.

Each file does one job, so you always know where to look.

---

## 4. How the pieces fit together

When you open `http://127.0.0.1:8000/ui/`:

```
 Browser                                      FastAPI server (main.py)
 ───────                                      ────────────────────────
 1. asks for /ui/  ─────────────────────────▶ sends frontend/index.html
 2. reads the HTML, finds <link> and <script>
    tags, and asks for each file ───────────▶ sends the .css and .js files
    (jQuery and the font come from CDNs instead)
 3. draws the page with the CSS
 4. runs the JS files in order:
    jQuery → config → utils → api → modal → app
 5. app.js starts and calls
    StudentAPI.list() ──── GET /students ───▶ list_students()
                      ◀─── JSON list ──────── returns the students
 6. app.js builds table rows from the JSON
    and puts them on the page
```

### Why the order of the `<script>` tags matters

Each file **uses** things made by the files before it:

| File | Creates | Uses |
|---|---|---|
| jQuery (CDN) | `$` / `jQuery` | nothing |
| `config.js` | `APP_CONFIG` | nothing |
| `utils.js` | `Utils` | nothing |
| `api.js` | `StudentAPI`, `parseApiError` | `$`, `APP_CONFIG`, `Utils` |
| `modal.js` | `Modal`, `Dialog` | `$` |
| `app.js` | (runs the page) | **all of the above** |

If `app.js` were loaded before `api.js`, it would try to use `StudentAPI` before it exists and crash with an error like `StudentAPI is not defined`.

### How the files share things: the `window` object

In the browser, `window` is a global object that every script can see. Each of our files saves its result on `window`:

```js
window.StudentAPI = StudentAPI;   // at the end of api.js
```

After that, any later file can simply write `StudentAPI.list()`.

### The "wrapper" around each JS file

Every JS file is wrapped like this:

```js
(function (window, $) {
    "use strict";

    // ... all the code ...

})(window, jQuery);
```

This is called an **IIFE** (Immediately Invoked Function Expression), which just means "a function that runs straight away". Why use it?

- Variables created inside (such as `var stack = []` in `modal.js`) stay **private** to that file. They can't clash with a variable of the same name in another file.
- Only what we deliberately put on `window` becomes shared.
- `"use strict"` makes JavaScript stricter, so some common mistakes (such as using a variable you never declared) become clear errors instead of silent bugs.

---

## 5. File: `index.html`, the page

[index.html](index.html) is the skeleton of the page. Let's go through it from top to bottom.

### 5.1 The `<head>`: settings and stylesheets

```html
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Student Manager</title>
```

- `charset="UTF-8"` lets the page show any character (é, ₹, emoji...).
- `viewport` tells phones to use their real screen width instead of pretending to be a desktop. Without it, the page would look tiny on a phone.
- `<title>` is the text on the browser tab.

```html
<link rel="icon" type="image/svg+xml" href="assets/img/favicon.svg">
<link href="https://fonts.googleapis.com/css2?family=Inter:..." rel="stylesheet">
```

- The first line sets the small icon in the browser tab.
- The second loads the **Inter** font from Google Fonts.

```html
<link rel="stylesheet" href="assets/css/variables.css">
<link rel="stylesheet" href="assets/css/base.css">
<link rel="stylesheet" href="assets/css/layout.css">
<link rel="stylesheet" href="assets/css/components.css">
<link rel="stylesheet" href="assets/css/modal.css">
```

These load our five CSS files. **`variables.css` must come first**, because the other files use the variables it defines.

The paths such as `assets/css/base.css` are **relative**: the browser looks for them starting from the folder of `index.html`.

### 5.2 The header

```html
<header class="app-header">
    <a class="brand">...logo and "StudentManager"...</a>
    <span id="apiStatus" class="api-status">...Checking API…</span>
    <button id="themeToggle">...sun and moon icons...</button>
    <a href="/docs" target="_blank">API Docs</a>
</header>
```

- **`#apiStatus`**: the pill that shows whether the API is online. `app.js` changes its text and colour.
- **`#themeToggle`**: switches between light and dark mode. Both a sun icon and a moon icon are inside it; CSS shows only one at a time.
- **API Docs** opens Swagger (`/docs`) in a new tab (`target="_blank"`).

**About the icons:** icons are written as `<svg>` (Scalable Vector Graphics) directly in the HTML. An SVG is a picture described with lines and shapes, so it stays sharp at any size and can change colour with CSS. For example, this is the "+" icon:

```html
<svg class="icon" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>
```

`M12 5v14` means "move to point (12, 5), then draw a vertical line 14 units down". The second part draws the horizontal line.

### 5.3 The page title and the "Add Student" button

```html
<section class="page-head">
    <h1>Students</h1>
    <button id="btnAddStudent" class="btn btn-primary">Add Student</button>
</section>
```

`app.js` listens for clicks on `#btnAddStudent` and opens the Add form.

### 5.4 The summary cards

```html
<article class="stat-card" style="--accent: var(--c-primary)">
    <span class="stat-label">Total students</span>
    <span class="stat-value" id="statTotal">–</span>
</article>
```

There are four cards: total students, average age, number of courses, and most popular course. They start with `–`, and `app.js` fills in the real numbers.

`style="--accent: ..."` gives each card its own colour. `--accent` is a **CSS variable** (see [section 6.1](#61-variablescss-design-tokens)). The card's CSS uses `var(--accent)` for its coloured strip, so one CSS rule makes four differently coloured cards.

### 5.5 The toolbar: search, filter, page size, reload

```html
<input id="searchInput" type="search" placeholder="Search by name, email or course…">
<select id="courseFilter">  <option value="">All courses</option>  </select>
<select id="pageSize">  <option value="5">5 / page</option> ...  </select>
<button id="btnRefresh">...</button>
```

- **`#searchInput`**: type here to filter the table.
- **`#courseFilter`**: starts with only "All courses". `app.js` adds one option for every course it finds in the data.
- **`#pageSize`**: how many rows to show per page.
- **`#btnRefresh`**: loads the students from the API again.

### 5.6 The table

```html
<table class="data-table" id="studentsTable">
    <thead>
        <tr>
            <th data-sort="id" class="sortable">ID</th>
            <th data-sort="name" class="sortable">Name</th>
            ...
        </tr>
    </thead>
    <tbody id="studentsBody">
        <!-- rows are rendered by app.js -->
    </tbody>
</table>
```

- `<thead>` is the heading row. It never changes.
- `<tbody id="studentsBody">` is **empty** in the HTML. `app.js` creates the rows from the API data and puts them in here.
- **`data-sort="name"`** is a **data attribute**. You can invent any attribute that starts with `data-` to store extra information on an element. Here it tells `app.js` *which field* to sort by when you click that heading.
- `class="hide-md"` / `class="hide-sm"` hide less important columns on smaller screens.

Below the table are two "state" boxes:

```html
<div id="tableLoader" class="table-state">  spinner + "Loading students…"  </div>
<div id="tableEmpty" class="table-state" hidden>  "No students found."  </div>
```

The `hidden` attribute hides an element. `app.js` shows the loader while waiting for the API, and shows the "empty" message when no students match.

Then the footer of the table:

```html
<span id="pageInfo"></span>          ← "Showing 1–10 of 23"
<nav id="pagination"></nav>          ← page buttons ‹ 1 2 3 ›, built by app.js
```

### 5.7 The three modals

All three modals are written in the HTML **once**, hidden with the `hidden` attribute. JavaScript shows and hides them, and changes the text inside them each time.

Every modal has the same structure:

```html
<div class="modal" id="..." role="dialog" aria-modal="true" hidden>
    <div class="modal-backdrop" data-dismiss="modal"></div>   ← dark see-through layer
    <div class="modal-dialog">                                 ← the white box
        <div class="modal-content">
            <header class="modal-header">  title + × button  </header>
            <div class="modal-body">       the main content  </div>
            <footer class="modal-footer">  buttons           </footer>
        </div>
    </div>
</div>
```

- **`.modal-backdrop`** covers the whole page in a dark, blurred layer, so the user knows the page behind is "paused".
- **`data-dismiss="modal"`** marks anything that should **close** the modal when clicked: the × button, the Cancel button, and the backdrop.
- **`role="dialog"` and `aria-modal="true"`** are **accessibility** attributes. They tell screen readers (software that reads the page aloud for blind users) that this is a pop-up window.

**Modal 1: `#studentModal` (Add / Edit form)**

```html
<form id="studentForm" class="modal-content" novalidate>
    <input type="hidden" name="id" id="studentId">

    <label for="fName">Full name <span class="req">*</span></label>
    <input class="input" id="fName" name="name" type="text">
    <small class="field-error" data-for="name"></small>
    ... same for age, course, email ...

    <button type="submit" id="btnSaveStudent">
        <span class="spinner spinner-sm" hidden></span>
        <span class="btn-label">Save</span>
    </button>
</form>
```

- The same form is used for **adding and editing**. `app.js` changes the title ("Add Student" or "Edit Student #3") and the button text ("Save" or "Update").
- `<label for="fName">` is linked to `<input id="fName">`, so clicking the label puts the cursor in the box.
- `name="name"`, `name="age"`... match the field names in the API's `StudentCreate` model exactly. This makes it easy to match server errors to boxes.
- `<small class="field-error" data-for="name">` is an empty space under each box. Error messages for that field appear here.
- `novalidate` switches off the browser's own pop-up error bubbles, because we show our own nicer messages instead.
- `<datalist id="courseList">` gives the Course box **suggestions** (the existing courses) while still letting you type a new one.
- The **spinner** inside the Save button is hidden at first. It's shown while the request is being sent.

**Modal 2: `#viewModal` (Student details)**

Shows one student as a card: a coloured circle with their initials (the **avatar**), their name, their course, and a list of ID, age and email. It has an **Edit** button that jumps straight to the edit form.

**Modal 3: `#dialogModal` (alerts and confirmations)**

```html
<div class="modal modal-alert" id="dialogModal" role="alertdialog" hidden>
    <div class="alert-icon" id="dialogIcon"></div>      ← ✓, ✕, ⚠ or ⓘ
    <h2 id="dialogTitle"></h2>
    <div id="dialogMessage"></div>
    <button id="dialogCancel">Cancel</button>
    <button id="dialogOk">OK</button>
</div>
```

This one modal is used for **every** message: "Student created", "Validation error", "Delete student?" and so on. `modal.js` fills in the icon, title, message and button text each time. Its backdrop has **no** `data-dismiss`, so clicking outside it doesn't close it. You must press a button.

This is what **"modal-based alerts"** means: instead of the browser's plain grey `alert("...")` box, we show our own styled pop-up.

### 5.8 The scripts at the bottom

```html
<script src="https://code.jquery.com/jquery-3.7.1.min.js"
        integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo="
        crossorigin="anonymous"></script>
<script src="assets/js/config.js"></script>
<script src="assets/js/utils.js"></script>
<script src="assets/js/api.js"></script>
<script src="assets/js/modal.js"></script>
<script src="assets/js/app.js"></script>
```

- **Why at the bottom of `<body>`?** The browser reads HTML from top to bottom. By putting scripts last, all the HTML elements already exist when the scripts run, and the page appears on screen faster.
- **`integrity="sha256-..."`** is a fingerprint of the jQuery file. If the CDN ever sent a changed (possibly hacked) file, the fingerprint wouldn't match and the browser would refuse to run it. This is called **Subresource Integrity (SRI)**.
- **`.min.js`** means "minified": the same code with all spaces and comments removed, so it downloads faster.

---

## 6. The CSS files, the look

### 6.1 `variables.css`: design tokens

[variables.css](assets/css/variables.css) stores every colour, size and speed **in one place**, as **CSS custom properties** (also called **CSS variables**).

```css
:root {
    --c-primary: #6366f1;   /* the main purple-blue colour */
    --c-danger:  #ef4444;   /* red */
    --surface:   #ffffff;   /* card background */
    --text:      #1e2133;   /* main text colour */
    --radius:    12px;      /* how round corners are */
    --dur:       220ms;     /* how long animations take */
}
```

- `:root` means "the whole page", so these variables can be used everywhere.
- A variable name always starts with **two dashes**: `--c-primary`.
- To use one, write `var(--c-primary)`:

  ```css
  .btn-danger { background: var(--c-danger); }
  ```

**Why bother?** If you want a different main colour, you change **one line** (`--c-primary`) and every button, link, focus ring and active page number changes with it.

Colours like `rgb(99 102 241 / 0.12)` mean "red 99, green 102, blue 241, at **12% opacity**" (mostly see-through). These "soft" versions are used for light backgrounds behind icons.

#### Dark mode

The same variable names get **different values** in dark mode:

```css
:root[data-theme="dark"] {
    --bg:      #0f1120;   /* dark background */
    --surface: #181b2e;   /* dark cards */
    --text:    #e8eaf6;   /* light text */
}
```

When JavaScript puts `data-theme="dark"` on the `<html>` tag, these values replace the light ones. Every element that uses `var(--surface)` or `var(--text)` changes colour automatically. **We never had to write separate dark styles for each button or card.**

There's also this block:

```css
@media (prefers-color-scheme: dark) {
    :root:not([data-theme="light"]) { ...same dark values... }
}
```

`@media (prefers-color-scheme: dark)` means "if the computer's system setting is dark mode". `:not([data-theme="light"])` means "unless the user picked light". So the page follows your computer's setting until you click the toggle.

`color-scheme: dark` tells the browser to draw its own parts (scrollbars, the date picker, dropdown lists) in dark colours too.

### 6.2 `base.css`: the foundation

[base.css](assets/css/base.css) sets the basics that apply to the whole page.

```css
*, *::before, *::after { box-sizing: border-box; }
```

By default, if you give a box `width: 200px` and `padding: 20px`, it ends up **240px** wide. `border-box` makes the padding fit **inside** the 200px, which is much easier to work with. `*` means "every element".

```css
body {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: var(--bg-gradient), var(--bg);
}
```

- `100vh` means "100% of the **v**iewport (browser window) **h**eight", so the page always fills the screen.
- `display: flex; flex-direction: column` stacks header, main and footer vertically. `flex: 1` on `<main>` (in `layout.css`) makes the main part stretch, which pushes the footer to the bottom.
- The background is two layers: soft coloured glows (`radial-gradient`) on top of a plain colour.

```css
body.modal-open { overflow: hidden; }
```

When a modal is open, `modal.js` adds the class `modal-open` to `<body>`. This stops the page behind from scrolling.

```css
[hidden] { display: none !important; }
```

Makes sure anything with the `hidden` attribute is really hidden, even if another rule tries to show it. `!important` means "this rule wins".

```css
:focus-visible { outline: 2px solid var(--c-primary); outline-offset: 2px; }
```

When you move around with the **Tab** key, the element you're on gets a visible outline. `:focus-visible` only shows it for keyboard users, not after mouse clicks.

**Helper classes:**

```css
.muted { color: var(--text-muted); }      /* grey text */
.text-right { text-align: right; }

@media (max-width: 900px) { .hide-md { display: none; } }
@media (max-width: 640px) { .hide-sm { display: none; } }
```

A **media query** (`@media`) applies rules only under certain conditions. `max-width: 900px` means "only when the window is 900px wide or less". So the Email column disappears on tablets and the Course column disappears on phones. On those screens, the email is shown in small text under the name instead (`.show-md`).

```css
@media (prefers-reduced-motion: reduce) { ...animations switched off... }
```

Some people get dizzy from movement on screen and switch on "reduce motion" in their system settings. This rule respects that and switches off almost all animations.

### 6.3 `layout.css`: the big boxes

[layout.css](assets/css/layout.css) arranges the main areas of the page.

```css
.container {
    max-width: var(--container);   /* 1180px */
    margin-inline: auto;
    padding-inline: var(--sp-4);
}
```

Keeps content from getting too wide on big screens. `margin-inline: auto` centres it (equal left and right margin). `padding-inline` keeps 16px of space on each side so text never touches the screen edge on phones.

**The "glass" header:**

```css
.app-header {
    position: sticky;
    top: 0;
    background: var(--surface-glass);           /* white at 72% opacity */
    backdrop-filter: saturate(180%) blur(14px);
}
```

- `position: sticky; top: 0` keeps the header stuck to the top while you scroll.
- `backdrop-filter: blur(14px)` blurs whatever is **behind** the header. Together with the see-through background, this creates the frosted-glass look.

**The stats grid:**

```css
.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--sp-4);
}
```

This single line makes the cards **responsive without any media queries**. It means: "make as many columns as will fit (`auto-fit`), each at least 200px wide and sharing the leftover space equally (`1fr`)". On a wide screen you get 4 columns; on a phone, 1 column.

**The fade-in when the page loads:**

```css
.main { animation: fade-up 500ms var(--ease) both; }

@keyframes fade-up {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: none; }
}
```

`@keyframes` defines an animation: here it starts invisible and 12px lower, then ends fully visible in its normal place. `var(--ease)` is a **timing curve** that starts fast and slows down at the end, which feels smooth and natural.

### 6.4 `components.css`: the building blocks

[components.css](assets/css/components.css) styles the reusable pieces.

#### Buttons

```css
.btn {
    --btn-bg: var(--surface);
    --btn-fg: var(--text);
    background: var(--btn-bg);
    color: var(--btn-fg);
    transition: background-color var(--dur) var(--ease), transform 120ms var(--ease), ...;
}
.btn-danger { --btn-bg: var(--c-danger); --btn-fg: #fff; }
.btn:active:not(:disabled) { transform: translateY(1px) scale(0.98); }
```

- Each button **variant** (`btn-primary`, `btn-danger`, `btn-outline`, `btn-ghost`) only changes the button's **own local variables** (`--btn-bg`, `--btn-fg`). The main `.btn` rule does the rest. This keeps the code short.
- `transition` makes changes (like the colour on hover) happen **smoothly** over 220ms instead of instantly.
- `:active` is "while the mouse button is held down". The button shrinks slightly, so clicking feels physical.
- `:not(:disabled)` means "but not when the button is disabled".

You combine classes in the HTML: `class="btn btn-primary"` = basic button + primary colours.

The primary button uses a **gradient** (a smooth blend from one colour to another):

```css
.btn-primary { background: linear-gradient(135deg, var(--c-primary), #8b5cf6); }
```

#### The API status pill and its pulse

```css
.api-status.online .dot { background: var(--c-success); animation: pulse 2s infinite; }

@keyframes pulse {
    0%   { box-shadow: 0 0 0 0   rgb(16 185 129 / 0.6); }
    70%  { box-shadow: 0 0 0 8px rgb(16 185 129 / 0); }
}
```

`.api-status.online` (two classes with **no space**) means "an element that has **both** classes". When online, the green dot sends out a fading ring forever (`infinite`), like a heartbeat.

#### Stat cards with `::before` and `::after`

```css
.stat-card::before {           /* coloured strip on the left */
    content: "";
    position: absolute;
    inset: 0 auto 0 0;
    width: 4px;
    background: var(--accent);
}
.stat-card:hover { transform: translateY(-3px); }
```

`::before` and `::after` are **pseudo-elements**: extra boxes that CSS adds to an element **without any extra HTML**. Here, `::before` draws the coloured strip and `::after` draws the faint circle in the corner. On hover, the card lifts up 3px.

`position: absolute` places the strip at exact positions inside the card (`inset: 0 auto 0 0` = top 0, right auto, bottom 0, left 0). This works because the card itself has `position: relative`.

#### Form inputs

```css
.input:focus {
    border-color: var(--c-primary);
    box-shadow: var(--ring);           /* soft coloured glow around the box */
}
.input.is-invalid {
    border-color: var(--c-danger);
    box-shadow: 0 0 0 4px var(--c-danger-soft);
}
```

When you click into a box it glows purple. When `app.js` finds an error in a box, it adds the class `is-invalid` and the box turns red.

```css
.form-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); }
.form-group.span-2 { grid-column: span 2; }
```

The form is a 2-column grid. Age and Course sit side by side; Name and Email stretch across both columns (`span 2`). On small screens it becomes 1 column.

#### Table

```css
.data-table thead th { position: sticky; top: 0; }
.data-table tbody tr {
    animation: row-in 360ms var(--ease) both;
    animation-delay: calc(var(--i, 0) * 30ms);
}
```

- Each row slides in. `app.js` gives each row `style="--i:0"`, `"--i:1"`, `"--i:2"`... and `calc(var(--i) * 30ms)` turns that into a delay of 0ms, 30ms, 60ms... So rows appear **one after another**, like a wave. This is called a **staggered animation**.
- `.flash` briefly turns a row green. It's added to a student you just created or edited, so you can spot it.

**Sort arrows:**

```css
.sortable::after       { content: "↕"; opacity: 0.35; }
.sortable.asc::after   { content: "↑"; opacity: 1; }
.sortable.desc::after  { content: "↓"; opacity: 1; }
```

The arrow is pure CSS. `app.js` only adds the class `asc` or `desc` to the heading.

#### Avatars and badges: colours from a number

```css
.avatar { background: hsl(var(--hue, 240) 70% 58%); }
```

`hsl()` describes a colour as **H**ue (0–360, the position on the colour wheel: 0 = red, 120 = green, 240 = blue), **S**aturation and **L**ightness. `app.js` calculates a hue number from each student's name and sets `--hue`. The same name always gives the same colour, but different names give different colours, all equally bright. `var(--hue, 240)` means "use `--hue`, or 240 if it isn't set".

#### Spinner

```css
.spinner {
    border: 3px solid var(--c-primary-soft);
    border-top-color: var(--c-primary);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
```

A circle with one coloured side, spinning forever. That's a loading spinner.

### 6.5 `modal.css`: pop-ups

[modal.css](assets/css/modal.css) styles the modals and controls their opening animation.

```css
.modal {
    position: fixed;
    inset: 0;                  /* cover the whole window */
    z-index: 1000;             /* sit on top of everything */
    display: grid;
    place-items: center;       /* centre the box */
}
.modal-alert { z-index: 1100; }
```

- `position: fixed; inset: 0` stretches the modal over the **whole window**, and it stays put when you scroll.
- **`z-index`** controls which things are on top. A higher number is closer to you. The alert modal (1100) sits **above** the form modal (1000), so an error message can appear on top of the form.
- `display: grid; place-items: center` is the shortest way to centre something both horizontally and vertically.

**The opening animation:**

```css
.modal-backdrop { opacity: 0; transition: opacity var(--dur) var(--ease); }
.modal-dialog   { opacity: 0; transform: translateY(24px) scale(0.96); transition: ...; }

.modal.show .modal-backdrop { opacity: 1; }
.modal.show .modal-dialog   { opacity: 1; transform: none; }
```

At first the box is invisible, slightly lower and slightly smaller. When `modal.js` adds the class `show`, the `transition` animates it to fully visible, in place, at full size. It looks like the box **floats up** into view. Removing `show` plays the same animation backwards.

**The shake:**

```css
.modal.shake .modal-dialog { animation: shake 400ms var(--ease); }
@keyframes shake {
    20%, 60% { transform: translateX(-8px); }
    40%, 80% { transform: translateX(8px); }
}
```

If you try to close an alert by clicking outside it, it shakes left and right to say "you must click a button".

**Alert icons:**

```css
.alert-icon         { --tone: var(--c-info); color: var(--tone); background: var(--tone-soft); }
.alert-icon.success { --tone: var(--c-success); --tone-soft: var(--c-success-soft); }
.alert-icon.error   { --tone: var(--c-danger);  --tone-soft: var(--c-danger-soft); }
```

Again, each type only changes the local `--tone` variables. The icon "pops" in (`@keyframes pop`: grows slightly too big, then settles).

**The check mark that draws itself:**

```css
.alert-icon.success .icon path {
    stroke-dasharray: 30;
    stroke-dashoffset: 30;
    animation: draw 500ms 150ms var(--ease) forwards;
}
@keyframes draw { to { stroke-dashoffset: 0; } }
```

This is a classic SVG trick. The tick's line is turned into a "dashed line" with one dash 30 units long, then that dash is pushed fully out of view (`dashoffset: 30`). Animating the offset to 0 slides the dash back in, so the tick looks like it's being **drawn by a pen**.

---

## 7. The JavaScript files, the behaviour

### 7.1 `config.js`: settings

[config.js](assets/js/config.js) holds settings that you might want to change, in one place.

```js
var servedByFastAPI = window.location.pathname.indexOf("/ui") === 0;

window.APP_CONFIG = Object.freeze({
    API_BASE_URL: servedByFastAPI ? "" : "http://127.0.0.1:8000",
    REQUEST_TIMEOUT_MS: 10000,
    FETCH_LIMIT: 1000,
    DEFAULT_PAGE_SIZE: 10,
    SEARCH_DEBOUNCE_MS: 250,
    THEME_STORAGE_KEY: "student-manager-theme"
});
```

| Setting | Meaning |
|---|---|
| `API_BASE_URL` | Where the API is. See below. |
| `REQUEST_TIMEOUT_MS` | Give up on a request after 10,000 milliseconds (10 seconds). |
| `FETCH_LIMIT` | Sent as `?limit=1000` to `GET /students`. The API's default is 100, so we ask for more. |
| `DEFAULT_PAGE_SIZE` | Rows per page when the page opens. |
| `SEARCH_DEBOUNCE_MS` | Wait 250ms after you stop typing before searching. See `debounce` below. |
| `THEME_STORAGE_KEY` | The name used to remember your light/dark choice. |

**How `API_BASE_URL` is chosen:**

- `window.location.pathname` is the part of the address after the host. At `http://127.0.0.1:8000/ui/` it is `/ui/`.
- If the path starts with `/ui`, the page came from FastAPI itself, so the API is on the **same address**. We use `""` (empty), and requests go to `/students`, which the browser completes to `http://127.0.0.1:8000/students`.
- Otherwise (Live Server, double-clicking the file), we use the full address `http://127.0.0.1:8000`.

`condition ? A : B` is the **ternary operator**: "if condition then A, else B".

`Object.freeze(...)` makes the settings **read-only**, so no other code can change them by accident.

### 7.2 `utils.js`: small helpers

[utils.js](assets/js/utils.js) contains small functions used in several places.

#### `escapeHtml(value)`: safety first

```js
escapeHtml: function (value) {
    return String(value == null ? "" : value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}
```

Imagine someone creates a student named `<img src=x onerror=alert('hacked')>`. If we put that name straight into the page's HTML, the browser would treat it as a **real image tag** and run the code. That's an **XSS attack**.

`escapeHtml` replaces the special characters with **HTML entities**: `<` becomes `&lt;`, which the browser **displays** as `<` but never treats as the start of a tag. So the name is shown as harmless text.

**Rule to remember:** any data that came from a user or the API is escaped before it goes into HTML. In this project, all such data goes through `escapeHtml` or jQuery's `.text()` (which escapes automatically).

`/</g` is a **regular expression** (a search pattern). The `g` at the end means "**g**lobal: replace every match, not only the first".

#### `initials(name)`

```js
"Asha Patil"  →  split into ["Asha", "Patil"]  →  first letters "A", "P"  →  "AP"
```

`.split(/\s+/)` splits on any spaces, `.slice(0, 2)` keeps at most 2 words, and `.map(...)` takes the first letter of each in capitals. Used for the avatar circles.

#### `hueFromString(text)`

Turns any text into a number from 0 to 359, always the same number for the same text. It goes through each character's code and mixes them together (this is called a **hash**). The result is used as the colour `--hue`, so "Asha Patil" always has the same avatar colour.

#### `debounce(fn, wait)`

```js
debounce: function (fn, wait) {
    var timer;
    return function () {
        var ctx = this, args = arguments;
        clearTimeout(timer);
        timer = setTimeout(function () { fn.apply(ctx, args); }, wait);
    };
}
```

When you type "Priya" in the search box, the `input` event fires **5 times** (P, r, i, y, a). Searching 5 times is wasteful.

`debounce` waits until you **stop typing for 250ms**, then runs **once**. How: every key press cancels the previous timer (`clearTimeout`) and starts a new one (`setTimeout`). Only the last timer is left to finish.

It **returns a new function**. That's why in `app.js` we write `.on("input", Utils.debounce(function () {...}, 250))`.

#### `isValidEmail(email)`

```js
/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)
```

A regular expression for a basic email check. In simple words: "some characters (no spaces or @), then `@`, then some characters, then a dot, then at least 2 characters". `asha@example.com` passes; `asha@` and `asha example.com` fail. The server does a stricter check later anyway.

### 7.3 `api.js`: talking to the API

[api.js](assets/js/api.js) is the **only** file that talks to the server. If the API ever changes, this is the only file you need to update.

#### The `request()` helper

```js
function request(method, path, data) {
    var options = {
        url: cfg.API_BASE_URL + path,
        method: method,
        dataType: "json",
        timeout: cfg.REQUEST_TIMEOUT_MS,
        headers: { Accept: "application/json" }
    };

    if (data !== undefined) {
        options.contentType = "application/json; charset=utf-8";
        options.data = JSON.stringify(data);
    }

    if (method === "DELETE") {
        options.dataType = "text";
    }

    return $.ajax(options);
}
```

Every API call goes through this one function, so they all behave the same way. The options it passes to `$.ajax`:

| Option | Meaning |
|---|---|
| `url` | The full address, for example `"" + "/students/3"`. |
| `method` | `GET`, `POST`, `PUT`, `PATCH` or `DELETE`. |
| `dataType: "json"` | "The answer will be JSON; please turn it into a JavaScript object for me." |
| `timeout` | Give up after 10 seconds. |
| `headers: { Accept: ... }` | Tells the server "I want JSON back". |
| `contentType` | Tells the server "the data I'm sending is JSON". **FastAPI needs this**, or it won't read the body. |
| `data` | The request body. `JSON.stringify(...)` turns a JavaScript object into JSON text: `{name: "Asha"}` becomes `'{"name":"Asha"}'`. |

**Why the special case for `DELETE`?** `DELETE /students/{id}` returns status **204 No Content**, which means an **empty** body. If jQuery tried to read an empty body as JSON, it would fail and report an error even though the delete worked. Asking for `"text"` avoids that.

`$.ajax(...)` returns a **promise** (see [section 1](#1-words-you-need-to-know)), and `request` passes it back to whoever called it.

#### The `StudentAPI` object

Each method maps to one endpoint in `main.py`:

```js
var StudentAPI = {
    list:    function (skip, limit) { return request("GET",    "/students?" + $.param({skip: ..., limit: ...})); },
    get:     function (id)          { return request("GET",    "/students/" + encodeURIComponent(id)); },
    create:  function (student)     { return request("POST",   "/students", student); },
    replace: function (id, student) { return request("PUT",    "/students/" + encodeURIComponent(id), student); },
    patch:   function (id, changes) { return request("PATCH",  "/students/" + encodeURIComponent(id), changes); },
    remove:  function (id)          { return request("DELETE", "/students/" + encodeURIComponent(id)); },
    ping:    function ()            { return request("GET",    "/"); }
};
```

| JS method | HTTP request | Python function in `main.py` | Used in the page? |
|---|---|---|---|
| `StudentAPI.list()` | `GET /students?skip=0&limit=1000` | `list_students` | Yes: loading the table |
| `StudentAPI.get(3)` | `GET /students/3` | `get_student` | Yes: the View modal |
| `StudentAPI.create({...})` | `POST /students` | `create_student` | Yes: Add form |
| `StudentAPI.patch(3, {...})` | `PATCH /students/3` | `update_student` | Yes: Edit form |
| `StudentAPI.replace(3, {...})` | `PUT /students/3` | `replace_student` | No, available for you to try |
| `StudentAPI.remove(3)` | `DELETE /students/3` | `delete_student` | Yes: Delete button |
| `StudentAPI.ping()` | `GET /` | `root` | No, available for you to try |

- `$.param({skip: 0, limit: 1000})` builds the query string `skip=0&limit=1000`.
- `encodeURIComponent(id)` makes a value safe to put inside a URL (spaces and special characters are encoded).

**Example: how another file uses it:**

```js
StudentAPI.create({ name: "Asha", age: 20, email: "asha@example.com", course: "Physics" })
    .done(function (saved) { console.log("Created with id", saved.id); })
    .fail(function (xhr)   { console.log("Failed with status", xhr.status); });
```

#### `parseError()`: turning errors into friendly messages

When a request fails, jQuery gives us an object called **`jqXHR`** that holds details about the failed request: `jqXHR.status` (the status code) and `jqXHR.responseJSON` (the error body, already turned into an object).

FastAPI sends errors in two shapes:

```json
// 404 Not Found: detail is a string
{ "detail": "Student 9 not found" }

// 422 Validation error: detail is a list
{ "detail": [
    { "loc": ["body", "email"], "msg": "value is not a valid email address", ... },
    { "loc": ["body", "age"],   "msg": "Input should be greater than or equal to 1", ... }
] }
```

`parseError` handles every case and always returns the same simple shape:

```js
{ status: 422, title: "Validation error", message: "<ul><li>...</li></ul>", fieldErrors: { email: "...", age: "..." } }
```

What it checks, in order:

1. **`textStatus === "timeout"`**: the server took longer than 10 seconds. Message: "Request timed out".
2. **`jqXHR.status === 0`**: no answer at all. This almost always means **the server isn't running** (or CORS blocked it). Message: "Cannot reach the API" plus the command to start it.
3. **`detail` is a list (422)**: for each error, `err.loc[err.loc.length - 1]` takes the **last** item of `loc` (`"email"`), which is the field name. It builds a bullet list for the pop-up and fills `fieldErrors`, so `app.js` can put each message **under the right box**.
4. **`detail` is text (404 and others)**: shows that text.
5. **Anything else**: shows the status code and status text.

At the end, the file shares both pieces:

```js
window.StudentAPI = StudentAPI;
window.parseApiError = parseError;
```

### 7.4 `modal.js`: modal windows and alert pop-ups

[modal.js](assets/js/modal.js) makes two tools:

- **`Modal`**: opens and closes any modal window.
- **`Dialog`**: shows alert and confirm pop-ups, built on top of `Modal`.

#### `Modal.open(selector, options)`

```js
Modal.open("#studentModal");                    // normal modal
Modal.open("#dialogModal", { static: true });   // can't be closed by clicking outside
```

Step by step:

1. **Find the modal** with `$(selector)`. If it isn't found or is already open, stop.
2. **Remember settings** with `$m.data("static", ...)`. jQuery's `.data()` stores any value on an element for later.
3. **Remember which element had focus** (`document.activeElement`, for example the button you clicked). When the modal closes, focus goes back there, so keyboard users don't lose their place.
4. **Un-hide it**: `$m.prop("hidden", false)`.
5. **Force a reflow**: `$m[0].offsetWidth;`. This odd-looking line makes the browser actually draw the modal in its hidden "before" state. Without it, the browser would skip straight to the "after" state and **the opening animation wouldn't play**.
6. **Add the class `show`**, which starts the CSS animation (see [6.5](#65-modalcss-pop-ups)).
7. **Add it to the `stack`** (the list of open modals) and add `modal-open` to `<body>` to stop the page scrolling.
8. **Move focus inside** after 50ms, to the first input box (or the main button if there are no boxes). This lets you start typing straight away.

#### `Modal.close(selector)`

1. Remove the class `show`, so the closing animation plays.
2. Remove it from the `stack`. If no modals are left open, let the page scroll again.
3. **Wait 240ms** (`ANIMATION_MS`) for the animation to finish, **then** set `hidden` back on, and give focus back to the element that opened it.

#### `Modal.top()`

Returns the modal that is on top (the last one in `stack`). Used by the keyboard handler.

#### Global events: closing with clicks and keys

```js
$(document).on("click", ".modal [data-dismiss='modal']", function () { ... });
```

This is **event delegation**: instead of attaching a click handler to every × button and Cancel button, we attach **one** handler to the whole `document` and say "only react if the click was on something matching `.modal [data-dismiss='modal']`". It works even for elements added later.

Inside: if the clicked thing is the backdrop and the modal is `static`, shake it; otherwise close it.

```js
$(document).on("keydown", function (e) { ... });
```

On every key press, if a modal is open:

- **Escape:**
  - In the alert dialog: acts as **Cancel** on a confirm, or **OK** on a plain alert.
  - In a static modal: shake.
  - Otherwise: close.
- **Tab: focus trap.** Normally Tab moves through every link and button on the page, including the ones **behind** the modal, which is confusing. This code finds all focusable elements inside the modal. If you're on the **last** one and press Tab, it jumps to the **first** (and Shift+Tab does the reverse). Your focus stays **trapped** inside the modal. This is an important **accessibility** feature.

#### `Dialog`: the alerts

```js
Dialog.success("Student created", "Asha was added.");
Dialog.error("Not found", "Student 9 not found");
Dialog.warning(title, message);
Dialog.info(title, message);

Dialog.confirm({
    title: "Delete student?",
    message: "This cannot be undone.",
    okText: "Delete",
    danger: true                 // makes the OK button red
}).then(function (yes) {
    if (yes) { /* user clicked Delete */ }
    else     { /* user clicked Cancel */ }
});
```

**How `render(opts)` fills the shared `#dialogModal`:**

1. Picks the icon SVG from the `ICONS` list and sets the class `alert-icon success` (or `error`...) so the CSS colours it.
2. Sets the title with `.text()` (safe: text is never treated as HTML).
3. Sets the message with `.html()`, because some messages contain formatting such as `<strong>` or a bullet list. This is safe only because **our own code** builds those messages, and it escapes every piece of user data with `escapeHtml` first.
4. Sets the button texts. Makes the OK button red if `danger: true`. Hides Cancel for plain alerts.
5. Attaches click handlers to OK (`finish(true)`) and Cancel (`finish(false)`).
6. Opens the modal as `static`.
7. Returns a promise that is **resolved** (finished) with `true` or `false` when a button is clicked.

**`.on("click.dlg", ...)` and `.off(".dlg")`:** the `.dlg` part is a **namespace**, a label for our handlers. Because the same buttons are reused for every dialog, we must **remove** the old handlers (`.off(".dlg")`) before adding new ones. Otherwise one click would run the handlers from every previous dialog.

**The queue: why two alerts never overlap.** Imagine two errors happen at almost the same moment. Without care, the second would overwrite the first before you could read it.

```js
var queue = $.Deferred().resolve().promise();

function show(opts) {
    var next = $.Deferred();
    queue = queue.then(function () {
        return render(opts).then(function (result) { next.resolve(result); });
    });
    return next.promise();
}
```

`queue` is a chain of promises. Each new dialog is added to the **end** of the chain with `.then(...)`, so it only starts after the previous dialog has been closed. Like people waiting in a line.

`$.Deferred()` is jQuery's way of making your **own** promise. You decide when it's finished by calling `.resolve(value)`.

### 7.5 `app.js`: the main logic

[app.js](assets/js/app.js) controls the page. It's the biggest file, so it's split into clear parts.

#### Part 1: State

```js
var state = {
    students: [],       // all students from the API
    search: "",         // what's in the search box
    course: "",         // selected course filter ("" = all)
    sortKey: "id",      // which column to sort by
    sortDir: "asc",     // "asc" = A→Z / 1→9, "desc" = the reverse
    page: 1,            // current page number
    pageSize: 10,       // rows per page
    editing: null       // the student being edited, or null when adding
};
```

**State** is "everything the page currently remembers". The idea behind the whole file:

> **When something changes → update `state` → call `render()` → the table is rebuilt from `state`.**

So the search box, the filter, the sort headings and the page buttons **never touch the table directly**. They change `state` and call `render()`. This keeps things simple and avoids bugs where the table and the data disagree.

Notice that searching, filtering, sorting and paging happen **in the browser**, on the list we already downloaded. They don't send a new request to the API. Only adding, editing, deleting and pressing Reload talk to the server.

#### Part 2: Loading data, `loadStudents(highlightId)`

```js
function loadStudents(highlightId) {
    $loader.prop("hidden", false);              // show spinner
    $body.empty();                              // clear old rows

    return StudentAPI.list(0, cfg.FETCH_LIMIT)
        .always(function () { $loader.prop("hidden", true); })   // hide spinner
        .done(function (data) {
            state.students = data || [];
            setApiStatus(true);                 // green "API online"
            refreshCourseOptions();             // fill the course dropdown
            renderStats();                      // update the 4 cards
            render(highlightId);                // draw the table
        })
        .fail(function (xhr, textStatus) {
            setApiStatus(false);                // red "API offline"
            state.students = [];
            render();
            var err = parseApiError(xhr, textStatus);
            Dialog.error(err.title, err.message);
        });
}
```

`.always` is attached **first** on purpose: jQuery runs the handlers in the order you add them, so the spinner is hidden **before** `render()` decides whether to show "No students found".

`highlightId` is optional. After saving a student, we pass its id so that row flashes green.

#### Part 3: Filter + sort, `getVisibleStudents()`

```js
var list = state.students.filter(function (s) {
    var matchesSearch = !q || s.name.toLowerCase().indexOf(q) > -1 || ...;
    var matchesCourse = !state.course || s.course === state.course;
    return matchesSearch && matchesCourse;
});
```

- `.filter(fn)` keeps only the items for which `fn` returns `true`.
- `.toLowerCase()` on both sides makes the search **case-insensitive** ("asha" finds "Asha").
- `.indexOf(q) > -1` means "the text contains `q` somewhere". (`indexOf` returns `-1` when not found.)
- `!q ||` means "if the search box is empty, everything matches".

```js
list.sort(function (a, b) {
    var x = a[key], y = b[key];
    if (typeof x === "string") return x.localeCompare(y) * dir;
    return (x - y) * dir;
});
```

`.sort` needs a function that returns a **negative** number if `a` comes first, a **positive** number if `b` comes first, or **0** if they're equal.

- Text is compared with `localeCompare`, which sorts alphabetically the way people expect.
- Numbers are compared with `x - y`.
- Multiplying by `dir` (`1` or `-1`) flips the order for descending.
- `a[key]` reads a property by name: if `key` is `"age"`, `a[key]` is the same as `a.age`.

#### Part 4: Drawing, `render()`

```js
var totalPages = Math.max(1, Math.ceil(list.length / state.pageSize));
var start = (state.page - 1) * state.pageSize;
var pageItems = list.slice(start, start + state.pageSize);
```

**Pagination maths**, with 23 students and 10 per page:
- `Math.ceil(23 / 10)` = `Math.ceil(2.3)` = **3 pages** (`ceil` rounds **up**).
- On page 2: `start = (2 - 1) * 10 = 10`, and `.slice(10, 20)` gives students 11 to 20 (counting from 1).

```js
$body.html(pageItems.map(rowHtml).join(""));
```

`.map(rowHtml)` turns each student into an HTML string for one `<tr>`, `.join("")` glues them together, and `.html(...)` puts the result in the table body **in one go**, which is fast.

Then `render` updates "Showing 11–20 of 23", rebuilds the page buttons, and moves the sort arrow to the right heading.

**`rowHtml(s, index)`** builds one row. Notice how every piece of student data goes through `e(...)`, which is `Utils.escapeHtml`:

```js
'<td>' + e(s.email) + '</td>'
```

The row stores its student's id in an attribute: `<tr data-id="3">`. When a button in that row is clicked, we read this id to know **which student** the button belongs to.

**`renderPagination(totalPages)`** builds the buttons `‹ 1 … 4 5 6 … 12 ›`. It always shows the first page, the last page, and the pages right next to the current one, and puts `…` in the gaps, so you never get 50 buttons in a row.

#### Part 5: Stats, `renderStats()`

Goes through all students once, adding up ages and counting students per course:

```js
counts[s.course] = (counts[s.course] || 0) + 1;
```

This line means "take the current count for this course (or 0 if this is the first one), add 1". After the loop, `counts` might be `{ "Physics": 3, "Mathematics": 5 }`. Sorting the course names by their count gives the most popular.

**`animateNumber`** makes the numbers count up (for example 0 → 23). It uses a jQuery trick: `$({ n: from }).animate({ n: target }, ...)` animates a plain number instead of a CSS property, and on every `step` writes the rounded value into the card.

#### Part 6: The Add/Edit form

**`openForm(student)`**
- `openForm(null)` = **Add**: clears the boxes, title "Add Student", button "Save".
- `openForm(student)` = **Edit**: fills the boxes with that student's values, title "Edit Student #3", button "Update".

Both remember the choice in `state.editing`, then call `Modal.open("#studentModal")`.

**`readForm()`** reads the four boxes into an object:

```js
{ name: "Asha Patil", age: 20, email: "asha@example.com", course: "Physics" }
```

- `$.trim(...)` removes spaces at the start and end.
- `Number(...)` turns the text `"20"` into the number `20`. An empty age becomes `null`.

**`validate(data)`** checks the **same rules** as the Pydantic model in `model.py`:

| Field | Rule in `model.py` | Check in `validate()` |
|---|---|---|
| name | `min_length=1` | must not be empty |
| age | `ge=1, le=120` | whole number from 1 to 120 |
| email | `EmailStr` | `Utils.isValidEmail` |
| course | required | must not be empty |

It returns an object of error messages, such as `{ age: "Age must be a whole number from 1 to 120." }`. An empty object means "all good".

> **Why check in the browser AND on the server?** The browser check gives **instant** feedback without a round trip to the server. But a browser check can be bypassed (anyone can send requests with other tools), so the **server must always check too**. Never trust only the frontend.

**`showFormErrors(errors)`** goes through each error, adds the red `is-invalid` class to the matching box (found by `[name='age']`), writes the message in the `.field-error` under it, and moves the cursor to the first wrong box.

**`onSubmitForm(e)`**, what happens when you press Save/Update:

```js
e.preventDefault();
```

By default, submitting a `<form>` **reloads the whole page**. `preventDefault()` stops that, so we can send the data with AJAX instead.

Then:

1. Read and validate the form. If there are errors, show them and **stop** (no request is sent).
2. **Adding:** `StudentAPI.create(data)`, a `POST`.
3. **Editing:** compare each field with the original student, and put **only the changed fields** into `changes`:

   ```js
   ["name", "age", "email", "course"].forEach(function (k) {
       if (data[k] !== editing[k]) changes[k] = data[k];
   });
   ```

   If you only changed the age, we send `PATCH /students/3` with just `{"age": 21}`. That's exactly what PATCH is for. If **nothing** changed, no request is sent and an info pop-up says so.

4. `setSaving(true)` disables the button and shows its spinner, so the user can't click twice and create two students.
5. **On success (`.done`):** close the form, reload the table with the saved student highlighted, show a success pop-up.
6. **On failure (`.fail`):** parse the error. If the server named specific fields (422), mark those boxes red too. Then show an error pop-up. The form **stays open** so the user can fix it.
7. **Either way (`.always`):** re-enable the button.

#### Part 7: View and delete

**`openView(id)`** fetches a **fresh** copy of the student with `GET /students/{id}` (in case someone else changed it), fills the details modal with `.text(...)`, and opens it. If the student no longer exists (404), it shows an error and reloads the table.

`.css("--hue", hue)` sets a CSS variable from JavaScript, so the avatar gets the right colour.

**`confirmDelete(student)`**

```js
Dialog.confirm({ title: "Delete student?", ..., okText: "Delete", danger: true })
    .then(function (yes) {
        if (!yes) return;                      // user clicked Cancel: do nothing
        StudentAPI.remove(student.id)
            .done(function () {
                $row.fadeOut(250, function () { loadStudents(); });
                Dialog.success("Deleted", ...);
            })
            .fail(...);
    });
```

Deleting is permanent, so we **always ask first**. Only if the user clicks the red **Delete** button is the `DELETE` request sent. The row fades out, then the table reloads.

#### Part 8: Theme

```js
function initTheme() {
    var saved = localStorage.getItem(cfg.THEME_STORAGE_KEY);
    var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    applyTheme(saved || (prefersDark ? "dark" : "light"));
}

function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(cfg.THEME_STORAGE_KEY, theme);
}
```

- **`localStorage`** is a small storage space in the browser that **survives page reloads**. We save `"dark"` or `"light"` there, so your choice is remembered next time.
- If nothing is saved yet, `matchMedia(...)` asks "is the computer in dark mode?" and uses that.
- `document.documentElement` is the `<html>` tag. Setting `data-theme="dark"` on it switches all the CSS variables (see [6.1](#61-variablescss-design-tokens)).
- Both are wrapped in `try { ... } catch (e) { ... }` in the real code, because some browsers (for example in private mode) block `localStorage`. If it fails, the page still works, it just won't remember the choice.

#### Part 9: Wiring up events, `bindEvents()`

This function connects every button and box to its code:

| What you do | Handler | What it does |
|---|---|---|
| Click **Add Student** | `#btnAddStudent` click | `openForm(null)` |
| Click **Reload** | `#btnRefresh` click | `loadStudents()` |
| Press **Save/Update** | `#studentForm` submit | `onSubmitForm` |
| Type in a form box | form `input` | removes that box's red error |
| Click 👁 / ✏️ / 🗑 in a row | `$body.on("click", "[data-action]")` | view / edit / delete |
| Double-click a row | `$body.on("dblclick", "tr")` | `openView(id)` |
| Click **Edit** in the details modal | `#btnViewEdit` click | close details, open edit form |
| Type in the search box | `#searchInput` input (debounced) | `state.search = ...; render()` |
| Choose a course | `#courseFilter` change | `state.course = ...; render()` |
| Choose rows per page | `#pageSize` change | `state.pageSize = ...; render()` |
| Click a page button | `#pagination` click | `state.page = ...; render()` |
| Click a column heading | `.sortable` click | flip sort direction; `render()` |
| Click the sun/moon | `#themeToggle` click | switch the theme |
| Press **/** | document keydown | jump to the search box |
| Press **n** | document keydown | open the Add form |

**Why `$body.on("click", "[data-action]", ...)` instead of `$("[data-action]").on("click", ...)`?**

The table rows are **deleted and rebuilt** every time `render()` runs. If we attached handlers to the buttons directly, those handlers would be thrown away with the old rows, and the new buttons would do nothing.

With **event delegation**, the handler lives on `<tbody>`, which is never replaced. When you click a button inside it, the click "**bubbles up**" to `<tbody>`, and jQuery checks whether it came from something matching `[data-action]`. This works for rows that didn't even exist when the handler was attached.

Inside the handler:

```js
var id = $(this).closest("tr").data("id");     // from the button, go up to its row, read data-id
var action = $(this).data("action");            // "view", "edit" or "delete"
```

`this` is the button that was clicked. `.closest("tr")` walks **up** from the button to its row.

The **keyboard shortcuts** are ignored while a modal is open or while you're typing in a box. Otherwise typing the letter "n" into the Name box would open a new form!

#### Part 10: Start-up

```js
$(function () {
    $body = $("#studentsBody");
    ...
    initTheme();
    bindEvents();
    loadStudents();
});
```

`$(function () { ... })` is jQuery's **"document ready"**: "run this once the HTML has been fully read". It:

1. Finds the elements we use often and saves them in variables (so we don't search the page every time).
2. Applies the saved theme.
3. Connects all the events.
4. Loads the students from the API.

---

## 8. What happens when you click: step-by-step walkthroughs

### 8.1 Opening the page

1. Browser downloads `index.html`, the CSS, jQuery and our JS files.
2. The table shows a spinner ("Loading students…").
3. `app.js` calls `loadStudents()`, which sends `GET /students?skip=0&limit=1000`.
4. FastAPI's `list_students()` returns a JSON list.
5. `.done` runs: the status pill turns green, the course dropdown fills up, the 4 cards count up, and the rows slide in one after another.

### 8.2 Adding a student

1. Click **Add Student**. `openForm(null)` clears the form and `Modal.open` slides it in. The cursor is in the Name box.
2. Fill in the boxes and press **Save** (or Enter).
3. `onSubmitForm` stops the page reload and runs `validate()`.
   - **Something wrong** (for example age 200): the Age box turns red with "Age must be a whole number from 1 to 120." **No request is sent.**
4. All good: `StudentAPI.create(data)` sends:

   ```
   POST /students
   Content-Type: application/json

   {"name":"Neha Joshi","age":21,"email":"neha@example.com","course":"Physics"}
   ```

5. The Save button shows a spinner and is disabled.
6. FastAPI validates the body, gives it a new id, and answers **201 Created** with the new student.
7. `.done`: the form closes, the table reloads and the new row flashes green, and a ✓ pop-up says "Student created".

### 8.3 Editing a student

1. Click ✏️ on a row. `openForm(student)` fills the form with that student's current details.
2. Change only the age from 20 to 21 and press **Update**.
3. `onSubmitForm` compares old and new values. Only `age` changed, so it sends:

   ```
   PATCH /students/3
   {"age":21}
   ```

4. FastAPI's `update_student()` changes only the age and returns the full updated student.
5. The form closes, the row flashes, and a ✓ pop-up says "Student updated".

### 8.4 Viewing a student

1. Click 👁 on a row (or double-click the row).
2. `openView(3)` sends `GET /students/3`.
3. The details modal opens with the avatar, name, course badge, ID, age and email.
4. Clicking **Edit** there closes this modal and, after its closing animation, opens the edit form.

### 8.5 Deleting a student

1. Click 🗑 on a row.
2. A ⚠ pop-up asks "Delete student? This will permanently remove **Asha Patil** (ID #1)." with a red **Delete** button.
3. **Cancel**, Esc: nothing happens.
4. **Delete**: `DELETE /students/1` is sent. FastAPI answers **204 No Content**.
5. The row fades out, the table reloads, and a ✓ pop-up says "Deleted".

### 8.6 When the server finds an error (422)

Suppose you bypass the browser check and send `"email": "not-an-email"`. FastAPI answers:

```json
{ "detail": [ { "loc": ["body", "email"], "msg": "value is not a valid email address: ..." } ] }
```

`parseApiError` turns this into `fieldErrors: { email: "value is not a valid email..." }`. The Email box turns red with that message, and an ✕ pop-up titled "Validation error" lists the problem. The form stays open.

### 8.7 When the server isn't running

`$.ajax` gets no answer at all, so `jqXHR.status` is `0`. The pill turns red ("API offline") and an ✕ pop-up says "Cannot reach the API. Make sure the FastAPI server is running: `uvicorn main:app --reload`".

---

## 9. What was changed in `main.py`

Two things were added near the top of [main.py](../main.py), right after `app = FastAPI(...)`.

### 9.1 Serving the frontend

```python
from fastapi.staticfiles import StaticFiles

FRONTEND_DIR = Path(__file__).parent / "frontend"
app.mount("/ui", StaticFiles(directory=FRONTEND_DIR, html=True), name="frontend")
```

- `Path(__file__).parent` is the folder that `main.py` is in, so `FRONTEND_DIR` is the `frontend` folder next to it. This works no matter which folder you start uvicorn from.
- `app.mount("/ui", ...)` means: "any address starting with `/ui` should be answered by **sending a file from the frontend folder**". For example, `/ui/assets/css/base.css` sends `frontend/assets/css/base.css`.
- `html=True` means that asking for the folder itself (`/ui/`) sends `index.html`.
- If you type `/ui` without the final slash, FastAPI redirects you to `/ui/`.

### 9.2 Allowing CORS

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
```

- **Middleware** is code that runs on **every** request and response, before and after your endpoint functions.
- `CORSMiddleware` adds headers to each response that tell the browser "pages from other origins may read this".
- `["*"]` means "**any** origin, any method, any header".

**Is CORS needed when using `/ui/`?** No: the page and API share the same origin. It's only needed for Way 2 in [section 2](#way-2-open-it-some-other-way) (Live Server or opening the file directly).

> ⚠️ **Note for later:** `allow_origins=["*"]` is fine while learning, but for a real website you should list only your own site's address, for example `allow_origins=["https://my-school-app.com"]`. Otherwise any website could call your API from a visitor's browser.

---

## 10. Watching the AJAX calls in your browser

Seeing the requests with your own eyes is the best way to understand AJAX.

1. Open the page and press **F12** (or right-click → **Inspect**). This opens the **Developer Tools**.
2. Click the **Network** tab.
3. Click the **Fetch/XHR** filter button. (XHR is the technology behind `$.ajax`.)
4. Now use the page: add, edit or delete a student.

Each API call appears as a line. Click one to see:

- **Headers:** the method, the URL and the **status code** (200, 201, 204, 404, 422...).
- **Payload:** the JSON the page **sent** (for POST and PATCH).
- **Response / Preview:** the JSON the API **sent back**.

The **Console** tab shows JavaScript errors in red. If a button does nothing, look there first. You can also type commands into the Console to try things out, for example:

```js
StudentAPI.list().done(function (data) { console.table(data); });
Dialog.success("Hello", "This is a test pop-up");
Modal.open("#viewModal");
```

`console.table(data)` prints the list of students as a neat table.

---

## 11. Common problems and how to fix them

| What you see | Likely reason | Fix |
|---|---|---|
| "Cannot reach the API" pop-up, red pill | The server isn't running | Run `uvicorn main:app --reload` in the `fastapi-app` folder, then click Reload. |
| `ModuleNotFoundError: No module named 'email_validator'` when starting the server | You're not using the project's virtual environment | Run `venv\Scripts\activate` first, or `pip install "fastapi[standard]" email-validator`. |
| `{"detail":"Not Found"}` at `/ui/` | `main.py` doesn't have the `app.mount(...)` line, or the server was started from an old copy | Check [section 9.1](#91-serving-the-frontend) and restart the server. |
| Page has no colours or layout | The CSS files didn't load | Open DevTools → Network and look for red `.css` lines. Check that the `href` paths match the folder names. |
| Nothing happens when clicking buttons | A JavaScript error, or jQuery didn't load (no internet?) | Open DevTools → **Console** and read the red error. `$ is not defined` means jQuery didn't load. |
| Works at `/ui/` but not with Live Server | CORS is missing, or the API isn't on port 8000 | Check [section 9.2](#92-allowing-cors), and that `API_BASE_URL` in `config.js` matches your server address. |
| Your new students vanished | The API keeps students **in memory only** | This is expected: restarting the server reloads `students.json`. Saving to a file or database is a good next exercise. |
| Changes to CSS/JS don't show up | The browser is using an old saved copy (cache) | Press **Ctrl + F5** to reload without the cache. |

---

## 12. jQuery cheat sheet (only what this project uses)

**Finding elements**

| Code | Meaning |
|---|---|
| `$("#searchInput")` | the element with this id |
| `$(".sortable")` | all elements with this class |
| `$m.find(".modal-body")` | search **inside** `$m` |
| `$(this).closest("tr")` | go **up** to the nearest `<tr>` |
| `$f.first()` / `.last()` | first / last of the found elements |
| `.filter(":visible")` | keep only the visible ones |
| `$m.is("#dialogModal")` | `true` if `$m` matches the selector |

**Reading and changing elements**

| Code | Meaning |
|---|---|
| `.text("Hi")` / `.text()` | set / get plain text (safe: escapes HTML) |
| `.html("<b>Hi</b>")` | set HTML (only use with trusted or escaped content) |
| `.val()` / `.val("x")` | get / set the value of an input or select |
| `.addClass("show")` / `.removeClass("show")` / `.toggleClass("x", flag)` | change classes |
| `.hasClass("show")` | `true` if it has the class |
| `.attr("title", "x")` / `.removeAttr("aria-invalid")` | set / remove an HTML attribute |
| `.prop("hidden", true)` / `.prop("disabled", false)` | set an element property (on/off settings) |
| `.data("id")` | read a `data-id="..."` attribute |
| `.data("student", s)` | store any value on the element |
| `.css("--hue", 120)` | set a CSS property or CSS variable |
| `.empty()` | remove everything inside |
| `.append(el)` | add something at the end inside |
| `.trigger("focus")` / `.trigger("click")` | act as if the user focused / clicked |

**Events**

| Code | Meaning |
|---|---|
| `$(function () { ... })` | run when the page is ready |
| `.on("click", fn)` | run `fn` on click |
| `.on("click", "[data-action]", fn)` | **delegation**: run `fn` for clicks on matching children, even future ones |
| `.on("click.dlg", fn)` / `.off(".dlg")` | add / remove handlers under a namespace |
| `e.preventDefault()` | stop the browser's default action (form submit, key action) |

**AJAX and promises**

| Code | Meaning |
|---|---|
| `$.ajax({...})` | send a request; returns a promise |
| `.done(fn)` / `.fail(fn)` / `.always(fn)` | success / failure / either way |
| `.then(fn)` | run `fn` when finished; can be chained |
| `$.Deferred()` | make your own promise; finish it with `.resolve(value)` |
| `$.param({a: 1, b: 2})` | build `"a=1&b=2"` |

**Effects and helpers**

| Code | Meaning |
|---|---|
| `.fadeOut(250, fn)` | fade out over 250ms, then run `fn` |
| `$({n: 0}).animate({n: 10}, {...})` | animate a number |
| `$.trim(" hi ")` | `"hi"` |
| `$.isEmptyObject({})` | `true` |
| `$.extend({}, a, b)` | merge objects (`b` wins on clashes) |
| `$.each(obj, fn)` | loop over an object's keys and values |

---

## 13. Practice exercises

Start with the easy ones. After each change, save the file and press **Ctrl + F5** in the browser.

**Easy**

1. **Change the main colour.** In `variables.css`, change `--c-primary` to `#e11d48` (pink-red). Watch every button, link and highlight change.
2. **Change the default page size** to 5. In `index.html`, move the word `selected` from the `10 / page` option to the `5 / page` option. (At start-up, `app.js` reads the page size from this dropdown, so that's what decides it.)
3. **Change a message.** In `app.js`, make the success pop-up after deleting say "Goodbye, *name*!".
4. **Make modals open slower.** In `variables.css`, set `--dur: 600ms`. Then also set `ANIMATION_MS` in `modal.js` to `600` so closing waits long enough.

**Medium**

5. **Add a "Clear search" button** next to the search box that empties it and calls `render()`. (Hint: `$("#searchInput").val("")` and `state.search = ""`.)
6. **Search by age too.** In `getVisibleStudents()`, add `String(s.age) === q` to `matchesSearch`.
7. **Add a 5th stat card** showing the **youngest** student's age. (Hint: `Math.min.apply(null, list.map(function (s) { return s.age; }))`.)
8. **Use PUT instead of PATCH** when editing: call `StudentAPI.replace(editing.id, data)`. In DevTools → Network, compare what's sent each way.

**Harder**

9. **Add a new field** `phone` to the student. You'll need to change `model.py`, `students.json`, the form in `index.html`, `readForm()` and `validate()` in `app.js`, and the table and details modal.
10. **Server-side search.** Add a `search` query parameter to `GET /students` in `main.py`, then change `loadStudents` so the search box sends a request instead of filtering in the browser.
11. **Export to CSV.** Add a button that turns `getVisibleStudents()` into CSV text and downloads it. (Hint: look up `Blob` and `URL.createObjectURL`.)
12. **Keep data after a restart.** Change `main.py` so every create, update and delete also writes `students_db` back to `students.json`.

---

Happy learning! If something breaks, open the browser's **Console** and **Network** tabs first. They will almost always tell you what went wrong.
