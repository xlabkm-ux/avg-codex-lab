# Project Backlog Progress

This file is the live progress view for Phase 5.

Source of truth:

- `docs/00-product/mvp-5-working-interface-plan.md`
- `docs/00-product/mvp-6-advanced-services-plan.md`
- `.codex/war-room/sprint-backlog.md`
- `.codex/war-room/daily-agent-brief.md`

Status legend:

- `ready`: approved and not started;
- `in progress`: active work exists in the current war-room state;
- `blocked`: cannot continue without decision or upstream work;
- `done`: completed and verified against the task definition of done;
- `deferred`: planned for a later approved milestone.

## Snapshot

| Area | Progress | Current State |
|---|---:|---|
| Sprint 7: Interface Foundation | 1 / 4 done | interface contract frozen; implementation tasks ready |
| Sprint 8: Core Product Functions | 0 / 4 done | planned |
| Sprint 9: Product Hardening | 0 / 4 done | planned |
| MVP-6: Advanced Services | 0 / 1 planning gate | deferred |

## Sprint 7: Interface Foundation

| Task | Owner | Status | Progress | Evidence / Next Step |
|---|---|---|---:|---|
| AVG-701 | Architect/Product | done | 100% | interface contract frozen in `docs/05-ui-ux/mvp-5-interface-contract.md` and UI API boundary frozen in `docs/04-api/mvp-5-ui-api-boundary.md` |
| AVG-702 | Frontend | ready | 0% | build workspace shell against the frozen interface contract |
| AVG-703 | Frontend/Validation | ready | 0% | build structured dialogue surface against the frozen interface contract |
| AVG-704 | Frontend/Backend | ready | 0% | build document workspace against the frozen interface contract |

## Sprint 8: Core Product Functions

| Task | Owner | Status | Progress | Evidence / Next Step |
|---|---|---|---:|---|
| AVG-705 | Frontend/Retrieval | ready | 0% | grounded retrieval flow and citation panel |
| AVG-706 | Frontend/Validation | ready | 0% | claim review panel |
| AVG-707 | Frontend/Graph | ready | 0% | concept map surface |
| AVG-708 | Frontend/Product | ready | 0% | artifact workspace and export |

## Sprint 9: Product Hardening

| Task | Owner | Status | Progress | Evidence / Next Step |
|---|---|---|---:|---|
| AVG-709 | QA | ready | 0% | E2E happy path and missing evidence path |
| AVG-710 | QA/Security | ready | 0% | prompt-injection-as-source UI proof |
| AVG-711 | Frontend/QA | ready | 0% | visual and accessibility smoke |
| AVG-712 | Product/Release | ready | 0% | release notes, risk review and rollback plan |

## MVP-6 Deferred

| Area | Status | Boundary |
|---|---|---|
| Voice and speech services | deferred | do not design during MVP-5 |
| Realtime collaboration | deferred | do not design during MVP-5 |
| Production vector/storage services | deferred | do not select dependencies during MVP-5 |
| OCR and external ingestion | deferred | do not design during MVP-5 |

## Verification

No MVP-5 implementation verification has run yet. Planning-only changes should be checked with at least:

- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`

Before closing MVP-5, run the full gate listed in `sprint-backlog.md`.

## Update Rules

- Update this file when a task moves between `ready`, `in progress`, `blocked`, `done` or `deferred`.
- Every `done` task must list the checks or review evidence that closed it.
- Every non-`done` task must state the objective blocker, missing dependency or concrete remaining work.
