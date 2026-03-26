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
            title: 'Reloj Classic Mono',
            price: '$129.00',
            image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600&h=600',
            alt: 'Reloj Minimalista',
            link: 'producto.html'
        },
        {
            title: 'Auriculares Silence Pro',
            price: '$249.00',
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600&h=600',
            alt: 'Auriculares Inalámbricos',
            link: 'producto.html'
        },
        {
            title: 'Zapatillas Urban Walk',
            price: '$89.99',
            image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600&h=600',
            alt: 'Zapatillas Deportivas',
            link: 'producto.html'
        },
        {
            title: 'Cámara Retro Lens',
            price: '$350.00',
            image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&q=80&w=600&h=600',
            alt: 'Cámara Vintage',
            link: 'producto.html'
        },
        {
            title: 'Mochila Canvas Explorer',
            price: '$65.00',
            image: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&q=80&w=600&h=600',
            alt: 'Mochila Canvas',
            link: 'producto.html'
        },
        {
            title: 'Set Tazas Matte',
            price: '$24.00',
            image: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?auto=format&fit=crop&q=80&w=600&h=600',
            alt: 'Taza Cerámica',
            link: 'producto.html'
        }
    ];

    const cardsHTML = products.map(product => `
        <a href="${product.link}" class="product-card">
            <img src="${product.image}" alt="${product.alt}" class="product-image" loading="lazy">
            <div class="product-info">
                <h2 class="product-title">${product.title}</h2>
                <span class="product-price">${product.price}</span>
                <button class="btn btn-primary add-to-cart-btn" onclick="addToCart(event)">Añadir al carrito</button>
            </div>
        </a>
    `).join('');

    el.outerHTML = `
    <div class="product-grid">
        ${cardsHTML}
    </div>`;
})();
