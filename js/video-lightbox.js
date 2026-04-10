/* ========================================
   Video Lightbox Dialog
   Custom dialog to play videos without fullscreen
   ======================================== */

(function () {
    function initVideoLightbox() {
        // Check if lightbox already exists
        if (document.getElementById('video-lightbox')) return;
        
        // Create lightbox container
        const lightbox = document.createElement('div');
        lightbox.id = 'video-lightbox';
        lightbox.className = 'video-lightbox-overlay';
        lightbox.setAttribute('hidden', '');
        lightbox.setAttribute('role', 'dialog');
        lightbox.setAttribute('aria-modal', 'true');
        lightbox.setAttribute('aria-label', 'Video dialog');
        
        lightbox.innerHTML = `
            <button class="video-lightbox-close" aria-label="Cerrar">✕</button>
            <div class="video-lightbox-content">
                <video controls class="video-lightbox-player" playsinline></video>
            </div>
        `;
        
        document.body.appendChild(lightbox);
        
        const closeBtn = lightbox.querySelector('.video-lightbox-close');
        const player = lightbox.querySelector('.video-lightbox-player');
        
        // Close on button click
        closeBtn.addEventListener('click', function () {
            hideLightbox();
        });
        
        // Close on background click
        lightbox.addEventListener('click', function (e) {
            if (e.target === lightbox) {
                hideLightbox();
            }
        });
        
        // Close on Escape key
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && !lightbox.hasAttribute('hidden')) {
                hideLightbox();
            }
        });
        
        function showLightbox(videoSrc) {
            player.src = videoSrc;
            lightbox.removeAttribute('hidden');
            player.play();
            document.body.style.overflow = 'hidden';
        }
        
        function hideLightbox() {
            lightbox.setAttribute('hidden', '');
            player.pause();
            player.src = '';
            document.body.style.overflow = '';
        }
        
        // Event delegation — funciona con tarjetas añadidas dinámicamente
        document.addEventListener('click', function (e) {
            var card = e.target.closest('.product-video-card');
            if (!card) return;
            var video = card.querySelector('video');
            if (!video) return;
            var source = video.querySelector('source');
            showLightbox(source ? source.src : video.src);
        });

        document.addEventListener('keydown', function (e) {
            if (e.key !== 'Enter' && e.key !== ' ') return;
            var card = e.target.closest('.product-video-card');
            if (!card) return;
            e.preventDefault();
            var video = card.querySelector('video');
            if (!video) return;
            var source = video.querySelector('source');
            showLightbox(source ? source.src : video.src);
        });
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initVideoLightbox);
    } else {
        initVideoLightbox();
    }
})();