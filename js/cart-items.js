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

    function formatPrice(num) {
        return '$' + num.toFixed(2);
    }

    function renderCart() {
        const cart = window.EcoCart.getCart();

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="cart-empty">
                    <p>Tu carrito está vacío.</p>
                    <a href="index.html" class="btn btn-primary">Ver productos</a>
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
                        <button class="qty-btn minus" aria-label="Disminuir cantidad">-</button>
                        <input type="number" class="qty-input" value="${item.quantity}" min="1" aria-label="Cantidad">
                        <button class="qty-btn plus" aria-label="Aumentar cantidad">+</button>
                    </div>
                </div>
                <button class="btn btn-danger">Eliminar</button>
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
                    <span>Subtotal</span>
                    <span>${formatPrice(subtotal)}</span>
                </div>
                <div class="summary-row">
                    <span>Envío</span>
                    <span>Gratis</span>
                </div>
                <div class="summary-row">
                    <span>Impuestos estimados</span>
                    <span>${formatPrice(tax)}</span>
                </div>
                <div class="summary-total">
                    <span>Total</span>
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

    renderCart();
})();
