// DOM Elements
const loginScreen = document.getElementById('login-screen');
const adminDashboard = document.getElementById('admin-dashboard');
const loginForm = document.getElementById('login-form');
const authError = document.getElementById('auth-error');
const logoutBtn = document.getElementById('logout-btn');
const addProjectBtn = document.getElementById('add-project-btn');
const projectModal = document.getElementById('project-modal');
const projectForm = document.getElementById('project-form');
const closeModalBtn = projectModal.querySelector('.close-modal');
const cancelBtn = projectModal.querySelector('.cancel-btn');
const modalOverlay = projectModal.querySelector('.modal-overlay');
const projectsTableBody = document.getElementById('projects-table-body');
const emptyState = document.getElementById('empty-state');
const searchInput = document.getElementById('search-projects');

// Access the API relative to the current path
const API_BASE = '/api';

let currentUser = null;
let allProjects = [];

// Initialize Lucide icons
lucide.createIcons();

// --- AUTHENTICATION LOGIC ---

// Get token from storage
const getToken = () => localStorage.getItem('adminToken');

// API Wrapper fetch function
async function authFetch(url, options = {}) {
    const token = getToken();
    const headers = options.headers || {};
    if (token) {
        headers['Authorization'] = `Bearer ${token}`; // Send token!
    }
    return fetch(url, { ...options, headers });
}

// Check if user is already logged in
checkAuth();

async function checkAuth() {
    try {
        const response = await authFetch(`${API_BASE}/auth?action=check`);
        const data = await response.json();

        if (data.authenticated) {
            currentUser = data.user;
            showDashboard();
            loadProjects();
        } else {
            showLogin();
        }
    } catch (error) {
        console.error('Auth check failed:', error);
        showLogin();
    }
}

function showLogin() {
    loginScreen.style.display = 'flex';
    adminDashboard.style.display = 'none';
}

function showDashboard() {
    loginScreen.style.display = 'none';
    adminDashboard.style.display = 'block';
    lucide.createIcons();
}

// Login Handler
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    authError.classList.remove('show');

    try {
        const response = await fetch(`${API_BASE}/auth?action=login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (data.success && data.token) {
            // Save token
            localStorage.setItem('adminToken', data.token);
            currentUser = data.user;
            showDashboard();
            loadProjects();
        } else {
            authError.textContent = data.error || 'Login failed';
            authError.classList.add('show');
        }
    } catch (error) {
        authError.textContent = 'Network error. Please try again.';
        authError.classList.add('show');
    }
});

// Logout Handler
logoutBtn.addEventListener('click', async () => {
    localStorage.removeItem('adminToken'); // Clear token
    currentUser = null;
    showLogin();
});

// Load Projects
async function loadProjects() {
    try {
        const response = await fetch(`${API_BASE}/projects`);
        const data = await response.json();

        if (Array.isArray(data)) {
            allProjects = data;
            renderProjects(allProjects);
        } else {
            console.error('Error loading projects:', data.error);
        }
    } catch (error) {
        console.error('Network error loading projects:', error);
    }
}

// Render Projects
function renderProjects(projects) {
    if (projects.length === 0) {
        projectsTableBody.innerHTML = '';
        emptyState.style.display = 'block';
        lucide.createIcons();
        return;
    }

    emptyState.style.display = 'none';

    projectsTableBody.innerHTML = projects.map(project => `
        <tr data-id="${project.id}">
            <td><strong>${project.title}</strong></td>
            <td>
                <div class="category-badges">
                    ${(project.category || '').split(' ').map(cat =>
        `<span class="category-badge">${cat}</span>`
    ).join('')}
                </div>
            </td>
            <td class="tech-list">${project.tech_stack}</td>
            <td>
                <a href="${project.link}" target="_blank" class="project-link">
                    <span>View</span>
                    <i data-lucide="external-link"></i>
                </a>
            </td>
            <td>
                <div class="table-actions-cell">
                    <button class="icon-btn-small edit-btn" data-id="${project.id}" title="Edit">
                        <i data-lucide="edit"></i>
                    </button>
                    <button class="icon-btn-small delete delete-btn" data-id="${project.id}" title="Delete">
                        <i data-lucide="trash-2"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');

    lucide.createIcons();

    // Attach event listeners
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', () => editProject(btn.dataset.id));
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => deleteProject(btn.dataset.id));
    });
}

// Search Projects
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();

    const filtered = allProjects.filter(project =>
        (project.title || '').toLowerCase().includes(searchTerm) ||
        (project.category || '').toLowerCase().includes(searchTerm) ||
        (project.tech_stack || '').toLowerCase().includes(searchTerm)
    );

    renderProjects(filtered);
});

// Open Modal for New Project
addProjectBtn.addEventListener('click', () => {
    document.getElementById('modal-title').textContent = 'Add New Project';
    projectForm.reset();
    document.getElementById('project-id').value = '';
    openModal();
});

// Edit Project
function editProject(id) {
    const project = allProjects.find(p => p.id == id);
    if (!project) return;

    document.getElementById('modal-title').textContent = 'Edit Project';
    document.getElementById('project-id').value = project.id;
    document.getElementById('project-title').value = project.title;
    document.getElementById('project-link').value = project.link;
    document.getElementById('project-short-desc').value = project.short_description;
    document.getElementById('project-description').value = project.description;
    document.getElementById('project-tech').value = project.tech_stack;
    document.getElementById('project-image').value = project.image_url;
    document.getElementById('project-category').value = project.category;
    document.getElementById('project-badges').value = project.badges;

    openModal();
}

// Delete Project (Protected)
async function deleteProject(id) {
    if (!confirm('Are you sure you want to delete this project?')) {
        return;
    }

    try {
        const response = await authFetch(`${API_BASE}/projects?id=${id}`, {
            method: 'DELETE'
        });

        const data = await response.json();

        if (data.success) {
            loadProjects();
        } else {
            alert('Failed to delete project: ' + (data.error || 'Authenication failed or unknown error'));
        }
    } catch (error) {
        console.error('Error deleting project:', error);
        alert('Network error while deleting');
    }
}

// Save Project (Protected)
projectForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const projectId = document.getElementById('project-id').value;
    const projectData = {
        title: document.getElementById('project-title').value,
        link: document.getElementById('project-link').value,
        short_description: document.getElementById('project-short-desc').value,
        description: document.getElementById('project-description').value,
        tech_stack: document.getElementById('project-tech').value,
        image_url: document.getElementById('project-image').value,
        category: document.getElementById('project-category').value,
        badges: document.getElementById('project-badges').value
    };

    const url = `${API_BASE}/projects`;
    const method = projectId ? 'PUT' : 'POST';
    if (projectId) projectData.id = projectId;

    try {
        const response = await authFetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(projectData)
        });

        const data = await response.json();
        if (!data.success) throw new Error(data.error);

        closeModal();
        loadProjects();

    } catch (error) {
        console.error('Error saving project:', error);
        alert('Failed to save project: ' + error.message);
    }
});

// Modal Controls
function openModal() {
    projectModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    lucide.createIcons();
}

function closeModal() {
    projectModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

closeModalBtn.addEventListener('click', closeModal);
cancelBtn.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', closeModal);

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && projectModal.classList.contains('active')) {
        closeModal();
    }
});
