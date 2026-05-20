# AGENTS.md

## Mission

You are working inside **AVG Codex Lab**.

AVG is a creative dialogue system that helps users generate ideas, build concept maps, validate claims, distinguish fact from hypothesis, distinguish metaphor from model, and transform raw thinking into structured artifacts.

This repository is designed for Codex App, Codex CLI, Codex Cloud, IDE usage, and parallel subagent workflows.

## Non-negotiable Product Principle

AVG must never behave like a simple chatbot wrapper.

Every important term, concept, claim, metaphor, edge, and generated answer must preserve:

- scope;
- claim status;
- language mode;
- access mode;
- validation risk;
- map/territory boundary.

Never present a metaphor as fact.
Never present a working map as Reality.
Never hide uncertainty behind impressive language.
Never convert a term into an object without explicit modeling boundaries.

## Before Editing

Before changing code or documentation:

1. Read this file.
2. Read `.codex/mission.md`.
3. Read the relevant package README.
4. Read the related ADR if one exists.
5. Inspect related tests and schemas.
6. Make the smallest coherent change.
7. Add or update tests/evals.
8. Document risks and rollback in the PR.

## Standard Commands

Use these commands unless a task says otherwise:

```bash
pnpm install
pnpm lint
pnpm typecheck
pnpm test
pnpm test:contract
pnpm test:ai
pnpm build
```

## Branch Naming

```text
agent/<role>/<ticket-id>-<short-slug>
```

Examples:

```text
agent/frontend/AVG-142-map-panel
agent/validator/AVG-219-claim-risk-engine
agent/evals/AVG-301-regression-suite
```

## Commit Style

Use Conventional Commits:

```text
feat(validator): add metaphor-only claim status
fix(api): prevent empty project memory update
test(evals): add hallucination regression case
docs(adr): record graph database decision
```

## Pull Request Requirements

Every PR must include:

- purpose;
- changed areas;
- screenshots if UI changed;
- tests run;
- AI evals run if prompt or model behavior changed;
- risks;
- rollback plan;
- affected agents;
- migration notes if any.

## Parallel Work Rules

One agent, one task, one branch, one PR.

Do not allow multiple agents to change shared schemas, migrations, prompts, or security controls without an Architect/QA/Security owner.

## Forbidden

Do not:

- rewrite unrelated code;
- silently change public contracts;
- introduce untyped JSON;
- add prompt text without evals;
- bypass validators;
- create new dependencies without justification;
- merge generated code without review;
- hide business logic inside prompts when it belongs in schemas or validators.

## Quality Philosophy

Prompt changes are production changes.
AI behavior must be tested.
Schemas are contracts.
Docs are part of the product.
