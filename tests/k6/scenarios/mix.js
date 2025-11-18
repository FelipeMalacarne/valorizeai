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

const rawBaseUrl = __ENV.BASE_URL;

if (!rawBaseUrl) {
  fail('BASE_URL environment variable must be defined.');
}

const BASE_URL = rawBaseUrl.replace(/\/$/, '');
const TEST_USER_ENDPOINT = __ENV.TEST_USER_ENDPOINT || '/api/testing/load-test-user';
const PROVISION_URL = TEST_USER_ENDPOINT.startsWith('http')
  ? TEST_USER_ENDPOINT
  : `${BASE_URL}${TEST_USER_ENDPOINT.startsWith('/') ? '' : '/'}${TEST_USER_ENDPOINT}`;

let vuToken = null;
let vuHeaders = null;
let vuAccounts = null;
let vuCategories = null;

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
    http_req_duration: ['p(95)<300'],
    http_req_failed: ['rate<0.005'],
  },
};

function provisionLoadTestUser() {
  const res = http.post(PROVISION_URL, null, {
    headers: {
      Accept: 'application/json',
    },
    timeout: '10s',
    tags: {
      endpoint: 'POST /api/testing/load-test-user',
      name: 'POST /api/testing/load-test-user',
      url: PROVISION_URL,
    },
  });

  if (res.status !== 201) {
    fail(`Unable to provision load-test user. HTTP ${res.status} – ${res.body}`);
  }

  let token;

  try {
    token = res.json('token');
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    fail(`Provisioning endpoint returned an invalid payload: ${message}`);
  }

  if (!token) {
    fail('Provisioning endpoint did not return a token.');
  }

  return token;
}

function ensureVuState() {
  if (vuToken) {
    return;
  }

  vuToken = provisionLoadTestUser();
  vuHeaders = {
    Authorization: `Bearer ${vuToken}`,
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  const resources = ensureBasics(BASE_URL, vuHeaders);
  vuAccounts = resources.accounts;
  vuCategories = resources.categories;
}

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

export default function () {
  ensureVuState();

  const roll = Math.random();

  if (roll < 0.65) {
    const query = buildQuery({ accounts: vuAccounts, categories: vuCategories });
    const res = http.get(`${BASE_URL}/api/transactions?${query}`, {
      headers: vuHeaders,
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
    const account = pickRandom(vuAccounts);
    const category = pickRandom(vuCategories);

    const res = http.post(`${BASE_URL}/api/transactions`, buildPayload(account, category), {
      headers: vuHeaders,
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
      headers: vuHeaders,
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
