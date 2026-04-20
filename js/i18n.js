/* ========================================
   i18n — Internacionalización (Motor Central)
   Carga traducciones desde locales/*.js
   Soporta 12 idiomas + RTL + conversión de moneda
   Exposes window.EcoI18n API
   ======================================== */

(function () {
    var STORAGE_KEY = 'ecozox_lang';
    var CURRENCY_STORAGE_KEY = 'ecozox_currency';
    var SUPPORTED_LANGS = ['es','en','ar','zh','ja','ko','id','de','fr','it','pt','tr'];
    var DEFAULT_LANG = 'es';
    var RTL_LANGS = ['ar'];

    /* ---------- Configuración de moneda por idioma (fallback) ---------- */
    var currencyConfig = {
        es: { symbol: '€',   code: 'EUR', rate: 1,      locale: 'es-ES' },
        en: { symbol: '$',   code: 'USD', rate: 1.09,   locale: 'en-US' },
        ar: { symbol: 'ر.س', code: 'SAR', rate: 4.08,   locale: 'ar-SA' },
        zh: { symbol: '¥',   code: 'CNY', rate: 7.87,   locale: 'zh-CN' },
        ja: { symbol: '¥',   code: 'JPY', rate: 162.50, locale: 'ja-JP' },
        ko: { symbol: '₩',   code: 'KRW', rate: 1435,   locale: 'ko-KR' },
        id: { symbol: 'Rp',  code: 'IDR', rate: 17065,  locale: 'id-ID' },
        de: { symbol: '€',   code: 'EUR', rate: 1,      locale: 'de-DE' },
        fr: { symbol: '€',   code: 'EUR', rate: 1,      locale: 'fr-FR' },
        it: { symbol: '€',   code: 'EUR', rate: 1,      locale: 'it-IT' },
        pt: { symbol: 'R$',  code: 'BRL', rate: 5.40,   locale: 'pt-BR' },
        tr: { symbol: '₺',   code: 'TRY', rate: 34.89,  locale: 'tr-TR' }
    };

    /* ---------- Todas las monedas disponibles ---------- */
    var allCurrencies = {
        EUR: { symbol: '€',   rate: 1,      locale: 'es-ES',  zeroDecimals: false },
        USD: { symbol: '$',   rate: 1.09,   locale: 'en-US',  zeroDecimals: false },
        JPY: { symbol: '¥',   rate: 162.50, locale: 'ja-JP',  zeroDecimals: true  },
        GBP: { symbol: '£',   rate: 0.86,   locale: 'en-GB',  zeroDecimals: false },
        CNY: { symbol: '¥',   rate: 7.87,   locale: 'zh-CN',  zeroDecimals: false },
        KRW: { symbol: '₩',   rate: 1435,   locale: 'ko-KR',  zeroDecimals: true  },
        SAR: { symbol: 'ر.س', rate: 4.08,   locale: 'ar-SA',  zeroDecimals: false },
        IDR: { symbol: 'Rp',  rate: 17065,  locale: 'id-ID',  zeroDecimals: true  },
        BRL: { symbol: 'R$',  rate: 5.40,   locale: 'pt-BR',  zeroDecimals: false },
        MXN: { symbol: '$',   rate: 18.64,  locale: 'es-MX',  zeroDecimals: false },
        CLP: { symbol: '$',   rate: 1033,   locale: 'es-CL',  zeroDecimals: true  },
        RUB: { symbol: '₽',   rate: 100,    locale: 'ru-RU',  zeroDecimals: false },
        INR: { symbol: '₹',   rate: 90.33,  locale: 'hi-IN',  zeroDecimals: false },
        CAD: { symbol: '$',   rate: 1.48,   locale: 'en-CA',  zeroDecimals: false },
        AUD: { symbol: '$',   rate: 1.66,   locale: 'en-AU',  zeroDecimals: false },
        NZD: { symbol: '$',   rate: 1.82,   locale: 'en-NZ',  zeroDecimals: false },
        TRY: { symbol: '₺',   rate: 34.89,  locale: 'tr-TR',  zeroDecimals: false }
    };

    var SUPPORTED_CURRENCIES = Object.keys(allCurrencies);

    /* ---------- Fuentes CJK ---------- */
    var CJK_FONTS = {
        zh: 'https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700;800&display=swap',
        ja: 'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700;800&display=swap',
        ko: 'https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;800&display=swap'
    };
    var loadedFonts = {};

    function loadCJKFont(lang) {
        if (!CJK_FONTS[lang] || loadedFonts[lang]) return;
        loadedFonts[lang] = true;
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = CJK_FONTS[lang];
        document.head.appendChild(link);
    }

    /* ---------- Cache de locales cargados ---------- */
    var localeCache = {};
    var pendingCallbacks = {};

    /* ---------- Detectar base path ---------- */
    function getBasePath() {
        var scripts = document.querySelectorAll('script[src*="i18n.js"]');
        for (var i = 0; i < scripts.length; i++) {
            var src = scripts[i].getAttribute('src') || '';
            var idx = src.indexOf('js/i18n.js');
            if (idx !== -1) return src.substring(0, idx);
        }
        return '';
    }

    var basePath = getBasePath();

    /* ---------- Cargar archivo de locale global ---------- */
    function loadLocale(lang, callback) {
        if (localeCache[lang]) { callback(); return; }

        if (pendingCallbacks[lang]) {
            pendingCallbacks[lang].push(callback);
            return;
        }

        pendingCallbacks[lang] = [callback];

        var script = document.createElement('script');
        script.src = basePath + 'locales/' + lang + '.js';
        script.onload = function () {
            if (window.EcoLocales && window.EcoLocales[lang]) {
                localeCache[lang] = window.EcoLocales[lang];
            }
            var cbs = pendingCallbacks[lang] || [];
            delete pendingCallbacks[lang];
            cbs.forEach(function (cb) { cb(); });
        };
        script.onerror = function () {
            delete pendingCallbacks[lang];
            if (lang !== 'en') { loadLocale('en', callback); } else { callback(); }
        };
        document.head.appendChild(script);
    }

    /* ---------- Cargar locale específico del nicho ----------
       Lee ECOZOX_BRAND.localesPath (relativo a la página actual).
       Las claves del nicho sobreescriben las globales en localeCache.
    --------------------------------------------------------- */
    var nichoLangLoaded = {};

    function loadNichoLocale(lang, callback) {
        var nichoPath = window.ECOZOX_BRAND && window.ECOZOX_BRAND.localesPath;
        if (!nichoPath || nichoLangLoaded[lang]) { callback(); return; }

        nichoLangLoaded[lang] = true;

        var script = document.createElement('script');
        script.src = nichoPath + lang + '.js';
        script.onload = function () {
            if (window.EcoNichoLocales && window.EcoNichoLocales[lang]) {
                // Mezclar sobre el cache global — el nicho tiene prioridad
                localeCache[lang] = Object.assign(
                    {},
                    localeCache[lang] || {},
                    window.EcoNichoLocales[lang]
                );
            }
            callback();
        };
        script.onerror = function () { callback(); }; // falla silenciosa
        document.head.appendChild(script);
    }

    /* ---------- Acceso seguro a localStorage (falla en modo privado) ---------- */
    function lsGet(key) {
        try { return localStorage.getItem(key); } catch (e) { return null; }
    }
    function lsSet(key, value) {
        try { localStorage.setItem(key, value); } catch (e) {}
    }
    function lsRemove(key) {
        try { localStorage.removeItem(key); } catch (e) {}
    }

    /* ---------- Detectar idioma ---------- */
    function detectLang() {
        var stored = lsGet(STORAGE_KEY);
        if (stored && SUPPORTED_LANGS.indexOf(stored) !== -1) return stored;

        var browserLang = (navigator.language || '').split('-')[0].toLowerCase();
        if (SUPPORTED_LANGS.indexOf(browserLang) !== -1) return browserLang;

        return DEFAULT_LANG;
    }

    var currentLang = detectLang();

    /* ---------- Detectar moneda ---------- */
    function detectCurrency() {
        var stored = lsGet(CURRENCY_STORAGE_KEY);
        if (stored && allCurrencies[stored]) return stored;
        // Derivar de idioma
        var langConfig = currencyConfig[currentLang];
        return langConfig ? langConfig.code : 'USD';
    }

    var currentCurrency = detectCurrency();

    /* ---------- API pública ---------- */
    function getLang() {
        return currentLang;
    }

    function getSupportedLangs() {
        return SUPPORTED_LANGS.slice();
    }

    function getCurrencyConfig(lang) {
        return currencyConfig[lang || currentLang] || currencyConfig.en;
    }

    function getCurrency() {
        return currentCurrency;
    }

    function setCurrency(code) {
        if (!allCurrencies[code]) return;
        currentCurrency = code;
        lsSet(CURRENCY_STORAGE_KEY, code);
        applyPrices();
        updateCurrencySelector();
        if (window.EcoCartRenderer)   window.EcoCartRenderer.renderCart();
        if (window.EcoProductCards)   window.EcoProductCards.update();
        if (window.EcoShippingWidget) window.EcoShippingWidget.update();
    }

    function isRTL(lang) {
        return RTL_LANGS.indexOf(lang || currentLang) !== -1;
    }

    function setLang(lang) {
        if (SUPPORTED_LANGS.indexOf(lang) === -1) return;

        loadCJKFont(lang);
        loadLocale(lang, function () {
            loadNichoLocale(lang, function () {
                currentLang = lang;
                lsSet(STORAGE_KEY, lang);

                document.documentElement.lang = lang;
                document.documentElement.dir = isRTL(lang) ? 'rtl' : 'ltr';

                if (!lsGet(CURRENCY_STORAGE_KEY)) {
                    var langConfig = currencyConfig[lang];
                    if (langConfig) currentCurrency = langConfig.code;
                }

                function applyAll() {
                    applyTranslations();
                    applyPrices();
                    updateLangSelector();
                    updateCurrencySelector();
                    if (window.EcoCartRenderer)    window.EcoCartRenderer.renderCart();
                    if (window.EcoShippingWidget)  window.EcoShippingWidget.update();
                    if (window.EcoProductCards)    window.EcoProductCards.update();
                    if (window.EcoReviews)         window.EcoReviews.update();
                }

                var isCJK = ['zh','ja','ko'].indexOf(lang) !== -1;
                if (isCJK && document.fonts && document.fonts.ready) {
                    document.fonts.ready.then(applyAll);
                } else {
                    applyAll();
                }
            });
        });
    }

    function t(key) {
        var dict = localeCache[currentLang];
        if (dict && dict[key] !== undefined) return dict[key];
        // Fallback a inglés
        var enDict = localeCache.en;
        if (enDict && enDict[key] !== undefined) return enDict[key];
        return key;
    }

    /* ---------- Formateo de precios con conversión de moneda ---------- */
    function formatPrice(amountUSD) {
        var config = allCurrencies[currentCurrency] || allCurrencies.USD;
        var converted = amountUSD * config.rate;
        var decimals = config.zeroDecimals ? 0 : 2;

    return new Intl.NumberFormat(config.locale, {
        style: 'currency',
        currency: currentCurrency,
        currencyDisplay: 'narrowSymbol',
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    }).format(converted).replace(/\s/g, '');
    }


    /* ---------- Locale para formato de fecha ---------- */
    function getDateLocale() {
        var config = currencyConfig[currentLang];
        return config ? config.locale : 'en-US';
    }

    /* ---------- Decodifica entidades HTML (ej. &copy;) y devuelve texto plano ---------- */
    var _entityDiv = document.createElement('div');
    function decodeEntities(str) {
        _entityDiv.innerHTML = str;
        return _entityDiv.textContent || '';
    }

    /* ---------- Aplicar traducciones al DOM ---------- */
    function applyTranslations() {
        // Textos internos — se usa textContent para evitar XSS.
        // decodeEntities convierte &copy; → © sin ejecutar ningún HTML.
        var discountPct = (window.ECOZOX_CONFIG && window.ECOZOX_CONFIG.discountPercent != null)
            ? window.ECOZOX_CONFIG.discountPercent
            : (function () { try { var s = localStorage.getItem('ecozox_desc'); return s !== null ? parseFloat(s) : 30; } catch (e) { return 30; } }());
        var bundleExtraPct = (window.ECOZOX_CONFIG && window.ECOZOX_CONFIG.bundleExtraDiscount != null)
            ? window.ECOZOX_CONFIG.bundleExtraDiscount
            : 20;
        document.querySelectorAll('[data-i18n]').forEach(function (el) {
            var key = el.getAttribute('data-i18n');
            var value = t(key);
            if (value !== key) {
                el.textContent = decodeEntities(value).replace('{pct}', discountPct).replace('{bpct}', bundleExtraPct);
            }
        });

        // Placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
            var key = el.getAttribute('data-i18n-placeholder');
            var value = t(key);
            if (value !== key) {
                el.placeholder = value;
            }
        });

        // aria-labels
        document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
            var key = el.getAttribute('data-i18n-aria');
            var value = t(key);
            if (value !== key) {
                el.setAttribute('aria-label', value);
            }
        });

        // alt texts
        document.querySelectorAll('[data-i18n-alt]').forEach(function (el) {
            var key = el.getAttribute('data-i18n-alt');
            var value = t(key);
            if (value !== key) {
                el.alt = value;
            }
        });

        // Page title
        var titleKey = document.documentElement.getAttribute('data-i18n-title');
        if (titleKey) {
            document.title = t(titleKey);
        }
    }

    /* ---------- Aplicar precios convertidos ---------- */
    function applyPrices() {
        document.querySelectorAll('[data-i18n-price]').forEach(function (el) {
            var price = parseFloat(el.getAttribute('data-i18n-price'));
            if (isNaN(price) || price <= 0) {
                el.textContent = '—';
            } else {
                el.textContent = formatPrice(price);
            }
        });
    }

    /* ---------- Actualizar selector de moneda ---------- */
    function updateCurrencySelector() {
        var currencyOptions = document.getElementById('regionCurrencyOptions');
        if (currencyOptions) {
            currencyOptions.querySelectorAll('.region-option').forEach(function (btn) {
                btn.classList.toggle('active', btn.getAttribute('data-region-currency') === currentCurrency);
            });
        }
    }

    /* ---------- Actualizar selector de idioma ---------- */
    function updateLangSelector() {
        document.querySelectorAll('.lang-option').forEach(function (btn) {
            btn.classList.toggle('active', btn.dataset.lang === currentLang);
        });
        var codeEl = document.querySelector('.lang-current-code');
        if (codeEl) codeEl.textContent = currentLang.toUpperCase();

        // Sincronizar el dialog de región
        var regionLangOptions = document.getElementById('regionLangOptions');
        if (regionLangOptions) {
            regionLangOptions.querySelectorAll('.region-option').forEach(function (btn) {
                btn.classList.toggle('active', btn.getAttribute('data-region-lang') === currentLang);
            });
        }
    }

    /* ---------- Inicializar ---------- */
    function init() {
        document.documentElement.lang = currentLang;
        document.documentElement.dir = isRTL(currentLang) ? 'rtl' : 'ltr';
        loadCJKFont(currentLang);

        // 1. Global inglés (fallback) → 2. Nicho inglés → 3. Idioma actual → 4. Nicho idioma actual
        loadLocale('en', function () {
            loadNichoLocale('en', function () {
                var afterLoad = function () {
                    var isCJK = ['zh','ja','ko'].indexOf(currentLang) !== -1;
                    function applyAll() {
                        applyTranslations();
                        applyPrices();
                        updateLangSelector();
                        updateCurrencySelector();
                        if (window.EcoCartRenderer)     window.EcoCartRenderer.renderCart();
                        if (window.EcoShippingWidget)   window.EcoShippingWidget.update();
                        if (window.EcoProductCards)     window.EcoProductCards.update();
                        if (window.EcoReviews)          window.EcoReviews.update();
                        if (window.EcoPurchaseOptions)  window.EcoPurchaseOptions.update();
                    }
                    if (isCJK && document.fonts && document.fonts.ready) {
                        document.fonts.ready.then(applyAll);
                    } else {
                        applyAll();
                    }
                };
                if (currentLang === 'en') {
                    afterLoad();
                } else {
                    loadLocale(currentLang, function () {
                        loadNichoLocale(currentLang, afterLoad);
                    });
                }
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    /* ---------- Exponer API global ---------- */
    window.EcoI18n = {
        getLang: getLang,
        setLang: setLang,
        getCurrency: getCurrency,
        setCurrency: setCurrency,
        t: t,
        formatPrice: formatPrice,
        applyTranslations: applyTranslations,
        applyPrices: applyPrices,
        getSupportedLangs: getSupportedLangs,
        getCurrencyConfig: getCurrencyConfig,
        getDateLocale: getDateLocale,
        isRTL: isRTL
    };
})();
