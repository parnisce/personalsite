// DOM Elements
const loginScreen = document.getElementById('login-screen');
const adminDashboard = document.getElementById('admin-dashboard');
const loginForm = document.getElementById('login-form');
const authError = document.getElementById('auth-error');
const logoutBtn = document.getElementById('logout-btn');

// Projects Elements
const addProjectBtn = document.getElementById('add-project-btn');
const projectModal = document.getElementById('project-modal');
const projectForm = document.getElementById('project-form');
const projectsTableBody = document.getElementById('projects-table-body');
const emptyState = document.getElementById('empty-state');
const searchInput = document.getElementById('search-projects');

// Blog Elements
const addBlogBtn = document.getElementById('add-blog-btn');
const blogModal = document.getElementById('blog-modal');
const blogForm = document.getElementById('blog-form');
const blogTableBody = document.getElementById('blog-table-body');
const blogEmptyState = document.getElementById('blog-empty-state');
const blogSearchInput = document.getElementById('search-blog');

// Testimonial Elements
const addTestimonialBtn = document.getElementById('add-testimonial-btn');
const testimonialModal = document.getElementById('testimonial-modal');
const testimonialForm = document.getElementById('testimonial-form');
const testimonialsTableBody = document.getElementById('testimonials-table-body');
const testimonialEmptyState = document.getElementById('testimonial-empty-state');
const testimonialSearchInput = document.getElementById('search-testimonials');

// Tabs
const tabBtns = document.querySelectorAll('.admin-tab');
const tabContents = document.querySelectorAll('.tab-content');

// API relative path
const API_BASE = '/api';

let currentUser = null;
let allProjects = [];
let allBlogPosts = [];
let allTestimonials = [];

// Initialize Lucide icons
lucide.createIcons();

// --- AUTHENTICATION LOGIC ---

const getToken = () => localStorage.getItem('adminToken');

async function authFetch(url, options = {}) {
    const token = getToken();
    const headers = options.headers || {};
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return fetch(url, { ...options, headers });
}

checkAuth();

