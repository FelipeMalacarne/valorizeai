# k6 Load Tests

This directory stores the stress and soak scenarios used to validate the ValorizeAI API SLOs.  
Each script is standalone and can run against staging or production just by changing the environment variables.

## Requirements

- [k6](https://k6.io/docs/get-started/installation/)
- A valid bearer token generated via `/api/tokens` (Sanctum) for the test user
- Node-style `.env` file (see below) or inline `BASE_URL`/`TOKEN` exports

## Preparing Environment Variables

```bash
cd tests/k6
cp env.example .env      # fill with real values
export $(xargs < .env)
```

`env.example` contains:

| Variable | Description |
| --- | --- |
| `BASE_URL` | Public URL of the API (e.g., `https://api.valorizeai.com`) |
| `TOKEN` | Sanctum personal access token used in `Authorization: Bearer ...` |
| `TRANSACTION_ACCOUNT_ID` | Account ID (UUID) for POST tests *(optional – auto-detected if omitted)* |
| `TRANSACTION_CATEGORY_ID` | Category ID (UUID) *(optional – auto-detected if omitted)* |
| `TRANSACTION_CURRENCY` | Currency code for transaction payloads (defaults to account currency or `BRL`) |

If you omit the account/category IDs, the `transactions.js` script fetches the first available resources via the API. It will `fail()` if none exist, so make sure the test user already has at least one account and category.

> Tokens should be generated beforehand so the scripts focus on the workload endpoints instead of `/api/token`.

## Running Scenarios

### C1 – Accounts listing (GET `/api/accounts`)

```bash
cd tests/k6
export $(xargs < .env)
k6 run scenarios/accounts.js
```

### C2 – Transaction creation (POST `/api/transactions`)

```bash
k6 run scenarios/transactions.js
```

If `TRANSACTION_ACCOUNT_ID`/`TRANSACTION_CATEGORY_ID` are unset, the script fetches the first available account/category via the API during `setup()`.

## Adjusting Load Profiles

The embedded `options` use three stages: ramp up → sustain → ramp down.  
For production-level runs increase the plateau (`target`) to the desired RPS (e.g., 400 for C1, 300 for C2) and extend the middle stage duration.

Example snippet to reach 400 RPS during the sustain window:

```js
export const options = {
  stages: [
    { duration: '3m', target: 100 },
    { duration: '5m', target: 400 }, // production peak
    { duration: '2m', target: 0 },
  ],
};
```

## Outputs

Use the built-in reporters to capture results:

```bash
k6 run --out csv=out/accounts.csv scenarios/accounts.js
```

The CSV (or JSON) can then be imported into Google Sheets or Grafana to plot P95/P99 latency and error rates. Remember to correlate those timestamps with Cloud Monitoring dashboards for CPU/RAM/DB metrics.

## Next Steps

- Add the mixed read/write scenario (C4) once the first two scripts are validated.
- Wire these scripts into CI (GitHub Actions or Cloud Build) using scheduled smoke runs.
- Store production run artifacts (CSV, dashboards screenshots) for inclusion in the TCC chapter.
