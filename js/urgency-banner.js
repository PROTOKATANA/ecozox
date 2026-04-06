/* ========================================
   Urgency Banner
   Persistent countdown that survives page
   reloads via localStorage. Only shown on
   whitelisted pages.
   ======================================== */

(function () {
    const DISCOUNT_PERCENT = 30;   // Mantener sincronizado con cart-items.js
    const COUNTDOWN_MINUTES = 15;
    const STORAGE_KEY = 'ecozox_urgency_expires';
    const DURATION_MS = COUNTDOWN_MINUTES * 60 * 1000;

    // Páginas donde debe aparecer el banner
    const ALLOWED_PAGES = ['index.html', 'carrito.html', 'producto.html'];

    const page = window.location.pathname.split('/').pop() || 'index.html';
    if (!ALLOWED_PAGES.includes(page)) return;

    // Evitar duplicados (por si el módulo se cargara dos veces)
    if (document.getElementById('urgency-banner')) return;

    /* ---------- Helpers de texto i18n ---------- */
    var WAVE_SEP = '<span class="urgency-wave-sep" aria-hidden="true"></span>';

    function getBannerText() {
        var giftText = window.EcoI18n ? window.EcoI18n.t('urgency_gift') : '1 regalo';
        var raw = window.EcoI18n
            ? window.EcoI18n.t('urgency_discount_text')
                .replace('{discount}%', '<span class="urgency-pct">' + DISCOUNT_PERCENT + '%</span>')
                .replace('%{discount}', '<span class="urgency-pct">%' + DISCOUNT_PERCENT + '</span>')
                .replace('{num_gift}', '<span class="urgency-num">' + giftText + '</span>')
            : '<span class="urgency-pct">' + DISCOUNT_PERCENT + '%</span> de descuento y <span class="urgency-num">1 regalo</span> sorpresa';
        var endsIn = window.EcoI18n
            ? window.EcoI18n.t('urgency_ends_in')
            : 'Termina en';
        return raw + WAVE_SEP + endsIn + '&nbsp;<span id="urgency-timer" class="urgency-timer">15:00</span>';
    }

    /* ---------- DOM ---------- */
    const banner = document.createElement('div');
    banner.id = 'urgency-banner';
    banner.setAttribute('role', 'banner');
    banner.innerHTML = '<span class="urgency-text">' + getBannerText() + '</span>';

	const header = document.querySelector('header.header');
	if (header) {
	    header.style.paddingBottom = '0';
	    // El banner se inserta DENTRO del header para heredar el 'sticky'
	    header.appendChild(banner);
	}else {
        // Fallback si el header aún no está en el DOM
        const main = document.querySelector('main') || document.body;
        main.parentNode.insertBefore(banner, main);
    }

    /* ---------- Timer persistente ---------- */
    function getExpiresAt() {
        const stored = localStorage.getItem(STORAGE_KEY);
        const now = Date.now();
        if (stored) {
            const expiresAt = parseInt(stored, 10);
            if (expiresAt > now) return expiresAt;
        }
        const newExpiry = now + DURATION_MS;
        localStorage.setItem(STORAGE_KEY, newExpiry);
        return newExpiry;
    }

    let expiresAt = getExpiresAt();

    function tick() {
        const remaining = expiresAt - Date.now();
        if (remaining <= 0) {
            expiresAt = Date.now() + DURATION_MS;
            localStorage.setItem(STORAGE_KEY, expiresAt);
        }
        const totalSeconds = Math.max(0, Math.ceil(remaining / 1000));
        const mm = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
        const ss = String(totalSeconds % 60).padStart(2, '0');
        const timerEl = document.getElementById('urgency-timer');
        if (timerEl) timerEl.textContent = `${mm}:${ss}`;
    }

    tick();
    setInterval(tick, 1000);

    /* ---------- Exponer API para EcoI18n ---------- */
    window.EcoUrgencyBanner = {
        update: function () {
            var textEl = banner.querySelector('.urgency-text');
            if (textEl) {
                textEl.innerHTML = getBannerText();
                tick();
            }
        }
    };
})();
