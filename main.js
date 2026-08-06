// Initialize Lucide icons
lucide.createIcons();

// Theme Toggle Logic
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Check for saved theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    body.className = savedTheme;
}

themeToggle.addEventListener('click', () => {
    if (body.classList.contains('dark-mode')) {
        body.classList.replace('dark-mode', 'light-mode');
        localStorage.setItem('theme', 'light-mode');
    } else {
        body.classList.replace('light-mode', 'dark-mode');
        localStorage.setItem('theme', 'dark-mode');
    }
    // Refresh icons if needed
    lucide.createIcons();
});

// Mobile Menu Toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mobileMenuIcon = mobileMenuBtn.querySelector('i');

mobileMenuBtn.addEventListener('click', () => {
    body.classList.toggle('mobile-menu-active');
    const isActive = body.classList.contains('mobile-menu-active');
    mobileMenuIcon.setAttribute('data-lucide', isActive ? 'x' : 'menu');
    lucide.createIcons();
});

// Close menu on link click
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        body.classList.remove('mobile-menu-active');
        mobileMenuIcon.setAttribute('data-lucide', 'menu');
        lucide.createIcons();
    });
});

// Navigation Scroll Effect
window.addEventListener('scroll', () => {
    const nav = document.querySelector('.glass-nav');
    if (!nav) return;
    if (window.scrollY > 50) {
        nav.style.top = '1rem';
        nav.style.background = 'rgba(255, 255, 255, 0.05)';
        nav.style.padding = '0.5rem 2rem';
    } else {
        nav.style.top = '1.5rem';
        nav.style.background = 'var(--glass-bg)';
        nav.style.padding = '0.75rem 2rem';
    }
});

// Custom Cursor Logic
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');
const interactiveElements = document.querySelectorAll('a, button, input, textarea, .glass-card, .project-card');

if (cursor && follower) {
    document.addEventListener('mousemove', (e) => {
        const x = e.clientX;
        const y = e.clientY;

        // Smoothly follow
        cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        follower.style.transform = `translate3d(${x - 12}px, ${y - 12}px, 0)`;
    });

    // Cursor Hover Effects
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform += ' scale(2.5)';
            cursor.style.backgroundColor = 'white';
            follower.style.transform += ' scale(1.5)';
            follower.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        });

        el.addEventListener('mouseleave', () => {
            cursor.style.transform = cursor.style.transform.replace(' scale(2.5)', '');
            cursor.style.backgroundColor = 'var(--accent-primary)';
            follower.style.transform = follower.style.transform.replace(' scale(1.5)', '');
            follower.style.backgroundColor = 'rgba(255, 107, 43, 0.2)';
        });
    });
}

// Active Link Tracking
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Scroll Reveal Animation
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.glass-card, .section-header, .hero-content, .hero-card-wrap, .project-card').forEach(el => {
    observer.observe(el);
});

// Project Filtering Logic
const filterBtns = document.querySelectorAll('.filter-btn');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Update active button
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');
        const projectCards = document.querySelectorAll('.projects-grid .project-card, .project-grid .project-card');

        projectCards.forEach(card => {
            const categories = card.getAttribute('data-category') ? card.getAttribute('data-category').split(' ') : [];

            if (filterValue === 'all' || categories.includes(filterValue)) {
                card.classList.remove('hidden');
                setTimeout(() => {
                    card.classList.remove('fade-out');
                }, 10);
            } else {
                card.classList.add('fade-out');
                setTimeout(() => {
                    card.classList.add('hidden');
                }, 400);
            }
        });
    });
});


// Project Modal Logic
const modal = document.getElementById('project-modal');
const closeModalBtn = modal ? modal.querySelector('.close-modal') : null;
const modalOverlay = modal ? modal.querySelector('.modal-overlay') : null;
const projectBtns = document.querySelectorAll('.view-project-btn');

