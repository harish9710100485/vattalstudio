// ========================================
// VATTAL STUDIOS - UTILITY FUNCTIONS
// ========================================

// ===== SIDEBAR FUNCTIONS =====

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    if (sidebar && overlay) {
        sidebar.classList.toggle('-translate-x-full');
        overlay.classList.toggle('hidden');
        document.body.classList.toggle('overflow-hidden');
    }
}

function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    if (sidebar && overlay) {
        sidebar.classList.add('-translate-x-full');
        overlay.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
    }
}

// Close sidebar on Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeSidebar();
    }
});

// ===== SET ACTIVE SIDEBAR LINK =====

function setActiveSidebarLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const pageMap = {
        'index.html': 'sideHome',
        'login.html': 'sideLogin',
        'dashboard.html': 'sideDashboard',
        'report.html': 'sideReport'
    };

    const activeId = pageMap[currentPage];
    if (!activeId) return;

    document.querySelectorAll('.sidebar-link-dark').forEach(el => {
        el.classList.remove('active');
    });

    const activeEl = document.getElementById(activeId);
    if (activeEl) activeEl.classList.add('active');
}

// ===== DETECT ENVIRONMENT =====

function getApiUrl() {
    // Production on Vercel or Render
    if (window.location.hostname.includes('vercel.app') || 
        window.location.hostname.includes('onrender.com')) {
        return 'https://vattalstudi.onrender.com/api/v1';
    }
    // Local development
    return 'http://localhost:8000/api/v1';
}

// ===== UPDATE API_URL FOR ALL PAGES =====

// Update the global API_URL if it exists
if (typeof window.API_URL !== 'undefined') {
    window.API_URL = getApiUrl();
}

// Also store it in a constant for easy access
const API_BASE_URL = getApiUrl();

// ===== AUTHENTICATION FUNCTIONS =====

function isAdmin() {
    const userStr = localStorage.getItem('user');
    if (!userStr) return false;
    try {
        const user = JSON.parse(userStr);
        return user.role === 'admin';
    } catch (e) {
        return false;
    }
}

function isLoggedIn() {
    return !!localStorage.getItem('token');
}

function getUser() {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
        return JSON.parse(userStr);
    } catch (e) {
        return null;
    }
}

function requireAdmin() {
    if (!isLoggedIn()) {
        window.location.href = 'login.html';
        return false;
    }
    if (!isAdmin()) {
        window.location.href = 'index.html';
        return false;
    }
    return true;
}

// ===== UPDATE SIDEBAR FOR ROLE =====

function updateSidebarForRole() {
    const token = localStorage.getItem('token');
    const userRole = getUser()?.role || null;
    
    const isAdminUser = token && userRole === 'admin';
    const isLoggedInUser = !!token;
    
    // Admin-only links
    const dashboardLink = document.getElementById('sideDashboard');
    const reportLink = document.getElementById('sideReport');
    const loginLink = document.getElementById('sideLogin');
    const logoutBtn = document.getElementById('sideLogout');
    
    if (dashboardLink) {
        dashboardLink.style.display = isAdminUser ? 'flex' : 'none';
    }
    if (reportLink) {
        reportLink.style.display = isAdminUser ? 'flex' : 'none';
    }
    if (loginLink) {
        loginLink.style.display = isLoggedInUser ? 'none' : 'flex';
    }
    if (logoutBtn) {
        logoutBtn.style.display = isLoggedInUser ? 'flex' : 'none';
    }
}

// ===== TOAST NOTIFICATIONS =====

function showToast(type, message) {
    // Remove existing toast
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    // Create new toast
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    // Icon mapping
    const icons = {
        'success': 'fa-check-circle',
        'error': 'fa-exclamation-circle',
        'info': 'fa-info-circle',
        'warning': 'fa-exclamation-triangle'
    };
    const icon = icons[type] || 'fa-info-circle';
    
    toast.innerHTML = `<i class="fas ${icon} mr-2"></i> ${message}`;
    document.body.appendChild(toast);

    // Auto-remove after 4 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => {
            if (toast.parentNode) toast.remove();
        }, 300);
    }, 4000);
}

// ===== FORMATTING FUNCTIONS =====

function formatStatus(status) {
    const map = { 
        'pending': 'Pending', 
        'in_review': 'In Review', 
        'approved': 'Approved', 
        'rejected': 'Rejected' 
    };
    return map[status] || status || 'N/A';
}

function formatProjectType(type) {
    const map = {
        'feature-film': 'Feature Film', 
        'short-film': 'Short Film', 
        'documentary': 'Documentary',
        'music-video': 'Music Video', 
        'commercial': 'Commercial', 
        'corporate': 'Corporate Video',
        'event': 'Event Coverage', 
        'animation': 'Animation', 
        'post-production': 'Post Production', 
        'other': 'Other'
    };
    return map[type] || type || 'N/A';
}

function formatServices(service) {
    const map = {
        'full-production': 'Full Production', 
        'directing': 'Directing', 
        'cinematography': 'Cinematography',
        'editing': 'Editing', 
        'sound-design': 'Sound Design', 
        'vfx': 'Visual Effects (VFX)',
        'color-grading': 'Color Grading', 
        'screenwriting': 'Screenwriting', 
        'consulting': 'Consulting', 
        'other': 'Other'
    };
    return map[service] || service || 'N/A';
}

function formatProductionStage(stage) {
    const map = { 
        'development': 'Development', 
        'pre-production': 'Pre-Production', 
        'production': 'Production', 
        'post-production': 'Post-Production', 
        'distribution': 'Distribution' 
    };
    return map[stage] || stage || 'N/A';
}

// ===== INITIALIZE ON PAGE LOAD =====

document.addEventListener('DOMContentLoaded', function() {
    // Update API_URL if it exists
    if (typeof window.API_URL !== 'undefined') {
        window.API_URL = getApiUrl();
    }
    
    // Set active sidebar link
    setActiveSidebarLink();
    
    // Update sidebar for user role
    updateSidebarForRole();
    
    // Update admin name in navbar
    const adminName = document.getElementById('adminName');
    if (adminName && isLoggedIn()) {
        const user = getUser();
        if (user) {
            adminName.textContent = user.username || user.email || 'Admin';
            adminName.classList.remove('hidden');
        }
    }
    
    // Show/hide logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        if (isLoggedIn()) {
            logoutBtn.classList.remove('hidden');
        } else {
            logoutBtn.classList.add('hidden');
        }
    }
});

// ===== EXPOSE FUNCTIONS TO GLOBAL SCOPE =====
// (They're already in global scope, but ensure they're accessible)

window.toggleSidebar = toggleSidebar;
window.closeSidebar = closeSidebar;
window.getApiUrl = getApiUrl;
window.isAdmin = isAdmin;
window.isLoggedIn = isLoggedIn;
window.getUser = getUser;
window.requireAdmin = requireAdmin;
window.showToast = showToast;
window.formatStatus = formatStatus;
window.formatProjectType = formatProjectType;
window.formatServices = formatServices;
window.formatProductionStage = formatProductionStage;
