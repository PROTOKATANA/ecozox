/* ========================================
   Shipping Widget — Dynamic Delivery Date
   Calculates today + 4 days and renders it
   in the current i18n locale.
   ======================================== */

(function () {
    var el = document.getElementById('dynamic-delivery-date');
    if (!el) return;

    function renderDate() {
        var delivery = new Date();
        delivery.setDate(delivery.getDate() + 4);
        var locale = (window.EcoI18n && window.EcoI18n.getDateLocale)
            ? window.EcoI18n.getDateLocale()
            : 'es-ES';
        el.textContent = new Intl.DateTimeFormat(locale, {
            weekday: 'long',
            day:     'numeric',
            month:   'long'
        }).format(delivery);
    }

    renderDate();

    window.EcoShippingWidget = { update: renderDate };
})();
