// Enquiry Form - Cinema Version
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('enquiryForm');
    if (form) {
        form.addEventListener('submit', submitEnquiry);
    }
    
    // Char counter for description
    const description = document.getElementById('description');
    const charCount = document.getElementById('charCount');
    if (description && charCount) {
        description.addEventListener('input', function() {
            charCount.textContent = `${this.value.length} / 3000 characters`;
        });
    }

    // File upload handler
    const fileInput = document.getElementById('fileUpload');
    const dropZone = document.getElementById('dropZone');
    
    if (fileInput && dropZone) {
        dropZone.addEventListener('click', () => fileInput.click());
        
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('border-indigo-500', 'bg-indigo-50');
        });
        
        dropZone.addEventListener('dragleave', (e) => {
            e.preventDefault();
            dropZone.classList.remove('border-indigo-500', 'bg-indigo-50');
        });
        
        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('border-indigo-500', 'bg-indigo-50');
            const file = e.dataTransfer.files[0];
            if (file) {
                handleFile(file);
            }
        });
        
        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                handleFile(file);
            }
        });
    }
});

function handleFile(file) {
    const validTypes = ['application/pdf', 'application/msword', 
                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                        'image/png', 'image/jpeg'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
        showToast('error', 'Invalid file type. Please upload PDF, DOC, DOCX, PNG, or JPG.');
        return;
    }

    if (file.size > maxSize) {
        showToast('error', 'File size exceeds 5MB limit.');
        return;
    }

    const fileName = document.getElementById('fileName');
    const filePreview = document.getElementById('filePreview');
    const uploadArea = document.getElementById('uploadArea');

    if (fileName) fileName.textContent = file.name;
    if (filePreview) filePreview.classList.remove('hidden');
    if (uploadArea) uploadArea.classList.add('hidden');
}

function removeFile() {
    const fileInput = document.getElementById('fileUpload');
    const filePreview = document.getElementById('filePreview');
    const uploadArea = document.getElementById('uploadArea');

    if (fileInput) fileInput.value = '';
    if (filePreview) filePreview.classList.add('hidden');
    if (uploadArea) uploadArea.classList.remove('hidden');
}

