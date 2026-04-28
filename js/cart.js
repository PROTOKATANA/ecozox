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
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
        } catch (e) {
            console.warn('[EcoCart] No se pudo guardar el carrito:', e);
        }
    }

    function saveNichoLocalesPath() {
        var brand = window.ECOZOX_BRAND;
        if (!brand) return;
        try {
            if (brand.localesPath) {
                var a = document.createElement('a');
                a.href = brand.localesPath;
                localStorage.setItem('ecozox_nicho_locales', a.href);
            }
            if (brand.nicho) {
                localStorage.setItem('ecozox_nicho', brand.nicho);
            }
        } catch (e) {}
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
                titleKey: product.titleKey || null,
                name: product.name || null,
                price: product.price,
                origPrice: product.origPrice || null,
                bundleExtraDisc: (product.bundleExtraDisc != null ? product.bundleExtraDisc : null),
                image: product.image,
                link: product.link || null,
                subItems: product.subItems || null,
                quantity: quantity
            });
        }

        saveCart(cart);
        saveNichoLocalesPath();
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
        try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
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
        let productTitleKey = card.dataset.productTitleKey || btn.dataset.productTitleKey || null;
        let productName  = card.dataset.productName  || btn.dataset.productName  || null;
        let productPrice = parseFloat(card.dataset.productPrice || btn.dataset.productPrice) / 100;
        const origPriceRaw = card.dataset.productOrigPrice || btn.dataset.productOrigPrice;
        let productOrigPrice = origPriceRaw ? parseFloat(origPriceRaw) : null;
        if (isNaN(productOrigPrice)) productOrigPrice = null;
        const extraDiscRaw = card.dataset.productBundleExtraDisc || btn.dataset.productBundleExtraDisc;
        let productBundleExtraDisc = extraDiscRaw ? parseInt(extraDiscRaw) : null;
        if (isNaN(productBundleExtraDisc)) productBundleExtraDisc = null;
        let productImage = card.dataset.productImage || btn.dataset.productImage;
        let productLink = card.dataset.productLink || btn.dataset.productLink || null;
        let productSubItems = null;
        const subItemsRaw = card.dataset.productSubItems || btn.dataset.productSubItems;
        if (subItemsRaw) {
            try { productSubItems = JSON.parse(subItemsRaw); } catch (e) {}
        }

        // Fallback: read product info from the DOM (producto.html)
        if (!productId || !productTitle || isNaN(productPrice)) {
            const detailSection = document.querySelector('.product-info-detail');
            if (detailSection) {
                productTitle = productTitle || (detailSection.querySelector('h1') || {}).textContent;
                const priceText = (detailSection.querySelector('.price') || {}).textContent || '';
                productPrice = isNaN(productPrice)
                    ? parseFloat(priceText.replace(/,/g, '.').replace(/[^0-9.]/g, ''))
                    : productPrice;
                productId = productId || (productTitle || '').toLowerCase().replace(/\s+/g, '-');
                const mainImg = document.querySelector('.gallery-main');
                productImage = productImage || (mainImg ? mainImg.src : '');
                productLink = productLink || window.location.pathname.split('/').pop();
            }
        }

        if (!productId || !productTitle || isNaN(productPrice) || productPrice <= 0) {
            if (window.EcoToast) window.EcoToast('Los precios no están disponibles. Por favor, recarga la página.');
            return;
        }

        // Normalise image and link to absolute URLs so they work from any page
        function toAbsUrl(src) {
            if (!src) return src;
            var a = document.createElement('a');
            a.href = src;
            return a.href;
        }
        productImage = toAbsUrl(productImage);
        productLink  = productLink ? toAbsUrl(productLink) : window.location.href;

        // Get quantity: check for bundle qty first, fallback to product detail input
        let quantity = 1;
        const bundleQty = btn.dataset.productBundleQty;
        if (bundleQty) {
            quantity = parseInt(bundleQty) || 1;
        } else {
            const qtyInput = document.querySelector('.product-info-detail .qty-input');
            if (qtyInput) {
                quantity = parseInt(qtyInput.value) || 1;
            }
        }

        addItem(
            { id: productId, title: productTitle, titleKey: productTitleKey, name: productName, price: productPrice, origPrice: productOrigPrice, bundleExtraDisc: productBundleExtraDisc, image: productImage, link: productLink, subItems: productSubItems },
            quantity
        );

        // Visual feedback on button (cambia el texto a "¡Añadido!")
        const originalHTML = btn.innerHTML;
        btn.innerHTML = ti('btn_added');

        // Si tiene la clase js-buy-now, redirigir al carrito
        if (btn.classList.contains('js-buy-now')) {
            setTimeout(() => {
                window.location.href = (window.ECOZOX_BRAND && window.ECOZOX_BRAND.carritoUrl) || 'carrito.html';
            }, 500);
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
