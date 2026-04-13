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
  let userCollapsed = false;

  const isMobile = () => window.innerWidth < 768;

  /* ---------- Toggle handle (móvil) ---------- */
  const toggleBtn = document.createElement('button');
  toggleBtn.className = 'scb__toggle';
  toggleBtn.setAttribute('aria-label', 'Mostrar/ocultar carrito');
  toggleBtn.innerHTML = '<span class="scb__toggle-handle"></span>';
  bar.insertBefore(toggleBtn, bar.firstChild);

  toggleBtn.addEventListener('click', function () {
    if (!isMobile()) return;
    if (userCollapsed) {
      // Expandir: teleportar abajo sin transición, luego slide-up
      userCollapsed = false;
      bar.classList.add('scb--no-transition');
      bar.classList.remove('scb--collapsed');
      bar.style.transform = 'translateY(110%)';
      bar.style.opacity   = '0';
      bar.offsetHeight;   // forzar reflow
      bar.classList.remove('scb--no-transition');
      bar.style.transform = '';
      bar.style.opacity   = '';
    } else {
      // Colapsar: animación normal
      userCollapsed = true;
      bar.classList.add('scb--collapsed');
    }
  });

  /* ---------- Lógica de visibilidad ---------- */
  function update() {
    if (footerVisible) {
      // Auto-ocultar solo cuando el footer es visible
      bar.classList.remove('visible');
      bar.setAttribute('aria-hidden', 'true');
    } else if (buttonsHidden) {
      // Mostrar cuando los botones de compra salen del viewport
      bar.classList.add('visible');
      bar.setAttribute('aria-hidden', 'false');
      if (isMobile()) {
        bar.classList.toggle('scb--collapsed', userCollapsed);
      } else {
        bar.classList.remove('scb--collapsed');
      }
    }
  }

  const MARGIN = 120;

  function checkButtons() {
    const rect = target.getBoundingClientRect();
    buttonsHidden = rect.top > window.innerHeight - MARGIN || rect.bottom < MARGIN;
    update();
  }

  window.addEventListener('scroll', checkButtons, { passive: true });
  checkButtons();

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
