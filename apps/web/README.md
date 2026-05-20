# apps/web

Minimal web dialogue shell for Sprint 2.

## Current Surface

- `renderShellTitle()` returns the stable app title.
- `createProjectSessionShell(projectId, sessionId)` builds the minimal project/session view model.
- `renderProjectSessionPage(projectId, sessionId)` renders a deterministic HTML shell for smoke tests and later UI wiring.
- `createDialogueMessageSurface(projectId, sessionId, messages, groundedResponse?)` builds the minimal message-thread view model and can carry a real grounded response payload.
- `renderDialogueMessageSurface(projectId, sessionId, messages, groundedResponse?)` renders a deterministic HTML message thread with explicit empty and populated states, plus an inline grounded panel when payload is present.
- `createDialogueMessageSurfaceFromGroundedReport(projectId, sessionId, messages, report)` builds the message-thread view model from a grounded composition report.
- `renderDialogueMessageSurfaceFromGroundedReport(projectId, sessionId, messages, report)` renders the dialogue surface directly from a grounded composition report.
- `createDialogueFlowPage(projectId, sessionId, messages, groundedResponse?)` builds the full dialogue page shell and surface composition.
- `renderDialogueFlowPage(projectId, sessionId, messages, groundedResponse?)` renders the full page with project/session framing and the dialogue surface.
- `renderDialogueFlowPageFromGroundedReport(projectId, sessionId, messages, report)` renders the full page from a grounded composition report.
- `createStructuredResponseDetailsPanel(response)` builds a contract-shaped response details view model.
- `renderStructuredResponseDetailsPanel(response)` renders the structured response summary, contract fields, risk markers and artifacts.
- `createGroundedResponseDetailsPanel(response, grounding)` builds the citation panel view model for grounded answers.
- `renderGroundedResponseDetailsPanel(response, grounding)` renders citations, grounded claims, interpretations, unsupported claims and the boundary statement.
- `createConceptMapShell(source)` builds the React Flow-ready concept map shell from a graph snapshot or projection.
- `renderConceptMapShell(source)` renders an explicit empty or populated concept map surface with map/territory boundary copy.

## Usage Notes

The package intentionally stays framework-free for the first web slice. It gives the repo a stable user-facing shell without inventing extra state or hidden contracts.

## Example Flow

