/* ========================================
   Environment Config — Centralized API URL
   Sets ECOZOX_API_URL based on the current
   hostname (local vs production).
   Must be loaded BEFORE precio-loader.js.
   ======================================== */
(function () {
    var host = location.hostname;
    var isLocal = (
        host === 'localhost' ||
        host === '127.0.0.1' ||
        host === '' ||
        location.protocol === 'file:'
    );
    window.ECOZOX_API_URL = isLocal
        ? 'http://localhost:3000'
        : 'https://api-6tn32nl4ea-uc.a.run.app';
})();
