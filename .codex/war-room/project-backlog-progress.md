# Project Backlog Progress

This file is the live progress view for the approved backlog.

Source of truth for scope:

- `.codex/war-room/sprint-backlog.md`
- `.codex/war-room/daily-agent-brief.md`
- `.codex/agent-execution-matrix.md`

Status legend:

- `ready`: approved and not started;
- `in progress`: active work exists in the current war-room state;
- `blocked`: cannot continue without decision or upstream work;
- `done`: completed and verified against the task definition of done;
- `deferred`: planned for a later approved milestone.

## Snapshot

| Area | Progress | Current State |
|---|---:|---|
| Sprint 0: Repository Operating System | 5 / 5 done | AVG-001, AVG-002, AVG-003, AVG-004 and AVG-005 are done |
| Sprint 1: Backend Dialogue Slice | 5 / 5 done | all Sprint 1 tasks are done and validated |
| Sprint 2: Web Dialogue Slice | 5 / 5 done | all Sprint 2 tasks are done and validated |
| Sprint 3: Validation Core | 5 / 5 done | AVG-301, AVG-302, AVG-303, AVG-304 and AVG-305 are done |
| Sprint 4: Validation UX/API | 1 / 5 active | AVG-402 claim safety eval targets are in progress |

## Sprint 0: MVP-0 Repository Operating System

| Task | Owner | Status | Progress | Evidence / Next Step |
|---|---|---|---:|---|
| AVG-001 | Architect | done | 100% | package contracts and dependency direction are confirmed in the package map and root checks pass |
| AVG-002 | DevOps | done | 100% | CI baseline mirrors root install, lint, typecheck, test and build commands |
| AVG-003 | Backend | done | 100% | `@avg/openai` package baseline exists; build, lint, typecheck, unit tests and root checks pass locally |
| AVG-004 | QA | done | 100% | `@avg/testkit` exists and `validate:schemas` passes against the schema contract suite |
| AVG-005 | Docs | done | 100% | backlog progress dashboard exists; onboarding and first-task docs are published and current |

Exit criteria:

- root checks pass;
- CI mirrors local checks;
- task protocol includes context budget;
- MVP-1 tasks are ready.

Current exit status: `done`.

## Sprint 1: MVP-1 Backend Dialogue Slice

| Task | Owner | Status | Progress | Evidence / Next Step |
|---|---|---|---:|---|
| AVG-101 | Architect | done | 100% | structured response contract approved and validated with schema, API and workspace checks |
| AVG-102 | Backend | done | 100% | project/session/message API is implemented and validated with package, root and workspace checks |
| AVG-103 | Backend | done | 100% | OpenAI adapter boundary with normalized errors is implemented and validated with package and workspace checks |
| AVG-104 | Backend | done | 100% | mode router and response composer are implemented and validated with package and workspace checks |
| AVG-105 | QA | done | 100% | API contract and smoke tests are implemented and validated with package and workspace checks |

## Sprint 2: MVP-1 Web Dialogue Slice

| Task | Owner | Status | Progress | Evidence / Next Step |
|---|---|---|---:|---|
| AVG-201 | Frontend | done | 100% | minimal project/session UI is implemented and validated with package and workspace checks |
| AVG-202 | Frontend | done | 100% | dialogue message surface is implemented and validated with package and workspace checks |
| AVG-203 | Frontend | done | 100% | structured response details panel is implemented and validated with package and workspace checks |
| AVG-204 | QA | done | 100% | first dialogue smoke test is implemented and validated with package and workspace checks |
| AVG-205 | Docs | done | 100% | MVP-1 web usage notes and example flow are documented |

## Sprint 3: MVP-2 Validation Core

| Task | Owner | Status | Progress | Evidence / Next Step |
|---|---|---|---:|---|
| AVG-301 | Architect | done | 100% | claim validation contract is frozen in `docs/02-ai-system/claim-validation-contract.md` and Sprint 3 can advance |
| AVG-302 | Validation | done | 100% | claim extraction and schema validation are implemented in `packages/avg-validation` and verified with unit, typecheck and build checks |
| AVG-303 | Validation | done | 100% | claim status and language mode classifier is implemented in `packages/avg-validation` and verified with unit, typecheck and build checks |
| AVG-304 | Validation | done | 100% | risk classifier and repair suggestions are implemented in `packages/avg-validation` and verified with unit, typecheck and build checks |
| AVG-305 | QA | done | 100% | unit and contract coverage for the validation package is implemented and verified with package and root checks |

## Sprint 4: MVP-2 Eval and Validation UX/API

| Task | Owner | Status | Progress | Evidence / Next Step |
|---|---|---|---:|---|
| AVG-401 | Validation | ready | 0% | can start now that the validation core is complete |
| AVG-402 | QA | in progress | 40% | claim-safety helper and fixture-backed tests are in place; finishing regression wiring |
| AVG-403 | Backend | deferred | 0% | waits for validation API contract |
| AVG-404 | Frontend | deferred | 0% | waits for validation API output |
| AVG-405 | Docs | deferred | 0% | waits for behavior ledger and release notes |

## Update Rules

- Update this file when a task moves between `ready`, `in progress`, `blocked`, `done` or `deferred`.
- Keep scope changes in `.codex/war-room/sprint-backlog.md`; keep progress changes here.
- Every `done` task must list the checks or review evidence that closed it.
- Every non-`done` task must state the objective blocker, missing dependency or concrete remaining work in the Evidence / Next Step column.
- If a task has no objective blocker and the required checks already pass, move it to `done` instead of leaving it `ready` or `in progress`.
