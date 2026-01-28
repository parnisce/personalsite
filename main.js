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
                submitBtn.disabled = false;
            }, 3000);
        }, 1500);
    });
}
