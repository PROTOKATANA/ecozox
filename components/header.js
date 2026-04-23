/* ========================================
   Header Component
   ======================================== */
(function () {
    var el = document.querySelector('[data-component="header"]');
    if (!el) return;

    var base  = el.dataset.base || '';
    var brand = window.ECOZOX_BRAND || {};
    var logoSrc    = brand.logoSrc    ? base + brand.logoSrc    : base + 'assets/logo.png';
    var logoAlt    = brand.logoAlt    || 'EcoZox';
    var carritoUrl = brand.carritoUrl || base + 'carrito.html';

    // Todos los idiomas soportados
    var languages = [
        { code: 'en', flag: 'us', label: 'English',   suffix: 'EN' },
        { code: 'zh', flag: 'cn', label: '中文',      suffix: 'ZH' },
        { code: 'hi', flag: 'in', label: 'हिन्दी',    suffix: 'HI' },
        { code: 'es', flag: 'es', label: 'Español',   suffix: 'ES' },
        { code: 'fr', flag: 'fr', label: 'Français',  suffix: 'FR' },
        { code: 'ar', flag: 'sa', label: 'العربية',  suffix: 'AR' },
        { code: 'pt', flag: 'br', label: 'Português', suffix: 'PT' },
        { code: 'ru', flag: 'ru', label: 'Русский',   suffix: 'RU' },
        { code: 'id', flag: 'id', label: 'Indonesia', suffix: 'ID' },
        { code: 'de', flag: 'de', label: 'Deutsch',   suffix: 'DE' },
        { code: 'ja', flag: 'jp', label: '日本語',    suffix: 'JA' },
        { code: 'tr', flag: 'tr', label: 'Türkçe',    suffix: 'TR' },
        { code: 'ko', flag: 'kr', label: '한국어',    suffix: 'KO' },
        { code: 'it', flag: 'it', label: 'Italiano',  suffix: 'IT' },
        { code: 'pl', flag: 'pl', label: 'Polski',     suffix: 'PL' }
    ];

    // Precargar Noto Sans para CJK
    var CJK_FONTS = {
        zh: 'https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700;800&display=swap',
        ja: 'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700;800&display=swap',
        ko: 'https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;800&display=swap',
        hi: 'https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;500;700;800&display=swap'
    };
    ['zh', 'ja', 'ko', 'hi'].forEach(function (lang) {
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
        { code: 'IDR', flag: 'id', label: 'Rupia indonesia',       symbol: 'Rp'  },
        { code: 'PLN', flag: 'pl', label: 'Esloti polaco',         symbol: 'zł'  }
    ];

    var currencyNames = {
        es: { USD:'Dólar estadounidense', EUR:'Euro', CAD:'Dólar canadiense', AUD:'Dólar australiano', GBP:'Libra esterlina', NZD:'Dólar neozelandés', JPY:'Yen japonés', INR:'Rupia india', CNY:'Yuan chino', KRW:'Won surcoreano', RUB:'Rublo ruso', BRL:'Real brasileño', SAR:'Riyal saudí', TRY:'Lira turca', MXN:'Peso mexicano', CLP:'Peso chileno', IDR:'Rupia indonesia', PLN:'Esloti polaco' },
        en: { USD:'US Dollar', EUR:'Euro', CAD:'Canadian Dollar', AUD:'Australian Dollar', GBP:'British Pound', NZD:'New Zealand Dollar', JPY:'Japanese Yen', INR:'Indian Rupee', CNY:'Chinese Yuan', KRW:'South Korean Won', RUB:'Russian Ruble', BRL:'Brazilian Real', SAR:'Saudi Riyal', TRY:'Turkish Lira', MXN:'Mexican Peso', CLP:'Chilean Peso', IDR:'Indonesian Rupiah', PLN:'Polish Zloty' },
        ar: { USD:'دولار أمريكي', EUR:'يورو', CAD:'دولار كندي', AUD:'دولار أسترالي', GBP:'جنيه إسترليني', NZD:'دولار نيوزيلندي', JPY:'ين ياباني', INR:'روبية هندية', CNY:'يوان صيني', KRW:'وون كوري جنوبي', RUB:'روبل روسي', BRL:'ريال برازيلي', SAR:'ريال سعودي', TRY:'ليرة تركية', MXN:'بيسو مكسيكي', CLP:'بيسو تشيلي', IDR:'روبية إندونيسية', PLN:'زلوتي بولندي' },
        zh: { USD:'美元', EUR:'欧元', CAD:'加元', AUD:'澳元', GBP:'英镑', NZD:'新西兰元', JPY:'日元', INR:'印度卢比', CNY:'人民币', KRW:'韩元', RUB:'俄罗斯卢布', BRL:'巴西雷亚尔', SAR:'沙特里亚尔', TRY:'土耳其里拉', MXN:'墨西哥比索', CLP:'智利比索', IDR:'印尼盾', PLN:'波兰兹罗提' },
        ja: { USD:'米ドル', EUR:'ユーロ', CAD:'カナダドル', AUD:'オーストラリアドル', GBP:'英ポンド', NZD:'ニュージーランドドル', JPY:'日本円', INR:'インドルピー', CNY:'中国人民元', KRW:'韓国ウォン', RUB:'ロシアルーブル', BRL:'ブラジルレアル', SAR:'サウジリヤル', TRY:'トルコリラ', MXN:'メキシコペソ', CLP:'チリペソ', IDR:'インドネシアルピア', PLN:'ポーランドズウォティ' },
        ko: { USD:'미국 달러', EUR:'유로', CAD:'캐나다 달러', AUD:'호주 달러', GBP:'영국 파운드', NZD:'뉴질랜드 달러', JPY:'일본 엔', INR:'인도 루피', CNY:'중국 위안', KRW:'한국 원', RUB:'러시아 루블', BRL:'브라질 헤알', SAR:'사우디 리얄', TRY:'터키 리라', MXN:'멕시코 페소', CLP:'칠레 페소', IDR:'인도네시아 루피아', PLN:'폴란드 즐로티' },
        id: { USD:'Dolar AS', EUR:'Euro', CAD:'Dolar Kanada', AUD:'Dolar Australia', GBP:'Pound Inggris', NZD:'Dolar Selandia Baru', JPY:'Yen Jepang', INR:'Rupee India', CNY:'Yuan Tiongkok', KRW:'Won Korea Selatan', RUB:'Rubel Rusia', BRL:'Real Brasil', SAR:'Riyal Saudi', TRY:'Lira Turki', MXN:'Peso Meksiko', CLP:'Peso Chili', IDR:'Rupiah Indonesia', PLN:'Zloty Polandia' },
        de: { USD:'US-Dollar', EUR:'Euro', CAD:'Kanadischer Dollar', AUD:'Australischer Dollar', GBP:'Britisches Pfund', NZD:'Neuseeland-Dollar', JPY:'Japanischer Yen', INR:'Indische Rupie', CNY:'Chinesischer Yuan', KRW:'Südkoreanischer Won', RUB:'Russischer Rubel', BRL:'Brasilianischer Real', SAR:'Saudi-Riyal', TRY:'Türkische Lira', MXN:'Mexikanischer Peso', CLP:'Chilenischer Peso', IDR:'Indonesische Rupiah', PLN:'Polnischer Zloty' },
        fr: { USD:'Dollar américain', EUR:'Euro', CAD:'Dollar canadien', AUD:'Dollar australien', GBP:'Livre sterling', NZD:'Dollar néo-zélandais', JPY:'Yen japonais', INR:'Roupie indienne', CNY:'Yuan chinois', KRW:'Won sud-coréen', RUB:'Rouble russe', BRL:'Réal brésilien', SAR:'Riyal saoudien', TRY:'Livre turque', MXN:'Peso mexicain', CLP:'Peso chilien', IDR:'Roupie indonésienne', PLN:'Zloty polonais' },
        it: { USD:'Dollaro statunitense', EUR:'Euro', CAD:'Dollaro canadese', AUD:'Dollaro australiano', GBP:'Sterlina britannica', NZD:'Dollaro neozelandese', JPY:'Yen giapponese', INR:'Rupia indiana', CNY:'Yuan cinese', KRW:'Won sudcoreano', RUB:'Rublo russo', BRL:'Real brasiliano', SAR:'Riyal saudita', TRY:'Lira turca', MXN:'Peso messicano', CLP:'Peso cileno', IDR:'Rupia indonesiana', PLN:'Zloty polacco' },
        pt: { USD:'Dólar americano', EUR:'Euro', CAD:'Dólar canadense', AUD:'Dólar australiano', GBP:'Libra esterlina', NZD:'Dólar neozelandês', JPY:'Iene japonês', INR:'Rúpia indiana', CNY:'Yuan chinês', KRW:'Won sul-coreano', RUB:'Rublo russo', BRL:'Real brasileiro', SAR:'Riyal saudita', TRY:'Lira turca', MXN:'Peso mexicano', CLP:'Peso chileno', IDR:'Rúpia indonésia', PLN:'Zloti polonês' },
        tr: { USD:'ABD Doları', EUR:'Euro', CAD:'Kanada Doları', AUD:'Avustralya Doları', GBP:'İngiliz Sterlini', NZD:'Yeni Zelanda Doları', JPY:'Japon Yeni', INR:'Hint Rupisi', CNY:'Çin Yuanı', KRW:'Güney Kore Wonu', RUB:'Rus Rublesi', BRL:'Brezilya Reali', SAR:'Suudi Riyali', TRY:'Türk Lirası', MXN:'Meksika Pesosu', CLP:'Şili Pesosu', IDR:'Endonezya Rupiası', PLN:'Polonya Zlotisi' },
        ru: { USD:'Доллар США', EUR:'Евро', CAD:'Канадский доллар', AUD:'Австралийский доллар', GBP:'Британский фунт', NZD:'Новозеландский доллар', JPY:'Японская иена', INR:'Индийская рупия', CNY:'Китайский юань', KRW:'Южнокорейская вона', RUB:'Российский рубль', BRL:'Бразильский реал', SAR:'Саудовский риял', TRY:'Турецкая лира', MXN:'Мексиканское песо', CLP:'Чилийское песо', IDR:'Индонезийская рупия', PLN:'Польский злотый' },
        hi: { USD:'अमेरिकी डॉलर', EUR:'यूरो', CAD:'कनाडाई डॉलर', AUD:'ऑस्ट्रेलियाई डॉलर', GBP:'ब्रिटिश पाउंड', NZD:'न्यूज़ीलैंड डॉलर', JPY:'जापानी येन', INR:'भारतीय रुपया', CNY:'चीनी युआन', KRW:'दक्षिण कोरियाई वॉन', RUB:'रूसी रूबल', BRL:'ब्राज़ीलियाई रियल', SAR:'सऊदी रियाल', TRY:'तुर्की लीरा', MXN:'मैक्सिकन पेसो', CLP:'चिलियाई पेसो', IDR:'इंडोनेशियाई रुपिया', PLN:'पोलिश ज़्लॉटी' },
        pl: { USD:'Dolar amerykański', EUR:'Euro', CAD:'Dolar kanadyjski', AUD:'Dolar australijski', GBP:'Funt szterling', NZD:'Dolar nowozelandzki', JPY:'Jen japoński', INR:'Rupia indyjska', CNY:'Juan chiński', KRW:'Won południowokoreański', RUB:'Rubel rosyjski', BRL:'Real brazylijski', SAR:'Riyal saudyjski', TRY:'Lira turecka', MXN:'Peso meksykańskie', CLP:'Peso chilijskie', IDR:'Rupia indonezyjska', PLN:'Złoty polski' }
    };

    var STORAGE_KEY = 'ecozox_lang';
    var CURRENCY_STORAGE_KEY = 'ecozox_currency';
    var SUPPORTED_CODES = languages.map(function (l) { return l.code; });

    var stored = localStorage.getItem(STORAGE_KEY)
        || (navigator.language || '').split('-')[0].toLowerCase();
    var currentLang = SUPPORTED_CODES.indexOf(stored) !== -1 ? stored : 'es';

    var langToCurrency = { es:'EUR', en:'USD', ar:'SAR', zh:'CNY', ja:'JPY', ko:'KRW', id:'IDR', de:'EUR', fr:'EUR', it:'EUR', pt:'BRL', tr:'TRY', ru:'RUB', hi:'INR', pl:'PLN' };
    var storedCurrency = localStorage.getItem(CURRENCY_STORAGE_KEY);
    var currentCurrency = storedCurrency || langToCurrency[currentLang] || 'USD';

    el.outerHTML = [
        '<header class="header">',
        '  <div class="container header-inner" style="display:flex;justify-content:space-between;align-items:center;">',
        '    <a href="' + base + 'index.html" class="logo">',
        '      <img src="' + logoSrc + '" alt="' + logoAlt + '" class="logo-img">',
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
        '      <a href="' + carritoUrl + '" class="cart-button">',
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

    function buildCurrencyButtons(lang) {
        var names = currencyNames[lang || currentLang] || currencyNames['es'];
        return currencies.map(function (c) {
            var active = c.code === currentCurrency ? ' active' : '';
            var flagImg = '<img src="https://flagcdn.com/24x18/' + c.flag + '.png"'
                + ' width="24" height="18" alt="' + c.code + '" class="region-flag"'
                + ' style="border-radius:2px;flex-shrink:0;">';
            var label = (names[c.code] || c.label).toUpperCase();
            return '<button class="region-option' + active + '" data-region-currency="' + c.code + '">'
                + '<span style="display:flex;align-items:center;gap:0.5rem;">'
                + flagImg + label
                + '<span class="region-option__secondary">(' + c.symbol + ')</span>'
                + '</span>'
                + CHECK_SVG
                + '</button>';
        }).join('');
    }

document.body.insertAdjacentHTML('beforeend',
        '<dialog id="region-dialog" class="region-dialog" aria-labelledby="region-dialog-title">'
        + '<button class="region-dialog__handle" id="regionDialogClose" aria-label="Cerrar" data-i18n-aria="aria_close">'
        +   '<span class="region-dialog__handle-bar"></span>'
        + '</button>'
        + '<div class="region-dialog__header">'
        +   '<h2 class="region-dialog__title" id="region-dialog-title" data-i18n="region_change_lang">Cambiar idioma</h2>'
        + '</div>'
        + '<div class="region-dialog__body">'
        +   '<div class="region-options" id="regionLangOptions">' + buildLangButtons() + '</div>'
        + '</div>'
        + '</dialog>'
    );

    document.body.insertAdjacentHTML('beforeend',
        '<dialog id="currency-dialog" class="region-dialog" aria-labelledby="currency-dialog-title">'
        + '<button class="region-dialog__handle" id="currencyDialogClose" aria-label="Cerrar" data-i18n-aria="aria_close">'
        +   '<span class="region-dialog__handle-bar"></span>'
        + '</button>'
        + '<div class="region-dialog__header">'
        +   '<h2 class="region-dialog__title" id="currency-dialog-title" data-i18n="region_change_currency">Cambiar moneda</h2>'
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
        currentLang = lang;
        if (window.EcoI18n) {
            window.EcoI18n.setLang(lang);
        } else {
            localStorage.setItem(STORAGE_KEY, lang);
        }
        currencyOptions.innerHTML = buildCurrencyButtons(lang);
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
