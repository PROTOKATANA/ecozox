/* ========================================
   Wave Divider Generator
   Creates dynamic SVG wave separators
   ======================================== */

(function () {
    const dividers = document.querySelectorAll('.line-divider');

    dividers.forEach((divider, index) => {
        const width = parseFloat(divider.dataset.waveWidth) || 50;
        const height = parseFloat(divider.dataset.waveHeight) || 20;
        const strokeWidth = parseFloat(divider.dataset.strokeWidth) || 10;
        const strokeColor = divider.dataset.strokeColor || '#e5e7eb';
        const fillTop = divider.dataset.fillTop || 'transparent';
        const fillBottom = divider.dataset.fillBottom || 'transparent';

        const svgHeight = height + (strokeWidth * 2);
        const midY = svgHeight / 2;
        const amplitudeY = height / 2;

        const pathLine = `
            M -${width} ${midY}
            Q -${width * 0.75} ${midY - amplitudeY} -${width * 0.5} ${midY}
            T 0 ${midY}
            T ${width * 0.5} ${midY}
            T ${width} ${midY}
            T ${width * 1.5} ${midY}
            T ${width * 2} ${midY}
        `;

        const pathFillTop = `${pathLine} L ${width * 2} -5 L -${width} -5 Z`;
        const pathFillBottom = `${pathLine} L ${width * 2} ${svgHeight + 5} L -${width} ${svgHeight + 5} Z`;

        divider.innerHTML = `
            <svg width="100%" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg" style="display: block;">
                <defs>
                    <pattern id="wave-pattern-${index}" x="0" y="0" width="${width}" height="${svgHeight}" patternUnits="userSpaceOnUse">
                        ${fillTop !== 'transparent' ? `<path d="${pathFillTop}" fill="${fillTop}" />` : ''}
                        ${fillBottom !== 'transparent' ? `<path d="${pathFillBottom}" fill="${fillBottom}" />` : ''}
                        <path d="${pathLine}" fill="none" stroke="${strokeColor}" stroke-width="${strokeWidth}" stroke-linecap="round" />
                    </pattern>
                </defs>
                <rect x="0" y="0" width="100%" height="100%" fill="url(#wave-pattern-${index})" />
            </svg>
        `;

        divider.style.height = `${svgHeight}px`;
    });
})();
