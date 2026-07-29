/* ========================================
   Urgency Timer — cuenta atrás de 15 min
   sincronizada por localStorage, para
   .js-urgency-timer (ahora en .cart-perks
   dentro de .shipping-info-card).
   ======================================== */
(function () {
    'use strict';

    var STORAGE_KEY = 'ecozox_urgency_expires';
    var DURATION_MS = 15 * 60 * 1000;
    var timerEls    = document.querySelectorAll('.js-urgency-timer');

    if (!timerEls.length) return;

    function getExpiry() {
        var stored = localStorage.getItem(STORAGE_KEY);
        var now    = Date.now();
        if (stored) {
            var exp = parseInt(stored, 10);
            if (exp > now) return exp;
        }
        var newExp = now + DURATION_MS;
        localStorage.setItem(STORAGE_KEY, newExp);
        return newExp;
    }

    var expiresAt = getExpiry();

    function tick() {
        var remaining = expiresAt - Date.now();
        if (remaining <= 0) {
            expiresAt = Date.now() + DURATION_MS;
            localStorage.setItem(STORAGE_KEY, expiresAt);
            remaining = DURATION_MS;
        }
        var total = Math.max(0, Math.ceil(remaining / 1000));
        var mm    = String(Math.floor(total / 60)).padStart(2, '0');
        var ss    = String(total % 60).padStart(2, '0');
        var label = mm + ':' + ss;
        timerEls.forEach(function (el) { el.textContent = label; });
    }

    tick();
    var _timerInterval = setInterval(tick, 1000);
    window.addEventListener('beforeunload', function () { clearInterval(_timerInterval); });
})();
