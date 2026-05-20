# apps/web

Minimal web dialogue shell for Sprint 2.

## Current Surface

- `renderShellTitle()` returns the stable app title.
- `createProjectSessionShell(projectId, sessionId)` builds the minimal project/session view model.
- `renderProjectSessionPage(projectId, sessionId)` renders a deterministic HTML shell for smoke tests and later UI wiring.
- `createDialogueMessageSurface(projectId, sessionId, messages)` builds the minimal message-thread view model.
- `renderDialogueMessageSurface(projectId, sessionId, messages)` renders a deterministic HTML message thread with explicit empty and populated states.
- `createStructuredResponseDetailsPanel(response)` builds a contract-shaped response details view model.
- `renderStructuredResponseDetailsPanel(response)` renders the structured response summary, contract fields, risk markers and artifacts.

## Usage Notes

The package intentionally stays framework-free for the first web slice. It gives the repo a stable user-facing shell without inventing extra state or hidden contracts.

## Example Flow

```ts
import {
  renderDialogueMessageSurface,
  renderProjectSessionPage,
  renderStructuredResponseDetailsPanel,
} from "@avg/web";

const shell = renderProjectSessionPage("project-7", "session-3");
const messages = renderDialogueMessageSurface("project-7", "session-3", [
  { id: "msg-1", role: "user", content: "raw thought" },
  { id: "msg-2", role: "assistant", content: "structured reply" },
]);
const details = renderStructuredResponseDetailsPanel({
  id: "response-7",
  project_id: "project-7",
  session_id: "session-3",
  message_id: "msg-2",
  summary: "A structured reply with explicit boundaries",
  scope: "planning a dialogue slice",
  claim_status: "boundary_statement",
  language_mode: "operational_description",
  validation_risk: "low",
  risk_markers: ["no hidden claims"],
  map_territory_boundary: "preserved",
  next_action: "continue with the next message",
});
```
