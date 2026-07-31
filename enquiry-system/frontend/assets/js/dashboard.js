// Dashboard Functions with Charts
let currentPage = 1;
let statusChart = null;
let projectTypeChart = null;
let servicesChart = null;
let timelineChart = null;

document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    if (!checkAuth()) return;
    
    // Check if user is admin - if not, redirect to index
    const userStr = localStorage.getItem('user');
    if (userStr) {
        try {
            const user = JSON.parse(userStr);
            if (user.role !== 'admin') {
                window.location.href = 'index.html';
                return;
            }
        } catch (e) {
            window.location.href = 'login.html';
            return;
        }
    }
    
    loadUserInfo();
    loadStats();
    loadCharts();
    loadRecentEnquiries();
});


function loadUserInfo() {
    const userStr = localStorage.getItem('user');
    if (userStr && userStr !== 'undefined' && userStr !== 'null') {
        try {
            const user = JSON.parse(userStr);
            const nameEl = document.getElementById('adminName');
            if (nameEl) nameEl.textContent = user.username || user.email || 'Admin';
        } catch (e) {
            console.log('No user info found');
        }
    }
}

async function loadStats() {
    try {
        console.log('📊 Loading stats...');
        const stats = await api.get('/admin/stats');
        console.log('📊 Stats received:', stats);
        
        document.getElementById('statTotal').textContent = stats.total || 0;
        document.getElementById('statPending').textContent = stats.pending || 0;
        document.getElementById('statReview').textContent = stats.in_review || 0;
        document.getElementById('statApproved').textContent = stats.approved || 0;
        document.getElementById('statRejected').textContent = stats.rejected || 0;
        
    } catch (err) {
        console.error('Stats error:', err);
        showToast('error', 'Failed to load stats');
    }
}

async function loadCharts() {
    try {
        // Get all enquiries for chart data
        const data = await api.get('/admin/enquiries?per_page=100');
        const enquiries = data.items || [];
        
        // Status Distribution
        const statusCounts = { pending: 0, in_review: 0, approved: 0, rejected: 0 };
        enquiries.forEach(e => {
            if (statusCounts[e.status] !== undefined) statusCounts[e.status]++;
        });
        
        createStatusChart(statusCounts);
        
        // Project Types
        const projectTypes = {};
        enquiries.forEach(e => {
            projectTypes[e.project_type] = (projectTypes[e.project_type] || 0) + 1;
        });
        createProjectTypeChart(projectTypes);
        
        // Services Required
        const services = {};
        enquiries.forEach(e => {
            services[e.services] = (services[e.services] || 0) + 1;
        });
        createServicesChart(services);
        
        // Timeline (Last 7 Days)
        const timeline = getLast7Days(enquiries);
        createTimelineChart(timeline);
        
    } catch (err) {
        console.error('Charts error:', err);
        showToast('error', 'Failed to load chart data');
    }
}

function createStatusChart(data) {
    const ctx = document.getElementById('statusChart');
    if (!ctx) return;
    
    if (statusChart) statusChart.destroy();
    
    const labels = ['Pending', 'In Review', 'Approved', 'Rejected'];
    const values = [data.pending, data.in_review, data.approved, data.rejected];
    const colors = ['#f59e0b', '#3b82f6', '#10b981', '#ef4444'];
    
    statusChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: values,
                backgroundColor: colors,
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { padding: 10, usePointStyle: true }
                }
            },
            cutout: '60%'
        }
    });
}

function createProjectTypeChart(data) {
    const ctx = document.getElementById('projectTypeChart');
    if (!ctx) return;
    
    if (projectTypeChart) projectTypeChart.destroy();
    
    const labels = Object.keys(data);
    const values = Object.values(data);
    const colors = ['#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e', '#fb7185', '#f97316', '#eab308'];
    
    projectTypeChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels.map(formatProjectType),
            datasets: [{
                label: 'Enquiries',
                data: values,
                backgroundColor: colors.slice(0, labels.length),
                borderRadius: 6,
                borderSkipped: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { stepSize: 1 }
                }
            }
        }
    });
}

function createServicesChart(data) {
    const ctx = document.getElementById('servicesChart');
    if (!ctx) return;
    
    if (servicesChart) servicesChart.destroy();
    
    const labels = Object.keys(data);
    const values = Object.values(data);
    const colors = ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0', '#d1fae5', '#059669', '#047857'];
    
    // Sort by value descending
    const sorted = labels.map((label, i) => ({ label, value: values[i] }))
        .sort((a, b) => b.value - a.value);
    
    servicesChart = new Chart(ctx, {
        type: 'bar',  // Use 'bar' type with indexAxis: 'y' for horizontal
        data: {
            labels: sorted.map(item => formatServices(item.label)),
            datasets: [{
                label: 'Enquiries',
                data: sorted.map(item => item.value),
                backgroundColor: colors.slice(0, sorted.length),
                borderRadius: 6,
                borderSkipped: false
            }]
        },
        options: {
            indexAxis: 'y',  // This makes it horizontal
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    ticks: { stepSize: 1 }
                }
            }
        }
    });
}

