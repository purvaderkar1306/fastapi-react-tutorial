/* =====================================================================
   api.js — every call to the FastAPI backend, using jQuery $.ajax
   Each method returns a jQuery Promise (use .done / .fail / .always).

   Endpoints (see main.py):
     GET    /students?skip=&limit=   list students
     GET    /students/{id}           get one student
     POST   /students                create
     PUT    /students/{id}           replace (all fields)
     PATCH  /students/{id}           update only the fields sent
     DELETE /students/{id}           delete (204, no body)
   ===================================================================== */
(function (window, $) {
    "use strict";

    var cfg = window.APP_CONFIG;

    /** Shared wrapper around $.ajax so every request has the same settings. */
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

        // DELETE returns 204 No Content: don't try to parse JSON from an empty body
        if (method === "DELETE") {
            options.dataType = "text";
        }

        return $.ajax(options);
    }

    var StudentAPI = {
        list: function (skip, limit) {
            return request("GET", "/students?" + $.param({ skip: skip || 0, limit: limit || cfg.FETCH_LIMIT }));
        },
        get: function (id) {
            return request("GET", "/students/" + encodeURIComponent(id));
        },
        create: function (student) {
            return request("POST", "/students", student);
        },
        replace: function (id, student) {
            return request("PUT", "/students/" + encodeURIComponent(id), student);
        },
        patch: function (id, changes) {
            return request("PATCH", "/students/" + encodeURIComponent(id), changes);
        },
        remove: function (id) {
            return request("DELETE", "/students/" + encodeURIComponent(id));
        },
        /** Simple health check against GET / */
        ping: function () {
            return request("GET", "/");
        }
    };

    /**
     * Turn a failed jqXHR into something the UI can show.
     * Returns { status, title, message, fieldErrors: {field: msg} }
     *
     * FastAPI error bodies look like:
     *   404 -> {"detail": "Student 9 not found"}
     *   422 -> {"detail": [{"loc": ["body","email"], "msg": "value is not a valid email", ...}]}
     */
    function parseError(jqXHR, textStatus) {
        var result = { status: jqXHR.status, title: "Request failed", message: "", fieldErrors: {} };

        if (textStatus === "timeout") {
            result.title = "Request timed out";
            result.message = "The server took too long to respond. Please try again.";
            return result;
        }
        if (jqXHR.status === 0) {
            result.title = "Cannot reach the API";
            result.message = "Make sure the FastAPI server is running:<br><code>uvicorn main:app --reload</code>";
            return result;
        }

        var detail = jqXHR.responseJSON && jqXHR.responseJSON.detail;

        if (Array.isArray(detail)) {
            result.title = "Validation error";
            var items = detail.map(function (err) {
                var field = err.loc && err.loc[err.loc.length - 1];
                var msg = err.msg || "Invalid value";
                if (field && typeof field === "string") {
                    result.fieldErrors[field] = msg;
                }
                return "<li><strong>" + Utils.escapeHtml(field || "field") + "</strong>: " + Utils.escapeHtml(msg) + "</li>";
            });
            result.message = "<ul>" + items.join("") + "</ul>";
        } else if (typeof detail === "string") {
            result.title = jqXHR.status === 404 ? "Not found" : "Error " + jqXHR.status;
            result.message = Utils.escapeHtml(detail);
        } else {
            result.title = "Error " + jqXHR.status;
            result.message = Utils.escapeHtml(jqXHR.statusText || "Unexpected server error.");
        }
        return result;
    }

    window.StudentAPI = StudentAPI;
    window.parseApiError = parseError;
})(window, jQuery);
