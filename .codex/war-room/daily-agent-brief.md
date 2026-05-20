# Daily Agent Brief

## Current Mission

Build AVG MVP: creative dialogue + claim validation + concept map.

## Active Branches

| Agent | Branch | Task | Risk | Status |
|---|---|---|---|---|
| Architect | agent/architect/AVG-001-architecture-docs | system docs | low | proposed |
| Validation | agent/validator/AVG-002-claim-schema | claim schema | red | waiting |
| Frontend | agent/frontend/AVG-003-map-panel | map UI | green | ready |

## Shared Contracts Under Freeze

- ClaimStatus enum.
- ConceptMapNode schema.
- ToolCallResult schema.

## Red Zones

Do not edit without owner:

- `packages/avg-validation/src/schemas`;
- `schemas/json-schema/claim.schema.json`;
- `database migrations`;
- `prompts/system/base.md`.

## Open Decisions

- Should metaphor detection be rule-first, model-first, or hybrid?
- Should graph sync be event-driven or batch in MVP?
- Which eval threshold blocks release?
