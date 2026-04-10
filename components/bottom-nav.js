/* ========================================
   Bottom Navigation Bar (Mobile)
   Items: Inicio | Carrito | Idioma | Moneda
   ======================================== */
(function () {
    var el = document.querySelector('[data-component="bottom-nav"]');
    if (!el) return;

    var base  = el.dataset.base || '';
    var brand = window.ECOZOX_BRAND || {};

    // Resuelve una URL relativa a absoluta usando la ubicación actual
    function toAbsolute(rel) {
        var a = document.createElement('a');
        a.href = rel;
        return a.href;
    }

    // Si estamos en un nicho, persistimos las URLs absolutas del nicho
    // para que páginas compartidas (legales, contacto) sepan a dónde volver
    if (brand.homeUrl) {
        sessionStorage.setItem('ecozox_nicho_home',    toAbsolute(brand.homeUrl));
        sessionStorage.setItem('ecozox_nicho_carrito', toAbsolute(brand.carritoUrl || 'carrito.html'));
    }

    var homeUrl    = brand.homeUrl    ? toAbsolute(brand.homeUrl)
                   : sessionStorage.getItem('ecozox_nicho_home')    || base + 'index.html';
    var carritoUrl = brand.carritoUrl ? toAbsolute(brand.carritoUrl)
                   : sessionStorage.getItem('ecozox_nicho_carrito') || base + 'carrito.html';

    el.outerHTML = [
        '<nav class="bottom-nav" role="navigation" aria-label="Navegación móvil">',

        '  <a href="' + homeUrl + '" class="bnb-item"',
        '     aria-label="Inicio" data-i18n-aria="nav_home">',
        '    <svg class="bnb-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"',
        '         stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">',
        '      <path d="M3 9.5L12 3l9 6.5V21H3V9.5z"></path>',
        '      <path d="M9 21V12h6v9"></path>',
        '    </svg>',
        '    <span class="bnb-label" data-i18n="nav_home">Inicio</span>',
        '  </a>',

        '  <a href="' + carritoUrl + '" class="bnb-item bnb-item--cart"',
        '     aria-label="Carrito" data-i18n-aria="nav_cart">',
        '    <span class="bnb-cart-wrap">',
        '      <img src="' + base + 'assets/bag.svg" alt="" class="bnb-icon" aria-hidden="true">',
        '      <span class="bnb-cart-badge cart-count">0</span>',
        '    </span>',
        '    <span class="bnb-label" data-i18n="nav_cart">Carrito</span>',
        '  </a>',

        '  <button class="bnb-item" id="bnb-lang-btn"',
        '          aria-label="Cambiar idioma" data-i18n-aria="aria_change_lang">',
        '    <svg class="bnb-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"',
        '         stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">',
        '      <circle cx="12" cy="12" r="10"></circle>',
        '      <path d="M2 12h20"></path>',
        '      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10',
        '              15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>',
        '    </svg>',
        '    <span class="bnb-label" data-i18n="nav_language">Idioma</span>',
        '  </button>',

        '  <button class="bnb-item" id="bnb-currency-btn"',
        '          aria-label="Cambiar moneda" data-i18n-aria="aria_change_currency">',
        '    <svg class="bnb-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"',
        '         stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">',
        '      <line x1="12" y1="1" x2="12" y2="23"></line>',
        '      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>',
        '    </svg>',
        '    <span class="bnb-label" data-i18n="nav_currency">Moneda</span>',
        '  </button>',

        '</nav>'
    ].join('\n');

    /* ---------- Wire dialog triggers ---------- */
    var currBtn = document.getElementById('bnb-currency-btn');
    var langBtn = document.getElementById('bnb-lang-btn');

    if (currBtn) {
        currBtn.addEventListener('click', function () {
            var d = document.getElementById('currency-dialog');
            if (d) d.showModal();
        });
    }

    if (langBtn) {
        langBtn.addEventListener('click', function () {
            var d = document.getElementById('region-dialog');
            if (d) d.showModal();
        });
    }
})();
