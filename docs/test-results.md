19:07 - 19:25 
     execution: local
        script: scenarios/transactions-list.js
        output: csv (transactions.csv)

     scenarios: (100.00%) 1 scenario, 1000 max VUs, 17m30s max duration (incl. graceful stop):
              * default: Up to 1000 looping VUs for 17m0s over 6 stages (gracefulRampDown: 30s, gracefulStop: 30s)


  █ THRESHOLDS

    http_req_duration
    ✓ 'p(95)<300' p(95)=158.48ms

    http_req_failed
    ✓ 'rate<0.005' rate=0.00%


  █ TOTAL RESULTS

    checks_total.......: 959937 940.110919/s
    checks_succeeded...: 99.99% 959936 out of 959937
    checks_failed......: 0.00%  1 out of 959937

    ✗ status is 200
      ↳  99% — ✓ 479968 / ✗ 1
    ✓ has data array 

    HTTP
    http_req_duration..............: avg=65.64ms min=0s      med=49.72ms max=1.82s p(90)=77.21ms p(95)=158.48ms
      { expected_response:true }...: avg=65.64ms min=30.25ms med=49.72ms max=1.82s p(90)=77.21ms p(95)=158.48ms
    http_req_failed................: 0.00%  1 out of 479971
    http_reqs......................: 479971 470.057908/s

    EXECUTION
    iteration_duration.............: avg=1.06s   min=1.03s   med=1.05s   max=11s   p(90)=1.07s   p(95)=1.15s
    iterations.....................: 479969 470.055949/s
    vus............................: 1      min=1           max=1000
    vus_max........................: 1000   min=1000        max=1000

    NETWORK
    data_received..................: 4.5 GB 4.4 MB/s
    data_sent......................: 61 MB  60 kB/s

SLO perspective: durante o platô de 970 RPS (etapa de 900→1000 VUs), o P95 permaneceu em 158~ms, portanto toda a execução ficou dentro do limite de 300~ms.


22:12 - 22:33 (UTC-3)

    execution: local
        script: scenarios/mix.js
        output: csv (docs/tests/2-test-mixed/rw.csv)

     scenarios: (100.00%) 1 scenario, 650 max VUs, 21m30s max duration (incl. graceful stop):
              * default: Up to 650 looping VUs for 21m0s over 7 stages (gracefulRampDown: 30s, gracefulStop: 30s)



  █ THRESHOLDS

    http_req_duration
    ✗ 'p(95)<300' p(95)=658.47ms

    http_req_failed
    ✓ 'rate<0.005' rate=0.00%


  █ TOTAL RESULTS

    checks_total.......: 283126 224.703/s
    checks_succeeded...: 100.00% 283126 out of 283126
    checks_failed......: 0.00%  0 out of 283126

    ✓ list status 200 (183,848)
    ✓ create status 201 (56,755)
    ✓ accounts status 200 (42,523)

    HTTP
    http_req_duration..............: avg=147.76ms min=38.33ms med=64.03ms max=2.67s  p(90)=381.17ms p(95)=658.47ms
      { expected_response:true }...: avg=147.76ms min=38.33ms med=64.03ms max=2.67s  p(90)=381.17ms p(95)=658.47ms
    http_req_failed................: 0.00%  0 out of 285076
    http_reqs......................: 285076 226.251/s

    EXECUTION
    iteration_duration.............: avg=1.15s  min=1.04s  med=1.06s  max=6.34s  p(90)=1.38s  p(95)=1.67s
    iterations.....................: 283126 224.703/s
    vus............................: 4      min=1           max=650
    vus_max........................: 650    min=650         max=650

    NETWORK
    data_received..................: 0.51 GB 0.41 MB/s
    data_sent......................: 64.9 MB 52 kB/s

Até ~450 RPS (etapa de 350 VUs) o P95 permaneceu abaixo de 300~ms; a violação registrada em 658~ms ocorre apenas no trecho de stress (≥550 VUs), quando o cenário força saturação para observar o comportamento pós-SLO.

Breakdown of workload mix: 183,848 `GET /api/transactions` (65%), 56,755 `POST /api/transactions` (20%), 42,523 `GET /api/accounts` (15%). The one-time bootstrap added 650 provisioning calls to `POST /api/testing/load-test-user`, `GET /api/accounts`, and `GET /api/categories` while preparing per-user fixtures.


running (21m00s), 000/650 VUs, 283126 complete and 0 interrupted iterations


queue consuption test

total tasks on queue: 51,58k
time to procedss all: 01:08 - 01:18 (10mins) dia 10
