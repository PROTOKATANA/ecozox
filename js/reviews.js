/* ========================================
   Product Reviews
   Mock data + render + dialog + lightbox
   ======================================== */

(function () {
    const grid = document.getElementById('reviews-grid');
    if (!grid) return;

    /* ---- Mock Data ---- */
    /* Orden diseñado para el grid de 2 columnas:
       Fila 1: summary-card (estático) | #1 CON imágenes
       Fila 2: #2 CON imágenes         | #3 CON imágenes
       Fila 3: #4 solo texto           | #5 solo texto
       Fila 4: #6 CON imágenes         | #7 CON imágenes */
    const REVIEWS = [
        /* ── Fila 1, col 2 ── */
        {
            id: 1,
            name: 'María García',
            stars: 5,
            date: '2025-11-14',
            title: 'Increíble calidad de sonido',
            body: 'Llevaba meses buscando unos auriculares que se adaptaran bien y estos superaron todas mis expectativas. El sonido es cristalino y la cancelación de ruido es espectacular.',
            images: [
                'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600&h=600',
                'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=600&h=600',
            ]
        },
        /* ── Fila 2, col 1 ── */
        {
            id: 3,
            name: 'Sofía Rodríguez',
            stars: 5,
            date: '2025-10-05',
            title: 'Perfectos para trabajar desde casa',
            body: 'Los uso en videollamadas y la gente siempre me dice que se me escucha perfecto. El micrófono captura la voz con mucha precisión y el aislamiento es notable.',
            images: [
                'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=600&h=600',
                'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80&w=600&h=600',
                'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600&h=600',
            ]
        },
        /* ── Fila 2, col 2 ── */
        {
            id: 5,
            name: 'Laura Fernández',
            stars: 5,
            date: '2025-09-02',
            title: 'El regalo perfecto',
            body: 'Los compré para mi marido y quedó encantado. Llegaron en un packaging muy cuidado y el producto es exactamente como aparece en las fotos. Totalmente recomendados.',
            images: [
                'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80&w=600&h=600',
                'https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?auto=format&fit=crop&q=80&w=600&h=600',
                'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600&h=600',
            ]
        },
        /* ── Fila 3, col 1 — solo texto ── */
        {
            id: 2,
            name: 'Carlos Martínez',
            stars: 5,
            date: '2025-10-22',
            title: 'Mi compra del año',
            body: 'Diseño minimalista y elegante, tal como lo describe la tienda. Son cómodos incluso después de 6 horas de uso continuo. La batería dura exactamente lo que prometen.',
            images: []
        },
        /* ── Fila 3, col 2 — solo texto ── */
        {
            id: 4,
            name: 'Andrés López',
            stars: 5,
            date: '2025-09-18',
            title: 'Superan a marcas de mayor precio',
            body: 'Venía de usar otra marca mucho más cara y la diferencia no justifica el coste. Estos EcoZox son superiores en comodidad y la cancelación de ruido activa es verdaderamente efectiva.',
            images: []
        },
        /* ── Fila 4, col 1 ── */
        {
            id: 7,
            name: 'Elena Vázquez',
            stars: 4,
            date: '2025-07-29',
            title: 'Muy buenos, con un pequeño pero',
            body: 'La calidad de sonido y el diseño son excelentes. Le quito una estrella porque la app de acompañamiento podría ser más intuitiva. De resto, una compra muy recomendable.',
            images: [
                'https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?auto=format&fit=crop&q=80&w=600&h=600',
                'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600&h=600',
                'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=600&h=600',
            ]
        },
        /* ── Fila 4, col 2 ── */
        {
            id: 6,
            name: 'Miguel Torres',
            stars: 5,
            date: '2025-08-11',
            title: 'Cómodos y duraderos',
            body: 'A los 3 meses de uso intenso siguen como el primer día. La almohadilla es muy suave y los materiales transmiten una solidez que no esperaba a este precio.',
            images: [
                'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80&w=600&h=600',
                'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=600&h=600',
                'https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?auto=format&fit=crop&q=80&w=600&h=600',
            ]
        }
    ];

    /* ---- Helpers ---- */
    const STAR_PATH = 'points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26"';

    function renderStars(rating, size = 17) {
        return Array.from({ length: 5 }, (_, i) => {
            const on = i < rating;
            return `<svg width="${size}" height="${size}" viewBox="0 0 24 24"
                fill="${on ? '#fbbf24' : 'none'}"
                stroke="${on ? '#fbbf24' : '#d1d5db'}"
                stroke-width="1.5" aria-hidden="true">
                <polygon ${STAR_PATH}/>
            </svg>`;
        }).join('');
    }

    function formatDate(str) {
        const [y, m, d] = str.split('-').map(Number);
        const locale = (window.EcoI18n && window.EcoI18n.getDateLocale)
            ? window.EcoI18n.getDateLocale() : 'es-ES';
        return new Date(y, m - 1, d).toLocaleDateString(locale, {
            year: 'numeric', month: 'long', day: 'numeric'
        });
    }

    function getAverage() {
        const total = REVIEWS.reduce((acc, r) => acc + r.stars, 0);
        return (total / REVIEWS.length).toFixed(1);
    }

    /* ---- Render summary ---- */
    function renderSummary() {
        const avg      = getAverage();
        const scoreEl  = document.getElementById('reviews-summary-score');
        const starsEl  = document.getElementById('reviews-summary-stars');
        const countEl  = document.getElementById('reviews-summary-count');
        if (scoreEl) scoreEl.textContent = avg;
        if (starsEl) starsEl.innerHTML   = renderStars(Math.round(parseFloat(avg)), 22);
        const suffix = (window.EcoI18n && window.EcoI18n.t) ? window.EcoI18n.t('reviews_count_suffix') : 'reseñas';
        if (countEl) countEl.textContent = REVIEWS.length + ' ' + suffix;
    }

    /* ---- Render reviews ---- */
    function renderReviews() {
        grid.innerHTML = REVIEWS.map(r => {
            const thumbsBlock = r.images.length ? `
                <div class="review-card__divider"></div>
                <div class="review-thumbnails">
                    ${r.images.map((src, i) => `
                        <img src="${src}"
                             alt="Foto ${i + 1} por ${r.name}"
                             class="review-thumbnail"
                             data-index="${i}"
                             loading="lazy">
                    `).join('')}
                </div>` : '';

            return `
            <article class="review-card">
                <div class="review-card__top">
                    <div class="review-card__header">
                        <div class="review-stars">${renderStars(r.stars)}</div>
                        <time class="review-date" datetime="${r.date}">${formatDate(r.date)}</time>
                    </div>
                    <h4 class="review-title">${r.title}</h4>
                    <p class="review-body">${r.body}</p>
                </div>
                ${thumbsBlock}
                <div class="review-card__divider"></div>
                <p class="review-author">&bull; ${r.name}</p>
            </article>`;
        }).join('');
    }

    renderSummary();
    renderReviews();

    window.EcoReviews = {
        update: function () {
            renderSummary();
            renderReviews();
        }
    };

    /* ========================================
       Lightbox
       ======================================== */
    const lightbox = document.createElement('div');
    lightbox.id        = 'reviewLightbox';
    lightbox.className = 'lightbox-overlay';
    lightbox.setAttribute('hidden', '');
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.innerHTML = `
        <button class="lightbox-close" id="lightboxClose" aria-label="Cerrar">&#x2715;</button>
        <button class="lightbox-nav lightbox-prev" id="lightboxPrev" aria-label="Anterior">&#8249;</button>
        <img class="lightbox-img" id="lightboxImg" src="" alt="">
        <button class="lightbox-nav lightbox-next" id="lightboxNext" aria-label="Siguiente">&#8250;</button>
    `;
    document.body.appendChild(lightbox);

    const lbImg   = document.getElementById('lightboxImg');
    const lbClose = document.getElementById('lightboxClose');
    const lbPrev  = document.getElementById('lightboxPrev');
    const lbNext  = document.getElementById('lightboxNext');

    let lbImages = [];
    let lbIndex  = 0;

    function lbShow(images, index) {
        lbImages = images;
        lbIndex  = index;
        lbImg.src = lbImages[lbIndex];
        lbImg.alt = `Imagen ${lbIndex + 1} de ${lbImages.length}`;
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
        lbImg.alt = `Imagen ${lbIndex + 1} de ${lbImages.length}`;
    }

    /* Abrir al hacer clic en una miniatura (delegación desde el grid) */
    grid.addEventListener('click', function (e) {
        const thumb = e.target.closest('.review-thumbnail');
        if (!thumb) return;
        const container = thumb.closest('.review-thumbnails');
        const allThumbs = Array.from(container.querySelectorAll('.review-thumbnail'));
        const images    = allThumbs.map(img => img.src);
        lbShow(images, parseInt(thumb.dataset.index, 10));
    });

    /* Navegación botones */
    lbPrev.addEventListener('click', function (e) {
        e.stopPropagation();
        lbGoTo(lbIndex - 1);
    });
    lbNext.addEventListener('click', function (e) {
        e.stopPropagation();
        lbGoTo(lbIndex + 1);
    });

    /* Cerrar */
    lbClose.addEventListener('click', lbHide);

    lightbox.addEventListener('click', function (e) {
        if (e.target === lightbox) lbHide();
    });

    document.addEventListener('keydown', function (e) {
        if (lightbox.hasAttribute('hidden')) return;
        if (e.key === 'Escape')      lbHide();
        if (e.key === 'ArrowLeft')   lbGoTo(lbIndex - 1);
        if (e.key === 'ArrowRight')  lbGoTo(lbIndex + 1);
    });

    /* Swipe táctil */
    let touchStartX = 0;
    lbImg.addEventListener('touchstart', function (e) {
        touchStartX = e.touches[0].clientX;
    }, { passive: true });

    lbImg.addEventListener('touchend', function (e) {
        const diff = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(diff) < 40) return;   /* umbral mínimo: 40px */
        diff < 0 ? lbGoTo(lbIndex + 1) : lbGoTo(lbIndex - 1);
    });

    /* ========================================
       Review Dialog (form para escribir reseña)
       ======================================== */
    const dialog     = document.getElementById('review-dialog');
    const openBtn    = document.getElementById('openReviewDialog');
    const closeBtn   = document.getElementById('reviewDialogClose');
    const cancelBtn  = document.getElementById('reviewCancelBtn');
    const form       = document.getElementById('review-form');
    const starBtns   = document.querySelectorAll('.star-picker__btn');
    const starsInput = document.getElementById('reviewStarsInput');

    let selectedStars = 0;

    function buildStarSvg(on, size = 28) {
        return `<svg width="${size}" height="${size}" viewBox="0 0 24 24"
            fill="${on ? '#fbbf24' : 'none'}"
            stroke="${on ? '#fbbf24' : '#d1d5db'}"
            stroke-width="1.5" aria-hidden="true">
            <polygon ${STAR_PATH}/>
        </svg>`;
    }

    function updateStarPicker(hoverRating) {
        const active = hoverRating || selectedStars;
        starBtns.forEach(function (btn, i) {
            btn.innerHTML = buildStarSvg(i < active);
        });
    }

    starBtns.forEach(function (btn, i) {
        btn.addEventListener('mouseenter', function () { updateStarPicker(i + 1); });
        btn.addEventListener('mouseleave', function () { updateStarPicker(0); });
        btn.addEventListener('click', function () {
            selectedStars = i + 1;
            if (starsInput) starsInput.value = selectedStars;
            updateStarPicker(0);
        });
    });

    updateStarPicker(0);

    openBtn?.addEventListener('click', function () {
        selectedStars = 0;
        updateStarPicker(0);
        if (starsInput) starsInput.value = 0;
        form?.reset();
        dialog?.showModal();
    });

    function closeDialog() { dialog?.close(); }
    closeBtn?.addEventListener('click', closeDialog);
    cancelBtn?.addEventListener('click', closeDialog);

    dialog?.addEventListener('click', function (e) {
        const rect = dialog.getBoundingClientRect();
        if (e.clientX < rect.left || e.clientX > rect.right ||
            e.clientY < rect.top  || e.clientY > rect.bottom) {
            closeDialog();
        }
    });

    form?.addEventListener('submit', function (e) {
        e.preventDefault();
        closeDialog();
    });
})();