async function checkAuth() {
    try {
        const response = await authFetch(`${API_BASE}/auth?action=check`);
        const data = await response.json();

        if (data.authenticated) {
            currentUser = data.user;
            showDashboard();
            loadAllData();
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

function loadAllData() {
    loadProjects();
    loadBlogPosts();
    loadTestimonials();
}

// Login Handler
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    authError.classList.remove('show');
    authError.textContent = 'Logging in...';
    authError.classList.add('show');

    try {
        const response = await fetch(`${API_BASE}/auth?action=login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (data.success && data.token) {
            localStorage.setItem('adminToken', data.token);
            currentUser = data.user;
            showDashboard();
            loadAllData();
        } else {
            authError.textContent = data.message || data.error || 'Login failed';
            authError.classList.add('show');
        }
    } catch (error) {
        console.error('Login Error:', error);
        authError.textContent = 'Network error: ' + error.message;
        authError.classList.add('show');
    }
});

logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('adminToken');
    currentUser = null;
    showLogin();
});

// --- TAB SWITCHING ---
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));

        btn.classList.add('active');
        document.getElementById(`${tab}-section`).classList.add('active');
        lucide.createIcons();
    });
});

// --- PROJECTS MANAGEMENT ---

async function loadProjects() {
    try {
        const response = await fetch(`${API_BASE}/projects`);
        const data = await response.json();
        if (Array.isArray(data)) {
            allProjects = data;
            renderProjects(allProjects);
        }
    } catch (error) {
        console.error('Error loading projects:', error);
    }
}

function renderProjects(projects) {
    if (projects.length === 0) {
        projectsTableBody.innerHTML = '';
        emptyState.style.display = 'block';
    } else {
        emptyState.style.display = 'none';
        projectsTableBody.innerHTML = projects.map(project => `
            <tr>
                <td><strong>${project.title}</strong></td>
                <td>
                    <div class="category-badges">
                        ${(project.category || '').split(' ').map(cat => `<span class="category-badge">${cat}</span>`).join('')}
                    </div>
                </td>
                <td class="tech-list">${project.tech_stack}</td>
                <td><a href="${project.link}" target="_blank" class="project-link">View <i data-lucide="external-link"></i></a></td>
                <td>
                    <div class="table-actions-cell">
                        <button class="icon-btn-small edit-project-btn" data-id="${project.id}"><i data-lucide="edit"></i></button>
                        <button class="icon-btn-small delete delete-project-btn" data-id="${project.id}"><i data-lucide="trash-2"></i></button>
                    </div>
                </td>
            </tr>
        `).join('');
    }
    lucide.createIcons();
    attachProjectEvents();
}

function attachProjectEvents() {
    document.querySelectorAll('.edit-project-btn').forEach(btn => btn.addEventListener('click', () => editProject(btn.dataset.id)));
    document.querySelectorAll('.delete-project-btn').forEach(btn => btn.addEventListener('click', () => deleteProject(btn.dataset.id)));
}

searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = allProjects.filter(p => p.title.toLowerCase().includes(term) || (p.category || '').toLowerCase().includes(term));
    renderProjects(filtered);
});

addProjectBtn.addEventListener('click', () => {
    document.getElementById('modal-title').textContent = 'Add New Project';
    projectForm.reset();
    document.getElementById('project-id').value = '';
    openModal(projectModal);
});

function editProject(id) {
    const p = allProjects.find(item => item.id == id);
    if (!p) return;
    document.getElementById('modal-title').textContent = 'Edit Project';
    document.getElementById('project-id').value = p.id;
    document.getElementById('project-title').value = p.title;
    document.getElementById('project-link').value = p.link;
    document.getElementById('project-short-desc').value = p.short_description;
    document.getElementById('project-description').value = p.description;
    document.getElementById('project-tech').value = p.tech_stack;
    document.getElementById('project-image').value = p.image_url;
    document.getElementById('project-category').value = p.category;
    document.getElementById('project-badges').value = p.badges;
    openModal(projectModal);
}

async function deleteProject(id) {
    if (!confirm('Delete this project?')) return;
    try {
        const response = await authFetch(`${API_BASE}/projects?id=${id}`, { method: 'DELETE' });
        if ((await response.json()).success) loadProjects();
    } catch (e) { alert('Error deleting project'); }
}

projectForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('project-id').value;
    const data = {
        title: document.getElementById('project-title').value,
        link: document.getElementById('project-link').value,
        short_description: document.getElementById('project-short-desc').value,
        description: document.getElementById('project-description').value,
        tech_stack: document.getElementById('project-tech').value,
        image_url: document.getElementById('project-image').value,
        category: document.getElementById('project-category').value,
        badges: document.getElementById('project-badges').value
    };
    if (id) data.id = id;
    try {
        const res = await authFetch(`${API_BASE}/projects`, {
            method: id ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if ((await res.json()).success) {
            closeModal(projectModal);
            loadProjects();
        }
    } catch (e) { alert('Error saving project'); }
});

// --- BLOG MANAGEMENT ---

async function loadBlogPosts() {
    try {
        const response = await fetch(`${API_BASE}/blog`);
        const data = await response.json();
        if (Array.isArray(data)) {
            allBlogPosts = data;
            renderBlogPosts(allBlogPosts);
        }
    } catch (error) {
        console.error('Error loading blog posts:', error);
    }
}

function renderBlogPosts(posts) {
    if (posts.length === 0) {
        blogTableBody.innerHTML = '';
        blogEmptyState.style.display = 'block';
    } else {
        blogEmptyState.style.display = 'none';
        blogTableBody.innerHTML = posts.map(post => `
            <tr>
                <td><strong>${post.title}</strong></td>
                <td><code>${post.slug}</code></td>
                <td><span class="category-badge">${post.category || 'Uncategorized'}</span></td>
                <td>${new Date(post.published_at).toLocaleDateString()}</td>
                <td>
                    <div class="table-actions-cell">
                        <button class="icon-btn-small edit-blog-btn" data-id="${post.id}"><i data-lucide="edit"></i></button>
                        <button class="icon-btn-small delete delete-blog-btn" data-id="${post.id}"><i data-lucide="trash-2"></i></button>
                    </div>
                </td>
            </tr>
        `).join('');
    }
    lucide.createIcons();
    attachBlogEvents();
}

function attachBlogEvents() {
    document.querySelectorAll('.edit-blog-btn').forEach(btn => btn.addEventListener('click', () => editBlogPost(btn.dataset.id)));
    document.querySelectorAll('.delete-blog-btn').forEach(btn => btn.addEventListener('click', () => deleteBlogPost(btn.dataset.id)));
}

blogSearchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = allBlogPosts.filter(p => p.title.toLowerCase().includes(term) || (p.category || '').toLowerCase().includes(term));
    renderBlogPosts(filtered);
});

addBlogBtn.addEventListener('click', () => {
    document.getElementById('blog-modal-title').textContent = 'Add New Blog Post';
    blogForm.reset();
    document.getElementById('blog-id').value = '';
    openModal(blogModal);
});

function editBlogPost(id) {
    const p = allBlogPosts.find(item => item.id == id);
    if (!p) return;
    document.getElementById('blog-modal-title').textContent = 'Edit Blog Post';
    document.getElementById('blog-id').value = p.id;
    document.getElementById('blog-title').value = p.title;
    document.getElementById('blog-slug').value = p.slug;
    document.getElementById('blog-excerpt').value = p.excerpt;
    document.getElementById('blog-content').value = p.content;
    document.getElementById('blog-category').value = p.category;
    document.getElementById('blog-image').value = p.image_url;
    openModal(blogModal);
}

async function deleteBlogPost(id) {
    if (!confirm('Delete this blog post?')) return;
    try {
        const response = await authFetch(`${API_BASE}/blog?id=${id}`, { method: 'DELETE' });
        if ((await response.json()).success) loadBlogPosts();
    } catch (e) { alert('Error deleting blog post'); }
}

blogForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('blog-id').value;
    const data = {
        title: document.getElementById('blog-title').value,
        slug: document.getElementById('blog-slug').value,
        excerpt: document.getElementById('blog-excerpt').value,
        content: document.getElementById('blog-content').value,
        category: document.getElementById('blog-category').value,
        image_url: document.getElementById('blog-image').value
    };
    if (id) data.id = id;
    try {
        const res = await authFetch(`${API_BASE}/blog`, {
            method: id ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if ((await res.json()).success) {
            closeModal(blogModal);
            loadBlogPosts();
        }
    } catch (e) { alert('Error saving blog post'); }
});

// --- TESTIMONIAL MANAGEMENT ---

async function loadTestimonials() {
    try {
        const response = await fetch(`${API_BASE}/testimonials`);
        const data = await response.json();
        if (Array.isArray(data)) {
            allTestimonials = data;
            renderTestimonials(allTestimonials);
        }
    } catch (error) {
        console.error('Error loading testimonials:', error);
    }
}

function renderTestimonials(items) {
    if (items.length === 0) {
        testimonialsTableBody.innerHTML = '';
        testimonialEmptyState.style.display = 'block';
    } else {
        testimonialEmptyState.style.display = 'none';
        testimonialsTableBody.innerHTML = items.map(item => `
            <tr>
                <td><strong>${item.name}</strong></td>
                <td>${item.role}</td>
                <td class="tech-list">${item.text.substring(0, 50)}...</td>
                <td>
                    <div class="table-actions-cell">
                        <button class="icon-btn-small edit-testimonial-btn" data-id="${item.id}"><i data-lucide="edit"></i></button>
                        <button class="icon-btn-small delete delete-testimonial-btn" data-id="${item.id}"><i data-lucide="trash-2"></i></button>
                    </div>
                </td>
            </tr>
        `).join('');
    }
    lucide.createIcons();
    attachTestimonialEvents();
}

function attachTestimonialEvents() {
    document.querySelectorAll('.edit-testimonial-btn').forEach(btn => btn.addEventListener('click', () => editTestimonial(btn.dataset.id)));
    document.querySelectorAll('.delete-testimonial-btn').forEach(btn => btn.addEventListener('click', () => deleteTestimonial(btn.dataset.id)));
}

testimonialSearchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = allTestimonials.filter(t => t.name.toLowerCase().includes(term) || t.text.toLowerCase().includes(term));
    renderTestimonials(filtered);
});

addTestimonialBtn.addEventListener('click', () => {
    document.getElementById('testimonial-modal-title').textContent = 'Add New Testimonial';
    testimonialForm.reset();
    document.getElementById('testimonial-id').value = '';
    openModal(testimonialModal);
});

function editTestimonial(id) {
    const t = allTestimonials.find(item => item.id == id);
    if (!t) return;
    document.getElementById('testimonial-modal-title').textContent = 'Edit Testimonial';
    document.getElementById('testimonial-id').value = t.id;
    document.getElementById('testimonial-name').value = t.name;
    document.getElementById('testimonial-role').value = t.role;
    document.getElementById('testimonial-text').value = t.text;
    document.getElementById('testimonial-avatar').value = t.avatar_url;
    openModal(testimonialModal);
}

async function deleteTestimonial(id) {
    if (!confirm('Delete this testimonial?')) return;
    try {
        const response = await authFetch(`${API_BASE}/testimonials?id=${id}`, { method: 'DELETE' });
        if ((await response.json()).success) loadTestimonials();
    } catch (e) { alert('Error deleting testimonial'); }
}

testimonialForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('testimonial-id').value;
    const data = {
        name: document.getElementById('testimonial-name').value,
        role: document.getElementById('testimonial-role').value,
        text: document.getElementById('testimonial-text').value,
        avatar_url: document.getElementById('testimonial-avatar').value
    };
    if (id) data.id = id;
    try {
        const res = await authFetch(`${API_BASE}/testimonials`, {
            method: id ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if ((await res.json()).success) {
            closeModal(testimonialModal);
            loadTestimonials();
        }
    } catch (e) { alert('Error saving testimonial'); }
});

// --- MODAL CONTROLS ---

function openModal(modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    lucide.createIcons();
}

function closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

document.querySelectorAll('.close-modal, .cancel-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        closeModal(projectModal);
        closeModal(blogModal);
        closeModal(testimonialModal);
    });
});

document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', () => {
        closeModal(projectModal);
        closeModal(blogModal);
        closeModal(testimonialModal);
    });
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal(projectModal);
        closeModal(blogModal);
        closeModal(testimonialModal);
    }
});
