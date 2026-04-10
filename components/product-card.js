/* ========================================
   Product Grid — carga nichos.json y renderiza
   una card por nicho activo.
   Usage: <div data-component="product-grid"></div>
   ======================================== */

(function () {
    var placeholder = document.querySelector('[data-component="product-grid"]');
    if (!placeholder) return;

    var DISCOUNT = 0.30;

    function t(key) {
        return (window.EcoI18n && window.EcoI18n.t) ? window.EcoI18n.t(key) : key;
    }

    function formatPrice(amount) {
        return (window.EcoI18n && window.EcoI18n.formatPrice)
            ? window.EcoI18n.formatPrice(amount)
            : '$' + parseFloat(amount).toFixed(2);
    }

    function buildCard(product) {
        var salePrice     = parseFloat(product.precio);
        var originalPrice = salePrice / (1 - DISCOUNT);
        var titulo        = product.titulo || '';

        return '<a href="' + product.link + '" class="product-card"'
            + ' data-product-id="'    + product.nicho  + '"'
            + ' data-product-title="' + titulo          + '"'
            + ' data-product-price="' + salePrice       + '"'
            + ' data-product-image="' + product.imagen  + '"'
            + ' data-product-link="'  + product.link    + '">'
            + '<div class="product-img-wrapper">'
            +   '<img src="' + product.imagen + '" alt="' + titulo + '" class="product-image" loading="lazy">'
            +   '<span class="discount-badge" aria-label="Descuento del 30%">-30%</span>'
            + '</div>'
            + '<div class="product-info">'
            +   '<h2 class="product-title">' + titulo + '</h2>'
            +   '<div class="product-price-wrapper">'
            +     '<span class="product-price" data-i18n-price="' + salePrice + '">' + formatPrice(salePrice) + '</span>'
            +     '<span class="product-price-old" data-i18n-price="' + originalPrice.toFixed(2) + '">' + formatPrice(originalPrice) + '</span>'
            +   '</div>'
            +   '<button class="btn btn-blue add-to-cart-btn" data-i18n="sticky_cart_btn">' + t('sticky_cart_btn') + '</button>'
            + '</div>'
            + '</a>';
    }

    function renderGrid(products) {
        var grid = document.querySelector('.product-grid');
        if (!grid) return;
        grid.innerHTML = products.map(buildCard).join('');
        if (window.EcoI18n) window.EcoI18n.applyPrices();
    }

    // Reemplazar placeholder antes de fetch para que el grid exista
    placeholder.outerHTML = '<div class="product-grid"></div>';

    fetch('nichos.json')
        .then(function (res) {
            if (!res.ok) throw new Error('nichos.json no encontrado');
            return res.json();
        })
        .then(function (productos) {
            renderGrid(productos);
        })
        .catch(function (err) {
            console.error('product-grid:', err.message);
        });

    // Exponer update para que i18n re-renderice precios al cambiar moneda
    window.EcoProductCards = {
        update: function () {
            fetch('nichos.json')
                .then(function (r) { return r.json(); })
                .then(renderGrid);
        }
    };
})();
