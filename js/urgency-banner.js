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
    function getBannerText() {
        var giftText = window.EcoI18n ? window.EcoI18n.t('urgency_gift') : '1 regalo';
        var promoHtml = window.EcoI18n
            ? window.EcoI18n.t('urgency_discount_text')
                .replace('{discount}%', '<span class="urgency-pct">' + DISCOUNT_PERCENT + '%</span>')
                .replace('%{discount}', '<span class="urgency-pct">%' + DISCOUNT_PERCENT + '</span>')
                .replace('{num_gift}', '<span class="urgency-num">' + giftText + '</span>')
            : '<span class="urgency-pct">' + DISCOUNT_PERCENT + '%</span> de descuento y <span class="urgency-num">1 regalo</span> sorpresa';
        var endsIn = window.EcoI18n
            ? window.EcoI18n.t('urgency_ends_in')
            : 'Termina en';
        var promoBlock  = '<span class="urgency-block">' + promoHtml + '</span>';
        var timerBlock  = '<span class="urgency-block">' + endsIn + '&nbsp;<span id="urgency-timer" class="urgency-timer">15:00</span></span>';
        return promoBlock + timerBlock;
    }

    /* ---------- DOM ---------- */
    const banner = document.createElement('div');
    banner.id = 'urgency-banner';
    banner.setAttribute('role', 'banner');
    banner.innerHTML = '<span class="urgency-text">' + getBannerText() + '</span>';

	const header = document.querySelector('header.header');
	if (header) {
	    header.style.paddingBottom = '0';
	    header.appendChild(banner);
	} else {
        const main = document.querySelector('main') || document.body;
        main.parentNode.insertBefore(banner, main);
    }

    /* ---------- Wave divider bajo el banner ---------- */
    const WAVE_WIDTH   = 56;
    const WAVE_HEIGHT  = 23;
    const STROKE_W     = 12;
    const STROKE_COLOR = '#fbbf24';
    const FILL_TOP     = '#16a34a';
    const FILL_CROP    = 9;  // px recortados del tope del relleno verde
    const svgH         = WAVE_HEIGHT + STROKE_W * 2;
    const midY         = svgH / 2;
    const amp          = WAVE_HEIGHT / 2;
    const halfWave     = WAVE_WIDTH / 2;

    function buildWavePath(totalWidth) {
        let d = 'M0 ' + midY;
        let x = 0, up = true;
        while (x < totalWidth) {
            const cx = x + halfWave / 2;
            const cy = up ? midY - amp : midY + amp;
            x += halfWave;
            d += ' Q' + cx + ' ' + cy + ' ' + x + ' ' + midY;
            up = !up;
        }
        return d;
    }

    function buildWaveSVG(totalWidth) {
        const waveLine  = buildWavePath(totalWidth);
        const topPath   = waveLine + ' L' + totalWidth + ' ' + FILL_CROP + ' L0 ' + FILL_CROP + ' Z';
        return '<svg width="100%" height="' + svgH + '" xmlns="http://www.w3.org/2000/svg" style="display:block;overflow:hidden;width:100vw;max-width:100vw">'
            + '<path d="' + topPath + '" fill="' + FILL_TOP + '"/>'
            + '<path d="' + waveLine + '" fill="none" stroke="' + STROKE_COLOR + '" stroke-width="' + STROKE_W + '" stroke-linecap="round"/>'
            + '</svg>';
    }

    const waveDiv = document.createElement('div');
    waveDiv.id = 'urgency-wave';
    waveDiv.style.cssText = 'position:absolute;bottom:-35px;left:0;width:100vw;pointer-events:none;';
    waveDiv.innerHTML = buildWaveSVG(window.innerWidth || 400);
    banner.style.position = 'relative';
    banner.appendChild(waveDiv);

    /* ---------- Padding-top dinámico ---------- */
    const WAVE_BOTTOM_OFFSET = 23; // coincide con bottom:-33px del waveDiv

    function updateBodyPadding() {
        if (window.innerWidth > 767) return; // solo móvil
        var totalHeight = banner.offsetHeight + WAVE_BOTTOM_OFFSET;
        document.body.style.paddingTop = totalHeight + 'px';
    }

    window.addEventListener('resize', function () {
        waveDiv.innerHTML = buildWaveSVG(window.innerWidth || 400);
        updateBodyPadding();
    });

    requestAnimationFrame(updateBodyPadding);

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
                requestAnimationFrame(updateBodyPadding);
            }
        },
        updatePadding: updateBodyPadding
    };
})();
