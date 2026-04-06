/* ========================================
   Header Component
   ======================================== */
(function () {
    var el = document.querySelector('[data-component="header"]');
    if (!el) return;

    var base = el.dataset.base || '';

    // Todos los idiomas soportados
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

    // Precargar Noto Sans para CJK
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

    var currencies = [
        { code: 'USD', flag: 'us', label: 'Dólar estadounidense',  symbol: '$'   },
        { code: 'EUR', flag: 'eu', label: 'Euro',                  symbol: '€'   },
        { code: 'CAD', flag: 'ca', label: 'Dólar canadiense',      symbol: '$'   },
        { code: 'AUD', flag: 'au', label: 'Dólar australiano',     symbol: '$'   },
        { code: 'GBP', flag: 'gb', label: 'Libra esterlina',       symbol: '£'   },
        { code: 'NZD', flag: 'nz', label: 'Dólar neozelandés',     symbol: '$'   },
        { code: 'JPY', flag: 'jp', label: 'Yen japonés',           symbol: '¥'   },
        { code: 'INR', flag: 'in', label: 'Rupia india',           symbol: '₹'   },
        { code: 'CNY', flag: 'cn', label: 'Yuan chino',            symbol: '¥'   },
        { code: 'KRW', flag: 'kr', label: 'Won surcoreano',        symbol: '₩'   },
        { code: 'RUB', flag: 'ru', label: 'Rublo ruso',            symbol: '₽'   },
        { code: 'BRL', flag: 'br', label: 'Real brasileño',        symbol: 'R$'  },
        { code: 'SAR', flag: 'sa', label: 'Riyal saudí',           symbol: 'ر.س' },
        { code: 'TRY', flag: 'tr', label: 'Lira turca',            symbol: '₺'   },
        { code: 'MXN', flag: 'mx', label: 'Peso mexicano',         symbol: '$'   },
        { code: 'CLP', flag: 'cl', label: 'Peso chileno',          symbol: '$'   },
        { code: 'IDR', flag: 'id', label: 'Rupia indonesia',       symbol: 'Rp'  }
    ];

    var STORAGE_KEY = 'ecozox_lang';
    var CURRENCY_STORAGE_KEY = 'ecozox_currency';
    var SUPPORTED_CODES = languages.map(function (l) { return l.code; });

    var stored = localStorage.getItem(STORAGE_KEY)
        || (navigator.language || '').split('-')[0].toLowerCase();
    var currentLang = SUPPORTED_CODES.indexOf(stored) !== -1 ? stored : 'es';

    var langToCurrency = { es:'EUR', en:'USD', ar:'SAR', zh:'CNY', ja:'JPY', ko:'KRW', id:'IDR', de:'EUR', fr:'EUR', it:'EUR', pt:'BRL', tr:'TRY' };
    var storedCurrency = localStorage.getItem(CURRENCY_STORAGE_KEY);
    var currentCurrency = storedCurrency || langToCurrency[currentLang] || 'USD';

    el.outerHTML = [
        '<header class="header">',
        '  <div class="container header-inner" style="display:flex;justify-content:space-between;align-items:center;">',
        '    <a href="' + base + 'index.html" class="logo">',
        '      <img src="' + base + 'assets/logo.png" alt="EcoZox Logo" class="logo-img">',
        '    </a>',
        '    <div class="header-actions" style="display:flex;gap:0.75rem;align-items:center;">',
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
        '      <div class="lang-switcher" id="currencySwitcher">',
        '        <button class="lang-toggle icon-only-btn" id="currencyToggle"',
        '                aria-label="Cambiar moneda" data-i18n-aria="aria_change_currency"',
        '                aria-haspopup="dialog" aria-expanded="false">',
        '          <svg class="lang-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">',
        '            <line x1="12" y1="1" x2="12" y2="23"></line>',
        '            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>',
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

    function buildCurrencyButtons() {
        return currencies.map(function (c) {
            var active = c.code === currentCurrency ? ' active' : '';
            var flagImg = '<img src="https://flagcdn.com/24x18/' + c.flag + '.png"'
                + ' width="24" height="18" alt="' + c.code + '" class="region-flag"'
                + ' style="border-radius:2px;flex-shrink:0;">';
            return '<button class="region-option' + active + '" data-region-currency="' + c.code + '">'
                + '<span style="display:flex;align-items:center;gap:0.5rem;">'
                + flagImg + c.label.toUpperCase()
                + ' <span class="region-option__secondary">[' + c.symbol + ']</span>'
                + '</span>'
                + CHECK_SVG
                + '</button>';
        }).join('');
    }

    var CLOSE_SVG = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">'
        + '<line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';

    document.body.insertAdjacentHTML('beforeend',
        '<dialog id="region-dialog" class="region-dialog" aria-labelledby="region-dialog-title">'
        + '<div class="region-dialog__handle" aria-hidden="true"></div>'
        + '<div class="region-dialog__header">'
        +   '<h2 class="region-dialog__title" id="region-dialog-title" data-i18n="region_change_lang">Cambiar idioma</h2>'
        +   '<button class="region-dialog__close" id="regionDialogClose" aria-label="Cerrar" data-i18n-aria="aria_close">' + CLOSE_SVG + '</button>'
        + '</div>'
        + '<div class="region-dialog__body">'
        +   '<div class="region-options" id="regionLangOptions">' + buildLangButtons() + '</div>'
        + '</div>'
        + '</dialog>'
    );

    document.body.insertAdjacentHTML('beforeend',
        '<dialog id="currency-dialog" class="region-dialog" aria-labelledby="currency-dialog-title">'
        + '<div class="region-dialog__handle" aria-hidden="true"></div>'
        + '<div class="region-dialog__header">'
        +   '<h2 class="region-dialog__title" id="currency-dialog-title" data-i18n="region_change_currency">Cambiar moneda</h2>'
        +   '<button class="region-dialog__close" id="currencyDialogClose" aria-label="Cerrar" data-i18n-aria="aria_close">' + CLOSE_SVG + '</button>'
        + '</div>'
        + '<div class="region-dialog__body">'
        +   '<div class="region-options" id="regionCurrencyOptions">' + buildCurrencyButtons() + '</div>'
        + '</div>'
        + '</dialog>'
    );

    var langDialog      = document.getElementById('region-dialog');
    var currDialog      = document.getElementById('currency-dialog');
    var toggle          = document.getElementById('langToggle');
    var currencyToggle  = document.getElementById('currencyToggle');
    var langCloseBtn    = document.getElementById('regionDialogClose');
    var currCloseBtn    = document.getElementById('currencyDialogClose');
    var langOptions     = document.getElementById('regionLangOptions');
    var currencyOptions = document.getElementById('regionCurrencyOptions');

    function closeDialog(dialog) {
        dialog.classList.add('is-closing');
        var done = false;
        function finish() {
            if (done) return;
            done = true;
            dialog.classList.remove('is-closing');
            dialog.close();
        }
        dialog.addEventListener('animationend', function handler() {
            dialog.removeEventListener('animationend', handler);
            finish();
        });
        setTimeout(finish, 400);
    }

    function bindDialog(dialog, openBtn, closeBtn) {
        openBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            dialog.showModal();
        });
        closeBtn.addEventListener('click', function () { closeDialog(dialog); });
        dialog.addEventListener('click', function (e) {
            var rect = dialog.getBoundingClientRect();
            if (e.clientX < rect.left || e.clientX > rect.right ||
                e.clientY < rect.top  || e.clientY > rect.bottom) {
                closeDialog(dialog);
            }
        });
        dialog.addEventListener('cancel', function (e) {
            e.preventDefault();
            closeDialog(dialog);
        });
    }

    bindDialog(langDialog, toggle, langCloseBtn);
    bindDialog(currDialog, currencyToggle, currCloseBtn);

    langOptions.addEventListener('click', function (e) {
        var btn = e.target.closest('.region-option');
        if (!btn) return;
        var lang = btn.getAttribute('data-region-lang');
        langOptions.querySelectorAll('.region-option').forEach(function (b) {
            b.classList.remove('active');
        });
        btn.classList.add('active');
        if (window.EcoI18n) {
            window.EcoI18n.setLang(lang);
        } else {
            localStorage.setItem(STORAGE_KEY, lang);
        }
        closeDialog(langDialog);
    });

    currencyOptions.addEventListener('click', function (e) {
        var btn = e.target.closest('.region-option');
        if (!btn) return;
        var code = btn.getAttribute('data-region-currency');
        currencyOptions.querySelectorAll('.region-option').forEach(function (b) {
            b.classList.remove('active');
        });
        btn.classList.add('active');
        if (window.EcoI18n) {
            window.EcoI18n.setCurrency(code);
        } else {
            localStorage.setItem(CURRENCY_STORAGE_KEY, code);
        }
        closeDialog(currDialog);
    });

})();
