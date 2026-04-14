/* ========================================
   Product Reviews
   Lee reseñas desde data.json del nicho.
   Textos traducibles en locales: review_N_titulo / review_N_body
   ======================================== */

(function () {
    const grid = document.getElementById('reviews-grid');
    if (!grid) return;

    /* ---- Helpers ---- */
    const STAR_PATH = 'points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26"';

    function t(key, fallback) {
        if (window.EcoI18n && window.EcoI18n.t) {
            var val = window.EcoI18n.t(key);
            return val !== key ? val : (fallback || key);
        }
        return fallback || key;
    }

    /* Escapa caracteres HTML para usar texto dinámico dentro de innerHTML */
    function esc(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function renderStars(rating, size) {
        size = size || 17;
        return Array.from({ length: 5 }, function (_, i) {
            var on = i < rating;
            return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24"'
                + ' fill="' + (on ? '#fbbf24' : 'none') + '"'
                + ' stroke="' + (on ? '#fbbf24' : '#d1d5db') + '"'
                + ' stroke-width="1.5" aria-hidden="true">'
                + '<polygon ' + STAR_PATH + '/></svg>';
        }).join('');
    }

    function formatDate(str) {
        var parts = str.split('-').map(Number);
        var locale = (window.EcoI18n && window.EcoI18n.getDateLocale)
            ? window.EcoI18n.getDateLocale() : 'es-ES';
        return new Date(parts[0], parts[1] - 1, parts[2])
            .toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' });
    }

    /* ---- Render ---- */
    var RESENAS = [];

    function renderSummary() {
        if (!RESENAS.length) return;
        var avg     = (RESENAS.reduce(function (a, r) { return a + r.rating; }, 0) / RESENAS.length).toFixed(1);
        var scoreEl = document.getElementById('reviews-summary-score');
        var starsEl = document.getElementById('reviews-summary-stars');
        var countEl = document.getElementById('reviews-summary-count');
        if (scoreEl) scoreEl.textContent = avg;
        if (starsEl) starsEl.innerHTML   = renderStars(Math.round(parseFloat(avg)), 22);
        var suffix = t('reviews_count_suffix', 'reseñas');
        if (countEl) countEl.textContent = RESENAS.length + ' ' + suffix;
    }

    function renderReviews() {
        grid.innerHTML = RESENAS.map(function (r) {
            var titulo = t('review_' + r.id + '_titulo', r.titulo_fallback || '');
            var body   = t('review_' + r.id + '_body',   r.body_fallback   || '');

            var imagenes = Array.isArray(r.imagenes) ? r.imagenes : [];
            var thumbsBlock = imagenes.length ? (
                '<div class="review-card__divider"></div>'
                + '<div class="review-thumbnails">'
                + imagenes.map(function (src, i) {
                    return '<img src="' + esc(src) + '" alt="Foto ' + (i + 1) + ' por ' + esc(r.autor) + '"'
                        + ' class="review-thumbnail" data-index="' + i + '" loading="lazy">';
                }).join('')
                + '</div>'
            ) : '';

            return '<article class="review-card">'
                + '<div class="review-card__top">'
                +   '<div class="review-card__header">'
                +     '<div class="review-stars">' + renderStars(r.rating) + '</div>'
                +     '<time class="review-date" datetime="' + esc(r.fecha) + '">' + esc(formatDate(r.fecha)) + '</time>'
                +   '</div>'
                +   '<h4 class="review-title">' + esc(titulo) + '</h4>'
                +   '<p class="review-body">' + esc(body) + '</p>'
                + '</div>'
                + thumbsBlock
                + '<div class="review-card__divider"></div>'
                + '<p class="review-author">&bull; ' + esc(r.autor) + '</p>'
                + '</article>';
        }).join('');
    }

    function init(resenas) {
        RESENAS = resenas || [];
        renderSummary();
        renderReviews();
    }

    /* ---- Cargar desde data.json del nicho ---- */
    var _reviewsController = new AbortController();
    var _reviewsTimeout = setTimeout(function () { _reviewsController.abort(); }, 8000);

    fetch('data.json', { signal: _reviewsController.signal })
        .then(function (res) {
            clearTimeout(_reviewsTimeout);
            return res.json();
        })
        .then(function (productos) {
            var resenas = (productos[0] && productos[0].resenas) ? productos[0].resenas : [];
            init(resenas);
        })
        .catch(function (err) {
            if (err.name !== 'AbortError') {
                console.warn('[EcoReviews] No se pudo cargar data.json:', err);
            }
            init([]);
        });

    window.EcoReviews = {
        update: function () {
            renderSummary();
            renderReviews();
        }
    };

    /* ========================================
       Lightbox de imágenes de reseñas
       ======================================== */
    var lightbox = document.createElement('div');
    lightbox.id        = 'reviewLightbox';
    lightbox.className = 'lightbox-overlay';
    lightbox.setAttribute('hidden', '');
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.innerHTML =
        '<button class="lightbox-close" id="lightboxClose" aria-label="Cerrar">&#x2715;</button>'
        + '<button class="lightbox-nav lightbox-prev" id="lightboxPrev" aria-label="Anterior">&#8249;</button>'
        + '<img class="lightbox-img" id="lightboxImg" src="" alt="">'
        + '<button class="lightbox-nav lightbox-next" id="lightboxNext" aria-label="Siguiente">&#8250;</button>';
    document.body.appendChild(lightbox);

    var lbImg   = document.getElementById('lightboxImg');
    var lbClose = document.getElementById('lightboxClose');
    var lbPrev  = document.getElementById('lightboxPrev');
    var lbNext  = document.getElementById('lightboxNext');
    var lbImages = [];
    var lbIndex  = 0;

    function lbShow(images, index) {
        lbImages = images; lbIndex = index;
        lbImg.src = lbImages[lbIndex];
        lbImg.alt = 'Imagen ' + (lbIndex + 1) + ' de ' + lbImages.length;
        lbPrev.hidden = lbImages.length <= 1;
        lbNext.hidden = lbImages.length <= 1;
        lightbox.removeAttribute('hidden');
        document.body.style.overflow = 'hidden';
    }
    function lbHide() {
        lightbox.setAttribute('hidden', '');
        lbImg.src = '';
        document.body.style.overflow = '';
    }
    function lbGoTo(index) {
        lbIndex = (index + lbImages.length) % lbImages.length;
        lbImg.src = lbImages[lbIndex];
        lbImg.alt = 'Imagen ' + (lbIndex + 1) + ' de ' + lbImages.length;
    }

    grid.addEventListener('click', function (e) {
        var thumb = e.target.closest('.review-thumbnail');
        if (!thumb) return;
        var all    = Array.from(thumb.closest('.review-thumbnails').querySelectorAll('.review-thumbnail'));
        lbShow(all.map(function (img) { return img.src; }), parseInt(thumb.dataset.index, 10));
    });

    lbPrev.addEventListener('click',  function (e) { e.stopPropagation(); lbGoTo(lbIndex - 1); });
    lbNext.addEventListener('click',  function (e) { e.stopPropagation(); lbGoTo(lbIndex + 1); });
    lbClose.addEventListener('click', lbHide);
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) lbHide(); });

    function lbKeyHandler(e) {
        if (lightbox.hasAttribute('hidden')) return;
        if (e.key === 'Escape')     lbHide();
        if (e.key === 'ArrowLeft')  lbGoTo(lbIndex - 1);
        if (e.key === 'ArrowRight') lbGoTo(lbIndex + 1);
    }
    document.addEventListener('keydown', lbKeyHandler);

    var touchStartX = 0;
    lbImg.addEventListener('touchstart', function (e) { touchStartX = e.touches[0].clientX; }, { passive: true });
    lbImg.addEventListener('touchend',   function (e) {
        var diff = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(diff) < 40) return;
        diff < 0 ? lbGoTo(lbIndex + 1) : lbGoTo(lbIndex - 1);
    });

    /* ========================================
       Formulario para escribir reseña
       ======================================== */
    var dialog   = document.getElementById('review-dialog');
    var openBtn  = document.getElementById('openReviewDialog');
    var closeBtn = document.getElementById('reviewDialogClose');
    var form     = document.getElementById('review-form');
    var starBtns  = document.querySelectorAll('.star-picker__btn');
    var starsInput = document.getElementById('reviewStarsInput');
    var selectedStars = 0;

    function buildStarSvg(on, size) {
        size = size || 28;
        return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24"'
            + ' fill="' + (on ? '#fbbf24' : 'none') + '"'
            + ' stroke="' + (on ? '#fbbf24' : '#d1d5db') + '"'
            + ' stroke-width="1.5" aria-hidden="true">'
            + '<polygon ' + STAR_PATH + '/></svg>';
    }

    function updateStarPicker(hover) {
        var active = hover || selectedStars;
        starBtns.forEach(function (btn, i) { btn.innerHTML = buildStarSvg(i < active); });
    }

    starBtns.forEach(function (btn, i) {
        btn.addEventListener('mouseenter', function () { updateStarPicker(i + 1); });
        btn.addEventListener('mouseleave', function () { updateStarPicker(0); });
        btn.addEventListener('click',      function () {
            selectedStars = i + 1;
            if (starsInput) starsInput.value = selectedStars;
            updateStarPicker(0);
        });
    });
    updateStarPicker(0);

    function closeDialog() {
        if (!dialog) return;
        dialog.classList.add('is-closing');
        var done = false;
        function finish() {
            if (done) return;
            done = true;
            dialog.classList.remove('is-closing');
            dialog.close();
            if (form) form.reset();
            selectedStars = 0;
            updateStarPicker(0);
            if (starsInput) starsInput.value = 0;
        }
        dialog.addEventListener('animationend', function handler() {
            dialog.removeEventListener('animationend', handler);
            finish();
        });
        setTimeout(finish, 400);
    }

    if (openBtn) openBtn.addEventListener('click', function () {
        selectedStars = 0; updateStarPicker(0);
        if (starsInput) starsInput.value = 0;
        if (form) form.reset();
        if (dialog) dialog.showModal();
    });
    if (closeBtn) closeBtn.addEventListener('click', closeDialog);
    if (dialog)   dialog.addEventListener('click', function (e) {
        var rect = dialog.getBoundingClientRect();
        if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) closeDialog();
    });
    if (form) form.addEventListener('submit', function (e) { e.preventDefault(); closeDialog(); });
})();
