// api/pagespeed.js — proxy Google PageSpeed Insights with cached fallback
const https = require('https');

const FALLBACK = {
    url: 'https://cyrylbitangcol.com/',
    strategy: 'mobile',
    fetchedAt: '2026-09-22T06:20:00.000Z',
    source: 'lighthouse-local-fallback',
    scores: {
        performance: 65,
        accessibility: 81,
        'best-practices': 96,
        seo: 100
    }
};

function fetchJson(url) {
    return new Promise((resolve, reject) => {
        https
            .get(url, (res) => {
                let raw = '';
                res.on('data', (chunk) => (raw += chunk));
                res.on('end', () => {
                    try {
                        resolve({ status: res.statusCode, body: JSON.parse(raw) });
                    } catch (err) {
                        reject(err);
                    }
                });
            })
            .on('error', reject);
    });
}

module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'GET') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    const target = (req.query && req.query.url) || 'https://cyrylbitangcol.com/';
    const strategy = (req.query && req.query.strategy) || 'mobile';
    const key = process.env.PAGESPEED_API_KEY || process.env.GOOGLE_PSI_API_KEY || '';

    const categories = ['performance', 'accessibility', 'best-practices', 'seo'];
    const params = new URLSearchParams({
        url: target,
        strategy
    });
    categories.forEach((c) => params.append('category', c));
    if (key) params.set('key', key);

    const endpoint = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?${params.toString()}`;

    try {
        const { status, body } = await fetchJson(endpoint);
        if (status >= 400 || body.error || !body.lighthouseResult) {
            return res.status(200).json({
                ...FALLBACK,
                url: target,
                strategy,
                warning: (body.error && body.error.message) || `PSI HTTP ${status}`
            });
        }

        const cats = body.lighthouseResult.categories || {};
        const scores = {};
        for (const [id, cat] of Object.entries(cats)) {
            scores[id] = cat.score == null ? null : Math.round(cat.score * 100);
        }

        return res.status(200).json({
            url: target,
            strategy,
            fetchedAt: new Date().toISOString(),
            source: 'pagespeed-insights',
            scores
        });
    } catch (err) {
        return res.status(200).json({
            ...FALLBACK,
            url: target,
            strategy,
            warning: err.message || 'PSI request failed'
        });
    }
};
