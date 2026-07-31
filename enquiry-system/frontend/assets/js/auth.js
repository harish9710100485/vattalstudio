// Auth Functions
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    updateUIForAuth();
    
    const form = document.getElementById('loginForm');
    if (form) {
        form.addEventListener('submit', handleLogin);
    }
});

async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const btn = document.getElementById('loginBtn');
    const errorDiv = document.getElementById('loginError');
    const errorMsg = document.getElementById('errorMsg');
    
    btn.disabled = true;
    btn.textContent = 'Logging in...';
    if (errorDiv) errorDiv.classList.add('hidden');

    try {
        const data = await api.post('/auth/login', { email, password });
        
        // Save token
        api.setToken(data.access_token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        showToast('success', 'Login successful!');
        setTimeout(() => {
            if (data.user.role === 'admin') {
                window.location.href = 'dashboard.html';
            } else {
                window.location.href = 'index.html';
            }
        }, 800);
        
    } catch (err) {
        if (errorDiv) {
            errorDiv.classList.remove('hidden');
            if (errorMsg) errorMsg.textContent = err.message;
        }
        showToast('error', err.message);
    } finally {
        btn.disabled = false;
        btn.textContent = 'Sign In';
    }
}

function logout() {
    api.setToken(null);
    localStorage.removeItem('user');
    window.location.href = 'login.html';
}

function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return false;
    }
    api.token = token;
    return true;
}

function showToast(type, msg) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = msg;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}
function updateUIForAuth() {
    const token = localStorage.getItem('token');
    const adminName = document.getElementById('adminName');
    const logoutBtn = document.getElementById('logoutBtn');
    const sideLogout = document.getElementById('sideLogout');
    
    if (token) {
        // User is logged in - Show logout button
        if (adminName) {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                try {
                    const user = JSON.parse(userStr);
                    adminName.textContent = user.username || user.email || 'Admin';
                } catch (e) {
                    adminName.textContent = 'Admin';
                }
            } else {
                adminName.textContent = 'Admin';
            }
            adminName.classList.remove('hidden');
        }
        if (logoutBtn) logoutBtn.classList.remove('hidden');
        if (sideLogout) sideLogout.classList.remove('hidden');
    } else {
        // User is not logged in - Hide logout button
        if (adminName) adminName.classList.add('hidden');
        if (logoutBtn) logoutBtn.classList.add('hidden');
        if (sideLogout) sideLogout.classList.add('hidden');
    }
}