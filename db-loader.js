// Load projects from PHP API
// Access the API relative to the current path
const API_URL = 'api/projects.php';

async function loadProjectsFromDatabase() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        if (Array.isArray(data)) {
            renderDatabaseProjects(data);
        } else {
            console.error('Error loading projects:', data.error);
        }
    } catch (error) {
        console.error('Network error loading projects:', error);
    }
}

// Render projects dynamically
function renderDatabaseProjects(projects) {
    const projectsGrid = document.querySelector('.projects-grid');
    if (!projectsGrid) return;

    // Clear existing projects
    projectsGrid.innerHTML = '';

    projects.forEach((project, index) => {
        const overlayClass = index % 3 === 0 ? '' : index % 3 === 1 ? 'overlay-2' : 'overlay-3';

        const projectCard = document.createElement('div');
        projectCard.className = 'project-card glass-card h-full';
        projectCard.setAttribute('data-category', project.category || '');
        projectCard.setAttribute('data-title', project.title || '');
        projectCard.setAttribute('data-desc', project.description || '');
        projectCard.setAttribute('data-tech', project.tech_stack || '');
        projectCard.setAttribute('data-link', project.link || '');

        const badges = (project.badges || '').split(',').map(badge =>
            `<span class="proj-badge">${badge.trim()}</span>`
        ).join('');

        projectCard.innerHTML = `
            <div class="project-preview">
                <div class="preview-overlay ${overlayClass}"></div>
                <img src="${project.image_url}" alt="${project.title}" class="project-img">
                <div class="project-badges">
                    ${badges}
                </div>
            </div>
            <div class="project-info">
                <h3>${project.title}</h3>
                <p>${project.short_description}</p>
                <button class="view-project-btn view-project">View Project <i data-lucide="arrow-right"></i></button>
            </div>
        `;

        projectsGrid.appendChild(projectCard);
    });

    // Reinitialize Lucide icons
    if (window.lucide) {
        window.lucide.createIcons();
    }

    // Reinitialize project modal listeners
    initializeProjectModals();

    // Reinitialize scroll animations
    initializeScrollAnimations();
}

// Initialize project modal listeners
function initializeProjectModals() {
    const modal = document.getElementById('project-modal');
    // If modal doesn't exist on page (e.g. slight structure change), return
    if (!modal) return;

    const closeModalBtn = modal.querySelector('.close-modal');
    const modalOverlay = modal.querySelector('.modal-overlay');
    const projectBtns = document.querySelectorAll('.view-project-btn');
    const body = document.body;

    const openModal = (projectCard) => {
        const title = projectCard.getAttribute('data-title');
        const desc = projectCard.getAttribute('data-desc');
        const tech = projectCard.getAttribute('data-tech').split(',');
        const link = projectCard.getAttribute('data-link');

        const modalTitle = document.getElementById('modal-title');
        const modalDesc = document.getElementById('modal-description');
        const modalLink = document.getElementById('modal-link');
        const techStackWrap = document.getElementById('modal-tech-stack');

        if (modalTitle) modalTitle.textContent = title;
        if (modalDesc) modalDesc.textContent = desc;
        if (modalLink) modalLink.setAttribute('href', link);

        if (techStackWrap) {
            techStackWrap.innerHTML = '';
            tech.forEach(item => {
                const badge = document.createElement('span');
                badge.className = 'tech-badge';
                badge.textContent = item.trim();
                techStackWrap.appendChild(badge);
            });
        }

        modal.classList.add('active');
        body.style.overflow = 'hidden';
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

    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (modalOverlay) modalOverlay.addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

// Initialize scroll animations
function initializeScrollAnimations() {
    if (!window.IntersectionObserver) return;

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

    document.querySelectorAll('.project-card').forEach(el => {
        observer.observe(el);
    });
}

// Load projects when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadProjectsFromDatabase();
});
