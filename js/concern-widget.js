/* ========================================
   Concern Widget — compra directa desde cada
   tarjeta de historia (concern-card), que ahora
   ES el bundle (fusiona la antigua ficha de
   #purchaseOptions con la narrativa de dolor).

   Cada botón .js-add-to-cart / .checkout-btn con
   data-bundle-ref lee en el momento del clic los
   datos frescos de su bundle (data-bundle-id, ya
   actualizado por precio-loader.js) y la cantidad
   de su propio selector dentro de la misma tarjeta.
   ======================================== */
(function () {
    'use strict';

    function readBundleData(bundleCard) {
        /* El nombre real del producto (para carrito/checkout/pedido) vive en
           data-bundle-title(-key) del article, NO en el <h3> visible — ese
           <h3> puede mostrar la etiqueta de la preocupación (ej. "Manchas y
           tono irregular") en vez del nombre del producto, y no deben
           mezclarse. Si una tarjeta no define data-bundle-title, se cae al
           texto del <h3> como antes (compatibilidad con tarjetas sin este
           atributo todavía). */
        var titleEl = bundleCard.querySelector('.po-bundle__title');
        var subItems = Array.prototype.map.call(bundleCard.querySelectorAll('.po-bundle__item'), function (li) {
            var img = li.querySelector('img');
            var span = li.querySelector('.po-bundle__item-name');
            return {
                img: img ? img.src : '',
                title: span ? span.textContent.trim() : '',
                key: span ? (span.dataset.i18n || '') : '',
            };
        });

        return {
            id: bundleCard.dataset.bundleId,
            title: bundleCard.dataset.bundleTitle || (titleEl ? titleEl.textContent.trim() : ''),
            titleKey: bundleCard.dataset.bundleTitleKey || (titleEl ? (titleEl.dataset.i18n || '') : ''),
            price: bundleCard.dataset.bundlePrice || '0',
            origPrice: bundleCard.dataset.bundleOriginalPrice
                ? parseFloat(bundleCard.dataset.bundleOriginalPrice) / 100
                : null,
            image: bundleCard.dataset.bundleImage || '',
            subItems: subItems,
        };
    }

    function populateButton(btn, bundleCard, qty) {
        var data = readBundleData(bundleCard);

        btn.dataset.productId = data.id;
        btn.dataset.productTitle = data.title;
        btn.dataset.productTitleKey = data.titleKey;
        btn.dataset.productPrice = data.price;
        btn.dataset.productImage = data.image;
        btn.dataset.productBundleQty = qty;

        if (data.origPrice != null) {
            btn.dataset.productOrigPrice = String(data.origPrice);
        } else {
            delete btn.dataset.productOrigPrice;
        }
        if (data.subItems.length) {
            btn.dataset.productSubItems = JSON.stringify(data.subItems);
        } else {
            delete btn.dataset.productSubItems;
        }
    }

    document.querySelectorAll('[data-bundle-ref]').forEach(function (btn) {
        var bundleId = btn.dataset.bundleRef;
        var bundleCard = document.querySelector('[data-bundle-id="' + bundleId + '"]');
        if (!bundleCard) return;

        var card = btn.closest('.concern-card');
        var qtyInput = card ? card.querySelector('.concern-card__qty .qty-input') : null;

        btn.addEventListener('click', function () {
            var qty = qtyInput ? (parseInt(qtyInput.value) || 1) : 1;
            populateButton(btn, bundleCard, qty);
        });
    });
})();
