# Task Protocol

Every Codex task must have a task card.

## Task Card

```yaml
id: AVG-000
type: feature | bugfix | refactor | test | eval | docs | research | migration
owner_agent: frontend | backend | validator | qa | security | devops | architect | docs
parallel_safe: true
risk: low | medium | high | critical
touches:
  - packages/avg-validation
depends_on: []
blocked_by: []
expected_outputs:
  - implementation
  - tests
  - docs
context_budget:
  target_docs:
    - AGENTS.md
    - .codex/mission.md
  max_files_to_open: 12
  context_status: green | yellow | red
  handoff_required_at: yellow
  compact_summary_required: true
```

## Definition of Ready

- Goal is clear.
- Expected behavior is defined.
- Target files are known.
- Contracts are identified.
- Tests/evals are specified.
- Dependencies and blockers are listed.
- Context budget is declared.

## Definition of Done

- Implementation complete.
- Tests added or updated.
- Typecheck passes.
- Lint passes.
- AI evals pass if AI behavior changed.
- Docs updated if behavior changed.
- PR includes risk and rollback notes.
- Context handoff summary exists if task reached yellow or red.

## Context Budget

Agents must manage context as an explicit task resource.

Use:

- `green` when the task is bounded and only target files are open;
- `yellow` when multiple contracts, many files or unclear ownership are involved;
- `red` when the task must be split before work continues.

A yellow task requires a short handoff summary before more edits. A red task requires replanning.
