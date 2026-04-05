/* ========================================
   Before / After Image Slider
   Handles thumbnail selection + drag comparison
   ======================================== */

(function () {
    const slider    = document.getElementById('baSlider');
    if (!slider) return;

    const beforeImg  = document.getElementById('baBeforeImg');
    const afterImg   = document.getElementById('baAfterImg');
    const divider    = document.getElementById('baDivider');
    const thumbnails = document.querySelectorAll('.thumbnail');

    if (!beforeImg || !afterImg || !divider || thumbnails.length === 0) return;

    let dragging = false;

    // ── Position ────────────────────────────────────────────────
    function setPos(clientX) {
        const rect = slider.getBoundingClientRect();
        let p = ((clientX - rect.left) / rect.width) * 100;
        p = Math.max(2, Math.min(98, p));
        slider.style.setProperty('--ba-pos', p + '%');
    }

    function resetPos() {
        slider.style.setProperty('--ba-pos', '65%');
    }

    // ── Mouse ────────────────────────────────────────────────────
    divider.addEventListener('mousedown', e => {
        e.preventDefault();
        dragging = true;
    });

    document.addEventListener('mousemove', e => {
        if (!dragging) return;
        setPos(e.clientX);
    });

    document.addEventListener('mouseup', () => { dragging = false; });

    // Click anywhere on slider (not on handle) to jump
    slider.addEventListener('click', e => {
        if (divider.contains(e.target)) return;
        setPos(e.clientX);
    });

    // ── Touch ────────────────────────────────────────────────────
    divider.addEventListener('touchstart', e => {
        e.preventDefault();
        dragging = true;
    }, { passive: false });

    document.addEventListener('touchmove', e => {
        if (!dragging) return;
        setPos(e.touches[0].clientX);
    }, { passive: true });

    document.addEventListener('touchend', () => { dragging = false; });

    // ── Thumbnails ───────────────────────────────────────────────
    function activate(thumb) {
        const afterSrc  = thumb.dataset.fullSrc;
        const beforeSrc = thumb.dataset.beforeSrc;

        if (afterSrc)  afterImg.src  = afterSrc;
        if (beforeSrc) beforeImg.src = beforeSrc;

        thumbnails.forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');

        resetPos();
    }

    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', () => activate(thumb));
        thumb.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                activate(thumb);
            }
        });
    });
})();
