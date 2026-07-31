// API Client with dynamic URL based on environment

// Determine API URL based on environment
const API_BASE_URL = (() => {
    // For production on Vercel
    if (window.location.hostname.includes('vercel.app') || 
        window.location.hostname.includes('onrender.com')) {
        // Use Render backend URL
        return 'https://vattal-backend.onrender.com/api/v1';
    }
    // For local development
    return 'http://localhost:8000/api/v1';
})();

const API_URL = API_BASE_URL;

console.log(`🌐 API URL: ${API_URL}`);

const api = {
    token: localStorage.getItem('token'),

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

    async request(method, endpoint, data = null) {
        const url = `${API_URL}${endpoint}`;
        const options = {
            method,
            headers: this.headers(),
            credentials: 'same-origin',
        };
        if (data) {
            options.body = JSON.stringify(data);
        }

        try {
            console.log(`📤 ${method} ${url}`);
            const res = await fetch(url, options);
            
            if (res.status === 401) {
                localStorage.removeItem('token');
                this.token = null;
                if (!window.location.pathname.includes('login.html')) {
                    window.location.href = 'login.html';
                }
                throw new Error('Session expired. Please login again.');
            }

            // Handle empty responses
            const text = await res.text();
            const result = text ? JSON.parse(text) : {};
            
            if (!res.ok) {
                console.error('❌ Response error:', result);
                throw new Error(result.detail || result.message || 'Request failed');
            }
            
            console.log(`📥 Response:`, result);
            return result;
        } catch (error) {
            console.error('❌ API Error:', error);
            throw error;
        }
    },

    get(endpoint) {
        return this.request('GET', endpoint);
    },
    
    post(endpoint, data) {
        return this.request('POST', endpoint, data);
    },
    
    put(endpoint, data) {
        return this.request('PUT', endpoint, data);
    },
    
    delete(endpoint) {
        return this.request('DELETE', endpoint);
    },
    
    setToken(token) {
        this.token = token;
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
        }
    }
};

window.api = api;