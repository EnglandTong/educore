# LOOP_CONFIG - EduCore

protocol_version: 1
runner: generic
status: M50 Planning Baseline
last_updated: 2026-07-06

## Loop Budget

max_loops: 96
max_consecutive_failures: 3
max_runtime_minutes: 480
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

## Active Planning Baseline

latest_accepted_milestone: M49 - Teacher Arc M40-M49 Final Regression
next_planned_milestone: M50 - System Vision Rebaseline
M50_scope: docs-only rebaseline (OVR-001: M51+ allows product implementation)
M50_non_goals:
  - production deployment (still applies all milestones)
  - secret/credential exposure (still applies all milestones)
  - production data access (still applies all milestones)
  - destructive Git (still applies all milestones)
owner_override: OVR-001 (M50-M80 autonomous execution, 2026-07-06)

## Verification Commands

verification_commands:
  docs_target: Select-String -LiteralPath .\Docs\TARGET.md -Pattern "equal learning","Service Ecosystem","M49","Non-Goals","Failure Examples"
  docs_acceptance: Select-String -LiteralPath .\Docs\ACCEPTANCE.md -Pattern "Must Pass","Student protection","Fairness","M49","Known Exclusions"
  docs_stop_rules: Select-String -LiteralPath .\Docs\STOP_RULES.md -Pattern "Hard Stops","Student Protection","Volunteer","Enterprise","max_consecutive_failures"
  docs_work_order: Select-String -LiteralPath .\Docs\WORK_ORDER_M50.md -Pattern "M50-R1","M50-R2","M50-R3","M50-R4","Ready for Controller/QA Review"
  docs_roadmap: Select-String -LiteralPath .\Docs\PROJECT_ROADMAP.md -Pattern "M50","M80","National Talent Development"
  typecheck: corepack pnpm --filter @educore/web run typecheck
  build: corepack pnpm --filter @educore/web run build
  e2e: corepack pnpm --filter @educore/web run test:e2e --reporter=list

## Progress Signals

progress_signals:
  - new passing verification
  - narrower failing scope
  - changed root cause with evidence
  - implemented accepted next action
  - updated evidence path with timestamp

## Completion Policy

Developer may mark work as Developer Complete, Ready for Controller/QA Review, Blocked, or Failed / Needs Fix.
Developer must not mark any milestone Accepted or Completed.
Controller/QA owns final acceptance and acceptance records.
