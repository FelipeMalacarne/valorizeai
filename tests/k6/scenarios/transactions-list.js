import { check, fail, sleep } from 'k6';
import http from 'k6/http';
import { QueryBuilder } from '../helpers/query.js';
import { ensureBasics, pickSubset } from '../helpers/resources.js';

const BASE_URL = __ENV.BASE_URL;
const TOKEN = __ENV.TOKEN;

if (!BASE_URL || !TOKEN) {
    fail('BASE_URL and TOKEN environment variables must be defined.');
}

export const options = {
  stages: [
        { duration: '2m', target: 150 }, // aquecimento
        { duration: '3m', target: 300 }, // carga nominal
        { duration: '4m', target: 600 },
        { duration: '4m', target: 900 }, // limite observado (1 vCPU/1 GiB x10 instâncias)
        { duration: '2m', target: 1000 }, // pico curto para medir saturação
        { duration: '2m', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<300'],
    http_req_failed: ['rate<0.005'],
  },
};

function buildQuery({ accounts, categories }) {
    const query = new QueryBuilder();

    const filterByAccounts = Math.random() > 0.5;

    if (filterByAccounts) {
        query.addMany(
            'accounts[]',
            pickSubset(accounts).map((account) => account.id),
        );
    } else {
        query.addMany(
            'categories[]',
            pickSubset(categories).map((category) => category.id),
        );
    }

    // Always request first page with deterministic size
    query.add('page', 1);
    query.add('per_page', 15);

    return query.toString();
}

export function setup() {
    const headers = {
        Authorization: `Bearer ${TOKEN}`,
        Accept: 'application/json',
    };

    const resources = ensureBasics(BASE_URL, headers);

    return {
        headers,
        ...resources,
    };
}

export default function ({ headers, accounts, categories }) {
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

    const ok = check(res, {
        'status is 200': (r) => r && r.status === 200,
    });

    if (ok) {
        check(res, {
            'has data array': (r) => Array.isArray(r.json('data')),
        });
    }

    sleep(1);
}
