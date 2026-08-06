// Experience page — scroll reveals, timeline progress, stat counters
(function () {
    const revealEls = document.querySelectorAll('.exp-reveal');
    const timeline = document.querySelector('[data-timeline]');
    const progress = document.querySelector('.timeline-progress');
    const items = document.querySelectorAll('.timeline-item');

    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    revealEls.forEach((el) => revealObserver.observe(el));

    // Timeline progress fill based on scroll through timeline
    const updateProgress = () => {
        if (!timeline || !progress) return;
        const rect = timeline.getBoundingClientRect();
        const viewH = window.innerHeight || document.documentElement.clientHeight;
        const start = viewH * 0.65;
        const end = rect.height + viewH * 0.2;
        const traveled = start - rect.top;
        const pct = Math.max(0, Math.min(1, traveled / end));
        progress.style.height = `${pct * 100}%`;

        items.forEach((item) => {
            const r = item.getBoundingClientRect();
            if (r.top < viewH * 0.7) item.classList.add('is-visible');
        });
    };

    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
    updateProgress();

    // Animated stat counters
    const animateCount = (el) => {
        const target = parseInt(el.getAttribute('data-count'), 10) || 0;
        const duration = 1100;
        const start = performance.now();

        const tick = (now) => {
            const t = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - t, 3);
            el.textContent = Math.round(target * eased);
            if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    };

    const stats = document.querySelectorAll('.exp-stat-value[data-count]');
    const statsObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    animateCount(entry.target);
                    statsObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.5 }
    );
    stats.forEach((el) => statsObserver.observe(el));

    if (window.lucide) window.lucide.createIcons();
})();
