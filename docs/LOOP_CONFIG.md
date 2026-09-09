# LOOP_CONFIG - EduCore

protocol_version: 1
runner: generic
status: M87 Ready for QA; Pilot Core planned
last_updated: 2026-09-09
board: docs/PROJECT_BOARD.md

## Loop Budget

max_loops: 24
max_consecutive_failures: 2
max_runtime_minutes: 240
max_context_files_per_loop: 8
max_recent_loop_records: 5
require_double_evidence_for_done: true
core_verification: documentation_plus_defined_commands

## Execution Boundaries

allow_parallel_tasks: false
allow_project_dependency_install: true
allow_project_config_changes: true
allow_system_install: false
allow_secret_access: false
allow_production_data_access: false
allow_destructive_changes: false
allow_out_of_repo_writes: false
allow_student_contact_without_consent: false
allow_volunteer_or_enterprise_contact_without_governance: false
allow_real_hardware_as_acceptance_gate: false

## Active Planning Baseline

latest_closed_program: M82-M86 (2026-08-21)
latest_accepted_runtime_baseline: M84 - Student Learning Loop (Accept-with-notes)
active_milestone: M87 - Governance Rebaseline + Hardware Simulation Gate
M87_scope:
  - docs governance sync
  - injectable ModelManager
  - simulated Ollama / edge constraint profiles (pi-ok, pi-slow, pi-down, offline-core)
M87_non_goals:
  - real Raspberry Pi / edge deployment
  - live Ollama required for CI
  - parent/school/volunteer expansion
  - payment/donation activation
  - production deployment / secrets / destructive Git

## Verification Commands

verification_commands:
  docs_target: grep -E "M87|Hardware paused|simulation" docs/TARGET.md
  docs_acceptance: grep -E "Must Pass|pi-ok|pi-slow|pi-down|offline-core" docs/ACCEPTANCE.md
  docs_work_order: grep -E "M87-R1|M87-R2|M87-R3" docs/WORK_ORDER_M87.md
  api_test: pnpm --filter @educore/api test
  api_typecheck: pnpm --filter @educore/api typecheck

## Progress Signals

progress_signals:
  - new passing verification
  - narrower failing scope
  - changed root cause with evidence
  - docs and code agree on Hardware paused + sim gate
