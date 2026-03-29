/* ========================================
   Header Component
   ======================================== */
(function () {
    const el = document.querySelector('[data-component="header"]');
    if (!el) return;

    const base = el.dataset.base || '';

    // Idiomas disponibles — agregar nuevos aquí
    const languages = [
        { code: 'es', flag: '\uD83C\uDDEA\uD83C\uDDF8', label: 'Español' },
        { code: 'en', flag: '\uD83C\uDDFA\uD83C\uDDF8', label: 'English' }
    ];

    // Leer idioma guardado para marcar el activo al renderizar
    const savedLang = localStorage.getItem('ecozox_lang')
        || (navigator.language || '').split('-')[0].toLowerCase();
    const currentLang = languages.find(l => l.code === savedLang) ? savedLang : 'es';

    const optionsHTML = languages.map(lang => `
        <button class="lang-option${lang.code === currentLang ? ' active' : ''}" data-lang="${lang.code}">
            <span class="lang-flag">${lang.flag}</span>
            ${lang.label}
            <svg class="lang-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
        </button>
    `).join('');

    el.outerHTML = `
    <header class="header">
        <div class="container" style="display: flex; justify-content: space-between; align-items: center;">
			<a href="${base}index.html" class="logo">
			    <img src="${base}assets/logo.png" alt="EcoZox Logo" class="logo-img">
			</a>
            <div class="header-actions" style="display: flex; gap: 0.75rem; align-items: center;">

                <a href="${base}contacto.html" class="cart-button icon-only-btn" aria-label="Contacto" data-i18n-label="nav_contact">
                    <svg class="cart-btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                        <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                </a>

                <div class="lang-switcher" id="langSwitcher">
                    <button class="lang-toggle icon-only-btn" id="langToggle" aria-label="Cambiar idioma" aria-haspopup="dialog" aria-expanded="false">
                        <svg class="lang-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="M2 12h20"></path>
                            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                        </svg>
                    </button>

                    <div class="lang-dropdown" role="menu">
                        ${optionsHTML}
                    </div>
                </div>

                <a href="${base}carrito.html" class="cart-button">
                    <img src="${base}assets/bag.svg" data-i18n-alt="cart_alt" alt="Carrito" class="cart-btn-icon">
                    <span class="cart-btn-divider"></span>
                    <span class="cart-count">0</span>
                </a>
            </div>
        </div>
    </header>`;

    /* =============================================
       Region Dialog — Inyección + Comportamiento
       ============================================= */

    const CHECK_SVG = '<svg class="region-option__check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';

    // Leer preferencia de divisa guardada
    const savedCurrency = localStorage.getItem('ecozox_currency') || 'EUR';

    // Datos de idiomas y divisas para el dialog
    const dialogLangs = [
        { code: 'es', flag: '\uD83C\uDDEA\uD83C\uDDF8', label: 'Español', suffix: 'ES' },
        { code: 'en', flag: '\uD83C\uDDFA\uD83C\uDDF8', label: 'English', suffix: 'EN' },
        { code: 'fr', flag: '\uD83C\uDDEB\uD83C\uDDF7', label: 'Français', suffix: 'FR' },
        { code: 'de', flag: '\uD83C\uDDE9\uD83C\uDDEA', label: 'Deutsch', suffix: 'DE' }
    ];

    const dialogCurrencies = [
        { code: 'EUR', symbol: '€', label: 'euro' },
        { code: 'USD', symbol: 'US$', label: 'dólar' },
        { code: 'GBP', symbol: '£', label: 'libra' },
        { code: 'JPY', symbol: '¥', label: 'yen' }
    ];

    function buildLangButtons() {
        return dialogLangs.map(function (l) {
            var active = l.code === currentLang ? ' active' : '';
            return '<button class="region-option' + active + '" data-region-lang="' + l.code + '">'
                + '<span>' + l.flag + '&ensp;' + l.label + ' <span class="region-option__secondary">' + l.suffix + '</span></span>'
                + CHECK_SVG
                + '</button>';
        }).join('');
    }

    function buildCurrencyButtons() {
        return dialogCurrencies.map(function (c) {
            var active = c.code === savedCurrency ? ' active' : '';
            return '<button class="region-option' + active + '" data-region-currency="' + c.code + '">'
                + '<span>' + c.symbol + ' <span class="region-option__secondary">' + c.code + '</span> — ' + c.label + '</span>'
                + CHECK_SVG
                + '</button>';
        }).join('');
    }

    // Inyectar el dialog en el body
    document.body.insertAdjacentHTML('beforeend',
        '<dialog id="region-dialog" aria-labelledby="region-dialog-title">'
        +   '<div class="region-dialog__header">'
        +       '<h2 class="region-dialog__title" id="region-dialog-title">Configuración de Región</h2>'
        +       '<button class="region-dialog__close" id="regionDialogClose" aria-label="Cerrar">'
        +           '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">'
        +               '<line x1="18" y1="6" x2="6" y2="18"></line>'
        +               '<line x1="6" y1="6" x2="18" y2="18"></line>'
        +           '</svg>'
        +       '</button>'
        +   '</div>'
        +   '<div class="region-dialog__body">'
        +       '<p class="region-section__label">Cambiar idioma</p>'
        +       '<div class="region-options" id="regionLangOptions">'
        +           buildLangButtons()
        +       '</div>'
        +       '<hr class="region-dialog__divider">'
        +       '<p class="region-section__label">Cambiar divisa</p>'
        +       '<div class="region-options" id="regionCurrencyOptions">'
        +           buildCurrencyButtons()
        +       '</div>'
        +   '</div>'
        + '</dialog>'
    );

    /* ---------- Referencias ---------- */
    var dialog        = document.getElementById('region-dialog');
    var toggle        = document.getElementById('langToggle');
    var closeBtn      = document.getElementById('regionDialogClose');
    var langOptions   = document.getElementById('regionLangOptions');
    var curOptions    = document.getElementById('regionCurrencyOptions');

    /* ---------- Abrir dialog (reemplaza el dropdown) ---------- */
    toggle.addEventListener('click', function (e) {
        e.stopPropagation();
        dialog.showModal();
    });

    /* ---------- Cerrar con × ---------- */
    closeBtn.addEventListener('click', function () {
        dialog.close();
    });

    /* ---------- Cerrar al clicar en el backdrop ---------- */
    dialog.addEventListener('click', function (e) {
        var rect = dialog.getBoundingClientRect();
        if (e.clientX < rect.left || e.clientX > rect.right ||
            e.clientY < rect.top  || e.clientY > rect.bottom) {
            dialog.close();
        }
    });

    /* ---------- Selección de idioma — One-Click ---------- */
    langOptions.addEventListener('click', function (e) {
        var btn = e.target.closest('.region-option');
        if (!btn) return;

        var lang = btn.getAttribute('data-region-lang');

        // Actualizar estado visual
        langOptions.querySelectorAll('.region-option').forEach(function (b) {
            b.classList.remove('active');
        });
        btn.classList.add('active');

        // También sincronizar el dropdown del header (por si se necesita)
        var switcher = document.getElementById('langSwitcher');
        if (switcher) {
            switcher.querySelectorAll('.lang-option').forEach(function (b) {
                b.classList.toggle('active', b.dataset.lang === lang);
            });
        }

        // Aplicar idioma vía EcoI18n (solo langs soportados)
        if (window.EcoI18n && ['es', 'en'].includes(lang)) {
            window.EcoI18n.setLang(lang);
        } else {
            localStorage.setItem('ecozox_lang', lang);
        }

        console.log('Idioma seleccionado:', lang);
    });

    /* ---------- Selección de divisa — One-Click ---------- */
    curOptions.addEventListener('click', function (e) {
        var btn = e.target.closest('.region-option');
        if (!btn) return;

        var currency = btn.getAttribute('data-region-currency');

        // Actualizar estado visual
        curOptions.querySelectorAll('.region-option').forEach(function (b) {
            b.classList.remove('active');
        });
        btn.classList.add('active');

        // Persistir
        localStorage.setItem('ecozox_currency', currency);

        console.log('Divisa seleccionada:', currency);
    });

})();
