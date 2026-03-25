document.addEventListener('DOMContentLoaded', () => {
    // --- Cart Logic ---
    let cartCount = 0;
    const cartCountElement = document.querySelector('.cart-count');
    const cartIconWrapper = document.querySelector('.cart-icon-wrapper');

    // Function to add item to cart and trigger animation
    window.addToCart = function(event) {
        if(event) {
            event.preventDefault(); // Prevent default link behavior if inside an anchor
            event.stopPropagation(); // Prevent triggering parent click events
        }
        
        cartCount++;
        updateCartUI();
        
        // Trigger bounce animation
        if (cartIconWrapper) {
            cartIconWrapper.classList.remove('animate-bounce');
            // Trigger reflow to restart animation
            void cartIconWrapper.offsetWidth;
            cartIconWrapper.classList.add('animate-bounce');
        }

        console.log(`Producto añadido. Total en carrito: ${cartCount}`);
        
        // Optional: Show a brief visual feedback on the button itself
        if (event && event.target) {
            const btn = event.target.closest('button');
            if (btn) {
                const originalText = btn.textContent;
                btn.textContent = '¡Añadido!';
                setTimeout(() => {
                    btn.textContent = originalText;
                }, 1000);
            }
        }
    };

    function updateCartUI() {
        if (cartCountElement) {
            cartCountElement.textContent = cartCount;
        }
    }

    // --- Product Gallery Logic (producto.html) ---
    const mainImage = document.getElementById('mainImage');
    const thumbnails = document.querySelectorAll('.thumbnail');

    if (mainImage && thumbnails.length > 0) {
        thumbnails.forEach(thumbnail => {
            thumbnail.addEventListener('click', function() {
                // Update main image source
                mainImage.src = this.src;
                
                // Update active state on thumbnails
                thumbnails.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }

    // --- Quantity Selector Logic (producto.html & carrito.html) ---
    const quantityControls = document.querySelectorAll('.quantity-controls');
    
    quantityControls.forEach(control => {
        const minusBtn = control.querySelector('.minus');
        const plusBtn = control.querySelector('.plus');
        const input = control.querySelector('.qty-input');

        if (minusBtn && plusBtn && input) {
            minusBtn.addEventListener('click', () => {
                let currentValue = parseInt(input.value) || 1;
                if (currentValue > 1) {
                    input.value = currentValue - 1;
                }
            });

            plusBtn.addEventListener('click', () => {
                let currentValue = parseInt(input.value) || 1;
                input.value = currentValue + 1;
            });

            // Prevent non-numeric input
            input.addEventListener('change', () => {
                let val = parseInt(input.value);
                if (isNaN(val) || val < 1) {
                    input.value = 1;
                }
            });
        }
    });

    // --- Cart Item Removal (carrito.html) ---
    const removeButtons = document.querySelectorAll('.btn-danger');
    removeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const cartItem = this.closest('.cart-item');
            if (cartItem) {
                cartItem.style.opacity = '0';
                setTimeout(() => {
                    cartItem.remove();
                    // In a real app, you would also update the total here
                }, 300);
            }
        });
    });


});