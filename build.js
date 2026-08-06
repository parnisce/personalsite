// Build step for static deployment (Vercel / Cloudflare Pages).
//
// This site has no compilation step: it is plain HTML/CSS/JS served as-is.
// However, the connected deploy platforms are configured to run `npm run build`
// and then publish a build output directory. This script assembles the static
// site into ./dist so that both platforms have a clean output directory that
// excludes node_modules, server-only files (api/*, dev-server.js), and configs.
//
// On Vercel, the serverless functions in /api are still deployed from the repo
// root automatically (independent of the output directory). On Cloudflare Pages
// there is no Node backend, so the site falls back to its static content
// (see db-loader.js) — which is the intended graceful-degradation behavior.

const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, 'dist');

// Top-level static assets to publish (files + directories), preserving structure.
const INCLUDE = [
    'index.html',
    'main.css',
    'main.js',
    'about.css',
    'blog.css',
    'db-loader.js',
    'assets',
    'about',
    'blog',
    'portfolio',
    'experience',
    'admin'
];

// Files that should never be published even if they live inside an included dir.
const EXCLUDE_EXT = new Set(['.sql', '.md']);

function copyInto(src, dest) {
    const stat = fs.statSync(src);
    if (stat.isDirectory()) {
        fs.mkdirSync(dest, { recursive: true });
        for (const entry of fs.readdirSync(src)) {
            copyInto(path.join(src, entry), path.join(dest, entry));
        }
        return;
    }
    if (EXCLUDE_EXT.has(path.extname(src).toLowerCase())) return;
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
}

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

let copied = 0;
for (const item of INCLUDE) {
    const src = path.join(__dirname, item);
    if (!fs.existsSync(src)) {
        console.warn(`  (skip, not found) ${item}`);
        continue;
    }
    copyInto(src, path.join(OUT, item));
    copied++;
}

console.log(`Static build complete: ${copied} top-level items copied into dist/`);
