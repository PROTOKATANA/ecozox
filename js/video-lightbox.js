/* ========================================
   Video Lightbox
   Click en tarjeta de vídeo → overlay fullscreen
   ======================================== */

(function () {
    /* ── Crear overlay ── */
    const overlay = document.createElement('div');
    overlay.id        = 'videoLightbox';
    overlay.className = 'lightbox-overlay';
    overlay.setAttribute('hidden', '');
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Vídeo en pantalla completa');
    overlay.innerHTML = `
        <button class="lightbox-close" id="videoLightboxClose" aria-label="Cerrar">&#x2715;</button>
        <video class="vlb__video" id="videoLightboxPlayer"
               controls autoplay playsinline
               style="max-width:90vw;max-height:90vh;border-radius:8px;display:block;">
        </video>
    `;
    document.body.appendChild(overlay);

    const player = document.getElementById('videoLightboxPlayer');
    const closeBtn = document.getElementById('videoLightboxClose');

    function open(src) {
        player.src = src;
        player.play();
        overlay.removeAttribute('hidden');
        document.body.style.overflow = 'hidden';
    }

    function close() {
        player.pause();
        player.src = '';
        overlay.setAttribute('hidden', '');
        document.body.style.overflow = '';
    }

    /* ── Eventos de cierre ── */
    closeBtn.addEventListener('click', close);

    overlay.addEventListener('click', function (e) {
        if (e.target === overlay) close();
    });

    document.addEventListener('keydown', function (e) {
        if (!overlay.hasAttribute('hidden') && e.key === 'Escape') close();
    });

    /* ── Click en cada tarjeta de vídeo ── */
    document.querySelectorAll('.product-video-card').forEach(function (card) {
        card.style.cursor = 'pointer';
        card.addEventListener('click', function () {
            const src = card.querySelector('video')?.src;
            if (!src) return;

            open(src);

            /* Solicitar pantalla completa nativa tras iniciar reproducción */
            player.addEventListener('loadedmetadata', function onReady() {
                player.removeEventListener('loadedmetadata', onReady);
                const req = player.requestFullscreen
                    || player.webkitRequestFullscreen
                    || player.mozRequestFullScreen;
                if (req) req.call(player);
            }, { once: true });
        });
    });

    /* Cerrar el lightbox al salir de pantalla completa */
    document.addEventListener('fullscreenchange', function () {
        if (!document.fullscreenElement) close();
    });
    document.addEventListener('webkitfullscreenchange', function () {
        if (!document.webkitFullscreenElement) close();
    });
})();
