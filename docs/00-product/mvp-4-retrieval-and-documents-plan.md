# MVP-4 Retrieval and Documents Plan

## Purpose

MVP-4 adds source-aware retrieval to AVG without weakening the product principle that AVG is a map-making and map-checking system, not a truth machine.

The goal is to let a user register project documents, retrieve relevant source snippets, and receive answers that clearly separate:

- cited source content;
- AVG interpretation;
- hypothesis or uncertainty;
- map/territory boundaries.

## Scope

Approved MVP-4 scope:

- retrieval and source-grounding contract;
- minimal document registration and text extraction boundary;
- local document store and retrieval index;
- citation-aware answer composition;
- source/citation panel in the web surface;
- retrieval quality tests and eval fixtures.

## Non-Scope

Deferred until later phases:

- production vector database selection;
- document collaboration permissions;
- OCR for scanned documents;
- broad RAG over external web sources;
- automatic source trust scoring;
- voice-driven document workflows.

## Sprint Plan

### Sprint 6: Retrieval Contract and Vertical Slice

Goal: prove a minimal source-grounded answer path end to end.

Deliverables:

- retrieval contract freeze;
- document registration API boundary;
- local text chunk and retrieval surface;
- grounded response composer with citations;
- minimal citation panel;
- retrieval smoke and eval checks.

Contract baseline:

- `docs/02-ai-system/retrieval-grounding-contract.md`
- `docs/04-api/retrieval-api-contract.md`

Definition of Done:

- a document can be registered in local development;
- a query returns source snippets with stable citation ids;
- AVG response marks cited facts, interpretations and uncertainty;
- uncited claims are either avoided or explicitly marked as unsupported;
- tests cover citation shape, retrieval behavior and no-fairy-tale risk;
- docs explain risks and rollback.

## Contract Principles

- Sources are evidence inputs, not Reality.
- Citations must point to specific snippets, not vague document names.
- Retrieval confidence is a risk signal, not a truth label.
- AVG may synthesize, but synthesis must remain visibly distinct from cited text.
- Missing or weak sources must produce a boundary statement instead of confident prose.

## Decision Points

Human approval is required before:

- adding a production vector database;
- changing public response schemas;
- adding document upload dependencies;
- changing prompt behavior for source-grounded answers;
- ingesting external web content.

## Rollback

MVP-4 can be rolled back by disabling document registration and source-grounded answer composition while preserving existing dialogue, validation and concept map behavior.
