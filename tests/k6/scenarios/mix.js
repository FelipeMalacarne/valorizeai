import http from 'k6/http';
import { check, fail, sleep } from 'k6';
import {
  ensureBasics,
  pickRandom,
  pickSubset,
  randomDateISO,
  randomDateRange,
} from '../helpers/resources.js';
import { QueryBuilder } from '../helpers/query.js';

const BASE_URL = __ENV.BASE_URL;
const TOKEN = __ENV.TOKEN;

if (!BASE_URL || !TOKEN) {
  fail('BASE_URL and TOKEN environment variables must be defined.');
}

export const options = {
  stages: [
    { duration: '2m', target: 30 },
    { duration: '3m', target: 80 },
    { duration: '4m', target: 180 },
    { duration: '4m', target: 350 },
    { duration: '4m', target: 550 },
    { duration: '2m', target: 650 }, // pico rápido apenas para sinalizar saturação
    { duration: '2m', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<250'],
    http_req_failed: ['rate<0.005'],
  },
};

function buildQuery({ accounts, categories }) {
  const query = new QueryBuilder();

  query.addMany('accounts[]', pickSubset(accounts).map((account) => account.id));

  if (Math.random() > 0.4) {
    query.addMany('categories[]', pickSubset(categories).map((category) => category.id));
  }

  const range = randomDateRange(60, 10);
  query.add('start_date', range.start);
  query.add('end_date', range.end);

  if (Math.random() > 0.5) {
    query.add('type', Math.random() > 0.5 ? 'credit' : 'debit');
  }

  query.add('per_page', String(Math.floor(Math.random() * 40) + 20));

  return query.toString();
}

function buildPayload(account, category) {
  return JSON.stringify({
    account_id: account.id,
    category_id: category.id,
    amount: {
      value: Math.floor(Math.random() * 8000) + 500,
      currency: account.currency ?? 'BRL',
    },
    date: randomDateISO(60),
    memo: `k6-mix-${Date.now()}`,
  });
}

export function setup() {
  const headers = {
    Authorization: `Bearer ${TOKEN}`,
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  const resources = ensureBasics(BASE_URL, headers);

  return {
    headers,
    ...resources,
  };
}

export default function ({ headers, accounts, categories }) {
  const roll = Math.random();

  if (roll < 0.65) {
    const query = buildQuery({ accounts, categories });
    const res = http.get(`${BASE_URL}/api/transactions?${query}`, {
      headers,
      timeout: '10s',
      tags: {
        endpoint: 'GET /api/transactions',
        name: 'GET /api/transactions',
        url: `${BASE_URL}/api/transactions`,
      },
    });

    check(res, {
      'list status 200': (r) => r && r.status === 200,
    });
  } else if (roll < 0.85) {
    const account = pickRandom(accounts);
    const category = pickRandom(categories);

    const res = http.post(`${BASE_URL}/api/transactions`, buildPayload(account, category), {
      headers,
      timeout: '10s',
      tags: {
        endpoint: 'POST /api/transactions',
        name: 'POST /api/transactions',
        url: `${BASE_URL}/api/transactions`,
      },
    });

    check(res, {
      'create status 201': (r) => r && r.status === 201,
    });
  } else {
    const res = http.get(`${BASE_URL}/api/accounts`, {
      headers,
      timeout: '10s',
      tags: {
        endpoint: 'GET /api/accounts',
        name: 'GET /api/accounts',
        url: `${BASE_URL}/api/accounts`,
      },
    });

    check(res, {
      'accounts status 200': (r) => r && r.status === 200,
    });
  }

  sleep(1);
}
