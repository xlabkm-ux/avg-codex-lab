# Sprint Backlog

This backlog covers Phase 4: Retrieval and Documents.

## Sprint 6: MVP-4 Retrieval and Documents

Goal: prove a minimal source-grounded document retrieval path.

Status: active.

| Task | Owner | Parallel | Risk | Output |
|---|---|---:|---|---|
| AVG-601 | Architect | no | red | retrieval and grounding contract freeze |
| AVG-602 | Backend | no | yellow | document registration and local store boundary |
| AVG-603 | Retrieval | yes | yellow | chunking and search surface |
| AVG-604 | Backend/Validation | yes | red | source-grounded response composer with citation boundaries |
| AVG-605 | Frontend/QA | yes | yellow | citation panel, smoke tests and retrieval eval fixtures |

Model budget:

| Task | Tier | Model | Approval |
|---|---|---|---|
| AVG-601 | strong | `gpt-5.5` | sprint approval required |
| AVG-602 | standard | `gpt-5.4` | automatic after sprint approval |
| AVG-603 | standard | `gpt-5.4` | automatic after sprint approval |
| AVG-604 | strong | `gpt-5.5` | sprint approval required |
| AVG-605 | standard | `gpt-5.4` | automatic after sprint approval |

Exit criteria:

- retrieval contract is approved;
- document registration returns stable document ids;
- retrieval returns snippet-level citation ids;
- source-grounded responses separate cited facts, interpretation and unsupported uncertainty;
- citation panel renders source references;
- retrieval smoke tests and critical eval fixtures pass.
