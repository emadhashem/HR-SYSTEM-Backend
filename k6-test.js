import { check, sleep, group } from 'k6';
import http from 'k6/http';
import { SharedArray } from 'k6/data';

export let options = {
  stages: [
    { duration: '30s', target: 20 },
    { duration: '1m', target: 20 },
    { duration: '10s', target: 0 },
  ],
};

const API_URL = 'http://localhost:4000/api';
// SharedArray in k6 provides several key benefits:
// 1. Memory efficiency: Data is loaded only once and shared between VUs (Virtual Users)
//    rather than being loaded separately for each VU
// 2. Performance: Reduces memory usage and startup time when working with large datasets
// 3. Thread safety: The data is read-only, preventing race conditions between VUs
// 4. Useful for loading test data: Can load large JSON/CSV files and share across test iterations

const data = new SharedArray('some data', function () {
  // Example usage:
  // return JSON.parse(open('./data.json')); // Load JSON file
  // return open('./data.csv').split('\n');  // Load CSV file
  // return [1,2,3,4];  // Return static array
});

export default function () {
  group('Public endpoints', function () {
    let res = http.post(
      `${API_URL}/auth/login`,
      JSON.stringify({
        email: 'ivoiceup@test.com',
        password: '12345678',
      }),
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    check(res, { 'status is 201': (r) => r.status === 201 });
    sleep(1);
  });

  group('Private endpoints', function () {
    let loginRes = http.post(
      `${API_URL}/auth/login`,
      JSON.stringify({
        email: 'ivoiceup@test.com',
        password: '12345678',
      }),
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    check(loginRes, {
      'login status is 201': (r) => r.status === 201,
    });

    let authHeaders = {
      headers: {
        Authorization: `Bearer ${loginRes.json('accessToken')}`,
        'Content-Type': 'application/json',
      },
    };

    // let res = http.post(
    //   `${API_URL}/employee/create`,
    //   JSON.stringify({
    //     name: 'emad' + Math.random(),
    //     email: `tst@${Math.random()}tst.com`,
    //     groupType: 'Normal_Employee',
    //   }),
    //   {
    //     headers: authHeaders.headers,
    //   },
    // );

    // check(res, { 'status is 201': (r) => r.status === 201 });
    // sleep(1);

    const page = Math.floor(Math.random() * 47) + 1;
    const perPage = 20;
    const res = http.get(
      `${API_URL}/employee/get-all?page=${page}&perPage=${perPage}`,
      authHeaders,
    );
    check(res, { 'status is 200': (r) => r.status === 200 });
  });
}
