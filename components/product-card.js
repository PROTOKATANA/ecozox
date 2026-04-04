/* ========================================
   Product Card Component
   Renders product cards from data into a grid
   Usage: <div data-component="product-grid"></div>
   ======================================== */

(function () {
    var gridContainer = document.querySelector('[data-component="product-grid"]');
    if (!gridContainer) return;

    var products = [
        {
            id: 'reloj-classic-mono',
            titleKey: 'product_reloj',
            title: 'Reloj Classic Mono',
            price: 129.00,
            image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600&h=600',
            imageThumb: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=200&h=200',
            alt: 'Reloj Minimalista',
            link: 'producto.html'
        },
        {
            id: 'auriculares-silence-pro',
            titleKey: 'product_auriculares',
            title: 'Auriculares Silence Pro',
            price: 249.00,
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600&h=600',
            imageThumb: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=200&h=200',
            alt: 'Auriculares Inalámbricos',
            link: 'producto.html'
        },
        {
            id: 'mochila-canvas-explorer',
            titleKey: 'product_mochila',
            title: 'Mochila Canvas Explorer',
            price: 65.00,
            image: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&q=80&w=600&h=600',
            imageThumb: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&q=80&w=200&h=200',
            alt: 'Mochila Canvas',
            link: 'producto.html'
        },
        {
            id: 'set-tazas-matte',
            titleKey: 'product_tazas',
            title: 'Set Tazas Matte',
            price: 24.00,
            image: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?auto=format&fit=crop&q=80&w=600&h=600',
            imageThumb: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?auto=format&fit=crop&q=80&w=200&h=200',
            alt: 'Taza Cerámica',
            link: 'producto.html'
        }
    ];

    var DISCOUNT = 0.30;

    function t(key) {
        return (window.EcoI18n && window.EcoI18n.t) ? window.EcoI18n.t(key) : key;
    }

    function formatPrice(amount) {
        return (window.EcoI18n && window.EcoI18n.formatPrice)
            ? window.EcoI18n.formatPrice(amount)
            : '$' + amount.toFixed(2);
    }

    function renderGrid() {
        var cardsHTML = products.map(function (product, index, arr) {
            var soldOut      = index >= arr.length - 2;
            var salePrice    = product.price;
            var originalPrice = (salePrice / (1 - DISCOUNT)).toFixed(2);
            var titleText    = t(product.titleKey) || product.title;

            return '<a href="' + product.link + '" class="product-card' + (soldOut ? ' product-card--sold-out' : '') + '"'
                + ' data-product-id="' + product.id + '"'
                + ' data-product-title="' + product.title + '"'
                + ' data-product-price="' + salePrice + '"'
                + ' data-product-image="' + product.imageThumb + '"'
                + ' data-product-link="' + product.link + '">'
                + '<div class="product-img-wrapper">'
                +   '<img src="' + product.image + '" alt="' + product.alt + '" class="product-image" loading="lazy">'
                +   (soldOut
                        ? '<div class="sold-out-overlay" aria-label="Producto agotado" data-i18n="sold_out">' + t('sold_out') + '</div>'
                        : '<span class="discount-badge" aria-label="Descuento del 30%">-30%</span>')
                + '</div>'
                + '<div class="product-info">'
                +   '<h2 class="product-title" data-i18n="' + product.titleKey + '">' + titleText + '</h2>'
                +   '<div class="product-price-wrapper">'
                +     '<span class="product-price" data-i18n-price="' + salePrice + '">' + formatPrice(salePrice) + '</span>'
                +     '<span class="product-price-old">' + formatPrice(parseFloat(originalPrice)) + '</span>'
                +   '</div>'
                +   (soldOut
                        ? '<button class="btn add-to-cart-btn" disabled aria-disabled="true" data-i18n="sold_out_btn">' + t('sold_out_btn') + '</button>'
                        : '<button class="btn btn-primary add-to-cart-btn js-add-to-cart" data-i18n="btn_add_to_cart">' + t('btn_add_to_cart') + '</button>')
                + '</div>'
                + '</a>';
        }).join('');

        var wrapper = document.querySelector('.product-grid') || document.querySelector('[data-component="product-grid"]');
        if (wrapper) {
            wrapper.innerHTML = cardsHTML;
        }
    }

    /* Initial render — replace placeholder with real grid */
    gridContainer.outerHTML = '<div class="product-grid"></div>';
    renderGrid();

    /* Expose update for i18n re-render */
    window.EcoProductCards = { update: renderGrid };
})();
