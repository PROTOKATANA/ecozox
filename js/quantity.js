/* ========================================
   Quantity Selector
   +/- controls for product & cart pages
   ======================================== */

(function () {
    const quantityControls = document.querySelectorAll('.quantity-controls');

    quantityControls.forEach(control => {
        const minusBtn = control.querySelector('.minus');
        const plusBtn = control.querySelector('.plus');
        const input = control.querySelector('.qty-input');

        if (!minusBtn || !plusBtn || !input) return;

        minusBtn.addEventListener('click', () => {
            let val = parseInt(input.value) || 1;
            if (val > 1) input.value = val - 1;
        });

        plusBtn.addEventListener('click', () => {
            let val = parseInt(input.value) || 1;
            input.value = val + 1;
        });

        input.addEventListener('change', () => {
            let val = parseInt(input.value);
            if (isNaN(val) || val < 1) input.value = 1;
        });
    });
})();
