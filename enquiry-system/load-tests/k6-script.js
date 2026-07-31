// load-tests/k6-script.js
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');

export const options = {
    stages: [
        { duration: '30s', target: 10 },   // Ramp up to 10 users
        { duration: '1m', target: 50 },    // Ramp up to 50 users
        { duration: '2m', target: 100 },   // Ramp up to 100 users
        { duration: '1m', target: 0 },     // Ramp down to 0 users
    ],
    thresholds: {
        http_req_duration: ['p(95)<500'],  // 95% of requests under 500ms
        http_req_failed: ['rate<0.01'],    // Error rate less than 1%
        errors: ['rate<0.1'],              // Custom error rate less than 10%
    },
};

const BASE_URL = 'http://localhost:8000/api/v1';
const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'admin123';

export default function () {
    let token = null;
    
    // ===== 1. TEST LOGIN =====
    const loginPayload = JSON.stringify({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD
    });
    
    const loginRes = http.post(`${BASE_URL}/auth/login`, loginPayload, {
        headers: { 'Content-Type': 'application/json' },
        tags: { name: 'login' },
    });
    
    const loginSuccess = check(loginRes, {
        'Login status is 200': (r) => r.status === 200,
    });
    errorRate.add(!loginSuccess);
    
    if (loginRes.status === 200) {
        token = JSON.parse(loginRes.body).access_token;
    }
    
    sleep(0.5);
    
    // ===== 2. TEST GET ENQUIRIES (Admin Only) =====
    if (token) {
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        };
        
        // Get enquiries with pagination
        const enquiriesRes = http.get(
            `${BASE_URL}/admin/enquiries?page=1&per_page=10`,
            { headers, tags: { name: 'get_enquiries' } }
        );
        
        const enquiriesSuccess = check(enquiriesRes, {
            'Enquiries status is 200': (r) => r.status === 200,
        });
        errorRate.add(!enquiriesSuccess);
        
        sleep(0.5);
        
        // ===== 3. TEST GET STATS (Admin Only) =====
        const statsRes = http.get(
            `${BASE_URL}/admin/stats`,
            { headers, tags: { name: 'get_stats' } }
        );
        
        const statsSuccess = check(statsRes, {
            'Stats status is 200': (r) => r.status === 200,
        });
        errorRate.add(!statsSuccess);
        
        sleep(0.5);
    }
    
    // ===== 4. TEST SUBMIT ENQUIRY (Public) =====
    const enquiryPayload = JSON.stringify({
        name: `Test User ${__VU}`,
        email: `testuser${__VU}@example.com`,
        phone: '+1 234-567-8900',
        company: 'Test Company',
        project_type: 'feature-film',
        project_description: `Load test enquiry from virtual user ${__VU}`,
        production_stage: 'pre-production',
        services: 'full-production',
        source: 'google',
        captcha: true,
    });
    
    const enquiryRes = http.post(
        `${BASE_URL}/enquiries`,
        enquiryPayload,
        {
            headers: { 'Content-Type': 'application/json' },
            tags: { name: 'create_enquiry' },
        }
    );
    
    const enquirySuccess = check(enquiryRes, {
        'Enquiry created status is 201': (r) => r.status === 201,
    });
    errorRate.add(!enquirySuccess);
    
    sleep(1);
}

// ===== SUMMARY OUTPUT =====
export function handleSummary(data) {
    console.log('\n========================================');
    console.log('📊 LOAD TEST SUMMARY');
    console.log('========================================\n');
    
    console.log(`📈 Total Requests: ${data.metrics.http_reqs.values.count}`);
    console.log(`✅ Successful Requests: ${data.metrics.http_reqs.values.count - data.metrics.http_req_failed.values.fails}`);
    console.log(`❌ Failed Requests: ${data.metrics.http_req_failed.values.fails}`);
    console.log(`📊 Error Rate: ${(data.metrics.http_req_failed.values.rate * 100).toFixed(2)}%`);
    
    console.log(`\n⏱️ Response Times:`);
    console.log(`   - Average: ${data.metrics.http_req_duration.values.avg.toFixed(2)}ms`);
    console.log(`   - Median: ${data.metrics.http_req_duration.values.med.toFixed(2)}ms`);
    console.log(`   - 95th Percentile: ${data.metrics.http_req_duration.values['p(95)'].toFixed(2)}ms`);
    console.log(`   - 99th Percentile: ${data.metrics.http_req_duration.values['p(99)'].toFixed(2)}ms`);
    console.log(`   - Max: ${data.metrics.http_req_duration.values.max.toFixed(2)}ms`);
    
    console.log('\n========================================\n');
    
    return {
        'load-tests/results.json': JSON.stringify(data, null, 2),
    };
}