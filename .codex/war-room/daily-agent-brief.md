# Daily Agent Brief

## Current Mission

Build AVG Phase 4: Retrieval and Documents.

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
- Start `AVG-603` deterministic chunking and search surface next.

Execution rule:

- Retrieval must be contract-first.
- Do not add prompt behavior for source-grounded answers without eval fixtures.
- Do not add production retrieval dependencies before the local contract is proven.

## Active Branches

| Agent | Branch | Task | Approved Model | Risk | Status |
|---|---|---|---|---|---|
| Architect | agent/architect/AVG-601-retrieval-grounding-contract | retrieval and grounding contract | gpt-5.5 | red | done |
| Backend | agent/backend/AVG-602-document-registration | document registration and local store boundary | gpt-5.4 | yellow | done |
| Retrieval | agent/retrieval/AVG-603-chunking-search-surface | chunking and search surface | gpt-5.4 | yellow | ready |

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

- Should Sprint 6 use file-backed JSON, in-memory storage or an existing local package boundary?
- What chunk size and ranking baseline should AVG-603 use for deterministic local retrieval?

## Context Watch

| Task | Agent | Context | Risk | Action |
|---|---|---|---|---|
| AVG-601 | Architect | green | shared contract design | done |
| AVG-602 | Backend | green | local store boundary | done |
| AVG-603 | Retrieval | green | deterministic retrieval surface | use local document store |

## Model Watch

| Task | Agent | Approved Model | Escalation |
|---|---|---|---|
| AVG-601 | Architect | `gpt-5.5` | done |
| AVG-602 | Backend | `gpt-5.4` | done |
| AVG-603 | Retrieval | `gpt-5.4` | ready |
| AVG-604 | Backend/Validation | `gpt-5.5` | sprint approval required |
| AVG-605 | Frontend/QA | `gpt-5.4` | after response shape |
