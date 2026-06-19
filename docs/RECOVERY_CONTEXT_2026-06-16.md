# EduCore Recovery Context

Updated: 2026-06-16

## Current Project Boundary

EduCore is the offline-first education and growth-support system for children in remote or under-resourced areas.

Core intent:

- Students can download learning materials at school to local computers and tablets.
- Students can learn offline and sync updates when internet access is available.
- A small edge model device is part of the product direction: Raspberry Pi + camera + microphone + 7-inch screen.
- Edge-device use cases include offline learning, pronunciation feedback, and taking photos to check answers.
- The product is公益性质 and should be designed for low-connectivity, low-maintenance field use.

## Local Workspace

- Main path: `D:\Development\EduCore`
- Existing structure observed: `apps`, `modules`, `packages`, `docs`, `docker`, `.github`, pnpm workspace files.
- New local evidence document: `D:\Development\Docs\光合计划-系统交接文档.docx`

## Newly Restored / Added Local Evidence

### `D:\Development\Docs\光合计划-系统交接文档.docx`

Readable Word document. Key recovered facts:

- Title: `光合计划 (Guanghe Plan) — 系统交接文档`
- Version: v1.0, generated 2026-05-02.
- Says four development phases had been completed at the time of handoff.
- Describes the platform as upgraded from a learning platform to a "growth companion system".
- Adds psychological care on top of academic learning.
- Core features listed in the document:
  - Dual-identity mechanism: academic identity vs anonymous tree-hole identity, with physical data separation.
  - AI psychological companion using Volcengine emotional model, with automatic mock fallback when no API key is available.
  - Multi-layer crisis detection: keywords, continuous low mood, behavior anomalies, and combined risk score.
  - Three volunteer classes: A review, B psychology, C enterprise.
  - Quality-control scoring formula: differentiation x 0.4 + participation x 0.3 + stability x 0.3.
  - WebSocket real-time push with JWT auth, role rooms, and crisis broadcast.
  - Minor protection: time-window limits, content filtering, guardian binding.
- Technical stack visible in the opening section:
  - Backend: Node.js v18+, Express, MongoDB v6.0+, Mongoose, Socket.IO.

## Recovery Report Mapping

Use these latest recovery reports as the current evidence index:

- `D:\Recover\FINAL_RECOVERY_SCAN_2026-06-16.md`
- `D:\Recover\USEFUL_FILES_BY_PROJECT_2026-06-16.md`

Mapped recovery groups:

- `EduCore / Charity Education`
- `EduCore / 光合公益教育`

## Readable Recovered Files To Inspect First

From the recovery reports:

- `D:\Recover\school.schema.ts`
- `D:\Recover\volunteer.schema.ts`
- `D:\Recover\checkin_2.ts`
- `D:\Recover\question.ts`
- `D:\Recover\questionTypes.ts`
- `D:\Recover\guideSchema.ts`
- `D:\Recover\feedbackSelector.ts`
- `D:\Recover\curatedBank.ts`
- `D:\Recover\spacedRepetition_1.ts`
- `D:\Recover\school.routes.d.ts`
- `D:\Recover\donation.routes.d.ts`
- `D:\Recover\checkin.routes.d.ts`
- `D:\Recover\heart.routes.d.ts`
- `D:\Recover\qa.routes.d.ts`

## Name-Only / Zero-Filled Structure Evidence

Do not overwrite these recovered fragments. Use their names as structure clues:

- `D:\Recover\PRD_光合计划_完整系统架构与开发文档.md`
- `D:\Recover\2026-05-16_农村教育公益平台项目计划书.md`
- `D:\Recover\f84ba9f5-bc2f-4e8e-89f7-9aab15f0fda3_PROJECT_STATUS_CHARITY.md`
- `D:\Recover\EduCore-Audit-Report-2026-05-16.md`
- `D:\Recover\EduCore-Upgrade-Plan-2026-05-16.md`
- `D:\Recover\EduCore-Dev-SOP-2026-05-16.md`
- `D:\Recover\EduCore-Cloud-Offline-Development-Plan.md`
- `D:\Recover\EduCore-Offline-Raspberry-Pi-Technical-Design.md`
- `D:\Recover\EduCore-Offline-Terminal-Roadmap.md`
- `D:\Recover\EduCore-User-Manual.md`
- `D:\Recover\charity-platform-project-plan.md`
- `D:\Recover\charity-platform-staging-plan.md`
- `D:\Recover\53d3ff74-a784-42c2-81bb-851d57fd268c_光合计划平台用户注册协议.docx`
- `D:\Recover\a3e87977-91df-43fb-b7c1-5179803487b1_光合计划平台隐私政策.docx`

## Rebuild Design Inputs

Recommended module boundaries for a fresh development plan:

- Offline content package management.
- Tablet/PC offline learning runtime.
- Sync engine for low-connectivity schools.
- Raspberry Pi terminal app and model runtime.
- Camera answer-check workflow.
- Microphone pronunciation workflow.
- Student learning records.
- Anonymous psychological-support / tree-hole mode.
- Volunteer review and intervention workflow.
- Crisis detection and guardian/school escalation.
- Admin console for schools, content, volunteers, and devices.

## Open Questions For New Development Plan

- Should EduCore continue using MongoDB/Mongoose from the handoff document, or align with the current repo's actual implementation?
- Is the Raspberry Pi terminal part of MVP or a phase-2 edge deployment?
- Which functions must work fully offline on tablet/PC, and which can require later sync?
- What is the minimum crisis-detection and minor-protection feature set for launch?
