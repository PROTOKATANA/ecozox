/* ========================================
   Product Grid — carga nichos.json y renderiza
   una card por nicho activo.
   Usage: <div data-component="product-grid"></div>
   ======================================== */

(function () {
    var placeholder = document.querySelector('[data-component="product-grid"]');
    if (!placeholder) return;

    function getDiscount() {
        if (window.ECOZOX_CONFIG && window.ECOZOX_CONFIG.discountPercent != null)
            return window.ECOZOX_CONFIG.discountPercent / 100;
        try {
            var s = localStorage.getItem('ecozox_desc');
            if (s !== null) return parseFloat(s) / 100;
        } catch (e) {}
        return null;
    }

    function t(key) {
        return (window.EcoI18n && window.EcoI18n.t) ? window.EcoI18n.t(key) : key;
    }

    function formatPrice(amount) {
        return (window.EcoI18n && window.EcoI18n.formatPrice)
            ? window.EcoI18n.formatPrice(amount)
            : '€' + parseFloat(amount).toFixed(2);
    }

    function buildCard(product) {
        var salePrice  = parseFloat(product.precio);
        var discount   = getDiscount();
        var titulo     = product.titulo || '';
        var salePriceHtml = (!isNaN(salePrice) && salePrice > 0)
            ? '<span class="product-price" data-i18n-price="' + salePrice + '">' + formatPrice(salePrice) + '</span>'
            : '<span class="product-price product-price--unavailable">N/A(0)</span>';
        var badgeHtml  = '<span class="discount-badge">-' + (discount != null ? Math.round(discount * 100) : 0) + '%</span>';
        var origPrice  = (product.precioOriginalCents != null)
            ? product.precioOriginalCents / 100
            : (discount != null && discount > 0 ? salePrice / (1 - discount) : null);
        var origHtml   = (origPrice != null && !isNaN(salePrice) && salePrice > 0)
            ? '<span class="product-price-old" data-i18n-price="' + origPrice.toFixed(2) + '">' + formatPrice(origPrice) + '</span>'
            : '';

        return '<a href="' + product.link + '" class="product-card"'
            + ' data-product-id="'    + product.nicho  + '"'
            + ' data-product-title="' + titulo          + '"'
            + ' data-product-price="' + salePrice       + '"'
            + ' data-product-image="' + product.imagen  + '"'
            + ' data-product-link="'  + product.link    + '">'
            + '<div class="product-img-wrapper">'
            +   '<img src="' + product.imagen + '" alt="' + titulo + '" class="product-image" loading="lazy">'
            +   badgeHtml
            + '</div>'
            + '<div class="product-info">'
            +   '<h2 class="product-title">' + titulo + '</h2>'
            +   '<div class="product-price-wrapper">'
            +     salePriceHtml
            +     origHtml
            +   '</div>'
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

    var apiBase = window.ECOZOX_API_URL || '';
    if (apiBase && !apiBase.match(/localhost|127\.0\.0\.1/) && apiBase.indexOf('http://') === 0)
        apiBase = 'https://' + apiBase.slice(7);

    function fetchNichos() {
        if (apiBase) {
            return fetch(apiBase + '/api/productos/nichos')
                .then(function (res) {
                    if (!res.ok) throw new Error('HTTP ' + res.status);
                    return res.json();
                })
                .then(function (data) {
                    // Normalizar: convertir cents → decimal y guardar descuento global
                    return data.map(function (entry) {
                        var d = entry.descuentoGlobal;
                        if (d != null) {
                            window.ECOZOX_CONFIG = window.ECOZOX_CONFIG || {};
                            window.ECOZOX_CONFIG.discountPercent = d;
                            try { localStorage.setItem('ecozox_desc', String(d)); } catch (e) {}
                        }
                        return Object.assign({}, entry, {
                            precio: entry.precioVentaCents != null ? entry.precioVentaCents / 100 : entry.precio,
                        });
                    });
                });
        }
        return fetch('nichos.json').then(function (r) {
            if (!r.ok) throw new Error('nichos.json no encontrado');
            return r.json();
        });
    }

    fetchNichos()
        .then(renderGrid)
        .catch(function (err) {
            console.error('product-grid:', err.message);
            // Fallback al JSON estático si falló la API
            if (apiBase) fetch('nichos.json').then(function (r) { return r.json(); }).then(renderGrid).catch(function(){});
        });

    // Exponer update para que i18n re-renderice precios al cambiar moneda
    window.EcoProductCards = {
        update: function () { fetchNichos().then(renderGrid).catch(function(){}); }
    };
})();
