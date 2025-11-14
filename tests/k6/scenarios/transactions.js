import http from 'k6/http';
import { check, fail, sleep } from 'k6';
import { ensureBasics, pickRandom, randomDateISO } from '../helpers/resources.js';

const BASE_URL = __ENV.BASE_URL;
const TOKEN = __ENV.TOKEN;

if (!BASE_URL || !TOKEN) {
  fail('BASE_URL and TOKEN environment variables must be defined.');
}

export const options = {
  stages: [
    { duration: '2m', target: 25 },
    { duration: '2m', target: 80 },
    { duration: '3m', target: 200 },
    { duration: '3m', target: 350 },
    { duration: '2m', target: 500 },
    { duration: '1m', target: 600 }, // pico breve para observar saturação
    { duration: '1m', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<250'],
    http_req_failed: ['rate<0.005'],
  },
};

export function setup() {
  const headers = {
    Authorization: `Bearer ${TOKEN}`,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  const resources = ensureBasics(BASE_URL, headers);

  return {
    headers,
    ...resources,
  };
}

function buildPayload({ account, category }) {
  return JSON.stringify({
    account_id: account.id,
    category_id: category.id,
    amount: {
      value: Math.floor(Math.random() * 5000) + 1000,
      currency: account.currency ?? 'BRL',
    },
    date: randomDateISO(45),
    memo: `k6-transaction-${Date.now()}`,
  });
}

export default function ({ headers, accounts, categories }) {
  const account = pickRandom(accounts);
  const category = pickRandom(categories);

  const res = http.post(`${BASE_URL}/api/transactions`, buildPayload({ account, category }), {
    headers,
    timeout: '10s',
    tags: {
      endpoint: 'POST /api/transactions',
      name: 'POST /api/transactions',
      url: `${BASE_URL}/api/transactions`,
    },
  });

  const ok = check(res, {
    'status is 201': (r) => r && r.status === 201,
  });

  if (ok) {
    check(res, {
      'has id': (r) => Boolean(r.json('id')),
    });
  }

  sleep(1);
}
