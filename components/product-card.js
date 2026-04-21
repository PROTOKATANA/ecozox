/* ========================================
   Product Grid — carga nichos.json y renderiza
   una card por nicho activo.
   Usage: <div data-component="product-grid"></div>
   ======================================== */

(function () {
    var placeholder = document.querySelector('[data-component="product-grid"]');
    if (!placeholder) return;

    function t(key) {
        return (window.EcoI18n && window.EcoI18n.t) ? window.EcoI18n.t(key) : key;
    }

    function resolveTitle(product) {
        if (!product.titleKey) return product.titulo || '';
        var lang = window.EcoI18n ? window.EcoI18n.getLang() : 'es';
        var nl = window.EcoNichoLocales;
        if (nl) {
            if (nl[lang] && nl[lang][product.titleKey]) return nl[lang][product.titleKey];
            if (nl['en'] && nl['en'][product.titleKey]) return nl['en'][product.titleKey];
        }
        var v = t(product.titleKey);
        return v !== product.titleKey ? v : (product.titulo || '');
    }

    function loadNichoLocalesAndRender(products) {
        var lang  = window.EcoI18n ? window.EcoI18n.getLang() : 'es';
        var paths = [];
        products.forEach(function (p) {
            if (p.localesPath && paths.indexOf(p.localesPath) === -1) paths.push(p.localesPath);
        });
        if (!paths.length) { renderGrid(products); return; }

        var langs = (lang === 'en') ? ['en'] : ['en', lang];
        var total = paths.length * langs.length;
        var done  = 0;
        function check() { if (++done >= total) renderGrid(products); }

        paths.forEach(function (path) {
            langs.forEach(function (l) {
                var s = document.createElement('script');
                s.src = path + l + '.js';
                s.onload = s.onerror = check;
                document.head.appendChild(s);
            });
        });
    }

    function buildCard(product) {
        var titulo = resolveTitle(product);
        return '<a href="' + product.link + '" class="product-card">'
            + '<div class="product-img-wrapper">'
            +   '<img src="' + product.imagen + '" alt="' + titulo + '" class="product-image" loading="lazy">'
            + '</div>'
            + '<div class="product-info">'
            +   '<h2 class="product-title"><span class="product-title__text">' + titulo + '</span></h2>'
            + '</div>'
            + '</a>';
    }

    function renderGrid(products) {
        var grid = document.querySelector('.product-grid');
        if (!grid) return;
        grid.innerHTML = products.map(buildCard).join('');
    }

    placeholder.outerHTML = '<div class="product-grid"></div>';

    fetch('nichos.json')
        .then(function (r) {
            if (!r.ok) throw new Error('nichos.json no encontrado');
            return r.json();
        })
        .then(loadNichoLocalesAndRender)
        .catch(function (err) { console.error('product-grid:', err.message); });

    window.EcoProductCards = {
        update: function () {
            fetch('nichos.json').then(function (r) { return r.json(); }).then(loadNichoLocalesAndRender).catch(function(){});
        }
    };
})();
