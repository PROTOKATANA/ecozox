/* ========================================
   Cart Page Renderer
   Reads localStorage and renders cart items,
   handles quantity changes, removal & totals
   ======================================== */

(function () {
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartSummary = document.querySelector('.cart-summary');

    // Only run on the cart page
    if (!cartItemsContainer || !cartSummary) return;

    /* ---------- i18n helpers ---------- */
    function ti(key) {
        return window.EcoI18n ? window.EcoI18n.t(key) : key;
    }

    function formatPrice(num) {
        if (window.EcoI18n) return window.EcoI18n.formatPrice(num);
        return '$' + num.toFixed(2);
    }

    function renderCart() {
        const cart = window.EcoCart.getCart();

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="cart-empty">
                    <p data-i18n="cart_empty">${ti('cart_empty')}</p>
                    <a href="index.html" class="btn btn-primary" data-i18n="cart_view_products">${ti('cart_view_products')}</a>
                </div>`;
            renderSummary(0);
            return;
        }

        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item" data-product-id="${item.id}">
                <img src="${item.image}" alt="${item.title}" class="cart-item-img">
                <div class="cart-item-details">
                    <h3 class="cart-item-title">${item.title}</h3>
                    <div class="cart-item-price">${formatPrice(item.price)}</div>
                </div>
                <div class="cart-item-actions">
                    <div class="quantity-controls">
                        <button class="qty-btn minus" data-i18n-aria="aria_decrease" aria-label="${ti('aria_decrease')}">-</button>
                        <input type="number" class="qty-input" value="${item.quantity}" min="1" data-i18n-aria="aria_quantity" aria-label="${ti('aria_quantity')}">
                        <button class="qty-btn plus" data-i18n-aria="aria_increase" aria-label="${ti('aria_increase')}">+</button>
                    </div>
                </div>
                <button class="btn btn-danger" data-i18n="btn_remove">${ti('btn_remove')}</button>
            </div>
        `).join('');

        bindEvents();
        renderSummary(window.EcoCart.getSubtotal());
    }

    function renderSummary(subtotal) {
        const tax = subtotal * 0.07;
        const total = subtotal + tax;

        const summaryBody = cartSummary.querySelector('.summary-body');
        if (summaryBody) {
            summaryBody.innerHTML = `
                <div class="summary-row">
                    <span data-i18n="cart_subtotal">${ti('cart_subtotal')}</span>
                    <span>${formatPrice(subtotal)}</span>
                </div>
                <div class="summary-row">
                    <span data-i18n="cart_shipping">${ti('cart_shipping')}</span>
                    <span data-i18n="cart_shipping_free">${ti('cart_shipping_free')}</span>
                </div>
                <div class="summary-row">
                    <span data-i18n="cart_tax">${ti('cart_tax')}</span>
                    <span>${formatPrice(tax)}</span>
                </div>
                <div class="summary-total">
                    <span data-i18n="cart_total">${ti('cart_total')}</span>
                    <span>${formatPrice(total)}</span>
                </div>`;
        }
    }

    function bindEvents() {
        // Remove buttons
        cartItemsContainer.querySelectorAll('.btn-danger').forEach(btn => {
            btn.addEventListener('click', function () {
                const cartItem = this.closest('.cart-item');
                const productId = cartItem.dataset.productId;

                cartItem.style.opacity = '0';
                setTimeout(() => {
                    window.EcoCart.removeItem(productId);
                    renderCart();
                }, 300);
            });
        });

        // Quantity controls
        cartItemsContainer.querySelectorAll('.cart-item').forEach(cartItem => {
            const productId = cartItem.dataset.productId;
            const minusBtn = cartItem.querySelector('.minus');
            const plusBtn = cartItem.querySelector('.plus');
            const input = cartItem.querySelector('.qty-input');

            minusBtn.addEventListener('click', () => {
                let val = parseInt(input.value) || 1;
                if (val > 1) {
                    input.value = val - 1;
                    window.EcoCart.updateQuantity(productId, val - 1);
                    renderSummary(window.EcoCart.getSubtotal());
                }
            });

            plusBtn.addEventListener('click', () => {
                let val = parseInt(input.value) || 1;
                input.value = val + 1;
                window.EcoCart.updateQuantity(productId, val + 1);
                renderSummary(window.EcoCart.getSubtotal());
            });

            input.addEventListener('change', () => {
                let val = parseInt(input.value);
                if (isNaN(val) || val < 1) val = 1;
                input.value = val;
                window.EcoCart.updateQuantity(productId, val);
                renderSummary(window.EcoCart.getSubtotal());
            });
        });
    }

    // Expose renderCart so i18n can re-render on language change
    window.EcoCartRenderer = { renderCart: renderCart };

    renderCart();
})();
