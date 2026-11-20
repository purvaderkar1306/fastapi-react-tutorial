/* =====================================================================
   app.js — page controller: state, rendering, events
   Depends on: jQuery, config.js, utils.js, api.js, modal.js
   ===================================================================== */
(function (window, $) {
    "use strict";

    var cfg = window.APP_CONFIG;

    /* ---------------- State ---------------- */
    var state = {
        students: [],       // everything returned by GET /students
        search: "",
        course: "",
        sortKey: "id",
        sortDir: "asc",
        page: 1,
        pageSize: cfg.DEFAULT_PAGE_SIZE,
        editing: null       // student object being edited, or null when adding
    };

    /* ---------------- Cached elements ---------------- */
    var $body, $loader, $empty, $form, $saveBtn;

    /* =====================================================================
       Data loading
       ===================================================================== */
    function loadStudents(highlightId) {
        $loader.prop("hidden", false);
        $empty.prop("hidden", true);
        $body.empty();

        return StudentAPI.list(0, cfg.FETCH_LIMIT)
            .always(function () {
                // registered first so the loader is hidden before render() runs
                $loader.prop("hidden", true);
            })
            .done(function (data) {
                state.students = data || [];
                setApiStatus(true);
                refreshCourseOptions();
                renderStats();
                render(highlightId);
            })
            .fail(function (xhr, textStatus) {
                setApiStatus(false);
                state.students = [];
                render();
                var err = parseApiError(xhr, textStatus);
                Dialog.error(err.title, err.message);
            });
    }

    function setApiStatus(online) {
        $("#apiStatus")
            .toggleClass("online", online)
            .toggleClass("offline", !online)
            .find(".label").text(online ? "API online" : "API offline");
    }

    /* =====================================================================
       Filtering, sorting, pagination
       ===================================================================== */
    function getVisibleStudents() {
        var q = state.search.toLowerCase();

        var list = state.students.filter(function (s) {
            var matchesSearch = !q ||
                s.name.toLowerCase().indexOf(q) > -1 ||
                s.email.toLowerCase().indexOf(q) > -1 ||
                s.course.toLowerCase().indexOf(q) > -1 ||
                String(s.id) === q;
            var matchesCourse = !state.course || s.course === state.course;
            return matchesSearch && matchesCourse;
        });

        var key = state.sortKey, dir = state.sortDir === "asc" ? 1 : -1;
        list.sort(function (a, b) {
            var x = a[key], y = b[key];
            if (typeof x === "string") return x.localeCompare(y) * dir;
            return (x - y) * dir;
        });

        return list;
    }

    /* =====================================================================
       Rendering
       ===================================================================== */
    function render(highlightId) {
        var list = getVisibleStudents();
        var totalPages = Math.max(1, Math.ceil(list.length / state.pageSize));
        state.page = Math.min(state.page, totalPages);

        var start = (state.page - 1) * state.pageSize;
        var pageItems = list.slice(start, start + state.pageSize);

        $body.html(pageItems.map(rowHtml).join(""));
        $empty.prop("hidden", list.length > 0);

        if (highlightId != null) {
            $body.find("tr[data-id='" + highlightId + "']").addClass("flash");
        }

        $("#pageInfo").text(list.length
            ? "Showing " + (start + 1) + "–" + (start + pageItems.length) + " of " + list.length
            : "");
        renderPagination(totalPages);

        // sort indicators
        $(".sortable").removeClass("asc desc")
            .filter("[data-sort='" + state.sortKey + "']").addClass(state.sortDir);
    }

    function rowHtml(s, index) {
        var e = Utils.escapeHtml;
        var hue = Utils.hueFromString(s.name);
        var courseHue = Utils.hueFromString(s.course);
        return '' +
            '<tr data-id="' + s.id + '" style="--i:' + index + '">' +
                '<td class="muted">#' + s.id + '</td>' +
                '<td><div class="cell-name">' +
                    '<span class="avatar" style="--hue:' + hue + '">' + e(Utils.initials(s.name)) + '</span>' +
                    '<span>' + e(s.name) + '<small class="show-md">' + e(s.email) + '</small></span>' +
                '</div></td>' +
                '<td>' + s.age + '</td>' +
                '<td class="hide-md">' + e(s.email) + '</td>' +
                '<td class="hide-sm"><span class="badge" style="--hue:' + courseHue + '">' + e(s.course) + '</span></td>' +
                '<td class="actions">' +
                    actionBtn("view", "View", '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>') +
                    actionBtn("edit", "Edit", '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>') +
                    actionBtn("delete", "Delete", '<path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/>') +
                '</td>' +
            '</tr>';
    }

    function actionBtn(cls, label, svgPath) {
        return '<button type="button" class="action-btn ' + cls + '" data-action="' + cls + '" title="' + label + '" aria-label="' + label + '">' +
               '<svg class="icon" viewBox="0 0 24 24">' + svgPath + '</svg></button>';
    }

    function renderPagination(totalPages) {
        var p = state.page, html = [];
        html.push(pageBtn("‹", p - 1, p === 1, false, "Previous page"));

        // compact range: 1 … p-1 p p+1 … N
        var pages = [];
        for (var i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || Math.abs(i - p) <= 1) pages.push(i);
            else if (pages[pages.length - 1] !== "…") pages.push("…");
        }
        pages.forEach(function (n) {
            html.push(n === "…" ? '<span class="page-btn" aria-hidden="true" style="border:0;background:none">…</span>'
                                : pageBtn(n, n, false, n === p, "Page " + n));
        });

        html.push(pageBtn("›", p + 1, p === totalPages, false, "Next page"));
        $("#pagination").html(html.join(""));
    }

    function pageBtn(text, page, disabled, active, label) {
        return '<button type="button" class="page-btn' + (active ? ' active' : '') + '" data-page="' + page + '"' +
               (disabled ? ' disabled' : '') + (active ? ' aria-current="page"' : '') +
               ' aria-label="' + label + '">' + text + '</button>';
    }

    function renderStats() {
        var list = state.students;
        var total = list.length;
        var counts = {};
        var ageSum = 0;

        list.forEach(function (s) {
            ageSum += s.age;
            counts[s.course] = (counts[s.course] || 0) + 1;
        });

        var top = Object.keys(counts).sort(function (a, b) { return counts[b] - counts[a]; })[0];

        animateNumber($("#statTotal"), total);
        $("#statAvgAge").text(total ? (ageSum / total).toFixed(1) : "–");
        animateNumber($("#statCourses"), Object.keys(counts).length);
        $("#statTopCourse").text(top ? top + " (" + counts[top] + ")" : "–").attr("title", top || "");
    }

    function animateNumber($el, target) {
        var from = parseInt($el.text(), 10) || 0;
        $({ n: from }).animate({ n: target }, {
            duration: 600,
            easing: "swing",
            step: function (now) { $el.text(Math.round(now)); },
            complete: function () { $el.text(target); }
        });
    }

    function refreshCourseOptions() {
        var courses = state.students
            .map(function (s) { return s.course; })
            .filter(function (c, i, arr) { return arr.indexOf(c) === i; })
            .sort(function (a, b) { return a.localeCompare(b); });
        var $filter = $("#courseFilter");
        var current = $filter.val();

        $filter.find("option:not(:first)").remove();
        $("#courseList").empty();
        courses.forEach(function (c) {
            $filter.append($("<option>").val(c).text(c));
            $("#courseList").append($("<option>").val(c));
        });

        if (courses.indexOf(current) > -1) $filter.val(current);
        else { $filter.val(""); state.course = ""; }
    }

    /* =====================================================================
       Add / Edit form modal
       ===================================================================== */
    function openForm(student) {
        state.editing = student || null;
        resetFormErrors();
        $form[0].reset();

        if (student) {
            $("#studentModalTitle").text("Edit Student #" + student.id);
            $("#studentId").val(student.id);
            $("#fName").val(student.name);
            $("#fAge").val(student.age);
            $("#fEmail").val(student.email);
            $("#fCourse").val(student.course);
            $saveBtn.find(".btn-label").text("Update");
        } else {
            $("#studentModalTitle").text("Add Student");
            $("#studentId").val("");
            $saveBtn.find(".btn-label").text("Save");
        }

        Modal.open("#studentModal");
    }

    function readForm() {
        return {
            name: $.trim($("#fName").val()),
            age: $("#fAge").val() === "" ? null : Number($("#fAge").val()),
            email: $.trim($("#fEmail").val()),
            course: $.trim($("#fCourse").val())
        };
    }

    /** Client-side checks that mirror the Pydantic rules in model.py */
    function validate(data) {
        var errors = {};
        if (!data.name) errors.name = "Name is required.";
        if (data.age === null || isNaN(data.age)) errors.age = "Age is required.";
        else if (!Number.isInteger(data.age) || data.age < 1 || data.age > 120) errors.age = "Age must be a whole number from 1 to 120.";
        if (!data.email) errors.email = "Email is required.";
        else if (!Utils.isValidEmail(data.email)) errors.email = "Enter a valid email address.";
        if (!data.course) errors.course = "Course is required.";
        return errors;
    }

    function showFormErrors(errors) {
        resetFormErrors();
        $.each(errors, function (field, msg) {
            $form.find("[name='" + field + "']").addClass("is-invalid").attr("aria-invalid", "true");
            $form.find(".field-error[data-for='" + field + "']").text(msg);
        });
        $form.find(".is-invalid").first().trigger("focus");
    }

    function resetFormErrors() {
        $form.find(".is-invalid").removeClass("is-invalid").removeAttr("aria-invalid");
        $form.find(".field-error").text("");
    }

    function setSaving(saving) {
        $saveBtn.prop("disabled", saving);
        $saveBtn.find(".spinner").prop("hidden", !saving);
    }

    function onSubmitForm(e) {
        e.preventDefault();

        var data = readForm();
        var errors = validate(data);
        if (!$.isEmptyObject(errors)) {
            showFormErrors(errors);
            return;
        }

        var editing = state.editing;
        var request;

        if (editing) {
            // PATCH only the fields that actually changed
            var changes = {};
            ["name", "age", "email", "course"].forEach(function (k) {
                if (data[k] !== editing[k]) changes[k] = data[k];
            });
            if ($.isEmptyObject(changes)) {
                Modal.close("#studentModal");
                Dialog.info("No changes", "Nothing was modified, so no request was sent.");
                return;
            }
            request = StudentAPI.patch(editing.id, changes);
        } else {
            request = StudentAPI.create(data);
        }

        setSaving(true);
        request
            .done(function (saved) {
                Modal.close("#studentModal");
                loadStudents(saved.id);
                Dialog.success(
                    editing ? "Student updated" : "Student created",
                    "<strong>" + Utils.escapeHtml(saved.name) + "</strong> (ID #" + saved.id + ") was " +
                    (editing ? "updated" : "added") + " successfully."
                );
            })
            .fail(function (xhr, textStatus) {
                var err = parseApiError(xhr, textStatus);
                if (!$.isEmptyObject(err.fieldErrors)) showFormErrors(err.fieldErrors);
                Dialog.error(err.title, err.message);
            })
            .always(function () { setSaving(false); });
    }

    /* =====================================================================
       View & delete
       ===================================================================== */
    function openView(id) {
        // Fetch a fresh copy from GET /students/{id}
        StudentAPI.get(id)
            .done(function (s) {
                var hue = Utils.hueFromString(s.name);
                $("#viewAvatar").text(Utils.initials(s.name)).css("--hue", hue);
                $("#viewName").text(s.name);
                $("#viewCourse").text(s.course).css("--hue", Utils.hueFromString(s.course));
                $("#viewId").text("#" + s.id);
                $("#viewAge").text(s.age + " years");
                $("#viewEmail").text(s.email);
                $("#btnViewEdit").data("student", s);
                Modal.open("#viewModal");
            })
            .fail(function (xhr, textStatus) {
                var err = parseApiError(xhr, textStatus);
                Dialog.error(err.title, err.message);
                if (xhr.status === 404) loadStudents();
            });
    }

    function confirmDelete(student) {
        Dialog.confirm({
            title: "Delete student?",
            message: "This will permanently remove <strong>" + Utils.escapeHtml(student.name) +
                     "</strong> (ID #" + student.id + "). This cannot be undone.",
            okText: "Delete",
            cancelText: "Cancel",
            danger: true
        }).then(function (yes) {
            if (!yes) return;
            StudentAPI.remove(student.id)
                .done(function () {
                    var $row = $body.find("tr[data-id='" + student.id + "']");
                    $row.fadeOut(250, function () { loadStudents(); });
                    Dialog.success("Deleted", "<strong>" + Utils.escapeHtml(student.name) + "</strong> was removed.");
                })
                .fail(function (xhr, textStatus) {
                    var err = parseApiError(xhr, textStatus);
                    Dialog.error(err.title, err.message);
                });
        });
    }

    function findStudent(id) {
        id = Number(id);
        return state.students.filter(function (s) { return s.id === id; })[0];
    }

    /* =====================================================================
       Theme
       ===================================================================== */
    function initTheme() {
        var saved = null;
        try { saved = localStorage.getItem(cfg.THEME_STORAGE_KEY); } catch (e) { /* storage unavailable */ }
        var prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
        applyTheme(saved || (prefersDark ? "dark" : "light"));
    }

    function applyTheme(theme) {
        document.documentElement.setAttribute("data-theme", theme);
        try { localStorage.setItem(cfg.THEME_STORAGE_KEY, theme); } catch (e) { /* ignore */ }
    }

    /* =====================================================================
       Event wiring
       ===================================================================== */
    function bindEvents() {
        $("#btnAddStudent").on("click", function () { openForm(null); });
        $("#btnRefresh").on("click", function () { loadStudents(); });
        $form.on("submit", onSubmitForm);

        // clear a field's error as soon as the user edits it
        $form.on("input", ".input", function () {
            $(this).removeClass("is-invalid").removeAttr("aria-invalid");
            $form.find(".field-error[data-for='" + this.name + "']").text("");
        });

        // row actions (event delegation: rows are re-rendered often)
        $body.on("click", "[data-action]", function () {
            var id = $(this).closest("tr").data("id");
            var student = findStudent(id);
            var action = $(this).data("action");
            if (action === "view") openView(id);
            else if (action === "edit" && student) openForm(student);
            else if (action === "delete" && student) confirmDelete(student);
        });
        $body.on("dblclick", "tr", function () { openView($(this).data("id")); });

        $("#btnViewEdit").on("click", function () {
            var s = $(this).data("student");
            Modal.close("#viewModal");
            setTimeout(function () { openForm(findStudent(s.id) || s); }, 260);
        });

        $("#searchInput").on("input", Utils.debounce(function () {
            state.search = $.trim(this.value);
            state.page = 1;
            render();
        }, cfg.SEARCH_DEBOUNCE_MS));

        $("#courseFilter").on("change", function () {
            state.course = this.value;
            state.page = 1;
            render();
        });

        $("#pageSize").on("change", function () {
            state.pageSize = Number(this.value);
            state.page = 1;
            render();
        });

        $("#pagination").on("click", "[data-page]:not(:disabled)", function () {
            state.page = Number($(this).data("page"));
            render();
        });

        $(".sortable").on("click", function () {
            var key = $(this).data("sort");
            state.sortDir = (state.sortKey === key && state.sortDir === "asc") ? "desc" : "asc";
            state.sortKey = key;
            render();
        });

        $("#themeToggle").on("click", function () {
            var current = document.documentElement.getAttribute("data-theme");
            applyTheme(current === "dark" ? "light" : "dark");
        });

        // Keyboard shortcut: "/" focuses search, "n" opens Add form
        $(document).on("keydown", function (e) {
            if (Modal.top().length || $(e.target).is("input, select, textarea")) return;
            if (e.key === "/") { e.preventDefault(); $("#searchInput").trigger("focus"); }
            if (e.key === "n") { e.preventDefault(); openForm(null); }
        });
    }

    /* =====================================================================
       Boot
       ===================================================================== */
    $(function () {
        $body = $("#studentsBody");
        $loader = $("#tableLoader");
        $empty = $("#tableEmpty");
        $form = $("#studentForm");
        $saveBtn = $("#btnSaveStudent");

        state.pageSize = Number($("#pageSize").val());

        initTheme();
        bindEvents();
        loadStudents();
    });
})(window, jQuery);
