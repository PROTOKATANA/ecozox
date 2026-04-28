/* ========================================
   Precio Loader — Fuente única de verdad
   Carga precios desde el backend y actualiza
   el DOM antes de que el usuario los vea.
   El backend es siempre la fuente de verdad:
   lo que se muestra = lo que se cobra.
   ======================================== */

(function () {
  'use strict';

  var nicho   = window.ECOZOX_BRAND && window.ECOZOX_BRAND.nicho;
  if (!nicho) {
    try { nicho = localStorage.getItem('ecozox_nicho'); } catch (e) {}
  }
  var apiBase = window.ECOZOX_API_URL || '';

  if (!nicho) return;

  // Upgrade automático HTTP → HTTPS en producción
  if (apiBase.indexOf('http://') === 0 && !apiBase.match(/localhost|127\.0\.0\.1/)) {
    apiBase = 'https://' + apiBase.slice(7);
  }

  var ctrl    = new AbortController();
  var timeout = setTimeout(function () { ctrl.abort(); }, 6000);

  fetch(apiBase + '/api/productos/' + encodeURIComponent(nicho), { signal: ctrl.signal })
    .then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    })
    .then(function (data) {
      clearTimeout(timeout);
      var globalDiscount = (data.descuentoGlobal != null) ? data.descuentoGlobal
                           : (data.descuentoGBL != null) ? data.descuentoGBL
                           : null;
      if (globalDiscount != null) {
        window.ECOZOX_CONFIG = window.ECOZOX_CONFIG || {};
        window.ECOZOX_CONFIG.discountPercent = globalDiscount;
        try { localStorage.setItem('ecozox_desc', String(globalDiscount)); } catch (e) {}
      }
      if (data.giftValue != null) {
        window.ECOZOX_CONFIG = window.ECOZOX_CONFIG || {};
        window.ECOZOX_CONFIG.giftValue = data.giftValue;
      }
      // Guardar catálogo en memoria para que cart-items.js recalcule precios en caliente
      window.ECOZOX_CATALOG = data.productos || [];
      applyPrices(data.productos || []);
    })
    .catch(function (err) {
      clearTimeout(timeout);
      if (err.name !== 'AbortError') {
        console.warn('[PrecioLoader] No se pudo cargar el catálogo:', err);
      }
    });

  function applyPrices(productos) {
    var firstBtn   = document.querySelector('.js-add-to-cart');
    var mainId     = firstBtn ? firstBtn.dataset.productId : null;

    var individual = productos.find(function (p) { return p.tipo === 'individual' && p.localId === mainId; })
                  || productos.find(function (p) { return p.tipo === 'individual'; });
    var bundle     = productos.find(function (p) { return p.tipo === 'bundle'; });

    if (individual) applyIndividual(individual);
    if (bundle)     applyBundle(bundle);

    if (window.EcoI18n && window.EcoI18n.applyPrices) {
      window.EcoI18n.applyPrices();
      if (window.EcoI18n.applyTranslations) window.EcoI18n.applyTranslations();
    }
    if (window.EcoCartRenderer && window.EcoCartRenderer.renderCart) {
      window.EcoCartRenderer.renderCart();
    }
  }

  function applyIndividual(p) {
    var ventaDec = p.precioVentaCents / 100;
    var origDec  = p.precioOriginalCents / 100;

    document.querySelectorAll('[data-product-id="' + p.localId + '"]').forEach(function (el) {
      el.dataset.productPrice = p.precioVentaCents;
    });

    setIi8nPrice('.po-single__price-sale',     ventaDec);
    setIi8nPrice('.po-single__price-original', origDec);
    setIi8nPrice('.scb__price-sale',           ventaDec);
    setIi8nPrice('.scb__price-original',       origDec);

    if (window.EcoPurchaseOptions && window.EcoPurchaseOptions.refreshIndividual) {
      window.EcoPurchaseOptions.refreshIndividual();
    }
  }

  function applyBundle(p) {
    var ventaDec = p.precioVentaCents / 100;
    var origDec  = p.precioOriginalCents / 100;

    if (p.descuento != null) {
      window.ECOZOX_CONFIG = window.ECOZOX_CONFIG || {};
      window.ECOZOX_CONFIG.bundleExtraDiscount = p.descuento;
    }

    document.querySelectorAll('[data-bundle-id="' + p.localId + '"]').forEach(function (el) {
      el.dataset.bundlePrice         = p.precioVentaCents;
      el.dataset.bundleOriginalPrice = p.precioOriginalCents;
      if (p.descuento != null)
        el.dataset.bundleDiscount = (p.descuento / 100).toFixed(4);
    });

    setIi8nPrice('.js-bundle-price-sale',     ventaDec);
    setIi8nPrice('.js-bundle-price-original', origDec);

    if (window.EcoPurchaseOptions && window.EcoPurchaseOptions.refreshBundle) {
      window.EcoPurchaseOptions.refreshBundle();
    }
  }

  function setIi8nPrice(selector, decimal) {
    document.querySelectorAll(selector).forEach(function (el) {
      el.setAttribute('data-i18n-price', decimal);
    });
  }

})();
