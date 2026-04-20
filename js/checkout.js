/* ========================================
   Checkout — Stripe Redirect
   Llama al backend para crear una sesión
   de Stripe Checkout y redirige al usuario.
   ======================================== */

(function () {
    'use strict';

    function getApiUrl() {
        var url = window.ECOZOX_API_URL || '';
        // En producción asegurarse de que la URL use HTTPS (excepto localhost)
        if (url && url.indexOf('http://') === 0 && !url.match(/localhost|127\.0\.0\.1/)) {
            url = 'https://' + url.slice(7);
        }
        return url;
    }

    var ALLOWED_REDIRECT_HOSTS = ['checkout.stripe.com', 'hooks.stripe.com'];
    function isSafeStripeUrl(url) {
        try {
            var parsed = new URL(url);
            return parsed.protocol === 'https:' &&
                ALLOWED_REDIRECT_HOSTS.some(function (h) { return parsed.hostname === h; });
        } catch (e) {
            return false;
        }
    }

    function showPriceError(btn) {
        var msg = 'Los precios no están disponibles. Por favor, recarga la página e inténtalo de nuevo.';
        if (window.EcoToast) { window.EcoToast(msg); return; }
        var existing = document.getElementById('eco-price-error');
        if (existing) return;
        var err = document.createElement('p');
        err.id = 'eco-price-error';
        err.style.cssText = 'color:#c0392b;font-size:0.85rem;margin:0.5rem 0 0;text-align:center;font-weight:600;';
        err.textContent = msg;
        if (btn && btn.parentNode) btn.parentNode.insertAdjacentElement('afterend', err);
        else document.body.appendChild(err);
        setTimeout(function () { var el = document.getElementById('eco-price-error'); if (el) el.remove(); }, 6000);
    }

    function hasPriceZero(items) {
        return items.some(function (it) { return !it.price || it.price <= 0 || isNaN(it.price); });
    }

    async function goToStripe(btn) {
        var items = [];

        // Compra directa desde el botón del producto (data-product-*)
        var productId    = btn && btn.dataset.productId;
        var productTitle = btn && btn.dataset.productTitle;
        var productPrice = btn && parseFloat(btn.dataset.productPrice) / 100;
        var productImage = btn && btn.dataset.productImage;

        if (productId && productTitle && productPrice > 0) {
            var qty = 1;
            var qtyInput = document.querySelector('.product-info-detail .qty-input');
            if (qtyInput) qty = parseInt(qtyInput.value) || 1;

            items = [{
                localId:  productId,
                name:     productTitle,
                price:    productPrice,
                image:    productImage || '',
                quantity: qty
            }];
        } else if (productId) {
            // productId existe pero precio es 0 → servidor no respondió
            showPriceError(btn);
            return;
        } else {
            // Compra desde el carrito
            var cartItems = (window.EcoCart && window.EcoCart.getCart)
                ? window.EcoCart.getCart()
                : [];

            items = cartItems.map(function (item) {
                return {
                    localId:  item.id    || '',
                    name:     item.title || item.name,
                    price:    item.price || 0,
                    image:    item.image || '',
                    quantity: item.quantity || 1
                };
            });
        }

        if (items.length === 0) {
            if (window.EcoToast) window.EcoToast('Carrito vacío');
            return;
        }

        if (hasPriceZero(items)) {
            showPriceError(btn);
            return;
        }

        var nicho = (window.ECOZOX_BRAND && window.ECOZOX_BRAND.nicho) || 'default';

        try {
            var response = await fetch(getApiUrl() + '/api/checkout/create-session', {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify({
                    items:     items,
                    originUrl: window.location.href,
                    nicho:     nicho
                })
            });

            var data = await response.json();

            if (!response.ok || !data.url) {
                throw new Error(data.error || 'Error al crear la sesión de pago');
            }

            if (!isSafeStripeUrl(data.url)) {
                throw new Error('URL de pago no válida');
            }

            window.location.href = data.url;

        } catch (err) {
            console.error('Checkout error:', err);
            if (window.EcoToast) window.EcoToast(err.message || 'Error');
        }
    }

    document.addEventListener('click', function (e) {
        var btn = e.target.closest && e.target.closest('.checkout-btn');
        if (btn) {
            e.preventDefault();
            goToStripe(btn);
        }
    });

})();
