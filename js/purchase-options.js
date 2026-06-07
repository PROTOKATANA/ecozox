/* ========================================
   Purchase Options Widget
   Handles individual / bundle selection.
   Supports pages with 1 or multiple bundle cards.
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
      : (function () { try { var s = localStorage.getItem('ecozox_desc'); return s !== null ? parseFloat(s) : 0; } catch (e) { return 0; } }());
    return 1 - d / 100;
  }

  /* ---------- Capture base (individual) product data ----------
     Read from the first .js-add-to-cart button — it's the
     source of truth baked into the HTML.                      */
  const firstBtn = document.querySelector('.js-add-to-cart');
  if (!firstBtn) return;

  /* Precio individual capturado por separado para que no lo sobreescriba el bundle */
  let _individualPrice = firstBtn.dataset.productPrice || '0';

  const BASE = {
    id:    firstBtn.dataset.productId    || '',
    get title() {
      var h1 = document.querySelector('.product-info-detail h1');
      return h1 ? h1.textContent.trim() : (firstBtn.dataset.productTitle || '');
    },
    get titleKey() {
      var h1 = document.querySelector('.product-info-detail h1');
      return h1 ? (h1.dataset.i18n || '') : '';
    },
    get name() {
      var h1 = document.querySelector('.product-info-detail h1');
      return h1 ? h1.textContent.trim() : '';
    },
    get price() { return _individualPrice; },
    image: firstBtn.dataset.productImage || '',
  };

  /* ---------- Bundle cards — supports 1 or multiple ---------- */
  let activeBundleCard = widget.querySelector('[data-option="bundle"][aria-checked="true"]')
                       || widget.querySelector('[data-option="bundle"]');

  function getBundleSubItems(card) {
    return Array.from(card.querySelectorAll('.po-bundle__item')).map(function (li) {
      const img  = li.querySelector('img');
      const span = li.querySelector('.po-bundle__item-name') || li.querySelector('span');
      return {
        img:   img  ? img.src               : '',
        title: span ? span.textContent.trim() : '',
        key:   span ? (span.dataset.i18n || '') : '',
      };
    });
  }

  function bundleDataWithQty() {
    const card     = activeBundleCard;
    const qtyInput = card.querySelector('.js-bundle-qty');
    const qty      = qtyInput ? (parseInt(qtyInput.value) || 1) : 1;
    const titleEl  = card.querySelector('.po-bundle__title');
    const title    = titleEl ? titleEl.textContent.trim() : (card.dataset.bundleTitle || '');
    const titleKey = titleEl ? (titleEl.dataset.i18n || '') : '';
    const origPrice = card.dataset.bundleOriginalPrice
                    ? parseFloat(card.dataset.bundleOriginalPrice) / 100
                    : null;
    const descuentoExtra = Math.round(parseFloat(card.dataset.bundleDiscount || '0') * 100);

    return {
      id:             card.dataset.bundleId,
      title,
      titleKey,
      price:          card.dataset.bundlePrice,
      image:          card.dataset.bundleImage,
      origPrice,
      descuentoExtra,
      subItems:       getBundleSubItems(card),
      qty,
      isBundle:       true,
    };
  }

  /* ---------- Helpers ---------- */

  function updateCartButtons(data) {
    document.querySelectorAll('.js-add-to-cart, .checkout-btn').forEach(function (btn) {
      if (stickyBar && stickyBar.contains(btn)) return;
      btn.dataset.productId       = data.id;
      btn.dataset.productTitle    = data.title;
      btn.dataset.productTitleKey = data.titleKey || '';
      btn.dataset.productName     = data.name || data.title;
      btn.dataset.productPrice    = data.price;
      btn.dataset.productImage    = data.image;
      if (data.origPrice != null) {
        btn.dataset.productOrigPrice = data.origPrice;
      } else {
        delete btn.dataset.productOrigPrice;
      }
      if (data.descuentoExtra != null) {
        btn.dataset.productBundleExtraDisc = data.descuentoExtra;
      } else {
        delete btn.dataset.productBundleExtraDisc;
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

  const stickyBar = document.getElementById('sticky-cart-bar');

  function syncStickyBar(data) {
    if (!stickyBar) return;

    stickyBar.querySelectorAll('.js-add-to-cart, .checkout-btn').forEach(function (stickyBtn) {
      stickyBtn.dataset.productId       = data.id;
      stickyBtn.dataset.productTitle    = data.title;
      stickyBtn.dataset.productTitleKey = data.titleKey || '';
      stickyBtn.dataset.productName     = data.name || data.title;
      stickyBtn.dataset.productPrice    = data.price;
      stickyBtn.dataset.productImage    = data.image;
      if (data.origPrice != null) {
        stickyBtn.dataset.productOrigPrice = data.origPrice;
      } else {
        delete stickyBtn.dataset.productOrigPrice;
      }
      if (data.descuentoExtra != null) {
        stickyBtn.dataset.productBundleExtraDisc = data.descuentoExtra;
      } else {
        delete stickyBtn.dataset.productBundleExtraDisc;
      }
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
    });

    const titleEl = stickyBar.querySelector('.scb__title');
    if (titleEl) titleEl.textContent = data.title;

    const origEl = stickyBar.querySelector('.scb__price-original');
    const saleEl = stickyBar.querySelector('.scb__price-sale');
    if (origEl || saleEl) {
      const salePrice = parseFloat(data.price) / 100;
      const origPrice = (data.origPrice != null) ? data.origPrice : salePrice / getDiscountFactor();
      if (origEl) origEl.textContent = (window.EcoI18n ? window.EcoI18n.formatPrice(origPrice) : '€' + origPrice.toFixed(2));
      if (saleEl) saleEl.textContent = (window.EcoI18n ? window.EcoI18n.formatPrice(salePrice)  : '€' + salePrice.toFixed(2));
    }
  }

  /* ---------- Bundle qty: event delegation on the widget ---------- */
  /* Handles qty changes for whichever bundle card is currently active */
  function onBundleQtyChange() {
    if (!activeOption || activeOption.dataset.option !== 'bundle') return;
    updateCartButtons(bundleDataWithQty());
    syncStickyBar(bundleDataWithQty());
  }

  widget.addEventListener('click', function (e) {
    const btn = e.target.closest('.qty-btn');
    if (!btn) return;
    const card = btn.closest('[data-option="bundle"]');
    if (!card || card !== activeBundleCard) return;
    /* quantity.js updates the input value; read after it runs */
    setTimeout(onBundleQtyChange, 0);
  });

  widget.addEventListener('change', function (e) {
    if (!e.target.classList.contains('js-bundle-qty')) return;
    const card = e.target.closest('[data-option="bundle"]');
    if (!card || card !== activeBundleCard) return;
    onBundleQtyChange();
  });

  widget.addEventListener('input', function (e) {
    if (!e.target.classList.contains('js-bundle-qty')) return;
    const card = e.target.closest('[data-option="bundle"]');
    if (!card || card !== activeBundleCard) return;
    onBundleQtyChange();
  });

  /* ---------- Selection logic ---------- */
  const qtyWrapper = widget.querySelector('.purchase-option__qty');
  const options    = widget.querySelectorAll('.purchase-option');

  let activeOption = widget.querySelector('.purchase-option--selected') || null;

  function selectOption(chosen) {
    options.forEach(function (opt) {
      opt.classList.remove('purchase-option--selected');
      opt.setAttribute('aria-checked', 'false');
    });

    chosen.classList.add('purchase-option--selected');
    chosen.setAttribute('aria-checked', 'true');
    activeOption = chosen;

    const isBundle = chosen.dataset.option === 'bundle';

    if (isBundle) {
      activeBundleCard = chosen;
      if (qtyWrapper) qtyWrapper.classList.add('purchase-option__qty--disabled');
      updateCartButtons(bundleDataWithQty());
      syncStickyBar(bundleDataWithQty());
    } else {
      if (qtyWrapper) qtyWrapper.classList.remove('purchase-option__qty--disabled');
      updateCartButtons(BASE);
      syncStickyBar(BASE);
    }
  }

  /* ---------- Event listeners ---------- */
  options.forEach(function (option) {
    option.addEventListener('click', function () {
      selectOption(option);
    });

    option.addEventListener('keydown', function (e) {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        selectOption(option);
      }
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
    /* precio-loader ya actualizó data-bundle-price en activeBundleCard vía data-bundle-id */
    syncActive();
  }

  function refreshIndividual() {
    if (firstBtn.dataset.productPrice && firstBtn.dataset.productPrice !== '0') {
      _individualPrice = firstBtn.dataset.productPrice;
    }
    syncActive();
  }

  window.EcoPurchaseOptions = { update: syncActive, refreshBundle: refreshBundle, refreshIndividual: refreshIndividual };

  /* Si precio-loader ya resolvió antes de que este script cargara, re-ejecutar */
  if (activeBundleCard && activeBundleCard.dataset.bundleOriginalPrice) {
    refreshBundle();
  }

})();
