/* ========================================
   Header Component
   ======================================== */
(function () {
    const el = document.querySelector('[data-component="header"]');
    if (!el) return;

    const base = el.dataset.base || '';

    // Idiomas disponibles — agregar nuevos aquí
    const languages = [
        { code: 'es', flag: '\uD83C\uDDEA\uD83C\uDDF8', label: 'Español' },
        { code: 'en', flag: '\uD83C\uDDFA\uD83C\uDDF8', label: 'English' }
    ];

    // Leer idioma guardado para marcar el activo al renderizar
    const savedLang = localStorage.getItem('ecozox_lang')
        || (navigator.language || '').split('-')[0].toLowerCase();
    const currentLang = languages.find(l => l.code === savedLang) ? savedLang : 'es';
    const currentLabel = (languages.find(l => l.code === currentLang) || languages[0]).code.toUpperCase();

    const optionsHTML = languages.map(lang => `
        <button class="lang-option${lang.code === currentLang ? ' active' : ''}" data-lang="${lang.code}">
            <span class="lang-flag">${lang.flag}</span>
            ${lang.label}
            <svg class="lang-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
        </button>
    `).join('');

    el.outerHTML = `
    <header class="header">
        <div class="container" style="display: flex; justify-content: space-between; align-items: center;">
            <a href="${base}index.html" class="logo">EcoZox.</a>

            <nav class="header-nav">
                <a href="${base}contacto.html" class="nav-link" data-i18n="nav_contact">Contacto</a>

                <div class="lang-switcher" id="langSwitcher">
                    <button class="lang-toggle" id="langToggle" aria-haspopup="true" aria-expanded="false">
                        <svg class="globe-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="M2 12h20"></path>
                            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                        </svg>
                        <span class="lang-current-code">${currentLabel}</span>
                        <svg class="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </button>
                    <div class="lang-dropdown" role="menu">
                        ${optionsHTML}
                    </div>
                </div>
            </nav>

            <a href="${base}carrito.html" class="cart-button">
                <img src="${base}assets/bag.svg" data-i18n-alt="cart_alt" alt="Carrito" class="cart-btn-icon">
                <span class="cart-btn-divider"></span>
                <span class="cart-count">0</span>
            </a>
        </div>
    </header>`;

    /* ---------- Dropdown behavior ---------- */
    const switcher = document.getElementById('langSwitcher');
    const toggle = document.getElementById('langToggle');

    // Toggle open/close
    toggle.addEventListener('click', function (e) {
        e.stopPropagation();
        const isOpen = switcher.classList.toggle('open');
        toggle.setAttribute('aria-expanded', isOpen);
    });

    // Close on click outside
    document.addEventListener('click', function () {
        switcher.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
    });

    // Prevent closing when clicking inside dropdown
    switcher.querySelector('.lang-dropdown').addEventListener('click', function (e) {
        e.stopPropagation();
    });

    // Language selection
    switcher.querySelectorAll('.lang-option').forEach(function (btn) {
        btn.addEventListener('click', function () {
            const lang = this.dataset.lang;

            // Update active state
            switcher.querySelectorAll('.lang-option').forEach(function (b) { b.classList.remove('active'); });
            this.classList.add('active');

            // Update toggle label
            switcher.querySelector('.lang-current-code').textContent = lang.toUpperCase();

            // Close dropdown
            switcher.classList.remove('open');
            toggle.setAttribute('aria-expanded', 'false');

            // Apply language
            if (window.EcoI18n) window.EcoI18n.setLang(lang);
        });
    });
})();