async function submitEnquiry(e) {
    e.preventDefault();
    
    const btn = document.getElementById('submitBtn');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Submitting...';

    try {
        // Get form values
        const name = document.getElementById('name')?.value?.trim() || '';
        const email = document.getElementById('email')?.value?.trim() || '';
        const phone = document.getElementById('phone')?.value?.trim() || '';
        const company = document.getElementById('company')?.value?.trim() || '';
        const projectType = document.getElementById('projectType')?.value || '';
        const description = document.getElementById('description')?.value?.trim() || '';
        const productionStage = document.getElementById('productionStage')?.value || '';
        const services = document.getElementById('services')?.value || '';
        const captcha = document.getElementById('captcha')?.checked || false;

        // Validate
        let hasError = false;

        if (!name) {
            document.getElementById('nameError')?.classList.remove('hidden');
            hasError = true;
        } else {
            document.getElementById('nameError')?.classList.add('hidden');
        }

        if (!email || !email.includes('@')) {
            document.getElementById('emailError')?.classList.remove('hidden');
            hasError = true;
        } else {
            document.getElementById('emailError')?.classList.add('hidden');
        }

        if (!phone) {
            document.getElementById('phoneError')?.classList.remove('hidden');
            hasError = true;
        } else {
            document.getElementById('phoneError')?.classList.add('hidden');
        }

        if (!projectType) {
            document.getElementById('projectTypeError')?.classList.remove('hidden');
            hasError = true;
        } else {
            document.getElementById('projectTypeError')?.classList.add('hidden');
        }

        if (!description) {
            document.getElementById('descriptionError')?.classList.remove('hidden');
            hasError = true;
        } else {
            document.getElementById('descriptionError')?.classList.add('hidden');
        }

        if (!services) {
            document.getElementById('servicesError')?.classList.remove('hidden');
            hasError = true;
        } else {
            document.getElementById('servicesError')?.classList.add('hidden');
        }

        if (!captcha) {
            showToast('error', 'Please confirm you are not a robot');
            hasError = true;
        }

        if (hasError) {
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-paper-plane mr-2"></i> Submit Enquiry';
            return;
        }

        // Prepare data (without source field)
        const data = {
            name: name,
            email: email,
            phone: phone,
            company: company || null,
            project_type: projectType,
            project_description: description,
            production_stage: productionStage || null,
            services: services,
            captcha: true
        };

        console.log('📤 Submitting enquiry:', data);

        // If there's a file, upload it first
        let fileUrl = null;
        if (selectedFile) {
            try {
                const formData = new FormData();
                formData.append('file', selectedFile);
                
                const uploadResponse = await fetch('http://localhost:8000/api/v1/enquiries/upload', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${api.token || ''}`
                    },
                    body: formData
                });
                
                if (uploadResponse.ok) {
                    const uploadResult = await uploadResponse.json();
                    fileUrl = uploadResult.file_url;
                    console.log('📎 File uploaded:', fileUrl);
                }
            } catch (uploadError) {
                console.warn('File upload error:', uploadError);
            }
        }

        // Add file URL if uploaded
        if (fileUrl) {
            data.file_url = fileUrl;
        }

        // Submit enquiry
        const response = await api.post('/enquiries', data);
        console.log('✅ Enquiry submitted:', response);

        // Show success
        const refId = document.getElementById('refId');
        if (refId) {
            refId.textContent = `#VAT-${String(response.id).padStart(6, '0')}`;
        }
        
        document.getElementById('successModal')?.classList.remove('hidden');
        document.getElementById('successModal')?.classList.add('flex');
        document.getElementById('enquiryForm')?.reset();
        removeFile();
        
        showToast('success', 'Enquiry submitted successfully!');

    } catch (error) {
        console.error('❌ Submit error:', error);
        showToast('error', error.message || 'Failed to submit enquiry');
    } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-paper-plane mr-2"></i> Submit Enquiry';
    }
}

function closeSuccess() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

// File upload handlers
document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('fileUpload');
    const dropZone = document.getElementById('dropZone');
    
    if (fileInput && dropZone) {
        // Click to upload
        dropZone.addEventListener('click', () => fileInput.click());
        
        // Drag and drop events
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('border-amber-500', 'bg-amber-50');
        });
        
        dropZone.addEventListener('dragleave', (e) => {
            e.preventDefault();
            dropZone.classList.remove('border-amber-500', 'bg-amber-50');
        });
        
        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('border-amber-500', 'bg-amber-50');
            const file = e.dataTransfer.files[0];
            if (file) {
                handleFile(file);
            }
        });
        
        // File input change
        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                handleFile(file);
            }
        });
    }

    // Char counter
    const description = document.getElementById('description');
    const charCount = document.getElementById('charCount');
    if (description && charCount) {
        description.addEventListener('input', function() {
            charCount.textContent = `${this.value.length} / 3000 characters`;
        });
    }
});

let selectedFile = null;

function handleFile(file) {
    const validTypes = ['application/pdf', 'application/msword', 
                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                        'image/png', 'image/jpeg'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
        showToast('error', 'Invalid file type. Please upload PDF, DOC, DOCX, PNG, or JPG.');
        return;
    }

    if (file.size > maxSize) {
        showToast('error', 'File size exceeds 5MB limit.');
        return;
    }

    // Store file for upload
    selectedFile = file;

    const fileName = document.getElementById('fileName');
    const filePreview = document.getElementById('filePreview');
    const uploadArea = document.getElementById('uploadArea');

    if (fileName) fileName.textContent = file.name;
    if (filePreview) filePreview.classList.remove('hidden');
    if (uploadArea) uploadArea.classList.add('hidden');
}

function removeFile() {
    const fileInput = document.getElementById('fileUpload');
    const filePreview = document.getElementById('filePreview');
    const uploadArea = document.getElementById('uploadArea');

    if (fileInput) fileInput.value = '';
    if (filePreview) filePreview.classList.add('hidden');
    if (uploadArea) uploadArea.classList.remove('hidden');
    selectedFile = null;
}