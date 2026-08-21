# M82 Authorized Runtime Evidence — 2026-08-21

## Boundary

Owner authorized an independent writable Mongo runtime. The audit used a new database name:
`m82_audit_1787269710634_8ceac446` on `127.0.0.1:27017`. No existing database was cleared or reused for test data.

## Observed

| Check | Result |
|---|---|
| API startup | Pass on `127.0.0.1:3300` |
| Web startup | Pass on `127.0.0.1:5173` |
| Student login | Pass |
| Training session start | Pass |
| Get next question | Pass with isolated 30-question fixture |
| Server-side answer grading | Pass |
| Mastery response | Returned score/level/attempts/next review fields |
| Cross-account session access | Rejected with `NOT_FOUND` |
| Duplicate sync operation | First synced; second rejected as already answered |
| Sync status | Placeholder response; not accepted |
| Training end | `INTERNAL_ERROR`; failed |
| Browser login/learning acceptance | Not accepted; browser run remained unreliable |

## Scope limitations

- The fixture bypassed the invalid repository seed corpus because one seed JSON contains an unescaped control character; product seed files were not changed.
- Duplicate-answer rejection is not equivalent to server-authoritative event-idempotency because the client operation id is not sent or persisted.
- No offline disconnect/reconnect/replay acceptance evidence exists.

## Disposition

This is partial M82 runtime evidence only. It does not close M82 MP3/MP4/MP7 and does not authorize M84 implementation.
