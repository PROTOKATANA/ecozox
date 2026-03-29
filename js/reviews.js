/* ========================================
   Product Reviews
   Mock data + render + dialog logic
   ======================================== */

(function () {
    const grid = document.getElementById('reviews-grid');
    if (!grid) return;

    /* ---- Mock Data ---- */
    const REVIEWS = [
        {
            id: 1,
            name: 'María García',
            stars: 5,
            date: '2025-11-14',
            title: 'Increíble calidad de sonido',
            body: 'Llevaba meses buscando unos auriculares que se adaptaran bien y estos superaron todas mis expectativas. El sonido es cristalino y la cancelación de ruido es espectacular.',
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=200&h=200'
        },
        {
            id: 2,
            name: 'Carlos Martínez',
            stars: 5,
            date: '2025-10-22',
            title: 'Mi compra del año',
            body: 'Diseño minimalista y elegante, tal como lo describe la tienda. Son cómodos incluso después de 6 horas de uso continuo. La batería dura exactamente lo que prometen.',
            image: null
        },
        {
            id: 3,
            name: 'Sofía Rodríguez',
            stars: 5,
            date: '2025-10-05',
            title: 'Perfectos para trabajar desde casa',
            body: 'Los uso en videollamadas y la gente siempre me dice que se me escucha perfecto. El micrófono captura la voz con mucha precisión y el aislamiento es notable.',
            image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=200&h=200'
        },
        {
            id: 4,
            name: 'Andrés López',
            stars: 5,
            date: '2025-09-18',
            title: 'Superan a marcas de mayor precio',
            body: 'Venía de usar otra marca mucho más cara y la diferencia no justifica el coste. Estos EcoZox son superiores en comodidad y la cancelación de ruido activa es verdaderamente efectiva.',
            image: null
        },
        {
            id: 5,
            name: 'Laura Fernández',
            stars: 5,
            date: '2025-09-02',
            title: 'El regalo perfecto',
            body: 'Los compré para mi marido y quedó encantado. Llegaron en un packaging muy cuidado y el producto es exactamente como aparece en las fotos. Totalmente recomendados.',
            image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80&w=200&h=200'
        },
        {
            id: 6,
            name: 'Miguel Torres',
            stars: 5,
            date: '2025-08-11',
            title: 'Cómodos y duraderos',
            body: 'A los 3 meses de uso intenso siguen como el primer día. La almohadilla es muy suave y los materiales transmiten una solidez que no esperaba a este precio.',
            image: null
        },
        {
            id: 7,
            name: 'Elena Vázquez',
            stars: 4,
            date: '2025-07-29',
            title: 'Muy buenos, con un pequeño pero',
            body: 'La calidad de sonido y el diseño son excelentes. Le quito una estrella porque la app de acompañamiento podría ser más intuitiva. De resto, una compra muy recomendable.',
            image: 'https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?auto=format&fit=crop&q=80&w=200&h=200'
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
        return new Date(y, m - 1, d).toLocaleDateString('es-ES', {
            year: 'numeric', month: 'long', day: 'numeric'
        });
    }

    function getAverage() {
        const total = REVIEWS.reduce((acc, r) => acc + r.stars, 0);
        return (total / REVIEWS.length).toFixed(1);
    }

    /* ---- Render summary ---- */
    function renderSummary() {
        const avg = getAverage();
        const scoreEl = document.getElementById('reviews-summary-score');
        const starsEl = document.getElementById('reviews-summary-stars');
        const countEl = document.getElementById('reviews-summary-count');
        if (scoreEl) scoreEl.textContent = avg;
        if (starsEl) starsEl.innerHTML = renderStars(Math.round(parseFloat(avg)), 22);
        if (countEl) countEl.textContent = `${REVIEWS.length} reseñas`;
    }

    /* ---- Render list ---- */
    function renderReviews() {
        grid.innerHTML = REVIEWS.map(r => `
            <article class="review-card">
                <div class="review-card__header">
                    <div class="review-card__meta">
                        <div class="review-stars">${renderStars(r.stars)}</div>
                        <time class="review-date" datetime="${r.date}">${formatDate(r.date)}</time>
                    </div>
                    ${r.image ? `<img src="${r.image}" alt="Foto del producto por ${r.name}" class="review-image" loading="lazy">` : ''}
                </div>
                <h4 class="review-title">${r.title}</h4>
                <p class="review-body">${r.body}</p>
                <p class="review-author">— ${r.name}</p>
            </article>`
        ).join('');
    }

    renderSummary();
    renderReviews();

    /* ---- Modal ---- */
    const dialog   = document.getElementById('review-dialog');
    const openBtn  = document.getElementById('openReviewDialog');
    const closeBtn = document.getElementById('reviewDialogClose');
    const cancelBtn = document.getElementById('reviewCancelBtn');
    const form     = document.getElementById('review-form');
    const starBtns = document.querySelectorAll('.star-picker__btn');
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
        starBtns.forEach((btn, i) => {
            btn.innerHTML = buildStarSvg(i < active);
        });
    }

    starBtns.forEach((btn, i) => {
        btn.addEventListener('mouseenter', () => updateStarPicker(i + 1));
        btn.addEventListener('mouseleave', () => updateStarPicker(0));
        btn.addEventListener('click', () => {
            selectedStars = i + 1;
            if (starsInput) starsInput.value = selectedStars;
            updateStarPicker(0);
        });
    });

    updateStarPicker(0);

    /* Open */
    openBtn?.addEventListener('click', () => {
        selectedStars = 0;
        updateStarPicker(0);
        if (starsInput) starsInput.value = 0;
        form?.reset();
        dialog?.showModal();
    });

    /* Close */
    function closeDialog() { dialog?.close(); }
    closeBtn?.addEventListener('click', closeDialog);
    cancelBtn?.addEventListener('click', closeDialog);

    /* Click outside */
    dialog?.addEventListener('click', e => {
        const rect = dialog.getBoundingClientRect();
        if (e.clientX < rect.left || e.clientX > rect.right ||
            e.clientY < rect.top  || e.clientY > rect.bottom) {
            closeDialog();
        }
    });

    /* Submit (demo frontend only) */
    form?.addEventListener('submit', e => {
        e.preventDefault();
        closeDialog();
    });
})();
