import http from 'k6/http';
import { check, fail, sleep } from 'k6';

const BASE_URL = __ENV.BASE_URL;
const TOKEN = __ENV.TOKEN;

if (!BASE_URL || !TOKEN) {
  fail('BASE_URL and TOKEN environment variables must be defined.');
}

export const options = {
  stages: [
    { duration: '2m', target: 50 },
    { duration: '6m', target: 150 },
    { duration: '2m', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<250'],
    http_req_failed: ['rate<0.005'],
  },
};

export function setup() {
  return {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      Accept: 'application/json',
    },
  };
}

export default function ({ headers }) {
  const res = http.get(`${BASE_URL}/api/accounts`, { headers, tags: { endpoint: 'GET /api/accounts' } });

  check(res, {
    'status is 200': (r) => r.status === 200,
    'body contains data': (r) => !!r.json('data'),
  });

  sleep(1);
}