const openModal = (projectCard) => {
    if (!modal) return;
    const title = projectCard.getAttribute('data-title');
    const desc = projectCard.getAttribute('data-desc');
    const tech = projectCard.getAttribute('data-tech').split(',');
    const link = projectCard.getAttribute('data-link');

    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-description').textContent = desc;
    document.getElementById('modal-link').setAttribute('href', link);

    const techStackWrap = document.getElementById('modal-tech-stack');
    techStackWrap.innerHTML = '';
    tech.forEach(item => {
        const badge = document.createElement('span');
        badge.className = 'tech-badge';
        badge.textContent = item.trim();
        techStackWrap.appendChild(badge);
    });

    modal.classList.add('active');
    body.style.overflow = 'hidden'; // Prevent scrolling
};

const closeModal = () => {
    if (!modal) return;
    modal.classList.remove('active');
    body.style.overflow = 'auto';
};

projectBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const projectCard = btn.closest('.project-card');
        openModal(projectCard);
    });
});

if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
if (modalOverlay) modalOverlay.addEventListener('click', closeModal);

// Close on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
        closeModal();
    }
});

// Form Submission
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const submitBtn = contactForm.querySelector('.submit-btn');
        if (!submitBtn) return;

        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = 'Sending...';
        submitBtn.disabled = true;

        // Mock sending
        setTimeout(() => {
            submitBtn.innerHTML = 'Message Sent!';
            submitBtn.style.background = '#22c55e';
            contactForm.reset();

            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.style.background = 'var(--accent-primary)';
            }, 3000);
        }, 1500);
    });
}

// Dynamic Testimonials Logic — real recommendations from cyrylbitangcol.com
const DEFAULT_TESTIMONIALS = [
    {
        name: 'Christine Litera',
        role: 'Founder of Chrysallis - Business Lock In',
        text: "I've collaborated with Cyryl Bitangcol for several years. Cyryl has consistently supported me remotely, achieving excellent results for my online presentations. From website updates and plugin management to layout and copy updates, he tackles diverse tasks with ease.",
        avatar_url: 'https://cyrylbitangcol.com/wp-content/uploads/2024/07/1680494213655-280x280.jpg'
    },
    {
        name: 'Roger Valdez',
        role: 'Founder & CEO at Webnotik',
        text: 'Cyryl is a well-rounded web developer and excellent team member! He brings a diverse skill set to the table, proficiently handling everything from front-end design to back-end development.',
        avatar_url: 'https://cyrylbitangcol.com/wp-content/uploads/2024/07/1539587399525-280x280.jpg'
    },
    {
        name: 'Carlos Ramirez',
        role: 'CEO at Nextminds.com',
        text: 'Cyryl is not just a developer; he is also an incredibly talented graphic artist. His proficiency in creating a wide array of designs and logos is remarkable. His creative imagination and ability to translate ideas into beautiful graphics were invaluable.',
        avatar_url: 'https://cyrylbitangcol.com/wp-content/uploads/2024/07/11894063_10152948556856594_1712293888269170565_o-280x280.jpg'
    },
    {
        name: 'Henry Law',
        role: 'CEO at Skin Check WA',
        text: 'I highly recommend Cyryl Bitangcol for creating and developing websites and apps. His expertise in web and app development is exceptional, ensuring user-friendly interfaces and robust functionalities tailored to specific needs.',
        avatar_url: 'https://cyrylbitangcol.com/wp-content/uploads/2024/07/1516892674012-280x280.jpg'
    }
];

function renderStars() {
    return `<div class="testimonial-stars" aria-label="5 out of 5 stars">
        ${'<i class="fas fa-star"></i>'.repeat(5)}
    </div>`;
}

