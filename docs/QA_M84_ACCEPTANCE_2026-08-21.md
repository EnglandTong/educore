# M84 QA Decision — 2026-08-21

角色：Controller / Developer / QA（Owner 已授权同一 Agent 兼任）  
决定：`Accept-with-notes`

## Accepted evidence

- API tests: 54 passed; API/Web typecheck passed; Web production build passed.
- Real isolated HTTP: login, training start, question selection, server grading, mastery,
  training end, cross-account denial, answer replay and end-session replay passed.
- System Chrome: dashboard, training question, answer and next-question flow passed.
- Browser offline/reconnect flow advanced after replay.
- Database assertion confirmed persisted `bktParams.pKnown`, with score/level derived in the
  same server update path.
- CORS, response-shape and invalid seed JSON defects were repaired and rechecked.

## Notes

- The browser-visible recovery path is proven; a separate direct IndexedDB inspection of the
  deleted row was intermittent in the harness. Queue code deletes successful rows and exposes
  retry-limit failures to the user; retain this as a follow-up observation.
- M84 acceptance covers only the Owner-confirmed student learning loop. It does not accept
  teacher, parent, school, volunteer, payment, or community capabilities.

## Conclusion

M84 is accepted with notes. M85 may begin Controller analysis; M86 placeholder disposition may
begin only as a separate bounded work order. No claim is made that M85/M86 are complete.
