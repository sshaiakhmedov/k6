import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');

// Test configuration
export const options = {
  // Stages define the load pattern
  stages: [
    { duration: '2s', target: 10 },  // Ramp up to 10 users over 30s
    { duration: '2s', target: 10 },   // Stay at 10 users for 1 minute
    { duration: '2s', target: 50 },   // Stay at 50 users for 2 minutes
    { duration: '3s', target: 0 },   // Ramp down to 0 users
  ],
  
  // Thresholds define pass/fail criteria
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests must complete below 500ms
    http_req_failed: ['rate<0.05'],   // Error rate must be below 5%
    errors: ['rate<0.1'],             // Custom error rate below 10%
  },
  
  // Alternative: Simple configuration
  // vus: 10,              // Number of virtual users
  // duration: '30s',      // Test duration
};

// Setup function - runs once before test
export function setup() {
  console.log('Setting up test...');
  // You can fetch data here to use in tests
  return { timestamp: Date.now() };
}

// Main test function - runs for each VU
export default function(data) {
  // Example 1: Simple GET request
  const res1 = http.get('https://test-api.k6.io/public/crocodiles/');
  
  check(res1, {
    'status is 200': (r) => r.status === 200,
    'response time < 200ms': (r) => r.timings.duration < 200,
  });
  
  sleep(1); // Think time between requests
  
  // // Example 2: POST request with JSON payload
  // const payload = JSON.stringify({
  //   name: 'Test Crocodile',
  //   sex: 'M',
  //   date_of_birth: '2020-01-01',
  // });
  
  // const params = {
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  // };
  
  // const res2 = http.post('https://test-api.k6.io/public/crocodiles/', payload, params);
  
  // const checkRes = check(res2, {
  //   'post status is 201': (r) => r.status === 201,
  //   'response has id': (r) => r.json('id') !== undefined,
  // });
  
  // // Track custom error rate
  // errorRate.add(!checkRes);
  
  // sleep(1);
  
  // // Example 3: Request with authentication
  // const authParams = {
  //   headers: {
  //     'Authorization': 'Bearer YOUR_TOKEN_HERE',
  //     'Content-Type': 'application/json',
  //   },
  // };
  
  // const res3 = http.get('https://test-api.k6.io/public/crocodiles/1/', authParams);
  
  // check(res3, {
  //   'authenticated request successful': (r) => r.status === 200,
  // });
  
  // sleep(2);
}

// Teardown function - runs once after test
export function teardown(data) {
  console.log('Test completed at:', new Date(data.timestamp));
}