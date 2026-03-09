const fs = require('fs');
const path = require('path');

const models = ['grecale', 'levante', 'ghibli', 'mc20'];
const externalColors = ['blue', 'red', 'black', 'white', 'grey'];
const internalColors = ['black', 'red', 'tan'];

const numFrames = 36;
const baseDir = path.join(__dirname, '..', 'public', 'cars');

// Map colors to hex for SVG
const colorMap = {
    blue: '#00205b',
    red: '#8b0000',
    black: '#111111',
    white: '#f5f5f5',
    grey: '#555555',
    tan: '#d2b48c'
};

function ensureDir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

function generateSvgSequence(model, category, color, isInterior = false) {
    const dir = path.join(baseDir, model, category, color);
    ensureDir(dir);

    const hexColor = colorMap[color] || '#333333';

    if (isInterior) {
        // Just one image needed for interior (static view)
        const svgContent = `
<svg width="1200" height="675" viewBox="0 0 1200 675" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="#1a1a1a"/>
    <!-- Dashboard Mock -->
    <path d="M 0 400 Q 600 300 1200 400 L 1200 675 L 0 675 Z" fill="#222"/>
    <!-- Center Console mock -->
    <rect x="500" y="450" width="200" height="225" fill="#111" rx="10"/>
    <!-- Steering wheel mock -->
    <circle cx="300" cy="400" r="120" stroke="${hexColor}" stroke-width="20" fill="none"/>
    <circle cx="300" cy="400" r="40" fill="${hexColor}"/>
    <text x="600" y="200" font-family="sans-serif" font-size="32" font-weight="bold" fill="#fff" text-anchor="middle" letter-spacing="4" opacity="0.3">
        ${model.toUpperCase()} : ${color.toUpperCase()} INTERIOR
    </text>
</svg>`;
        fs.writeFileSync(path.join(dir, `01.svg`), svgContent.trim());
        return;
    }

    // Generate 36 exterior rotation frames
    for (let i = 1; i <= numFrames; i++) {
        // Frame formatting (01, 02... 36)
        const frameStr = i.toString().padStart(2, '0');
        
        // Calculate a fake "rotation" of the car body for visual feedback
        // Just shifting an element left/right based on angle to simulate rotation
        const angleParam = (i / numFrames) * Math.PI * 2;
        const xOffset = Math.sin(angleParam) * 100;
        const widthScale = 1 - Math.abs(Math.sin(angleParam)) * 0.4;
        
        // Very basic stylized placeholder "car" in SVG
        const svgContent = `
<svg width="1200" height="675" viewBox="0 0 1200 675" xmlns="http://www.w3.org/2000/svg">
    <!-- Studio Background -->
    <defs>
        <radialGradient id="bg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#ffffff"/>
            <stop offset="100%" stop-color="#e0e0e0"/>
        </radialGradient>
        <filter id="shadow">
            <feDropShadow dx="0" dy="20" stdDeviation="15" flood-opacity="0.3"/>
        </filter>
    </defs>
    <rect width="100%" height="100%" fill="url(#bg)"/>
    
    <g transform="translate(${600 + xOffset}, 400)" filter="url(#shadow)">
        <!-- Car Body Box scaled based on rotation angle -->
        <rect x="${-300 * widthScale}" y="-100" width="${600 * widthScale}" height="150" rx="30" fill="${hexColor}"/>
        
        <!-- Greenhouse / Windows -->
        <path d="M ${-150 * widthScale} -100 L ${-100 * widthScale} -180 L ${100 * widthScale} -180 L ${150 * widthScale} -100 Z" fill="#111111"/>
        
        <!-- Wheels -->
        <circle cx="${-200 * widthScale}" cy="50" r="60" fill="#222"/>
        <circle cx="${200 * widthScale}" cy="50" r="60" fill="#222"/>
        <circle cx="${-200 * widthScale}" cy="50" r="40" fill="#ddd"/>
        <circle cx="${200 * widthScale}" cy="50" r="40" fill="#ddd"/>
    </g>

    <text x="600" y="600" font-family="sans-serif" font-size="24" fill="#666" text-anchor="middle" letter-spacing="2">
        ${model.toUpperCase()} : ${color.toUpperCase()} EXTERIOR : FRAME ${frameStr}/36
    </text>
</svg>`;

        fs.writeFileSync(path.join(dir, `${frameStr}.svg`), svgContent.trim());
    }
}

// Ensure base dir exists
ensureDir(baseDir);

// Generate for all models
models.forEach(model => {
    // Generate exterior combos
    externalColors.forEach(color => {
        generateSvgSequence(model, 'exterior', color, false);
    });

    // Generate interior combos
    internalColors.forEach(color => {
        generateSvgSequence(model, 'interior', color, true);
    });
});

console.log('Mock 360 images generated successfully.');
