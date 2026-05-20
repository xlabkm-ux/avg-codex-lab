# Decisions Log

## 2026-05-20 — Blueprint created

Decision: Use Codex-native monorepo with AGENTS.md, `.codex/`, docs, schemas, prompts, tests and package skeleton.

Reason: AVG requires parallel AI-assisted engineering with strict control over contracts and AI behavior.

## 2026-05-20 — MVP-0 to MVP-2 execution plan approved

Decision: Start development with MVP-0 Repository Operating System, then MVP-1 Core Dialogue, then MVP-2 Claim Validation.

Reason: AVG must prove structured dialogue and claim discipline before investing in visual maps, retrieval, voice or production deployment.

Consequence: MVP-3 Concept Map, retrieval and voice are deferred. Contract work is sequential; implementation work may run in parallel only after contracts are stable.

## 2026-05-20 — Model budget policy approved

Decision: Use `.codex/model-policy.md` to assign the lowest safe model tier per sprint task. Agents must start with the approved model and must not silently escalate to a stronger model.

Reason: Project resources are limited, while architecture, shared contracts and AVG validation behavior still require stronger review when risk is high.

Consequence: Sprint backlog includes a model budget table. Escalation to a stronger model requires a human-approved escalation note.

## 2026-05-20 — Phase 4 war-room activated

Decision: Archive completed MVP-0 through MVP-3 working documents and activate Phase 4: Retrieval and Documents.

Reason: Completed sprint materials should remain available as history, while active agent work needs a clean backlog focused on retrieval, documents and citation discipline.

Consequence: Current war-room files now point to Sprint 6 and MVP-4. Completed work lives in `.codex/war-room/archive/mvp-0-to-mvp-3-2026-05-20/`.

## 2026-05-20 — AVG-601 retrieval grounding contract frozen

Decision: Freeze the MVP-4 retrieval and grounding contract in `docs/02-ai-system/retrieval-grounding-contract.md` and `docs/04-api/retrieval-api-contract.md`.

Reason: Backend, retrieval, validation and UI work need a stable citation boundary before implementation starts.

Consequence: AVG-602 may start against a local deterministic document store boundary. Public response schema changes are deferred until AVG-604 confirms the smallest stable grounded response extension.
