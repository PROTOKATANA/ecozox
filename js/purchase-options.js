/* ========================================
   Purchase Options Widget
   Handles individual / bundle selection.
   Syncs data-product-* on ALL .js-add-to-cart
   buttons so cart.js works without changes.
   ======================================== */

(function () {
  'use strict';

  const widget = document.getElementById('purchaseOptions');
  if (!widget) return;

  /* ---------- Capture base (individual) product data ----------
     Read from the first .js-add-to-cart button — it's the
     source of truth baked into the HTML.                      */
  const firstBtn = document.querySelector('.js-add-to-cart');
  const BASE = {
    id:    firstBtn.dataset.productId,
    title: firstBtn.dataset.productTitle,
    price: firstBtn.dataset.productPrice,
    image: firstBtn.dataset.productImage,
  };

  /* ---------- Bundle data (stored on the bundle card) ---------- */
  const bundleCard = widget.querySelector('[data-option="bundle"]');
  const BUNDLE = {
    id:    bundleCard.dataset.bundleId,
    title: bundleCard.dataset.bundleTitle,
    price: bundleCard.dataset.bundlePrice,   /* original price — overwritten below */
    image: bundleCard.dataset.bundleImage,
  };

  /* Apply discount: data-bundle-discount="0.20" → 20% off
     The original price is tachado; the sale price goes to cart. */
    (function applyBundleDiscount() {
    const discount = parseFloat(bundleCard.dataset.bundleDiscount || '0');
    if (!discount) return;

    const original = parseFloat(BUNDLE.price);
    const sale     = (original * (1 - discount)).toFixed(2);

    const originalEl = bundleCard.querySelector('.js-bundle-price-original');
    const saleEl     = bundleCard.querySelector('.js-bundle-price-sale');

    if (originalEl) {
      originalEl.textContent = (window.EcoI18n ? window.EcoI18n.formatPrice(original) : '$' + original.toFixed(2));
    }
    if (saleEl) {
      saleEl.textContent = (window.EcoI18n ? window.EcoI18n.formatPrice(parseFloat(sale)) : '$' + sale);
    }

    /* Cart receives the discounted price */
    BUNDLE.price = sale;
  }());

  /* ---------- Helpers ---------- */

  /* Update data-product-* on every .js-add-to-cart outside the sticky bar.
     The sticky bar button is handled separately by syncStickyBar so that
     both its data attributes and its visible text move in one atomic step. */
  function updateCartButtons(data) {
    document.querySelectorAll('.js-add-to-cart').forEach(function (btn) {
      if (stickyBar && stickyBar.contains(btn)) return; /* skip — handled below */
      btn.dataset.productId    = data.id;
      btn.dataset.productTitle = data.title;
      btn.dataset.productPrice = data.price;
      btn.dataset.productImage = data.image;
    });
  }

  /* Cache the sticky bar container once — null if it doesn't exist on this page */
  const stickyBar = document.getElementById('sticky-cart-bar');

  /* Sync sticky bar: data-product-* on its button + visible title/price text */
  function syncStickyBar(data) {
    if (!stickyBar) return;

    /* 1. Update the add-to-cart button inside the sticky bar */
    const stickyBtn = stickyBar.querySelector('.js-add-to-cart');
    if (stickyBtn) {
      stickyBtn.dataset.productId    = data.id;
      stickyBtn.dataset.productTitle = data.title;
      stickyBtn.dataset.productPrice = data.price;
      stickyBtn.dataset.productImage = data.image;
    }

    /* 2. Update visible title */
    const titleEl = stickyBar.querySelector('.sticky-cart-bar__title');
    if (titleEl) titleEl.textContent = data.title;

    /* 3. Update visible prices using EcoI18n.formatPrice */
    const origEl = stickyBar.querySelector('.scb__price-original');
    const saleEl = stickyBar.querySelector('.scb__price-sale');
    if (origEl) {
      origEl.textContent = (window.EcoI18n ? window.EcoI18n.formatPrice(parseFloat(data.price) / 0.7) : '$' + (parseFloat(data.price) / 0.7).toFixed(2));
    }
    if (saleEl) {
      saleEl.textContent = (window.EcoI18n ? window.EcoI18n.formatPrice(parseFloat(data.price)) : '$' + parseFloat(data.price).toFixed(2));
    }
  }

  /* ---------- Selection logic ---------- */
  const qtyWrapper = widget.querySelector('.purchase-option__qty');
  const qtyInput   = widget.querySelector('.qty-input');
  const options    = widget.querySelectorAll('.purchase-option');

  function selectOption(chosen) {
    /* Deselect all */
    options.forEach(function (opt) {
      opt.classList.remove('purchase-option--selected');
      opt.setAttribute('aria-checked', 'false');
    });

    /* Select the clicked one */
    chosen.classList.add('purchase-option--selected');
    chosen.setAttribute('aria-checked', 'true');

    const isBundle = chosen.dataset.option === 'bundle';

    if (isBundle) {
      /* Dim quantity controls — the bundle is always qty 1 */
      if (qtyWrapper) qtyWrapper.classList.add('purchase-option__qty--disabled');
      if (qtyInput)   qtyInput.value = '1';
      updateCartButtons(BUNDLE);
      syncStickyBar(BUNDLE);
    } else {
      /* Restore quantity controls */
      if (qtyWrapper) qtyWrapper.classList.remove('purchase-option__qty--disabled');
      updateCartButtons(BASE);
      syncStickyBar(BASE);
    }
  }

  /* ---------- Event listeners ---------- */
  options.forEach(function (option) {
    /* Click */
    option.addEventListener('click', function () {
      selectOption(option);
    });

    /* Keyboard: Space / Enter activate the option */
    option.addEventListener('keydown', function (e) {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        selectOption(option);
      }
      /* Arrow keys navigate between options */
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        const next = option.nextElementSibling;
        if (next && next.classList.contains('purchase-option')) {
          selectOption(next);
          next.focus();
        }
      }
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        const prev = option.previousElementSibling;
        if (prev && prev.classList.contains('purchase-option')) {
          selectOption(prev);
          prev.focus();
        }
      }
    });
  });

})();
