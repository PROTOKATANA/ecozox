/* ========================================
   Sticky Add to Cart — IntersectionObserver
   ======================================== */

(function () {
  'use strict';

  const bar    = document.getElementById('sticky-cart-bar');
  const target = document.querySelector('.product-info-detail .action-buttons');
  const footer = document.querySelector('footer') || document.querySelector('[data-component="footer"]');

  if (!bar || !target) return;

  let buttonsHidden = false;
  let footerVisible = false;

  function update() {
    const show = buttonsHidden && !footerVisible;
    bar.classList.toggle('visible', show);
    bar.setAttribute('aria-hidden', String(!show));
  }

  const MARGIN = 120; // px — aumenta para que el banner aguante más visible

  function checkButtons() {
    const rect = target.getBoundingClientRect();
    // Los botones se consideran "visibles" solo cuando están MARGIN px dentro del viewport
    buttonsHidden = rect.top > window.innerHeight - MARGIN || rect.bottom < MARGIN;
    update();
  }

  window.addEventListener('scroll', checkButtons, { passive: true });
  checkButtons(); // estado inicial

  if (footer) {
    new IntersectionObserver(
      ([entry]) => { footerVisible = entry.isIntersecting; update(); },
      { threshold: 0 }
    ).observe(footer);
  }
})();
