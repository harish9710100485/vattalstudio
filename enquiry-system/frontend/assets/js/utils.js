// Add these functions to the existing utils.js

// ===== DETECT ENVIRONMENT =====
function getApiUrl() {
    if (window.location.hostname.includes('vercel.app') || 
        window.location.hostname.includes('onrender.com')) {
        return 'https://vattal-backend.onrender.com/api/v1';
    }
    return 'http://localhost:8000/api/v1';
}

// ===== UPDATE API_URL FOR ALL PAGES =====
if (window.API_URL) {
    window.API_URL = getApiUrl();
}

// ===== CHECK IF ADMIN =====
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

// ===== CHECK IF LOGGED IN =====
function isLoggedIn() {
    return !!localStorage.getItem('token');
}

// ===== GET USER =====
function getUser() {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
        return JSON.parse(userStr);
    } catch (e) {
        return null;
    }
}

// ===== PROTECT ADMIN ROUTES =====
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
    
    const isAdmin = token && userRole === 'admin';
    const isLoggedIn = !!token;
    
    // Admin-only links
    const dashboardLink = document.getElementById('sideDashboard');
    const reportLink = document.getElementById('sideReport');
    const loginLink = document.getElementById('sideLogin');
    const logoutBtn = document.getElementById('sideLogout');
    
    if (dashboardLink) {
        dashboardLink.style.display = isAdmin ? 'flex' : 'none';
    }
    if (reportLink) {
        reportLink.style.display = isAdmin ? 'flex' : 'none';
    }
    if (loginLink) {
        loginLink.style.display = isLoggedIn ? 'none' : 'flex';
    }
    if (logoutBtn) {
        logoutBtn.style.display = isLoggedIn ? 'flex' : 'none';
    }
}

// ===== AUTO-DETECT API URL IN HTML =====
document.addEventListener('DOMContentLoaded', function() {
    // Update any hardcoded API_URL references
    if (window.API_URL) {
        window.API_URL = getApiUrl();
    }
    
    // Update sidebar
    updateSidebarForRole();
});