# apps/api

Fastify API: sessions, projects, messages, tools, OpenAI orchestration.

## Current Surface

- `health()` reports service availability.
- `createProject()`, `createSession()` and `appendMessage()` provide a minimal in-memory project/session/message API.
- `validateClaimRequest()` forwards claim bodies into the contract validator.

## First Implementation Tasks

- Add package.json.
- Add TypeScript config extending root.
- Add health/smoke test.
- Add README usage examples.

## Usage Notes

The current API surface is intentionally in-memory and deterministic. It is a contract slice for Sprint 1, not a production persistence layer.
