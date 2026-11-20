/* =====================================================================
   config.js — app-wide settings
   ===================================================================== */
(function (window) {
    "use strict";

    // When the page is served by FastAPI itself (http://127.0.0.1:8000/ui/),
    // the API is on the same origin, so we use relative URLs.
    // When opened another way (file://, VS Code Live Server, …) we point at
    // the default uvicorn address. CORS is enabled in main.py for that case.
    var servedByFastAPI = window.location.pathname.indexOf("/ui") === 0;

    window.APP_CONFIG = Object.freeze({
        API_BASE_URL: servedByFastAPI ? "" : "http://127.0.0.1:8000",
        REQUEST_TIMEOUT_MS: 10000,
        FETCH_LIMIT: 1000,          // passed as ?limit= to GET /students
        DEFAULT_PAGE_SIZE: 10,
        SEARCH_DEBOUNCE_MS: 250,
        THEME_STORAGE_KEY: "student-manager-theme"
    });
})(window);
