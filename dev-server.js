// Local development server.
//
// The production site runs on Vercel: static files are served directly and the
// files in /api/*.js run as serverless functions. `vercel dev` reproduces that
// locally but requires Vercel credentials. This script provides a credential-free
// alternative for local development: it serves the static site AND executes the
// same /api/*.js handlers (using the Vercel-style (req, res) contract), backed by
// whatever database the DB_* environment variables point at (see .env).
//
// Usage: npm run dev   (defaults to http://localhost:3000)

require('dotenv').config();

const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;

const MIME = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.txt': 'text/plain; charset=utf-8',
    '.pdf': 'application/pdf'
};

// Add Vercel-style helpers (res.status().json()/.send()/.end()) to a Node res.
function decorateResponse(res) {
    res.status = (code) => {
        res.statusCode = code;
        return res;
    };
    res.json = (obj) => {
        if (!res.getHeader('Content-Type')) {
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
        }
        res.end(JSON.stringify(obj));
        return res;
    };
    res.send = (body) => {
        res.end(body);
        return res;
    };
    return res;
}

function readBody(req) {
    return new Promise((resolve) => {
        const chunks = [];
        req.on('data', (c) => chunks.push(c));
        req.on('end', () => {
            const raw = Buffer.concat(chunks).toString('utf8');
            if (!raw) return resolve(undefined);
            const ct = req.headers['content-type'] || '';
            if (ct.includes('application/json')) {
                try {
                    return resolve(JSON.parse(raw));
                } catch (e) {
                    return resolve(raw);
                }
            }
            if (ct.includes('application/x-www-form-urlencoded')) {
                return resolve(Object.fromEntries(new URLSearchParams(raw)));
            }
            resolve(raw);
        });
    });
}

async function handleApi(req, res, parsedUrl) {
    // /api/foo -> ./api/foo.js
    const name = parsedUrl.pathname.replace(/^\/api\//, '').replace(/\/$/, '');
    const handlerPath = path.join(ROOT, 'api', `${name}.js`);
    if (!name || !fs.existsSync(handlerPath)) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'API route not found', route: name }));
        return;
    }

    req.query = Object.fromEntries(parsedUrl.searchParams.entries());
    req.body = await readBody(req);
    decorateResponse(res);

    try {
        // Fresh require each time so edits to api/*.js are picked up on reload.
        delete require.cache[require.resolve(handlerPath)];
        const handler = require(handlerPath);
        await handler(req, res);
    } catch (err) {
        console.error(`[api] ${name} error:`, err);
        if (!res.headersSent) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err.message }));
        }
    }
}

function resolveStaticFile(pathname) {
    // Decode and prevent path traversal.
    let rel = decodeURIComponent(pathname);
    const safe = path.normalize(rel).replace(/^(\.\.[/\\])+/, '');
    let filePath = path.join(ROOT, safe);

    if (!filePath.startsWith(ROOT)) return null;

    // Directory or trailing-slash path -> index.html inside it.
    if (rel.endsWith('/')) {
        const idx = path.join(filePath, 'index.html');
        return fs.existsSync(idx) ? idx : null;
    }

    if (fs.existsSync(filePath)) {
        if (fs.statSync(filePath).isDirectory()) {
            const idx = path.join(filePath, 'index.html');
            return fs.existsSync(idx) ? idx : null;
        }
        return filePath;
    }

    // Extensionless path (e.g. /about) -> /about/index.html (mirrors vercel.json).
    if (!path.extname(filePath)) {
        const idx = path.join(filePath, 'index.html');
        if (fs.existsSync(idx)) return idx;
        const html = `${filePath}.html`;
        if (fs.existsSync(html)) return html;
    }

    return null;
}

function serveStatic(req, res, parsedUrl) {
    let pathname = parsedUrl.pathname;
    if (pathname === '/') pathname = '/index.html';

    let filePath = resolveStaticFile(pathname);

    // Fallback to the SPA root, matching vercel.json's catch-all rewrite.
    if (!filePath) filePath = path.join(ROOT, 'index.html');

    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.statusCode = 404;
            res.end('Not found');
            return;
        }
        const ext = path.extname(filePath).toLowerCase();
        res.setHeader('Content-Type', MIME[ext] || 'application/octet-stream');
        res.statusCode = 200;
        res.end(data);
    });
}

const server = http.createServer((req, res) => {
    const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    if (parsedUrl.pathname.startsWith('/api/')) {
        handleApi(req, res, parsedUrl).catch((err) => {
            console.error('Unhandled API error:', err);
            if (!res.headersSent) {
                res.statusCode = 500;
                res.end('Internal Server Error');
            }
        });
    } else {
        serveStatic(req, res, parsedUrl);
    }
});

server.listen(PORT, () => {
    console.log(`Dev server running at http://localhost:${PORT}`);
    console.log(`  Static site + /api/* handlers (DB: ${process.env.DB_HOST}:${process.env.DB_PORT || 3306}/${process.env.DB_NAME})`);
});
