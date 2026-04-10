/* ========================================
   Cart Logic
   Persistent cart using localStorage
   Exposes window.EcoCart API
   ======================================== */

(function () {
    const STORAGE_KEY = 'ecozox_cart';

    /* ---------- Clave dinámica por nicho ---------- */
    function getStorageKey() {
        var segment = window.location.pathname.split('/').filter(Boolean)[0];
        return segment ? STORAGE_KEY + '_' + segment : STORAGE_KEY;
    }

    /* ---------- Helpers ---------- */
    function getCart() {
        try {
            return JSON.parse(localStorage.getItem(getStorageKey())) || [];
        } catch (e) {
            return [];
        }
    }

    function saveCart(cart) {
        localStorage.setItem(getStorageKey(), JSON.stringify(cart));
    }

    function getCount() {
        return getCart().reduce((sum, item) => sum + item.quantity, 0);
    }

    function getSubtotal() {
        return getCart().reduce((sum, item) => sum + item.price * item.quantity, 0);
    }

    /* ---------- DOM updates ---------- */
    function syncCounterUI() {
        const count = getCount();
        document.querySelectorAll('.cart-count').forEach(el => {
            el.textContent = count;
        });
    }

    /* ---------- Cart operations ---------- */
    function addItem(product, quantity) {
        const cart = getCart();
        const existing = cart.find(item => item.id === product.id);

        if (existing) {
            existing.quantity += quantity;
        } else {
            cart.push({
                id: product.id,
                title: product.title,
                price: product.price,
                image: product.image,
                link: product.link || null,
                quantity: quantity
            });
        }

        saveCart(cart);
        syncCounterUI();
    }

    function removeItem(productId) {
        const cart = getCart().filter(item => item.id !== productId);
        saveCart(cart);
        syncCounterUI();
    }

    function updateQuantity(productId, newQty) {
        const cart = getCart();
        const item = cart.find(i => i.id === productId);
        if (item) {
            item.quantity = Math.max(1, newQty);
            saveCart(cart);
            syncCounterUI();
        }
    }

    function clearCart() {
        localStorage.removeItem(getStorageKey());
        syncCounterUI();
    }

    /* ---------- i18n helper ---------- */
    function ti(key) {
        return window.EcoI18n ? window.EcoI18n.t(key) : key;
    }

    /* ---------- Event Delegation ---------- */
    document.addEventListener('click', function (event) {
        const btn = event.target.closest('.js-add-to-cart');
        if (!btn) return;

        event.preventDefault();
        event.stopPropagation();

        const card = btn.closest('[data-product-id]') || btn;
        let productId = card.dataset.productId || btn.dataset.productId;
        let productTitle = card.dataset.productTitle || btn.dataset.productTitle;
        let productPrice = parseFloat(card.dataset.productPrice || btn.dataset.productPrice);
        let productImage = card.dataset.productImage || btn.dataset.productImage;
        let productLink = card.dataset.productLink || btn.dataset.productLink || null;

        // Fallback: read product info from the DOM (producto.html)
        if (!productId || !productTitle || isNaN(productPrice)) {
            const detailSection = document.querySelector('.product-info-detail');
            if (detailSection) {
                productTitle = productTitle || (detailSection.querySelector('h1') || {}).textContent;
                const priceText = (detailSection.querySelector('.price') || {}).textContent || '';
                productPrice = isNaN(productPrice) ? parseFloat(priceText.replace(/[^0-9.]/g, '')) : productPrice;
                productId = productId || (productTitle || '').toLowerCase().replace(/\s+/g, '-');
                const mainImg = document.querySelector('.gallery-main');
                productImage = productImage || (mainImg ? mainImg.src : '');
                productLink = productLink || window.location.pathname.split('/').pop();
            }
        }

        if (!productId || !productTitle || isNaN(productPrice)) return;

        // Get quantity from .qty-input (product detail page) or default to 1
        let quantity = 1;
        const qtyInput = document.querySelector('.product-info-detail .qty-input');
        if (qtyInput) {
            quantity = parseInt(qtyInput.value) || 1;
        }

        addItem(
            { id: productId, title: productTitle, price: productPrice, image: productImage, link: productLink },
            quantity
        );

        // Visual feedback on button (cambia el texto a "¡Añadido!")
        const originalHTML = btn.innerHTML;
        btn.innerHTML = ti('btn_added');

        // Si tiene la clase js-buy-now, redirigir al carrito
        if (btn.classList.contains('js-buy-now')) {
            setTimeout(() => window.location.href = 'carrito.html', 500);
        } else {
            setTimeout(() => { btn.innerHTML = originalHTML; }, 1000);
        }
    });

    /* ---------- Public API ---------- */
    window.EcoCart = {
        getCart: getCart,
        saveCart: saveCart,
        getCount: getCount,
        getSubtotal: getSubtotal,
        addItem: addItem,
        removeItem: removeItem,
        updateQuantity: updateQuantity,
        clearCart: clearCart,
        syncCounterUI: syncCounterUI
    };

    /* ---------- Init: sync header counter on page load ---------- */
    syncCounterUI();
})();