function createTimelineChart(data) {
    const ctx = document.getElementById('timelineChart');
    if (!ctx) return;
    
    if (timelineChart) timelineChart.destroy();
    
    const dates = data.map(d => d.date);
    const counts = data.map(d => d.count);
    
    timelineChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: 'Enquiries',
                data: counts,
                borderColor: '#6366f1',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#6366f1',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { stepSize: 1 }
                }
            }
        }
    });
}

function getLast7Days(enquiries) {
    const result = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        const count = enquiries.filter(e => {
            const eDate = new Date(e.created_at).toISOString().split('T')[0];
            return eDate === dateStr;
        }).length;
        
        result.push({
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            count: count
        });
    }
    
    return result;
}

async function loadRecentEnquiries() {
    try {
        const data = await api.get('/admin/enquiries?per_page=5');
        const items = data.items || [];
        renderRecentTable(items);
    } catch (err) {
        console.error('Recent enquiries error:', err);
    }
}

function renderRecentTable(items) {
    const tbody = document.getElementById('recentEnquiriesBody');
    
    if (!items || items.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center py-8 text-gray-500">
                    <i class="fas fa-inbox text-2xl block mb-2"></i>
                    No recent enquiries
                </td>
            </tr>
        `;
        return;
    }
    
    const statusColors = {
        'pending': 'bg-yellow-100 text-yellow-800',
        'in_review': 'bg-blue-100 text-blue-800',
        'approved': 'bg-green-100 text-green-800',
        'rejected': 'bg-red-100 text-red-800'
    };
    
    tbody.innerHTML = items.map(e => {
        const encodedId = e.id || '';
        return `
            <tr class="hover:bg-gray-50 cursor-pointer" onclick="window.location.href='report.html'">
                <td class="px-4 py-3 text-sm font-medium text-gray-900">${e.display_id || e.id}</td>
                <td class="px-4 py-3">
                    <div class="text-sm font-medium text-gray-900">${e.name || 'N/A'}</div>
                    <div class="text-xs text-gray-500">${e.email || 'N/A'}</div>
                </td>
                <td class="px-4 py-3">
                    <span class="px-2 py-1 text-xs rounded-full bg-indigo-100 text-indigo-800">
                        ${formatProjectType(e.project_type)}
                    </span>
                </td>
                <td class="px-4 py-3">
                    <span class="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">
                        ${formatServices(e.services)}
                    </span>
                </td>
                <td class="px-4 py-3">
                    <span class="px-3 py-1 text-xs font-medium rounded-full ${statusColors[e.status] || 'bg-gray-100 text-gray-800'}">
                        ${formatStatus(e.status)}
                    </span>
                </td>
                <td class="px-4 py-3 text-sm text-gray-500">
                    ${e.created_at ? new Date(e.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                </td>
            </tr>
        `;
    }).join('');
}

function refreshData() {
    showToast('info', 'Refreshing data...');
    loadStats();
    loadCharts();
    loadRecentEnquiries();
}

// ===== FORMATTING FUNCTIONS =====
function formatStatus(status) {
    const map = { 'pending': 'Pending', 'in_review': 'In Review', 'approved': 'Approved', 'rejected': 'Rejected' };
    return map[status] || status;
}

function formatProjectType(type) {
    const map = {
        'feature-film': 'Feature Film', 'short-film': 'Short Film', 'documentary': 'Documentary',
        'music-video': 'Music Video', 'commercial': 'Commercial', 'corporate': 'Corporate Video',
        'event': 'Event Coverage', 'animation': 'Animation', 'post-production': 'Post Production', 'other': 'Other'
    };
    return map[type] || type;
}

function formatServices(service) {
    const map = {
        'full-production': 'Full Production', 'directing': 'Directing', 'cinematography': 'Cinematography',
        'editing': 'Editing', 'sound-design': 'Sound Design', 'vfx': 'Visual Effects (VFX)',
        'color-grading': 'Color Grading', 'screenwriting': 'Screenwriting', 'consulting': 'Consulting', 'other': 'Other'
    };
    return map[service] || service;
}

document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    if (!checkAuth()) return;
    
    // Check if user is admin
    const userStr = localStorage.getItem('user');
    if (userStr) {
        try {
            const user = JSON.parse(userStr);
            if (user.role !== 'admin') {
                window.location.href = 'employee.html';
                return;
            }
        } catch (e) {
            window.location.href = 'login.html';
            return;
        }
    }
    
    loadUserInfo();
    loadStats();
    loadCharts();
    loadRecentEnquiries();
});