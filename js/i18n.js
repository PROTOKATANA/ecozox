/* ========================================
   i18n — Internacionalización (Diccionario JS)
   Traduce textos al vuelo usando data-i18n
   Exposes window.EcoI18n API
   ======================================== */

(function () {
    const STORAGE_KEY = 'ecozox_lang';
    const SUPPORTED_LANGS = ['es', 'en'];
    const DEFAULT_LANG = 'es';

    /* ---------- Configuración de moneda por idioma ---------- */
    const currencyConfig = {
        es: { symbol: '€', rate: 0.92, locale: 'es-ES', position: 'after', decimals: ',', thousands: '.' },
        en: { symbol: '$', rate: 1,    locale: 'en-US', position: 'before', decimals: '.', thousands: ',' }
    };

    /* ---------- Diccionario de traducciones ---------- */
    const translations = {
        es: {
            // Header
            nav_contact: 'Contacto',
            cart_alt: 'Carrito',

            // Hero (index.html)
            hero_title: 'Colección Esencial 2026',
            hero_subtitle: 'Descubre nuestra nueva línea de productos minimalistas diseñados para el día a día. Simplicidad, funcionalidad y elegancia.',

            // Product cards
            btn_add_to_cart: 'Añadir al carrito',
            btn_added: '¡Añadido!',
            btn_buy_now: 'Comprar ahora',

            // Product detail (producto.html)
            product_silence_title: 'Auriculares Silence Pro',
            product_silence_desc: 'Experimenta un sonido envolvente con cancelación de ruido activa de última generación. Diseño ergonómico y minimalista que garantiza comodidad durante horas. Batería de larga duración con carga rápida. El compañero perfecto para tu música, trabajo y viajes.',
            quantity_label: 'Cantidad:',
            aria_decrease: 'Disminuir cantidad',
            aria_increase: 'Aumentar cantidad',
            aria_quantity: 'Cantidad',

            // Cart page (carrito.html)
            cart_title: 'Tu Carrito de Compra',
            cart_empty: 'Tu carrito está vacío.',
            cart_view_products: 'Ver productos',
            cart_summary_title: 'Resumen del Pedido',
            cart_subtotal: 'Subtotal',
            cart_shipping: 'Envío',
            cart_shipping_free: 'Gratis',
            cart_tax: 'Impuestos estimados',
            cart_total: 'Total',
            cart_checkout: 'Proceder al pago',
            cart_checkout_toast: 'Iniciando proceso de pago...',
            btn_remove: 'Eliminar',

            // Contact page (contacto.html)
            contact_title: 'REEMBOLSO',
            contact_name_label: 'Nombre completo',
            contact_name_placeholder: 'Ej. Ana García',
            contact_email_label: 'Correo electrónico',
            contact_email_placeholder: 'tu@email.com',
            contact_phone_label: 'Teléfono',
            contact_phone_placeholder: '+34 600 000 000',
            contact_message_label: 'Mensaje o motivo de devolución',
            contact_message_placeholder: 'Describe el problema con tu pedido o tu consulta para que podamos ayudarte...',
            contact_submit: 'Enviar Solicitud',
            contact_toast: 'Solicitud enviada. Nos pondremos en contacto contigo en breve.',
            trust_title: 'Tu tranquilidad es lo primero',
            trust_desc: 'Sabemos que comprar online requiere confianza. Si tu producto no cumple con tus expectativas o tiene algún defecto, no te preocupes. Hemos diseñado un proceso de devolución enfocado en tu comodidad.',
            trust_feature_1: 'Flexibles opciones de devolución (Return options) hasta 30 días después de recibir tu pedido.',
            trust_feature_2: 'Proceso fácil y sin complicaciones: reembolso garantizado en 48h tras la validación.',
            trust_feature_3: 'Atención al cliente humana para guiarte en cada paso.',

            // Footer
            footer_tagline: 'Simplicidad, funcionalidad y elegancia para el día a día.',
            footer_legal_title: 'Enlaces Legales',
            footer_terms: 'Términos y Condiciones',
            footer_privacy: 'Política de Privacidad',
            footer_shipping: 'Envíos y Devoluciones',
            footer_support_title: 'Soporte',
            footer_email_label: 'Email:',
            footer_phone_label: 'Teléfono:',
            footer_copyright: '&copy; 2026 Ecozox. Todos los derechos reservados.',

            // Product names (for product cards)
            product_reloj: 'Reloj Classic Mono',
            product_auriculares: 'Auriculares Silence Pro',
            product_zapatillas: 'Zapatillas Urban Walk',
            product_camara: 'Cámara Retro Lens',
            product_mochila: 'Mochila Canvas Explorer',
            product_tazas: 'Set Tazas Matte',

            // Page titles
            title_home: 'EcoZox - Tienda Minimalista',
            title_cart: 'Tu Carrito - EcoZox',
            title_product: 'Auriculares Silence Pro - EcoZox',
            title_contact: 'Contacto y Reembolsos - EcoZox'
        },
        en: {
            // Header
            nav_contact: 'Contact',
            cart_alt: 'Cart',

            // Hero (index.html)
            hero_title: 'Essential Collection 2026',
            hero_subtitle: 'Discover our new line of minimalist products designed for everyday life. Simplicity, functionality and elegance.',

            // Product cards
            btn_add_to_cart: 'Add to cart',
            btn_added: 'Added!',
            btn_buy_now: 'Buy now',

            // Product detail (producto.html)
            product_silence_title: 'Silence Pro Headphones',
            product_silence_desc: 'Experience immersive sound with cutting-edge active noise cancellation. Ergonomic and minimalist design that ensures comfort for hours. Long-lasting battery with fast charging. The perfect companion for your music, work and travel.',
            quantity_label: 'Quantity:',
            aria_decrease: 'Decrease quantity',
            aria_increase: 'Increase quantity',
            aria_quantity: 'Quantity',

            // Cart page (carrito.html)
            cart_title: 'Your Shopping Cart',
            cart_empty: 'Your cart is empty.',
            cart_view_products: 'Browse products',
            cart_summary_title: 'Order Summary',
            cart_subtotal: 'Subtotal',
            cart_shipping: 'Shipping',
            cart_shipping_free: 'Free',
            cart_tax: 'Estimated tax',
            cart_total: 'Total',
            cart_checkout: 'Proceed to checkout',
            cart_checkout_toast: 'Starting checkout process...',
            btn_remove: 'Remove',

            // Contact page (contacto.html)
            contact_title: 'REFUND',
            contact_name_label: 'Full name',
            contact_name_placeholder: 'e.g. John Smith',
            contact_email_label: 'Email address',
            contact_email_placeholder: 'you@email.com',
            contact_phone_label: 'Phone',
            contact_phone_placeholder: '+1 555 000 0000',
            contact_message_label: 'Message or reason for return',
            contact_message_placeholder: 'Describe the problem with your order or your inquiry so we can help you...',
            contact_submit: 'Submit Request',
            contact_toast: 'Request submitted. We will get in touch with you shortly.',
            trust_title: 'Your peace of mind comes first',
            trust_desc: 'We know that buying online requires trust. If your product does not meet your expectations or has a defect, don\'t worry. We have designed a return process focused on your convenience.',
            trust_feature_1: 'Flexible return options up to 30 days after receiving your order.',
            trust_feature_2: 'Easy and hassle-free process: refund guaranteed within 48h after validation.',
            trust_feature_3: 'Human customer support to guide you every step of the way.',

            // Footer
            footer_tagline: 'Simplicity, functionality and elegance for everyday life.',
            footer_legal_title: 'Legal Links',
            footer_terms: 'Terms & Conditions',
            footer_privacy: 'Privacy Policy',
            footer_shipping: 'Shipping & Returns',
            footer_support_title: 'Support',
            footer_email_label: 'Email:',
            footer_phone_label: 'Phone:',
            footer_copyright: '&copy; 2026 Ecozox. All rights reserved.',

            // Product names (for product cards)
            product_reloj: 'Classic Mono Watch',
            product_auriculares: 'Silence Pro Headphones',
            product_zapatillas: 'Urban Walk Sneakers',
            product_camara: 'Retro Lens Camera',
            product_mochila: 'Canvas Explorer Backpack',
            product_tazas: 'Matte Mug Set',

            // Page titles
            title_home: 'EcoZox - Minimalist Store',
            title_cart: 'Your Cart - EcoZox',
            title_product: 'Silence Pro Headphones - EcoZox',
            title_contact: 'Contact & Refunds - EcoZox'
        }
    };

    /* ---------- Detectar idioma ---------- */
    function detectLang() {
        // 1. localStorage
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored && SUPPORTED_LANGS.includes(stored)) return stored;

        // 2. navigator.language (ej: "es-ES" → "es", "en-US" → "en")
        const browserLang = (navigator.language || '').split('-')[0].toLowerCase();
        if (SUPPORTED_LANGS.includes(browserLang)) return browserLang;

        // 3. Fallback
        return DEFAULT_LANG;
    }

    let currentLang = detectLang();

    /* ---------- API pública ---------- */
    function getLang() {
        return currentLang;
    }

    function setLang(lang) {
        if (!SUPPORTED_LANGS.includes(lang)) return;
        currentLang = lang;
        localStorage.setItem(STORAGE_KEY, lang);
        document.documentElement.lang = lang;
        applyTranslations();
        applyPrices();
        updateLangSelector();

        // Re-render cart page if we're on it
        if (window.EcoCartRenderer) {
            window.EcoCartRenderer.renderCart();
        }
    }

    function t(key) {
        return (translations[currentLang] && translations[currentLang][key]) || key;
    }

    /* ---------- Formateo de precios con conversión de moneda ---------- */
    function formatPrice(amountUSD) {
        const config = currencyConfig[currentLang];
        const converted = amountUSD * config.rate;

        // Usar Intl.NumberFormat para formateo nativo
        const formatted = new Intl.NumberFormat(config.locale, {
            style: 'currency',
            currency: config.position === 'after' ? 'EUR' : 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(converted);

        return formatted;
    }

    /* ---------- Aplicar traducciones al DOM ---------- */
    function applyTranslations() {
        // Textos internos (textContent / innerHTML)
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const value = t(key);
            if (value !== key) {
                el.innerHTML = value;
            }
        });

        // Placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            const value = t(key);
            if (value !== key) {
                el.placeholder = value;
            }
        });

        // aria-labels
        document.querySelectorAll('[data-i18n-aria]').forEach(el => {
            const key = el.getAttribute('data-i18n-aria');
            const value = t(key);
            if (value !== key) {
                el.setAttribute('aria-label', value);
            }
        });

        // alt texts
        document.querySelectorAll('[data-i18n-alt]').forEach(el => {
            const key = el.getAttribute('data-i18n-alt');
            const value = t(key);
            if (value !== key) {
                el.alt = value;
            }
        });

        // Page title
        const titleKey = document.documentElement.getAttribute('data-i18n-title');
        if (titleKey) {
            document.title = t(titleKey);
        }
    }

    /* ---------- Aplicar precios convertidos ---------- */
    function applyPrices() {
        document.querySelectorAll('[data-i18n-price]').forEach(el => {
            const usdPrice = parseFloat(el.getAttribute('data-i18n-price'));
            if (!isNaN(usdPrice)) {
                el.textContent = formatPrice(usdPrice);
            }
        });
    }

    /* ---------- Actualizar selector de idioma ---------- */
    function updateLangSelector() {
        document.querySelectorAll('.lang-option').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === currentLang);
        });
        // Sync the toggle label
        const codeEl = document.querySelector('.lang-current-code');
        if (codeEl) codeEl.textContent = currentLang.toUpperCase();
    }

    /* ---------- Inicializar ---------- */
    document.documentElement.lang = currentLang;

    // Aplicar traducciones cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            applyTranslations();
            applyPrices();
            updateLangSelector();
        });
    } else {
        // DOM ya está listo (script cargado dinámicamente)
        applyTranslations();
        applyPrices();
        updateLangSelector();
    }

    /* ---------- Exponer API global ---------- */
    window.EcoI18n = {
        getLang: getLang,
        setLang: setLang,
        t: t,
        formatPrice: formatPrice,
        applyTranslations: applyTranslations,
        applyPrices: applyPrices
    };
})();
