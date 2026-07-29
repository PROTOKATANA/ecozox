/* ========================================
   Live Viewers — "X personas viendo esto
   ahora mismo".

   El número es una función pura del reloj
   (suma de ondas seno con periodos y fases
   fijas), NO de Math.random() ni de
   localStorage. Así, en el mismo instante,
   cualquier navegador o recarga calcula
   exactamente el mismo valor — sin backend,
   sin llamadas de red y sin depender de
   cuándo entró cada visitante a la página.
   El cambio sigue siendo gradual porque cada
   onda es continua por naturaleza (nunca hay
   saltos bruscos de un tick a otro).
   ======================================== */
(function () {
    'use strict';

    var el = document.getElementById('live-viewers-count');
    if (!el) return;

    var MIN = 107;
    var MAX = 980;

    // Periodos (segundos) y fases fijas, sin relación entera entre sí,
    // para que la curva combinada no se sienta repetitiva. Periodos más
    // largos = cambio más lento entre ticks (ritmo equivalente a bajar
    // el paso máximo de ~12 a ~9 unidades por tick).
    var WAVES = [
        { period: 449, phase: 0.6 },
        { period: 815, phase: 3.2 },
        { period: 257, phase: 5.1 }
    ];

    function computeCount() {
        var t = Date.now() / 1000;
        var sum = 0;
        WAVES.forEach(function (w) {
            sum += Math.sin((t / w.period) * 2 * Math.PI + w.phase);
        });
        var norm = (sum / WAVES.length + 1) / 2; // 0..1
        return Math.round(MIN + norm * (MAX - MIN));
    }

    function render() {
        el.textContent = computeCount();
    }

    render();

    function tick() {
        render();
        setTimeout(tick, 3500 + Math.random() * 4000);
    }

    setTimeout(tick, 3500 + Math.random() * 4000);
})();
