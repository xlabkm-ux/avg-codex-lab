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
