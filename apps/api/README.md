# apps/api

Fastify API: sessions, projects, messages, tools, OpenAI orchestration.

## Current Surface

- `health()` reports service availability.
- `createProject()`, `createSession()` and `appendMessage()` provide a minimal in-memory project/session/message API.
- `materializeMapSnapshot()` normalizes a graph projection or snapshot into a defensive snapshot copy.
- `createMapDiffArtifact()` emits a deterministic `map_diff` artifact using `@avg/graph`'s `diffGraphSnapshots()`.
- `validateClaimRequest()` forwards claim bodies into the contract validator.

## First Implementation Tasks

- Add package.json.
- Add TypeScript config extending root.
- Add health/smoke test.
- Add README usage examples.

## Usage Notes

The current API surface is intentionally in-memory and deterministic. It is a contract slice for Sprint 1, not a production persistence layer.

### Map Diff Artifact

```ts
import { createEmptyGraphSnapshot, projectClaimToMapNode } from "@avg/graph";
import { createMapDiffArtifact } from "@avg/api";

const before = createEmptyGraphSnapshot();
const after = projectClaimToMapNode({
  id: "claim_100",
  statement: "Maps must keep claim status visible.",
  claim_status: "boundary_statement",
  language_mode: "operational_description",
  risks: [],
  scope: "Sprint 5"
});

const artifact = createMapDiffArtifact(before, after);
```

The artifact keeps the `from` and `to` snapshots intact and computes the diff through `diffGraphSnapshots()`.
