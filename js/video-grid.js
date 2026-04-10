/* ========================================
   Video Grid — carga vídeos desde data.json
   del nicho actual y los renderiza en
   #product-videos-grid
   ======================================== */
(function () {
    var grid = document.getElementById('product-videos-grid');
    if (!grid) return;

    fetch('data.json')
        .then(function (res) {
            if (!res.ok) throw new Error('data.json no encontrado');
            return res.json();
        })
        .then(function (productos) {
            var producto = productos[0];
            if (!producto || !Array.isArray(producto.videos) || producto.videos.length === 0) return;

            var fragment = document.createDocumentFragment();

            producto.videos.forEach(function (src) {
                var card = document.createElement('div');
                card.className = 'product-video-card';
                card.setAttribute('role', 'button');
                card.setAttribute('tabindex', '0');
                card.setAttribute('aria-label', 'Abrir video');

                var video = document.createElement('video');
                video.src = src;
                video.autoplay = true;
                video.loop = true;
                video.muted = true;
                video.playsInline = true;

                card.appendChild(video);
                fragment.appendChild(card);
            });

            grid.appendChild(fragment);
        })
        .catch(function (err) {
            console.warn('video-grid:', err.message);
        });
})();
