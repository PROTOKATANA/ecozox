/* ========================================
   Cart Page Renderer
   Reads localStorage and renders cart items,
   handles quantity changes, removal & totals
   ======================================== */

(function () {
    const DISCOUNT_PERCENT = 30;   // Mantener sincronizado con urgency-banner.js

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

    /* ---------- Bundle helpers ---------- */

    /* Sub-items that make up the bundle (placeholder data) */
    const BUNDLE_SUB_ITEMS = [
        {
            img:    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=80&h=80',
            titleKey: 'product_auriculares',
        },
        {
            img:    'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=80&h=80',
            titleKey: 'po_bundle_item_stand',
        },
        {
            img:    'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80&w=80&h=80',
            titleKey: 'po_bundle_item_kit',
        },
    ];

    /* Shared trash-icon button (reused in both item types) */
    function trashBtn() {
        return `
            <button class="btn btn-danger" aria-label="${ti('btn_remove')}" title="${ti('btn_remove')}"
                    style="width:63px;height:45px;padding:0.5rem;display:flex;align-items:center;justify-content:center;border-radius:6px;">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                     fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
            </button>`;
    }

    /* Quantity controls (reused in both item types) */
    function qtyControls(item) {
        return `
            <div class="quantity-controls">
                <button class="qty-btn minus" aria-label="${ti('aria_decrease')}">-</button>
                <input type="number" class="qty-input" value="${item.quantity}" min="1" aria-label="${ti('aria_quantity')}">
                <button class="qty-btn plus" aria-label="${ti('aria_increase')}">+</button>
            </div>`;
    }

    /* --- Normal item template --- */
    function renderNormalItem(item) {
        const discountedPrice = item.price * (1 - DISCOUNT_PERCENT / 100);
        return `
            <div class="cart-item" data-product-id="${item.id}">
                <div class="cart-item-header">
                    <h3 class="cart-item-title">
                        <a href="producto.html" class="cart-body-link">${item.title}</a>
                    </h3>
                    <div class="cart-item-price">
                        <del class="price-original">${formatPrice(item.price)}</del>
                        <span class="price-discounted">${formatPrice(discountedPrice)}</span>
                    </div>
                </div>
                <ul class="cart-item-body">
                    <li class="cart-body-item">
                        <img src="${item.image}" alt="${item.title}"
                             class="cart-body-img cart-body-img--single">
                        <span class="cart-body-title">${item.title}</span>
                    </li>
                </ul>
                <div class="cart-item-footer">
                    <div class="cart-item-actions">${qtyControls(item)}</div>
                    ${trashBtn()}
                </div>
            </div>`;
    }

    /* --- Bundle item template (nested breakdown) --- */
    function renderBundleItem(item) {
        const discountedPrice = item.price * (1 - DISCOUNT_PERCENT / 100);
        const subRows = BUNDLE_SUB_ITEMS.map(sub => `
            <li class="cart-body-item">
                <img src="${sub.img}" alt="${ti(sub.titleKey)}" class="cart-body-img">
                <span class="cart-body-title">${ti(sub.titleKey)}</span>
                <span class="cart-body-included">${ti('cart_included')}</span>
            </li>`).join('');

        return `
            <div class="cart-item" data-product-id="${item.id}">
                <div class="cart-item-header">
                    <h3 class="cart-item-title">
                        <a href="producto.html" class="cart-body-link">${item.title}</a>
                    </h3>
                    <div class="cart-item-price">
                        <del class="price-original">${formatPrice(item.price)}</del>
                        <span class="price-discounted">${formatPrice(discountedPrice)}</span>
                    </div>
                </div>
                <ul class="cart-item-body" aria-label="${ti('cart_bundle_contents')}">
                    ${subRows}
                </ul>
                <div class="cart-item-footer">
                    <div class="cart-item-actions">${qtyControls(item)}</div>
                    ${trashBtn()}
                </div>
            </div>`;
    }

    /* --- Gift item template (no footer: no qty controls, no delete) --- */
    function renderGiftItem() {
        return `
            <div class="cart-item cart-item--gift" data-product-id="__gift__">
                <div class="cart-item-header">
                    <h3 class="cart-item-title">${ti('cart_gift_item_name')}</h3>
                    <span class="price-discounted">${ti('cart_shipping_free').toUpperCase()}</span>
                </div>
                <div class="cart-gift-body">
                    <ul class="gift-bullet-list">
                        <li class="gift-bullet-item">
                            <svg class="gift-bullet-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3V2m0 1C8 1.34 6.66 1 6 2s.34 2 2 1zm0 0C8 1.34 9.34 1 10 2s-.34 2-2 1z"/><rect x="2" y="3" width="12" height="3" rx="1"/><path d="M3 6v7a1 1 0 001 1h8a1 1 0 001-1V6"/><line x1="8" y1="6" x2="8" y2="14"/></svg>
                            <span>${ti('cart_gift_desc_value').replace('{amount}', formatPrice(27.17))}</span>
                        </li>
                        <li class="gift-bullet-item">
                            <svg class="gift-bullet-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 2H4a1 1 0 00-1 1v10a1 1 0 001 1h8a1 1 0 001-1V6z"/><polyline points="9 2 9 6 13 6"/></svg>
                            <span>${ti('cart_gift_desc_content')}</span>
                        </li>
                        <li class="gift-bullet-item">
                            <svg class="gift-bullet-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="6"/><polyline points="8 5 8 8 10 10"/></svg>
                            <span>${ti('cart_gift_desc_condition')}</span>
                        </li>
                        <li class="gift-bullet-item gift-bullet-item--urgent">
                            <svg class="gift-bullet-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="9 2 3 9 8 9 7 14 13 7 8 7 9 2"/></svg>
                            <span>${ti('cart_gift_desc_urgency')}</span>
                        </li>
                    </ul>
                    <div class="cart-gift-gallery">
                        <img src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=120&h=120" alt="${ti('cart_gift_item_name')}" class="cart-gift-thumb">
                        <img src="https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&q=80&w=120&h=120" alt="${ti('cart_gift_item_name')}" class="cart-gift-thumb">
                        <img src="https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?auto=format&fit=crop&q=80&w=120&h=120" alt="${ti('cart_gift_item_name')}" class="cart-gift-thumb">
                    </div>
                </div>
            </div>`;
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

        const itemsHtml = cart.map(item =>
            item.id.includes('bundle') ? renderBundleItem(item) : renderNormalItem(item)
        ).join('');

        const html = cart.length >= 1
            ? renderGiftItem() + itemsHtml
            : itemsHtml;

        cartItemsContainer.innerHTML = html;

        bindEvents();
        renderSummary(window.EcoCart.getSubtotal(), cart.length > 1);
    }

    function renderSummary(subtotal, hasGift = false) {
        const discountedSubtotal = subtotal * (1 - DISCOUNT_PERCENT / 100);
        const savings = subtotal - discountedSubtotal;
        const total = discountedSubtotal;

        const savingsRow = subtotal > 0 ? `
                <div class="cs__row">
                    <span>• ${ti('cart_discount')} <span class="cs__row--green">(${DISCOUNT_PERCENT}%)</span></span>
                    <span class="cs__row--green">- ${formatPrice(savings)}</span>
                </div>` : '';

        const giftRow = hasGift ? `
                <div class="cs__row">
                    <span>• 1 ${ti('cart_gift_label')}</span>
                    <span class="cs__free cs__row--green">${ti('cart_shipping_free').toUpperCase()}</span>
                </div>` : '';

        const summaryBody = cartSummary.querySelector('.summary-body');
        if (summaryBody) {
            summaryBody.innerHTML = `
                <div class="cs__rows">
                    <div class="cs__row">
                        <span>• ${ti('cart_subtotal')}</span>
                        <span>${subtotal > 0 ? `<del class="price-original">${formatPrice(subtotal)}</del>` : formatPrice(0)}</span>
                    </div>
                    ${savingsRow}
                    ${giftRow}
                    <div class="cs__row">
                        <span>• ${ti('cart_shipping')}</span>
                        <span class="cs__free cs__row--green">${ti('cart_shipping_free').toUpperCase()}</span>
                    </div>
                </div>
                <div class="cs__total">
                    <span>${ti('cart_total')}</span>
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

        // Quantity controls (skip gift item which has no controls)
        cartItemsContainer.querySelectorAll('.cart-item:not(.cart-item--gift)').forEach(cartItem => {
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
