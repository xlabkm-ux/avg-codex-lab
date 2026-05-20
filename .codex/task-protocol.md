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
```

## Definition of Ready

- Goal is clear.
- Expected behavior is defined.
- Target files are known.
- Contracts are identified.
- Tests/evals are specified.
- Dependencies and blockers are listed.

## Definition of Done

- Implementation complete.
- Tests added or updated.
- Typecheck passes.
- Lint passes.
- AI evals pass if AI behavior changed.
- Docs updated if behavior changed.
- PR includes risk and rollback notes.
