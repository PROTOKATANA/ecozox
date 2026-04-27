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
  var apiBase = window.ECOZOX_API_URL || '';

  if (!nicho) return; // solo páginas de nicho

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
      // Propagar el descuento global para que cart-items, purchase-options
      // y product-card lo lean desde window.ECOZOX_CONFIG
      if (data.descuentoGlobal != null) {
        window.ECOZOX_CONFIG = window.ECOZOX_CONFIG || {};
        window.ECOZOX_CONFIG.discountPercent = data.descuentoGlobal;
        try { localStorage.setItem('ecozox_desc', String(data.descuentoGlobal)); } catch (e) {}
      }
      applyPrices(data.productos || []);
    })
    .catch(function (err) {
      clearTimeout(timeout);
      if (err.name !== 'AbortError') {
        console.warn('[PrecioLoader] No se pudo cargar el catálogo:', err);
      }
      // Fallback: los precios del HTML se mantienen tal cual
    });

  function applyPrices(productos) {
    // Encontrar el ID del producto principal en esta página (el del primer botón de compra)
    var firstBtn   = document.querySelector('.js-add-to-cart');
    var mainId     = firstBtn ? firstBtn.dataset.productId : null;

    // Buscar el individual que coincida con el botón principal; si no, fallback al primero
    var individual = productos.find(function (p) { return p.tipo === 'individual' && p.localId === mainId; })
                  || productos.find(function (p) { return p.tipo === 'individual'; });
    var bundle     = productos.find(function (p) { return p.tipo === 'bundle'; });

    if (individual) applyIndividual(individual);
    if (bundle)     applyBundle(bundle);

    // Refrescar conversión de moneda en el sistema i18n
    if (window.EcoI18n && window.EcoI18n.applyPrices) {
      window.EcoI18n.applyPrices();
    }
  }

  /* ---- Actualiza precios del producto individual ---- */
  function applyIndividual(p) {
    var ventaDec = p.precioVentaCents / 100;
    var origDec  = p.precioOriginalCents / 100;

    // Actualizar atributos en botones de añadir al carrito
    document.querySelectorAll('[data-product-id="' + p.localId + '"]').forEach(function (el) {
      el.dataset.productPrice = p.precioVentaCents;
    });

    // Actualizar precios de display (data-i18n-price en decimal para el sistema i18n)
    setIi8nPrice('.po-single__price-sale',     ventaDec);
    setIi8nPrice('.po-single__price-original', origDec);
    setIi8nPrice('.scb__price-sale',           ventaDec);
    setIi8nPrice('.scb__price-original',       origDec);

    notifyIndividualUpdate();
  }

  /* ---- Actualiza precios del bundle ---- */
  function applyBundle(p) {
    var ventaDec = p.precioVentaCents / 100;
    var origDec  = p.precioOriginalCents / 100;

    if (p.descuentoExtra != null) {
      window.ECOZOX_CONFIG = window.ECOZOX_CONFIG || {};
      window.ECOZOX_CONFIG.bundleExtraDiscount = p.descuentoExtra;
    }

    // Actualizar atributos del bundle card
    document.querySelectorAll('[data-bundle-id="' + p.localId + '"]').forEach(function (el) {
      el.dataset.bundlePrice         = p.precioVentaCents;
      el.dataset.bundleOriginalPrice = p.precioOriginalCents;
      if (p.descuentoExtra != null)
        el.dataset.bundleDiscount = (p.descuentoExtra / 100).toFixed(4);
    });

    // Actualizar precios de display
    setIi8nPrice('.js-bundle-price-sale',     ventaDec);
    setIi8nPrice('.js-bundle-price-original', origDec);

    // Notificar a purchase-options para que relea el precio del servidor
    if (window.EcoPurchaseOptions && window.EcoPurchaseOptions.refreshBundle) {
      window.EcoPurchaseOptions.refreshBundle();
    }
  }

  /* ---- Notifica a purchase-options que el precio individual se actualizó ---- */
  function notifyIndividualUpdate() {
    if (window.EcoPurchaseOptions && window.EcoPurchaseOptions.refreshIndividual) {
      window.EcoPurchaseOptions.refreshIndividual();
    }
  }

  /* ---- Actualiza el atributo data-i18n-price de un selector ---- */
  function setIi8nPrice(selector, decimal) {
    document.querySelectorAll(selector).forEach(function (el) {
      el.setAttribute('data-i18n-price', decimal);
    });
  }

})();
