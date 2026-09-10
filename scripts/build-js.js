const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const rootDir = path.resolve(__dirname, '..');
const jsFiles = [
    { src: 'assets/js/legacy-polyfill.src.js', dist: 'assets/js/legacy-polyfill.js' },
    { src: 'assets/js/main.src.js', dist: 'assets/js/main.js' },
    { src: 'assets/js/ui-sound.src.js', dist: 'assets/js/ui-sound.js' },
    { src: 'editor/version-editor.src.js', dist: 'editor/version-editor.js' }
];

console.log('Transpiling JS files with Babel for classic browser compatibility...');

jsFiles.forEach(({ src, dist }) => {
    const srcPath = path.join(rootDir, src);
    const distPath = path.join(rootDir, dist);

    if (!fs.existsSync(srcPath)) {
        console.warn(`Source file not found: ${src}`);
        return;
    }
    console.log(`Transpiling: ${src} -> ${dist}`);
    try {
        execSync(`babel "${srcPath}" --out-file "${distPath}"`, {
            cwd: rootDir,
            stdio: 'inherit'
        });
        console.log(`Successfully transpiled: ${dist}`);
    } catch (e) {
        console.error(`Failed to transpile ${src}:`, e.message);
    }
});

console.log('JS transpilation complete!');
