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
    price: bundleCard.dataset.bundlePrice,
    image: bundleCard.dataset.bundleImage,
  };

  /* ---------- Helpers ---------- */
  function getAllCartButtons() {
    return document.querySelectorAll('.js-add-to-cart');
  }

  function updateCartButtons(data) {
    getAllCartButtons().forEach(function (btn) {
      btn.dataset.productId    = data.id;
      btn.dataset.productTitle = data.title;
      btn.dataset.productPrice = data.price;
      btn.dataset.productImage = data.image;
    });
  }

  /* Update the sticky bar's display text to reflect the selection */
  function updateStickyBar(data) {
    const titleEl = document.querySelector('.sticky-cart-bar__title');
    const priceEl = document.querySelector('.sticky-cart-bar__price');
    if (!titleEl || !priceEl) return;

    /* Preserve the currency prefix already rendered by i18n */
    const currentText  = priceEl.textContent;
    const currencyPrefix = currentText.replace(/[\d.,\s]/g, '').trim() || '$';

    titleEl.textContent = data.title;
    priceEl.textContent = currencyPrefix + parseFloat(data.price).toFixed(2);
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
      updateStickyBar(BUNDLE);
    } else {
      /* Restore quantity controls */
      if (qtyWrapper) qtyWrapper.classList.remove('purchase-option__qty--disabled');
      updateCartButtons(BASE);
      updateStickyBar(BASE);
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
