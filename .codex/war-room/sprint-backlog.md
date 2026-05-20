# Sprint Backlog

This backlog covers the approved MVP-0 to MVP-2 development plan.

## Sprint 0: MVP-0 Repository Operating System

Goal: make the repository executable, testable and safe for agent work.

| Task | Owner | Parallel | Risk | Output |
|---|---|---:|---|---|
| AVG-001 | Architect | no | red | package contracts and dependency direction confirmed |
| AVG-002 | DevOps | yes | yellow | root CI runs install, lint, typecheck and test |
| AVG-003 | Backend | yes | yellow | TypeScript package configs and build scripts |
| AVG-004 | QA | yes | yellow | baseline testkit and schema validation command |
| AVG-005 | Docs | yes | green | onboarding and first-task docs updated |

Exit criteria:

- root checks pass;
- CI mirrors local checks;
- task protocol includes context budget;
- MVP-1 tasks are ready.

## Sprint 1: MVP-1 Backend Dialogue Slice

Goal: expose the minimal structured dialogue path through API.

| Task | Owner | Parallel | Risk | Output |
|---|---|---:|---|---|
| AVG-101 | Architect | no | red | structured response contract approved |
| AVG-102 | Backend | no | yellow | project/session/message API |
| AVG-103 | Backend | yes | yellow | OpenAI adapter boundary with normalized errors |
| AVG-104 | Backend | yes | yellow | mode router and response composer |
| AVG-105 | QA | yes | yellow | API contract and smoke tests |

Exit criteria:

- API returns structured AVG response;
- provider errors are normalized;
- response contract tests pass.

## Sprint 2: MVP-1 Web Dialogue Slice

Goal: make the first user-facing dialogue path usable.

| Task | Owner | Parallel | Risk | Output |
|---|---|---:|---|---|
| AVG-201 | Frontend | yes | yellow | minimal project/session UI |
| AVG-202 | Frontend | yes | yellow | dialogue message surface |
| AVG-203 | Frontend | yes | yellow | structured response details panel |
| AVG-204 | QA | yes | yellow | E2E smoke test for first dialogue |
| AVG-205 | Docs | yes | green | MVP-1 usage notes |

Exit criteria:

- user can submit a raw idea;
- UI shows structured AVG output;
- smoke path is covered by test.

## Sprint 3: MVP-2 Validation Core

Goal: extract and classify claims from AVG responses.

| Task | Owner | Parallel | Risk | Output |
|---|---|---:|---|---|
| AVG-301 | Architect | no | red | claim validation contract freeze |
| AVG-302 | Validation | no | red | claim extraction and schema validation |
| AVG-303 | Validation | yes | yellow | claim status and language mode classifier |
| AVG-304 | Validation | yes | yellow | risk classifier and repair suggestions |
| AVG-305 | QA | yes | yellow | unit and contract tests |

Exit criteria:

- claims validate against JSON Schema;
- risk and repair fields are produced;
- contract tests pass.

## Sprint 4: MVP-2 Eval and Validation UX/API

Goal: prove AVG claim discipline with evals and visible validation output.

| Task | Owner | Parallel | Risk | Output |
|---|---|---:|---|---|
| AVG-401 | Validation | no | red | No Fairy Tale Gate |
| AVG-402 | QA | yes | yellow | metaphor boundary and claim safety evals |
| AVG-403 | Backend | yes | yellow | validation API integration |
| AVG-404 | Frontend | yes | yellow | minimal validation panel |
| AVG-405 | Docs | yes | green | behavior ledger and release notes |

Exit criteria:

- critical eval thresholds pass;
- validation output is visible to the user;
- behavior changes are documented.
