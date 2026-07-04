# Debug Session: jest-open-handles
- **Status**: [RESOLVED]
- **Issue**: Full backend Jest suite is noisy and does not terminate cleanly because one or more open handles remain after tests complete.
- **Debug Server**: `http://127.0.0.1:7777/event`
- **Log File**: .dbg/trae-debug-log-jest-open-handles.ndjson

## Reproduction Steps
1. Run the full backend Jest suite from `backend/`.
2. Observe whether assertions finish but the Jest process remains active or reports open handles.

## Hypotheses & Verification
| ID | Hypothesis | Likelihood | Effort | Evidence |
|----|------------|------------|--------|----------|
| A | A long-lived Redis client is created during app import and never disconnected in test teardown. | High | Low | Reproduced only during temporary instrumentation because the test file imported `config/redis.js`; not the underlying suite blocker. |
| B | Database pool connections remain open because the test harness never closes the pool. | High | Low | Confirmed. Explicit `await pool.end()` in `backend/src/__tests__/app.test.js` removed the lingering Jest process. |
| C | One or more modules start timers or background workers during import, leaving active timer handles after the suite. | Medium | Medium | Not supported by the final clean rerun. |
| D | The Jest environment lacks explicit teardown hooks for backend resources, so valid resources survive after all assertions. | High | Low | Confirmed. The suite had no database teardown before the fix. |
| E | Detached local processes from previous manual runs are interfering with reproduction or causing false-positive lingering handles. | Low | Low | Contributed noise. Old `npm test` / `jest` processes were terminated before final verification. |

## Log Evidence
- The debug log showed the suite reaching `afterAll` while the pg pool still had an open connection and the instrumented Redis client remained in `connecting`.
- After removing the temporary Redis instrumentation and closing the pg pool in test teardown, `npm test -- --runInBand --detectOpenHandles` exited normally.

## Verification Conclusion
- Root cause: the backend test suite imported and used the shared pg pool without closing it, so Jest stayed alive after assertions completed.
- Fix: added `afterAll(async () => { await pool.end(); })` to `backend/src/__tests__/app.test.js` and removed the temporary debug instrumentation from `backend/src/config/db.js`, `backend/src/config/redis.js`, and the test file.
- Validation: `npm test -- --runInBand --detectOpenHandles` passed with `26/26` tests and exited cleanly.
