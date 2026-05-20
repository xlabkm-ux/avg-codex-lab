# Daily Agent Brief

## Current Mission

Build AVG MVP-0 to MVP-2: repository operating system, structured dialogue and claim validation.

Approved plan:

- `docs/00-product/mvp-0-2-development-plan.md`
- `.codex/war-room/sprint-backlog.md`
- `.codex/agent-execution-matrix.md`
- `.codex/model-policy.md`

## Active Branches

| Agent | Branch | Task | Risk | Status |
|---|---|---|---|---|
| Architect | agent/architect/AVG-001-contracts | package contracts | red | ready |
| DevOps | agent/devops/AVG-002-ci-baseline | CI baseline | yellow | ready |
| QA | agent/qa/AVG-004-schema-validation | testkit/schema validation | yellow | ready |

## Shared Contracts Under Freeze

- ClaimStatus enum.
- ConceptMapNode schema.
- ToolCallResult schema.
- Structured AVG response schema until AVG-101 is approved.

## Red Zones

Do not edit without owner:

- `packages/avg-validation/src/schemas`;
- `schemas/json-schema/claim.schema.json`;
- `schemas/openapi/openapi.yaml`;
- `database migrations`;
- `prompts/system/base.md`.

## Open Decisions

- Should metaphor detection be rule-first, model-first, or hybrid?
- What minimal persistence should MVP-1 use: in-memory, file-backed or local Postgres?
- Which model routing policy should MVP-1 use for local development?

## Context Watch

| Task | Agent | Context | Risk | Action |
|---|---|---|---|---|
| AVG-001 | Architect | green | contract spread | keep schema/API changes sequential |
| AVG-002 | DevOps | green | CI churn | mirror local commands only |
| AVG-004 | QA | green | fixtures may become shared contract | escalate before changing schemas |

## Model Watch

| Task | Agent | Approved Model | Escalation |
|---|---|---|---|
| AVG-001 | Architect | `gpt-5.5` | already strong; no silent substitution |
| AVG-002 | DevOps | `gpt-5.4-mini` | request approval for `standard` |
| AVG-004 | QA | `gpt-5.4` | request approval for `strong` or `review` |
