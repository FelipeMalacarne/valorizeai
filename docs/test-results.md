19:07 - 19:25 
     execution: local
        script: scenarios/transactions-list.js
        output: csv (transactions.csv)

     scenarios: (100.00%) 1 scenario, 1000 max VUs, 17m30s max duration (incl. graceful stop):
              * default: Up to 1000 looping VUs for 17m0s over 6 stages (gracefulRampDown: 30s, gracefulStop: 30s)


  █ THRESHOLDS

    http_req_duration
    ✓ 'p(95)<250' p(95)=158.48ms

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


22:53 - 23:13

    execution: local
        script: scenarios/mix.js
        output: csv (mix.csv)

     scenarios: (100.00%) 1 scenario, 650 max VUs, 21m30s max duration (incl. graceful stop):
              * default: Up to 650 looping VUs for 21m0s over 7 stages (gracefulRampDown: 30s, gracefulStop: 30s)



  █ THRESHOLDS

    http_req_duration
    ✗ 'p(95)<250' p(95)=4.03s

    http_req_failed
    ✓ 'rate<0.005' rate=0.00%


  █ TOTAL RESULTS

    checks_total.......: 127506  101.142289/s
    checks_succeeded...: 100.00% 127506 out of 127506
    checks_failed......: 0.00%   0 out of 127506

    ✓ list status 200
    ✓ create status 201
    ✓ accounts status 200

    HTTP
    http_req_duration..............: avg=1.55s min=37ms  med=1.15s max=9.57s  p(90)=3.41s p(95)=4.03s
      { expected_response:true }...: avg=1.55s min=37ms  med=1.15s max=9.57s  p(90)=3.41s p(95)=4.03s
    http_req_failed................: 0.00%  0 out of 127508
    http_reqs......................: 127508 101.143875/s

    EXECUTION
    iteration_duration.............: avg=2.55s min=1.03s med=2.15s max=10.57s p(90)=4.41s p(95)=5.03s
    iterations.....................: 127506 101.142289/s
    vus............................: 4      min=1           max=650
    vus_max........................: 650    min=650         max=650

    NETWORK
    data_received..................: 1.9 GB 1.5 MB/s
    data_sent......................: 35 MB  28 kB/s




running (21m00.7s), 000/650 VUs, 127506 complete and 0 interrupted iterations
