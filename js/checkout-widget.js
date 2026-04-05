/* ========================================
   Checkout Widget — Delivery Form
   Slide-up drawer (mobile) / centered modal (desktop)
   Supports all 12 locales + RTL + browser autocomplete
   ======================================== */

(function () {
    'use strict';

    /* --------------------------------------------------------
       Countries (ISO 3166-1 alpha-2 → English display name)
       -------------------------------------------------------- */
    var COUNTRIES = [
        ['AF','Afghanistan'],  ['AL','Albania'],      ['DZ','Algeria'],
        ['AR','Argentina'],    ['AU','Australia'],    ['AT','Austria'],
        ['BE','Belgium'],      ['BR','Brazil'],       ['CA','Canada'],
        ['CL','Chile'],        ['CN','China'],        ['CO','Colombia'],
        ['HR','Croatia'],      ['CZ','Czech Republic'],['DK','Denmark'],
        ['EG','Egypt'],        ['FI','Finland'],      ['FR','France'],
        ['DE','Germany'],      ['GR','Greece'],       ['HK','Hong Kong'],
        ['HU','Hungary'],      ['IN','India'],        ['ID','Indonesia'],
        ['IE','Ireland'],      ['IL','Israel'],       ['IT','Italy'],
        ['JP','Japan'],        ['KE','Kenya'],        ['KR','South Korea'],
        ['MY','Malaysia'],     ['MX','Mexico'],       ['MA','Morocco'],
        ['NL','Netherlands'],  ['NZ','New Zealand'],  ['NG','Nigeria'],
        ['NO','Norway'],       ['PK','Pakistan'],     ['PE','Peru'],
        ['PH','Philippines'],  ['PL','Poland'],       ['PT','Portugal'],
        ['RO','Romania'],      ['RU','Russia'],       ['SA','Saudi Arabia'],
        ['SG','Singapore'],    ['ZA','South Africa'], ['ES','Spain'],
        ['SE','Sweden'],       ['CH','Switzerland'],  ['TW','Taiwan'],
        ['TH','Thailand'],     ['TR','Turkey'],       ['AE','United Arab Emirates'],
        ['GB','United Kingdom'],['US','United States'],['VN','Vietnam']
    ];

    /* --------------------------------------------------------
       Build HTML
       -------------------------------------------------------- */
    function buildCountryOptions() {
        return COUNTRIES.map(function (c) {
            return '<option value="' + c[0] + '">' + c[1] + '</option>';
        }).join('');
    }

    function buildHTML() {
        return (
            '<div id="checkout-widget-overlay" class="cwo__overlay" ' +
                'role="dialog" aria-modal="true" aria-labelledby="cwo-title" hidden>' +

            '<div class="cwo__panel" role="document">' +

            /* Drag handle (mobile) */
            '<div class="cwo__handle" aria-hidden="true"></div>' +

            /* ── Header ── */
            '<div class="cwo__header">' +
                '<h2 id="cwo-title" class="cwo__title" data-i18n="checkout_title">Datos de entrega</h2>' +
                '<button type="button" class="cwo__close" id="cwo-close-btn" ' +
                    'data-i18n-aria="checkout_close_aria" aria-label="Cerrar">' +
                    '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">' +
                        '<path d="M15 5L5 15M5 5l10 10" stroke="currentColor" ' +
                            'stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
                    '</svg>' +
                '</button>' +
            '</div>' +

            /* ── Scrollable body ── */
            '<div class="cwo__body">' +
            '<form id="cwo-form" autocomplete="on" novalidate>' +

            /* ── Treatment ── */
            '<div class="cwo__section cwo__section--first">' +
                '<div class="cwo__field">' +
                    '<span class="cwo__label" data-i18n="checkout_treatment_label">Tratamiento</span>' +
                    '<div class="cwo__radio-group" role="group">' +

                        '<label class="cwo__radio-option">' +
                            '<input type="radio" name="honorific" value="Sr." autocomplete="honorific-prefix">' +
                            '<span class="cwo__radio-mark" aria-hidden="true"></span>' +
                            '<span data-i18n="checkout_treatment_sr">Sr.</span>' +
                        '</label>' +

                        '<label class="cwo__radio-option">' +
                            '<input type="radio" name="honorific" value="Sra." autocomplete="honorific-prefix">' +
                            '<span class="cwo__radio-mark" aria-hidden="true"></span>' +
                            '<span data-i18n="checkout_treatment_sra">Sra.</span>' +
                        '</label>' +

                    '</div>' +
                    '<span class="cwo__error" id="err-honorific" hidden></span>' +
                '</div>' +
            '</div>' +

            /* ── Contact ── */
            '<div class="cwo__section">' +
                '<h3 class="cwo__section-title" data-i18n="checkout_contact_section">Contacto</h3>' +

                '<div class="cwo__field">' +
                    '<label class="cwo__label" for="cwo-email" data-i18n="checkout_email_label">Correo electrónico</label>' +
                    '<input type="email" id="cwo-email" name="email" class="cwo__input" ' +
                        'autocomplete="email" required inputmode="email" ' +
                        'data-i18n-placeholder="checkout_email_placeholder">' +
                    '<span class="cwo__error" id="err-email" hidden></span>' +
                '</div>' +
            '</div>' +

            /* ── Shipping address ── */
            '<div class="cwo__section">' +
                '<h3 class="cwo__section-title" data-i18n="checkout_address_section">Dirección de envío</h3>' +

                /* Country */
                '<div class="cwo__field">' +
                    '<label class="cwo__label" for="cwo-country" data-i18n="checkout_country_label">País</label>' +
                    '<select id="cwo-country" name="country" class="cwo__input cwo__select" ' +
                        'autocomplete="country" required>' +
                        '<option value="" data-i18n="checkout_country_placeholder">Selecciona un país</option>' +
                        buildCountryOptions() +
                    '</select>' +
                    '<span class="cwo__error" id="err-country" hidden></span>' +
                '</div>' +

                /* First + Last name */
                '<div class="cwo__field-row">' +
                    '<div class="cwo__field">' +
                        '<label class="cwo__label" for="cwo-firstname" data-i18n="checkout_firstname_label">Nombre</label>' +
                        '<input type="text" id="cwo-firstname" name="given-name" class="cwo__input" ' +
                            'autocomplete="given-name" required ' +
                            'data-i18n-placeholder="checkout_firstname_placeholder">' +
                        '<span class="cwo__error" id="err-firstname" hidden></span>' +
                    '</div>' +
                    '<div class="cwo__field">' +
                        '<label class="cwo__label" for="cwo-lastname" data-i18n="checkout_lastname_label">Apellido</label>' +
                        '<input type="text" id="cwo-lastname" name="family-name" class="cwo__input" ' +
                            'autocomplete="family-name" required ' +
                            'data-i18n-placeholder="checkout_lastname_placeholder">' +
                        '<span class="cwo__error" id="err-lastname" hidden></span>' +
                    '</div>' +
                '</div>' +

                /* Address line 1 */
                '<div class="cwo__field">' +
                    '<label class="cwo__label" for="cwo-address1" data-i18n="checkout_address1_label">Dirección y número de casa</label>' +
                    '<input type="text" id="cwo-address1" name="address-line1" class="cwo__input" ' +
                        'autocomplete="address-line1" required ' +
                        'data-i18n-placeholder="checkout_address1_placeholder">' +
                    '<span class="cwo__error" id="err-address1" hidden></span>' +
                '</div>' +

                /* Address line 2 (optional) */
                '<div class="cwo__field">' +
                    '<label class="cwo__label" for="cwo-address2">' +
                        '<span data-i18n="checkout_address2_label">Edificio, apartamento, etc.</span>' +
                        '<span class="cwo__optional" data-i18n="checkout_address2_optional">(opcional)</span>' +
                    '</label>' +
                    '<input type="text" id="cwo-address2" name="address-line2" class="cwo__input" ' +
                        'autocomplete="address-line2" ' +
                        'data-i18n-placeholder="checkout_address2_placeholder">' +
                '</div>' +

                /* Province + City + ZIP */
                '<div class="cwo__field-row cwo__field-row--3">' +
                    '<div class="cwo__field">' +
                        '<label class="cwo__label" for="cwo-province" data-i18n="checkout_province_label">Provincia</label>' +
                        '<input type="text" id="cwo-province" name="address-level1" class="cwo__input" ' +
                            'autocomplete="address-level1" required ' +
                            'data-i18n-placeholder="checkout_province_placeholder">' +
                        '<span class="cwo__error" id="err-province" hidden></span>' +
                    '</div>' +
                    '<div class="cwo__field">' +
                        '<label class="cwo__label" for="cwo-city" data-i18n="checkout_city_label">Ciudad</label>' +
                        '<input type="text" id="cwo-city" name="address-level2" class="cwo__input" ' +
                            'autocomplete="address-level2" required ' +
                            'data-i18n-placeholder="checkout_city_placeholder">' +
                        '<span class="cwo__error" id="err-city" hidden></span>' +
                    '</div>' +
                    '<div class="cwo__field">' +
                        '<label class="cwo__label" for="cwo-zip" data-i18n="checkout_zip_label">Código postal</label>' +
                        '<input type="text" id="cwo-zip" name="postal-code" class="cwo__input" ' +
                            'autocomplete="postal-code" required inputmode="numeric" ' +
                            'data-i18n-placeholder="checkout_zip_placeholder">' +
                        '<span class="cwo__error" id="err-zip" hidden></span>' +
                    '</div>' +
                '</div>' +

                /* Phone */
                '<div class="cwo__field">' +
                    '<label class="cwo__label" for="cwo-phone" data-i18n="checkout_phone_label">Teléfono</label>' +
                    '<input type="tel" id="cwo-phone" name="tel" class="cwo__input" ' +
                        'autocomplete="tel" required inputmode="tel" ' +
                        'data-i18n-placeholder="checkout_phone_placeholder">' +
                    '<span class="cwo__error" id="err-phone" hidden></span>' +
                '</div>' +

                /* Notes (optional) */
                '<div class="cwo__field">' +
                    '<label class="cwo__label" for="cwo-notes">' +
                        '<span data-i18n="checkout_notes_label">Observación</span>' +
                        '<span class="cwo__optional" data-i18n="checkout_notes_optional">(opcional)</span>' +
                    '</label>' +
                    '<textarea id="cwo-notes" name="notes" class="cwo__input cwo__textarea" ' +
                        'autocomplete="off" rows="3" ' +
                        'data-i18n-placeholder="checkout_notes_placeholder"></textarea>' +
                '</div>' +

            '</div>' + /* end address section */

            /* ── Footer ── */
            '<div class="cwo__footer">' +
                '<button type="submit" class="cwo__submit-btn" data-i18n="checkout_continue_btn">Continuar</button>' +
            '</div>' +

            '</form>' +
            '</div>' + /* end cwo__body */
            '</div>' + /* end cwo__panel */
            '</div>'   /* end cwo__overlay */
        );
    }

    /* --------------------------------------------------------
       Open
       -------------------------------------------------------- */
    function open() {
        var overlay = document.getElementById('checkout-widget-overlay');
        if (!overlay) return;

        /* Reset scroll */
        var body = overlay.querySelector('.cwo__body');
        if (body) body.scrollTop = 0;

        overlay.removeAttribute('hidden');
        /* Force reflow so CSS transition triggers from initial state */
        void overlay.offsetHeight;
        overlay.classList.add('cwo--open');
        document.body.classList.add('cwo-body-lock');

        /* Apply current language translations */
        if (window.EcoI18n) {
            window.EcoI18n.applyTranslations();
        }

        /* Focus first radio after animation */
        setTimeout(function () {
            var first = overlay.querySelector('input[name="honorific"]');
            if (first) first.focus();
        }, 340);
    }

    /* --------------------------------------------------------
       Close
       -------------------------------------------------------- */
    function close() {
        var overlay = document.getElementById('checkout-widget-overlay');
        if (!overlay) return;

        overlay.classList.remove('cwo--open');
        document.body.classList.remove('cwo-body-lock');

        var panel = overlay.querySelector('.cwo__panel');
        var done = false;

        function hide() {
            if (done) return;
            done = true;
            overlay.setAttribute('hidden', '');
        }

        if (panel) {
            panel.addEventListener('transitionend', function handler(e) {
                if (e.propertyName === 'transform' || e.propertyName === 'opacity') {
                    panel.removeEventListener('transitionend', handler);
                    hide();
                }
            });
        }
        /* Safety fallback if transition doesn't fire */
        setTimeout(hide, 500);
    }

    /* --------------------------------------------------------
       Validation helpers
       -------------------------------------------------------- */
    function t(key) {
        return window.EcoI18n ? window.EcoI18n.t(key) : key;
    }

    function setFieldError(inputEl, errEl, msg) {
        inputEl.classList.add('cwo__input--error');
        if (errEl) {
            errEl.textContent = msg;
            errEl.removeAttribute('hidden');
        }
    }

    function clearFieldError(inputEl, errEl) {
        inputEl.classList.remove('cwo__input--error');
        if (errEl) errEl.setAttribute('hidden', '');
    }

    /* --------------------------------------------------------
       Validate
       -------------------------------------------------------- */
    function validate() {
        var valid = true;

        /* Honorific (radio group) */
        var radios = document.querySelectorAll('#cwo-form input[name="honorific"]');
        var honorificOk = Array.prototype.some.call(radios, function (r) { return r.checked; });
        var honorificErr = document.getElementById('err-honorific');
        if (!honorificOk) {
            if (honorificErr) {
                honorificErr.textContent = t('checkout_err_required');
                honorificErr.removeAttribute('hidden');
            }
            valid = false;
        } else {
            if (honorificErr) honorificErr.setAttribute('hidden', '');
        }

        /* Email */
        var emailEl  = document.getElementById('cwo-email');
        var emailErr = document.getElementById('err-email');
        if (!emailEl.value.trim()) {
            setFieldError(emailEl, emailErr, t('checkout_err_required'));
            valid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value.trim())) {
            setFieldError(emailEl, emailErr, t('checkout_err_email'));
            valid = false;
        } else {
            clearFieldError(emailEl, emailErr);
        }

        /* Required text / select fields */
        var fields = [
            { id: 'cwo-country',   err: 'err-country'   },
            { id: 'cwo-firstname', err: 'err-firstname'  },
            { id: 'cwo-lastname',  err: 'err-lastname'   },
            { id: 'cwo-address1',  err: 'err-address1'   },
            { id: 'cwo-province',  err: 'err-province'   },
            { id: 'cwo-city',      err: 'err-city'       },
            { id: 'cwo-zip',       err: 'err-zip'        }
        ];
        fields.forEach(function (f) {
            var el  = document.getElementById(f.id);
            var err = document.getElementById(f.err);
            if (!el) return;
            if (!el.value.trim()) {
                setFieldError(el, err, t('checkout_err_required'));
                valid = false;
            } else {
                clearFieldError(el, err);
            }
        });

        /* Phone */
        var phoneEl  = document.getElementById('cwo-phone');
        var phoneErr = document.getElementById('err-phone');
        if (!phoneEl.value.trim()) {
            setFieldError(phoneEl, phoneErr, t('checkout_err_required'));
            valid = false;
        } else if (phoneEl.value.trim().replace(/[\s\-\(\)\+\.]/g, '').length < 7) {
            setFieldError(phoneEl, phoneErr, t('checkout_err_phone'));
            valid = false;
        } else {
            clearFieldError(phoneEl, phoneErr);
        }

        return valid;
    }

    /* --------------------------------------------------------
       Success
       -------------------------------------------------------- */
    function onSuccess() {
        if (window.EcoToast) {
            window.EcoToast(t('checkout_success_toast'));
        }
        close();
    }

    /* --------------------------------------------------------
       Focus trap
       -------------------------------------------------------- */
    function handleFocusTrap(e) {
        var overlay = document.getElementById('checkout-widget-overlay');
        if (!overlay || !overlay.classList.contains('cwo--open')) return;
        if (e.key !== 'Tab') return;

        var focusable = overlay.querySelectorAll(
            'button:not([disabled]), input:not([disabled]), select:not([disabled]), ' +
            'textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable.length) return;
        var first = focusable[0];
        var last  = focusable[focusable.length - 1];

        if (e.shiftKey) {
            if (document.activeElement === first) {
                e.preventDefault();
                last.focus();
            }
        } else {
            if (document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }
    }

    /* --------------------------------------------------------
       Bind events
       -------------------------------------------------------- */
    function bindEvents() {
        /* Delegated click — opens on any .checkout-btn */
        document.addEventListener('click', function (e) {
            if (e.target.closest && e.target.closest('.checkout-btn')) {
                e.preventDefault();
                open();
            }
        });

        /* Close button */
        var closeBtn = document.getElementById('cwo-close-btn');
        if (closeBtn) closeBtn.addEventListener('click', close);

        /* Click on backdrop */
        var overlay = document.getElementById('checkout-widget-overlay');
        if (overlay) {
            overlay.addEventListener('click', function (e) {
                if (e.target === overlay) close();
            });
        }

        /* Form submit */
        var form = document.getElementById('cwo-form');
        if (form) {
            form.addEventListener('submit', function (e) {
                e.preventDefault();
                if (validate()) {
                    onSuccess();
                } else {
                    /* Scroll to first visible error */
                    var firstErr = form.querySelector('.cwo__input--error');
                    if (firstErr) {
                        firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        firstErr.focus();
                    }
                }
            });
        }

        /* ESC key */
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                var ov = document.getElementById('checkout-widget-overlay');
                if (ov && !ov.hidden) close();
            }
            handleFocusTrap(e);
        });

        /* Live error clearing on input */
        if (overlay) {
            overlay.addEventListener('input', function (e) {
                var el = e.target;
                if (!el.classList || !el.classList.contains('cwo__input--error')) return;
                var id     = el.id ? el.id.replace('cwo-', '') : null;
                var errEl  = id ? document.getElementById('err-' + id) : null;
                if (el.value && el.value.trim()) clearFieldError(el, errEl);
            });
        }
    }

    /* --------------------------------------------------------
       Init
       -------------------------------------------------------- */
    function init() {
        if (document.getElementById('checkout-widget-overlay')) return;

        var tmp = document.createElement('div');
        tmp.innerHTML = buildHTML();
        document.body.appendChild(tmp.firstElementChild);

        bindEvents();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    /* Public API */
    window.EcoCheckoutWidget = { open: open, close: close };

})();
