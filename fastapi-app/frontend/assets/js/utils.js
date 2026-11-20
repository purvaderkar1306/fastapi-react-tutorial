/* =====================================================================
   utils.js — small helpers shared by the other scripts
   ===================================================================== */
(function (window) {
    "use strict";

    var Utils = {
        /** Escape text before putting it inside HTML (prevents XSS). */
        escapeHtml: function (value) {
            return String(value == null ? "" : value)
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#39;");
        },

        /** "Asha Patil" -> "AP" */
        initials: function (name) {
            return String(name || "?")
                .trim()
                .split(/\s+/)
                .slice(0, 2)
                .map(function (part) { return part.charAt(0).toUpperCase(); })
                .join("");
        },

        /** Stable colour hue (0-359) from any string, used for avatars and badges. */
        hueFromString: function (text) {
            var hash = 0;
            text = String(text || "");
            for (var i = 0; i < text.length; i++) {
                hash = text.charCodeAt(i) + ((hash << 5) - hash);
                hash |= 0;
            }
            return Math.abs(hash) % 360;
        },

        /** Delay calls until the user stops typing. */
        debounce: function (fn, wait) {
            var timer;
            return function () {
                var ctx = this, args = arguments;
                clearTimeout(timer);
                timer = setTimeout(function () { fn.apply(ctx, args); }, wait);
            };
        },

        isValidEmail: function (email) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
        }
    };

    window.Utils = Utils;
})(window);
