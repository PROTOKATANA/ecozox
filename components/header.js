/* ========================================
   Header Component
   ======================================== */
(function () {
    var el = document.querySelector('[data-component="header"]');
    if (!el) return;

    var base = el.dataset.base || '';

    // Todos los idiomas soportados
    // flag: código de país para flagcdn.com/24x18/{code}.png
    var languages = [
        { code: 'es', flag: 'es', label: 'Español',   suffix: 'ES' },
        { code: 'en', flag: 'us', label: 'English',   suffix: 'EN' },
        { code: 'ar', flag: 'sa', label: 'العربية',  suffix: 'AR' },
        { code: 'zh', flag: 'cn', label: '中文',      suffix: 'ZH' },
        { code: 'ja', flag: 'jp', label: '日本語',    suffix: 'JA' },
        { code: 'ko', flag: 'kr', label: '한국어',    suffix: 'KO' },
        { code: 'id', flag: 'id', label: 'Indonesia', suffix: 'ID' },
        { code: 'de', flag: 'de', label: 'Deutsch',   suffix: 'DE' },
        { code: 'fr', flag: 'fr', label: 'Français',  suffix: 'FR' },
        { code: 'it', flag: 'it', label: 'Italiano',  suffix: 'IT' },
        { code: 'pt', flag: 'br', label: 'Português', suffix: 'PT' },
        { code: 'tr', flag: 'tr', label: 'Türkçe',    suffix: 'TR' }
    ];

    // Precargar Noto Sans para CJK — el dialog se construye antes de que i18n.js cargue esas fuentes
    var CJK_FONTS = {
        zh: 'https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700;800&display=swap',
        ja: 'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700;800&display=swap',
        ko: 'https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;800&display=swap'
    };
    ['zh', 'ja', 'ko'].forEach(function (lang) {
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = CJK_FONTS[lang];
        document.head.appendChild(link);
    });

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
            var flagImg = '<img src="https://flagcdn.com/24x18/' + l.flag + '.png"'
                + ' width="24" height="18" alt="' + l.suffix + '" class="region-flag"'
                + ' style="border-radius:2px;flex-shrink:0;">';
            return '<button class="region-option' + active + '" data-region-lang="' + l.code + '">'
                + '<span style="display:flex;align-items:center;gap:0.5rem;">'
                + flagImg + l.label.toUpperCase()
                + '</span>'
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
