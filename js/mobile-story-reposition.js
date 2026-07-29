/* ========================================
   Mobile Story Reposition
   En escritorio (≥1024px) #concern-section vive
   fuera del layout de 2 columnas, a ancho completo,
   justo debajo de todo el hero (posición original
   en el HTML, tras </main>, antes de los vídeos).

   En móvil (<1024px) tiene que aparecer DENTRO de
   .product-info-detail, justo DESPUÉS de
   .product-info__fixed (shipping-info-card) — ese
   widget informa de descuento/regalo/urgencia y debe
   verse antes que las 4 tarjetas de historia, ya que
   en ese layout no hay columnas fijas ni scroll
   interno — todo fluye en una sola columna.

   No se puede resolver solo con CSS (order/flex) porque
   son posiciones en distintos niveles del árbol, no un
   simple reordenamiento entre hermanos. Se mueve el
   mismo nodo (sin duplicar markup ni perder listeners
   ya enganchados) según el breakpoint.
   ======================================== */
(function () {
    'use strict';

    var section = document.getElementById('concern-section');
    var fixedArea = document.querySelector('.product-info__fixed');
    if (!section || !fixedArea) return;

    var desktopParent = section.parentNode;
    var desktopNextSibling = section.nextSibling;
    var mobileParent = fixedArea.parentNode; // .product-info-detail

    var mql = window.matchMedia('(max-width: 1023px)');

    function place() {
        if (mql.matches) {
            if (section.previousSibling !== fixedArea || section.parentNode !== mobileParent) {
                mobileParent.insertBefore(section, fixedArea.nextSibling);
            }
        } else if (section.parentNode !== desktopParent) {
            desktopParent.insertBefore(section, desktopNextSibling);
        }
    }

    place();
    if (mql.addEventListener) {
        mql.addEventListener('change', place);
    } else if (mql.addListener) {
        mql.addListener(place); // Safari antiguo
    }
})();
