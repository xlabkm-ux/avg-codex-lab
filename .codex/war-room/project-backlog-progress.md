# Project Backlog Progress

This file is the live progress view for Phase 4.

Source of truth for scope:

- `docs/00-product/mvp-4-retrieval-and-documents-plan.md`
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
| Sprint 6: Retrieval and Documents | 5 / 5 done | MVP-4 vertical slice implemented and verified |

## Sprint 6: MVP-4 Retrieval and Documents

| Task | Owner | Status | Progress | Evidence / Next Step |
|---|---|---|---:|---|
| AVG-601 | Architect | done | 100% | retrieval and grounding contract frozen in docs; downstream tasks unblocked |
| AVG-602 | Backend | done | 100% | document registration and local store boundary implemented in `@avg/retrieval` and `@avg/api` |
| AVG-603 | Retrieval | done | 100% | deterministic chunking and search surface implemented in `@avg/retrieval`; root checks pass |
| AVG-604 | Backend/Validation | done | 100% | grounded response composer and API response composition implemented; low-confidence and prompt-injection tests pass |
| AVG-605 | Frontend/QA | done | 100% | citation panel, retrieval smoke coverage and critical eval fixtures are in place |

## Verification

- `pnpm --filter @avg/api test`
- `pnpm --filter @avg/validation test`
- `pnpm --filter @avg/evals test`
- `pnpm --filter @avg/api typecheck`
- `pnpm --filter @avg/validation typecheck`
- `pnpm --filter @avg/evals typecheck`
- `pnpm test`
- `pnpm typecheck`
- `pnpm lint`
- `pnpm build`

## Update Rules

- Update this file when a task moves between `ready`, `in progress`, `blocked`, `done` or `deferred`.
- Every `done` task must list the checks or review evidence that closed it.
- Every non-`done` task must state the objective blocker, missing dependency or concrete remaining work.
