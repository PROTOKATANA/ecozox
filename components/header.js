/* ========================================
   Header Component
   ======================================== */
(function () {
    const el = document.querySelector('[data-component="header"]');
    if (!el) return;

    const base = el.dataset.base || '';

    el.outerHTML = `
    <header class="header">
        <div class="container" style="display: flex; justify-content: space-between; align-items: center;">
            <a href="${base}index.html" class="logo">EcoZox.</a>
            
            <nav class="header-nav">
                <a href="${base}contacto.html" class="nav-link">Contacto</a>
            </nav>

            <a href="${base}carrito.html" class="cart-button">
                <img src="${base}assets/bag.svg" alt="Carrito" class="cart-btn-icon">
                <span class="cart-btn-divider"></span>
                <span class="cart-count">${(function(){try{return (JSON.parse(localStorage.getItem('ecozox_cart'))||[]).reduce(function(s,i){return s+i.quantity},0)}catch(e){return 0}}())}</span>
            </a>
        </div>
    </header>`;
})();
