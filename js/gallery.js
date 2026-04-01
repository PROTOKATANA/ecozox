/* ========================================
   Product Gallery
   Main-image + thumbnail strip on product detail
   ======================================== */

(function () {
    const mainImage  = document.getElementById('mainImage');
    const thumbnails = document.querySelectorAll('.thumbnail');

    if (!mainImage || thumbnails.length === 0) return;

    function activate(thumbnail) {
        const fullSrc = thumbnail.dataset.fullSrc;
        if (fullSrc) mainImage.src = fullSrc;

        thumbnails.forEach(t => t.classList.remove('active'));
        thumbnail.classList.add('active');
    }

    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function () {
            activate(this);
        });

        thumbnail.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                activate(this);
            }
        });
    });
})();
