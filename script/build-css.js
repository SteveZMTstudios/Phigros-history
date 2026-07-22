const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const rootDir = path.resolve(__dirname, '..');
const cssFiles = [
    { src: 'assets/css/custom-style.src.css', dist: 'assets/css/custom-style.css' },
    { src: 'assets/css/loading-fix.src.css', dist: 'assets/css/loading-fix.css' },
    { src: 'editor/version-editor.src.css', dist: 'editor/version-editor.css' }
];

console.log('Processing CSS files with PostCSS & Autoprefixer...');

cssFiles.forEach(({ src, dist }) => {
    const srcPath = path.join(rootDir, src);
    const distPath = path.join(rootDir, dist);

    if (!fs.existsSync(srcPath)) {
        console.warn(`Source file not found: ${src}`);
        return;
    }
    console.log(`Processing: ${src} -> ${dist}`);
    try {
        execSync(`npx --package=postcss-cli --package=autoprefixer postcss "${srcPath}" --use autoprefixer -o "${distPath}"`, {
            cwd: rootDir,
            stdio: 'inherit'
        });
        console.log(`Successfully processed: ${dist}`);
    } catch (e) {
        console.error(`Failed to process ${src}:`, e.message);
    }
});

console.log('CSS processing complete!');
