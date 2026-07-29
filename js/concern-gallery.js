/* ========================================
   Concern Gallery
   1) Drag-to-scroll (ratón y táctil, vía
      Pointer Events) en las tiras horizontales
      de fotos antes/después, en loop infinito
   2) Lightbox de pantalla completa con
      navegación anterior/siguiente
   ======================================== */
(function () {
    'use strict';

    var strips = document.querySelectorAll('.concern-card__images');
    if (!strips.length) return;

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------- Tira de miniaturas: loop infinito en ambas direcciones ----------
       DOM final: [clon-antes][originales][clon-después]. Arranca centrada
       en el bloque de originales, con un set clonado de sobra a cada lado
       para poder arrastrar (ratón, dedo, scroll táctil nativo) o dejar
       correr el auto-scroll indefinidamente. En cuanto la posición se
       acerca a un extremo se recoloca en el bloque equivalente del otro
       lado — como los tres bloques son idénticos, el salto es invisible.
       Los clones se marcan data-clone para que no cuenten como fotos
       reales (lightbox, teclado). */
    strips.forEach(function (strip) {
        var originals = Array.prototype.slice.call(strip.children);
        /* Las miniaturas originales también traen loading="lazy" desde
           el HTML (pensado para scroll manual del usuario) — con el
           auto-scroll/clones las saca a la vista solo, así que se fuerza
           a decodificarlas ya mismo en vez de esperar a que el navegador
           las considere "cerca" del viewport. */
        originals.forEach(function (node) {
            var img = node.querySelector('img');
            if (img) img.loading = 'eager';
        });

        function makeClone(node) {
            var clone = node.cloneNode(true);
            clone.dataset.clone = 'true';
            clone.setAttribute('aria-hidden', 'true');
            clone.setAttribute('tabindex', '-1');
            /* loading="lazy" en el clon retrasaría su decodificación
               hasta que el navegador lo considere "cerca" del
               viewport — como es un contenedor con scroll horizontal
               propio, ese cálculo llega tarde y se nota como un
               pequeño tirón justo al cruzar hacia el set clonado. */
            var img = clone.querySelector('img');
            if (img) img.loading = 'eager';
            return clone;
        }

        var beforeClones = originals.map(makeClone);
        var afterClones  = originals.map(makeClone);
        strip.prepend.apply(strip, beforeClones);
        strip.append.apply(strip, afterClones);

        /* oneSetWidth = ancho real de un set completo, medido como
           distancia entre el mismo punto (inicio de set) en dos sets
           consecutivos — NO scrollWidth/3: con miniaturas + gaps ese
           cálculo por huecos queda desfasado unos px.
           getBoundingClientRect().left (no offsetLeft) porque devuelve
           valores con precisión de subpíxel: con flex-basis en % el
           navegador puede redondear el ancho de cada miniatura de forma
           distinta según el set, y offsetLeft (entero, redondeado) se
           comía esa fracción — quedaba un desfase real de 1-2px que se
           veía como salto al envolver. Restar ambos .left cancela
           además cualquier offset común (scroll de la página, etc.), sin
           depender de qué elemento sea el offsetParent. */
        var oneSetWidth = originals[0].getBoundingClientRect().left - beforeClones[0].getBoundingClientRect().left;

        strip.style.scrollSnapType = 'none';
        strip.scrollLeft = oneSetWidth; /* arranca en el bloque de originales */

        var isDown      = false;
        var pointerId   = null;
        var startX      = 0;
        var scrollStart = 0;
        var moved       = false;

        /* Envuelve un scrollLeft cualquiera al bloque central
           [oneSetWidth, 2*oneSetWidth) — como los tres bloques son
           idénticos, cualquier posición fuera de rango tiene un
           equivalente visualmente idéntico dentro de él. */
        function wrapToSafeZone(value) {
            if (oneSetWidth <= 0) return value;
            var rel = (value - oneSetWidth) % oneSetWidth;
            if (rel < 0) rel += oneSetWidth;
            return oneSetWidth + rel;
        }

        /* Arrastre (ratón y táctil unificados vía Pointer Events). El
           envolvido se calcula EN EL MISMO evento pointermove, no a
           través de un listener de 'scroll' aparte: si el recentrado
           llega vía 'scroll' este puede ir un frame por detrás de
           pointermove (el navegador agrupa/retrasa el evento scroll),
           así que unos cuantos movimientos de más se procesan con la
           posición todavía sin corregir y la corrección llega tarde —
           eso es justo el "salto" que se adelanta o se queda atrás.
           Calculándolo aquí mismo, la posición mostrada siempre es la
           correcta ya en el mismo frame, sin desfase. */
        strip.addEventListener('pointerdown', function (e) {
            if (e.pointerType === 'mouse' && e.button !== 0) return;
            isDown      = true;
            pointerId   = e.pointerId;
            moved       = false;
            startX      = e.clientX;
            scrollStart = strip.scrollLeft;
            strip.classList.add('is-dragging');
            strip.setPointerCapture(pointerId);
        });

        strip.addEventListener('pointermove', function (e) {
            if (!isDown || e.pointerId !== pointerId) return;
            var delta = e.clientX - startX;
            if (Math.abs(delta) > 4) moved = true;
            strip.scrollLeft = wrapToSafeZone(scrollStart - delta);
        });

        function endDrag(e) {
            if (!isDown || e.pointerId !== pointerId) return;
            isDown = false;
            strip.classList.remove('is-dragging');
        }
        strip.addEventListener('pointerup', endDrag);
        strip.addEventListener('pointercancel', endDrag);

        /* Evita abrir el lightbox si el gesto fue un arrastre */
        strip.addEventListener('click', function (e) {
            if (moved) {
                e.stopPropagation();
                e.preventDefault();
                moved = false;
            }
        }, true);

        /* Red de seguridad para cualquier otro origen de scroll que no
           pase por el arrastre de arriba (rueda del ratón, gesto de
           panorámica horizontal del trackpad, teclado, etc.): mismo
           envolvido, pero reactivo al evento 'scroll' porque ahí sí no
           hay una posición "objetivo" propia que calcular de antemano. */
        strip.addEventListener('scroll', function () {
            if (isDown || oneSetWidth <= 0) return;
            var wrapped = wrapToSafeZone(strip.scrollLeft);
            if (wrapped !== strip.scrollLeft) strip.scrollLeft = wrapped;
        });

        /* ---- Auto-scroll continuo hacia la derecha ----
           Se pausa mientras el usuario arrastra/toca la tira y se
           reanuda un momento después de soltar. Respeta
           prefers-reduced-motion (no se anima si el usuario lo pidió);
           el loop de arrastre de arriba queda activo de todos modos, ya
           que es una interacción iniciada por el usuario, no una
           animación automática. */
        if (!reduceMotion) {
            var SPEED_PX_PER_SEC = 35;
            var RESUME_DELAY_MS  = 2000;

            var paused       = false;
            var resumeTimer  = null;
            var lastTime     = null;
            /* Posición "real" en coma flotante, independiente de lo que
               el navegador redondea al leer strip.scrollLeft (a píxel
               entero). Con incrementos sub-pixel (~0.37px/frame) releer
               el DOM cada frame pierde la fracción y nunca se acumula. */
            var scrollPos    = strip.scrollLeft;

            function pause() {
                paused = true;
                clearTimeout(resumeTimer);
            }

            function scheduleResume() {
                clearTimeout(resumeTimer);
                resumeTimer = setTimeout(function () {
                    /* Resincroniza con la posición real por si el usuario
                       arrastró la tira a mano mientras estaba pausado. */
                    scrollPos = strip.scrollLeft;
                    paused = false;
                }, RESUME_DELAY_MS);
            }

            strip.addEventListener('pointerdown', pause);
            strip.addEventListener('mouseleave', scheduleResume);
            strip.addEventListener('pointerup', scheduleResume);
            strip.addEventListener('pointercancel', scheduleResume);

            function tick(time) {
                if (lastTime === null) lastTime = time;
                var delta = time - lastTime;
                lastTime = time;

                if (oneSetWidth > 0 && !paused) {
                    scrollPos += (SPEED_PX_PER_SEC * delta) / 1000;
                    if (scrollPos >= oneSetWidth * 2) scrollPos -= oneSetWidth;
                    strip.scrollLeft = scrollPos;
                }
                requestAnimationFrame(tick);
            }

            requestAnimationFrame(tick);
        }
    });

    /* ---------- Lightbox ----------
       Misma estructura y clases que el lightbox de reviews.js
       (.lightbox-overlay/.lightbox-nav/.lightbox-close): botones
       hermanos directos de la imagen, con offset fijo y positivo
       respecto a la pantalla completa — así no dependen del ancho
       de ningún contenedor intermedio y no saltan al redimensionar. */
    var overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.setAttribute('hidden', '');
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Visor de imagen a pantalla completa');
    overlay.innerHTML =
        '<button type="button" class="lightbox-close" aria-label="Cerrar">&#x2715;</button>' +
        '<button type="button" class="lightbox-nav lightbox-prev" aria-label="Foto anterior">&#8249;</button>' +
        '<div class="lightbox-sheet">' +
        '<button type="button" class="lightbox-handle" aria-label="Cerrar">' +
        '<span class="lightbox-handle-bar"></span>' +
        '</button>' +
        '<div class="lightbox-header"><h2 class="lightbox-title">Imágenes de laboratorio</h2></div>' +
        '<div class="lightbox-body">' +
        '<img class="lightbox-img" src="" alt="">' +
        '</div>' +
        '</div>' +
        '<button type="button" class="lightbox-nav lightbox-next" aria-label="Foto siguiente">&#8250;</button>';

    document.body.appendChild(overlay);

    var imgEl     = overlay.querySelector('.lightbox-img');
    var prevBtn   = overlay.querySelector('.lightbox-prev');
    var nextBtn   = overlay.querySelector('.lightbox-next');
    var closeBtn  = overlay.querySelector('.lightbox-close');
    var handleBtn = overlay.querySelector('.lightbox-handle');

    var currentList  = [];
    var currentIndex = 0;

    function render() {
        var wrap = currentList[currentIndex];
        var thumb = wrap.querySelector('img');
        imgEl.src = wrap.dataset.full;
        imgEl.alt = thumb ? thumb.alt : '';
        var multiple = currentList.length > 1;
        prevBtn.style.display = multiple ? '' : 'none';
        nextBtn.style.display = multiple ? '' : 'none';
    }

    function open(list, index) {
        currentList  = list;
        currentIndex = index;
        render();
        overlay.removeAttribute('hidden');
        document.body.style.overflow = 'hidden';
    }

    function close() {
        overlay.setAttribute('hidden', '');
        imgEl.src = '';
        document.body.style.overflow = '';
    }

    function step(dir) {
        currentIndex = (currentIndex + dir + currentList.length) % currentList.length;
        render();
    }

    prevBtn.addEventListener('click', function () { step(-1); });
    nextBtn.addEventListener('click', function () { step(1); });
    closeBtn.addEventListener('click', close);
    handleBtn.addEventListener('click', close);

    /* ---- Navegación en móvil: deslizar o pulsar mitad izq/der de la imagen ---- */
    var touchStartX = 0;
    var touchStartY = 0;
    var touchActive = false;

    imgEl.addEventListener('touchstart', function (e) {
        if (e.touches.length !== 1) return;
        touchActive = true;
        touchStartX  = e.touches[0].clientX;
        touchStartY  = e.touches[0].clientY;
    }, { passive: true });

    imgEl.addEventListener('touchend', function (e) {
        if (!touchActive || currentList.length <= 1) { touchActive = false; return; }
        touchActive = false;
        var touch = e.changedTouches[0];
        var dx = touch.clientX - touchStartX;
        var dy = touch.clientY - touchStartY;
        if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
            step(dx < 0 ? 1 : -1);
        }
    }, { passive: true });

    imgEl.addEventListener('click', function (e) {
        if (currentList.length <= 1) return;
        var rect = imgEl.getBoundingClientRect();
        step(e.clientX < rect.left + rect.width / 2 ? -1 : 1);
    });

    overlay.addEventListener('click', function (e) {
        if (e.target === overlay) close();
    });

    document.addEventListener('keydown', function (e) {
        if (overlay.hasAttribute('hidden')) return;
        if (e.key === 'Escape')    close();
        if (e.key === 'ArrowLeft')  step(-1);
        if (e.key === 'ArrowRight') step(1);
    });

    document.addEventListener('click', function (e) {
        var wrap = e.target.closest('.concern-card__img-wrap');
        if (!wrap || wrap.dataset.clone) return;
        var gallery = wrap.closest('.concern-card__images');
        if (!gallery) return;
        var list = Array.prototype.slice.call(gallery.querySelectorAll('.concern-card__img-wrap:not([data-clone])'));
        open(list, list.indexOf(wrap));
    });
})();