function renderTestimonialSlide(t, index) {
    const initials = (t.name || 'U').split(' ').filter(Boolean).map(n => n[0]).join('').slice(0, 2);
    const avatar = t.avatar_url
        ? `<img src="${t.avatar_url}" alt="${t.name}" loading="lazy">`
        : initials;

    return `
        <div class="slider-slide${index === 0 ? ' is-active' : ''}" data-index="${index}">
            <div class="testimonial-card glass-card">
                <div class="quote-icon"><i data-lucide="quote"></i></div>
                ${renderStars()}
                <p class="testimonial-text">"${t.text}"</p>
                <div class="testimonial-author">
                    <div class="author-avatar">${avatar}</div>
                    <div class="author-info">
                        <div class="author-name">${t.name}</div>
                        <div class="author-role">${t.role || ''}</div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderTestimonials(testimonials) {
    const track = document.getElementById('testimonial-track');
    const dotsContainer = document.getElementById('slider-dots');
    if (!track || !dotsContainer) return;

    track.innerHTML = testimonials.map((t, i) => renderTestimonialSlide(t, i)).join('');
    dotsContainer.innerHTML = testimonials.map((_, i) => `
        <button type="button" class="slider-dot ${i === 0 ? 'active' : ''}" data-index="${i}" aria-label="Go to testimonial ${i + 1}"></button>
    `).join('');

    if (window.lucide) window.lucide.createIcons();
    initSlider(testimonials.length);
}

async function loadTestimonials() {
    const track = document.getElementById('testimonial-track');
    if (!track) return;

    // Show real recommendations immediately, then upgrade from API if available
    renderTestimonials(DEFAULT_TESTIMONIALS);

    try {
        const response = await fetch('/api/testimonials');
        const testimonials = await response.json();

        if (Array.isArray(testimonials) && testimonials.length > 0) {
            renderTestimonials(testimonials);
        }
    } catch (error) {
        console.error('Error loading testimonials:', error);
    }
}

function initSlider(slideCount) {
    const track = document.getElementById('testimonial-track');
    const slider = document.querySelector('.testimonials-slider');
    const dots = document.querySelectorAll('.slider-dot');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const progress = document.getElementById('slider-progress');
    let currentSlide = 0;
    let autoplayTimer = null;
    let progressTimer = null;
    const AUTOPLAY_MS = 6000;

    if (!track || slideCount < 1) return;

    // Replace previous listeners by cloning controls
    const bindOnce = (btn, handler) => {
        if (!btn) return null;
        const clone = btn.cloneNode(true);
        btn.parentNode.replaceChild(clone, btn);
        clone.addEventListener('click', handler);
        return clone;
    };

    const updateSlider = (animate = true) => {
        if (animate) track.classList.add('is-animating');
        track.style.transform = `translateX(-${currentSlide * 100}%)`;

        track.querySelectorAll('.slider-slide').forEach((slide, i) => {
            slide.classList.toggle('is-active', i === currentSlide);
        });

        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlide);
        });

        restartProgress();
    };

    const goTo = (index) => {
        currentSlide = ((index % slideCount) + slideCount) % slideCount;
        updateSlider(true);
    };

    const next = () => goTo(currentSlide + 1);
    const prev = () => goTo(currentSlide - 1);

    bindOnce(document.getElementById('next-btn'), next);
    bindOnce(document.getElementById('prev-btn'), prev);

    dots.forEach(dot => {
        dot.addEventListener('click', () => goTo(parseInt(dot.dataset.index, 10)));
    });

    const clearAutoplay = () => {
        if (autoplayTimer) clearInterval(autoplayTimer);
        if (progressTimer) clearInterval(progressTimer);
        autoplayTimer = null;
        progressTimer = null;
    };

    const restartProgress = () => {
        if (!progress) return;
        progress.style.transition = 'none';
        progress.style.width = '0%';
        // Force reflow then animate
        void progress.offsetWidth;
        progress.style.transition = `width ${AUTOPLAY_MS}ms linear`;
        progress.style.width = '100%';
    };

    const startAutoplay = () => {
        clearAutoplay();
        if (slideCount <= 1) return;
        restartProgress();
        autoplayTimer = setInterval(next, AUTOPLAY_MS);
    };

    if (slider) {
        slider.addEventListener('mouseenter', clearAutoplay);
        slider.addEventListener('mouseleave', startAutoplay);
        slider.addEventListener('focusin', clearAutoplay);
        slider.addEventListener('focusout', startAutoplay);
    }

    // Touch / swipe
    let touchStartX = 0;
    track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        clearAutoplay();
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
        const delta = e.changedTouches[0].screenX - touchStartX;
        if (Math.abs(delta) > 50) {
            delta < 0 ? next() : prev();
        }
        startAutoplay();
    }, { passive: true });

    updateSlider(false);
    startAutoplay();
}

// Call on load
document.addEventListener('DOMContentLoaded', () => {
    loadTestimonials();
});

