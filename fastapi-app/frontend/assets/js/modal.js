/* =====================================================================
   modal.js — reusable modal window + modal-based alerts

   Modal.open("#id", { static: true })   open any .modal element
   Modal.close("#id")                     close it
   Elements with [data-dismiss="modal"] inside a modal close it.
   Esc closes the top-most modal; focus is trapped inside it.

   Dialog.alert({ type, title, message })            -> Promise<void>
   Dialog.success(title, message) / error / warning / info
   Dialog.confirm({ title, message, okText, danger }) -> Promise<boolean>
   ===================================================================== */
(function (window, $) {
    "use strict";

    var stack = [];                 // currently open modals, top-most last
    var ANIMATION_MS = 240;
    var FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

    var Modal = {
        open: function (selector, options) {
            var $m = $(selector);
            if (!$m.length || $m.hasClass("show")) return $m;
            options = options || {};

            $m.data("static", !!options.static);
            $m.data("returnFocus", document.activeElement);
            $m.prop("hidden", false);

            // force reflow so the CSS transition runs
            $m[0].offsetWidth; // eslint-disable-line no-unused-expressions
            $m.addClass("show");
            stack.push($m[0]);
            $("body").addClass("modal-open");

            setTimeout(function () {
                var $first = $m.find("[autofocus]").first();
                if (!$first.length) $first = $m.find(".modal-body").find(FOCUSABLE).first();
                if (!$first.length) $first = $m.find(".modal-footer .btn-primary, .modal-footer .btn-danger").last();
                $first.trigger("focus");
            }, 50);

            $m.trigger("modal:open");
            return $m;
        },

        close: function (selector) {
            var $m = $(selector);
            if (!$m.hasClass("show")) return $m;

            $m.removeClass("show");
            stack = stack.filter(function (el) { return el !== $m[0]; });
            if (!stack.length) $("body").removeClass("modal-open");

            setTimeout(function () {
                $m.prop("hidden", true);
                $m.trigger("modal:closed");
                var back = $m.data("returnFocus");
                if (back && document.contains(back)) back.focus();
            }, ANIMATION_MS);

            return $m;
        },

        top: function () {
            return stack.length ? $(stack[stack.length - 1]) : $();
        }
    };

    /* ---------- global modal events ---------- */

    // Close buttons / backdrop
    $(document).on("click", ".modal [data-dismiss='modal']", function () {
        var $m = $(this).closest(".modal");
        if ($(this).hasClass("modal-backdrop") && $m.data("static")) {
            shake($m);
            return;
        }
        Modal.close($m);
    });

    // Esc to close, Tab to trap focus
    $(document).on("keydown", function (e) {
        var $m = Modal.top();
        if (!$m.length) return;

        if (e.key === "Escape") {
            e.preventDefault();
            if ($m.is("#dialogModal")) {
                // Esc = Cancel on a confirm, OK on a plain alert
                var $cancel = $("#dialogCancel");
                ($cancel.prop("hidden") ? $("#dialogOk") : $cancel).trigger("click");
                return;
            }
            if ($m.data("static")) { shake($m); return; }
            Modal.close($m);
        }

        if (e.key === "Tab") {
            var $f = $m.find(FOCUSABLE).filter(":visible");
            if (!$f.length) return;
            var first = $f[0], last = $f[$f.length - 1];
            if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
            else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
    });

    function shake($m) {
        $m.removeClass("shake");
        $m[0].offsetWidth; // eslint-disable-line no-unused-expressions
        $m.addClass("shake");
        setTimeout(function () { $m.removeClass("shake"); }, 420);
    }

    /* ---------- Dialog: alert & confirm built on #dialogModal ---------- */

    var ICONS = {
        success: '<svg class="icon" viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
        error:   '<svg class="icon" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg>',
        warning: '<svg class="icon" viewBox="0 0 24 24"><path d="M12 8v5M12 16.5v.5"/><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/></svg>',
        info:    '<svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>',
        question:'<svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3M12 17h.01"/></svg>'
    };

    var $dlg = null;
    var queue = $.Deferred().resolve().promise();   // dialogs are shown one after another

    function show(opts) {
        // Chain on the queue so two alerts never overlap
        var next = $.Deferred();
        queue = queue.then(function () {
            return render(opts).then(function (result) { next.resolve(result); });
        });
        return next.promise();
    }

    function render(opts) {
        var done = $.Deferred();
        $dlg = $dlg || $("#dialogModal");

        var type = opts.type || "info";
        $("#dialogIcon").attr("class", "alert-icon " + (type === "question" ? "warning" : type)).html(ICONS[type] || ICONS.info);
        $("#dialogTitle").text(opts.title || "");
        // message may contain trusted HTML built by our own code (already escaped)
        $("#dialogMessage").html(opts.message || "");

        var $ok = $("#dialogOk"), $cancel = $("#dialogCancel");
        $ok.text(opts.okText || "OK")
           .toggleClass("btn-danger", !!opts.danger)
           .toggleClass("btn-primary", !opts.danger);
        $cancel.text(opts.cancelText || "Cancel").prop("hidden", !opts.showCancel);

        function finish(value) {
            $ok.off(".dlg"); $cancel.off(".dlg");
            Modal.close($dlg);
            setTimeout(function () { done.resolve(value); }, ANIMATION_MS);
        }
        $ok.on("click.dlg", function () { finish(true); });
        $cancel.on("click.dlg", function () { finish(false); });

        Modal.open($dlg, { static: true });
        setTimeout(function () { $ok.trigger("focus"); }, 60);

        return done.promise();
    }

    var Dialog = {
        alert: function (opts) { return show($.extend({ showCancel: false }, opts)); },
        success: function (title, message) { return Dialog.alert({ type: "success", title: title, message: message }); },
        error:   function (title, message) { return Dialog.alert({ type: "error",   title: title, message: message }); },
        warning: function (title, message) { return Dialog.alert({ type: "warning", title: title, message: message }); },
        info:    function (title, message) { return Dialog.alert({ type: "info",    title: title, message: message }); },
        confirm: function (opts) {
            return show($.extend({ type: "question", showCancel: true, okText: "Yes" }, opts));
        }
    };

    window.Modal = Modal;
    window.Dialog = Dialog;
})(window, jQuery);
