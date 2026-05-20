# Daily Agent Brief

## Current Mission

Sprint 6 is closed for AVG Phase 4: Retrieval and Documents.

Approved plan:

- `docs/00-product/mvp-4-retrieval-and-documents-plan.md`
- `.codex/war-room/sprint-backlog.md`
- `.codex/war-room/project-backlog-progress.md`
- `.codex/model-policy.md`

Completed prior work is archived at:

- `.codex/war-room/archive/mvp-0-to-mvp-3-2026-05-20/`

## Current Sprint

Active sprint: `Sprint 6`.

Current gate:

- `AVG-601` contract freeze is complete.
- `AVG-602` document registration and local store boundary is complete.
- `AVG-603` deterministic chunking and search surface is complete.
- `AVG-604` grounded response composition is complete.
- `AVG-605` citation panel and retrieval eval proof is complete.
- Sprint 6 is closed and ready for PR packaging.

Execution rule:

- Retrieval must be contract-first.
- Do not add prompt behavior for source-grounded answers without eval fixtures.
- Do not add production retrieval dependencies before the local contract is proven.

## Active Branches

| Agent | Branch | Task | Approved Model | Risk | Status |
|---|---|---|---|---|---|
| Architect | agent/architect/AVG-601-retrieval-grounding-contract | retrieval and grounding contract | gpt-5.5 | red | done |
| Backend | agent/backend/AVG-602-document-registration | document registration and local store boundary | gpt-5.4 | yellow | done |
| Retrieval | agent/retrieval/AVG-603-chunking-search-surface | chunking and search surface | gpt-5.4 | yellow | done |
| Backend/Validation | agent/backend/AVG-604-grounded-response-composer | grounded response composer | gpt-5.5 | red | done |
| Frontend/QA | agent/frontend/AVG-605-citation-panel-evals | citation panel and retrieval evals | gpt-5.4 | yellow | done |

## Shared Contracts Under Freeze

- Structured AVG response schema.
- Claim validation schema.
- Concept map schema.

## Red Zones

Do not edit without owner:

- `schemas/json-schema/claim.schema.json`;
- `schemas/openapi/openapi.yaml`;
- `prompts/system/base.md`;
- production database or vector index configuration.

## Open Decisions

- Production vector database selection remains deferred.
- External web ingestion remains deferred.
- Long-term document storage and permission policy remain deferred.

## Closure Record

- Decision log: `.codex/war-room/decisions.md`.
- Closure archive: `.codex/war-room/archive/mvp-4-sprint-6-2026-05-20/closure-summary.md`.
- Changelog: `CHANGELOG.md`.

## Context Watch

| Task | Agent | Context | Risk | Action |
|---|---|---|---|---|
| AVG-601 | Architect | green | shared contract design | done |
| AVG-602 | Backend | green | local store boundary | done |
| AVG-603 | Retrieval | green | deterministic retrieval surface | done |
| AVG-604 | Backend/Validation | green | grounded response boundary | done |
| AVG-605 | Frontend/QA | green | citation panel and eval fixtures | done |

## Model Watch

| Task | Agent | Approved Model | Escalation |
|---|---|---|---|
| AVG-601 | Architect | `gpt-5.5` | done |
| AVG-602 | Backend | `gpt-5.4` | done |
| AVG-603 | Retrieval | `gpt-5.4` | done |
| AVG-604 | Backend/Validation | `gpt-5.5` | done |
| AVG-605 | Frontend/QA | `gpt-5.4` | done |
