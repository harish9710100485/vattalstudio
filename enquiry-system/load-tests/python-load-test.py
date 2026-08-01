import requests
import time
import threading
from datetime import datetime

BASE_URL = "http://localhost:8000/api/v1"
ADMIN_EMAIL = "admin@example.com"
ADMIN_PASSWORD = "admin123"

results = {
    "success": 0,
    "failed": 0,
    "response_times": []
}

def test_login():
    """Test login endpoint"""
    start = time.time()
    try:
        response = requests.post(
            f"{BASE_URL}/auth/login",
            json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}
        )
        elapsed = (time.time() - start) * 1000
        results["response_times"].append(elapsed)
        
        if response.status_code == 200:
            results["success"] += 1
            return response.json().get("access_token")
        else:
            results["failed"] += 1
            return None
    except Exception as e:
        results["failed"] += 1
        print(f"Login error: {e}")
        return None

def test_get_enquiries(token):
    """Test get enquiries endpoint"""
    start = time.time()
    try:
        response = requests.get(
            f"{BASE_URL}/admin/enquiries",
            headers={"Authorization": f"Bearer {token}"}
        )
        elapsed = (time.time() - start) * 1000
        results["response_times"].append(elapsed)
        
        if response.status_code == 200:
            results["success"] += 1
        else:
            results["failed"] += 1
    except Exception as e:
        results["failed"] += 1
        print(f"Get enquiries error: {e}")

def test_get_stats(token):
    """Test get stats endpoint"""
    start = time.time()
    try:
        response = requests.get(
            f"{BASE_URL}/admin/stats",
            headers={"Authorization": f"Bearer {token}"}
        )
        elapsed = (time.time() - start) * 1000
        results["response_times"].append(elapsed)
        
        if response.status_code == 200:
            results["success"] += 1
        else:
            results["failed"] += 1
    except Exception as e:
        results["failed"] += 1
        print(f"Get stats error: {e}")

def test_create_enquiry():
    """Test create enquiry endpoint"""
    start = time.time()
    try:
        response = requests.post(
            f"{BASE_URL}/enquiries",
            json={
                "name": f"Test User {int(time.time())}",
                "email": f"test{int(time.time())}@example.com",
                "phone": "+91 9898765431",
                "company": "Test Company",
                "project_type": "feature-film",
                "project_description": "Load test enquiry",
                "production_stage": "pre-production",
                "services": "full-production",
                "source": "google",
                "captcha": True
            }
        )
        elapsed = (time.time() - start) * 1000
        results["response_times"].append(elapsed)
        
        if response.status_code == 201:
            results["success"] += 1
        else:
            results["failed"] += 1
    except Exception as e:
        results["failed"] += 1
        print(f"Create enquiry error: {e}")

def run_test(num_users=20):
    """Run load test with specified number of users"""
    print(f"\n Starting load test with {num_users} users...")
    print("=" * 50)
    
    threads = []
    
    for i in range(num_users):
        # Login first
        token = test_login()
        
        # Then make API calls
        if token:
            t1 = threading.Thread(target=test_get_enquiries, args=(token,))
            t2 = threading.Thread(target=test_get_stats, args=(token,))
            t3 = threading.Thread(target=test_create_enquiry)
            threads.extend([t1, t2, t3])
            
            # Start threads
            t1.start()
            t2.start()
            t3.start()
        
        time.sleep(0.1)  # Small delay between users
    
    # Wait for all threads to complete
    for t in threads:
        t.join()
    
    # Print results
    print("\n" + "=" * 50)
    print("📊 LOAD TEST RESULTS")
    print("=" * 50)
    
    total = results["success"] + results["failed"]
    response_times = results["response_times"]
    
    print(f"\nTotal Requests: {total}")
    print(f"Successful: {results['success']}")
    print(f"Failed: {results['failed']}")
    print(f"Success Rate: {(results['success'] / total * 100) if total > 0 else 0:.2f}%")
    
    if response_times:
        avg = sum(response_times) / len(response_times)
        sorted_times = sorted(response_times)
        p95 = sorted_times[int(len(sorted_times) * 0.95)]
        p99 = sorted_times[int(len(sorted_times) * 0.99)]
        max_time = max(sorted_times)
        min_time = min(sorted_times)
        
        print(f"\nResponse Times (ms):")
        print(f"   - Average: {avg:.2f}ms")
        print(f"   - Min: {min_time:.2f}ms")
        print(f"   - Max: {max_time:.2f}ms")
        print(f"   - 95th Percentile: {p95:.2f}ms")
        print(f"   - 99th Percentile: {p99:.2f}ms")
    
    print("\n" + "=" * 50)
    print("Load test completed!")
    print("=" * 50)

if __name__ == "__main__":
    # Run with 20 users
    run_test(20)
