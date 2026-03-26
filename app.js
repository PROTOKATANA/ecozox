/* ========================================
   EcoZox - App Entry Point
   Loads all feature modules after DOM is ready

   Execution order (all 'defer'):
   1. Components: header.js, footer.js, product-card.js
      → inject HTML into placeholder divs
   2. This script (app.js)
      → loads feature modules that attach behaviors
      → async=false guarantees execution in insertion order
   ======================================== */

function loadScript(src) {
    const script = document.createElement('script');
    script.src = src;
    script.async = false;
    document.body.appendChild(script);
}

// Detect base path from the page's own script tag
const appScript = document.querySelector('script[src$="app.js"]');
const base = appScript ? appScript.src.replace('app.js', '') : '';

const modules = [
    'js/cart.js',
    'js/gallery.js',
    'js/quantity.js',
    'js/cart-items.js',
    'js/wave-divider.js'
];

modules.forEach(mod => loadScript(base + mod));
