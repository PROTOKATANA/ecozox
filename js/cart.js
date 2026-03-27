/* ========================================
   Cart Logic
   Persistent cart using localStorage
   Exposes window.EcoCart API
   ======================================== */

(function () {
    const STORAGE_KEY = 'ecozox_cart';

    /* ---------- Helpers ---------- */

    function getCart() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        } catch (e) {
            return [];
        }
    }

    function saveCart(cart) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
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

    function bounceCartButton() {
        const cartButton = document.querySelector('.cart-button');
        if (cartButton) {
            cartButton.classList.remove('animate-bounce');
            void cartButton.offsetWidth;
            cartButton.classList.add('animate-bounce');
        }
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
        localStorage.removeItem(STORAGE_KEY);
        syncCounterUI();
    }

    /* ---------- Global addToCart (used by onclick) ---------- */

    window.addToCart = function (event) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }

        // Read product data from data-attributes on the button or its parent card
        let btn = null;
        if (event && event.target) {
            btn = event.target.closest('button');
        }
        if (!btn) return;

        const card = btn.closest('[data-product-id]') || btn;
        let productId = card.dataset.productId || btn.dataset.productId;
        let productTitle = card.dataset.productTitle || btn.dataset.productTitle;
        let productPrice = parseFloat(card.dataset.productPrice || btn.dataset.productPrice);
        let productImage = card.dataset.productImage || btn.dataset.productImage;

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
            { id: productId, title: productTitle, price: productPrice, image: productImage },
            quantity
        );

        bounceCartButton();

        // Visual feedback on button
        if (btn) {
            const originalHTML = btn.innerHTML;
            btn.innerHTML = '¡Añadido!';
            setTimeout(() => { btn.innerHTML = originalHTML; }, 1000);
        }
    };

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
