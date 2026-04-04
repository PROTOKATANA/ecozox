/* ========================================
   Header Component
   ======================================== */
(function () {
    var el = document.querySelector('[data-component="header"]');
    if (!el) return;

    var base = el.dataset.base || '';

    // Todos los idiomas soportados
    var languages = [
        { code: 'es', flag: '\uD83C\uDDEA\uD83C\uDDF8', label: 'Español',    suffix: 'ES' },
        { code: 'en', flag: '\uD83C\uDDFA\uD83C\uDDF8', label: 'English',    suffix: 'EN' },
        { code: 'ar', flag: '\uD83C\uDDF8\uD83C\uDDE6', label: 'العربية',   suffix: 'AR' },
        { code: 'zh', flag: '\uD83C\uDDE8\uD83C\uDDF3', label: '中文',       suffix: 'ZH' },
        { code: 'ja', flag: '\uD83C\uDDEF\uD83C\uDDF5', label: '日本語',     suffix: 'JA' },
        { code: 'ko', flag: '\uD83C\uDDF0\uD83C\uDDF7', label: '한국어',     suffix: 'KO' },
        { code: 'id', flag: '\uD83C\uDDEE\uD83C\uDDE9', label: 'Indonesia',  suffix: 'ID' },
        { code: 'de', flag: '\uD83C\uDDE9\uD83C\uDDEA', label: 'Deutsch',    suffix: 'DE' },
        { code: 'fr', flag: '\uD83C\uDDEB\uD83C\uDDF7', label: 'Français',   suffix: 'FR' },
        { code: 'it', flag: '\uD83C\uDDEE\uD83C\uDDF9', label: 'Italiano',   suffix: 'IT' },
        { code: 'pt', flag: '\uD83C\uDDE7\uD83C\uDDF7', label: 'Português',  suffix: 'PT' },
        { code: 'tr', flag: '\uD83C\uDDF9\uD83C\uDDF7', label: 'Türkçe',     suffix: 'TR' }
    ];

    var STORAGE_KEY = 'ecozox_lang';
    var SUPPORTED_CODES = languages.map(function (l) { return l.code; });

    // Leer idioma guardado para marcar el activo al renderizar
    var stored = localStorage.getItem(STORAGE_KEY)
        || (navigator.language || '').split('-')[0].toLowerCase();
    var currentLang = SUPPORTED_CODES.indexOf(stored) !== -1 ? stored : 'es';

    el.outerHTML = [
        '<header class="header">',
        '  <div class="container" style="display:flex;justify-content:space-between;align-items:center;">',
        '    <a href="' + base + 'index.html" class="logo">',
        '      <img src="' + base + 'assets/logo.png" alt="EcoZox Logo" class="logo-img">',
        '    </a>',
        '    <div class="header-actions" style="display:flex;gap:0.75rem;align-items:center;">',
        '      <a href="' + base + 'contacto.html" class="cart-button icon-only-btn"',
        '         aria-label="Contacto" data-i18n-aria="nav_contact">',
        '        <svg class="cart-btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">',
        '          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>',
        '          <polyline points="22,6 12,13 2,6"></polyline>',
        '        </svg>',
        '      </a>',
        '      <div class="lang-switcher" id="langSwitcher">',
        '        <button class="lang-toggle icon-only-btn" id="langToggle"',
        '                aria-label="Cambiar idioma" data-i18n-aria="aria_change_lang"',
        '                aria-haspopup="dialog" aria-expanded="false">',
        '          <svg class="lang-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">',
        '            <circle cx="12" cy="12" r="10"></circle>',
        '            <path d="M2 12h20"></path>',
        '            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>',
        '          </svg>',
        '        </button>',
        '      </div>',
        '      <a href="' + base + 'carrito.html" class="cart-button">',
        '        <img src="' + base + 'assets/bag.svg" data-i18n-alt="cart_alt" alt="Carrito" class="cart-btn-icon">',
        '        <span class="cart-btn-divider"></span>',
        '        <span class="cart-count">0</span>',
        '      </a>',
        '    </div>',
        '  </div>',
        '</header>'
    ].join('\n');

    /* =============================================
       Region Dialog — 12 idiomas
       ============================================= */
    var CHECK_SVG = '<svg class="region-option__check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';

    function buildLangButtons() {
        return languages.map(function (l) {
            var active = l.code === currentLang ? ' active' : '';
            return '<button class="region-option' + active + '" data-region-lang="' + l.code + '">'
                + '<span>' + l.flag + '&ensp;' + l.label
                + ' <span class="region-option__secondary">' + l.suffix + '</span></span>'
                + CHECK_SVG
                + '</button>';
        }).join('');
    }

    document.body.insertAdjacentHTML('beforeend',
        '<dialog id="region-dialog" aria-labelledby="region-dialog-title">'
        + '<div class="region-dialog__header">'
        +   '<h2 class="region-dialog__title" id="region-dialog-title" data-i18n="region_dialog_title">Configuración de Región</h2>'
        +   '<button class="region-dialog__close" id="regionDialogClose" aria-label="Cerrar" data-i18n-aria="aria_close">'
        +     '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">'
        +       '<line x1="18" y1="6" x2="6" y2="18"></line>'
        +       '<line x1="6" y1="6" x2="18" y2="18"></line>'
        +     '</svg>'
        +   '</button>'
        + '</div>'
        + '<div class="region-dialog__body">'
        +   '<p class="region-section__label" data-i18n="region_change_lang">Cambiar idioma</p>'
        +   '<div class="region-options" id="regionLangOptions">'
        +     buildLangButtons()
        +   '</div>'
        + '</div>'
        + '</dialog>'
    );

    /* ---------- Referencias ---------- */
    var dialog      = document.getElementById('region-dialog');
    var toggle      = document.getElementById('langToggle');
    var closeBtn    = document.getElementById('regionDialogClose');
    var langOptions = document.getElementById('regionLangOptions');

    /* ---------- Abrir dialog ---------- */
    toggle.addEventListener('click', function (e) {
        e.stopPropagation();
        dialog.showModal();
    });

    /* ---------- Cerrar con × ---------- */
    closeBtn.addEventListener('click', function () {
        dialog.close();
    });

    /* ---------- Cerrar al clicar backdrop ---------- */
    dialog.addEventListener('click', function (e) {
        var rect = dialog.getBoundingClientRect();
        if (e.clientX < rect.left || e.clientX > rect.right ||
            e.clientY < rect.top  || e.clientY > rect.bottom) {
            dialog.close();
        }
    });

    /* ---------- Selección de idioma ---------- */
    langOptions.addEventListener('click', function (e) {
        var btn = e.target.closest('.region-option');
        if (!btn) return;

        var lang = btn.getAttribute('data-region-lang');

        // Actualizar visual
        langOptions.querySelectorAll('.region-option').forEach(function (b) {
            b.classList.remove('active');
        });
        btn.classList.add('active');

        // Aplicar vía EcoI18n (todos los idiomas soportados)
        if (window.EcoI18n) {
            window.EcoI18n.setLang(lang);
        } else {
            localStorage.setItem(STORAGE_KEY, lang);
        }

        dialog.close();
    });

})();
