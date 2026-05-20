# Risk Radar

| Risk | Severity | Owner | Mitigation |
|---|---:|---|---|
| Retrieval hallucination | high | Retrieval/QA | source-grounding evals and unsupported-answer boundaries |
| Citation drift | high | Backend/QA | snippet-level citation ids and contract tests |
| Source treated as Reality | high | Validation Agent | explicit map/territory boundary in grounded responses |
| Premature vector database complexity | medium | Architect/Backend | local retrieval surface before production dependency |
| Prompt-only retrieval behavior | high | Validation/QA | schemas, validators and eval fixtures enforce behavior |
| Document privacy leakage | high | Security/Backend | local-only MVP boundary and no external ingestion by default |
| Over-broad document scope | medium | Product/Architect | MVP-4 accepts only project-local registered documents |
| Weak retrieval observability | medium | QA/DevOps | log query, citation ids and retrieval confidence in tests |

## Sprint 6 Risk Notes

- Retrieval hallucination is mitigated in MVP-4 by grounded response composition, unsupported-claim boundaries and retrieval eval fixtures.
- Citation drift is mitigated by deterministic snippet ids, citation ids and route/unit tests.
- Prompt-injection inside sources is covered by `tests/ai-evals/retrieval/prompt-injection-source.yaml` and composer tests that keep source text quoted as content.
- Production vector database complexity remains deferred by design.
