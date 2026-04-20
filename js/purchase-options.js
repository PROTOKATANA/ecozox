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

  function getDiscountFactor() {
    var d = (window.ECOZOX_CONFIG && window.ECOZOX_CONFIG.discountPercent != null)
      ? window.ECOZOX_CONFIG.discountPercent
      : (function () { try { var s = localStorage.getItem('ecozox_desc'); return s !== null ? parseFloat(s) : 30; } catch (e) { return 30; } }());
    return 1 - d / 100;
  }

  /* ---------- Capture base (individual) product data ----------
     Read from the first .js-add-to-cart button — it's the
     source of truth baked into the HTML.                      */
  const firstBtn = document.querySelector('.js-add-to-cart');
  if (!firstBtn) return;
  const BASE = {
    id:    firstBtn.dataset.productId    || '',
    get title() {
      var h1 = document.querySelector('.product-info-detail h1');
      return h1 ? h1.textContent.trim() : (firstBtn.dataset.productTitle || '');
    },
    get name() {
      var h1 = document.querySelector('.product-info-detail h1');
      return h1 ? h1.textContent.trim() : '';
    },
    get price() { return firstBtn.dataset.productPrice || '0'; },
    image: firstBtn.dataset.productImage || '',
  };

  /* ---------- Bundle data (stored on the bundle card) ---------- */
  const bundleCard = widget.querySelector('[data-option="bundle"]');
  const BUNDLE = {
    id:             bundleCard.dataset.bundleId,
    title:          bundleCard.dataset.bundleTitle,
    price:          bundleCard.dataset.bundlePrice,
    origPriceCents: bundleCard.dataset.bundleOriginalPrice || null,
    image:          bundleCard.dataset.bundleImage,
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
      if (stickyBar && stickyBar.contains(btn)) return;
      btn.dataset.productId    = data.id;
      btn.dataset.productTitle = data.title;
      btn.dataset.productName  = data.name || data.title;
      btn.dataset.productPrice = data.price;
      btn.dataset.productImage = data.image;
      if (data.origPrice != null) {
        btn.dataset.productOrigPrice = data.origPrice;
      } else {
        delete btn.dataset.productOrigPrice;
      }
      if (data.subItems && data.subItems.length) {
        btn.dataset.productSubItems = JSON.stringify(data.subItems);
      } else {
        delete btn.dataset.productSubItems;
      }
      if (data.isBundle) {
        btn.dataset.productBundleQty = data.qty;
      } else {
        delete btn.dataset.productBundleQty;
      }
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
      stickyBtn.dataset.productName  = data.name || data.title;
      stickyBtn.dataset.productPrice = data.price;
      stickyBtn.dataset.productImage = data.image;
      if (data.subItems && data.subItems.length) {
        stickyBtn.dataset.productSubItems = JSON.stringify(data.subItems);
      } else {
        delete stickyBtn.dataset.productSubItems;
      }
      if (data.isBundle) {
        stickyBtn.dataset.productBundleQty = data.qty;
      } else {
        delete stickyBtn.dataset.productBundleQty;
      }
    }

    /* 2. Update visible title */
    const titleEl = stickyBar.querySelector('.sticky-cart-bar__title');
    if (titleEl) titleEl.textContent = data.title;

    /* 3. Update visible prices using EcoI18n.formatPrice */
    const origEl = stickyBar.querySelector('.scb__price-original');
    const saleEl = stickyBar.querySelector('.scb__price-sale');
    if (origEl) {
      const salePrice = parseFloat(data.price);
      const origPrice = (data.origPrice != null) ? data.origPrice : salePrice / getDiscountFactor();
      origEl.textContent = (window.EcoI18n ? window.EcoI18n.formatPrice(origPrice) : '$' + origPrice.toFixed(2));
    }
    if (saleEl) {
      saleEl.textContent = (window.EcoI18n ? window.EcoI18n.formatPrice(parseFloat(data.price)) : '$' + parseFloat(data.price).toFixed(2));
    }
  }

  /* ---------- Bundle quantity helpers ---------- */
  const bundleQtyInput = bundleCard.querySelector('.js-bundle-qty');
  const bundleQtyMinus = bundleCard.querySelector('.qty-btn.minus');
  const bundleQtyPlus  = bundleCard.querySelector('.qty-btn.plus');

  function getBundleQty() {
    return bundleQtyInput ? (parseInt(bundleQtyInput.value) || 1) : 1;
  }

  function getBundleSubItems() {
    return Array.from(bundleCard.querySelectorAll('.po-bundle__item')).map(function (li) {
      const img  = li.querySelector('img');
      const span = li.querySelector('span');
      return {
        img:   img  ? img.src               : '',
        title: span ? span.textContent.trim() : '',
      };
    });
  }

  function bundleDataWithQty() {
    const qty = getBundleQty();
    const titleEl = bundleCard.querySelector('.po-bundle__title');
    const title = titleEl ? titleEl.textContent.trim() : BUNDLE.title;
    const origPrice = BUNDLE.origPriceCents ? parseFloat(BUNDLE.origPriceCents) / 100 : null;
    return Object.assign({}, BUNDLE, { title: title, subItems: getBundleSubItems(), qty: qty, isBundle: true, origPrice: origPrice });
  }

  /* ---------- Selection logic ---------- */
  const qtyWrapper = widget.querySelector('.purchase-option__qty');
  const qtyInput   = widget.querySelector('.qty-input');
  const options    = widget.querySelectorAll('.purchase-option');

  let activeOption = widget.querySelector('.purchase-option--selected') || null;

  function selectOption(chosen) {
    /* Deselect all */
    options.forEach(function (opt) {
      opt.classList.remove('purchase-option--selected');
      opt.setAttribute('aria-checked', 'false');
    });

    /* Select the clicked one */
    chosen.classList.add('purchase-option--selected');
    chosen.setAttribute('aria-checked', 'true');
    activeOption = chosen;

    const isBundle = chosen.dataset.option === 'bundle';

    if (isBundle) {
      /* Dim single quantity controls while bundle is active */
      if (qtyWrapper) qtyWrapper.classList.add('purchase-option__qty--disabled');
      updateCartButtons(bundleDataWithQty());
      syncStickyBar(bundleDataWithQty());
    } else {
      /* Restore single quantity controls */
      if (qtyWrapper) qtyWrapper.classList.remove('purchase-option__qty--disabled');
      updateCartButtons(BASE);
      syncStickyBar(BASE);
    }
  }

  /* Sync cart when bundle qty changes (after quantity.js has updated the value) */
  function onBundleQtyChange() {
    if (!activeOption || activeOption.dataset.option !== 'bundle') return;
    updateCartButtons(bundleDataWithQty());
    syncStickyBar(bundleDataWithQty());
  }

  if (bundleQtyMinus) bundleQtyMinus.addEventListener('click', onBundleQtyChange);
  if (bundleQtyPlus)  bundleQtyPlus.addEventListener('click', onBundleQtyChange);
  if (bundleQtyInput) {
    bundleQtyInput.addEventListener('change', onBundleQtyChange);
    bundleQtyInput.addEventListener('input',  onBundleQtyChange);
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

  /* ---------- Init: sync buttons with the pre-selected option ---------- */
  function syncActive() {
    if (!activeOption) return;
    if (activeOption.dataset.option === 'bundle') {
      updateCartButtons(bundleDataWithQty());
      syncStickyBar(bundleDataWithQty());
    } else {
      updateCartButtons(BASE);
      syncStickyBar(BASE);
    }
  }

  syncActive();

  /* Llamado por precio-loader tras recibir los precios del servidor */
  function refreshBundle() {
    BUNDLE.price          = bundleCard.dataset.bundlePrice;
    BUNDLE.origPriceCents = bundleCard.dataset.bundleOriginalPrice || null;
    syncActive();
  }

  /* Re-sync after i18n updates translated text (title, name) */
  window.EcoPurchaseOptions = { update: syncActive, refreshBundle: refreshBundle };

})();
