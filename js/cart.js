/* ========================================
   Cart Logic
   Manages cart count, animations & UI feedback
   ======================================== */

(function () {
    let cartCount = 0;
    const cartCountElements = document.querySelectorAll('.cart-count');
    const cartButton = document.querySelector('.cart-button');

    window.addToCart = function (event) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }

        cartCount++;
        cartCountElements.forEach(el => { el.textContent = cartCount; });

        if (cartButton) {
            cartButton.classList.remove('animate-bounce');
            void cartButton.offsetWidth;
            cartButton.classList.add('animate-bounce');
        }

        if (event && event.target) {
            const btn = event.target.closest('button');
            if (btn) {
                const originalText = btn.textContent;
                btn.textContent = '¡Añadido!';
                setTimeout(() => { btn.textContent = originalText; }, 1000);
            }
        }
    };
})();
