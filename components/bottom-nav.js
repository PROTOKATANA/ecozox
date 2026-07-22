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
    if (brand.carritoUrl) {
        sessionStorage.setItem('ecozox_nicho_carrito', toAbsolute(brand.carritoUrl));
    }

    var homeUrl    = brand.homeUrl    ? base + brand.homeUrl : base + 'index.html';
    var carritoUrl = brand.carritoUrl ? toAbsolute(brand.carritoUrl)
                   : sessionStorage.getItem('ecozox_nicho_carrito') || base + 'carrito.html';

    // El primer item cambia de función según la vista: en el producto salta
    // a reseñas (ancla en la misma página); en cualquier otra vista (carrito,
    // contacto, legales) vuelve al producto.
    // "index.html" al final se normaliza fuera: https://ecozox.com/ y
    // https://ecozox.com/index.html son la misma página pero strings distintos.
    function stripIndex(u) {
        return u.replace(/index\.html$/, '');
    }
    var homeUrlAbs     = stripIndex(toAbsolute(homeUrl).split('#')[0].split('?')[0]);
    var currentUrlBase = stripIndex(location.href.split('#')[0].split('?')[0]);
    var isProductPage  = currentUrlBase === homeUrlAbs;

    var firstItemHref, firstItemKey, firstItemLabel, firstItemIcon;

    if (isProductPage) {
        firstItemHref  = homeUrl + '#reviews';
        firstItemKey   = 'nav_reviews';
        firstItemLabel = 'Reseñas';
        firstItemIcon  = '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>';
    } else {
        firstItemHref  = homeUrl;
        firstItemKey   = 'nav_back';
        firstItemLabel = 'Volver';
        firstItemIcon  = '<line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline>';
    }

    el.outerHTML = [
        '<nav class="bottom-nav" role="navigation" aria-label="Navegación móvil">',

        '  <a href="' + firstItemHref + '" class="bnb-item"',
        '     aria-label="' + firstItemLabel + '" data-i18n-aria="' + firstItemKey + '">',
        '    <svg class="bnb-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"',
        '         stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">',
              firstItemIcon,
        '    </svg>',
        '    <span class="bnb-label" data-i18n="' + firstItemKey + '">' + firstItemLabel + '</span>',
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
