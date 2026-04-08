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
        
        // Attach click handlers to all video cards
        document.querySelectorAll('.product-video-card').forEach(function (card) {
            const video = card.querySelector('video');
            if (video) {
                card.style.cursor = 'pointer';
                card.setAttribute('role', 'button');
                card.setAttribute('tabindex', '0');
                card.setAttribute('aria-label', 'Abrir video');
                
                // Remove old fullscreen behavior
                card.onclick = null;
                
                card.addEventListener('click', function () {
                    const source = video.querySelector('source');
                    const videoSrc = source ? source.src : video.src;
                    showLightbox(videoSrc);
                });
                
                card.addEventListener('keydown', function (e) {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        const source = video.querySelector('source');
                        const videoSrc = source ? source.src : video.src;
                        showLightbox(videoSrc);
                    }
                });
            }
        });
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initVideoLightbox);
    } else {
        initVideoLightbox();
    }
})();