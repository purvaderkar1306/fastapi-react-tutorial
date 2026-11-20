# Frontend Code, Line by Line

This guide goes through the frontend code **line by line**. It explains what each line does and why it is there.

It's the companion to [README.md](README.md):

- **README.md** explains the *big picture*: what each file is for, how to run the page, and what happens when you click.
- **This file** explains the *code itself*: every HTML tag, every CSS rule, every JavaScript line, every button event, how the modal windows work, how jQuery AJAX works, and how the same code would look in **modern JavaScript (ES6)**.

You don't need to read it all in one go. Open a code file next to this guide and follow along.

---

## Contents

**Part A: Before you start**
1. [How to read this guide](#1-how-to-read-this-guide)
2. [ES5 vs ES6: which JavaScript is this code?](#2-es5-vs-es6-which-javascript-is-this-code)

**Part B: HTML**

3. [`index.html` line by line](#3-indexhtml-line-by-line)

**Part C: CSS**

4. [`variables.css` line by line](#4-variablescss-line-by-line)
5. [`base.css` line by line](#5-basecss-line-by-line)
6. [`layout.css` line by line](#6-layoutcss-line-by-line)
7. [`components.css` line by line](#7-componentscss-line-by-line)
8. [`modal.css` line by line](#8-modalcss-line-by-line)

**Part D: JavaScript**

9. [`config.js` line by line](#9-configjs-line-by-line)
10. [`utils.js` line by line](#10-utilsjs-line-by-line)
11. [`api.js` line by line (jQuery AJAX)](#11-apijs-line-by-line-jquery-ajax)
12. [`modal.js` line by line (modal windows and alerts)](#12-modaljs-line-by-line-modal-windows-and-alerts)
13. [`app.js` line by line](#13-appjs-line-by-line)

**Part E: Putting it together**

14. [Every button and its event, in one table](#14-every-button-and-its-event-in-one-table)
15. [The life of a modal window, millisecond by millisecond](#15-the-life-of-a-modal-window-millisecond-by-millisecond)
16. [The life of an AJAX request](#16-the-life-of-an-ajax-request)

**Part F: ES6**

17. [ES6 features explained with this project's code](#17-es6-features-explained-with-this-projects-code)
18. [Full ES6 version of `api.js`](#18-full-es6-version-of-apijs)
19. [ES6 traps when using jQuery](#19-es6-traps-when-using-jquery)

---

# Part A: Before you start

## 1. How to read this guide

- For **JavaScript** files, each explanation starts with the **line number**, so you can find it in VS Code. Press **Ctrl + G** and type the number to jump there.
- For **HTML and CSS**, code is shown in small pieces, and each piece is followed by an explanation of every line in it.
- When the same kind of line appears many times (for example, four stat cards that differ only by their text), it's explained **once**, and the guide tells you so.
- Blank lines and lines that only close a bracket (`}`, `});`, `</div>`) are mentioned only when they matter.
- Boxes marked **🆕 ES6** show how a line would be written in modern JavaScript.

**Comments** are notes for humans. The computer ignores them.

| Language | Comment style |
|---|---|
| HTML | `<!-- this is a comment -->` |
| CSS | `/* this is a comment */` |
| JavaScript | `// one line` or `/* several lines */` |

---

## 2. ES5 vs ES6: which JavaScript is this code?

JavaScript has versions:

- **ES5** (2009) is the "classic" style: `var`, `function () {}`, joining text with `+`.
- **ES6**, also called **ES2015**, added a lot of new, shorter syntax: `let`/`const`, arrow functions `() => {}`, template strings `` `Hello ${name}` ``, classes, modules, `Promise` and more. Later yearly versions (ES2016, ES2017...) added `async`/`await`, `?.` and others. People often call all of these "ES6+" or "modern JavaScript".

**This project's JavaScript is written mostly in ES5 style.** That's common in jQuery code, and it's a good way to learn the basics, because nothing is hidden by shortcuts. It does use a few newer built-in helpers, such as `Number.isInteger` (ES6).

Every browser in use today understands both styles, so the code works either way. To help you learn ES6, this guide:

- shows **🆕 ES6** versions next to the lines where ES6 would look different, and
- has a whole part ([Part F](#part-f-es6)) that explains each ES6 feature using this project's own code, plus a complete ES6 version of `api.js`.

---

# Part B: HTML

## 3. `index.html` line by line

File: [index.html](index.html)

### 3.1 The document start

```html
<!DOCTYPE html>
<html lang="en">
<head>
```

- **`<!DOCTYPE html>`**: tells the browser "this is a modern HTML5 page". Without it, browsers switch to an old "quirks mode" and some CSS behaves strangely. It must be the very first line.
- **`<html lang="en">`**: the root element. Everything else goes inside it. `lang="en"` says the page is in English, which helps screen readers pronounce words correctly and helps search engines.
- **`<head>`**: starts the head section. Things in the head are **settings** about the page, not visible content.

### 3.2 Meta tags and title

```html
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="Student management frontend for the FastAPI tutorial app">
<title>Student Manager</title>
```

- **`<meta charset="UTF-8">`**: the text encoding. UTF-8 can show every language's letters, symbols like `–` and `…`, and emoji. `<meta>` tags have no closing tag.
- **`<meta name="viewport" ...>`**:
  - `width=device-width` means "make the page as wide as the device's screen". Without this, phones pretend to be 980px wide and shrink everything.
  - `initial-scale=1.0` means "start with no zoom".
- **`<meta name="description" ...>`**: a short summary that search engines may show under the page title in results.
- **`<title>`**: the text on the browser tab and in bookmarks.

### 3.3 Icon, font and stylesheets

```html
<link rel="icon" type="image/svg+xml" href="assets/img/favicon.svg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

- **`<link rel="icon" ...>`**: the small picture on the browser tab (the "favicon"). `type="image/svg+xml"` says it's an SVG picture. `href` is the file's path.
- **`<link rel="preconnect" ...>`** (two lines): tell the browser "you will soon download from these servers, so start connecting **now**". This makes the font load a little faster. `crossorigin` is needed for font servers, because fonts are fetched with CORS rules.
- **The font link**:
  - `family=Inter` is the font name.
  - `wght@400;500;600;700` asks for four thicknesses: normal (400), medium (500), semi-bold (600), bold (700).
  - `display=swap` means "show the text straight away in a backup font, then swap to Inter when it has loaded", so the text is never invisible while waiting.

```html
<link rel="stylesheet" href="assets/css/variables.css">
<link rel="stylesheet" href="assets/css/base.css">
<link rel="stylesheet" href="assets/css/layout.css">
<link rel="stylesheet" href="assets/css/components.css">
<link rel="stylesheet" href="assets/css/modal.css">
</head>
```

- Each line loads one of our CSS files. `rel="stylesheet"` says "this is CSS".
- **The order matters.** When two rules are equally specific, the one **loaded later wins**. So `variables.css` goes first (it only defines values), and more specific files come after.
- **`</head>`** ends the head section.

### 3.4 The header

```html
<body>

<header class="app-header">
    <div class="container header-inner">
```

- **`<body>`**: everything visible on the page goes inside `<body>`.
- **`<header>`**: a **semantic** tag. It works like a `<div>`, but its name tells browsers and screen readers "this is the top bar of the page". Other semantic tags we use: `<main>`, `<section>`, `<article>`, `<nav>`, `<footer>`.
- **`class="app-header"`**: the CSS uses this name to style it (sticky, frosted glass).
- **`<div class="container header-inner">`**: a `<div>` is a plain box with no meaning, used only for layout. It has **two classes**: `container` (limits the width and centres it) and `header-inner` (puts the logo on the left and the buttons on the right).

```html
        <a class="brand" href="#">
            <img src="assets/img/favicon.svg" alt="" class="brand-logo">
            <span>Student<strong>Manager</strong></span>
        </a>
```

- **`<a ... href="#">`**: a link. `#` means "the top of this same page", so clicking the logo scrolls to the top.
- **`<img src=... alt="">`**: shows the logo picture. `alt` is the text read aloud by screen readers. It's **empty on purpose** here, because the words "StudentManager" right next to it already say the same thing, and reading it twice would be annoying.
- **`<span>`**: an inline box (it sits in the line of text, unlike `<div>`, which starts a new line).
- **`<strong>`**: important text, shown in bold. CSS also colours it purple.

```html
        <div class="header-actions">
            <span id="apiStatus" class="api-status" title="API connection status">
                <span class="dot"></span><span class="label">Checking API…</span>
            </span>
```

- **`header-actions`**: the box that holds the items on the right.
- **`id="apiStatus"`**: a unique name, so JavaScript can find it with `$("#apiStatus")`.
- **`title="..."`**: shows a tooltip when you hold the mouse over it.
- **`<span class="dot">`**: an empty span. CSS turns it into a coloured circle (yellow, green or red).
- **`<span class="label">`**: the text. JavaScript changes it to "API online" or "API offline".

```html
            <button id="themeToggle" class="btn btn-icon btn-ghost" type="button" aria-label="Toggle dark mode">
                <svg class="icon icon-sun" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="..."/></svg>
                <svg class="icon icon-moon" viewBox="0 0 24 24"><path d="..."/></svg>
            </button>
```

- **`<button>`**: a clickable button.
- **`type="button"`**: **important habit.** A button's default type is `submit`, which would submit a form if the button were inside one. `type="button"` means "a plain button that only does what JavaScript tells it".
- **Three classes**: `btn` (basic button look), `btn-icon` (square, for an icon only), `btn-ghost` (no background until hovered).
- **`aria-label="Toggle dark mode"`**: the button has no text, only a picture, so this tells screen readers what it does. **ARIA** attributes are for accessibility.
- **`<svg ... viewBox="0 0 24 24">`**: an inline vector picture. `viewBox` sets up a drawing area 24 units wide and 24 tall. Everything inside uses those units, and the picture is then scaled to whatever size CSS gives it.
  - **`<circle cx="12" cy="12" r="4"/>`**: a circle with its centre at (12, 12) and a radius of 4: the middle of the sun.
  - **`<path d="..."/>`**: a shape drawn with commands. In `d`, `M` means "move the pen to", `L` "draw a line to", `h`/`v` "draw a horizontal/vertical line", `a` "draw an arc", `z` "close the shape". Small letters are relative to the current position; capital letters are exact positions.
  - The `/>` at the end means the tag closes itself (it has nothing inside it).
- Both icons are in the button. CSS shows the **sun** in light mode and the **moon** in dark mode.

```html
            <a class="btn btn-ghost btn-sm hide-sm" href="/docs" target="_blank" rel="noopener">API Docs</a>
        </div>
    </div>
</header>
```

- **A link styled to look like a button** (`btn`). `btn-sm` makes it smaller. `hide-sm` hides it on phones.
- **`href="/docs"`**: the Swagger page of our API.
- **`target="_blank"`**: open in a **new tab**.
- **`rel="noopener"`**: a safety setting for new tabs. It stops the new page from being able to control our page through JavaScript.

### 3.5 Main area and page title

```html
<main class="container main">

    <section class="page-head">
        <div>
            <h1>Students</h1>
            <p class="muted">Create, view, update and delete students through the FastAPI endpoints.</p>
        </div>
```

- **`<main>`**: the main content of the page. There should be only one per page.
- **`<section>`**: a group of related content.
- **`<h1>`**: the most important heading. Headings go from `<h1>` (biggest) to `<h6>` (smallest). Use them in order: screen-reader users jump between headings to move around a page.
- **`<p>`**: a paragraph. `class="muted"` makes it grey.

```html
        <button id="btnAddStudent" class="btn btn-primary" type="button">
            <svg class="icon" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>
            Add Student
        </button>
    </section>
```

- **The Add Student button.** `btn-primary` gives it the purple gradient. `app.js` line 399 makes it open the form.
- **The "+" icon path**: `M12 5` move to (12, 5); `v14` draw down 14 units (the vertical line); `M5 12` move to (5, 12); `h14` draw right 14 units (the horizontal line).

### 3.6 Stat cards

```html
    <section class="stats-grid" aria-label="Summary">
        <article class="stat-card" style="--accent: var(--c-primary)">
            <span class="stat-label">Total students</span>
            <span class="stat-value" id="statTotal">–</span>
        </article>
        ...three more cards...
    </section>
```

- **`aria-label="Summary"`**: gives the section a name for screen readers.
- **`<article>`**: a self-contained piece of content (here, one card).
- **`style="--accent: var(--c-primary)"`**: an **inline style** that sets a CSS variable on this card only. The card CSS uses `var(--accent)` for its coloured strip, so each card can have a different colour with the same CSS.
- **`stat-label`** is the small grey caption; **`stat-value`** is the big number.
- **`id="statTotal"`**: `app.js` writes the number here. It starts as `–` (a dash) until the data has loaded.
- The other three cards are the same, with ids `statAvgAge`, `statCourses` and `statTopCourse`. The last one also has `stat-value-sm`, a smaller font, because course names are long.

### 3.7 Toolbar

```html
    <section class="card">
        <div class="toolbar">
            <div class="search-box">
                <svg class="icon" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
                <input id="searchInput" type="search" placeholder="Search by name, email or course…" autocomplete="off">
            </div>
```

- **`class="card"`**: the white rounded box around the toolbar and the table.
- **The magnifying glass**: a circle (the lens) and a short diagonal line (the handle). CSS places it inside the left edge of the input.
- **`<input type="search">`**: a text box meant for searching. Some browsers add a small "×" to clear it.
- **`placeholder`**: the grey hint text shown while the box is empty.
- **`autocomplete="off"`**: stops the browser from showing a dropdown of things you typed before.
- `<input>` has no closing tag.

```html
            <div class="toolbar-right">
                <select id="courseFilter" class="select" aria-label="Filter by course">
                    <option value="">All courses</option>
                </select>
```

- **`<select>`**: a dropdown list.
- **`<option value="">`**: one choice. `value` is what JavaScript reads; the text between the tags is what the user sees. An empty value `""` means "no filter".
- `app.js` adds one `<option>` for each course later (line 207).

```html
                <select id="pageSize" class="select" aria-label="Rows per page">
                    <option value="5">5 / page</option>
                    <option value="10" selected>10 / page</option>
                    <option value="25">25 / page</option>
                    <option value="50">50 / page</option>
                </select>
```

- **`selected`**: this option is chosen when the page opens. `app.js` line 479 reads it at start-up.

```html
                <button id="btnRefresh" class="btn btn-icon btn-outline" type="button" aria-label="Reload students" title="Reload">
                    <svg class="icon" viewBox="0 0 24 24"><path d="M21 12a9 9 0 1 1-2.6-6.4L21 8"/><path d="M21 3v5h-5"/></svg>
                </button>
            </div>
        </div>
```

- **The Reload button**: a square button (`btn-icon`) with a border (`btn-outline`). The icon is a circular arrow: an arc (`a9 9 ...`) plus an arrow head.
- `aria-label` is for screen readers, `title` is the tooltip for mouse users.

### 3.8 Table

```html
        <div class="table-wrap">
            <table class="data-table" id="studentsTable">
                <thead>
                <tr>
                    <th data-sort="id" class="sortable">ID</th>
                    <th data-sort="name" class="sortable">Name</th>
                    <th data-sort="age" class="sortable">Age</th>
                    <th data-sort="email" class="sortable hide-md">Email</th>
                    <th data-sort="course" class="sortable hide-sm">Course</th>
                    <th class="text-right">Actions</th>
                </tr>
                </thead>
```

- **`table-wrap`**: a box around the table that allows **sideways scrolling** if the table is too wide for a small screen.
- **`<table>`**: a table. Inside: `<thead>` (heading rows), `<tbody>` (data rows), `<tr>` (one **t**able **r**ow), `<th>` (a **t**able **h**eading cell), `<td>` (a **t**able **d**ata cell).
- **`data-sort="name"`**: a custom **data attribute**. jQuery reads it with `.data("sort")` (app.js line 450) to know which field to sort by.
- **`class="sortable"`**: gives the heading a pointer cursor and the ↕ arrow.
- **`hide-md` / `hide-sm`**: hide that column on medium / small screens.
- **`text-right`**: right-aligns the "Actions" heading so it sits above the buttons.

```html
                <tbody id="studentsBody">
                <!-- rows are rendered by app.js -->
                </tbody>
            </table>
```

- **The body is empty.** `app.js` fills it using `$body.html(...)` (line 98).

```html
            <div id="tableLoader" class="table-state">
                <span class="spinner"></span>
                <span>Loading students…</span>
            </div>
            <div id="tableEmpty" class="table-state" hidden>
                <svg class="icon icon-xl" ...>...</svg>
                <span>No students found.</span>
            </div>
        </div>
```

- **`tableLoader`**: visible at first. The empty `<span class="spinner">` becomes a spinning circle through CSS.
- **`tableEmpty`**: has the **`hidden`** attribute, so it isn't shown at first. JavaScript shows it when no students match.
- `icon-xl` makes the "people" icon large.

```html
        <div class="table-footer">
            <span id="pageInfo" class="muted"></span>
            <nav id="pagination" class="pagination" aria-label="Pagination"></nav>
        </div>
    </section>
</main>
```

- **`pageInfo`**: JavaScript writes "Showing 1–10 of 23" here.
- **`<nav>`**: a semantic tag for navigation links. JavaScript puts the page buttons inside.

### 3.9 Footer

```html
<footer class="app-footer">
    <div class="container muted">FastAPI Tutorial · HTML + CSS + jQuery AJAX</div>
</footer>
```

- **`<footer>`**: the bottom strip of the page.

### 3.10 The Add/Edit modal

```html
<div class="modal" id="studentModal" role="dialog" aria-modal="true" aria-labelledby="studentModalTitle" hidden>
```

- **`class="modal"`**: CSS makes it cover the whole screen.
- **`id="studentModal"`**: JavaScript opens it with `Modal.open("#studentModal")`.
- **`role="dialog"`**: tells screen readers "this is a dialog window".
- **`aria-modal="true"`**: "while this is open, the rest of the page can't be used".
- **`aria-labelledby="studentModalTitle"`**: "the title of this dialog is the element with id `studentModalTitle`". Screen readers announce it when the dialog opens.
- **`hidden`**: closed at first.

```html
    <div class="modal-backdrop" data-dismiss="modal"></div>
    <div class="modal-dialog">
```

- **`modal-backdrop`**: the dark see-through layer behind the box. **`data-dismiss="modal"`** tells `modal.js` (line 73) "clicking this closes the modal".
- **`modal-dialog`**: the box itself. CSS animates it when opening.

```html
        <form id="studentForm" class="modal-content" novalidate>
```

- **`<form>`**: groups the input boxes. Pressing **Enter** in any box, or clicking a `type="submit"` button, fires the form's **`submit`** event. `app.js` line 401 listens for it.
- **`class="modal-content"`**: the white rounded panel. Here the form *is* the panel, so the header, body and footer are all inside the form, and the Save button in the footer can submit it.
- **`novalidate`**: switches off the browser's built-in error bubbles. We show our own messages instead.

```html
            <header class="modal-header">
                <h2 id="studentModalTitle">Add Student</h2>
                <button type="button" class="modal-close" data-dismiss="modal" aria-label="Close">&times;</button>
            </header>
```

- **`<h2 id="studentModalTitle">`**: the title. JavaScript changes it to "Add Student" or "Edit Student #3" (lines 224 and 232).
- **The close button**: `&times;` is an **HTML entity** that shows the multiplication sign ×. It has `data-dismiss="modal"`, so it closes the modal.

```html
            <div class="modal-body">
                <input type="hidden" name="id" id="studentId">
```

- **`modal-body`**: the scrollable middle part.
- **`<input type="hidden">`**: an invisible box that holds a value. It stores the id of the student being edited.

```html
                <div class="form-grid">
                    <div class="form-group span-2">
                        <label for="fName">Full name <span class="req">*</span></label>
                        <input class="input" id="fName" name="name" type="text" placeholder="Asha Patil" maxlength="100">
                        <small class="field-error" data-for="name"></small>
                    </div>
```

- **`form-grid`**: CSS makes this a 2-column grid.
- **`form-group span-2`**: one label + box + error. `span-2` makes it take both columns (full width).
- **`<label for="fName">`**: the text for the box. `for` must match the input's `id`. Then clicking the label puts the cursor in the box, and screen readers read the label when the box is focused.
- **`<span class="req">*</span>`**: a red star meaning "required".
- **The input:**
  - `class="input"`: our input style.
  - `id="fName"`: JavaScript reads it with `$("#fName").val()`.
  - `name="name"`: the field name. It **matches the API field `name`**, so server errors about `name` can be matched to this box (line 264).
  - `type="text"`: normal text.
  - `maxlength="100"`: the browser won't let you type more than 100 characters.
- **`<small class="field-error" data-for="name">`**: empty until there's an error. JavaScript finds it with `[data-for='name']` (line 265).

The other three groups follow the same pattern:

```html
<input class="input" id="fAge" name="age" type="number" min="1" max="120" placeholder="20">
```
- **`type="number"`**: only numbers can be typed, and phones show a number keypad. `min`/`max` limit the up/down arrows to 1–120.

```html
<input class="input" id="fCourse" name="course" type="text" list="courseList" placeholder="Computer Science">
<datalist id="courseList"></datalist>
```
- **`list="courseList"`** links the box to the **`<datalist>`** with that id. The datalist holds suggestions; while you type, matching courses appear in a dropdown, but you can still type anything. JavaScript fills it (line 208).

```html
<input class="input" id="fEmail" name="email" type="email" placeholder="asha@example.com">
```
- **`type="email"`**: phones show a keyboard with an `@` key.

```html
            <footer class="modal-footer">
                <button type="button" class="btn btn-outline" data-dismiss="modal">Cancel</button>
                <button type="submit" class="btn btn-primary" id="btnSaveStudent">
                    <span class="spinner spinner-sm" hidden></span>
                    <span class="btn-label">Save</span>
                </button>
            </footer>
        </form>
    </div>
</div>
```

- **Cancel**: `type="button"` (doesn't submit) plus `data-dismiss="modal"` (closes the modal).
- **Save**: **`type="submit"`**, so clicking it submits the form, which fires the form's `submit` event. Pressing Enter in a box does the same.
- Inside Save: a small **spinner** (hidden until saving) and a **label** whose text JavaScript changes to "Save" or "Update" (line 230).

### 3.11 The View modal

```html
<div class="modal" id="viewModal" role="dialog" aria-modal="true" aria-labelledby="viewModalTitle" hidden>
    <div class="modal-backdrop" data-dismiss="modal"></div>
    <div class="modal-dialog modal-sm">
        <div class="modal-content">
```

- The same structure as above. **`modal-sm`** makes the box narrower (420px instead of 560px).
- Here `modal-content` is a `<div>`, not a `<form>`, because there's nothing to submit.

```html
                <div class="profile">
                    <div class="avatar avatar-lg" id="viewAvatar"></div>
                    <h3 id="viewName"></h3>
                    <span class="badge" id="viewCourse"></span>
                </div>
                <dl class="detail-list">
                    <div><dt>ID</dt><dd id="viewId"></dd></div>
                    <div><dt>Age</dt><dd id="viewAge"></dd></div>
                    <div><dt>Email</dt><dd id="viewEmail"></dd></div>
                </dl>
```

- **`avatar avatar-lg`**: a big coloured circle. JavaScript puts the initials inside (line 336).
- **`<h3>`**: the student's name.
- **`badge`**: the coloured pill with the course name.
- **`<dl>`**: a **d**escription **l**ist. **`<dt>`** is a term ("Age"), **`<dd>`** is its value ("20 years"). Each pair is wrapped in a `<div>` so CSS can style it as a row.
- All the elements with ids are empty; JavaScript fills them (lines 336–341).

```html
            <footer class="modal-footer">
                <button type="button" class="btn btn-outline" data-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" id="btnViewEdit">Edit</button>
            </footer>
```

- **Close** closes the modal. **Edit** has its own handler in `app.js` (line 420).

### 3.12 The alert/confirm modal

```html
<div class="modal modal-alert" id="dialogModal" role="alertdialog" aria-modal="true"
     aria-labelledby="dialogTitle" aria-describedby="dialogMessage" hidden>
    <div class="modal-backdrop"></div>
```

- **`modal-alert`**: CSS gives it a higher `z-index`, so it shows **on top of** other modals.
- **`role="alertdialog"`**: a dialog that needs an answer. Screen readers announce it straight away.
- **`aria-describedby="dialogMessage"`**: screen readers also read the message.
- **The backdrop has no `data-dismiss`**, so clicking outside does **not** close it. The user must click a button.

```html
            <div class="modal-body text-center">
                <div class="alert-icon" id="dialogIcon"></div>
                <h2 id="dialogTitle" class="alert-title"></h2>
                <div id="dialogMessage" class="alert-message"></div>
            </div>
            <footer class="modal-footer modal-footer-center">
                <button type="button" class="btn btn-outline" id="dialogCancel">Cancel</button>
                <button type="button" class="btn btn-primary" id="dialogOk">OK</button>
            </footer>
```

- All parts are empty: `modal.js` fills the icon, title, message and button texts for each alert (lines 142–151).
- `modal-footer-center` centres the buttons.
- `#dialogCancel` is hidden for plain alerts and shown for confirms.

### 3.13 Scripts

```html
<script src="https://code.jquery.com/jquery-3.7.1.min.js"
        integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo="
        crossorigin="anonymous"></script>
```

- **`<script src="...">`**: download and run a JavaScript file. A `<script>` tag always needs a closing `</script>`, even when it's empty.
- **`jquery-3.7.1.min.js`**: jQuery version 3.7.1, minified.
- **`integrity`**: a fingerprint (a **hash**) of the exact file. If even one character of the downloaded file were different, the browser would refuse to run it.
- **`crossorigin="anonymous"`**: download without sending cookies. This is required for `integrity` to work with files from another server.

```html
<script src="assets/js/config.js"></script>
<script src="assets/js/utils.js"></script>
<script src="assets/js/api.js"></script>
<script src="assets/js/modal.js"></script>
<script src="assets/js/app.js"></script>
</body>
</html>
```

- Our own files, **in the order they depend on each other**: each file only uses things from the files above it.
- They're at the **end of `<body>`**, so all the HTML above already exists when they run.
- **`</body>` and `</html>`** close the page.

---

# Part C: CSS

How to read one CSS rule:

```css
.btn-primary:hover:not(:disabled) {     /* SELECTOR: which elements */
    box-shadow: 0 10px 22px -8px red;   /* PROPERTY: VALUE; */
}
```

**Specificity** decides which rule wins when two rules set the same property on the same element: an `#id` beats a `.class`, which beats a `tag`. When they're equal, the rule that comes **later** wins.

**Units used in this project:**

| Unit | Meaning |
|---|---|
| `px` | pixels (a fixed size) |
| `rem` | a multiple of the root font size (normally 16px), so `1rem` = 16px and `0.875rem` = 14px |
| `em` | a multiple of the **current** element's font size |
| `%` | a percentage of the parent's size |
| `vh` / `vw` | percent of the window's height / width (`100vh` = full window height) |
| `ms` / `s` | milliseconds / seconds (for animations) |
| `deg` | degrees (for rotation and gradients) |
| `fr` | a "fraction" of the free space in a grid |

## 4. `variables.css` line by line

File: [assets/css/variables.css](assets/css/variables.css)

```css
:root {
```

- **`:root`** selects the very top element of the page (`<html>`). Variables set here are available **everywhere**, because every element inherits from `<html>`.

```css
    --c-primary: #6366f1;
    --c-primary-hover: #4f46e5;
    --c-primary-soft: rgb(99 102 241 / 0.12);
```

- **`--c-primary`**: a **custom property** (CSS variable). The name must start with `--`. `#6366f1` is a **hex colour**: two digits each for red (`63`), green (`66`), blue (`f1`), counted in base 16 (from `00` to `ff`).
- **`--c-primary-hover`**: a darker shade for hover effects.
- **`--c-primary-soft`**: the same colour at 12% opacity. `rgb(99 102 241 / 0.12)` = red 99, green 102, blue 241, then `/` and the **alpha** (opacity) from 0 (invisible) to 1 (solid). Used for light backgrounds and focus rings.

The **success, danger, warning and info** lines follow the same pattern: a main colour, sometimes a `-hover` colour, and a `-soft` see-through version.

```css
    --bg: #f4f5fb;
    --bg-gradient: radial-gradient(1200px 600px at 10% -10%, rgb(99 102 241 / 0.10), transparent 60%),
                   radial-gradient(900px 500px at 110% 10%, rgb(139 92 246 / 0.08), transparent 60%);
```

- **`--bg`**: the page background colour (a very light grey-blue).
- **`--bg-gradient`**: two soft coloured "glows". `radial-gradient(SIZE at POSITION, COLOUR1, COLOUR2 STOP)` draws an oval that fades from `COLOUR1` in the middle to `transparent` at 60% of its size.
  - `1200px 600px` is the oval's width and height.
  - `at 10% -10%` puts its centre near the top-left, slightly above the page.
  - The comma separates the two gradients; the second glow is at the top-right (`110% 10%`).

```css
    --surface: #ffffff;
    --surface-2: #f8f9fc;
    --surface-glass: rgb(255 255 255 / 0.72);
    --border: #e4e6ef;
    --text: #1e2133;
    --text-muted: #6b7088;
    --overlay: rgb(15 17 30 / 0.55);
```

- **`--surface`**: the background of cards and modals (white).
- **`--surface-2`**: a slightly darker surface for table headings, inputs and modal footers.
- **`--surface-glass`**: white at 72% opacity, used for the frosted header.
- **`--border`**: the colour of thin lines.
- **`--text`** / **`--text-muted`**: normal and grey text.
- **`--overlay`**: the modal backdrop, a dark colour at 55% opacity.

```css
    --font-sans: "Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
```

- A **font stack**: try Inter first; if it isn't loaded, use the computer's own interface font (`system-ui`, `-apple-system` on Mac, `Segoe UI` on Windows, `Roboto` on Android), and finally any `sans-serif` font. Names with spaces need quotes.

```css
    --fs-xs: 0.75rem;
    --fs-sm: 0.875rem;
    --fs-md: 1rem;
    --fs-lg: 1.125rem;
    --fs-xl: clamp(1.5rem, 1.1rem + 1.5vw, 2rem);
```

- **Font sizes**: 12px, 14px, 16px, 18px.
- **`clamp(MIN, PREFERRED, MAX)`**: a **fluid** size. The preferred value `1.1rem + 1.5vw` grows with the window width, but never goes below `1.5rem` (24px) or above `2rem` (32px). So the page title is smaller on phones and bigger on desktops, with no media query.

```css
    --sp-1: 0.25rem;  --sp-2: 0.5rem;  --sp-3: 0.75rem;
    --sp-4: 1rem;     --sp-5: 1.5rem;  --sp-6: 2rem;
```

- A **spacing scale**: 4, 8, 12, 16, 24 and 32px. Using only these values keeps all the gaps consistent.

```css
    --radius-sm: 8px;
    --radius: 12px;
    --radius-lg: 18px;
    --radius-pill: 999px;
```

- Corner roundness. `999px` is bigger than any element's height, so the corners become fully round: a **pill** shape.

```css
    --shadow-sm: 0 1px 2px rgb(16 24 40 / 0.06);
    --shadow: 0 4px 16px -4px rgb(16 24 40 / 0.10), 0 2px 4px -2px rgb(16 24 40 / 0.06);
    --shadow-lg: 0 24px 48px -12px rgb(16 24 40 / 0.28);
```

- **Shadows**, in the format `X-OFFSET Y-OFFSET BLUR SPREAD COLOUR`.
  - `0 4px 16px -4px` = not moved sideways, 4px down, 16px blur, shrunk by 4px.
- Two shadows separated by a comma are drawn on top of each other. Using two layers looks more natural than one.

```css
    --ring: 0 0 0 4px var(--c-primary-soft);
```

- A shadow with **no offset and no blur, but 4px of spread**: a solid 4px outline. Used as the purple glow around focused inputs. **A variable can use another variable.**

```css
    --ease: cubic-bezier(0.22, 1, 0.36, 1);
    --dur: 220ms;
```

- **`--ease`**: the animation's speed curve. `cubic-bezier` describes it with four numbers. This one is an "ease-out": fast at the start, very gentle at the end.
- **`--dur`**: the standard animation duration, 220 milliseconds.

```css
    --container: 1180px;
    --header-h: 64px;

    color-scheme: light;
}
```

- The maximum content width and the header's height.
- **`color-scheme: light`**: tells the browser to draw its own controls (scrollbars, dropdowns, date pickers) in light colours.

```css
:root[data-theme="dark"] {
    --bg: #0f1120;
    ...
    color-scheme: dark;
}
```

- **`:root[data-theme="dark"]`**: matches `<html>` **only when** it has the attribute `data-theme="dark"`. JavaScript sets that attribute (`app.js` line 391).
- Inside, the **same variable names get new values** (dark backgrounds, light text). Every rule that uses `var(--bg)` or `var(--text)` updates automatically.

```css
@media (prefers-color-scheme: dark) {
    :root:not([data-theme="light"]) {
        ...the same dark values...
    }
}
```

- **`@media (prefers-color-scheme: dark)`**: only applies when the **operating system** is in dark mode.
- **`:not([data-theme="light"])`**: "...unless the user has picked light mode". So with no choice made, the page follows the system setting.

## 5. `base.css` line by line

File: [assets/css/base.css](assets/css/base.css)

```css
*,
*::before,
*::after { box-sizing: border-box; }
```

- **`*`**: every element. **`*::before` / `*::after`**: every pseudo-element (see [7.6](#76-stat-cards)).
- **`box-sizing: border-box`**: `width` **includes** padding and border. Without it, `width: 100px; padding: 10px` would be 120px wide.

```css
* { margin: 0; }
```

- Browsers add their own margins to headings, paragraphs and lists. This removes them all, so we have full control over spacing.

```css
html { -webkit-text-size-adjust: 100%; scroll-behavior: smooth; }
```

- **`-webkit-text-size-adjust: 100%`**: stops iPhones from enlarging text on their own when you rotate the phone. The `-webkit-` part is a **vendor prefix**, for features that some browsers support under a special name.
- **`scroll-behavior: smooth`**: when the page jumps (for example clicking the logo's `#` link), it scrolls smoothly instead of jumping.

```css
body {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
```

- **`min-height: 100vh`**: the body is at least as tall as the window.
- **`display: flex`**: turns the body into a **flex container**: its children (header, main, footer) are laid out by flexbox.
- **`flex-direction: column`**: stack them top to bottom.

```css
    font-family: var(--font-sans);
    font-size: var(--fs-md);
    line-height: 1.5;
    color: var(--text);
```

- The font, the size (16px), the line height (1.5 × font size = 24px; makes text easier to read), and the text colour. All children **inherit** these.

```css
    background: var(--bg-gradient), var(--bg);
    background-attachment: fixed;
```

- Two background layers: the glows on top, the plain colour underneath.
- **`background-attachment: fixed`**: the background stays still while the content scrolls over it.

```css
    -webkit-font-smoothing: antialiased;
    transition: background-color var(--dur) var(--ease), color var(--dur) var(--ease);
}
```

- **`-webkit-font-smoothing`**: makes text look thinner and sharper on Macs.
- **`transition`**: when the background colour or text colour changes (switching theme), fade between them over 220ms instead of switching instantly. Format: `PROPERTY DURATION TIMING`, with a comma between properties.

```css
body.modal-open { overflow: hidden; }
```

- **`body.modal-open`**: the body, **only when** it also has the class `modal-open` (no space = the same element).
- **`overflow: hidden`**: hides the scrollbar, so the page can't scroll while a modal is open.

```css
h1, h2, h3 { line-height: 1.2; font-weight: 700; letter-spacing: -0.01em; }
h1 { font-size: var(--fs-xl); }
h2 { font-size: var(--fs-lg); }
```

- **A comma between selectors** applies the same rule to all of them.
- Headings: tighter lines (1.2), bold (700), letters slightly closer together (large text looks better a little tighter).

```css
a { color: var(--c-primary); text-decoration: none; }
a:hover { text-decoration: underline; }
```

- Links are purple with no underline, and get an underline on hover.

```css
img, svg { display: block; max-width: 100%; }
```

- **`display: block`**: removes a small gap that appears under inline images.
- **`max-width: 100%`**: an image is never wider than its box.

```css
button, input, select { font: inherit; color: inherit; }
```

- Form controls don't inherit the page font by default. This forces them to use the same font and colour as the page.

```css
[hidden] { display: none !important; }
```

- **`[hidden]`**: any element with the `hidden` attribute.
- **`!important`**: makes this declaration win over any other rule. Without it, a rule like `.modal { display: grid; }` would make hidden modals visible.

```css
:focus-visible { outline: 2px solid var(--c-primary); outline-offset: 2px; }
```

- **`:focus-visible`**: the element that has keyboard focus, shown mainly for keyboard users.
- **`outline`**: a line drawn around the element (it doesn't change the layout). **`outline-offset`**: a 2px gap between the element and the line.

```css
::selection { background: var(--c-primary-soft); }
```

- The colour of text you highlight with the mouse.

```css
.icon {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
    fill: none;
    stroke: currentColor;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
}
.icon-xl { width: 44px; height: 44px; stroke-width: 1.5; }
```

- Every SVG icon is 18 × 18px.
- **`flex-shrink: 0`**: inside a flex container, don't squash the icon to make room.
- **`fill: none`**: don't fill shapes in.
- **`stroke: currentColor`**: draw lines in the **current text colour**. This is why icons change colour on hover along with the text.
- **`stroke-width: 2`**: lines 2 units thick.
- **`stroke-linecap: round`** / **`stroke-linejoin: round`**: rounded line ends and corners.
- **`.icon-xl`**: a bigger version with thinner lines.

```css
.muted { color: var(--text-muted); }
.text-right { text-align: right; }
.text-center { text-align: center; }
```

- **Utility classes**: tiny classes that each do one thing, used straight in the HTML.

```css
.show-md { display: none; }
@media (max-width: 900px) {
    .hide-md { display: none; }
    .show-md { display: block; }
}
@media (max-width: 640px) { .hide-sm { display: none; } }
```

- **`@media (max-width: 900px)`**: the rules inside only apply when the window is **900px wide or less** (tablets and phones).
- **`.hide-md`**: visible on big screens, hidden on medium and small ones. **`.show-md`**: the opposite.
- **`.hide-sm`**: hidden at 640px or less (phones).

```css
@media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
        animation-duration: 0.01ms !important;
        transition-duration: 0.01ms !important;
    }
}
```

- If the user switched on "reduce motion" in their system settings, every animation and transition finishes almost instantly. We use `0.01ms` instead of `0` so that JavaScript waiting for an animation to end still works.

## 6. `layout.css` line by line

File: [assets/css/layout.css](assets/css/layout.css)

```css
.container {
    width: 100%;
    max-width: var(--container);
    margin-inline: auto;
    padding-inline: var(--sp-4);
}
```

- **`width: 100%`**: full width...
- **`max-width: 1180px`**: ...but never wider than this.
- **`margin-inline: auto`**: equal **left and right** margins, which centres the box. ("inline" means the direction text flows: left/right in English.)
- **`padding-inline`**: 16px of space inside, on the left and right.

```css
.app-header {
    position: sticky;
    top: 0;
    z-index: 50;
    height: var(--header-h);
```

- **`position: sticky; top: 0`**: the header scrolls normally until it reaches the top of the window, then sticks there.
- **`z-index: 50`**: draws it on top of the page content as that scrolls underneath. Higher numbers are drawn on top. It only works on positioned elements (`relative`, `absolute`, `fixed` or `sticky`).
- **`height: 64px`**.

```css
    background: var(--surface-glass);
    backdrop-filter: saturate(180%) blur(14px);
    -webkit-backdrop-filter: saturate(180%) blur(14px);
    border-bottom: 1px solid var(--border);
}
```

- **The frosted-glass effect**: a see-through background, plus `backdrop-filter`, which applies effects to whatever is **behind** the element. `blur(14px)` blurs it and `saturate(180%)` makes its colours stronger.
- The `-webkit-` line is the same thing for Safari.
- **`border-bottom`**: a 1px solid line under the header. Format: `WIDTH STYLE COLOUR`.

```css
.header-inner {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--sp-4);
}
```

- **`display: flex`**: children sit in a row.
- **`align-items: center`**: centre them **vertically**.
- **`justify-content: space-between`**: push the first child (logo) to the left and the last (buttons) to the right.
- **`gap`**: space between the children.

```css
.brand {
    display: inline-flex;
    align-items: center;
    gap: var(--sp-2);
    color: var(--text);
    font-size: var(--fs-lg);
}
.brand:hover { text-decoration: none; }
.brand strong { color: var(--c-primary); }
.brand-logo { width: 32px; height: 32px; }
```

- **`inline-flex`**: a flex container that sits in a line like text.
- **`.brand:hover`**: removes the underline that links normally get on hover.
- **`.brand strong`** (with a **space**): a `<strong>` **inside** `.brand`. Colours the word "Manager".

```css
.header-actions { display: flex; align-items: center; gap: var(--sp-2); }
```

- Puts the status pill and buttons in a row, 8px apart.

```css
.main {
    flex: 1;
    padding-block: var(--sp-6);
    display: grid;
    gap: var(--sp-5);
    animation: fade-up 500ms var(--ease) both;
}
```

- **`flex: 1`**: inside the body's flex column, **take up all the leftover height**. This pushes the footer to the bottom even when there's little content.
- **`padding-block`**: padding at the **top and bottom** ("block" is the direction paragraphs stack).
- **`display: grid; gap`**: stack the sections with 24px between them.
- **`animation: NAME DURATION TIMING FILL-MODE`**: play the `fade-up` animation once. **`both`** means "use the first frame's styles before the animation starts and keep the last frame's styles after it ends".

```css
.page-head {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    justify-content: space-between;
    gap: var(--sp-4);
}
.page-head p { margin-top: var(--sp-1); }
```

- Title on the left, Add button on the right.
- **`flex-wrap: wrap`**: if there isn't room on one line (on phones), the button moves to the next line.
- **`align-items: flex-end`**: line items up along their bottom edges.

```css
.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--sp-4);
}
```

- **`grid-template-columns`** sets the columns. Reading it from the inside out:
  - **`minmax(200px, 1fr)`**: each column is at least 200px and at most one equal share of the space.
  - **`repeat(auto-fit, ...)`**: make **as many columns as fit**.
- Result: 4 cards in a row on a wide screen, 2 on a tablet, 1 on a phone, with **no media queries**.

```css
.app-footer {
    padding-block: var(--sp-5);
    font-size: var(--fs-sm);
    text-align: center;
    border-top: 1px solid var(--border);
}
```

- The footer: padding top and bottom, small centred text, a line above it.

```css
@keyframes fade-up {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: none; }
}
```

- **`@keyframes NAME`** defines an animation's steps. **`from`** = 0%, **`to`** = 100%.
- **`opacity: 0`**: invisible. **`transform: translateY(12px)`**: moved 12px down (without affecting the layout around it).
- **`transform: none`**: back in its normal place.

## 7. `components.css` line by line

File: [assets/css/components.css](assets/css/components.css)

### 7.1 Buttons

```css
.btn {
    --btn-bg: var(--surface);
    --btn-fg: var(--text);
    --btn-border: var(--border);
```

- **Local variables**: defined on `.btn` itself, so they only apply to buttons. Each button variant changes these three values instead of rewriting the whole style.

```css
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--sp-2);
```

- **`position: relative`**: allows child elements to be positioned relative to the button.
- **`inline-flex` + `align-items: center` + `justify-content: center`**: puts the icon and text side by side, centred both ways, with an 8px gap.

```css
    min-height: 40px;
    padding: 0 var(--sp-4);
    border: 1px solid var(--btn-border);
    border-radius: var(--radius-sm);
    background: var(--btn-bg);
    color: var(--btn-fg);
```

- **`min-height: 40px`**: at least 40px tall, a comfortable size to tap on a phone.
- **`padding: 0 16px`**: with two values, the first is **top/bottom** and the second is **left/right**.
- **`border-radius: 8px`**: rounded corners.
- The background, text colour and border all come from the local variables.

```css
    font-weight: 600;
    font-size: var(--fs-sm);
    white-space: nowrap;
    cursor: pointer;
    user-select: none;
```

- **`white-space: nowrap`**: the button's text never wraps onto two lines.
- **`cursor: pointer`**: shows the hand cursor on hover.
- **`user-select: none`**: double-clicking the button doesn't highlight its text.

```css
    transition: background-color var(--dur) var(--ease), border-color var(--dur) var(--ease),
                transform 120ms var(--ease), box-shadow var(--dur) var(--ease);
}
```

- Animate these four properties when they change. The press effect (`transform`) is faster (120ms) so it feels snappy.

```css
.btn:hover { text-decoration: none; }
.btn:active:not(:disabled) { transform: translateY(1px) scale(0.98); }
.btn:disabled { opacity: 0.6; cursor: not-allowed; }
```

- **`:hover`**: while the mouse is over it. Removes the underline from `<a class="btn">` links.
- **`:active:not(:disabled)`**: while it's being pressed, unless it's disabled. It moves down 1px and shrinks to 98%, like a real button being pushed.
- **`:disabled`**: faded, with a "not allowed" cursor (🚫). Used while saving.

```css
.btn-primary {
    --btn-bg: linear-gradient(135deg, var(--c-primary), #8b5cf6);
    --btn-fg: #fff;
    --btn-border: transparent;
    background: var(--btn-bg);
    box-shadow: 0 6px 16px -6px rgb(99 102 241 / 0.6);
}
.btn-primary:hover:not(:disabled) { box-shadow: 0 10px 22px -8px rgb(99 102 241 / 0.75); filter: brightness(1.05); }
```

- **`linear-gradient(135deg, A, B)`**: a smooth blend from colour A to colour B along a 135° diagonal (top-left to bottom-right).
- **`#fff`**: short for `#ffffff` (white).
- **`background: var(--btn-bg)`** is repeated here because a gradient is an image, not a colour, so it must be set with `background`.
- **`box-shadow`**: a purple glow under the button.
- **On hover**: a bigger glow, and **`filter: brightness(1.05)`** makes it 5% brighter.

```css
.btn-danger { --btn-bg: var(--c-danger); --btn-fg: #fff; --btn-border: transparent; }
.btn-danger:hover:not(:disabled) { --btn-bg: var(--c-danger-hover); }
```

- A red button (used for "Delete" in the confirm dialog). On hover only the variable changes, and the main `.btn` rule picks up the new colour.

```css
.btn-outline:hover:not(:disabled) { --btn-bg: var(--surface-2); --btn-border: var(--c-primary); }
.btn-ghost { --btn-bg: transparent; --btn-border: transparent; }
.btn-ghost:hover:not(:disabled) { --btn-bg: var(--surface-2); }
.btn-sm { min-height: 34px; padding: 0 var(--sp-3); }
.btn-icon { width: 40px; padding: 0; }
```

- **`btn-outline`**: the normal look plus a purple border on hover.
- **`btn-ghost`**: invisible background and border until hovered.
- **`btn-sm`**: a smaller button.
- **`btn-icon`**: exactly 40px wide (square), for icon-only buttons.

### 7.2 Table action buttons

```css
.action-btn {
    display: inline-grid;
    place-items: center;
    width: 34px;
    height: 34px;
    border: 0;
    border-radius: var(--radius-sm);
    background: transparent;
    color: var(--text-muted);
    cursor: pointer;
    transition: background-color var(--dur), color var(--dur);
}
```

- **`inline-grid` + `place-items: center`**: the shortest way to centre one thing (the icon) both ways.
- A 34px square with no border and no background: just a grey icon.

```css
.action-btn .icon { width: 17px; height: 17px; }
.action-btn.view:hover   { background: var(--c-info-soft);    color: var(--c-info); }
.action-btn.edit:hover   { background: var(--c-primary-soft); color: var(--c-primary); }
.action-btn.delete:hover { background: var(--c-danger-soft);  color: var(--c-danger); }
```

- On hover, each action gets its own colour: blue for view, purple for edit, red for delete.
- **`.action-btn.view`** (no space): an element with **both** classes.

### 7.3 Theme toggle icons

```css
#themeToggle .icon-moon { display: none; }
:root[data-theme="dark"] #themeToggle .icon-sun { display: none; }
:root[data-theme="dark"] #themeToggle .icon-moon { display: block; }
```

- Normally the moon is hidden. When `<html>` has `data-theme="dark"`, the sun is hidden and the moon shown. **CSS reacts to an attribute that JavaScript changes**, so no extra JavaScript is needed to swap the icons.

### 7.4 API status pill

```css
.api-status {
    display: inline-flex;
    align-items: center;
    gap: var(--sp-2);
    padding: var(--sp-1) var(--sp-3);
    border-radius: var(--radius-pill);
    background: var(--surface-2);
    border: 1px solid var(--border);
    font-size: var(--fs-xs);
    font-weight: 600;
    color: var(--text-muted);
}
```

- A small pill-shaped label (`radius-pill`) with the dot and text side by side.

```css
.api-status .dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: var(--c-warning);
}
```

- **`border-radius: 50%`** on a square makes a **circle**. It's yellow (warning) while checking.

```css
.api-status.online  .dot { background: var(--c-success); animation: pulse 2s infinite; }
.api-status.offline .dot { background: var(--c-danger); }
@media (max-width: 480px) { .api-status .label { display: none; } }
```

- Green and pulsing when `.online`, red when `.offline`. **`infinite`** repeats the animation forever.
- On very small screens, only the dot is shown.

```css
@keyframes pulse {
    0%   { box-shadow: 0 0 0 0 rgb(16 185 129 / 0.6); }
    70%  { box-shadow: 0 0 0 8px rgb(16 185 129 / 0); }
    100% { box-shadow: 0 0 0 0 rgb(16 185 129 / 0); }
}
```

- A ring (a shadow with spread) grows from 0 to 8px while fading from 60% to 0% opacity, then resets. It looks like a ripple.

### 7.5 Card

```css
.card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow);
    overflow: hidden;
}
```

- A white box with a border, round corners and a shadow.
- **`overflow: hidden`**: anything inside that pokes past the rounded corners is cut off, so the table's corners look round too.

### 7.6 Stat cards

```css
.stat-card {
    position: relative;
    display: grid;
    gap: var(--sp-1);
    padding: var(--sp-4) var(--sp-5);
    ...
    overflow: hidden;
    transition: transform var(--dur) var(--ease), box-shadow var(--dur) var(--ease);
}
```

- **`position: relative`**: needed so the `::before`/`::after` boxes below are positioned **inside this card**.
- **`overflow: hidden`**: cuts off the part of the corner circle that sticks out.

```css
.stat-card::before {
    content: "";
    position: absolute;
    inset: 0 auto 0 0;
    width: 4px;
    background: var(--accent);
}
```

- **`::before`** creates an extra, invisible-in-the-HTML box as the **first child** of the card.
- **`content: ""`**: required, or the pseudo-element won't appear at all. Empty, because we want a coloured box, not text.
- **`position: absolute`**: placed at exact coordinates inside the nearest `position: relative` parent (the card).
- **`inset: 0 auto 0 0`**: shorthand for `top: 0; right: auto; bottom: 0; left: 0`. So it runs the full height along the left edge.
- **`width: 4px`** and **`background: var(--accent)`**: a 4px coloured strip, in the colour set by the card's `style="--accent: ..."`.

```css
.stat-card::after {
    content: "";
    position: absolute;
    right: -30px; top: -30px;
    width: 110px; height: 110px;
    border-radius: 50%;
    background: var(--accent);
    opacity: 0.08;
}
```

- **`::after`**: the **last** child. A 110px circle, pushed 30px past the top-right corner, at 8% opacity: a faint decorative glow.

```css
.stat-card:hover { transform: translateY(-3px); box-shadow: var(--shadow); }
.stat-label { font-size: var(--fs-sm); color: var(--text-muted); font-weight: 500; }
.stat-value { font-size: 1.75rem; font-weight: 700; font-variant-numeric: tabular-nums; }
.stat-value-sm { font-size: var(--fs-lg); line-height: 2.6rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
```

- **Hover**: lifts the card 3px and makes its shadow bigger.
- **`font-variant-numeric: tabular-nums`**: every digit has the same width, so numbers don't "wobble" while they count up.
- **`.stat-value-sm`**:
  - `line-height: 2.6rem` keeps it the same height as the big numbers in the other cards.
  - `white-space: nowrap` + `overflow: hidden` + `text-overflow: ellipsis` together mean: "keep it on one line; if it's too long, cut it off and show `…`".

### 7.7 Toolbar and search

```css
.toolbar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: var(--sp-3);
    padding: var(--sp-4);
    border-bottom: 1px solid var(--border);
}
.toolbar-right { display: flex; flex-wrap: wrap; gap: var(--sp-2); }
```

- Search on the left, dropdowns on the right. Wraps onto two lines on small screens.

```css
.search-box {
    position: relative;
    flex: 1 1 280px;
    max-width: 420px;
}
```

- **`flex: 1 1 280px`** is shorthand for three values:
  - **grow** = 1: may get bigger to fill free space,
  - **shrink** = 1: may get smaller,
  - **basis** = 280px: start at 280px wide.
- **`max-width: 420px`**: but never wider than 420px.

```css
.search-box .icon {
    position: absolute;
    left: 12px; top: 50%;
    translate: 0 -50%;
    color: var(--text-muted);
    pointer-events: none;
}
.search-box input { padding-left: 40px; }
```

- **The magnifying glass is placed on top of the input**:
  - `position: absolute; left: 12px` puts it 12px from the left edge.
  - `top: 50%` moves its **top edge** to the middle, then **`translate: 0 -50%`** moves it up by half **its own** height. This is the classic trick to centre something vertically.
- **`pointer-events: none`**: clicks go **through** the icon to the input underneath.
- **`padding-left: 40px`** on the input makes room so the text doesn't overlap the icon.

### 7.8 Form controls

```css
.input,
.select,
.search-box input {
    width: 100%;
    min-height: 40px;
    padding: var(--sp-2) var(--sp-3);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    background: var(--surface-2);
    transition: border-color var(--dur), box-shadow var(--dur), background-color var(--dur);
}
```

- One shared look for text boxes, dropdowns and the search box.

```css
.select { width: auto; padding-right: var(--sp-6); cursor: pointer; }
```

- Dropdowns are only as wide as their text, with room on the right for the arrow.

```css
.input:focus, .select:focus, .search-box input:focus {
    outline: none;
    border-color: var(--c-primary);
    background: var(--surface);
    box-shadow: var(--ring);
}
```

- **`:focus`**: the box that has the cursor. The default outline is replaced with a purple border and a soft purple ring.

```css
.input.is-invalid { border-color: var(--c-danger); box-shadow: 0 0 0 4px var(--c-danger-soft); }
```

- When JavaScript adds `is-invalid`, the box becomes red with a red ring.

```css
.form-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--sp-4);
}
.form-group { display: grid; gap: var(--sp-1); }
.form-group.span-2 { grid-column: span 2; }
```

- **`repeat(2, minmax(0, 1fr))`**: two equal columns. The `minmax(0, ...)` stops long text from forcing a column wider than its share.
- **`.form-group`**: stacks label, input and error message with 4px gaps.
- **`grid-column: span 2`**: this group stretches across both columns.

```css
.form-group label { font-size: var(--fs-sm); font-weight: 600; }
.req { color: var(--c-danger); }
.field-error { min-height: 1em; font-size: var(--fs-xs); color: var(--c-danger); }
```

- **`min-height: 1em`** on the error line: it **keeps its space even when empty**, so the form doesn't jump when an error appears.

```css
@media (max-width: 520px) {
    .form-grid { grid-template-columns: 1fr; }
    .form-group.span-2 { grid-column: auto; }
}
```

- On phones: a single column.

### 7.9 Table

```css
.table-wrap { position: relative; overflow-x: auto; min-height: 200px; }
```

- **`overflow-x: auto`**: show a **horizontal scrollbar only if needed**.
- **`min-height: 200px`**: leaves room for the spinner or empty message.

```css
.data-table { width: 100%; border-collapse: collapse; font-size: var(--fs-sm); }
.data-table th,
.data-table td { padding: var(--sp-3) var(--sp-4); text-align: left; white-space: nowrap; }
```

- **`border-collapse: collapse`**: neighbouring cells share one border instead of each having its own (which would look doubled).
- Every cell gets padding, left-aligned text, and no line wrapping.

```css
.data-table thead th {
    position: sticky;
    top: 0;
    background: var(--surface-2);
    color: var(--text-muted);
    font-size: var(--fs-xs);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border-bottom: 1px solid var(--border);
}
```

- **Sticky headings**: they stay visible when the table scrolls inside its box.
- **`text-transform: uppercase`**: shows the text in CAPITALS without changing the HTML.
- **`letter-spacing`**: spreads capital letters apart slightly, which makes them easier to read.

```css
.data-table th.text-right { text-align: right; }
.data-table tbody tr {
    border-bottom: 1px solid var(--border);
    transition: background-color var(--dur);
    animation: row-in 360ms var(--ease) both;
    animation-delay: calc(var(--i, 0) * 30ms);
}
```

- A line under every row, and a smooth hover colour.
- **`animation: row-in ...`**: each row slides in.
- **`animation-delay: calc(var(--i, 0) * 30ms)`**:
  - `calc()` does **maths in CSS**.
  - `var(--i, 0)` reads the row's `--i` variable (set in JavaScript to 0, 1, 2...). The `, 0` is the **fallback** used if `--i` isn't set.
  - Row 0 starts at 0ms, row 1 at 30ms, row 2 at 60ms... a **staggered** wave.

```css
.data-table tbody tr:last-child { border-bottom: 0; }
.data-table tbody tr:hover { background: var(--surface-2); }
.data-table tbody tr.flash { animation: flash 1.4s var(--ease); }
.data-table td.actions { text-align: right; }
.data-table td.actions .action-btn + .action-btn { margin-left: 2px; }
```

- **`:last-child`**: the last row in the body. No line under it, because the card's edge is there already.
- **`tr:hover`**: highlight the row under the mouse.
- **`tr.flash`**: plays the green `flash` animation (replacing `row-in`).
- **`.action-btn + .action-btn`**: the `+` means "an `.action-btn` that comes **directly after** another `.action-btn`". So every button except the first gets a 2px gap on its left.

```css
.sortable { cursor: pointer; user-select: none; }
.sortable::after {
    content: "↕";
    margin-left: 6px;
    opacity: 0.35;
}
.sortable.asc::after  { content: "↑"; opacity: 1; color: var(--c-primary); }
.sortable.desc::after { content: "↓"; opacity: 1; color: var(--c-primary); }
```

- **`content: "↕"`**: this time the pseudo-element **contains text**, an arrow character placed after the heading text.
- When JavaScript adds the class `asc` or `desc`, the arrow changes to ↑ or ↓ and turns purple.

```css
.cell-name { display: flex; align-items: center; gap: var(--sp-3); font-weight: 600; }
.cell-name small { display: block; font-weight: 400; color: var(--text-muted); }
```

- The avatar and name side by side. The `<small>` email under the name (shown on small screens) is normal weight and grey.

```css
.table-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--sp-3);
    padding: var(--sp-6);
    color: var(--text-muted);
}
```

- Centres the spinner (or icon) above its text.

```css
.table-footer { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; ... }
```

- "Showing 1–10 of 23" on the left, page buttons on the right.

```css
@keyframes row-in {
    from { opacity: 0; transform: translateX(-6px); }
    to   { opacity: 1; transform: none; }
}
@keyframes flash {
    0%, 30% { background: var(--c-success-soft); }
    100%    { background: transparent; }
}
```

- **`row-in`**: fade in while sliding 6px from the left.
- **`flash`**: green for the first 30% of the time, then fade to transparent. `0%, 30%` gives two moments the same style.

### 7.10 Avatar and badge

```css
.avatar {
    --size: 36px;
    display: grid;
    place-items: center;
    width: var(--size);
    height: var(--size);
    border-radius: 50%;
    color: #fff;
    font-size: calc(var(--size) * 0.38);
    font-weight: 700;
    background: hsl(var(--hue, 240) 70% 58%);
    flex-shrink: 0;
}
.avatar-lg { --size: 76px; box-shadow: 0 0 0 6px hsl(var(--hue, 240) 70% 58% / 0.18); }
```

- **`--size`**: one variable controls the width, height **and** font size. `.avatar-lg` only changes `--size`, and everything scales.
- **`calc(var(--size) * 0.38)`**: the letters are 38% of the circle's size.
- **`hsl(HUE SATURATION LIGHTNESS)`**:
  - **Hue** is a position on the colour wheel from 0 to 360 (0 red, 60 yellow, 120 green, 180 cyan, 240 blue, 300 magenta).
  - **Saturation** 70% means a strong colour.
  - **Lightness** 58% means medium brightness.
  - Only the hue changes per student (JavaScript sets `--hue`), so all avatars are equally bright, just different colours.
- **`.avatar-lg`** adds a 6px soft ring in the same colour at 18% opacity.

```css
.badge {
    display: inline-block;
    padding: 2px var(--sp-3);
    border-radius: var(--radius-pill);
    font-size: var(--fs-xs);
    font-weight: 600;
    color: hsl(var(--hue, 240) 65% 45%);
    background: hsl(var(--hue, 240) 80% 60% / 0.14);
}
:root[data-theme="dark"] .badge { color: hsl(var(--hue, 240) 85% 75%); }
@media (prefers-color-scheme: dark) {
    :root:not([data-theme="light"]) .badge { color: hsl(var(--hue, 240) 85% 75%); }
}
```

- A pill with darker text on a very light background of the **same hue**.
- **`display: inline-block`**: sits in the line like text, but can have padding all round.
- In dark mode the text is made **lighter** (75% lightness) so it can be read on a dark background.

### 7.11 Pagination

```css
.pagination { display: flex; flex-wrap: wrap; gap: var(--sp-1); }
.page-btn {
    min-width: 34px;
    height: 34px;
    padding: 0 var(--sp-2);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    background: var(--surface);
    cursor: pointer;
    font-size: var(--fs-sm);
    font-weight: 600;
    transition: all var(--dur) var(--ease);
}
```

- Small square buttons in a row. **`transition: all`** animates every property that changes.

```css
.page-btn:hover:not(:disabled):not(.active) { border-color: var(--c-primary); color: var(--c-primary); }
.page-btn.active { background: var(--c-primary); border-color: var(--c-primary); color: #fff; }
.page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
```

- **Hover** (but not on the current page or a disabled button): purple border and text.
- **`.active`** (the current page): filled purple.
- **`:disabled`** (‹ on the first page, › on the last): faded.

### 7.12 Spinner

```css
.spinner {
    width: 28px;
    height: 28px;
    border: 3px solid var(--c-primary-soft);
    border-top-color: var(--c-primary);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}
.spinner-sm { width: 16px; height: 16px; border-width: 2px; border-color: rgb(255 255 255 / 0.35); border-top-color: #fff; }

@keyframes spin { to { transform: rotate(360deg); } }
```

- A circle (`border-radius: 50%`) with a light border all round, except the **top**, which is strong purple.
- **`spin`** rotates it a full turn. **`linear`** keeps the speed constant (no easing), and `infinite` repeats it forever.
- **`.spinner-sm`**: a small white version for inside the purple Save button.

## 8. `modal.css` line by line

File: [assets/css/modal.css](assets/css/modal.css)

```css
.modal {
    position: fixed;
    inset: 0;
    z-index: 1000;
    display: grid;
    place-items: center;
    padding: var(--sp-4);
}
```

- **`position: fixed`**: positioned relative to the **browser window**, not the page. It doesn't move when you scroll.
- **`inset: 0`**: top, right, bottom and left all 0, so it **covers the whole window**.
- **`z-index: 1000`**: above everything else (the header is only 50).
- **`display: grid; place-items: center`**: puts the dialog box in the exact centre.
- **`padding: 16px`**: on small screens, keeps the box from touching the edges.

```css
.modal-alert { z-index: 1100; }
```

- The alert modal is **above** other modals, so an error can appear on top of the open form.

```css
.modal-backdrop {
    position: absolute;
    inset: 0;
    background: var(--overlay);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    opacity: 0;
    transition: opacity var(--dur) var(--ease);
}
```

- Fills the whole modal (and so the whole window) with dark see-through colour, and blurs the page behind it.
- **Starts invisible** (`opacity: 0`) and fades in when `.show` is added.

```css
.modal-dialog {
    position: relative;
    width: 100%;
    max-width: 560px;
    max-height: calc(100vh - 2 * var(--sp-4));
    display: flex;
    opacity: 0;
    transform: translateY(24px) scale(0.96);
    transition: opacity var(--dur) var(--ease), transform 320ms var(--ease);
}
.modal-sm { max-width: 420px; }
```

- **`position: relative`**: draws it **above** the backdrop (a positioned element that comes later in the HTML is drawn on top).
- **`max-width: 560px`**: as wide as the screen allows, up to 560px.
- **`max-height: calc(100vh - 2 * 16px)`**: never taller than the window minus the padding. If the content is taller, the body scrolls inside the box.
- **`display: flex`**: lets `.modal-content` stretch to fill it.
- **Start state**: invisible, 24px lower and at 96% size.
- **`transition`**: animates opacity (220ms) and movement (320ms) when `.show` is added.
- **`.modal-sm`**: a narrower box.

```css
.modal-content {
    width: 100%;
    display: flex;
    flex-direction: column;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-lg);
    overflow: hidden;
}
```

- The white panel. **`flex-direction: column`** stacks header, body and footer. A big shadow makes it look like it's floating.

```css
.modal.show .modal-backdrop { opacity: 1; }
.modal.show .modal-dialog { opacity: 1; transform: none; }
```

- **These two lines are the whole opening animation.** When JavaScript adds `show` to the modal, the backdrop fades in and the box moves to its normal place and size. The `transition` above makes it smooth. Removing `show` animates it back out.

```css
.modal.shake .modal-dialog { animation: shake 400ms var(--ease); }
@keyframes shake {
    0%, 100% { transform: none; }
    20%, 60% { transform: translateX(-8px); }
    40%, 80% { transform: translateX(8px); }
}
```

- When `.shake` is added, the box moves left, right, left, right, then back to centre, like shaking your head "no".

```css
.modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--sp-3);
    padding: var(--sp-4) var(--sp-5);
    border-bottom: 1px solid var(--border);
}
```

- Title on the left, × on the right, with a line underneath.

```css
.modal-close {
    display: grid;
    place-items: center;
    width: 34px;
    height: 34px;
    border: 0;
    border-radius: 50%;
    background: transparent;
    color: var(--text-muted);
    font-size: 1.5rem;
    line-height: 1;
    cursor: pointer;
    transition: background-color var(--dur), color var(--dur), transform var(--dur) var(--ease);
}
.modal-close:hover { background: var(--surface-2); color: var(--text); transform: rotate(90deg); }
```

- A round 34px button with a big ×.
- **`line-height: 1`**: removes extra space above and below the ×, so it sits in the exact centre.
- **On hover** it gets a background and **rotates 90°**, a small playful touch.

```css
.modal-body {
    padding: var(--sp-5);
    overflow-y: auto;
}
```

- **`overflow-y: auto`**: if the content is too tall, **only the body scrolls**. The header and footer stay in place.

```css
.modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: var(--sp-2);
    padding: var(--sp-4) var(--sp-5);
    background: var(--surface-2);
    border-top: 1px solid var(--border);
}
.modal-footer-center { justify-content: center; }
.modal-footer-center .btn { min-width: 110px; }
```

- Buttons are pushed to the **right** (`flex-end`), on a slightly grey strip.
- In the alert dialog, the buttons are centred and at least 110px wide.

```css
.alert-icon {
    --tone: var(--c-info);
    --tone-soft: var(--c-info-soft);
    display: grid;
    place-items: center;
    width: 72px;
    height: 72px;
    margin: var(--sp-2) auto var(--sp-4);
    border-radius: 50%;
    color: var(--tone);
    background: var(--tone-soft);
    animation: pop 420ms var(--ease) both;
}
```

- A 72px circle with the icon in the middle.
- **`margin: 8px auto 16px`**: with three values, it's top / left-and-right / bottom. `auto` on left and right centres the circle.
- Its colours come from `--tone` and `--tone-soft`, which each alert type changes.
- **`animation: pop`**: it pops in.

```css
.alert-icon .icon { width: 36px; height: 36px; stroke-width: 2.4; }
.alert-icon.success { --tone: var(--c-success); --tone-soft: var(--c-success-soft); }
.alert-icon.error   { --tone: var(--c-danger);  --tone-soft: var(--c-danger-soft); }
.alert-icon.warning { --tone: var(--c-warning); --tone-soft: var(--c-warning-soft); }
.alert-icon.info    { --tone: var(--c-info);    --tone-soft: var(--c-info-soft); }
```

- A bigger, thicker icon. Each type only swaps the two colour variables: green for success, red for error, orange for warning, blue for info.

```css
.alert-icon.success .icon path {
    stroke-dasharray: 30;
    stroke-dashoffset: 30;
    animation: draw 500ms 150ms var(--ease) forwards;
}
```

- **The self-drawing check mark**:
  - **`stroke-dasharray: 30`**: draws the line as dashes 30 units long with 30-unit gaps. The tick is shorter than 30, so it's one dash.
  - **`stroke-dashoffset: 30`**: slides that dash 30 units along, out of view. The tick is invisible.
  - **`animation: draw 500ms 150ms ... forwards`**: after a **150ms delay**, animate for 500ms. **`forwards`** keeps the final state when it ends.

```css
.alert-title { font-size: 1.25rem; margin-bottom: var(--sp-2); }
.alert-message { color: var(--text-muted); font-size: var(--fs-sm); }
.alert-message ul { text-align: left; margin-top: var(--sp-2); padding-left: var(--sp-5); }
.alert-message strong { color: var(--text); }
```

- Title and grey message text. Lists of validation errors are left-aligned (easier to read). Bold names stand out in the normal text colour.

```css
@keyframes pop {
    0%   { transform: scale(0.4); opacity: 0; }
    60%  { transform: scale(1.1); opacity: 1; }
    100% { transform: scale(1); }
}
@keyframes draw { to { stroke-dashoffset: 0; } }
```

- **`pop`**: grows from 40% to 110% (a little **too big**), then settles at 100%. This "overshoot" feels bouncy.
- **`draw`**: slides the dash back to offset 0, so the tick appears as if drawn by a pen.

```css
.profile {
    display: grid;
    justify-items: center;
    gap: var(--sp-2);
    margin-bottom: var(--sp-5);
    text-align: center;
}
.profile h3 { margin-top: var(--sp-2); font-size: 1.25rem; }
```

- The View modal's top part: avatar, name and badge, centred and stacked. **`justify-items: center`** centres each grid item horizontally.

```css
.detail-list { display: grid; gap: var(--sp-2); }
.detail-list > div {
    display: flex;
    justify-content: space-between;
    gap: var(--sp-4);
    padding: var(--sp-3) var(--sp-4);
    border-radius: var(--radius-sm);
    background: var(--surface-2);
    font-size: var(--fs-sm);
}
.detail-list dt { color: var(--text-muted); font-weight: 500; }
.detail-list dd { font-weight: 600; word-break: break-all; text-align: right; }
```

- **`> div`**: the `>` means "**direct** children only" (not divs deeper inside).
- Each row: label on the left, value on the right, on a grey rounded strip.
- **`word-break: break-all`**: a very long email can break onto two lines at any letter, instead of overflowing the box.

---

# Part D: JavaScript

**JavaScript basics you'll see everywhere:**

| Code | Meaning |
|---|---|
| `var x = 5;` | make a variable `x` holding 5 |
| `"text"` or `'text'` | a string (text). Both quote styles work the same. |
| `a + b` | adds numbers, or **joins** strings: `"ID #" + 3` gives `"ID #3"` |
| `===` / `!==` | equal / not equal (strict: `"3" === 3` is `false`) |
| `&&` / `\|\|` / `!` | and / or / not |
| `x \|\| "default"` | "x, or `"default"` if x is empty/0/null/undefined" |
| `cond ? a : b` | "if `cond` then `a` else `b`" (the **ternary operator**) |
| `{ name: "Asha", age: 20 }` | an **object** (like a Python dict) |
| `[1, 2, 3]` | an **array** (like a Python list) |
| `obj.name` or `obj["name"]` | read a property |
| `function (a, b) { ... }` | a function with two **parameters** |
| `return x;` | give `x` back to the caller and stop the function |
| `null` / `undefined` | "no value" (set on purpose) / "no value" (never set) |
| `;` | ends a statement |
| `// ...` | a comment |

## 9. `config.js` line by line

File: [assets/js/config.js](assets/js/config.js)

```js
 4  (function (window) {
 5      "use strict";
```

- **Line 4**: starts an **IIFE**, a function that is created and **run straight away** (you'll see `})(window);` on the last line, which calls it). Variables made inside stay private to this file. The parameter `window` receives the browser's global `window` object.
- **Line 5**: **strict mode**. JavaScript refuses some sloppy code (for example using a variable without declaring it) and throws a clear error instead of silently doing something odd.

> 🆕 **ES6**: with **modules** (`<script type="module">`), every file is private and strict automatically, so the IIFE and `"use strict"` aren't needed. See [17.10](#1710-modules-import--export-instead-of-iifes).

```js
11      var servedByFastAPI = window.location.pathname.indexOf("/ui") === 0;
```

- **`window.location`**: information about the current address. **`.pathname`** is the part after the host, for example `/ui/`.
- **`.indexOf("/ui")`**: the position where `"/ui"` appears in the text: `0` if at the very start, `-1` if not found.
- **`=== 0`**: `true` only if the path **starts** with `/ui`, meaning FastAPI served the page.

> 🆕 **ES6**: `const servedByFastAPI = window.location.pathname.startsWith("/ui");`
> `const` = a variable that won't be reassigned; `startsWith` is an ES6 string method that reads more clearly.

```js
13      window.APP_CONFIG = Object.freeze({
14          API_BASE_URL: servedByFastAPI ? "" : "http://127.0.0.1:8000",
15          REQUEST_TIMEOUT_MS: 10000,
16          FETCH_LIMIT: 1000,
17          DEFAULT_PAGE_SIZE: 10,
18          SEARCH_DEBOUNCE_MS: 250,
19          THEME_STORAGE_KEY: "student-manager-theme"
20      });
21  })(window);
```

- **Line 13**: creates an object and stores it on `window`, so **every other file** can read `APP_CONFIG`. **`Object.freeze(...)`** makes it **read-only**: trying to change a setting later does nothing (in strict mode, it throws an error).
- **Line 14**: the ternary operator. Same origin → `""` (relative URLs). Otherwise → the full server address.
- **Line 15**: 10,000 ms = 10 seconds before a request gives up.
- **Line 16**: how many students to ask for (`?limit=1000`).
- **Line 17**: the default rows per page.
- **Line 18**: how long to wait after the last key press before searching.
- **Line 19**: the name under which the theme choice is saved in the browser.
- **Line 21**: closes the function `}`, closes the brackets around it `)`, and **calls it** `(window)`, passing in the real `window`.

Names in `ALL_CAPS` are a convention meaning "a constant setting: don't change it".

## 10. `utils.js` line by line

File: [assets/js/utils.js](assets/js/utils.js)

```js
 7      var Utils = {
```

- Creates an object called `Utils`. Its **properties** are functions; a function stored on an object is called a **method**.

### `escapeHtml`

```js
 9          escapeHtml: function (value) {
10              return String(value == null ? "" : value)
11                  .replace(/&/g, "&amp;")
12                  .replace(/</g, "&lt;")
13                  .replace(/>/g, "&gt;")
14                  .replace(/"/g, "&quot;")
15                  .replace(/'/g, "&#39;");
16          },
```

- **Line 9**: a method named `escapeHtml` with one parameter, `value`.
- **Line 10**:
  - `value == null` (two `=`) is `true` for **both `null` and `undefined`**. This is the one place where `==` is handy.
  - If there's no value, use `""`; otherwise use the value.
  - **`String(...)`** turns numbers and other values into text, so `.replace` can be used.
- **Lines 11–15**: **method chaining**: each `.replace(...)` returns a new string, and the next `.replace` works on it.
  - `/&/g` is a **regular expression** (a search pattern) between slashes. `g` = **global**: replace **all** matches, not only the first.
  - **`&` must be replaced first.** Otherwise the `&` inside `&lt;` (added by line 12) would be replaced again, turning it into `&amp;lt;`.
  - Each special character is swapped for its **HTML entity**, which the browser shows as the character but never treats as code.
- **Line 16**: `},` ends the method. The **comma** separates it from the next property in the object.

### `initials`

```js
19          initials: function (name) {
20              return String(name || "?")
21                  .trim()
22                  .split(/\s+/)
23                  .slice(0, 2)
24                  .map(function (part) { return part.charAt(0).toUpperCase(); })
25                  .join("");
26          },
```

Following `" asha  patil "` through each line:

- **Line 20**: `name || "?"` uses `"?"` if the name is empty. → `" asha  patil "`
- **Line 21**: `.trim()` removes spaces at both ends. → `"asha  patil"`
- **Line 22**: `.split(/\s+/)` cuts the text wherever there are **one or more** (`+`) **whitespace** (`\s`) characters, giving an array. → `["asha", "patil"]`
- **Line 23**: `.slice(0, 2)` keeps items from position 0 up to (not including) 2: at most two words. → `["asha", "patil"]`
- **Line 24**: `.map(fn)` makes a **new array** by running `fn` on every item. `charAt(0)` is the first letter; `.toUpperCase()` makes it a capital. → `["A", "P"]`
- **Line 25**: `.join("")` glues the array into one string with nothing in between. → `"AP"`

> 🆕 **ES6**: `.map(part => part[0].toUpperCase())`, an **arrow function**. See [17.2](#172-arrow-functions).

### `hueFromString`

```js
29          hueFromString: function (text) {
30              var hash = 0;
31              text = String(text || "");
32              for (var i = 0; i < text.length; i++) {
33                  hash = text.charCodeAt(i) + ((hash << 5) - hash);
34                  hash |= 0;
35              }
36              return Math.abs(hash) % 360;
37          },
```

- **Line 30**: start the hash at 0.
- **Line 31**: make sure `text` is a string.
- **Line 32**: a **`for` loop**: `var i = 0` (start), `i < text.length` (keep going while this is true), `i++` (add 1 after each round). So `i` is 0, 1, 2... for each character.
- **Line 33**:
  - `text.charCodeAt(i)` is the number code of a character (`"A"` = 65).
  - `hash << 5` **shifts the bits** left by 5 places, which is the same as multiplying by 32. So `(hash << 5) - hash` = `hash × 31`.
  - The new hash is: character code + old hash × 31. This mixes every character into the result.
- **Line 34**: `hash |= 0` is short for `hash = hash | 0`. The bitwise OR with 0 forces the number to stay a **32-bit whole number**, so it doesn't grow forever.
- **Line 36**: `Math.abs` removes any minus sign; `% 360` is the **remainder** after dividing by 360, so the result is always 0–359: a valid colour hue.

### `debounce`

```js
40          debounce: function (fn, wait) {
41              var timer;
42              return function () {
43                  var ctx = this, args = arguments;
44                  clearTimeout(timer);
45                  timer = setTimeout(function () { fn.apply(ctx, args); }, wait);
46              };
47          },
```

- **Line 40**: takes a function `fn` and a wait time in ms.
- **Line 41**: `timer` remembers the pending timer. It lives **outside** the function returned below, so it keeps its value between calls. This is called a **closure**: an inner function "remembers" the variables around it.
- **Line 42**: returns a **new function**. jQuery calls this new function on every key press.
- **Line 43**:
  - `this` is the element the event happened on (the search box). We save it as `ctx` (context).
  - `arguments` is a built-in array-like list of everything the function was called with (the event object). We save it as `args`.
  - Both are saved because inside the `setTimeout` callback on line 45, `this` and `arguments` would be different.
- **Line 44**: `clearTimeout(timer)` **cancels** the previous timer if one is still waiting.
- **Line 45**: `setTimeout(fn, wait)` runs a function **once**, after `wait` ms. When it fires, `fn.apply(ctx, args)` calls the original function with the right `this` and the saved arguments.
- Result: while you keep typing, each key cancels the previous timer, so only the **last** one survives and `fn` runs once.

> 🆕 **ES6**:
> ```js
> debounce(fn, wait) {
>     let timer;
>     return function (...args) {
>         clearTimeout(timer);
>         timer = setTimeout(() => fn.apply(this, args), wait);
>     };
> }
> ```
> `...args` (rest parameters) replaces `arguments`, and the arrow function `() =>` keeps the outer `this`, so `ctx` isn't needed. See [17.2](#172-arrow-functions) and [17.6](#176-rest--and-spread-).

### `isValidEmail`

```js
49          isValidEmail: function (email) {
50              return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
51          }
```

- **`.test(text)`** returns `true` if the regular expression matches the text.
- The pattern, piece by piece:

| Piece | Meaning |
|---|---|
| `^` | start of the text |
| `[^\s@]+` | one or more characters that are **not** (`^` inside `[]`) a space or `@` |
| `@` | a literal `@` |
| `[^\s@]+` | one or more non-space, non-@ characters (the domain) |
| `\.` | a literal dot (a plain `.` would mean "any character", so it's escaped with `\`) |
| `[^\s@]{2,}` | **2 or more** characters (`com`, `in`, `org`) |
| `$` | end of the text |

- **Line 51**: no comma after the last property. (A comma there is also allowed in modern JavaScript.)

```js
54      window.Utils = Utils;
55  })(window);
```

- **Line 54**: shares `Utils` with the other files.

## 11. `api.js` line by line (jQuery AJAX)

File: [assets/js/api.js](assets/js/api.js)

```js
13  (function (window, $) {
14      "use strict";
16      var cfg = window.APP_CONFIG;
```

- **Line 13**: the IIFE receives **two** values: `window` and `$`. The last line passes `jQuery` in as `$`. Even if another library on the page also used `$`, inside this file `$` is definitely jQuery.
- **Line 16**: a short name for the settings.

### `request()`: the one function that calls `$.ajax`

```js
19      function request(method, path, data) {
```

- A **function declaration**. It isn't put on `window`, so it's private to this file. Only the `StudentAPI` methods below use it.

```js
20          var options = {
21              url: cfg.API_BASE_URL + path,
22              method: method,
23              dataType: "json",
24              timeout: cfg.REQUEST_TIMEOUT_MS,
25              headers: { Accept: "application/json" }
26          };
```

These are the settings for `$.ajax`, one per line:

- **Line 21**: **`url`**: the address. `"" + "/students"` → `"/students"`, or `"http://127.0.0.1:8000" + "/students"`.
- **Line 22**: **`method`**: the HTTP method (`GET`, `POST`...). `method: method` means "the property `method` gets the value of the parameter `method`".
- **Line 23**: **`dataType: "json"`**: "parse the response as JSON". jQuery turns the text `{"id": 3}` into a real object, so we can write `saved.id`.
- **Line 24**: **`timeout`**: give up after 10 seconds.
- **Line 25**: **`headers`**: extra HTTP headers. `Accept: application/json` tells the server "please reply in JSON".

> 🆕 **ES6**: `method: method` can be written just `method,` (**shorthand property**). See [17.5](#175-shorthand-properties-and-methods).

```js
28          if (data !== undefined) {
29              options.contentType = "application/json; charset=utf-8";
30              options.data = JSON.stringify(data);
31          }
```

- **Line 28**: only when a body was passed (POST, PUT, PATCH). For GET and DELETE, `data` is `undefined` because the caller didn't pass a third argument.
- **Line 29**: **`contentType`**: tells the server "the body is JSON, in UTF-8". **FastAPI needs this**; without it, FastAPI can't read the body and answers 422.
- **Line 30**: **`JSON.stringify(obj)`** turns a JavaScript object into JSON **text**: `{name: "Asha", age: 20}` → `'{"name":"Asha","age":20}'`. (Without this, jQuery would send it in a form format, `name=Asha&age=20`, which FastAPI wouldn't accept as JSON.)

```js
34          if (method === "DELETE") {
35              options.dataType = "text";
36          }
```

- DELETE returns **204 with an empty body**. Parsing an empty body as JSON is an error, so jQuery would call `.fail` even though it worked. `"text"` accepts an empty body.

```js
38          return $.ajax(options);
39      }
```

- **`$.ajax(options)`** sends the request **in the background** and immediately returns a **jqXHR** object. This works like a **promise**: you attach `.done()`, `.fail()` and `.always()` to it. We return it so the caller can attach them.

### `StudentAPI`: one method per endpoint

```js
41      var StudentAPI = {
42          list: function (skip, limit) {
43              return request("GET", "/students?" + $.param({ skip: skip || 0, limit: limit || cfg.FETCH_LIMIT }));
44          },
```

- **Line 43**:
  - `skip || 0`: use `skip` or, if it wasn't given, 0.
  - **`$.param({skip: 0, limit: 1000})`** → `"skip=0&limit=1000"` (jQuery builds the query string and encodes special characters).
  - The full path becomes `/students?skip=0&limit=1000`.
  - No third argument, so no body.

```js
45          get: function (id) {
46              return request("GET", "/students/" + encodeURIComponent(id));
47          },
```

- **`encodeURIComponent(id)`** makes the value safe inside a URL. For a number like `3` nothing changes, but for text, characters like `/`, `?` or spaces are encoded (`%2F`...) so they can't break the address.

```js
48          create: function (student) {
49              return request("POST", "/students", student);
50          },
51          replace: function (id, student) {
52              return request("PUT", "/students/" + encodeURIComponent(id), student);
53          },
54          patch: function (id, changes) {
55              return request("PATCH", "/students/" + encodeURIComponent(id), changes);
56          },
57          remove: function (id) {
58              return request("DELETE", "/students/" + encodeURIComponent(id));
59          },
61          ping: function () {
62              return request("GET", "/");
63          }
64      };
```

- **create**: POST with the full student as the body.
- **replace**: PUT with the full student (every field must be sent).
- **patch**: PATCH with **only** the changed fields.
- **remove**: DELETE, no body. (It's called `remove` because `delete` is a JavaScript keyword, which would be confusing as a name.)
- **ping**: calls `GET /` to check the server is alive.

> 🆕 **ES6**: with **template literals** and **shorthand methods**:
> ```js
> get(id) { return request("GET", `/students/${encodeURIComponent(id)}`); },
> ```
> See [18](#18-full-es6-version-of-apijs) for the whole file.

### `parseError()`: turning a failure into a message

```js
74      function parseError(jqXHR, textStatus) {
75          var result = { status: jqXHR.status, title: "Request failed", message: "", fieldErrors: {} };
```

- **Line 74**: jQuery passes these two values to every `.fail(...)` callback:
  - **`jqXHR`**: the request object. Useful properties: `.status` (e.g. 404), `.statusText` (e.g. "Not Found"), `.responseJSON` (the body, already parsed).
  - **`textStatus`**: a short word such as `"error"`, `"timeout"` or `"parsererror"`.
- **Line 75**: the result object, with default values. Each check below fills it in.

```js
77          if (textStatus === "timeout") {
78              result.title = "Request timed out";
79              result.message = "The server took too long to respond. Please try again.";
80              return result;
81          }
```

- The request reached its 10-second `timeout`. **`return`** ends the function early, so the remaining checks are skipped.

```js
82          if (jqXHR.status === 0) {
83              result.title = "Cannot reach the API";
84              result.message = "Make sure the FastAPI server is running:<br><code>uvicorn main:app --reload</code>";
85              return result;
86          }
```

- **Status `0`** means **no response at all**: the server is down, the address is wrong, or CORS blocked the request.
- `<br>` is a line break and `<code>` shows text in a code font. This message is shown with `.html()`, and it's safe because it's our own fixed text.

```js
88          var detail = jqXHR.responseJSON && jqXHR.responseJSON.detail;
```

- **Safe property access**: if `responseJSON` is missing, `&&` stops there and `detail` becomes `undefined` instead of crashing with "cannot read property of undefined".

> 🆕 **ES2020**: `const detail = jqXHR.responseJSON?.detail;`, the **optional chaining** operator `?.`. See [17.9](#179-optional-chaining--and-nullish-).

```js
90          if (Array.isArray(detail)) {
91              result.title = "Validation error";
92              var items = detail.map(function (err) {
93                  var field = err.loc && err.loc[err.loc.length - 1];
94                  var msg = err.msg || "Invalid value";
95                  if (field && typeof field === "string") {
96                      result.fieldErrors[field] = msg;
97                  }
98                  return "<li><strong>" + Utils.escapeHtml(field || "field") + "</strong>: " + Utils.escapeHtml(msg) + "</li>";
99              });
100             result.message = "<ul>" + items.join("") + "</ul>";
```

- **Line 90**: **`Array.isArray(x)`** is `true` if `x` is an array. FastAPI sends an **array** of errors for **422**.
- **Line 92**: `.map` turns each error object into an HTML `<li>` string.
- **Line 93**:
  - `err.loc` is like `["body", "email"]`.
  - `err.loc.length - 1` is the index of the **last** item (arrays start counting at 0).
  - So `field` is `"email"`.
- **Line 94**: the message, or a default.
- **Line 95**: `typeof field === "string"`: some errors point at a list position (a number) instead of a field name. We only store real field names.
- **Line 96**: `result.fieldErrors["email"] = "value is not a valid email..."`. **Square brackets** set a property whose name is in a variable.
- **Line 98**: builds `<li><strong>email</strong>: value is not...</li>`. Both parts are **escaped**, because the message comes from the server.
- **Line 100**: wraps all the items in a `<ul>` (bulleted list).

```js
101         } else if (typeof detail === "string") {
102             result.title = jqXHR.status === 404 ? "Not found" : "Error " + jqXHR.status;
103             result.message = Utils.escapeHtml(detail);
104         } else {
105             result.title = "Error " + jqXHR.status;
106             result.message = Utils.escapeHtml(jqXHR.statusText || "Unexpected server error.");
107         }
108         return result;
109     }
```

- **Line 101**: `detail` is text, as for **404** (`"Student 9 not found"`).
- **Line 102**: a "Not found" title for 404, otherwise "Error 500" (for example).
- **Lines 104–106**: anything else (such as a server crash that returned HTML instead of JSON): use the status text.

```js
111     window.StudentAPI = StudentAPI;
112     window.parseApiError = parseError;
113 })(window, jQuery);
```

- Shares both with the other files. Note that the shared name (`parseApiError`) can differ from the private name (`parseError`).

## 12. `modal.js` line by line (modal windows and alerts)

File: [assets/js/modal.js](assets/js/modal.js)

### Private variables

```js
16      var stack = [];
17      var ANIMATION_MS = 240;
18      var FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
```

- **Line 16**: **`stack`**: the list of open modals, in order. The last one is on top. Example: open the form, then an error appears: `stack = [formModal, dialogModal]`.
- **Line 17**: how long to wait for the closing animation. It's slightly longer than the CSS `--dur` (220ms) to be safe.
- **Line 18**: a **CSS selector** (as a string) for every element that can receive keyboard focus: links with an `href`, enabled buttons/inputs/selects/textareas, and anything with a `tabindex` other than -1. Used for focusing the first field and for the Tab trap. Written in **single quotes** because it contains double quotes.

### `Modal.open`

```js
20      var Modal = {
21          open: function (selector, options) {
22              var $m = $(selector);
23              if (!$m.length || $m.hasClass("show")) return $m;
24              options = options || {};
```

- **Line 22**: **`$(selector)`** finds the modal. `selector` can be a string like `"#studentModal"` or an existing jQuery object; `$()` accepts both.
  - **Naming convention**: variables that hold **jQuery objects** start with `$` (`$m`, `$form`) so you can tell them apart from plain values.
- **Line 23**:
  - **`.length`** is how many elements were found. `!$m.length` means "nothing found".
  - **`.hasClass("show")`**: already open.
  - In either case, stop and do nothing.
- **Line 24**: if no options were given, use an empty object, so `options.static` on the next line doesn't crash.

> 🆕 **ES6**: `open(selector, options = {})`, a **default parameter**. See [17.4](#174-default-parameters).

```js
26              $m.data("static", !!options.static);
27              $m.data("returnFocus", document.activeElement);
28              $m.prop("hidden", false);
```

- **Line 26**: **`.data(key, value)`** stores a value **on the element**, out of sight, to read later. **`!!x`** ("not not x") turns any value into a real `true`/`false`: `!!undefined` → `false`.
- **Line 27**: **`document.activeElement`** is the element that has focus right now (usually the button just clicked). We remember it so focus can go back there when the modal closes.
- **Line 28**: **`.prop("hidden", false)`** removes the `hidden` property, so the modal is now in the page, but still invisible (opacity 0 in CSS).

```js
31              $m[0].offsetWidth;
32              $m.addClass("show");
```

- **Line 31**: **`$m[0]`** gets the plain DOM element out of the jQuery object. Reading **`offsetWidth`** (its width) forces the browser to **calculate the layout right now**. This is called a **reflow**.
  - **Why?** Lines 28 and 32 run in the same instant. Without line 31, the browser would combine them and draw the modal **already in the `.show` state**, so the transition would never play.
  - With line 31, the browser first draws the "before" state (invisible, lower down), then sees `.show` and animates to it.
  - The `// eslint-disable-line` comment in the file tells code-checking tools "yes, this line looks pointless, but it's on purpose".
- **Line 32**: **`.addClass("show")`** starts the CSS animation (see [section 8](#8-modalcss-line-by-line)).

```js
33              stack.push($m[0]);
34              $("body").addClass("modal-open");
```

- **Line 33**: **`.push()`** adds to the **end** of an array: this modal is now on top.
- **Line 34**: stops the page behind from scrolling (`body.modal-open { overflow: hidden }`).

```js
36              setTimeout(function () {
37                  var $first = $m.find("[autofocus]").first();
38                  if (!$first.length) $first = $m.find(".modal-body").find(FOCUSABLE).first();
39                  if (!$first.length) $first = $m.find(".modal-footer .btn-primary, .modal-footer .btn-danger").last();
40                  $first.trigger("focus");
41              }, 50);
```

- **Line 36**: wait 50ms (until the modal is visible) before moving focus.
- **Lines 37–39**: choose **where to put the cursor**, in order of preference:
  1. an element with the `autofocus` attribute,
  2. otherwise the first focusable element in the body (the Name box in the form),
  3. otherwise the main button in the footer (for modals with no inputs).
  - **`.find(selector)`** searches **inside**. **`.first()`** / **`.last()`** keep one element.
  - An `if` with only one statement can be written on one line without `{ }`.
- **Line 40**: **`.trigger("focus")`** puts focus there, just like clicking into it.

```js
43              $m.trigger("modal:open");
44              return $m;
45          },
```

- **Line 43**: fires a **custom event** called `modal:open`. Nothing in our code listens for it yet, but other code could use `$("#studentModal").on("modal:open", ...)` to react. It's a **hook** for later.
- **Line 44**: returning `$m` allows chaining, such as `Modal.open("#x").addClass("big")`.

### `Modal.close`

```js
47          close: function (selector) {
48              var $m = $(selector);
49              if (!$m.hasClass("show")) return $m;
51              $m.removeClass("show");
```

- **Line 49**: if it isn't open, there's nothing to do.
- **Line 51**: removing `show` plays the CSS animation **backwards** (fade out and slide down).

```js
52              stack = stack.filter(function (el) { return el !== $m[0]; });
53              if (!stack.length) $("body").removeClass("modal-open");
```

- **Line 52**: **`.filter(fn)`** makes a new array that keeps only the items where `fn` returns `true`. Here it keeps every modal **except** this one.
- **Line 53**: if no modals are left open, let the page scroll again.

```js
55              setTimeout(function () {
56                  $m.prop("hidden", true);
57                  $m.trigger("modal:closed");
58                  var back = $m.data("returnFocus");
59                  if (back && document.contains(back)) back.focus();
60              }, ANIMATION_MS);
62              return $m;
63          },
```

- **Line 55**: wait **240ms** for the closing animation to finish. (If we hid it straight away, the animation would be cut off.)
- **Line 56**: now really hide it.
- **Line 57**: another custom event, for later use.
- **Lines 58–59**: give focus back to the element that opened the modal, but only if it **still exists** on the page (`document.contains`). For example, a deleted row's button no longer exists. `back.focus()` is the plain JavaScript version of `.trigger("focus")`.

### `Modal.top`

```js
65          top: function () {
66              return stack.length ? $(stack[stack.length - 1]) : $();
67          }
```

- If any modals are open, return the **last** one (the top one) wrapped in jQuery. Otherwise return **`$()`**, an **empty** jQuery object (length 0). An empty object is safer than `null`, because calling `.length` or `.is()` on it never crashes.

### Click handler: closing with buttons and the backdrop

```js
73      $(document).on("click", ".modal [data-dismiss='modal']", function () {
```

- **`$(document).on(EVENT, SELECTOR, HANDLER)`** is **event delegation**:
  - The listener is attached **once**, to the whole document.
  - When **any** click happens, the click "**bubbles**" up from the clicked element through its parents to the document.
  - jQuery checks whether the click started on (or inside) something matching `.modal [data-dismiss='modal']`, meaning an element with `data-dismiss="modal"` that is inside a `.modal`.
  - If so, it runs the handler, with **`this`** set to that matching element.
- **Why delegation?** One listener covers every close button in every modal, even modals added to the page later.

```js
74          var $m = $(this).closest(".modal");
75          if ($(this).hasClass("modal-backdrop") && $m.data("static")) {
76              shake($m);
77              return;
78          }
79          Modal.close($m);
80      });
```

- **Line 74**: **`.closest(selector)`** goes **up** through the parents and finds the first match: the modal that this button belongs to.
- **Lines 75–78**: if the backdrop was clicked and the modal is **static**, shake instead of closing.
- **Line 79**: otherwise, close it.

### Keyboard handler: Escape and the Tab trap

```js
83      $(document).on("keydown", function (e) {
84          var $m = Modal.top();
85          if (!$m.length) return;
```

- **Line 83**: run on **every key press** anywhere. jQuery passes an **event object `e`**, which holds details such as `e.key` (which key) and `e.shiftKey` (whether Shift was held).
- **Lines 84–85**: if no modal is open, do nothing.

```js
87          if (e.key === "Escape") {
88              e.preventDefault();
89              if ($m.is("#dialogModal")) {
91                  var $cancel = $("#dialogCancel");
92                  ($cancel.prop("hidden") ? $("#dialogOk") : $cancel).trigger("click");
93                  return;
94              }
95              if ($m.data("static")) { shake($m); return; }
96              Modal.close($m);
97          }
```

- **Line 87**: **`e.key`** is the name of the key pressed: `"Escape"`, `"Tab"`, `"a"`, `"Enter"`...
- **Line 88**: **`e.preventDefault()`** stops the browser's own action for this key.
- **Line 89**: **`.is(selector)`** returns `true` if the element matches. Is the top modal the alert dialog?
- **Line 92**: if Cancel is hidden (a plain alert), "click" **OK**; otherwise "click" **Cancel**. **`.trigger("click")`** runs the button's click handlers as if the user had clicked it. The `( ... ? ... : ... )` picks **which button** to trigger.
- **Line 95**: another static modal → shake.
- **Line 96**: a normal modal → close.

```js
99          if (e.key === "Tab") {
100             var $f = $m.find(FOCUSABLE).filter(":visible");
101             if (!$f.length) return;
102             var first = $f[0], last = $f[$f.length - 1];
103             if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
104             else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
105         }
106     });
```

- **This is the focus trap.**
- **Line 100**: every focusable element in the modal that is currently **visible** (`:visible` is a jQuery filter that skips hidden elements, such as the hidden Cancel button).
- **Line 102**: the plain DOM elements for the first and last of them. **One `var` can declare two variables**, separated by a comma.
- **Line 103**: **Shift+Tab** (moving backwards) while on the **first** element → stop the normal move and jump to the **last**.
- **Line 104**: **Tab** (moving forwards) on the **last** element → jump to the **first**.
- In every other case the browser moves focus normally. So focus **loops** inside the modal and never escapes to the page behind it.

### `shake`

```js
108     function shake($m) {
109         $m.removeClass("shake");
110         $m[0].offsetWidth;
111         $m.addClass("shake");
112         setTimeout(function () { $m.removeClass("shake"); }, 420);
113     }
```

- **Lines 109–111**: remove the class, force a reflow, add it again. This **restarts** the animation even if it's clicked twice quickly. (Adding a class that's already there does nothing, so the remove-reflow-add trick is needed.)
- **Line 112**: after 420ms (the animation is 400ms), remove it so it can play again next time.

### `ICONS`

```js
117     var ICONS = {
118         success: '<svg class="icon" viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
119         error:   '<svg ...><path d="M18 6 6 18M6 6l12 12"/></svg>',
...
123     };
```

- An object that maps each alert type to its SVG icon as an HTML string.
  - **success**: a tick (move to (5, 12.5), line down-right, then a long line up-right).
  - **error**: an ✕ (two crossing lines).
  - **warning**: a triangle with "!".
  - **info**: a circle with "i".
  - **question**: a circle with "?".

### The dialog queue

```js
125     var $dlg = null;
126     var queue = $.Deferred().resolve().promise();
```

- **Line 125**: will hold the dialog's jQuery object. It's looked up the first time it's needed (this is called **lazy** loading).
- **Line 126**:
  - **`$.Deferred()`** creates a jQuery promise that **you control**.
  - **`.resolve()`** marks it as **finished** straight away.
  - **`.promise()`** returns the read-only side (others can wait on it, but can't resolve it).
  - So the queue starts as "an already-finished task": the first dialog can show immediately.

```js
128     function show(opts) {
130         var next = $.Deferred();
131         queue = queue.then(function () {
132             return render(opts).then(function (result) { next.resolve(result); });
133         });
134         return next.promise();
135     }
```

- **Line 130**: a new promise for **this** dialog's answer.
- **Line 131**: **`queue.then(fn)`** means "when the current queue has finished, run `fn`". The result of `.then` is a **new** promise, which becomes the new end of the queue.
- **Line 132**:
  - `fn` shows the dialog (`render`), which returns a promise that finishes when the user clicks a button.
  - When it does, resolve `next` with the answer (`true`/`false`).
  - Returning `render(...)`'s promise makes the queue **wait for it** before running the next dialog.
- **Line 134**: the caller gets `next.promise()` and can use `.then(function (answer) {...})`.

**An example with two dialogs at once:**

```
queue: [done] → [show A, wait for click] → [show B, wait for click]
```

B only appears after A's button has been clicked and A has closed.

### `render`: filling and showing the dialog

```js
137     function render(opts) {
138         var done = $.Deferred();
139         $dlg = $dlg || $("#dialogModal");
```

- **Line 138**: the promise that will be resolved when a button is clicked.
- **Line 139**: find the dialog the first time; after that, reuse it.

```js
141         var type = opts.type || "info";
142         $("#dialogIcon").attr("class", "alert-icon " + (type === "question" ? "warning" : type)).html(ICONS[type] || ICONS.info);
```

- **Line 141**: the default type is `"info"`.
- **Line 142**:
  - **`.attr("class", "...")`** **replaces** all the classes, for example with `"alert-icon success"`. A `question` uses the `warning` colours.
  - **`.html(...)`** puts the icon SVG inside. `ICONS[type]` reads a property by a **variable name**.
  - `|| ICONS.info` is a fallback for unknown types.
  - Two jQuery calls **chained** on one element.

```js
143         $("#dialogTitle").text(opts.title || "");
145         $("#dialogMessage").html(opts.message || "");
```

- **Line 143**: **`.text()`** sets **plain text**. Any `<` in the title is shown as a character, never treated as HTML. This is always safe.
- **Line 145**: **`.html()`** sets **HTML**, so tags like `<strong>` and `<ul>` work. **Only safe because** every message is built by our own code, which escapes any user data with `escapeHtml` first.

```js
147         var $ok = $("#dialogOk"), $cancel = $("#dialogCancel");
148         $ok.text(opts.okText || "OK")
149            .toggleClass("btn-danger", !!opts.danger)
150            .toggleClass("btn-primary", !opts.danger);
151         $cancel.text(opts.cancelText || "Cancel").prop("hidden", !opts.showCancel);
```

- **Line 148**: the OK button's text ("OK", "Yes", "Delete"...).
- **Lines 149–150**: **`.toggleClass(name, condition)`** **adds** the class if the condition is `true`, and **removes** it if `false`. So with `danger: true` the button is red; otherwise purple.
- **Line 151**: the Cancel text, and **hide** it unless `showCancel` is true.

```js
153         function finish(value) {
154             $ok.off(".dlg"); $cancel.off(".dlg");
155             Modal.close($dlg);
156             setTimeout(function () { done.resolve(value); }, ANIMATION_MS);
157         }
```

- **Line 153**: a function **inside** a function. It can use `done`, `$ok` and `$cancel` from `render` (a **closure**).
- **Line 154**: **`.off(".dlg")`** removes **every handler we added with the `.dlg` namespace**. Important: the same buttons are reused for every dialog. Without this, after 3 dialogs, one click would run 3 old handlers.
- **Line 155**: close the dialog.
- **Line 156**: after the closing animation, **resolve** the promise with `true` or `false`. This is what makes `Dialog.confirm(...).then(function (yes) {...})` run.

```js
158         $ok.on("click.dlg", function () { finish(true); });
159         $cancel.on("click.dlg", function () { finish(false); });
```

- **`"click.dlg"`** = the `click` event in the `dlg` **namespace**. It behaves like a normal click handler, but can be removed by namespace on line 154 without affecting any other click handlers.
- OK → `true`, Cancel → `false`.

```js
161         Modal.open($dlg, { static: true });
162         setTimeout(function () { $ok.trigger("focus"); }, 60);
164         return done.promise();
165     }
```

- **Line 161**: open it as **static** (no closing by clicking outside).
- **Line 162**: put focus on OK, so pressing **Enter** confirms it straight away. (60ms is just after the 50ms focus step in `Modal.open`, so this one wins.)
- **Line 164**: return the promise that the caller (`show`) waits on.

### `Dialog`: the public, easy-to-use API

```js
167     var Dialog = {
168         alert: function (opts) { return show($.extend({ showCancel: false }, opts)); },
```

- **`$.extend(target, source)`** copies every property of `source` onto `target` and returns it. So it starts with the defaults `{showCancel: false}`, and anything in `opts` is added on top (and wins).

> 🆕 **ES2018**: `show({ showCancel: false, ...opts })`, using **object spread**. See [17.6](#176-rest--and-spread-).

```js
169         success: function (title, message) { return Dialog.alert({ type: "success", title: title, message: message }); },
170         error:   function (title, message) { return Dialog.alert({ type: "error",   title: title, message: message }); },
171         warning: ...
172         info:    ...
```

- **Shortcuts**, so you can write `Dialog.success("Saved", "...")` instead of building an object each time.

```js
173         confirm: function (opts) {
174             return show($.extend({ type: "question", showCancel: true, okText: "Yes" }, opts));
175         }
176     };
178     window.Modal = Modal;
179     window.Dialog = Dialog;
```

- **`confirm`**: defaults to the question icon, a visible Cancel button and an OK button reading "Yes". The caller can override any of these (we use `okText: "Delete"`).
- **Lines 178–179**: share both objects.

## 13. `app.js` line by line

File: [assets/js/app.js](assets/js/app.js)

### Setup and state (lines 5–23)

```js
 8      var cfg = window.APP_CONFIG;
11      var state = {
12          students: [],
13          search: "",
14          course: "",
15          sortKey: "id",
16          sortDir: "asc",
17          page: 1,
18          pageSize: cfg.DEFAULT_PAGE_SIZE,
19          editing: null
20      };
23      var $body, $loader, $empty, $form, $saveBtn;
```

- **Lines 11–20**: one object holding **everything the page remembers**:
  - **12**: all students from the API.
  - **13**: the search text.
  - **14**: the chosen course (`""` = all).
  - **15–16**: the sort column and direction.
  - **17–18**: the current page and rows per page.
  - **19**: the student being edited (`null` while adding).
- **Line 23**: declares five variables **without values yet**. They're filled at start-up (lines 473–477), once the HTML is ready. They're "cached", meaning stored once instead of searching the page every time.

### `loadStudents` (lines 28–52)

```js
28      function loadStudents(highlightId) {
29          $loader.prop("hidden", false);
30          $empty.prop("hidden", true);
31          $body.empty();
```

- **Line 29**: show the spinner.
- **Line 30**: hide "No students found".
- **Line 31**: **`.empty()`** removes all the rows from `<tbody>`.

```js
33          return StudentAPI.list(0, cfg.FETCH_LIMIT)
34              .always(function () {
36                  $loader.prop("hidden", true);
37              })
```

- **Line 33**: **the AJAX call**: `GET /students?skip=0&limit=1000`. It returns straight away with a promise. The callbacks below run **later**, when the answer arrives.
- **Lines 34–37**: **`.always`**: runs on success **and** on failure. It hides the spinner. It's attached **first** because jQuery runs callbacks in the order they were added, so the spinner is hidden **before** `.done` draws the table.

```js
38              .done(function (data) {
39                  state.students = data || [];
40                  setApiStatus(true);
41                  refreshCourseOptions();
42                  renderStats();
43                  render(highlightId);
44              })
```

- **Line 38**: **`.done(fn)`** runs on success (status 200–299). `data` is the parsed JSON: an **array of student objects**.
- **Line 39**: save it in the state.
- **Lines 40–43**: green pill, fill the course dropdown, update the 4 cards, draw the table.

```js
45              .fail(function (xhr, textStatus) {
46                  setApiStatus(false);
47                  state.students = [];
48                  render();
49                  var err = parseApiError(xhr, textStatus);
50                  Dialog.error(err.title, err.message);
51              });
52      }
```

- **Line 45**: **`.fail(fn)`** runs on an error status, a timeout or a network failure.
- **Lines 46–50**: red pill, empty the data, draw the empty table, turn the error into a message and show the error dialog.

### `setApiStatus` (lines 54–59)

```js
55          $("#apiStatus")
56              .toggleClass("online", online)
57              .toggleClass("offline", !online)
58              .find(".label").text(online ? "API online" : "API offline");
```

- **Lines 56–57**: adds `online` and removes `offline`, or the other way round. The CSS colours the dot.
- **Line 58**: **`.find(".label")`** moves the chain to the label span **inside**, then sets its text.

### `getVisibleStudents` (lines 64–85)

```js
65          var q = state.search.toLowerCase();
```

- The search text in lower case, so the search ignores capitals.

```js
67          var list = state.students.filter(function (s) {
68              var matchesSearch = !q ||
69                  s.name.toLowerCase().indexOf(q) > -1 ||
70                  s.email.toLowerCase().indexOf(q) > -1 ||
71                  s.course.toLowerCase().indexOf(q) > -1 ||
72                  String(s.id) === q;
73              var matchesCourse = !state.course || s.course === state.course;
74              return matchesSearch && matchesCourse;
75          });
```

- **Line 67**: **`.filter`** keeps the students for which the function returns `true`. `s` is one student.
- **Lines 68–72**: `matchesSearch` is true if **any** of these are true (joined by `||`):
  - the search is empty (`!q`),
  - the name, email or course **contains** `q` (`.indexOf(q) > -1`),
  - or the id is exactly `q`.
  - `||` stops at the first `true` (this is called **short-circuiting**).
- **Line 73**: true if no course is chosen, or if the student's course is the chosen one.
- **Line 74**: keep the student only if **both** are true.

> 🆕 **ES6**: `s.name.toLowerCase().includes(q)`. `.includes` is clearer than `.indexOf(q) > -1`.

```js
77          var key = state.sortKey, dir = state.sortDir === "asc" ? 1 : -1;
78          list.sort(function (a, b) {
79              var x = a[key], y = b[key];
80              if (typeof x === "string") return x.localeCompare(y) * dir;
81              return (x - y) * dir;
82          });
84          return list;
```

- **Line 77**: `dir` is `1` for ascending, `-1` for descending.
- **Line 78**: **`.sort(compareFn)`** sorts the array **in place**. `compareFn(a, b)` must return:
  - **negative** → `a` goes first,
  - **positive** → `b` goes first,
  - **0** → keep them as they are.
- **Line 79**: **`a[key]`**: if `key` is `"name"`, this is `a.name`.
- **Line 80**: **`typeof x`** gives the type as text (`"string"`, `"number"`...). Text is compared with **`localeCompare`**, which returns a negative/0/positive number and handles alphabetical order properly.
- **Line 81**: numbers: `x - y` is negative if `x` is smaller. **× `dir`** flips the order for descending.

### `render` (lines 90–113)

```js
91          var list = getVisibleStudents();
92          var totalPages = Math.max(1, Math.ceil(list.length / state.pageSize));
93          state.page = Math.min(state.page, totalPages);
```

- **Line 92**:
  - **`Math.ceil`** rounds **up**: 23 students ÷ 10 = 2.3 → **3 pages**.
  - **`Math.max(1, ...)`**: at least 1 page, even with no students.
- **Line 93**: if you were on page 3 and a search leaves only 1 page, go back to page 1. **`Math.min`** picks the smaller number.

```js
95          var start = (state.page - 1) * state.pageSize;
96          var pageItems = list.slice(start, start + state.pageSize);
```

- **Line 95**: the index of the first item on this page. Page 1 → 0, page 2 → 10.
- **Line 96**: **`.slice(from, to)`** copies items from `from` up to (not including) `to`.

```js
98          $body.html(pageItems.map(rowHtml).join(""));
99          $empty.prop("hidden", list.length > 0);
```

- **Line 98**:
  - **`.map(rowHtml)`** passes the function `rowHtml` itself (no brackets), so `.map` calls it for each student: `rowHtml(student, index)`.
  - This gives an array of `<tr>...</tr>` strings, `.join("")` joins them, and **`.html(...)`** replaces the table body's content.
- **Line 99**: hide the empty message if there are results; show it if not.

```js
101         if (highlightId != null) {
102             $body.find("tr[data-id='" + highlightId + "']").addClass("flash");
103         }
```

- **`!= null`** (with one `=`) is true when the value is neither `null` nor `undefined`.
- **Line 102**: builds the selector `tr[data-id='7']` to find the new row, then adds `flash` (the green animation).

```js
105         $("#pageInfo").text(list.length
106             ? "Showing " + (start + 1) + "–" + (start + pageItems.length) + " of " + list.length
107             : "");
108         renderPagination(totalPages);
```

- **Lines 105–107**: a ternary split over three lines. With results it shows "Showing 11–20 of 23"; with none, nothing. The brackets in `(start + 1)` are needed: without them, `"Showing " + start + 1` would **join** the text `"10"` and `"1"` into `"101"`.
- **Line 108**: rebuild the page buttons.

```js
111         $(".sortable").removeClass("asc desc")
112             .filter("[data-sort='" + state.sortKey + "']").addClass(state.sortDir);
```

- **Line 111**: remove `asc` and `desc` from **all** headings (classes separated by a space).
- **Line 112**: **`.filter(selector)`** narrows the jQuery set to the heading for the current sort key, then adds `asc` or `desc` to it.

### `rowHtml` (lines 115–135)

```js
116         var e = Utils.escapeHtml;
117         var hue = Utils.hueFromString(s.name);
118         var courseHue = Utils.hueFromString(s.course);
```

- **Line 116**: a short alias, so we can write `e(s.name)` instead of `Utils.escapeHtml(s.name)`.
- **Lines 117–118**: colour numbers for the avatar and the course badge.

```js
119         return '' +
120             '<tr data-id="' + s.id + '" style="--i:' + index + '">' +
121                 '<td class="muted">#' + s.id + '</td>' +
122                 '<td><div class="cell-name">' +
123                     '<span class="avatar" style="--hue:' + hue + '">' + e(Utils.initials(s.name)) + '</span>' +
124                     '<span>' + e(s.name) + '<small class="show-md">' + e(s.email) + '</small></span>' +
125                 '</div></td>' +
126                 '<td>' + s.age + '</td>' +
127                 '<td class="hide-md">' + e(s.email) + '</td>' +
128                 '<td class="hide-sm"><span class="badge" style="--hue:' + courseHue + '">' + e(s.course) + '</span></td>' +
129                 '<td class="actions">' +
130                     actionBtn("view", ...) +
131                     actionBtn("edit", ...) +
132                     actionBtn("delete", ...) +
133                 '</td>' +
134             '</tr>';
```

- Builds one row by **joining strings** with `+`. The HTML is in **single quotes**, so double quotes can be used inside it for attributes.
- **Line 120**: `data-id` stores the id for later (button clicks). `--i` is the row number for the staggered animation.
- **Line 121**: the ID cell, for example `#3`.
- **Line 123**: the coloured avatar with the initials.
- **Line 124**: the name, plus the email in a `<small>` (shown only on small screens).
- **Line 126**: the age. It's a **number** from our own API, so it doesn't need escaping.
- **Lines 127–128**: the email and course columns.
- **Lines 130–132**: the three action buttons (see `actionBtn` below).
- **Every piece of text from the data goes through `e(...)`**, protecting against XSS.

> 🆕 **ES6**: this is a perfect case for **template literals**. See [17.3](#173-template-literals).

### `actionBtn` (lines 137–140)

```js
137     function actionBtn(cls, label, svgPath) {
138         return '<button type="button" class="action-btn ' + cls + '" data-action="' + cls + '" title="' + label + '" aria-label="' + label + '">' +
139                '<svg class="icon" viewBox="0 0 24 24">' + svgPath + '</svg></button>';
140     }
```

- Makes one icon button. `cls` is `"view"`, `"edit"` or `"delete"`, and it's used twice:
  - as a **class** (for the hover colour),
  - as **`data-action`** (so the click handler on line 413 knows which button was pressed).
- `title` is the tooltip; `aria-label` is for screen readers.

### `renderPagination` (lines 142–159)

```js
143         var p = state.page, html = [];
144         html.push(pageBtn("‹", p - 1, p === 1, false, "Previous page"));
```

- **Line 143**: `p` is the current page; `html` collects the button strings.
- **Line 144**: the **‹ previous** button. It goes to page `p - 1`, and is **disabled** when `p === 1`.

```js
147         var pages = [];
148         for (var i = 1; i <= totalPages; i++) {
149             if (i === 1 || i === totalPages || Math.abs(i - p) <= 1) pages.push(i);
150             else if (pages[pages.length - 1] !== "…") pages.push("…");
151         }
```

- **Line 148**: loop over every page number.
- **Line 149**: keep page `i` if it's the **first**, the **last**, or **next to the current page** (`Math.abs(i - p) <= 1` means the distance is 0 or 1).
- **Line 150**: otherwise add a `"…"`, but only if the last item isn't already `"…"` (so there's never `… …`).
- Example: 10 pages, on page 5 → `[1, "…", 4, 5, 6, "…", 10]`.

```js
152         pages.forEach(function (n) {
153             html.push(n === "…" ? '<span class="page-btn" aria-hidden="true" style="border:0;background:none">…</span>'
154                                 : pageBtn(n, n, false, n === p, "Page " + n));
155         });
```

- **`.forEach(fn)`** runs `fn` once for each item (like `map`, but it doesn't build a new array).
- `"…"` becomes a plain span. **`aria-hidden="true"`** hides it from screen readers, because it's only decoration.
- Numbers become buttons, **active** when `n === p`.

```js
157         html.push(pageBtn("›", p + 1, p === totalPages, false, "Next page"));
158         $("#pagination").html(html.join(""));
```

- The **› next** button, disabled on the last page. Then put everything on the page.

### `pageBtn` (lines 161–165)

```js
162         return '<button type="button" class="page-btn' + (active ? ' active' : '') + '" data-page="' + page + '"' +
163                (disabled ? ' disabled' : '') + (active ? ' aria-current="page"' : '') +
164                ' aria-label="' + label + '">' + text + '</button>';
```

- Adds the class `active`, the attribute `disabled`, and **`aria-current="page"`** (which tells screen readers "this is the current page") **only when needed**, using ternaries that add either the text or `''`.
- **`data-page`** stores which page to go to when clicked.

### `renderStats` (lines 167–184)

```js
168         var list = state.students;
169         var total = list.length;
170         var counts = {};
171         var ageSum = 0;
173         list.forEach(function (s) {
174             ageSum += s.age;
175             counts[s.course] = (counts[s.course] || 0) + 1;
176         });
```

- **Line 170**: an empty object, used as a **counter per course**.
- **Line 174**: **`+=`** means "add to": `ageSum = ageSum + s.age`.
- **Line 175**: `counts["Physics"]` is `undefined` the first time, so `|| 0` gives 0; then add 1. After the loop: `{ "Physics": 3, "Mathematics": 2, ... }`.

```js
178         var top = Object.keys(counts).sort(function (a, b) { return counts[b] - counts[a]; })[0];
```

- **`Object.keys(counts)`** → an array of the course names.
- **`.sort(...)`** by count, **largest first** (`b - a` instead of `a - b`).
- **`[0]`** takes the first one: the most popular course.

```js
180         animateNumber($("#statTotal"), total);
181         $("#statAvgAge").text(total ? (ageSum / total).toFixed(1) : "–");
182         animateNumber($("#statCourses"), Object.keys(counts).length);
183         $("#statTopCourse").text(top ? top + " (" + counts[top] + ")" : "–").attr("title", top || "");
```

- **Line 181**: the average age. **`.toFixed(1)`** gives one decimal place (`20.6`). If there are no students, show `–` (this also avoids dividing by 0).
- **Line 182**: the number of courses = the number of keys.
- **Line 183**: for example `"Physics (3)"`. **`.attr("title", ...)`** sets a tooltip with the full name, in case the text gets cut off with `…`.

### `animateNumber` (lines 186–194)

```js
187         var from = parseInt($el.text(), 10) || 0;
188         $({ n: from }).animate({ n: target }, {
189             duration: 600,
190             easing: "swing",
191             step: function (now) { $el.text(Math.round(now)); },
192             complete: function () { $el.text(target); }
193         });
```

- **Line 187**: **`parseInt(text, 10)`** reads a whole number from text, in base 10. `"–"` gives `NaN` ("not a number"), and `|| 0` turns that into 0.
- **Line 188**: **a jQuery trick**: `$({ n: from })` wraps a **plain object**, and **`.animate({ n: target })`** moves its `n` property from `from` to `target` gradually, just like it would animate a CSS property.
- **Line 189**: over 600ms.
- **Line 190**: **`"swing"`**: slow at the start and end, faster in the middle.
- **Line 191**: **`step`** runs on **every frame** with the current value (for example 12.47). It's rounded and written into the card.
- **Line 192**: **`complete`** runs at the end and writes the exact final number.

### `refreshCourseOptions` (lines 196–213)

```js
197         var courses = state.students
198             .map(function (s) { return s.course; })
199             .filter(function (c, i, arr) { return arr.indexOf(c) === i; })
200             .sort(function (a, b) { return a.localeCompare(b); });
```

- **Line 198**: a list of every student's course (with repeats).
- **Line 199**: **remove duplicates**. `.filter` also passes the item's index `i` and the whole array `arr`. `arr.indexOf(c)` finds the **first** position of `c`. If that's the current position, this is the first time we've seen it, so keep it; later copies are dropped.
- **Line 200**: alphabetical order.

> 🆕 **ES6**: `[...new Set(state.students.map(s => s.course))].sort()`. A **`Set`** can only hold each value once, so it removes duplicates for you. See [17.8](#178-new-built-ins-set-arrayfind-includes-objectentries).

```js
201         var $filter = $("#courseFilter");
202         var current = $filter.val();
204         $filter.find("option:not(:first)").remove();
205         $("#courseList").empty();
```

- **Line 202**: remember the course that's selected now.
- **Line 204**: remove every option **except the first** ("All courses"). **`:first`** is a jQuery filter; **`.remove()`** deletes elements from the page.
- **Line 205**: clear the datalist suggestions.

```js
206         courses.forEach(function (c) {
207             $filter.append($("<option>").val(c).text(c));
208             $("#courseList").append($("<option>").val(c));
209         });
```

- **Line 207**:
  - **`$("<option>")`**: when you pass **an HTML tag**, jQuery **creates a new element** instead of searching for one.
  - `.val(c)` sets its value and `.text(c)` its visible text (escaped, so safe).
  - **`.append(...)`** adds it as the **last child** of the dropdown.
- **Line 208**: the same for the form's suggestion list.

```js
211         if (courses.indexOf(current) > -1) $filter.val(current);
212         else { $filter.val(""); state.course = ""; }
```

- If the previously chosen course still exists, keep it selected. Otherwise (for example, its last student was deleted), go back to "All courses".

### `openForm` (lines 218–238)

```js
219         state.editing = student || null;
220         resetFormErrors();
221         $form[0].reset();
```

- **Line 219**: remember whether we're editing (a student object) or adding (`null`).
- **Line 220**: clear old red boxes and messages.
- **Line 221**: **`.reset()`** is a plain-JavaScript **form method** (not jQuery) that clears every input. `$form[0]` gets the real `<form>` element out of the jQuery object.

```js
223         if (student) {
224             $("#studentModalTitle").text("Edit Student #" + student.id);
225             $("#studentId").val(student.id);
226             $("#fName").val(student.name);
227             $("#fAge").val(student.age);
228             $("#fEmail").val(student.email);
229             $("#fCourse").val(student.course);
230             $saveBtn.find(".btn-label").text("Update");
```

- **Edit mode**. **`.val(value)`** puts a value into an input box. Each box is filled with the student's current data. The button says "Update".

```js
231         } else {
232             $("#studentModalTitle").text("Add Student");
233             $("#studentId").val("");
234             $saveBtn.find(".btn-label").text("Save");
235         }
237         Modal.open("#studentModal");
```

- **Add mode**: the boxes stay empty and the button says "Save".
- **Line 237**: **open the modal window.**

### `readForm` (lines 240–247)

```js
241         return {
242             name: $.trim($("#fName").val()),
243             age: $("#fAge").val() === "" ? null : Number($("#fAge").val()),
244             email: $.trim($("#fEmail").val()),
245             course: $.trim($("#fCourse").val())
246         };
```

- **`.val()`** with **no argument** **reads** the box's current value. The value is always **text**, even for `type="number"`.
- **`$.trim`** removes spaces at the start and end.
- **Line 243**: an empty age box → `null`; otherwise **`Number("20")`** → `20` (a real number, which the API needs).

### `validate` (lines 250–259)

```js
251         var errors = {};
252         if (!data.name) errors.name = "Name is required.";
253         if (data.age === null || isNaN(data.age)) errors.age = "Age is required.";
254         else if (!Number.isInteger(data.age) || data.age < 1 || data.age > 120) errors.age = "Age must be a whole number from 1 to 120.";
255         if (!data.email) errors.email = "Email is required.";
256         else if (!Utils.isValidEmail(data.email)) errors.email = "Enter a valid email address.";
257         if (!data.course) errors.course = "Course is required.";
258         return errors;
```

- **Line 251**: start with no errors.
- **Line 252**: an empty string counts as "false", so `!""` is `true` → the error is added.
- **Line 253**: **`isNaN(x)`** = "is Not a Number". For example `Number("abc")` gives `NaN`.
- **Line 254**: **`Number.isInteger(20.5)`** is `false`. So decimals and out-of-range ages are rejected. (`Number.isInteger` is an ES6 feature.)
- **Lines 255–256**: empty → "required"; otherwise check the format.
- **Line 258**: returns, for example, `{ age: "...", email: "..." }`. An empty `{}` means valid.

### `showFormErrors` and `resetFormErrors` (lines 261–273)

```js
262         resetFormErrors();
263         $.each(errors, function (field, msg) {
264             $form.find("[name='" + field + "']").addClass("is-invalid").attr("aria-invalid", "true");
265             $form.find(".field-error[data-for='" + field + "']").text(msg);
266         });
267         $form.find(".is-invalid").first().trigger("focus");
```

- **Line 263**: **`$.each(object, fn)`** loops over an object's properties, calling `fn(key, value)`. Here `field` = `"age"` and `msg` = the message.
- **Line 264**:
  - Builds the selector `[name='age']`, finds the age box, adds the red style, and sets **`aria-invalid="true"`** (screen readers then say "invalid").
- **Line 265**: writes the message into the matching `<small data-for="age">`.
- **Line 267**: puts the cursor in the **first** wrong box.

```js
271         $form.find(".is-invalid").removeClass("is-invalid").removeAttr("aria-invalid");
272         $form.find(".field-error").text("");
```

- Removes all red styles, ARIA flags and messages.

### `setSaving` (lines 275–278)

```js
276         $saveBtn.prop("disabled", saving);
277         $saveBtn.find(".spinner").prop("hidden", !saving);
```

- While saving: the button is **disabled** (so it can't be double-clicked) and the spinner is shown. When done: the opposite.

### `onSubmitForm`: the form's submit event (lines 280–326)

```js
280     function onSubmitForm(e) {
281         e.preventDefault();
```

- **Line 280**: jQuery passes the **submit event** `e`.
- **Line 281**: **the key line.** By default, a form submit **sends the data and reloads the page**. `preventDefault()` cancels that, so we can send it with AJAX and stay on the page.

```js
283         var data = readForm();
284         var errors = validate(data);
285         if (!$.isEmptyObject(errors)) {
286             showFormErrors(errors);
287             return;
288         }
```

- **Line 285**: **`$.isEmptyObject({})`** is `true`. If there **are** errors, show them and **stop**: no request is sent.

```js
290         var editing = state.editing;
291         var request;
293         if (editing) {
295             var changes = {};
296             ["name", "age", "email", "course"].forEach(function (k) {
297                 if (data[k] !== editing[k]) changes[k] = data[k];
298             });
```

- **Line 291**: will hold the AJAX promise.
- **Lines 295–298**: for each field name, if the new value is different from the old one, copy it into `changes`. If only the age changed: `changes = { age: 21 }`.

```js
299             if ($.isEmptyObject(changes)) {
300                 Modal.close("#studentModal");
301                 Dialog.info("No changes", "Nothing was modified, so no request was sent.");
302                 return;
303             }
304             request = StudentAPI.patch(editing.id, changes);
305         } else {
306             request = StudentAPI.create(data);
307         }
```

- **Lines 299–303**: nothing changed → close the form, show an info alert, stop.
- **Line 304**: **AJAX PATCH** with only the changes.
- **Line 306**: **AJAX POST** with the whole new student.

```js
309         setSaving(true);
310         request
311             .done(function (saved) {
312                 Modal.close("#studentModal");
313                 loadStudents(saved.id);
314                 Dialog.success(
315                     editing ? "Student updated" : "Student created",
316                     "<strong>" + Utils.escapeHtml(saved.name) + "</strong> (ID #" + saved.id + ") was " +
317                     (editing ? "updated" : "added") + " successfully."
318                 );
319             })
```

- **Line 309**: disable the button and show the spinner.
- **Line 311**: success. `saved` is the student the API sent back, **including its id**.
- **Line 312**: close the form modal.
- **Line 313**: reload the table and flash this student's row.
- **Lines 314–318**: show the success alert. The name is **escaped**, because the message is shown with `.html()`.

```js
320             .fail(function (xhr, textStatus) {
321                 var err = parseApiError(xhr, textStatus);
322                 if (!$.isEmptyObject(err.fieldErrors)) showFormErrors(err.fieldErrors);
323                 Dialog.error(err.title, err.message);
324             })
325             .always(function () { setSaving(false); });
```

- **Line 322**: if the server named specific fields (422), mark those boxes red too.
- **Line 323**: show the error alert **on top of** the still-open form.
- **Line 325**: success or failure, re-enable the button.

### `openView` (lines 331–350)

```js
333         StudentAPI.get(id)
334             .done(function (s) {
335                 var hue = Utils.hueFromString(s.name);
336                 $("#viewAvatar").text(Utils.initials(s.name)).css("--hue", hue);
337                 $("#viewName").text(s.name);
338                 $("#viewCourse").text(s.course).css("--hue", Utils.hueFromString(s.course));
339                 $("#viewId").text("#" + s.id);
340                 $("#viewAge").text(s.age + " years");
341                 $("#viewEmail").text(s.email);
342                 $("#btnViewEdit").data("student", s);
343                 Modal.open("#viewModal");
344             })
```

- **Line 333**: **AJAX GET** `/students/{id}`, a fresh copy from the server.
- **Line 336**: **`.css("--hue", hue)`** sets a CSS **variable** on the element from JavaScript (jQuery 3 supports this).
- **Lines 337–341**: fill in each field with **`.text()`** (safe).
- **Line 342**: store the student on the Edit button, so its click handler (line 421) knows which student to edit.
- **Line 343**: **open the modal window.**

```js
345             .fail(function (xhr, textStatus) {
346                 var err = parseApiError(xhr, textStatus);
347                 Dialog.error(err.title, err.message);
348                 if (xhr.status === 404) loadStudents();
349             });
```

- **Line 348**: if the student no longer exists (someone deleted it), reload the table so it disappears there too.

### `confirmDelete` (lines 352–373)

```js
353         Dialog.confirm({
354             title: "Delete student?",
355             message: "This will permanently remove <strong>" + Utils.escapeHtml(student.name) +
356                      "</strong> (ID #" + student.id + "). This cannot be undone.",
357             okText: "Delete",
358             cancelText: "Cancel",
359             danger: true
360         }).then(function (yes) {
361             if (!yes) return;
```

- **Lines 353–359**: show the **confirm modal**, with a red "Delete" button.
- **Line 360**: **`.then(fn)`** runs when the user clicks a button. `yes` is `true` for Delete, `false` for Cancel.
- **Line 361**: Cancel → stop here.

```js
362             StudentAPI.remove(student.id)
363                 .done(function () {
364                     var $row = $body.find("tr[data-id='" + student.id + "']");
365                     $row.fadeOut(250, function () { loadStudents(); });
366                     Dialog.success("Deleted", "<strong>" + Utils.escapeHtml(student.name) + "</strong> was removed.");
367                 })
368                 .fail(function (xhr, textStatus) { ... Dialog.error(...) });
369         });
```

- **Line 362**: **AJAX DELETE**.
- **Line 365**: **`.fadeOut(ms, callback)`** animates opacity to 0 over 250ms, hides the element, then calls the callback, which reloads the table.
- **Line 366**: the success alert.

### `findStudent` (lines 375–378)

```js
376         id = Number(id);
377         return state.students.filter(function (s) { return s.id === id; })[0];
```

- **Line 376**: makes sure `id` is a number, because `===` treats `"3"` and `3` as different.
- **Line 377**: filter for the matching student and take the first (`[0]`). It's `undefined` if not found.

> 🆕 **ES6**: `return state.students.find(s => s.id === Number(id));`. **`.find`** returns the first match directly.

### Theme (lines 383–393)

```js
384         var saved = null;
385         try { saved = localStorage.getItem(cfg.THEME_STORAGE_KEY); } catch (e) { }
386         var prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
387         applyTheme(saved || (prefersDark ? "dark" : "light"));
```

- **Line 385**:
  - **`localStorage.getItem(key)`** reads a value the browser saved earlier (or `null`).
  - **`try { ... } catch (e) { ... }`**: if the code in `try` throws an error (for example, storage is blocked in private mode), jump to `catch` instead of crashing. Here `catch` does nothing, and `saved` stays `null`.
- **Line 386**: **`window.matchMedia(query).matches`** runs a CSS media query from JavaScript: `true` if the computer is in dark mode. The `window.matchMedia &&` check guards against very old browsers.
- **Line 387**: use the saved choice, or else the system setting.

```js
391         document.documentElement.setAttribute("data-theme", theme);
392         try { localStorage.setItem(cfg.THEME_STORAGE_KEY, theme); } catch (e) { }
```

- **Line 391**: **`document.documentElement`** is `<html>`. **`setAttribute`** (plain JavaScript) sets `data-theme="dark"`, and the CSS swaps all the colours.
- **Line 392**: **`localStorage.setItem(key, value)`** saves it, so it's remembered after a reload.

### `bindEvents`: all the button events (lines 398–467)

```js
399         $("#btnAddStudent").on("click", function () { openForm(null); });
```

- **`.on("click", handler)`** = "**when this element is clicked, run this function**". This is the basic jQuery **button event**.
- Add Student → open the empty form.

```js
400         $("#btnRefresh").on("click", function () { loadStudents(); });
```

- Reload → fetch the list again. The handler is wrapped in `function () { ... }` so that `loadStudents` is called **without** the click event as its argument (otherwise the event would arrive as `highlightId`).

```js
401         $form.on("submit", onSubmitForm);
```

- Listens for the **form's `submit` event**, not a button click. It fires for **both** clicking Save and pressing **Enter** in a box. A **named function** is passed (no brackets: we pass the function, we don't call it).

```js
404         $form.on("input", ".input", function () {
405             $(this).removeClass("is-invalid").removeAttr("aria-invalid");
406             $form.find(".field-error[data-for='" + this.name + "']").text("");
407         });
```

- **The `input` event** fires on **every change** to a box's value (each key press, paste, or arrow click).
- It's **delegated** to `.input` elements inside the form.
- **`this`** is the box being typed in. **`this.name`** is its `name` attribute (`"age"`), read with plain JavaScript.
- As soon as you start fixing a field, its red style and message disappear.

```js
410         $body.on("click", "[data-action]", function () {
411             var id = $(this).closest("tr").data("id");
412             var student = findStudent(id);
413             var action = $(this).data("action");
414             if (action === "view") openView(id);
415             else if (action === "edit" && student) openForm(student);
416             else if (action === "delete" && student) confirmDelete(student);
417         });
```

- **One delegated listener for all the row buttons.** The rows are rebuilt on every `render()`, but `$body` (the `<tbody>`) stays the same, so the listener keeps working.
- **Line 411**: from the clicked button, go **up** to its `<tr>` and read **`data-id`**. jQuery's `.data()` turns `"3"` into the number `3` automatically.
- **Line 413**: read the button's **`data-action`** (`"view"`, `"edit"` or `"delete"`).
- **Lines 414–416**: call the matching function. `&& student` checks that the student was found.

```js
418         $body.on("dblclick", "tr", function () { openView($(this).data("id")); });
```

- **`dblclick`** = double click. Double-clicking anywhere on a row opens its details.

```js
420         $("#btnViewEdit").on("click", function () {
421             var s = $(this).data("student");
422             Modal.close("#viewModal");
423             setTimeout(function () { openForm(findStudent(s.id) || s); }, 260);
424         });
```

- **Line 421**: get the student stored on line 342.
- **Line 422**: close the View modal...
- **Line 423**: ...and **after its closing animation** (260ms), open the Edit form. Without the delay, the two animations would overlap.

```js
426         $("#searchInput").on("input", Utils.debounce(function () {
427             state.search = $.trim(this.value);
428             state.page = 1;
429             render();
430         }, cfg.SEARCH_DEBOUNCE_MS));
```

- **The search box**: the `input` event, wrapped in **`debounce`**, so it runs once you stop typing for 250ms.
- **`this.value`** is the box's text (plain JavaScript; the same as `$(this).val()`).
- Back to page 1 (results have changed), then redraw.

```js
432         $("#courseFilter").on("change", function () {
433             state.course = this.value;
434             state.page = 1;
435             render();
436         });
```

- **The `change` event** fires when a dropdown's choice changes.

```js
438         $("#pageSize").on("change", function () {
439             state.pageSize = Number(this.value);
440             state.page = 1;
441             render();
442         });
```

- The same for rows per page. `Number(...)`, because `"10"` is text.

```js
444         $("#pagination").on("click", "[data-page]:not(:disabled)", function () {
445             state.page = Number($(this).data("page"));
446             render();
447         });
```

- **Delegated** to the page buttons (they're rebuilt each time). **`:not(:disabled)`** ignores disabled ‹ and › buttons.
- Reads `data-page` and redraws.

```js
449         $(".sortable").on("click", function () {
450             var key = $(this).data("sort");
451             state.sortDir = (state.sortKey === key && state.sortDir === "asc") ? "desc" : "asc";
452             state.sortKey = key;
453             render();
454         });
```

- **`$(".sortable")`** selects **all** the sortable headings, and `.on` attaches the handler to **each** of them.
- **Line 451**: clicking the **same** column while it's ascending → descending. Anything else → ascending.

```js
456         $("#themeToggle").on("click", function () {
457             var current = document.documentElement.getAttribute("data-theme");
458             applyTheme(current === "dark" ? "light" : "dark");
459         });
```

- Read the current theme and switch to the other one.

```js
462         $(document).on("keydown", function (e) {
463             if (Modal.top().length || $(e.target).is("input, select, textarea")) return;
464             if (e.key === "/") { e.preventDefault(); $("#searchInput").trigger("focus"); }
465             if (e.key === "n") { e.preventDefault(); openForm(null); }
466         });
```

- **Keyboard shortcuts**, using a `keydown` listener on the whole document.
- **Line 463**: ignore keys if a modal is open, or if you're typing in a box. **`e.target`** is the element where the key was pressed.
- **Line 464**: **`/`** → jump to the search box. `preventDefault()` stops the `/` from being typed into it.
- **Line 465**: **`n`** → open the Add form.

### Start-up (lines 472–484)

```js
472     $(function () {
473         $body = $("#studentsBody");
474         $loader = $("#tableLoader");
475         $empty = $("#tableEmpty");
476         $form = $("#studentForm");
477         $saveBtn = $("#btnSaveStudent");
479         state.pageSize = Number($("#pageSize").val());
481         initTheme();
482         bindEvents();
483         loadStudents();
484     });
485 })(window, jQuery);
```

- **Line 472**: **`$(function () { ... })`** = "run this when the HTML is ready" (the **DOM ready** event).
- **Lines 473–477**: find the elements we use often and store them in the variables declared on line 23.
- **Line 479**: read the starting page size from the dropdown (the `selected` option).
- **Lines 481–483**: apply the theme, connect every event, then make the first AJAX call.

---

# Part E: Putting it together

## 14. Every button and its event, in one table

| What the user does | Element in `index.html` | Event | Listener in `app.js` / `modal.js` | What happens |
|---|---|---|---|---|
| Click **Add Student** | `#btnAddStudent` | `click` | app.js 399 | `openForm(null)` → `Modal.open("#studentModal")` |
| Click **Reload** | `#btnRefresh` | `click` | app.js 400 | `loadStudents()` → AJAX `GET /students` |
| Click **Save / Update**, or press Enter in the form | `#studentForm` (button is `type="submit"`) | `submit` | app.js 401 | `onSubmitForm` → validate → AJAX `POST` or `PATCH` |
| Type in a form box | `.input` inside the form | `input` (delegated) | app.js 404 | removes that box's error |
| Click 👁 in a row | `[data-action="view"]` | `click` (delegated on `<tbody>`) | app.js 410 | `openView(id)` → AJAX `GET /students/{id}` → `Modal.open("#viewModal")` |
| Click ✏️ in a row | `[data-action="edit"]` | `click` (delegated) | app.js 410 | `openForm(student)` |
| Click 🗑 in a row | `[data-action="delete"]` | `click` (delegated) | app.js 410 | `Dialog.confirm` → AJAX `DELETE` |
| Double-click a row | `tr` | `dblclick` (delegated) | app.js 418 | `openView(id)` |
| Click **Edit** in the details modal | `#btnViewEdit` | `click` | app.js 420 | close the view modal → open the form |
| Type in the search box | `#searchInput` | `input` (debounced) | app.js 426 | filter → `render()` |
| Choose a course | `#courseFilter` | `change` | app.js 432 | filter → `render()` |
| Choose rows per page | `#pageSize` | `change` | app.js 438 | `render()` |
| Click a page number | `[data-page]` | `click` (delegated) | app.js 444 | `render()` |
| Click a column heading | `.sortable` | `click` | app.js 449 | sort → `render()` |
| Click the sun/moon | `#themeToggle` | `click` | app.js 456 | `applyTheme(...)` |
| Press `/` or `n` | the page | `keydown` | app.js 462 | focus search / open the Add form |
| Click ×, Cancel, Close or the backdrop | `[data-dismiss="modal"]` | `click` (delegated on `document`) | modal.js 73 | `Modal.close(...)` (or shake if static) |
| Press **Esc** | the page | `keydown` | modal.js 83 | close the top modal / cancel the dialog |
| Press **Tab** in a modal | the page | `keydown` | modal.js 83 | keep focus inside the modal |
| Click **OK** in an alert | `#dialogOk` | `click.dlg` | modal.js 158 | `finish(true)` → resolve the promise |
| Click **Cancel** in a confirm | `#dialogCancel` | `click.dlg` | modal.js 159 | `finish(false)` → resolve the promise |

**Direct vs delegated events:**

```js
// DIRECT: attached to elements that exist right now
$("#btnAddStudent").on("click", handler);

// DELEGATED: attached to a parent that never changes;
// works for children added later (table rows, page buttons)
$body.on("click", "[data-action]", handler);
```

**Event names used in this project:**

| Event | Fires when |
|---|---|
| `click` | an element is clicked (or Enter/Space is pressed on a focused button) |
| `dblclick` | an element is double-clicked |
| `submit` | a form is submitted (submit button or Enter) |
| `input` | a box's value changes (every keystroke) |
| `change` | a dropdown's choice changes (or a box loses focus after a change) |
| `keydown` | a key is pressed down |
| `focus` | an element receives focus |

## 15. The life of a modal window, millisecond by millisecond

Example: clicking **Add Student**.

| Time | Code | What you see |
|---|---|---|
| 0 ms | click → `openForm(null)` → form reset | nothing yet |
| 0 ms | `Modal.open`: `hidden` removed | the modal is in the page, but at opacity 0 |
| 0 ms | `offsetWidth` reflow | the browser records the "before" state |
| 0 ms | `.addClass("show")` | the animation starts |
| 0 ms | `body.modal-open` | the page can't scroll |
| 0–220 ms | CSS transition | the backdrop fades in, the box rises and grows |
| 50 ms | `setTimeout` → focus | the cursor appears in the Name box |
| (user) | types, presses Save | |
| … | AJAX succeeds → `Modal.close` | |
| +0 ms | `.removeClass("show")` | the closing animation starts |
| +0–220 ms | CSS transition | the box fades and drops |
| +240 ms | `hidden` set, focus returned | gone; focus is back on the Add button |

## 16. The life of an AJAX request

Example: saving a new student.

```
app.js onSubmitForm
   │ data = { name: "Neha", age: 21, email: "neha@x.com", course: "Physics" }
   ▼
api.js StudentAPI.create(data)
   ▼
api.js request("POST", "/students", data)
   │ options = { url, method: "POST", dataType: "json", timeout: 10000,
   │             contentType: "application/json", data: JSON.stringify(data) }
   ▼
$.ajax(options) ──── returns a jqXHR promise IMMEDIATELY ───▶ back to app.js,
   │                                                         which attaches .done/.fail/.always
   │  (meanwhile, in the background)
   ▼
HTTP:  POST /students
       Content-Type: application/json
       {"name":"Neha","age":21,"email":"neha@x.com","course":"Physics"}
   ▼
FastAPI main.py create_student()
   │ validates with StudentCreate, gives it an id
   ▼
HTTP:  201 Created
       {"name":"Neha","age":21,"email":"neha@x.com","course":"Physics","id":6}
   ▼
jQuery parses the JSON (dataType: "json")
   ▼
status 2xx → .done(function (saved) { ... })   saved.id === 6
status 4xx/5xx, timeout or no connection → .fail(function (xhr, textStatus) { ... })
either way → .always(...)
```

---

# Part F: ES6

## 17. ES6 features explained with this project's code

Each section shows a real line from this project (**ES5**), then the same thing in **ES6+**.

### 17.1 `let` and `const` instead of `var`

```js
// ES5 (app.js line 65)
var q = state.search.toLowerCase();

// ES6
const q = state.search.toLowerCase();   // never reassigned → const
let page = 1;                           // will change later → let
```

| | `var` | `let` | `const` |
|---|---|---|---|
| Can be reassigned | yes | yes | **no** |
| Scope | the whole **function** | only the **block** `{ }` it's in | only the **block** |
| Can be used before its line | yes (as `undefined`; confusing) | no (error) | no (error) |

**Rule of thumb:** use `const` by default, `let` when the value must change, and never `var`.

`const` stops the variable being **pointed at something else**, but an object's **contents** can still change:

```js
const state = { page: 1 };
state.page = 2;      // ✅ allowed: changing a property
state = {};          // ❌ TypeError: assigning a new object
```

**Why block scope matters:** in `renderPagination` (line 148), `for (var i = 1; ...)` leaves `i` visible after the loop. With `let i`, `i` only exists inside the loop.

### 17.2 Arrow functions

```js
// ES5 (app.js line 198)
.map(function (s) { return s.course; })

// ES6
.map(s => s.course)
```

The rules:

| Form | Example |
|---|---|
| One parameter: brackets optional | `s => s.course` |
| None or several parameters: brackets needed | `() => loadStudents()`, `(a, b) => a - b` |
| One expression: `return` and `{ }` can be left out | `x => x * 2` |
| Several statements: use `{ }` and `return` | `s => { const n = s.name; return n; }` |
| Returning an object: wrap it in `( )` | `s => ({ id: s.id })` |

More examples from this project:

```js
// app.js line 178
Object.keys(counts).sort(function (a, b) { return counts[b] - counts[a]; })[0];
Object.keys(counts).sort((a, b) => counts[b] - counts[a])[0];

// modal.js line 52
stack = stack.filter(function (el) { return el !== $m[0]; });
stack = stack.filter(el => el !== $m[0]);

// app.js line 399
$("#btnAddStudent").on("click", function () { openForm(null); });
$("#btnAddStudent").on("click", () => openForm(null));
```

⚠️ **The big difference: arrow functions have no `this` of their own.** They use the `this` of the code around them. That's great inside `setTimeout`, but **a trap in jQuery handlers**. See [section 19](#19-es6-traps-when-using-jquery).

### 17.3 Template literals

Strings in **backticks** `` ` `` can contain **`${expression}`** placeholders and can span several lines.

```js
// ES5 (app.js line 106)
"Showing " + (start + 1) + "–" + (start + pageItems.length) + " of " + list.length

// ES6
`Showing ${start + 1}–${start + pageItems.length} of ${list.length}`
```

`rowHtml` becomes much easier to read:

```js
// ES6 version of rowHtml (app.js lines 115–135)
function rowHtml(s, index) {
    const e = Utils.escapeHtml;
    return `
        <tr data-id="${s.id}" style="--i:${index}">
            <td class="muted">#${s.id}</td>
            <td>
                <div class="cell-name">
                    <span class="avatar" style="--hue:${Utils.hueFromString(s.name)}">${e(Utils.initials(s.name))}</span>
                    <span>${e(s.name)}<small class="show-md">${e(s.email)}</small></span>
                </div>
            </td>
            <td>${s.age}</td>
            <td class="hide-md">${e(s.email)}</td>
            <td class="hide-sm"><span class="badge" style="--hue:${Utils.hueFromString(s.course)}">${e(s.course)}</span></td>
            <td class="actions">
                ${actionBtn("view", "View", VIEW_ICON)}
                ${actionBtn("edit", "Edit", EDIT_ICON)}
                ${actionBtn("delete", "Delete", DELETE_ICON)}
            </td>
        </tr>`;
}
```

⚠️ Template literals **do not escape** anything. `${s.name}` puts the raw text in. **Keep using `e(...)`** for any data from users or the API.

### 17.4 Default parameters

```js
// ES5 (modal.js lines 21, 24)
open: function (selector, options) {
    options = options || {};

// ES6
open(selector, options = {}) {
```

```js
// ES5 (api.js line 43)
list: function (skip, limit) {
    ... $.param({ skip: skip || 0, limit: limit || cfg.FETCH_LIMIT }) ...

// ES6
list(skip = 0, limit = cfg.FETCH_LIMIT) {
    ... $.param({ skip, limit }) ...
```

The default is used when the argument is **missing** (`undefined`). Unlike `||`, a real `0` is kept.

### 17.5 Shorthand properties and methods

```js
// ES5 (modal.js line 169)
Dialog.alert({ type: "success", title: title, message: message });

// ES6: when the property name equals the variable name, write it once
Dialog.alert({ type: "success", title, message });
```

```js
// ES5 (api.js)
var StudentAPI = {
    get: function (id) { ... },
};

// ES6: shorthand method
const StudentAPI = {
    get(id) { ... },
};
```

### 17.6 Rest `...` and spread `...`

The same three dots, used two ways.

**Spread** (unpacks things):

```js
// ES5 (modal.js line 174)
show($.extend({ type: "question", showCancel: true, okText: "Yes" }, opts));

// ES2018 object spread: copy defaults, then opts on top
show({ type: "question", showCancel: true, okText: "Yes", ...opts });
```

```js
// Array spread: copy an array
const copy = [...state.students];
```

**Rest** (collects things):

```js
// ES5 (utils.js line 43)
return function () {
    var ctx = this, args = arguments;
    ...
    fn.apply(ctx, args);

// ES6
return function (...args) {        // collect all arguments into a real array
    ...
    fn.apply(this, args);
```

### 17.7 Destructuring

Unpacks values from objects or arrays into variables.

```js
// ES5 (app.js line 49–50)
var err = parseApiError(xhr, textStatus);
Dialog.error(err.title, err.message);

// ES6
const { title, message } = parseApiError(xhr, textStatus);
Dialog.error(title, message);
```

```js
// ES5 (modal.js line 102)
var first = $f[0], last = $f[$f.length - 1];

// ES6 array destructuring (first item), plus .at(-1) for the last (ES2022)
const [first] = $f;
const last = $f.toArray().at(-1);
```

In function parameters:

```js
// ES6: take only the fields you need from the student object
function rowHtml({ id, name, age, email, course }, index) {
    return `<tr data-id="${id}">...`;
}
```

### 17.8 New built-ins: `Set`, `Array.find`, `includes`, `Object.entries`

```js
// ES5 (app.js lines 197–200): remove duplicates with filter + indexOf
var courses = state.students
    .map(function (s) { return s.course; })
    .filter(function (c, i, arr) { return arr.indexOf(c) === i; })
    .sort(...);

// ES6: a Set can only hold each value once
const courses = [...new Set(state.students.map(s => s.course))]
    .sort((a, b) => a.localeCompare(b));
```

```js
// ES5 (app.js line 377)
return state.students.filter(function (s) { return s.id === id; })[0];

// ES6: .find returns the first match (or undefined)
return state.students.find(s => s.id === id);
```

```js
// ES5 (app.js line 69)
s.name.toLowerCase().indexOf(q) > -1

// ES6 / ES2016
s.name.toLowerCase().includes(q)
```

```js
// ES5 (app.js line 263)
$.each(errors, function (field, msg) { ... });

// ES2017: Object.entries gives [key, value] pairs, plus destructuring
for (const [field, msg] of Object.entries(errors)) { ... }
```

`for...of` (ES6) loops over the **values** of an array (or other iterable), which is cleaner than a counting `for` loop.

### 17.9 Optional chaining `?.` and nullish `??`

```js
// ES5 (api.js line 88)
var detail = jqXHR.responseJSON && jqXHR.responseJSON.detail;

// ES2020
const detail = jqXHR.responseJSON?.detail;
```

`a?.b` means "`a.b`, but if `a` is `null` or `undefined`, give `undefined` instead of crashing".

```js
// ES5 (modal.js line 141)
var type = opts.type || "info";

// ES2020
const type = opts.type ?? "info";
```

`a ?? b` uses `b` **only** when `a` is `null` or `undefined`. `||` also replaces `0`, `""` and `false`, which is sometimes a bug. For example, `limit || 1000` turns a deliberate `0` into `1000`; `limit ?? 1000` keeps the `0`.

### 17.10 Modules (`import` / `export`) instead of IIFEs

Today each file wraps itself in an IIFE and shares things through `window`:

```js
// ES5 api.js
(function (window, $) {
    ...
    window.StudentAPI = StudentAPI;
})(window, jQuery);
```

With **ES modules**, each file is private automatically, and you **export** what to share and **import** what you need:

```js
// ES6 assets/js/api.js
import { APP_CONFIG as cfg } from "./config.js";
import { escapeHtml } from "./utils.js";

export const StudentAPI = { ... };
export function parseApiError(jqXHR, textStatus) { ... }
```

```js
// ES6 assets/js/app.js
import { StudentAPI, parseApiError } from "./api.js";
import { Modal, Dialog } from "./modal.js";
```

```html
<!-- index.html: only ONE script tag is needed; app.js imports the rest -->
<script src="https://code.jquery.com/jquery-3.7.1.min.js" ...></script>
<script type="module" src="assets/js/app.js"></script>
```

Benefits:
- No IIFE, no `window.X = X`, and strict mode is automatic.
- Each file **lists its dependencies at the top**, so the script order in the HTML no longer matters.
- Module scripts always run after the HTML has loaded (like `defer`).

⚠️ Modules **only work over `http://`**, not when you double-click the HTML file (`file://`). Serving through FastAPI (`/ui/`) or Live Server works.

### 17.11 Classes

`Modal` could be written as a **class**: a blueprint for objects that bundle data and functions.

```js
// ES6
class ModalWindow {
    constructor(selector) {          // runs when you write: new ModalWindow("#viewModal")
        this.$el = $(selector);
    }

    open({ isStatic = false } = {}) {   // destructured, defaulted options
        this.$el.data("static", isStatic).prop("hidden", false);
        this.$el[0].offsetWidth;        // reflow
        this.$el.addClass("show");
    }

    close() {
        this.$el.removeClass("show");
        setTimeout(() => this.$el.prop("hidden", true), 240);
    }
}

const studentModal = new ModalWindow("#studentModal");
studentModal.open();
studentModal.close();
```

- **`class`** defines the blueprint; **`new`** makes an object from it.
- **`constructor`** sets up each new object. **`this`** is the object being made.
- In `close()`, the arrow function inside `setTimeout` uses the **same `this`** as `close()`, which is exactly what we want here.

### 17.12 Native `Promise` and `async` / `await`

jQuery's `$.ajax` returns a jQuery promise, which also works with ES6 `async`/`await`:

```js
// ES5 (app.js lines 33–51)
StudentAPI.list(0, cfg.FETCH_LIMIT)
    .always(function () { $loader.prop("hidden", true); })
    .done(function (data) { state.students = data; render(); })
    .fail(function (xhr, textStatus) { /* show error */ });

// ES2017 async/await
async function loadStudents(highlightId) {
    $loader.prop("hidden", false);
    try {
        const data = await StudentAPI.list(0, cfg.FETCH_LIMIT);  // waits here
        state.students = data ?? [];
        setApiStatus(true);
        render(highlightId);
    } catch (xhr) {                                            // runs on any failure
        setApiStatus(false);
        const { title, message } = parseApiError(xhr, xhr.statusText);
        Dialog.error(title, message);
    } finally {                                                // runs either way
        $loader.prop("hidden", true);
    }
}
```

- **`async function`**: a function that can use `await`. It always returns a promise.
- **`await promise`**: **pauses** this function (not the whole page) until the promise finishes, then gives you its value. The code reads top to bottom, like normal code.
- **`try` / `catch` / `finally`** replace `.done` / `.fail` / `.always`.
- One difference: with `await`, the `textStatus` value (`"timeout"`) isn't passed to `catch`. `xhr.statusText` holds `"timeout"` in that case instead.

The confirm dialog becomes very readable:

```js
// ES2017
async function confirmDelete(student) {
    const yes = await Dialog.confirm({ title: "Delete student?", okText: "Delete", danger: true });
    if (!yes) return;
    await StudentAPI.remove(student.id);
    Dialog.success("Deleted", `<strong>${Utils.escapeHtml(student.name)}</strong> was removed.`);
    loadStudents();
}
```

The `$.Deferred` queue in `modal.js` could also use the native **`Promise`**:

```js
// ES6
let queue = Promise.resolve();                 // an already-finished promise

function show(opts) {
    const result = queue.then(() => render(opts));
    queue = result.catch(() => {});            // keep the queue going even if one fails
    return result;
}

function render(opts) {
    return new Promise(resolve => {            // resolve() is called when a button is clicked
        // ...fill the dialog...
        $ok.on("click.dlg", () => finish(true));
        function finish(value) { /* close */ setTimeout(() => resolve(value), 240); }
    });
}
```

### 17.13 `fetch` instead of `$.ajax` (no jQuery)

Modern browsers have **`fetch`**, a built-in way to make requests:

```js
// ES2017: the request() helper using fetch instead of $.ajax
async function request(method, path, data) {
    const res = await fetch(cfg.API_BASE_URL + path, {
        method,
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: data === undefined ? undefined : JSON.stringify(data),
        signal: AbortSignal.timeout(cfg.REQUEST_TIMEOUT_MS),
    });
    if (!res.ok) throw res;                       // fetch does NOT fail on 404/422 by itself!
    return res.status === 204 ? null : res.json();
}
```

Differences from `$.ajax`:

| | `$.ajax` | `fetch` |
|---|---|---|
| Needs jQuery | yes | no (built in) |
| Body | `data: JSON.stringify(...)` | `body: JSON.stringify(...)` |
| 404 / 422 responses | go to `.fail` | **succeed**; you must check `res.ok` |
| Parsing JSON | automatic with `dataType: "json"` | `await res.json()` |
| Timeout | `timeout: 10000` | `signal: AbortSignal.timeout(10000)` |

This project uses `$.ajax` because the task asked for jQuery AJAX, but it's good to know both.

## 18. Full ES6 version of `api.js`

The **same behaviour** as [api.js](assets/js/api.js), written with ES6+ features. Compare it line by line with [section 11](#11-apijs-line-by-line-jquery-ajax).

```js
// api.js (ES6+ version, written as a module)
import { APP_CONFIG as cfg } from "./config.js";
import { escapeHtml } from "./utils.js";

/** Shared wrapper around $.ajax so every request has the same settings. */
function request(method, path, data) {                 // a function declaration (unchanged)
    const options = {                                   // const: never reassigned
        url: `${cfg.API_BASE_URL}${path}`,              // template literal
        method,                                         // shorthand property
        dataType: method === "DELETE" ? "text" : "json",
        timeout: cfg.REQUEST_TIMEOUT_MS,
        headers: { Accept: "application/json" },
    };

    if (data !== undefined) {
        options.contentType = "application/json; charset=utf-8";
        options.data = JSON.stringify(data);
    }

    return $.ajax(options);
}

const studentUrl = id => `/students/${encodeURIComponent(id)}`;   // arrow function

export const StudentAPI = {
    list:    (skip = 0, limit = cfg.FETCH_LIMIT) => request("GET", `/students?${$.param({ skip, limit })}`),
    get:     id            => request("GET",    studentUrl(id)),
    create:  student       => request("POST",   "/students", student),
    replace: (id, student) => request("PUT",    studentUrl(id), student),
    patch:   (id, changes) => request("PATCH",  studentUrl(id), changes),
    remove:  id            => request("DELETE", studentUrl(id)),
    ping:    ()            => request("GET",    "/"),
};

export function parseApiError(jqXHR, textStatus) {
    const result = { status: jqXHR.status, title: "Request failed", message: "", fieldErrors: {} };

    if (textStatus === "timeout") {
        return { ...result, title: "Request timed out",                         // object spread
                 message: "The server took too long to respond. Please try again." };
    }
    if (jqXHR.status === 0) {
        return { ...result, title: "Cannot reach the API",
                 message: "Make sure the FastAPI server is running:<br><code>uvicorn main:app --reload</code>" };
    }

    const detail = jqXHR.responseJSON?.detail;                                   // optional chaining

    if (Array.isArray(detail)) {
        const items = detail.map(({ loc, msg = "Invalid value" }) => {           // destructuring + default
            const field = loc?.at(-1);                                           // last item of loc
            if (typeof field === "string") result.fieldErrors[field] = msg;
            return `<li><strong>${escapeHtml(field ?? "field")}</strong>: ${escapeHtml(msg)}</li>`;
        });
        return { ...result, title: "Validation error", message: `<ul>${items.join("")}</ul>` };
    }

    if (typeof detail === "string") {
        return {
            ...result,
            title: jqXHR.status === 404 ? "Not found" : `Error ${jqXHR.status}`,
            message: escapeHtml(detail),
        };
    }

    return {
        ...result,
        title: `Error ${jqXHR.status}`,
        message: escapeHtml(jqXHR.statusText || "Unexpected server error."),
    };
}
```

The ES6 features used, line by line:

- **`import` / `export`**: modules, replacing the IIFE and `window.X = X` ([17.10](#1710-modules-import--export-instead-of-iifes)).
- **`const`**: every variable here is never reassigned ([17.1](#171-let-and-const-instead-of-var)).
- **`` `${cfg.API_BASE_URL}${path}` ``**: a template literal ([17.3](#173-template-literals)).
- **`method,`**: a shorthand property ([17.5](#175-shorthand-properties-and-methods)).
- **`dataType: method === "DELETE" ? "text" : "json"`**: the DELETE special case moved into one line.
- **`id => ...`**, **`(id, student) => ...`**: arrow functions with implicit return ([17.2](#172-arrow-functions)).
- **`(skip = 0, limit = cfg.FETCH_LIMIT)`**: default parameters ([17.4](#174-default-parameters)).
- **`$.param({ skip, limit })`**: shorthand properties.
- **`{ ...result, title: ... }`**: object spread, making a copy with some values changed ([17.6](#176-rest--and-spread-)).
- **`jqXHR.responseJSON?.detail`**, **`loc?.at(-1)`**: optional chaining; `.at(-1)` is the last item ([17.9](#179-optional-chaining--and-nullish-)).
- **`({ loc, msg = "Invalid value" }) =>`**: destructuring the error object in the parameter, with a default ([17.7](#177-destructuring)).
- **`field ?? "field"`**: nullish coalescing.
- **Trailing commas** (`ping: ... ,` before `}`): allowed in modern JavaScript, and they make adding new lines cleaner.

## 19. ES6 traps when using jQuery

### Trap 1: arrow functions and `this` in event handlers

In a **normal** `function`, jQuery sets **`this`** to the element that the event happened on. An **arrow function** ignores that and keeps the outer `this` (which is `undefined` in strict mode or modules).

```js
// ✅ ES5: works. `this` is the clicked button
$body.on("click", "[data-action]", function () {
    var action = $(this).data("action");
});

// ❌ ES6: BROKEN. `this` is NOT the button
$body.on("click", "[data-action]", () => {
    const action = $(this).data("action");   // undefined!
});

// ✅ ES6: use the event object instead
$body.on("click", "[data-action]", (e) => {
    const action = $(e.currentTarget).data("action");
});
```

- **`e.currentTarget`** is the element that matched the handler (the button). In a delegated handler, jQuery sets it to the matching child, which is the same element `this` would be.
- **`e.target`** is the **exact** element clicked, which might be the `<svg>` or `<path>` **inside** the button. That's why `currentTarget` is the right choice here.

In this project, `this` is used in handlers at: app.js lines 405–406, 411, 413, 418, 421, 427, 433, 439, 445, 450, and modal.js line 74–75. All of these would need `e.currentTarget` if they became arrow functions.

### Trap 2: `$.each` and `.each` arguments are in a different order to `forEach`

```js
// jQuery: (index, item)
$(".sortable").each(function (index, el) { ... });

// Array.forEach: (item, index)
[1, 2, 3].forEach((item, index) => { ... });
```

### Trap 3: jQuery promises and `async`/`await`

`await $.ajax(...)` works (jQuery 3 promises follow the standard). But:

- **`.done` / `.fail` / `.always` don't exist on native `Promise`s.** If you change `request()` to use `fetch`, every `.done(...)` must become `.then(...)`, and every `.fail(...)` must become `.catch(...)`.
- With `await`, a failed `$.ajax` **throws the jqXHR object**, so `catch (xhr)` receives it, but **not** `textStatus` (see [17.12](#1712-native-promise-and-async--await)).

### Trap 4: modules don't create globals

With `<script type="module">`, nothing is on `window` unless you put it there. So typing `StudentAPI.list()` in the browser **Console** won't work anymore. For testing, you can add `window.StudentAPI = StudentAPI;` temporarily.

---

**Tip:** to practise ES6, choose one small function (for example `findStudent` or `renderStats`), rewrite it with the features in Part F, and check in the browser that everything still works. Then move on to the next one.
