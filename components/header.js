/* ========================================
   Header Component
   Renders: logo + cart button widget
   Usage: <div data-component="header" data-base=""></div>
   ======================================== */

(function () {
    const el = document.querySelector('[data-component="header"]');
    if (!el) return;

    const base = el.dataset.base || '';

    el.outerHTML = `
    <header class="header">
        <div class="container">
            <a href="${base}index.html" class="logo">EcoZox.</a>
            <a href="${base}carrito.html" class="cart-button">
                <img src="${base}assets/bag.svg" alt="Carrito" class="cart-btn-icon">
                <span class="cart-btn-divider"></span>
                <span class="cart-count">0</span>
            </a>
        </div>
    </header>`;
})();
