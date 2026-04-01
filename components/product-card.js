/* ========================================
   Product Card Component
   Renders product cards from data into a grid
   Usage: <div data-component="product-grid"></div>
   ======================================== */

(function () {
    const el = document.querySelector('[data-component="product-grid"]');
    if (!el) return;

    const products = [
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
            id: 'zapatillas-urban-walk',
            titleKey: 'product_zapatillas',
            title: 'Zapatillas Urban Walk',
            price: 89.99,
            image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600&h=600',
            imageThumb: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=200&h=200',
            alt: 'Zapatillas Deportivas',
            link: 'producto.html'
        },
        {
            id: 'camara-retro-lens',
            titleKey: 'product_camara',
            title: 'Cámara Retro Lens',
            price: 350.00,
            image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&q=80&w=600&h=600',
            imageThumb: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&q=80&w=200&h=200',
            alt: 'Cámara Vintage',
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

    const DISCOUNT = 0.30;

    const cardsHTML = products.map(product => {
        const salePrice     = product.price;
        const originalPrice = (salePrice / (1 - DISCOUNT)).toFixed(2);
        return `
        <a href="${product.link}" class="product-card"
           data-product-id="${product.id}"
           data-product-title="${product.title}"
           data-product-price="${salePrice}"
           data-product-image="${product.imageThumb}"
           data-product-link="${product.link}">
            <div class="product-img-wrapper">
                <img src="${product.image}" alt="${product.alt}" class="product-image" loading="lazy">
                <span class="discount-badge" aria-label="Descuento del 30%">-30%</span>
            </div>
            <div class="product-info">
                <h2 class="product-title" data-i18n="${product.titleKey}">${product.title}</h2>
                <div class="product-price-wrapper">
                    <span class="product-price" data-i18n-price="${salePrice}">$${salePrice.toFixed(2)}</span>
                    <span class="product-price-old">$${originalPrice}</span>
                </div>
                <button class="btn btn-primary add-to-cart-btn js-add-to-cart" data-i18n="btn_add_to_cart">Añadir al carrito</button>
            </div>
        </a>`;
    }).join('');

    el.outerHTML = `
    <div class="product-grid">
        ${cardsHTML}
    </div>`;
})();
