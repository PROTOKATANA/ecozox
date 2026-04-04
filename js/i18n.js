/* ========================================
   i18n — Internacionalización (Motor Central)
   Carga traducciones desde locales/*.js
   Soporta 12 idiomas + RTL + conversión de moneda
   Exposes window.EcoI18n API
   ======================================== */

(function () {
    var STORAGE_KEY = 'ecozox_lang';
    var SUPPORTED_LANGS = ['es','en','ar','zh','ja','ko','id','de','fr','it','pt','tr'];
    var DEFAULT_LANG = 'es';
    var RTL_LANGS = ['ar'];

    /* ---------- Configuración de moneda por idioma ---------- */
    var currencyConfig = {
        es: { symbol: '€',  code: 'EUR', rate: 0.92,  locale: 'es-ES' },
        en: { symbol: '$',  code: 'USD', rate: 1,     locale: 'en-US' },
        ar: { symbol: 'ر.س', code: 'SAR', rate: 3.75,  locale: 'ar-SA' },
        zh: { symbol: '¥',  code: 'CNY', rate: 7.24,  locale: 'zh-CN' },
        ja: { symbol: '¥',  code: 'JPY', rate: 149.50, locale: 'ja-JP' },
        ko: { symbol: '₩',  code: 'KRW', rate: 1320,  locale: 'ko-KR' },
        id: { symbol: 'Rp', code: 'IDR', rate: 15700, locale: 'id-ID' },
        de: { symbol: '€',  code: 'EUR', rate: 0.92,  locale: 'de-DE' },
        fr: { symbol: '€',  code: 'EUR', rate: 0.92,  locale: 'fr-FR' },
        it: { symbol: '€',  code: 'EUR', rate: 0.92,  locale: 'it-IT' },
        pt: { symbol: 'R$', code: 'BRL', rate: 4.97,  locale: 'pt-BR' },
        tr: { symbol: '₺',  code: 'TRY', rate: 32.10, locale: 'tr-TR' }
    };

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

    /* ---------- Cargar archivo de locale ---------- */
    function loadLocale(lang, callback) {
        // Ya cacheado
        if (localeCache[lang]) {
            callback();
            return;
        }

        // Ya cargándose — añadir callback a la cola
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
            // Fallback a inglés si falla
            if (lang !== 'en') {
                loadLocale('en', callback);
            } else {
                callback();
            }
        };
        document.head.appendChild(script);
    }

    /* ---------- Detectar idioma ---------- */
    function detectLang() {
        var stored = localStorage.getItem(STORAGE_KEY);
        if (stored && SUPPORTED_LANGS.indexOf(stored) !== -1) return stored;

        var browserLang = (navigator.language || '').split('-')[0].toLowerCase();
        if (SUPPORTED_LANGS.indexOf(browserLang) !== -1) return browserLang;

        return DEFAULT_LANG;
    }

    var currentLang = detectLang();

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

    function isRTL(lang) {
        return RTL_LANGS.indexOf(lang || currentLang) !== -1;
    }

    function setLang(lang) {
        if (SUPPORTED_LANGS.indexOf(lang) === -1) return;

        loadCJKFont(lang);
        loadLocale(lang, function () {
            currentLang = lang;
            localStorage.setItem(STORAGE_KEY, lang);

            document.documentElement.lang = lang;
            document.documentElement.dir = isRTL(lang) ? 'rtl' : 'ltr';

            function applyAll() {
                applyTranslations();
                applyPrices();
                updateLangSelector();
                if (window.EcoCartRenderer)    window.EcoCartRenderer.renderCart();
                if (window.EcoUrgencyBanner)   window.EcoUrgencyBanner.update();
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
        var config = currencyConfig[currentLang] || currencyConfig.en;
        var converted = amountUSD * config.rate;

        return new Intl.NumberFormat(config.locale, {
            style: 'currency',
            currency: config.code,
            minimumFractionDigits: config.code === 'JPY' || config.code === 'KRW' || config.code === 'IDR' ? 0 : 2,
            maximumFractionDigits: config.code === 'JPY' || config.code === 'KRW' || config.code === 'IDR' ? 0 : 2
        }).format(converted);
    }

    /* ---------- Locale para formato de fecha ---------- */
    function getDateLocale() {
        var config = currencyConfig[currentLang];
        return config ? config.locale : 'en-US';
    }

    /* ---------- Aplicar traducciones al DOM ---------- */
    function applyTranslations() {
        // Textos internos (textContent / innerHTML)
        document.querySelectorAll('[data-i18n]').forEach(function (el) {
            var key = el.getAttribute('data-i18n');
            var value = t(key);
            if (value !== key) {
                el.innerHTML = value;
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
            var usdPrice = parseFloat(el.getAttribute('data-i18n-price'));
            if (!isNaN(usdPrice)) {
                el.textContent = formatPrice(usdPrice);
            }
        });
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

        // Cargar inglés como fallback, luego el idioma actual
        loadLocale('en', function () {
            var afterLoad = function () {
                var isCJK = ['zh','ja','ko'].indexOf(currentLang) !== -1;
                function applyAll() {
                    applyTranslations();
                    applyPrices();
                    updateLangSelector();
                    if (window.EcoCartRenderer)   window.EcoCartRenderer.renderCart();
                    if (window.EcoUrgencyBanner)  window.EcoUrgencyBanner.update();
                    if (window.EcoShippingWidget) window.EcoShippingWidget.update();
                    if (window.EcoProductCards)   window.EcoProductCards.update();
                    if (window.EcoReviews)        window.EcoReviews.update();
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
                loadLocale(currentLang, afterLoad);
            }
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
