/* Report Audit — auto-load PageSpeed Insights scores */
(function () {
    const SCORE_IDS = {
        performance: 'psi-performance',
        accessibility: 'psi-accessibility',
        'best-practices': 'psi-best-practices',
        seo: 'psi-seo'
    };

    const FALLBACK = {
        performance: 65,
        accessibility: 81,
        'best-practices': 96,
        seo: 100
    };

    function scoreClass(score) {
        if (score == null || Number.isNaN(score)) return 'psi-muted';
        if (score >= 90) return 'psi-good';
        if (score >= 50) return 'psi-ok';
        return 'psi-poor';
    }

    function paintScores(scores, meta) {
        Object.entries(SCORE_IDS).forEach(([key, id]) => {
            const el = document.getElementById(id);
            if (!el) return;
            const value = scores[key];
            el.textContent = value == null ? '—' : String(value);
            el.classList.remove('psi-good', 'psi-ok', 'psi-poor', 'psi-muted', 'psi-loading');
            el.classList.add(scoreClass(value));
        });

        const note = document.getElementById('psi-note');
        if (!note) return;
        const when = meta.fetchedAt ? new Date(meta.fetchedAt).toLocaleString() : 'just now';
        const source = meta.source === 'pagespeed-insights' ? 'Google PageSpeed Insights' : 'cached Lighthouse baseline';
        note.innerHTML = meta.warning
            ? `Showing <strong>${source}</strong> (${when}). Note: ${meta.warning}`
            : `Auto-loaded from <strong>${source}</strong> · ${when} · strategy: ${meta.strategy || 'mobile'}`;
    }

    async function loadPsi() {
        // Show fallback immediately so scores are never blank
        paintScores(FALLBACK, {
            source: 'lighthouse-local-fallback',
            strategy: 'mobile',
            fetchedAt: new Date().toISOString(),
            warning: 'Refreshing live PageSpeed Insights…'
        });

        const target = encodeURIComponent('https://cyrylbitangcol.com/');
        try {
            const res = await fetch(`/api/pagespeed?url=${target}&strategy=mobile`, {
                headers: { Accept: 'application/json' }
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            paintScores(data.scores || FALLBACK, data);
        } catch (err) {
            paintScores(FALLBACK, {
                source: 'lighthouse-local-fallback',
                strategy: 'mobile',
                fetchedAt: new Date().toISOString(),
                warning: err.message || 'Could not reach /api/pagespeed'
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadPsi);
    } else {
        loadPsi();
    }
})();
