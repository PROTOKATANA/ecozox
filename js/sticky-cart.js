/* ========================================
   Sticky Add to Cart — IntersectionObserver
   ======================================== */

(function () {
  'use strict';

  const bar    = document.getElementById('sticky-cart-bar');
  const target = document.querySelector('.product-info-detail .action-buttons');

  if (!bar || !target) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      const isVisible = entry.isIntersecting;
      bar.classList.toggle('visible', !isVisible);
      bar.setAttribute('aria-hidden', String(isVisible));
    },
    {
      // Dispara tan pronto como un solo píxel del target sale/entra al viewport
      threshold: 0,
    }
  );

  observer.observe(target);
})();
