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
});

// Navigation Scroll Effect
window.addEventListener('scroll', () => {
    const nav = document.querySelector('.glass-nav');
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
const links = document.querySelectorAll('a, button, input, textarea, .glass-card');

document.addEventListener('mousemove', (e) => {
    const x = e.clientX;
    const y = e.clientY;

    // Smoothly follow
    cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    follower.style.transform = `translate3d(${x - 12}px, ${y - 12}px, 0)`;
});

// Cursor Hover Effects
links.forEach(link => {
    link.addEventListener('mouseenter', () => {
        cursor.style.transform += ' scale(2.5)';
        cursor.style.backgroundColor = 'white';
        follower.style.transform += ' scale(1.5)';
        follower.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
    });

    link.addEventListener('mouseleave', () => {
        cursor.style.transform = cursor.style.transform.replace(' scale(2.5)', '');
        cursor.style.backgroundColor = 'var(--accent-primary)';
        follower.style.transform = follower.style.transform.replace(' scale(1.5)', '');
        follower.style.backgroundColor = 'rgba(255, 107, 43, 0.2)';
    });
});


// Active Link Tracking
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
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

document.querySelectorAll('.glass-card, .section-header, .hero-content, .hero-card-wrap').forEach(el => {
    observer.observe(el);
});

// Form Submission
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const submitBtn = contactForm.querySelector('.submit-btn');
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
