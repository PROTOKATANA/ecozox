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

  /* ---------- Timer sincronizado con urgency-banner ---------- */
  const STORAGE_KEY   = 'ecozox_urgency_expires';
  const DURATION_MS   = 15 * 60 * 1000;
  const scbTimerEl    = document.getElementById('scb-timer');

  if (scbTimerEl) {
    function getExpiry() {
      const stored = localStorage.getItem(STORAGE_KEY);
      const now    = Date.now();
      if (stored) {
        const exp = parseInt(stored, 10);
        if (exp > now) return exp;
      }
      const newExp = now + DURATION_MS;
      localStorage.setItem(STORAGE_KEY, newExp);
      return newExp;
    }

    let expiresAt = getExpiry();

    function tickScb() {
      let remaining = expiresAt - Date.now();
      if (remaining <= 0) {
        expiresAt = Date.now() + DURATION_MS;
        localStorage.setItem(STORAGE_KEY, expiresAt);
        remaining  = DURATION_MS;
      }
      const total = Math.max(0, Math.ceil(remaining / 1000));
      const mm    = String(Math.floor(total / 60)).padStart(2, '0');
      const ss    = String(total % 60).padStart(2, '0');
      scbTimerEl.textContent = mm + ':' + ss;
    }

    tickScb();
    setInterval(tickScb, 1000);
  }
})();
