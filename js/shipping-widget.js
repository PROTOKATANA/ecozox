/* ========================================
   Shipping Widget — Dynamic Delivery Date
   Calcula fecha actual + 4 días y la inyecta
   en #dynamic-delivery-date
   ======================================== */

(function () {
    const el = document.getElementById('dynamic-delivery-date');
    if (!el) return;

    const delivery = new Date();
    delivery.setDate(delivery.getDate() + 4);

    el.textContent = new Intl.DateTimeFormat('es-ES', {
        weekday: 'long',
        day:     'numeric',
        month:   'long',
    }).format(delivery);
})();
