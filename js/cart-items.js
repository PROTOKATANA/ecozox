/* ========================================
   Cart Item Removal
   Fade-out animation + remove from DOM
   ======================================== */

(function () {
    const removeButtons = document.querySelectorAll('.btn-danger');

    removeButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            const cartItem = this.closest('.cart-item');
            if (cartItem) {
                cartItem.style.opacity = '0';
                setTimeout(() => { cartItem.remove(); }, 300);
            }
        });
    });
})();
