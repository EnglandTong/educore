# STOP RULES

Status: Active
Last updated: 2026-06-20

Developer must stop and mark the work `Blocked` if any item below is required.

## Stop Conditions

- Production credentials, production secrets, private keys, or live user data.
- Writing outside `D:\Development\EduCore`.
- New architecture, new subsystem, or shared layer beyond `docs/TARGET.md` without Owner approval.
- Destructive git operations such as reset, checkout, clean, force push, or history rewrite.
- Deleting or rewriting evidence history instead of appending corrections.
- Three consecutive failures of the same verification command for the same unresolved reason.
- Dependency installation or external network access not already available locally.

## Required Blocked Evidence

If blocked, update:

- `docs/STATUS.md`
- `docs/PENDING.md`
- active work order handoff section
