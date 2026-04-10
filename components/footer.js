/* ========================================
   Footer Component
   Renders: wave divider + footer with links & payment icons
   Usage: <div data-component="footer" data-base="" data-pages-base="pages/"></div>
   ======================================== */

(function () {
    const el = document.querySelector('[data-component="footer"]');
    if (!el) return;

    const base       = el.dataset.base || '';
    const pagesBase  = el.dataset.pagesBase ?? 'pages/';
    const brand      = window.ECOZOX_BRAND || {};
    const brandNombre = brand.nombre || 'Ecozox';
    const brandEmail  = brand.email  || 'ecozox@support@gmail.com';

    el.outerHTML = `
    <!-- Separador de Onda para el Footer -->
    <div class="line-divider footer-wave"
         data-wave-width="56"
         data-wave-height="23"
         data-stroke-width="12"
         data-stroke-color="#374151"
          data-fill-top="#f7f4f0"
          data-fill-bottom="#111827">
    </div>

    <footer class="site-footer">
        <div class="container">

            <div class="footer-top">
                <a href="${base}contacto.html" class="footer-dev-btn" data-i18n="footer_returns">
                    Devoluciones
                </a>
                <div class="footer-col">
                    <h3 data-i18n="footer_legal_title">Enlaces Legales</h3>
                    <ul>
                        <li><a href="${pagesBase}terminos.html" data-i18n="footer_terms">Términos y Condiciones</a></li>
                        <li><a href="${pagesBase}privacidad.html" data-i18n="footer_privacy">Política de Privacidad</a></li>
                        <li><a href="${pagesBase}envios.html" data-i18n="footer_shipping">Envíos y Devoluciones</a></li>
                    </ul>
                </div>
                <div class="footer-col">
                    <h3 data-i18n="footer_support_title">Soporte</h3>
                    <ul>
                        <li><span class="text-muted" data-i18n="footer_email_label">Email:</span> <a href="mailto:${brandEmail}">${brandEmail}</a></li>
                        <li><span class="text-muted" data-i18n="footer_phone_label">Teléfono:</span> <a href="tel:+34912345678">+34 912 345 678</a></li>
                    </ul>
                </div>
            </div>
            <div class="footer-bottom">
                <p data-i18n="footer_copyright">&copy; 2026 ${brandNombre}. Todos los derechos reservados.</p>
                <div class="payment-icons">
                    <img src="${base}assets/mastercard.svg" alt="Mastercard" style="height: 32px; background: white; padding: 3px; border-radius: 4px;">
                    <img src="${base}assets/visa.svg" alt="Visa" style="height: 32px; background: white; padding: 1px; border-radius: 4px;">
                    <img src="${base}assets/google.svg" alt="Google-Pay" style="height: 32px; background: white; padding: 6px; border-radius: 4px;">
                    <img src="${base}assets/apple.svg" alt="Apple-Pay" style="height: 32px; background: white; padding: 6px; border-radius: 4px;">
                    <img src="${base}assets/paypal.svg" alt="PayPal" style="height: 32px; background: white; padding: 6px; border-radius: 4px;">
                    <img src="${base}assets/klarna.svg" alt="Klarna" style="height: 32px; background: #F4B6C7; padding: 7.5px; border-radius: 4px;">
                    <img src="${base}assets/stripe.svg" alt="Stripe" style="height: 32px; background: #6772E5; padding: 7px; border-radius: 4px;">
                </div>
            </div>
        </div>
    </footer>`;
})();
