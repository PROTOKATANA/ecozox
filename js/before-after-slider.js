/* ========================================
   Gallery Viewer — Multi-type
   Soporta: video | imagen normal | ba-slider
   Si los thumbnails no tienen data-type,
   funciona en modo ba-slider clásico.
   ======================================== */

(function () {
    'use strict';

    var slider     = document.getElementById('baSlider');
    if (!slider) return;

    var thumbnails  = document.querySelectorAll('.thumbnail');
    if (thumbnails.length === 0) return;

    var beforeImg   = document.getElementById('baBeforeImg');
    var afterImg    = document.getElementById('baAfterImg');
    var divider     = document.getElementById('baDivider');
    var galleryVideo = document.getElementById('galleryVideo');
    var galleryImage = document.getElementById('galleryImage');

    var isMultiType = !!thumbnails[0].dataset.type;

    var dragging = false;

    // ── BA Slider: posición ──────────────────────────────────────
    function setPos(clientX) {
        var rect = slider.getBoundingClientRect();
        var p = ((clientX - rect.left) / rect.width) * 100;
        p = Math.max(2, Math.min(98, p));
        slider.style.setProperty('--ba-pos', p + '%');
    }

    function resetPos() {
        slider.style.setProperty('--ba-pos', '65%');
    }

    // ── BA Slider: drag ──────────────────────────────────────────
    if (divider) {
        divider.addEventListener('mousedown', function (e) {
            e.preventDefault();
            dragging = true;
        });
        document.addEventListener('mousemove', function (e) {
            if (!dragging) return;
            setPos(e.clientX);
        });
        document.addEventListener('mouseup', function () { dragging = false; });

        slider.addEventListener('click', function (e) {
            if (divider.contains(e.target)) return;
            setPos(e.clientX);
        });

        divider.addEventListener('touchstart', function (e) {
            e.preventDefault();
            dragging = true;
        }, { passive: false });
        document.addEventListener('touchmove', function (e) {
            if (!dragging) return;
            setPos(e.touches[0].clientX);
        }, { passive: true });
        document.addEventListener('touchend', function () { dragging = false; });
    }

    // ── Image preload cache ──────────────────────────────────────
    var _imgCache = {};
    function preload(url) {
        if (url && !_imgCache[url]) {
            var img = new Image();
            img.src = url;
            _imgCache[url] = img;
        }
    }
    thumbnails.forEach(function (t) {
        preload(t.dataset.src);
        preload(t.dataset.beforeSrc);
        preload(t.dataset.afterSrc);
        preload(t.dataset.fullSrc);
    });

    // ── Show/hide viewers ────────────────────────────────────────
    function showViewer(type) {
        if (galleryVideo) galleryVideo.style.display = type === 'video'     ? 'block' : 'none';
        if (galleryImage) galleryImage.style.display = type === 'image'     ? 'block' : 'none';
        slider.style.display                         = type === 'ba-slider' ? 'block' : 'none';

        if (type !== 'video' && galleryVideo) {
            galleryVideo.pause();
        }
    }

    // ── Activate ─────────────────────────────────────────────────
    function activate(thumb) {
        var type = thumb.dataset.type || 'ba-slider';

        if (isMultiType) {
            showViewer(type);
        }

        if (type === 'video') {
            if (galleryVideo) {
                galleryVideo.src = thumb.dataset.src;
                galleryVideo.load();
                galleryVideo.play();
            }
        } else if (type === 'image') {
            if (galleryImage) galleryImage.src = thumb.dataset.src;
        } else {
            // ba-slider (multi-type o modo clásico)
            var afterSrc  = thumb.dataset.afterSrc  || thumb.dataset.fullSrc;
            var beforeSrc = thumb.dataset.beforeSrc;
            if (afterImg  && afterSrc)  afterImg.src  = afterSrc;
            if (beforeImg && beforeSrc) beforeImg.src = beforeSrc;
            resetPos();
        }

        thumbnails.forEach(function (t) { t.classList.remove('active'); });
        thumb.classList.add('active');
    }

    // ── Drag-to-scroll en gallery-thumbnails (escritorio) ────────
    var strip = document.querySelector('.gallery-thumbnails');
    if (strip) {
        var isDragging  = false;
        var dragStartX  = 0;
        var scrollStart = 0;
        var dragMoved   = false;

        strip.addEventListener('mousedown', function (e) {
            isDragging  = true;
            dragMoved   = false;
            dragStartX  = e.clientX;
            scrollStart = strip.scrollLeft;
            strip.style.cursor = 'grabbing';
            e.preventDefault();
        });

        document.addEventListener('mousemove', function (e) {
            if (!isDragging) return;
            var delta = e.clientX - dragStartX;
            if (Math.abs(delta) > 4) dragMoved = true;
            strip.scrollLeft = scrollStart - delta;
        });

        document.addEventListener('mouseup', function () {
            if (!isDragging) return;
            isDragging = false;
            strip.style.cursor = '';
        });

        // Evita activar el thumbnail si el gesto fue un arrastre
        strip.addEventListener('click', function (e) {
            if (dragMoved) {
                e.stopPropagation();
                dragMoved = false;
            }
        }, true);
    }

    // ── Wire events ──────────────────────────────────────────────
    thumbnails.forEach(function (thumb) {
        thumb.addEventListener('click', function () { activate(thumb); });
        thumb.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                activate(thumb);
            }
        });
    });

    // ── Primer fotograma en thumbnails de vídeo ─────────────────
    // Busca vídeos dentro de thumbnails y los lleva al frame 0
    // para que el navegador pinte el primer fotograma en lugar de negro.
    thumbnails.forEach(function (thumb) {
        var tv = thumb.querySelector('video');
        if (!tv) return;
        tv.addEventListener('loadedmetadata', function () {
            tv.currentTime = 0.001;
        });
    });

    // ── Init: activa el primer thumbnail ────────────────────────
    activate(thumbnails[0]);

})();
