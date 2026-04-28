/* ========================================
   Cart Page Renderer
   Reads localStorage and renders cart items,
   handles quantity changes, removal & totals.
   Prices are recalculated from the live catalog
   (window.ECOZOX_CATALOG) whenever available.
   ======================================== */

(function () {
    function getDiscountPercent() {
        if (window.ECOZOX_CONFIG && window.ECOZOX_CONFIG.discountPercent != null)
            return window.ECOZOX_CONFIG.discountPercent;
        try {
            var stored = localStorage.getItem('ecozox_desc');
            if (stored !== null) return parseFloat(stored);
        } catch (e) {}
        return null;
    }

    function getGiftValue() {
        if (window.ECOZOX_CONFIG && window.ECOZOX_CONFIG.giftValue != null)
            return window.ECOZOX_CONFIG.giftValue;
        return 27.17;
    }

    function getLiveProduct(itemId) {
        if (!window.ECOZOX_CATALOG) return null;
        return window.ECOZOX_CATALOG.find(function (p) { return p.localId === itemId; }) || null;
    }

    function getLivePrice(item) {
        var live = getLiveProduct(item.id);
        if (live && live.precioVentaCents != null) return live.precioVentaCents / 100;
        return parseFloat(item.price);
    }

    function getLiveOrigPrice(item) {
        var live = getLiveProduct(item.id);
        if (live && live.precioOriginalCents != null) return live.precioOriginalCents / 100;
        if (item.origPrice != null && !isNaN(parseFloat(item.origPrice))) return parseFloat(item.origPrice);
        return null;
    }

    function getLiveBundleExtraDisc(item) {
        var live = getLiveProduct(item.id);
        if (live && live.descuento != null) return live.descuento;
        if (item.bundleExtraDisc != null) return item.bundleExtraDisc;
        if (window.ECOZOX_CONFIG && window.ECOZOX_CONFIG.bundleExtraDiscount != null)
            return window.ECOZOX_CONFIG.bundleExtraDiscount;
        return 0;
    }

    function getCartSubtotalLive() {
        var cart = window.EcoCart.getCart();
        return cart.reduce(function (sum, item) {
            return sum + getLivePrice(item) * item.quantity;
        }, 0);
    }

    function getCartOrigSubtotalLive() {
        var cart = window.EcoCart.getCart();
        return cart.reduce(function (sum, item) {
            var orig = getLiveOrigPrice(item);
            if (orig != null) return sum + orig * item.quantity;
            return sum + getLivePrice(item) * item.quantity;
        }, 0);
    }

    const cartItemsContainer = document.querySelector('.cart-items');
    const cartSummary = document.querySelector('.cart-summary');

    // Only run on the cart page
    if (!cartItemsContainer || !cartSummary) return;

    /* ---------- i18n helpers ---------- */
    function ti(key) {
        return window.EcoI18n ? window.EcoI18n.t(key) : key;
    }

    /* Traduce una clave sólo si está disponible; si no, usa el texto guardado */
    function tt(key, fallback) {
        if (!key) return fallback;
        var v = ti(key);
        return v !== key ? v : fallback;
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
        const disc = getDiscountPercent() ?? 0;
        const salePrice = getLivePrice(item);
        const origPrice = getLiveOrigPrice(item);
        const displayOrig = origPrice != null ? origPrice : salePrice;
        const priceHtml = (!isNaN(salePrice) && salePrice > 0)
            ? `<del class="price-original">${formatPrice(displayOrig)}</del><span class="price-discounted">${formatPrice(salePrice)}</span>`
            : `<span class="price-discounted price-discounted--unavailable">N/A(0)</span>`;
        return `
            <div class="cart-item" data-product-id="${item.id}">
                <div class="cart-item-header">
                    <h3 class="cart-item-title">
                        <a href="${item.link || 'index.html'}" class="cart-body-link">${tt(item.titleKey, item.title)}</a>
                    </h3>
                    <div class="cart-item-price">
                        ${priceHtml}
                    </div>
                </div>
                <ul class="cart-item-body">
                    <li class="cart-body-item">
                        <img src="${item.image}" alt="${tt(item.titleKey, item.title)}"
                             class="cart-body-img cart-body-img--single">
                        <span class="cart-body-title">${tt(item.titleKey, item.title)}</span>
                    </li>
                </ul>
                <div class="cart-bundle-tag">
                    <span class="cart-bundle-tag__piece"><span class="cart-bundle-tag__num">${disc}%</span> ${ti('cart_global_discount_label')}</span>
                </div>
                <div class="cart-item-footer">
                    <div class="cart-item-actions">${qtyControls(item)}</div>
                    ${trashBtn()}
                </div>
            </div>`;
    }

    /* --- Bundle item template (nested breakdown) --- */
    function renderBundleItem(item) {
        const disc = getDiscountPercent() ?? 0;
        const salePrice = getLivePrice(item);
        const origPrice = getLiveOrigPrice(item);
        const displayOrig = origPrice != null ? origPrice : salePrice;
        const subs = (Array.isArray(item.subItems) && item.subItems.length)
            ? item.subItems.map(sub => ({ img: sub.img, label: sub.title || '', key: sub.key || '' }))
            : BUNDLE_SUB_ITEMS.map(sub => ({ img: sub.img, label: ti(sub.titleKey), key: sub.titleKey || '' }));
        const subRows = subs.map(sub => {
            const label = tt(sub.key, sub.label);
            return `
            <li class="cart-body-item">
                <img src="${sub.img}" alt="${label}" class="cart-body-img">
                <span class="cart-body-title">${label}</span>
            </li>`;
        }).join('');

        const bundlePct = getLiveBundleExtraDisc(item);
        const globalPct = disc;
        const totalPct  = bundlePct + globalPct;

        return `
            <div class="cart-item" data-product-id="${item.id}">
                <div class="cart-item-header">
                    <h3 class="cart-item-title">
                        <a href="${item.link || 'index.html'}" class="cart-body-link">${tt(item.titleKey, item.title)}</a>
                    </h3>
                    <div class="cart-item-price">
                        ${(!isNaN(salePrice) && salePrice > 0)
                            ? `<del class="price-original">${formatPrice(displayOrig)}</del><span class="price-discounted">${formatPrice(salePrice)}</span>`
                            : `<span class="price-discounted price-discounted--unavailable">N/A(0)</span>`}
                    </div>
                </div>
                <ul class="cart-item-body" aria-label="${ti('cart_bundle_contents')}">
                    ${subRows}
                </ul>
                <div class="cart-bundle-tag">
                    <span class="cart-bundle-tag__piece"><span class="cart-bundle-tag__num">${bundlePct}%</span> ${ti('cart_bundle_label_kit')}</span>
                    <span class="cart-bundle-tag__op">+</span>
                    <span class="cart-bundle-tag__piece"><span class="cart-bundle-tag__num">${globalPct}%</span> ${ti('cart_bundle_label_global')}</span>
                    <span class="cart-bundle-tag__op">=</span>
                    <span class="cart-bundle-tag__piece cart-bundle-tag__piece--total"><span class="cart-bundle-tag__num">${totalPct}%</span> ${ti('cart_bundle_label_discount')}</span>
                </div>
                <div class="cart-item-footer">
                    <div class="cart-item-actions">${qtyControls(item)}</div>
                    ${trashBtn()}
                </div>
            </div>`;
    }

    /* --- Gift item template (no footer: no qty controls, no delete) --- */
    function renderGiftItem() {
        const giftValue = getGiftValue();
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
                            <span>${ti('cart_gift_desc_value').replace('{amount}', formatPrice(giftValue))}</span>
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
                    <a href="index.html" class="btn btn-primary cart-empty__btn">
                        <span class="cart-empty__label" data-i18n="cart_empty">${ti('cart_empty')}</span>
                        <span class="cart-empty__cta" data-i18n="cart_view_products">${ti('cart_view_products')}</span>
                    </a>
                </div>`;
            renderSummary(0);
            return;
        }

        const itemsHtml = cart.map(item =>
            (Array.isArray(item.subItems) && item.subItems.length) ? renderBundleItem(item) : renderNormalItem(item)
        ).join('');

        const html = cart.length >= 1
            ? renderGiftItem() + itemsHtml
            : itemsHtml;

        cartItemsContainer.innerHTML = html;

        renderSummary(getCartSubtotalLive(), cart.length >= 1);
    }

    function renderSummary(subtotal, hasGift = false) {
        const discount = getDiscountPercent() ?? 0;
        const origSubtotal = getCartOrigSubtotalLive();
        const savings = origSubtotal - subtotal;
        const total = subtotal;

        const savingsRow = subtotal > 0 ? `
                <div class="cs__row">
                    <span>• ${ti('cart_discount')} <span class="cs__row--green">(${discount}%)</span></span>
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
                        <span>${subtotal > 0 ? `<del class="price-original">${formatPrice(origSubtotal)}</del>` : formatPrice(0)}</span>
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

    /* ---------- Event delegation — un único listener en el contenedor ---------- */
    var _removeInProgress = new Set(); // evita doble-clic en eliminar

    function bindEvents() {
        cartItemsContainer.addEventListener('click', handleCartClick);
        cartItemsContainer.addEventListener('change', handleCartChange);
    }

    function handleCartClick(e) {
        // Eliminar item
        const removeBtn = e.target.closest('.btn-danger');
        if (removeBtn) {
            const cartItem = removeBtn.closest('.cart-item');
            if (!cartItem) return;
            const productId = cartItem.dataset.productId;
            if (_removeInProgress.has(productId)) return; // evita doble-clic
            _removeInProgress.add(productId);
            cartItem.style.opacity = '0';
            setTimeout(() => {
                _removeInProgress.delete(productId);
                window.EcoCart.removeItem(productId);
                renderCart();
            }, 300);
            return;
        }

        // Botón minus
        const minusBtn = e.target.closest('.qty-btn.minus');
        if (minusBtn) {
            const cartItem = minusBtn.closest('.cart-item');
            if (!cartItem || cartItem.classList.contains('cart-item--gift')) return;
            const input = cartItem.querySelector('.qty-input');
            const productId = cartItem.dataset.productId;
            let val = parseInt(input.value) || 1;
            if (val > 1) {
                val -= 1;
                input.value = val;
                window.EcoCart.updateQuantity(productId, val);
                renderSummary(getCartSubtotalLive(), window.EcoCart.getCart().length >= 1);
            }
            return;
        }

        // Botón plus
        const plusBtn = e.target.closest('.qty-btn.plus');
        if (plusBtn) {
            const cartItem = plusBtn.closest('.cart-item');
            if (!cartItem || cartItem.classList.contains('cart-item--gift')) return;
            const input = cartItem.querySelector('.qty-input');
            const productId = cartItem.dataset.productId;
            let val = (parseInt(input.value) || 1) + 1;
            input.value = val;
            window.EcoCart.updateQuantity(productId, val);
            renderSummary(getCartSubtotalLive(), window.EcoCart.getCart().length >= 1);
        }
    }

    function handleCartChange(e) {
        const input = e.target.closest('.qty-input');
        if (!input) return;
        const cartItem = input.closest('.cart-item');
        if (!cartItem || cartItem.classList.contains('cart-item--gift')) return;
        const productId = cartItem.dataset.productId;
        let val = parseInt(input.value);
        if (isNaN(val) || val < 1) val = 1;
        input.value = val;
        window.EcoCart.updateQuantity(productId, val);
        renderSummary(getCartSubtotalLive(), window.EcoCart.getCart().length >= 1);
    }

    // Expose renderCart so i18n can re-render on language change
    window.EcoCartRenderer = { renderCart: renderCart };

    // Registrar delegación una única vez
    bindEvents();
    renderCart();
})();
