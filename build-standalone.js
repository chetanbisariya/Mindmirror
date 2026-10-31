/**
 * MindMirror - Standalone HTML Generator
 * Bundles all CSS and JS into a single portable HTML file.
 */

const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
let html = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');

// Read CSS files
const mainCss = fs.readFileSync(path.join(rootDir, 'css', 'main.css'), 'utf8');
const compCss = fs.readFileSync(path.join(rootDir, 'css', 'components.css'), 'utf8');
const combinedCss = `<style>\n${mainCss}\n\n${compCss}\n</style>`;

// Replace CSS link tags
html = html.replace(/<link rel="stylesheet" href="css\/main\.css">\s*<link rel="stylesheet" href="css\/components\.css">/, combinedCss);

// Read JS files
const questionsJs = fs.readFileSync(path.join(rootDir, 'js', 'questions.js'), 'utf8');
const engineJs = fs.readFileSync(path.join(rootDir, 'js', 'engine.js'), 'utf8');
const breathJs = fs.readFileSync(path.join(rootDir, 'js', 'breath-pacer.js'), 'utf8');
const cbtJs = fs.readFileSync(path.join(rootDir, 'js', 'cbt-tool.js'), 'utf8');
const appJs = fs.readFileSync(path.join(rootDir, 'js', 'app.js'), 'utf8');

const combinedJs = `
<script>
${questionsJs}
${engineJs}
${breathJs}
${cbtJs}
${appJs}
</script>
`;

// Replace script tags
html = html.replace(/<script src="js\/questions\.js"><\/script>\s*<script src="js\/engine\.js"><\/script>\s*<script src="js\/breath-pacer\.js"><\/script>\s*<script src="js\/cbt-tool\.js"><\/script>\s*<script src="js\/app\.js"><\/script>/, combinedJs);

// Write standalone file
const outPath = path.join(rootDir, 'standalone.html');
fs.writeFileSync(outPath, html, 'utf8');

console.log(`[SUCCESS] Generated standalone single-file bundle at: ${outPath} (${(fs.statSync(outPath).size / 1024).toFixed(1)} KB)`);
