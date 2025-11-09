import http from 'k6/http';
import { check, fail, sleep } from 'k6';

const BASE_URL = __ENV.BASE_URL;
const TOKEN = __ENV.TOKEN;
const ACCOUNT_ID = __ENV.TRANSACTION_ACCOUNT_ID;
const CATEGORY_ID = __ENV.TRANSACTION_CATEGORY_ID;
const CURRENCY = __ENV.TRANSACTION_CURRENCY;

if (!BASE_URL || !TOKEN) {
  fail('BASE_URL and TOKEN environment variables must be defined.');
}

export const options = {
  stages: [
    { duration: '2m', target: 25 },
    { duration: '8m', target: 120 },
    { duration: '2m', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<250'],
    http_req_failed: ['rate<0.005'],
  },
};

function ensureAccount(headers) {
  const res = http.get(`${BASE_URL}/api/accounts`, { headers });

  if (res.status !== 200) {
    fail(`Unable to fetch accounts: HTTP ${res.status}`);
  }

  const data = res.json('data');

  if (!Array.isArray(data) || data.length === 0) {
    fail('No accounts available. Provide TRANSACTION_ACCOUNT_ID or create one for the test user.');
  }

  const account = data[0];

  return {
    id: account.id,
    currency: account.currency,
  };
}

function ensureCategory(headers) {
  const res = http.get(`${BASE_URL}/api/categories`, { headers });

  if (res.status !== 200) {
    fail(`Unable to fetch categories: HTTP ${res.status}`);
  }

  const data = res.json();

  if (!Array.isArray(data) || data.length === 0) {
    fail('No categories available. Provide TRANSACTION_CATEGORY_ID or create one for the test user.');
  }

  return {
    id: data[0].id,
  };
}

export function setup() {
  const headers = {
    Authorization: `Bearer ${TOKEN}`,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  let accountId = ACCOUNT_ID;
  let accountCurrency = CURRENCY;

  if (!accountId) {
    const account = ensureAccount(headers);
    accountId = account.id;
    accountCurrency = account.currency;
  }

  let categoryId = CATEGORY_ID;
  if (!categoryId) {
    const category = ensureCategory(headers);
    categoryId = category.id;
  }

  if (!accountCurrency) {
    accountCurrency = 'BRL';
  }

  return {
    headers,
    accountId,
    categoryId,
    currency: accountCurrency,
  };
}

function buildPayload({ accountId, categoryId, currency }) {
  return JSON.stringify({
    account_id: accountId,
    category_id: categoryId,
    amount: {
      value: 2500,
      currency,
    },
    date: new Date().toISOString().slice(0, 10),
    memo: `k6-transaction-${Date.now()}`,
  });
}

export default function ({ headers, accountId, categoryId, currency }) {
  const res = http.post(`${BASE_URL}/api/transactions`, buildPayload({ accountId, categoryId, currency }), {
    headers,
    tags: { endpoint: 'POST /api/transactions' },
  });

  check(res, {
    'status is 201': (r) => r.status === 201,
    'has id': (r) => Boolean(r.json('id')),
  });

  sleep(1);
}
