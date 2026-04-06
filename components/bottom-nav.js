/* ========================================
   Bottom Navigation Bar (Mobile)
   Items: Moneda | Carrito | Idioma
   ======================================== */
(function () {
    var el = document.querySelector('[data-component="bottom-nav"]');
    if (!el) return;

    var base = el.dataset.base || '';

    el.outerHTML = [
        '<nav class="bottom-nav" role="navigation" aria-label="Navegación móvil">',

        '  <button class="bnb-item" id="bnb-currency-btn"',
        '          aria-label="Cambiar moneda" data-i18n-aria="aria_change_currency">',
        '    <svg class="bnb-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"',
        '         stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">',
        '      <line x1="12" y1="1" x2="12" y2="23"></line>',
        '      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>',
        '    </svg>',
        '    <span class="bnb-label" data-i18n="nav_currency">Moneda</span>',
        '  </button>',

        '  <a href="' + base + 'carrito.html" class="bnb-item bnb-item--cart"',
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
