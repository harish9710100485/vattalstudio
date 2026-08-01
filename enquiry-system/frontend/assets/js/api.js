// ========================================
// VATTAL STUDIOS - API CLIENT
// ========================================

// ===== DETERMINE API URL =====

const API_URL = (() => {
    // Production on Vercel or Render
    if (window.location.hostname.includes('vercel.app') || 
        window.location.hostname.includes('onrender.com')) {
        return 'https://vattalstudi.onrender.com/api/v1';
    }
    // Local development
    return 'http://localhost:8000/api/v1';
})();

console.log(`API URL: ${API_URL}`);

// ===== API CLIENT =====

const api = {
    token: localStorage.getItem('token'),

    /**
     * Get headers for API requests
     */
    headers() {
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        };
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        return headers;
    },

    /**
     * Make an API request
     */
    async request(method, endpoint, data = null) {
        const url = `${API_URL}${endpoint}`;
        const options = {
            method,
            headers: this.headers(),
            mode: 'cors',
            credentials: 'include',
        };
        if (data) {
            options.body = JSON.stringify(data);
        }

        try {
            const res = await fetch(url, options);
            
            // Handle 401 Unauthorized - redirect to login
            if (res.status === 401) {
                localStorage.removeItem('token');
                this.token = null;
                if (!window.location.pathname.includes('login.html')) {
                    window.location.href = 'login.html';
                }
                throw new Error('Session expired. Please login again.');
            }

            // Parse response
            const text = await res.text();
            const result = text ? JSON.parse(text) : {};
            
            // Handle error responses
            if (!res.ok) {
                console.error('Response error:', result);
                const errorMsg = result.detail || result.message || 'Request failed';
                throw new Error(errorMsg);
            }
            return result;
            
        } catch (error) {
            /*console.error('API Error:', error);*/
            throw error;
        }
    },

    /**
     * GET request
     */
    get(endpoint) {
        return this.request('GET', endpoint);
    },
    
    /**
     * POST request
     */
    post(endpoint, data) {
        return this.request('POST', endpoint, data);
    },
    
    /**
     * PUT request
     */
    put(endpoint, data) {
        return this.request('PUT', endpoint, data);
    },
    
    /**
     * DELETE request
     */
    delete(endpoint) {
        return this.request('DELETE', endpoint);
    },
    
    /**
     * Set authentication token
     */
    setToken(token) {
        this.token = token;
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
        }
    },

    /**
     * Upload a file with FormData
     */
    async uploadFile(endpoint, file, additionalData = null) {
        const url = `${API_URL}${endpoint}`;
        const formData = new FormData();
        formData.append('file', file);
        
        if (additionalData) {
            Object.keys(additionalData).forEach(key => {
                formData.append(key, additionalData[key]);
            });
        }

        const options = {
            method: 'POST',
            headers: {
                'Authorization': this.token ? `Bearer ${this.token}` : '',
            },
            body: formData,
        };

        try {
            const res = await fetch(url, options);
            
            if (res.status === 401) {
                localStorage.removeItem('token');
                this.token = null;
                if (!window.location.pathname.includes('login.html')) {
                    window.location.href = 'login.html';
                }
                throw new Error('Session expired. Please login again.');
            }

            const result = await res.json();
            
            if (!res.ok) {
                console.error('❌ Upload error:', result);
                throw new Error(result.detail || result.message || 'Upload failed');
            }
            return result;
            
        } catch (error) {
            console.error('❌ Upload Error:', error);
            throw error;
        }
    }
};

// ===== EXPOSE API TO GLOBAL SCOPE =====

window.api = api;
window.API_URL = API_URL;

// ===== HELPER: Get API URL from anywhere =====

function getApiUrl() {
    return API_URL;
}

window.getApiUrl = getApiUrl;

