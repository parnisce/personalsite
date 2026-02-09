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
const projectCards = document.querySelectorAll('.project-grid .project-card, .projects-grid .project-card'); // Supporting both naming conventions if any

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Update active button
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

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
const closeModalBtn = modal.querySelector('.close-modal');
const modalOverlay = modal.querySelector('.modal-overlay');
const projectBtns = document.querySelectorAll('.view-project-btn');

const openModal = (projectCard) => {
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
    modal.classList.remove('active');
    body.style.overflow = 'auto';
};

projectBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const projectCard = btn.closest('.project-card');
        openModal(projectCard);
    });
});

closeModalBtn.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', closeModal);

// Close on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
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

// Dynamic Testimonials Logic
async function loadTestimonials() {
    const track = document.getElementById('testimonial-track');
    const dotsContainer = document.getElementById('slider-dots');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    if (!track) return;

    try {
        const response = await fetch('/api/testimonials');
        const testimonials = await response.json();

        if (!testimonials || testimonials.length === 0) {
            track.innerHTML = '<div class="slider-slide"><div class="testimonial-card"><p class="testimonial-text">No testimonials yet. Be the first!</p></div></div>';
            return;
        }

        // Render slides
        track.innerHTML = testimonials.map(t => `
            <div class="slider-slide">
                <div class="testimonial-card">
                    <div class="quote-icon"><i data-lucide="quote"></i></div>
                    <p class="testimonial-text">"${t.text}"</p>
                    <div class="testimonial-author">
                        <div class="author-avatar">${t.avatar_url ? `<img src="${t.avatar_url}" alt="${t.name}">` : (t.name.split(' ').map(n => n[0]).join('') || 'U')}</div>
                        <div class="author-info">
                            <div class="author-name">${t.name}</div>
                            <div class="author-role">${t.role || ''}</div>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

        // Render dots
        dotsContainer.innerHTML = testimonials.map((_, i) => `
            <button class="slider-dot ${i === 0 ? 'active' : ''}" data-index="${i}"></button>
        `).join('');

        if (window.lucide) window.lucide.createIcons();

        // Initialize Slider Logic
        initSlider(testimonials.length);

    } catch (error) {
        console.error('Error loading testimonials:', error);
    }
}

function initSlider(slideCount) {
    const track = document.getElementById('testimonial-track');
    const dots = document.querySelectorAll('.slider-dot');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    let currentSlide = 0;

    const updateSlider = () => {
        track.style.transform = `translateX(-${currentSlide * 100}%)`;
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlide);
        });
    };

    nextBtn?.addEventListener('click', () => {
        currentSlide = (currentSlide + 1) % slideCount;
        updateSlider();
    });

    prevBtn?.addEventListener('click', () => {
        currentSlide = (currentSlide - 1 + slideCount) % slideCount;
        updateSlider();
    });

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            currentSlide = parseInt(dot.dataset.index);
            updateSlider();
        });
    });

    // Auto-play
    setInterval(() => {
        if (slideCount > 1) {
            currentSlide = (currentSlide + 1) % slideCount;
            updateSlider();
        }
    }, 8000);
}

// Call on load
document.addEventListener('DOMContentLoaded', () => {
    loadTestimonials();
});

