# Active Epics

Approved execution plan: `docs/00-product/mvp-4-retrieval-and-documents-plan.md`.

Archived completed work: `.codex/war-room/archive/mvp-0-to-mvp-3-2026-05-20/`.

Sprint backlog: `.codex/war-room/sprint-backlog.md`.

## Epic AVG-MVP-4: Retrieval and Documents

Status: completed.

Goal: add source-aware retrieval so AVG can work with project documents while preserving claim discipline and map/territory boundaries.

Deliverables:

- retrieval and grounding contract;
- local document registration boundary;
- text chunk and retrieval surface;
- source-grounded response composer;
- citation panel in the web surface;
- retrieval tests and evals.

Planning notes:

- Sprint 6 completed the contract-first MVP-4 vertical slice.
- The implementation uses local deterministic retrieval and does not add production vector database dependencies.
- No prompt behavior changed during MVP-4 completion; retrieval behavior is enforced through contracts, validators, smoke tests and eval fixtures.
- Remaining work belongs to later milestones: production storage, permissions, vector database selection, OCR and external web ingestion.
