// Report Functions
let currentPage = 1;
let pageSize = 10;
let totalPages = 1;
let filters = {};

document.addEventListener('DOMContentLoaded', () => {
    if (!checkAuth()) return;
    loadUserInfo();
    loadStats();
    loadEnquiries(1);
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
        const stats = await api.get('/admin/stats');
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

async function loadEnquiries(page = 1) {
    currentPage = page;
    try {
        const params = new URLSearchParams({
            page: currentPage,
            per_page: pageSize
        });
        
        if (filters.search) params.append('search', filters.search);
        if (filters.status) params.append('status', filters.status);
        if (filters.project_type) params.append('project_type', filters.project_type);
        
        console.log('📋 Loading page:', currentPage, 'params:', params.toString());
        
        const data = await api.get(`/admin/enquiries?${params}`);
        console.log('📋 Data:', data);
        
        totalPages = data.total_pages || 1;
        
        renderTable(data);
        renderPagination(data);
        
    } catch (err) {
        console.error('Enquiries error:', err);
        showToast('error', 'Failed to load enquiries');
    }
}

function renderTable(data) {
    const tbody = document.getElementById('enquiriesBody');
    const items = data.items || [];
    
    if (items.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center py-12 text-gray-500">
                    <i class="fas fa-file-alt text-4xl block mb-3 text-gray-300"></i>
                    <p>No enquiries found in the system.</p>
                </td>
            </tr>
        `;
        return;
    }

    let html = '';
    items.forEach(e => {
        const statusColors = {
            'pending': 'bg-yellow-100 text-yellow-800',
            'in_review': 'bg-blue-100 text-blue-800',
            'approved': 'bg-green-100 text-green-800',
            'rejected': 'bg-red-100 text-red-800'
        };
        
        const description = e.project_description || '';
        const truncatedDesc = description.length > 50 ? description.substring(0, 50) + '...' : description;
        const displayId = e.display_id || e.id || '';
        
        html += `
            <tr class="hover:bg-gray-50 cursor-pointer transition" data-id="${e.id}">
                <td class="px-4 py-3 text-sm font-medium text-gray-900">
                    ${displayId}
                </td>
                <td class="px-4 py-3">
                    <div class="text-sm font-medium text-gray-900">${e.name || 'N/A'}</div>
                    <div class="text-xs text-gray-500">${e.email || 'N/A'}</div>
                </td>
                <td class="px-4 py-3">
                    <div class="text-sm text-gray-900 truncate max-w-[150px]" title="${description}">
                        ${truncatedDesc}
                    </div>
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
                <td class="px-4 py-3">
                    <button class="view-btn text-indigo-600 hover:text-indigo-800 transition" data-id="${e.id}">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
            </tr>
        `;
    });
    
    tbody.innerHTML = html;
    
    // Add event listeners
    document.querySelectorAll('#enquiriesBody tr[data-id]').forEach(row => {
        row.addEventListener('click', function(e) {
            // Don't trigger if clicked on button
            if (e.target.closest('.view-btn')) return;
            const id = this.dataset.id;
            viewEnquiry(id);
        });
    });
    
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const id = this.dataset.id;
            viewEnquiry(id);
        });
    });
}

function renderPagination(data) {
    const total = data.total || 0;
    const pages = data.total_pages || 1;
    const start = ((currentPage - 1) * pageSize) + 1;
    const end = Math.min(currentPage * pageSize, total);
    
    if (total === 0) {
        document.getElementById('pagination').innerHTML = `
            <span class="text-sm text-gray-500">No enquiries found</span>
        `;
        return;
    }
    
    let html = `
        <div class="flex flex-col sm:flex-row justify-between items-center w-full gap-3">
            <span class="text-sm text-gray-600">
                Showing <span class="font-medium">${start}</span> to <span class="font-medium">${end}</span> of <span class="font-medium">${total}</span> enquiries
                <span class="text-xs text-gray-400 ml-2">(Page ${currentPage} of ${pages})</span>
            </span>
            <div class="flex items-center gap-1 flex-wrap justify-center">
    `;
    
    if (currentPage > 1) {
        html += `<button onclick="loadEnquiries(${currentPage - 1})" class="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-100 transition text-sm">
                    <i class="fas fa-chevron-left text-xs"></i> Prev
                </button>`;
    }
    
    for (let i = 1; i <= pages; i++) {
        if (i === currentPage) {
            html += `<button class="px-3 py-1.5 bg-amber-500 text-white rounded-lg text-sm font-medium">${i}</button>`;
        } else if (i <= 3 || i > pages - 3 || Math.abs(i - currentPage) <= 1) {
            html += `<button onclick="loadEnquiries(${i})" class="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-100 transition text-sm">${i}</button>`;
        } else if (i === 4 && currentPage > 5) {
            html += `<span class="px-2 text-gray-400">...</span>`;
        }
    }
    
    if (currentPage < pages) {
        html += `<button onclick="loadEnquiries(${currentPage + 1})" class="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-100 transition text-sm">
                    Next <i class="fas fa-chevron-right text-xs"></i>
                </button>`;
    }
    
    html += `</div></div>`;
    
    document.getElementById('pagination').innerHTML = html;
}

async function viewEnquiry(id) {
    try {
        console.log('🔍 Viewing enquiry with ID:', id);
        const e = await api.get(`/admin/enquiries/${id}`);
        
        const statusColors = {
            'pending': 'bg-yellow-100 text-yellow-800',
            'in_review': 'bg-blue-100 text-blue-800',
            'approved': 'bg-green-100 text-green-800',
            'rejected': 'bg-red-100 text-red-800'
        };
        
        document.getElementById('detailContent').innerHTML = `
            <div class="space-y-4">
                <div class="flex justify-between items-start border-b pb-4">
                    <div>
                        <p class="text-xs text-gray-500">Enquiry ${e.display_id || e.id}</p>
                        <p class="text-sm text-gray-500">Submitted: ${e.created_at ? new Date(e.created_at).toLocaleString() : 'N/A'}</p>
                    </div>
                    <span class="px-3 py-1 text-sm font-medium rounded-full ${statusColors[e.status] || 'bg-gray-100 text-gray-800'}">
                        ${formatStatus(e.status)}
                    </span>
                </div>

                <div>
                    <h4 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Contact Information</h4>
                    <div class="grid md:grid-cols-3 gap-3 bg-gray-50 p-4 rounded-lg">
                        <div><p class="text-xs text-gray-500">Name</p><p class="font-medium">${e.name || 'N/A'}</p></div>
                        <div><p class="text-xs text-gray-500">Email</p><p class="font-medium text-indigo-600">${e.email || 'N/A'}</p></div>
                        <div><p class="text-xs text-gray-500">Phone</p><p class="font-medium">${e.phone || 'N/A'}</p></div>
                        ${e.company ? `<div><p class="text-xs text-gray-500">Company</p><p class="font-medium">${e.company}</p></div>` : ''}
                    </div>
                </div>

                <div>
                    <h4 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Project Details</h4>
                    <div class="grid md:grid-cols-3 gap-3 bg-gray-50 p-4 rounded-lg">
                        <div><p class="text-xs text-gray-500">Project Type</p><p class="font-medium">${formatProjectType(e.project_type)}</p></div>
                        ${e.production_stage ? `<div><p class="text-xs text-gray-500">Production Stage</p><p class="font-medium">${formatProductionStage(e.production_stage)}</p></div>` : ''}
                        <div><p class="text-xs text-gray-500">Services Required</p><p class="font-medium">${formatServices(e.services)}</p></div>
                    </div>
                </div>

                <div>
                    <h4 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Project Description</h4>
                    <div class="bg-gray-50 p-4 rounded-lg">
                        <p class="text-gray-700 whitespace-pre-wrap">${e.project_description || 'No description provided'}</p>
                    </div>
                </div>

                <div class="flex flex-wrap gap-3 pt-4 border-t">
                    <div class="flex-1 min-w-[200px]">
                        <label class="text-xs text-gray-500 block mb-1">Update Status</label>
                        <select id="statusUpdate" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500">
                            <option value="pending" ${e.status === 'pending' ? 'selected' : ''}>Pending</option>
                            <option value="in_review" ${e.status === 'in_review' ? 'selected' : ''}>In Review</option>
                            <option value="approved" ${e.status === 'approved' ? 'selected' : ''}>Approved</option>
                            <option value="rejected" ${e.status === 'rejected' ? 'selected' : ''}>Rejected</option>
                        </select>
                    </div>
                    <div class="flex items-end gap-2">
                        <button onclick="updateStatus('${e.id}')" class="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition">
                            <i class="fas fa-save mr-1"></i> Update
                        </button>
                        <button onclick="deleteEnquiry('${e.id}')" class="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition">
                            <i class="fas fa-trash mr-1"></i> Delete
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('detailModal').classList.remove('hidden');
        document.getElementById('detailModal').classList.add('flex');
    } catch (err) {
        console.error('View enquiry error:', err);
        showToast('error', 'Failed to load enquiry details');
    }
}

async function updateStatus(id) {
    const status = document.getElementById('statusUpdate').value;
    try {
        await api.put(`/admin/enquiries/${id}/status`, { status });
        closeDetail();
        loadEnquiries(currentPage);
        loadStats();
        showToast('success', 'Status updated successfully');
    } catch (err) {
        showToast('error', 'Failed to update status');
    }
}

async function deleteEnquiry(id) {
    if (!confirm('Delete this enquiry?')) return;
    try {
        await api.delete(`/admin/enquiries/${id}`);
        closeDetail();
        loadEnquiries(currentPage);
        loadStats();
        showToast('success', 'Enquiry deleted');
    } catch (err) {
        showToast('error', 'Failed to delete enquiry');
    }
}

function closeDetail() {
    document.getElementById('detailModal').classList.add('hidden');
    document.getElementById('detailModal').classList.remove('flex');
}

function handleSearch(value) {
    clearTimeout(window._searchTimeout);
    window._searchTimeout = setTimeout(() => {
        if (value) {
            filters.search = value;
        } else {
            delete filters.search;
        }
        loadEnquiries(1);
    }, 500);
}

function applyFilters() {
    const status = document.getElementById('statusFilter')?.value || '';
    const projectType = document.getElementById('projectTypeFilter')?.value || '';
    
    if (status) {
        filters.status = status;
    } else {
        delete filters.status;
    }
    
    if (projectType) {
        filters.project_type = projectType;
    } else {
        delete filters.project_type;
    }
    
    loadEnquiries(1);
}

function resetFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('statusFilter').value = '';
    document.getElementById('projectTypeFilter').value = '';
    filters = {};
    loadEnquiries(1);
}

function refreshData() {
    showToast('info', 'Refreshing data...');
    loadStats();
    loadEnquiries(currentPage);
}

async function exportExcel() {
    try {
        showToast('info', 'Preparing Excel export...');
        
        let allEnquiries = [];
        let currentPage = 1;
        const perPage = 100;
        let totalPages = 1;
        
        while (currentPage <= totalPages) {
            const params = new URLSearchParams({
                page: currentPage,
                per_page: perPage
            });
            
            if (filters.search) params.append('search', filters.search);
            if (filters.status) params.append('status', filters.status);
            if (filters.project_type) params.append('project_type', filters.project_type);
            
            const data = await api.get(`/admin/enquiries?${params}`);
            const items = data.items || [];
            allEnquiries = allEnquiries.concat(items);
            
            totalPages = data.total_pages || 1;
            currentPage++;
            
            if (currentPage > 100) break;
        }
        
        if (allEnquiries.length === 0) {
            showToast('error', 'No data to export');
            return;
        }
        
        generateExcelFile(allEnquiries);
        
    } catch (err) {
        console.error('Export error:', err);
        showToast('error', 'Failed to export Excel: ' + err.message);
    }
}

function generateExcelFile(enquiries) {
    try {
        const excelData = enquiries.map(e => ({
            'S.No': e.display_id || e.id,
            'Client Name': e.name || '',
            'Email Address': e.email || '',
            'Phone Number': e.phone || '',
            'Company': e.company || '',
            'Project Type': formatProjectType(e.project_type),
            'Description': e.project_description || '',
            'Stage': formatProductionStage(e.production_stage),
            'Services': formatServices(e.services),
            'Status': formatStatus(e.status),
            'Created Date': e.created_at ? new Date(e.created_at).toLocaleString() : ''
        }));

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(excelData);
        
        ws['!cols'] = [
            { wch: 8 }, { wch: 20 }, { wch: 25 }, { wch: 15 },
            { wch: 20 }, { wch: 18 }, { wch: 45 }, { wch: 18 },
            { wch: 20 }, { wch: 12 }, { wch: 22 }
        ];
        
        XLSX.utils.book_append_sheet(wb, ws, 'Enquiries');
        
        const date = new Date().toISOString().split('T')[0];
        XLSX.writeFile(wb, `Vattal_Enquiries_${date}.xlsx`);
        
        showToast('success', `Exported ${enquiries.length} enquiries to Excel!`);
        
    } catch (err) {
        console.error('Excel generation error:', err);
        showToast('error', 'Failed to generate Excel file');
    }
}

// ===== FORMATTING FUNCTIONS =====
function formatStatus(status) {
    const map = { 'pending': 'Pending', 'in_review': 'In Review', 'approved': 'Approved', 'rejected': 'Rejected' };
    return map[status] || status || 'N/A';
}

function formatProjectType(type) {
    const map = {
        'feature-film': 'Feature Film', 'short-film': 'Short Film', 'documentary': 'Documentary',
        'music-video': 'Music Video', 'commercial': 'Commercial', 'corporate': 'Corporate Video',
        'event': 'Event Coverage', 'animation': 'Animation', 'post-production': 'Post Production', 'other': 'Other'
    };
    return map[type] || type || 'N/A';
}

function formatServices(service) {
    const map = {
        'full-production': 'Full Production', 'directing': 'Directing', 'cinematography': 'Cinematography',
        'editing': 'Editing', 'sound-design': 'Sound Design', 'vfx': 'Visual Effects (VFX)',
        'color-grading': 'Color Grading', 'screenwriting': 'Screenwriting', 'consulting': 'Consulting', 'other': 'Other'
    };
    return map[service] || service || 'N/A';
}

function formatProductionStage(stage) {
    const map = { 'development': 'Development', 'pre-production': 'Pre-Production', 'production': 'Production', 'post-production': 'Post-Production', 'distribution': 'Distribution' };
    return map[stage] || stage || 'N/A';
}

function formatSource(source) {
    const map = { 'google': 'Google Search', 'social': 'Social Media', 'referral': 'Referral', 'linkedin': 'LinkedIn', 'film-festival': 'Film Festival', 'industry': 'Industry Network', 'other': 'Other' };
    return map[source] || source || 'N/A';
}