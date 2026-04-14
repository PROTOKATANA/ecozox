/* ========================================
   Checkout — Stripe Redirect
   Llama al backend para crear una sesión
   de Stripe Checkout y redirige al usuario.
   ======================================== */

(function () {
    'use strict';

    function getApiUrl() {
        return window.ECOZOX_API_URL || 'http://localhost:3000';
    }

    async function goToStripe(btn) {
        var items = [];

        // Compra directa desde el botón del producto (data-product-*)
        var productId    = btn && btn.dataset.productId;
        var productTitle = btn && btn.dataset.productTitle;
        var productPrice = btn && parseFloat(btn.dataset.productPrice);
        var productImage = btn && btn.dataset.productImage;

        if (productId && productTitle && productPrice) {
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
