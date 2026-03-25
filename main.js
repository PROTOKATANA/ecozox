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

    // --- Generador Dinámico de Ondas ---
    const dividers = document.querySelectorAll('.line-divider');
    dividers.forEach((divider, index) => {
        // Leer parámetros desde el HTML o usar valores por defecto
        const width = parseFloat(divider.dataset.waveWidth) || 50;   // Frecuencia (ancho de un ciclo)
        const height = parseFloat(divider.dataset.waveHeight) || 20; // Amplitud total de la onda
        const strokeWidth = parseFloat(divider.dataset.strokeWidth) || 10; // Grosor de la línea
        const strokeColor = divider.dataset.strokeColor || '#e5e7eb';      // Color de la línea
        const fillTop = divider.dataset.fillTop || 'transparent';          // Color de relleno superior
        const fillBottom = divider.dataset.fillBottom || 'transparent';    // Color de relleno inferior

        // Calcular el área de dibujo segura para que el grosor no se corte
        const svgHeight = height + (strokeWidth * 2);
        const midY = svgHeight / 2;
        const amplitudeY = height / 2;

        // Construir la ruta (path) de la línea de onda continua
        const pathLine = `
            M -${width} ${midY} 
            Q -${width * 0.75} ${midY - amplitudeY} -${width * 0.5} ${midY} 
            T 0 ${midY} 
            T ${width * 0.5} ${midY} 
            T ${width} ${midY} 
            T ${width * 1.5} ${midY}
            T ${width * 2} ${midY}
        `;

        // Construir rutas de relleno para eliminar la línea recta (seam) y sobre-dibujar para evitar anti-aliasing
        const pathFillTop = `${pathLine} L ${width * 2} -5 L -${width} -5 Z`;
        const pathFillBottom = `${pathLine} L ${width * 2} ${svgHeight + 5} L -${width} ${svgHeight + 5} Z`;

        // Inyectar el SVG dentro del contenedor
        divider.innerHTML = `
            <svg width="100%" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg" style="display: block;">
                <defs>
                    <pattern id="wave-pattern-${index}" x="0" y="0" width="${width}" height="${svgHeight}" patternUnits="userSpaceOnUse">
                        ${fillTop !== 'transparent' ? `<path d="${pathFillTop}" fill="${fillTop}" />` : ''}
                        ${fillBottom !== 'transparent' ? `<path d="${pathFillBottom}" fill="${fillBottom}" />` : ''}
                        <path d="${pathLine}" fill="none" stroke="${strokeColor}" stroke-width="${strokeWidth}" stroke-linecap="round" />
                    </pattern>
                </defs>
                <rect x="0" y="0" width="100%" height="100%" fill="url(#wave-pattern-${index})" />
            </svg>
        `;
        
        divider.style.height = `${svgHeight}px`;
    });
});