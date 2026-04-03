/* ========================================
   Video Fullscreen — click en tarjeta para entrar
   La salida la gestiona el navegador nativamente
   ======================================== */

(function () {
    document.querySelectorAll('.product-video-card').forEach(function (card) {
        card.style.cursor = 'pointer';
        const video = card.querySelector('video');
        if (!video) return;

        /* El vídeo nunca se puede pausar */
        video.addEventListener('pause', function () {
            video.play();
        });

        card.addEventListener('click', function () {
            const isFullscreen = document.fullscreenElement
                || document.webkitFullscreenElement;
            if (isFullscreen) return;

            /* iOS usa webkitEnterFullscreen en el elemento video */
            if (video.webkitEnterFullscreen) {
                video.webkitEnterFullscreen();
            } else {
                const req = video.requestFullscreen || video.mozRequestFullScreen;
                if (req) req.call(video);
            }
        });
    });
})();