```ts
import {
  renderGroundedResponseDetailsPanel,
  renderConceptMapShell,
  renderDialogueMessageSurface,
  renderDialogueMessageSurfaceFromGroundedReport,
  renderDialogueFlowPageFromGroundedReport,
  renderProjectSessionPage,
  renderStructuredResponseDetailsPanel,
} from "@avg/web";

const shell = renderProjectSessionPage("project-7", "session-3");
const messages = renderDialogueMessageSurface("project-7", "session-3", [
  { id: "msg-1", role: "user", content: "raw thought" },
  { id: "msg-2", role: "assistant", content: "structured reply" },
], {
  response: {
    id: "response-7",
    project_id: "project-7",
    session_id: "session-3",
    message_id: "msg-2",
    summary: "A grounded reply with explicit boundaries",
    scope: "planning a dialogue slice",
    claim_status: "boundary_statement",
    language_mode: "operational_description",
    validation_risk: "low",
    risk_markers: ["no hidden claims"],
    map_territory_boundary: "preserved",
    next_action: "continue with the next message",
  },
  grounding: {
    citations: [
      {
        id: "cit_doc_001_001",
        document_id: "doc_001",
        snippet_id: "snip_doc_001_001",
        source_label: "Strategy notes",
        quoted_text: "Document text that supports the reply.",
        relevance: "supporting",
      },
    ],
    grounded_claims: ["Document text that supports the reply."],
    interpretations: ["AVG interprets the citation as support, not proof."],
    unsupported_claims: [],
    retrieval_confidence: "high",
    boundary_statement: "This answer is grounded only in registered project document snippets.",
  },
});
const reportDrivenMessages = renderDialogueMessageSurfaceFromGroundedReport(
  "project-7",
  "session-3",
  [
    { id: "msg-1", role: "user", content: "raw thought" },
    { id: "msg-2", role: "assistant", content: "structured reply" },
  ],
  {
    response: {
      id: "response-7",
      project_id: "project-7",
      session_id: "session-3",
      message_id: "msg-2",
      summary: "A grounded reply with explicit boundaries",
      scope: "planning a dialogue slice",
      claim_status: "boundary_statement",
      language_mode: "operational_description",
      validation_risk: "low",
      risk_markers: ["no hidden claims"],
      map_territory_boundary: "preserved",
      next_action: "continue with the next message",
    },
    grounding: {
      citations: [
        {
          id: "cit_doc_001_001",
          document_id: "doc_001",
          snippet_id: "snip_doc_001_001",
          source_label: "Strategy notes",
          quoted_text: "Document text that supports the reply.",
          relevance: "supporting",
        },
      ],
      grounded_claims: ["Document text that supports the reply."],
      interpretations: ["AVG interprets the citation as support, not proof."],
      unsupported_claims: [],
      retrieval_confidence: "high",
      boundary_statement: "This answer is grounded only in registered project document snippets.",
    },
  },
);
const flowPage = renderDialogueFlowPageFromGroundedReport(
  "project-7",
  "session-3",
  [
    { id: "msg-1", role: "user", content: "raw thought" },
    { id: "msg-2", role: "assistant", content: "structured reply" },
  ],
  {
    response: {
      id: "response-7",
      project_id: "project-7",
      session_id: "session-3",
      message_id: "msg-2",
      summary: "A grounded reply with explicit boundaries",
      scope: "planning a dialogue slice",
      claim_status: "boundary_statement",
      language_mode: "operational_description",
      validation_risk: "low",
      risk_markers: ["no hidden claims"],
      map_territory_boundary: "preserved",
      next_action: "continue with the next message",
    },
    grounding: {
      citations: [
        {
          id: "cit_doc_001_001",
          document_id: "doc_001",
          snippet_id: "snip_doc_001_001",
          source_label: "Strategy notes",
          quoted_text: "Document text that supports the reply.",
          relevance: "supporting",
        },
      ],
      grounded_claims: ["Document text that supports the reply."],
      interpretations: ["AVG interprets the citation as support, not proof."],
      unsupported_claims: [],
      retrieval_confidence: "high",
      boundary_statement: "This answer is grounded only in registered project document snippets.",
    },
  },
);
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
const grounded = renderGroundedResponseDetailsPanel(
  {
    id: "response-7",
    project_id: "project-7",
    session_id: "session-3",
    message_id: "msg-2",
    summary: "A grounded reply with explicit boundaries",
    scope: "planning a dialogue slice",
    claim_status: "boundary_statement",
    language_mode: "operational_description",
    validation_risk: "low",
    risk_markers: ["no hidden claims"],
    map_territory_boundary: "preserved",
    next_action: "continue with the next message",
  },
  {
    citations: [
      {
        id: "cit_doc_001_001",
        document_id: "doc_001",
        snippet_id: "snip_doc_001_001",
        source_label: "Strategy notes",
        quoted_text: "Document text that supports the reply.",
        relevance: "supporting",
      },
    ],
    grounded_claims: ["Document text that supports the reply."],
    interpretations: ["AVG interprets the citation as support, not proof."],
    unsupported_claims: [],
    retrieval_confidence: "high",
    boundary_statement: "This answer is grounded only in registered project document snippets.",
  },
);
const conceptMap = renderConceptMapShell();
```

The concept map shell keeps the boundary explicit and treats the graph as a working map, not Reality.
The grounded response panel keeps citations explicit and separates supported claims from interpretation and unsupported content.
The dialogue surface can inline the grounded response payload so the same real grounded object that comes from the API is visible alongside the dialogue thread.
The report-driven helper keeps the web flow aligned with grounded composition output rather than with ad hoc local panel assembly.
The flow page helper composes the shell and dialogue surface into a single page-level HTML artifact.
