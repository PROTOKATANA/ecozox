/* ========================================
   EcoAnalytics — GA4 / Firebase Analytics
   Measurement ID: G-B5BWQ99HYP
   ======================================== */

(function () {
    'use strict';

    var GA_ID = 'G-B5BWQ99HYP';

    // ── gtag bootstrap ────────────────────────────────────────────────
    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = window.gtag || gtag;
    gtag('js', new Date());
    gtag('config', GA_ID, { send_page_view: true });

    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);

    // ── Page type ─────────────────────────────────────────────────────
    var cls      = document.body.className;
    var pathname = window.location.pathname;
    var PAGE_TYPE =
        cls.indexOf('page-home')    !== -1 ? 'home'    :
        cls.indexOf('page-product') !== -1 ? 'product' :
        cls.indexOf('page-cart')    !== -1 ? 'cart'    :
        cls.indexOf('page-success') !== -1 ? 'success' :
        cls.indexOf('page-legal')   !== -1 ? 'legal'   :
        pathname.indexOf('contacto') !== -1 ? 'contact' : 'other';

    // ── Initial user properties ───────────────────────────────────────
    function readLang()     { try { return localStorage.getItem('ecozox_lang')     || 'es';  } catch(e) { return 'es';  } }
    function readCurrency() { try { return localStorage.getItem('ecozox_currency') || 'EUR'; } catch(e) { return 'EUR'; } }

    var currentLang     = readLang();
    var currentCurrency = readCurrency();

    gtag('set', 'user_properties', {
        preferred_lang:     currentLang,
        preferred_currency: currentCurrency,
        page_type:          PAGE_TYPE
    });

    // ── Public API ────────────────────────────────────────────────────
    window.EcoAnalytics = {
        track: function (name, params) {
            gtag('event', name, params || {});
        }
    };
    var track = function (name, params) { window.EcoAnalytics.track(name, params); };

    // ── Scroll depth ──────────────────────────────────────────────────
    var scrollFired = {};
    window.addEventListener('scroll', function () {
        var pct = Math.round((window.scrollY + window.innerHeight) / document.body.scrollHeight * 100);
        [25, 50, 75, 90].forEach(function (mark) {
            if (!scrollFired[mark] && pct >= mark) {
                scrollFired[mark] = true;
                track('scroll_depth', { page_type: PAGE_TYPE, depth_pct: mark });
            }
        });
    }, { passive: true });

    // ── EcoI18n hooks ─────────────────────────────────────────────────
    function hookI18n() {
        var i18n = window.EcoI18n;
        if (!i18n || i18n._ecoAnalyticsHooked) return;
        i18n._ecoAnalyticsHooked = true;

        var origSetLang = i18n.setLang;
        if (origSetLang) {
            i18n.setLang = function (l) {
                origSetLang.call(i18n, l);
                currentLang = l;
                track('language_change', { new_lang: l });
                gtag('set', 'user_properties', { preferred_lang: l });
            };
        }
        var origSetCurrency = i18n.setCurrency;
        if (origSetCurrency) {
            i18n.setCurrency = function (c) {
                origSetCurrency.call(i18n, c);
                currentCurrency = c;
                track('currency_change', { new_currency: c });
                gtag('set', 'user_properties', { preferred_currency: c });
            };
        }
    }
    document.addEventListener('DOMContentLoaded', hookI18n);
    setTimeout(hookI18n, 600);

    // ═══════════════════════════════════════════════════════════════════
    // HOME
    // ═══════════════════════════════════════════════════════════════════
    if (PAGE_TYPE === 'home') {

        // Product card click
        document.addEventListener('click', function (e) {
            var card = e.target.closest('.product-card');
            if (!card) return;
            var titleEl = card.querySelector('.product-title__text');
            track('select_content', {
                content_type: 'product_card',
                content_id:   titleEl ? titleEl.textContent.trim() : '',
                item_url:     card.getAttribute('href') || ''
            });
        });

        // Hero impression
        document.addEventListener('DOMContentLoaded', function () {
            var hero = document.querySelector('.hero');
            if (!hero || !window.IntersectionObserver) return;
            var obs = new IntersectionObserver(function (entries) {
                if (entries[0].isIntersecting) {
                    track('hero_impression', {});
                    obs.disconnect();
                }
            }, { threshold: 0.5 });
            obs.observe(hero);
        });
    }

    // ═══════════════════════════════════════════════════════════════════
    // PRODUCT
    // ═══════════════════════════════════════════════════════════════════
    if (PAGE_TYPE === 'product') {

        // view_item — wait for precio-loader to populate prices
        document.addEventListener('DOMContentLoaded', function () {
            setTimeout(function () {
                var btn = document.querySelector('.checkout-btn[data-product-id]');
                if (!btn) return;
                var price = parseFloat(btn.dataset.productPrice || 0) / 100;
                track('view_item', {
                    currency: currentCurrency,
                    value:    price,
                    items: [{
                        item_id:   btn.dataset.productId || '',
                        item_name: btn.dataset.productTitle || '',
                        price:     price,
                        quantity:  1
                    }]
                });
            }, 1000);
        });

        // Gallery thumbnail
        document.addEventListener('click', function (e) {
            var thumb = e.target.closest('.thumbnail');
            if (!thumb) return;
            var thumbs = document.querySelectorAll('.thumbnail');
            track('gallery_thumbnail_click', {
                thumb_type:  thumb.dataset.type || 'image',
                thumb_index: Array.from(thumbs).indexOf(thumb)
            });
        });

        // Before/After slider drag
        document.addEventListener('DOMContentLoaded', function () {
            var divider = document.getElementById('baDivider');
            if (!divider) return;
            var started = false;
            ['mousedown', 'touchstart'].forEach(function (t) {
                divider.addEventListener(t, function () { started = true; }, { passive: true });
            });
            ['mouseup', 'touchend'].forEach(function (t) {
                document.addEventListener(t, function () {
                    if (started) { track('ba_slider_use', {}); started = false; }
                }, { passive: true });
            });
        });

        // Video lightbox
        document.addEventListener('click', function (e) {
            if (e.target.closest('.product-video-card')) track('video_open', {});
            if (e.target.closest('.video-lightbox-close'))  track('video_close', {});
        });

        // Review dialog
        document.addEventListener('click', function (e) {
            if (e.target.closest('#openReviewDialog')) track('review_dialog_open', {});
            if (e.target.closest('#reviewDialogClose')) track('review_dialog_close', {});
        });

        // Star picker
        document.addEventListener('click', function (e) {
            var star = e.target.closest('.star-picker__btn');
            if (star) track('star_select', { rating: parseInt(star.dataset.value || star.value || 0) });
        });

        // Review submit
        document.addEventListener('submit', function (e) {
            if (e.target.id !== 'review-form') return;
            var star = document.querySelector('.star-picker__btn[aria-pressed="true"]');
            track('review_submit', { rating: star ? parseInt(star.dataset.value || star.value || 0) : 0 });
        });

        // Review image lightbox
        document.addEventListener('click', function (e) {
            if (e.target.closest('.review-thumbnail')) track('review_image_open', {});
            if (e.target.closest('#lightboxClose'))    track('lightbox_close', {});
            if (e.target.closest('#lightboxPrev'))     track('lightbox_nav', { direction: 'prev' });
            if (e.target.closest('#lightboxNext'))     track('lightbox_nav', { direction: 'next' });
        });

        // Purchase option (individual / bundle)
        document.addEventListener('click', function (e) {
            var opt = e.target.closest('.purchase-option');
            if (opt) track('select_option', { option_type: opt.dataset.option || '' });
        });

        // Quantity controls
        document.addEventListener('change', function (e) {
            if (e.target.classList.contains('qty-input')) {
                track('quantity_change', { quantity: parseInt(e.target.value) || 1 });
            }
        });
        document.addEventListener('click', function (e) {
            var btn = e.target.closest('[data-action]');
            if (btn && btn.closest('.quantity-controls')) {
                track('quantity_button_click', { action: btn.dataset.action });
            }
        });

        // begin_checkout from product page
        document.addEventListener('click', function (e) {
            var btn = e.target.closest('.checkout-btn[data-product-id]');
            if (!btn) return;
            var price = parseFloat(btn.dataset.productPrice || 0) / 100;
            var qty   = 1;
            var qi    = document.querySelector('.product-info-detail .qty-input');
            if (qi) qty = parseInt(qi.value) || 1;
            track('begin_checkout', {
                currency: currentCurrency,
                value:    price * qty,
                items: [{
                    item_id:   btn.dataset.productId  || '',
                    item_name: btn.dataset.productTitle || '',
                    price:     price,
                    quantity:  qty
                }]
            });
        });

        // Sticky cart bar — becomes visible
        setTimeout(function () {
            var bar = document.getElementById('sticky-cart-bar');
            if (!bar || !window.MutationObserver) return;
            var fired = false;
            var obs = new MutationObserver(function () {
                if (!fired && bar.classList.contains('visible')) {
                    fired = true;
                    track('sticky_cart_visible', {});
                }
            });
            obs.observe(bar, { attributes: true, attributeFilter: ['class'] });
        }, 1500);

        // Sticky cart toggle
        document.addEventListener('click', function (e) {
            if (!e.target.closest('.scb__toggle')) return;
            var bar = document.getElementById('sticky-cart-bar');
            track('sticky_cart_toggle', {
                action: (bar && bar.classList.contains('expanded')) ? 'collapse' : 'expand'
            });
        });

        // Section impressions (product page specific)
        document.addEventListener('DOMContentLoaded', function () {
            if (!window.IntersectionObserver) return;
            var sections = [
                { sel: '.reviews-section',      name: 'reviews'      },
                { sel: '.product-benefits',     name: 'benefits'     },
                { sel: '.product-video-section',name: 'video'        },
                { sel: '.faq-section',          name: 'faq'          },
                { sel: '.urgency-section',      name: 'urgency'      }
            ];
            var obs = new IntersectionObserver(function (entries) {
                entries.forEach(function (en) {
                    if (en.isIntersecting) {
                        track('section_view', { section: en.target.dataset.analyticsSection || '' });
                        obs.unobserve(en.target);
                    }
                });
            }, { threshold: 0.3 });
            sections.forEach(function (s) {
                var el = document.querySelector(s.sel);
                if (el) { el.dataset.analyticsSection = s.name; obs.observe(el); }
            });
        });
    }

    // ═══════════════════════════════════════════════════════════════════
    // CART
    // ═══════════════════════════════════════════════════════════════════
    if (PAGE_TYPE === 'cart') {

        document.addEventListener('DOMContentLoaded', function () {
            setTimeout(function () {
                var items = (window.EcoCart && window.EcoCart.getCart) ? window.EcoCart.getCart() : [];
                var total = items.reduce(function (s, it) { return s + (it.price || 0) * (it.quantity || 1); }, 0);
                track('view_cart', {
                    currency: currentCurrency,
                    value:    total,
                    items:    items.map(function (it) {
                        return { item_id: it.id || '', item_name: it.title || it.name || '', price: it.price || 0, quantity: it.quantity || 1 };
                    })
                });
            }, 500);
        });

        // begin_checkout from cart
        document.addEventListener('click', function (e) {
            if (!e.target.closest('.cs__pay-btn')) return;
            var items = (window.EcoCart && window.EcoCart.getCart) ? window.EcoCart.getCart() : [];
            var total = items.reduce(function (s, it) { return s + (it.price || 0) * (it.quantity || 1); }, 0);
            track('begin_checkout', {
                currency: currentCurrency,
                value:    total,
                items:    items.map(function (it) {
                    return { item_id: it.id || '', item_name: it.title || it.name || '', price: it.price || 0, quantity: it.quantity || 1 };
                })
            });
        });

        // Remove from cart
        document.addEventListener('click', function (e) {
            var btn = e.target.closest('[data-remove-id]');
            if (btn) track('remove_from_cart', { item_id: btn.dataset.removeId || '' });
        });
    }

    // ═══════════════════════════════════════════════════════════════════
    // CONTACT
    // ═══════════════════════════════════════════════════════════════════
    if (PAGE_TYPE === 'contact') {
        document.addEventListener('submit', function (e) {
            if (e.target.classList.contains('contact-form')) {
                track('contact_form_submit', {});
            }
        });
    }

    // ═══════════════════════════════════════════════════════════════════
    // LEGAL
    // ═══════════════════════════════════════════════════════════════════
    if (PAGE_TYPE === 'legal') {
        track('legal_page_view', { page_path: window.location.pathname });
    }

})();
