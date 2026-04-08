/* ========================================
   Wave Divider Generator
   Creates dynamic SVG wave separators
   using a single continuous path (no pattern tiling)
   ======================================== */

(function () {
    var dividers = document.querySelectorAll('.line-divider');

    dividers.forEach(function (divider, index) {
        var waveWidth   = parseFloat(divider.dataset.waveWidth)   || 50;
        var height      = parseFloat(divider.dataset.waveHeight)  || 20;
        var strokeWidth = parseFloat(divider.dataset.strokeWidth) || 10;
        var strokeColor = divider.dataset.strokeColor || '#e5e7eb';
        var fillTop     = divider.dataset.fillTop     || 'transparent';
        var fillBottom  = divider.dataset.fillBottom  || 'transparent';

        var svgHeight = height + strokeWidth * 2;
        var midY      = svgHeight / 2;
        var amp       = height / 2;
        var halfWave  = waveWidth / 2;

        // Use viewport width instead of fixed 4000px to avoid horizontal scroll
        var totalWidth = window.innerWidth || 4000;
        var waveLine = 'M0 ' + midY;
        var x   = 0;
        var up  = true;

        while (x < totalWidth) {
            var cx = x + halfWave / 2;
            var cy = up ? midY - amp : midY + amp;
            x += halfWave;
            waveLine += ' Q' + cx + ' ' + cy + ' ' + x + ' ' + midY;
            up = !up;
        }

        // Fill paths (single shapes, not tiled patterns)
        var topPath    = waveLine + ' L' + totalWidth + ' 0 L0 0 Z';
        var bottomPath = waveLine + ' L' + totalWidth + ' ' + svgHeight + ' L0 ' + svgHeight + ' Z';

        var svg = '<svg width="100%" height="' + svgHeight + '" xmlns="http://www.w3.org/2000/svg" style="display:block;overflow:hidden;width:100vw;max-width:100vw">'
            + (fillTop    !== 'transparent' ? '<path d="' + topPath    + '" fill="' + fillTop    + '"/>' : '')
            + (fillBottom !== 'transparent' ? '<path d="' + bottomPath + '" fill="' + fillBottom + '"/>' : '')
            + '<path d="' + waveLine + '" fill="none" stroke="' + strokeColor + '" stroke-width="' + strokeWidth + '" stroke-linecap="round"/>'
            + '</svg>';

        divider.innerHTML = svg;
        divider.style.height = svgHeight + 'px';
        divider.style.width = '100vw';
        divider.style.maxWidth = '100vw';
    });
})();
