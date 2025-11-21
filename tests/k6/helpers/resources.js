import http from 'k6/http';
import { fail } from 'k6';

export function loadAccounts(baseUrl, headers) {
  const res = http.get(`${baseUrl}/api/accounts`, { headers });
  if (res.status !== 200) {
    fail(`Unable to fetch accounts. HTTP ${res.status}`);
  }
  return res.json('data') ?? [];
}

export function loadCategories(baseUrl, headers) {
  const res = http.get(`${baseUrl}/api/categories`, { headers });
  if (res.status !== 200) {
    fail(`Unable to fetch categories. HTTP ${res.status}`);
  }
  return res.json() ?? [];
}

export function ensureBasics(baseUrl, headers) {
  const accounts = loadAccounts(baseUrl, headers);
  const categories = loadCategories(baseUrl, headers);

  if (!accounts.length) {
    fail('No accounts available for the authenticated user.');
  }

  if (!categories.length) {
    fail('No categories available for the authenticated user.');
  }

  return { accounts, categories };
}

export function pickRandom(array) {
  return array[Math.floor(Math.random() * array.length)];
}

export function pickSubset(array, maxItems = 2) {
  if (array.length === 1) {
    return array.slice();
  }

  const count = Math.min(array.length, Math.max(1, Math.floor(Math.random() * maxItems) + 1));

  return array
    .slice()
    .sort(() => 0.5 - Math.random())
    .slice(0, count);
}

export function randomDateISO(pastDays = 30) {
  const now = new Date();
  const offset = Math.floor(Math.random() * pastDays) + 1;
  const date = new Date(now);
  date.setDate(now.getDate() - offset);
  return date.toISOString().slice(0, 10);
}

export function randomDateRange(maxPastDays = 90, maxWindow = 14) {
  const now = new Date();
  const startOffset = Math.floor(Math.random() * (maxPastDays - maxWindow)) + maxWindow;
  const window = Math.floor(Math.random() * maxWindow) + 1;
  const endOffset = Math.max(0, startOffset - window);

  const startDate = new Date(now);
  startDate.setDate(now.getDate() - startOffset);

  const endDate = new Date(now);
  endDate.setDate(now.getDate() - endOffset);

  return {
    start: startDate.toISOString().slice(0, 10),
    end: endDate.toISOString().slice(0, 10),
  };
}
