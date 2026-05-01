/* ========================================
   Cart Page Renderer (Secure DOM Build)
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

    /* ---------- Secure DOM Builders ---------- */
    function el(tag, attrs, children) {
        var node = document.createElement(tag);
        if (attrs) {
            for (var key in attrs) {
                if (!Object.prototype.hasOwnProperty.call(attrs, key)) continue;
                var val = attrs[key];
                if (val == null) continue;
                if (key === 'textContent') {
                    node.textContent = val;
                } else if (key === 'className') {
                    node.className = val;
                } else if (key.startsWith('on') || key === 'innerHTML') {
                    continue; // security: disallow inline events / innerHTML
                } else {
                    node.setAttribute(key, val);
                }
            }
        }
        if (children) {
            children.forEach(function (c) {
                if (c == null) return;
                if (typeof c === 'string') {
                    node.appendChild(document.createTextNode(c));
                } else {
                    node.appendChild(c);
                }
            });
        }
        return node;
    }

    function svgEl(tag, attrs, children) {
        var ns = 'http://www.w3.org/2000/svg';
        var node = document.createElementNS(ns, tag);
        if (attrs) {
            for (var key in attrs) {
                if (!Object.prototype.hasOwnProperty.call(attrs, key)) continue;
                var val = attrs[key];
                if (val == null) continue;
                node.setAttribute(key, val);
            }
        }
        if (children) {
            children.forEach(function (c) {
                if (c == null) return;
                if (typeof c === 'string') {
                    node.appendChild(document.createTextNode(c));
                } else {
                    node.appendChild(c);
                }
            });
        }
        return node;
    }

    function createTrashIcon() {
        return svgEl('svg', {
            width: '20', height: '20', viewBox: '0 0 24 24',
            fill: 'none', stroke: 'currentColor', 'stroke-width': '2',
            'stroke-linecap': 'round', 'stroke-linejoin': 'round'
        }, [
            svgEl('polyline', { points: '3 6 5 6 21 6' }),
            svgEl('path', { d: 'M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2' }),
            svgEl('line', { x1: '10', y1: '11', x2: '10', y2: '17' }),
            svgEl('line', { x1: '14', y1: '11', x2: '14', y2: '17' })
        ]);
    }

    function createGiftIcon(type) {
        var common = { className: 'gift-bullet-icon', viewBox: '0 0 16 16', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.8', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' };
        if (type === 'gift') {
            return svgEl('svg', common, [
                svgEl('path', { d: 'M8 3V2m0 1C8 1.34 6.66 1 6 2s.34 2 2 1zm0 0C8 1.34 9.34 1 10 2s-.34 2-2 1z' }),
                svgEl('rect', { x: '2', y: '3', width: '12', height: '3', rx: '1' }),
                svgEl('path', { d: 'M3 6v7a1 1 0 001 1h8a1 1 0 001-1V6' }),
                svgEl('line', { x1: '8', y1: '6', x2: '8', y2: '14' })
            ]);
        } else if (type === 'doc') {
            return svgEl('svg', common, [
                svgEl('path', { d: 'M9 2H4a1 1 0 00-1 1v10a1 1 0 001 1h8a1 1 0 001-1V6z' }),
                svgEl('polyline', { points: '9 2 9 6 13 6' })
            ]);
        } else if (type === 'clock') {
            return svgEl('svg', common, [
                svgEl('circle', { cx: '8', cy: '8', r: '6' }),
                svgEl('polyline', { points: '8 5 8 8 10 10' })
            ]);
        } else if (type === 'bolt') {
            return svgEl('svg', common, [
                svgEl('polygon', { points: '9 2 3 9 8 9 7 14 13 7 8 7 9 2' })
            ]);
        }
        return svgEl('svg', common);
    }

    function trashBtn() {
        return el('button', {
            className: 'btn btn-danger',
            'aria-label': ti('btn_remove'),
            title: ti('btn_remove'),
            style: 'width:63px;height:45px;padding:0.5rem;display:flex;align-items:center;justify-content:center;border-radius:6px;'
        }, [createTrashIcon()]);
    }

    function qtyControls(item) {
        return el('div', { className: 'quantity-controls' }, [
            el('button', { className: 'qty-btn minus', 'aria-label': ti('aria_decrease') }, ['-']),
            el('input', {
                type: 'number',
                className: 'qty-input',
                value: String(item.quantity),
                min: '1',
                'aria-label': ti('aria_quantity')
            }),
            el('button', { className: 'qty-btn plus', 'aria-label': ti('aria_increase') }, ['+'])
        ]);
    }

    function createPriceNode(salePrice, displayOrig) {
        if (!isNaN(salePrice) && salePrice > 0) {
            return el('span', null, [
                el('del', { className: 'price-original' }, [formatPrice(displayOrig)]),
                el('span', { className: 'price-discounted' }, [formatPrice(salePrice)])
            ]);
        }
        return el('span', { className: 'price-discounted price-discounted--unavailable' }, ['N/A(0)']);
    }

    /* --- Normal item template --- */
    function renderNormalItem(item) {
        var disc = getDiscountPercent() ?? 0;
        var salePrice = getLivePrice(item);
        var origPrice = getLiveOrigPrice(item);
        var displayOrig = origPrice != null ? origPrice : salePrice;
        var titleText = tt(item.titleKey, item.title);

        var header = el('div', { className: 'cart-item-header' }, [
            el('h3', { className: 'cart-item-title' }, [
                el('a', { href: item.link || 'index.html', className: 'cart-body-link' }, [titleText])
            ]),
            el('div', { className: 'cart-item-price' }, [createPriceNode(salePrice, displayOrig)])
        ]);

        var body = el('ul', { className: 'cart-item-body' }, [
            el('li', { className: 'cart-body-item' }, [
                el('img', { src: item.image, alt: titleText, className: 'cart-body-img cart-body-img--single' }),
                el('span', { className: 'cart-body-title' }, [titleText])
            ])
        ]);

        var tag = el('div', { className: 'cart-bundle-tag' }, [
            el('span', { className: 'cart-bundle-tag__piece' }, [
                el('span', { className: 'cart-bundle-tag__num' }, [String(disc) + '%']),
                ' ' + ti('cart_global_discount_label')
            ])
        ]);

        var footer = el('div', { className: 'cart-item-footer' }, [
            el('div', { className: 'cart-item-actions' }, [qtyControls(item)]),
            trashBtn()
        ]);

        return el('div', { className: 'cart-item', 'data-product-id': item.id }, [header, body, tag, footer]);
    }

    /* --- Bundle item template --- */
    function renderBundleItem(item) {
        var disc = getDiscountPercent() ?? 0;
        var salePrice = getLivePrice(item);
        var origPrice = getLiveOrigPrice(item);
        var displayOrig = origPrice != null ? origPrice : salePrice;
        var titleText = tt(item.titleKey, item.title);

        var subs = (Array.isArray(item.subItems) && item.subItems.length)
            ? item.subItems.map(function (sub) { return { img: sub.img, label: sub.title || '', key: sub.key || '' }; })
            : BUNDLE_SUB_ITEMS.map(function (sub) { return { img: sub.img, label: ti(sub.titleKey), key: sub.titleKey || '' }; });

        var subRows = subs.map(function (sub) {
            var label = tt(sub.key, sub.label);
            return el('li', { className: 'cart-body-item' }, [
                el('img', { src: sub.img, alt: label, className: 'cart-body-img' }),
                el('span', { className: 'cart-body-title' }, [label])
            ]);
        });

        var bundlePct = getLiveBundleExtraDisc(item);
        var globalPct = disc;
        var totalPct = bundlePct + globalPct;

        var header = el('div', { className: 'cart-item-header' }, [
            el('h3', { className: 'cart-item-title' }, [
                el('a', { href: item.link || 'index.html', className: 'cart-body-link' }, [titleText])
            ]),
            el('div', { className: 'cart-item-price' }, [createPriceNode(salePrice, displayOrig)])
        ]);

        var body = el('ul', { className: 'cart-item-body', 'aria-label': ti('cart_bundle_contents') }, subRows);

        var tag = el('div', { className: 'cart-bundle-tag' }, [
            el('span', { className: 'cart-bundle-tag__piece' }, [
                el('span', { className: 'cart-bundle-tag__num' }, [String(bundlePct) + '%']),
                ' ' + ti('cart_bundle_label_kit')
            ]),
            el('span', { className: 'cart-bundle-tag__op' }, ['+']),
            el('span', { className: 'cart-bundle-tag__piece' }, [
                el('span', { className: 'cart-bundle-tag__num' }, [String(globalPct) + '%']),
                ' ' + ti('cart_bundle_label_global')
            ]),
            el('span', { className: 'cart-bundle-tag__op' }, ['=']),
            el('span', { className: 'cart-bundle-tag__piece cart-bundle-tag__piece--total' }, [
                el('span', { className: 'cart-bundle-tag__num' }, [String(totalPct) + '%']),
                ' ' + ti('cart_bundle_label_discount')
            ])
        ]);

        var footer = el('div', { className: 'cart-item-footer' }, [
            el('div', { className: 'cart-item-actions' }, [qtyControls(item)]),
            trashBtn()
        ]);

        return el('div', { className: 'cart-item', 'data-product-id': item.id }, [header, body, tag, footer]);
    }

    /* --- Gift item template --- */
    function renderGiftItem() {
        var giftValue = getGiftValue();
        var giftName = ti('cart_gift_item_name');

        var list = el('ul', { className: 'gift-bullet-list' }, [
            el('li', { className: 'gift-bullet-item' }, [
                createGiftIcon('gift'),
                el('span', null, [ti('cart_gift_desc_value').replace('{amount}', formatPrice(giftValue))])
            ]),
            el('li', { className: 'gift-bullet-item' }, [
                createGiftIcon('doc'),
                el('span', null, [ti('cart_gift_desc_content')])
            ]),
            el('li', { className: 'gift-bullet-item' }, [
                createGiftIcon('clock'),
                el('span', null, [ti('cart_gift_desc_condition')])
            ]),
            el('li', { className: 'gift-bullet-item gift-bullet-item--urgent' }, [
                createGiftIcon('bolt'),
                el('span', null, [ti('cart_gift_desc_urgency')])
            ])
        ]);

        var gallery = el('div', { className: 'cart-gift-gallery' }, [
            el('img', { src: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=120&h=120', alt: giftName, className: 'cart-gift-thumb' }),
            el('img', { src: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&q=80&w=120&h=120', alt: giftName, className: 'cart-gift-thumb' }),
            el('img', { src: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?auto=format&fit=crop&q=80&w=120&h=120', alt: giftName, className: 'cart-gift-thumb' })
        ]);

        var header = el('div', { className: 'cart-item-header' }, [
            el('h3', { className: 'cart-item-title' }, [giftName]),
            el('span', { className: 'price-discounted' }, [ti('cart_shipping_free').toUpperCase()])
        ]);

        var body = el('div', { className: 'cart-gift-body' }, [list, gallery]);

        return el('div', { className: 'cart-item cart-item--gift', 'data-product-id': '__gift__' }, [header, body]);
    }

    function renderCart() {
        var cart = window.EcoCart.getCart();

        if (cart.length === 0) {
            var emptyNode = el('div', { className: 'cart-empty' }, [
                el('a', { href: 'index.html', className: 'btn btn-primary cart-empty__btn' }, [
                    el('span', { className: 'cart-empty__label', 'data-i18n': 'cart_empty' }, [ti('cart_empty')]),
                    el('span', { className: 'cart-empty__cta', 'data-i18n': 'cart_view_products' }, [ti('cart_view_products')])
                ])
            ]);
            cartItemsContainer.replaceChildren(emptyNode);
            renderSummary(0);
            return;
        }

        var nodes = [];
        if (cart.length >= 1) {
            nodes.push(renderGiftItem());
        }
        cart.forEach(function (item) {
            nodes.push((Array.isArray(item.subItems) && item.subItems.length) ? renderBundleItem(item) : renderNormalItem(item));
        });

        cartItemsContainer.replaceChildren.apply(cartItemsContainer, nodes);
        renderSummary(getCartSubtotalLive(), cart.length >= 1);
    }

    function renderSummary(subtotal, hasGift) {
        var discount = getDiscountPercent() ?? 0;
        var origSubtotal = getCartOrigSubtotalLive();
        var savings = origSubtotal - subtotal;
        var total = subtotal;

        var rows = [];

        var subtotalRow = el('div', { className: 'cs__row' }, [
            el('span', null, ['• ' + ti('cart_subtotal')]),
            el('span', null, subtotal > 0
                ? [el('del', { className: 'price-original' }, [formatPrice(origSubtotal)])]
                : [formatPrice(0)])
        ]);
        rows.push(subtotalRow);

        if (subtotal > 0) {
            rows.push(el('div', { className: 'cs__row' }, [
                el('span', null, [
                    '• ' + ti('cart_discount') + ' ',
                    el('span', { className: 'cs__row--green' }, ['(' + discount + '%)'])
                ]),
                el('span', { className: 'cs__row--green' }, ['- ' + formatPrice(savings)])
            ]));
        }

        if (hasGift) {
            rows.push(el('div', { className: 'cs__row' }, [
                el('span', null, ['• 1 ' + ti('cart_gift_label')]),
                el('span', { className: 'cs__free cs__row--green' }, [ti('cart_shipping_free').toUpperCase()])
            ]));
        }

        rows.push(el('div', { className: 'cs__row' }, [
            el('span', null, ['• ' + ti('cart_shipping')]),
            el('span', { className: 'cs__free cs__row--green' }, [ti('cart_shipping_free').toUpperCase()])
        ]));

        var rowsContainer = el('div', { className: 'cs__rows' }, rows);
        var totalContainer = el('div', { className: 'cs__total' }, [
            el('span', null, [ti('cart_total')]),
            el('span', null, [formatPrice(total)])
        ]);

        var summaryBody = cartSummary.querySelector('.summary-body');
        if (summaryBody) {
            summaryBody.replaceChildren(rowsContainer, totalContainer);
        }
    }

    /* ---------- Event delegation ---------- */
    var _removeInProgress = new Set();

    function bindEvents() {
        cartItemsContainer.addEventListener('click', handleCartClick);
        cartItemsContainer.addEventListener('change', handleCartChange);
    }

    function handleCartClick(e) {
        var removeBtn = e.target.closest('.btn-danger');
        if (removeBtn) {
            var cartItem = removeBtn.closest('.cart-item');
            if (!cartItem) return;
            var productId = cartItem.dataset.productId;
            if (_removeInProgress.has(productId)) return;
            _removeInProgress.add(productId);
            cartItem.style.opacity = '0';
            setTimeout(function () {
                _removeInProgress.delete(productId);
                window.EcoCart.removeItem(productId);
                renderCart();
            }, 300);
            return;
        }

        var minusBtn = e.target.closest('.qty-btn.minus');
        if (minusBtn) {
            var cartItem = minusBtn.closest('.cart-item');
            if (!cartItem || cartItem.classList.contains('cart-item--gift')) return;
            var input = cartItem.querySelector('.qty-input');
            var productId = cartItem.dataset.productId;
            var val = parseInt(input.value) || 1;
            if (val > 1) {
                val -= 1;
                input.value = val;
                window.EcoCart.updateQuantity(productId, val);
                renderSummary(getCartSubtotalLive(), window.EcoCart.getCart().length >= 1);
            }
            return;
        }

        var plusBtn = e.target.closest('.qty-btn.plus');
        if (plusBtn) {
            var cartItem = plusBtn.closest('.cart-item');
            if (!cartItem || cartItem.classList.contains('cart-item--gift')) return;
            var input = cartItem.querySelector('.qty-input');
            var productId = cartItem.dataset.productId;
            var val = (parseInt(input.value) || 1) + 1;
            input.value = val;
            window.EcoCart.updateQuantity(productId, val);
            renderSummary(getCartSubtotalLive(), window.EcoCart.getCart().length >= 1);
        }
    }

    function handleCartChange(e) {
        var input = e.target.closest('.qty-input');
        if (!input) return;
        var cartItem = input.closest('.cart-item');
        if (!cartItem || cartItem.classList.contains('cart-item--gift')) return;
        var productId = cartItem.dataset.productId;
        var val = parseInt(input.value);
        if (isNaN(val) || val < 1) val = 1;
        input.value = val;
        window.EcoCart.updateQuantity(productId, val);
        renderSummary(getCartSubtotalLive(), window.EcoCart.getCart().length >= 1);
    }

    window.EcoCartRenderer = { renderCart: renderCart };

    bindEvents();
    renderCart();
})();
