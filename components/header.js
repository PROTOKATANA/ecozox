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

            <div class="header-actions" style="display: flex; gap: 0.75rem; align-items: center;">
                
                <a href="${base}contacto.html" class="cart-button contact-only-icon" aria-label="Contacto" data-i18n-label="nav_contact">
                    <svg class="cart-btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                        <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                </a>

                <div class="lang-switcher" id="langSwitcher">
                    <button class="lang-toggle" id="langToggle" aria-haspopup="true" aria-expanded="false">
                        <svg class="lang-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="M2 12h20"></path>
                            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                        </svg>
                        <span class="cart-btn-divider"></span>
                        <span class="lang-current-code">${currentLabel}</span>
                    </button>
                    
                    <div class="lang-dropdown" role="menu">
                        ${optionsHTML}
                    </div>
                </div>

                <a href="${base}carrito.html" class="cart-button">
                    <img src="${base}assets/bag.svg" data-i18n-alt="cart_alt" alt="Carrito" class="cart-btn-icon">
                    <span class="cart-btn-divider"></span>
                    <span class="cart-count">0</span>
                </a>
            </div>
        </div>
    </header>`;

    /* ... (resto del comportamiento del dropdown se queda igual) ... */
    const switcher = document.getElementById('langSwitcher');
    const toggle = document.getElementById('langToggle');

    toggle.addEventListener('click', function (e) {
        e.stopPropagation();
        const isOpen = switcher.classList.toggle('open');
        toggle.setAttribute('aria-expanded', isOpen);
    });

    document.addEventListener('click', function () {
        switcher.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
    });

    switcher.querySelector('.lang-dropdown').addEventListener('click', function (e) {
        e.stopPropagation();
    });

    switcher.querySelectorAll('.lang-option').forEach(function (btn) {
        btn.addEventListener('click', function () {
            const lang = this.dataset.lang;
            switcher.querySelectorAll('.lang-option').forEach(function (b) { b.classList.remove('active'); });
            this.classList.add('active');
            switcher.querySelector('.lang-current-code').textContent = lang.toUpperCase();
            switcher.classList.remove('open');
            toggle.setAttribute('aria-expanded', 'false');
            if (window.EcoI18n) window.EcoI18n.setLang(lang);
        });
    });
})();
