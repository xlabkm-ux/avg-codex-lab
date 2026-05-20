import {
  cloneGraphSnapshot,
  createEmptyGraphSnapshot,
  type ClaimProjection,
  type GraphSnapshot
} from "@avg/graph";
import type { AvgMapEdge, AvgMapNode, AvgStructuredResponse } from "@avg/schemas";
import type {
  AvgGroundedResponse,
  GroundedResponseCompositionReport,
} from "@avg/validation";

export type ProjectSessionShell = {
  kind: "project-session-shell";
  title: string;
  projectId: string;
  sessionId: string;
  projectLabel: string;
  sessionLabel: string;
  promptLabel: string;
  placeholder: string;
  submitLabel: string;
  emptyStateTitle: string;
  emptyStateBody: string;
};

export type DialogueMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export type DialogueSurfaceGrounding = {
  response: AvgStructuredResponse;
  grounding: AvgGroundedResponse["grounding"];
};

export type DialogueSurfaceGroundedReport = GroundedResponseCompositionReport;

export type DialogueMessageSurface = {
  kind: "dialogue-message-surface";
  title: string;
  projectId: string;
  sessionId: string;
  messages: DialogueMessage[];
  emptyStateTitle: string;
  emptyStateBody: string;
  composerPlaceholder: string;
  submitLabel: string;
  groundedResponse?: DialogueSurfaceGrounding;
};

export type DialogueFlowPage = {
  kind: "dialogue-flow-page";
  title: string;
  projectSession: ProjectSessionShell;
  messageSurface: DialogueMessageSurface;
};

export type StructuredResponseDetailsPanel = {
  kind: "structured-response-details-panel";
  title: string;
  response: AvgStructuredResponse;
};

export type GroundedResponseBoundary = AvgGroundedResponse["grounding"];

export type GroundedResponseDetailsPanel = {
  kind: "grounded-response-details-panel";
  title: string;
  response: AvgStructuredResponse;
  grounding: GroundedResponseBoundary;
};

export type ConceptMapSource = GraphSnapshot | ClaimProjection;

export type ConceptMapShell = {
  kind: "concept-map-shell";
  title: string;
  subtitle: string;
  emptyStateTitle: string;
  emptyStateBody: string;
  snapshot: GraphSnapshot;
  nodeCount: number;
  edgeCount: number;
};

export type ConceptMapNodeView = Pick<
  AvgMapNode,
  "id" | "type" | "label" | "definition" | "coordinates" | "map_safety"
>;

export type ConceptMapEdgeView = Pick<
  AvgMapEdge,
  "id" | "type" | "from" | "to" | "claim_status" | "scope" | "constraints"
>;

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function indentMarkup(markup: string, indent: string): string[] {
  return markup.split("\n").map((line) => `${indent}${line}`);
}

function isClaimProjection(value: ConceptMapSource): value is ClaimProjection {
  return "node" in value && !("nodes" in value);
}

function snapshotFromProjection(projection: ClaimProjection): GraphSnapshot {
  return cloneGraphSnapshot({
    nodes: [projection.node],
    edges: projection.edges
  });
}

export function materializeConceptMapSnapshot(value: ConceptMapSource): GraphSnapshot {
  if (isClaimProjection(value)) {
    return snapshotFromProjection(value);
  }

  return cloneGraphSnapshot(value);
}

export function renderShellTitle(): string {
  return "AVG Codex Lab";
}

export function createProjectSessionShell(
  projectId: string,
  sessionId: string,
): ProjectSessionShell {
  return {
    kind: "project-session-shell",
    title: renderShellTitle(),
    projectId,
    sessionId,
    projectLabel: `Project ${projectId}`,
    sessionLabel: `Session ${sessionId}`,
    promptLabel: "Raw idea",
    placeholder: "Enter the thought you want to shape",
    submitLabel: "Submit idea",
    emptyStateTitle: "Start a structured dialogue",
    emptyStateBody:
      "Open a project, choose a session and submit a raw thought to begin the AVG dialogue slice.",
  };
}

export function renderProjectSessionPage(
  projectId: string,
  sessionId: string,
): string {
  const shell = createProjectSessionShell(projectId, sessionId);

  return [
    `<main data-shell="${shell.kind}" data-project-id="${escapeHtml(shell.projectId)}" data-session-id="${escapeHtml(shell.sessionId)}">`,
    `  <header>`,
    `    <p>${escapeHtml(shell.title)}</p>`,
    `    <h1>${escapeHtml(shell.projectLabel)}</h1>`,
    `    <h2>${escapeHtml(shell.sessionLabel)}</h2>`,
    `  </header>`,
    `  <section aria-labelledby="avg-raw-idea">`,
    `    <h3 id="avg-raw-idea">${escapeHtml(shell.promptLabel)}</h3>`,
    `    <textarea placeholder="${escapeHtml(shell.placeholder)}"></textarea>`,
    `    <button type="button">${escapeHtml(shell.submitLabel)}</button>`,
    `  </section>`,
    `  <section aria-label="dialogue-empty-state">`,
    `    <strong>${escapeHtml(shell.emptyStateTitle)}</strong>`,
    `    <p>${escapeHtml(shell.emptyStateBody)}</p>`,
    `  </section>`,
    `</main>`,
  ].join("\n");
}

export function createDialogueMessageSurface(
  projectId: string,
  sessionId: string,
  messages: DialogueMessage[],
  groundedResponse?: DialogueSurfaceGrounding,
): DialogueMessageSurface {
  return {
    kind: "dialogue-message-surface",
    title: renderShellTitle(),
    projectId,
    sessionId,
    messages,
    emptyStateTitle: "No dialogue yet",
    emptyStateBody: "Submit a raw idea to start the conversation.",
    composerPlaceholder: "Write the next thought",
    submitLabel: "Send message",
    ...(groundedResponse !== undefined ? { groundedResponse } : {}),
  };
}

export function renderDialogueMessageSurface(
  projectId: string,
  sessionId: string,
  messages: DialogueMessage[],
  groundedResponse?: DialogueSurfaceGrounding,
): string {
  const surface = createDialogueMessageSurface(
    projectId,
    sessionId,
    messages,
    groundedResponse,
  );
  const groundedPanel =
    surface.groundedResponse !== undefined
      ? [
          `  <section aria-label="grounded-response-panel">`,
          `    <h3>Grounded response</h3>`,
          ...indentMarkup(
            renderGroundedResponseDetailsPanel(
              surface.groundedResponse.response,
              surface.groundedResponse.grounding,
            ),
            "    ",
          ),
          `  </section>`,
        ]
      : [];

  if (surface.messages.length === 0) {
    return [
      `<section data-surface="${surface.kind}" data-project-id="${escapeHtml(surface.projectId)}" data-session-id="${escapeHtml(surface.sessionId)}">`,
      `  <p>${escapeHtml(surface.title)}</p>`,
      `  <strong>${escapeHtml(surface.emptyStateTitle)}</strong>`,
      `  <p>${escapeHtml(surface.emptyStateBody)}</p>`,
      `  <textarea placeholder="${escapeHtml(surface.composerPlaceholder)}"></textarea>`,
      `  <button type="button">${escapeHtml(surface.submitLabel)}</button>`,
      ...groundedPanel,
      `</section>`,
    ].join("\n");
  }

  return [
    `<section data-surface="${surface.kind}" data-project-id="${escapeHtml(surface.projectId)}" data-session-id="${escapeHtml(surface.sessionId)}">`,
    `  <p>${escapeHtml(surface.title)}</p>`,
    `  <ol>`,
    ...surface.messages.map(
      (message) =>
        `    <li data-message-id="${escapeHtml(message.id)}" data-message-role="${escapeHtml(message.role)}"><strong>${escapeHtml(message.role)}</strong><p>${escapeHtml(message.content)}</p></li>`,
    ),
    `  </ol>`,
    ...groundedPanel,
    `  <textarea placeholder="${escapeHtml(surface.composerPlaceholder)}"></textarea>`,
    `  <button type="button">${escapeHtml(surface.submitLabel)}</button>`,
    `</section>`,
  ].join("\n");
}

export function createDialogueMessageSurfaceFromGroundedReport(
  projectId: string,
  sessionId: string,
  messages: DialogueMessage[],
  report: GroundedResponseCompositionReport,
): DialogueMessageSurface {
  return createDialogueMessageSurface(
    projectId,
    sessionId,
    messages,
    report.groundedResponse === undefined
      ? undefined
      : {
          response: report.groundedResponse.response,
          grounding: report.groundedResponse.grounding,
        },
  );
}

export function renderDialogueMessageSurfaceFromGroundedReport(
  projectId: string,
  sessionId: string,
  messages: DialogueMessage[],
  report: GroundedResponseCompositionReport,
): string {
  return renderDialogueMessageSurface(
    projectId,
    sessionId,
    messages,
    report.groundedResponse === undefined
        ? undefined
        : {
          response: report.groundedResponse.response,
          grounding: report.groundedResponse.grounding,
        },
  );
}

export function createDialogueFlowPage(
  projectId: string,
  sessionId: string,
  messages: DialogueMessage[],
  groundedResponse?: DialogueSurfaceGrounding,
): DialogueFlowPage {
  return {
    kind: "dialogue-flow-page",
    title: renderShellTitle(),
    projectSession: createProjectSessionShell(projectId, sessionId),
    messageSurface: createDialogueMessageSurface(
      projectId,
      sessionId,
      messages,
      groundedResponse,
    ),
  };
}

export function renderDialogueFlowPage(
  projectId: string,
  sessionId: string,
  messages: DialogueMessage[],
  groundedResponse?: DialogueSurfaceGrounding,
): string {
  const page = createDialogueFlowPage(
    projectId,
    sessionId,
    messages,
    groundedResponse,
  );

  return [
    `<main data-page="${page.kind}" data-project-id="${escapeHtml(page.projectSession.projectId)}" data-session-id="${escapeHtml(page.projectSession.sessionId)}">`,
    `  <header>`,
    `    <p>${escapeHtml(page.title)}</p>`,
    `    <h1>${escapeHtml(page.projectSession.projectLabel)}</h1>`,
    `    <h2>${escapeHtml(page.projectSession.sessionLabel)}</h2>`,
    `  </header>`,
    `  <section aria-labelledby="avg-raw-idea">`,
    `    <h3 id="avg-raw-idea">${escapeHtml(page.projectSession.promptLabel)}</h3>`,
    `    <p>${escapeHtml(page.projectSession.emptyStateBody)}</p>`,
    `  </section>`,
    `  <section aria-label="dialogue-thread">`,
    ...indentMarkup(
      renderDialogueMessageSurface(
        projectId,
        sessionId,
        messages,
        groundedResponse,
      ),
      "    ",
    ),
    `  </section>`,
    `</main>`,
  ].join("\n");
}

export function renderDialogueFlowPageFromGroundedReport(
  projectId: string,
  sessionId: string,
  messages: DialogueMessage[],
  report: GroundedResponseCompositionReport,
): string {
  return renderDialogueFlowPage(
    projectId,
    sessionId,
    messages,
    report.groundedResponse === undefined
      ? undefined
      : {
          response: report.groundedResponse.response,
          grounding: report.groundedResponse.grounding,
        },
  );
}

export function createStructuredResponseDetailsPanel(
  response: AvgStructuredResponse,
): StructuredResponseDetailsPanel {
  return {
    kind: "structured-response-details-panel",
    title: renderShellTitle(),
    response,
  };
}

export function renderStructuredResponseDetailsPanel(
  response: AvgStructuredResponse,
): string {
  const panel = createStructuredResponseDetailsPanel(response);
  const artifactItems =
    panel.response.artifacts?.map(
      (artifact) => `    <li>${escapeHtml(artifact)}</li>`,
    ) ?? [];
  const riskMarkerItems = panel.response.risk_markers.map(
    (riskMarker) => `    <li>${escapeHtml(riskMarker)}</li>`,
  );

  return [
    `<section data-panel="${panel.kind}" data-response-id="${escapeHtml(panel.response.id)}" data-project-id="${escapeHtml(panel.response.project_id)}" data-session-id="${escapeHtml(panel.response.session_id)}" data-message-id="${escapeHtml(panel.response.message_id)}">`,
    `  <p>${escapeHtml(panel.title)}</p>`,
    `  <h3>${escapeHtml(panel.response.summary)}</h3>`,
    `  <dl>`,
    `    <div><dt>Scope</dt><dd>${escapeHtml(panel.response.scope)}</dd></div>`,
    `    <div><dt>Claim status</dt><dd>${escapeHtml(panel.response.claim_status)}</dd></div>`,
    `    <div><dt>Language mode</dt><dd>${escapeHtml(panel.response.language_mode)}</dd></div>`,
    `    <div><dt>Validation risk</dt><dd>${escapeHtml(panel.response.validation_risk)}</dd></div>`,
    `    <div><dt>Map/territory boundary</dt><dd>${escapeHtml(panel.response.map_territory_boundary)}</dd></div>`,
    `    <div><dt>Next action</dt><dd>${escapeHtml(panel.response.next_action)}</dd></div>`,
    `  </dl>`,
    `  <section aria-label="risk-markers">`,
    `    <h4>Risk markers</h4>`,
    `    <ul>`,
    ...riskMarkerItems,
    `    </ul>`,
    `  </section>`,
    `  <section aria-label="artifacts">`,
    `    <h4>Artifacts</h4>`,
    `    <ul>`,
    ...(artifactItems.length > 0 ? artifactItems : ["    <li>None</li>"]),
    `    </ul>`,
    `  </section>`,
    `</section>`,
  ].join("\n");
}

export function createGroundedResponseDetailsPanel(
  response: AvgStructuredResponse,
  grounding: GroundedResponseBoundary,
): GroundedResponseDetailsPanel {
  return {
    kind: "grounded-response-details-panel",
    title: renderShellTitle(),
    response,
    grounding,
  };
}

export function renderGroundedResponseDetailsPanel(
  response: AvgStructuredResponse,
  grounding: GroundedResponseBoundary,
): string {
  const panel = createGroundedResponseDetailsPanel(response, grounding);
  const citationItems = panel.grounding.citations.map(
    (citation) => [
      `    <li data-citation-id="${escapeHtml(citation.id)}" data-snippet-id="${escapeHtml(citation.snippet_id)}" data-document-id="${escapeHtml(citation.document_id)}" data-relevance="${escapeHtml(citation.relevance)}">`,
      `      <strong>${escapeHtml(citation.source_label)}</strong>`,
      `      <code>${escapeHtml(citation.snippet_id)}</code>`,
      `      <p>${escapeHtml(citation.quoted_text)}</p>`,
      `    </li>`,
    ].join("\n"),
  );

  const groundedClaimItems = panel.grounding.grounded_claims.map(
    (claim) => `    <li>${escapeHtml(claim)}</li>`,
  );
  const interpretationItems = panel.grounding.interpretations.map(
    (interpretation) => `    <li>${escapeHtml(interpretation)}</li>`,
  );
  const unsupportedClaimItems = panel.grounding.unsupported_claims.map(
    (claim) => `    <li>${escapeHtml(claim)}</li>`,
  );

  return [
    `<section data-panel="${panel.kind}" data-response-id="${escapeHtml(panel.response.id)}" data-project-id="${escapeHtml(panel.response.project_id)}" data-session-id="${escapeHtml(panel.response.session_id)}" data-message-id="${escapeHtml(panel.response.message_id)}">`,
    `  <p>${escapeHtml(panel.title)}</p>`,
    `  <h3>${escapeHtml(panel.response.summary)}</h3>`,
    `  <dl>`,
    `    <div><dt>Retrieval confidence</dt><dd>${escapeHtml(panel.grounding.retrieval_confidence)}</dd></div>`,
    `    <div><dt>Boundary statement</dt><dd>${escapeHtml(panel.grounding.boundary_statement)}</dd></div>`,
    `  </dl>`,
    `  <section aria-label="citation-list">`,
    `    <h4>Citations</h4>`,
    `    <ul>`,
    ...(citationItems.length > 0 ? citationItems : ["    <li>No citations</li>"]),
    `    </ul>`,
    `  </section>`,
    `  <section aria-label="grounded-claims">`,
    `    <h4>Grounded claims</h4>`,
    `    <ul>`,
    ...(groundedClaimItems.length > 0 ? groundedClaimItems : ["    <li>None</li>"]),
    `    </ul>`,
    `  </section>`,
    `  <section aria-label="interpretations">`,
    `    <h4>Interpretations</h4>`,
    `    <ul>`,
    ...(interpretationItems.length > 0 ? interpretationItems : ["    <li>None</li>"]),
    `    </ul>`,
    `  </section>`,
    `  <section aria-label="unsupported-claims">`,
    `    <h4>Unsupported claims</h4>`,
    `    <ul>`,
    ...(unsupportedClaimItems.length > 0 ? unsupportedClaimItems : ["    <li>None</li>"]),
    `    </ul>`,
    `  </section>`,
    `</section>`,
  ].join("\n");
}

export function createConceptMapShell(source: ConceptMapSource = createEmptyGraphSnapshot()): ConceptMapShell {
  const snapshot = materializeConceptMapSnapshot(source);

  return {
    kind: "concept-map-shell",
    title: renderShellTitle(),
    subtitle: "Concept map shell",
    emptyStateTitle: "No map yet",
    emptyStateBody:
      "Pass a validated graph projection or snapshot to render the first working map.",
    snapshot,
    nodeCount: snapshot.nodes.length,
    edgeCount: snapshot.edges.length
  };
}

export function renderConceptMapShell(source: ConceptMapSource = createEmptyGraphSnapshot()): string {
  const shell = createConceptMapShell(source);
  const nodeItems = shell.snapshot.nodes.map((node) => {
    return [
      `    <li data-node-id="${escapeHtml(node.id)}" data-node-type="${escapeHtml(node.type)}">`,
      `      <strong>${escapeHtml(node.label)}</strong>`,
      `      <p>${escapeHtml(node.definition ?? node.label)}</p>`,
      `      <dl>`,
      `        <div><dt>Claim status</dt><dd>${escapeHtml(node.coordinates.claim_status ?? "unknown")}</dd></div>`,
      `        <div><dt>Language mode</dt><dd>${escapeHtml(node.coordinates.language_mode)}</dd></div>`,
      `        <div><dt>Access mode</dt><dd>${escapeHtml(node.coordinates.access_mode)}</dd></div>`,
      `      </dl>`,
      `    </li>`
    ].join("\n");
  });
  const edgeItems = shell.snapshot.edges.map((edge) => {
    const scopeLine =
      edge.scope !== undefined ? `      <p>${escapeHtml(edge.scope)}</p>\n` : "";

    return [
      `    <li data-edge-id="${escapeHtml(edge.id)}" data-edge-type="${escapeHtml(edge.type)}">`,
      `      <strong>${escapeHtml(edge.from)} → ${escapeHtml(edge.to)}</strong>`,
      `      <p>${escapeHtml(edge.claim_status)}</p>`,
      scopeLine + `    </li>`
    ].join("\n");
  });

  if (shell.nodeCount === 0 && shell.edgeCount === 0) {
    return [
      `<section data-shell="${shell.kind}" data-node-count="0" data-edge-count="0">`,
      `  <header>`,
      `    <p>${escapeHtml(shell.title)}</p>`,
      `    <h1>${escapeHtml(shell.subtitle)}</h1>`,
      `  </header>`,
      `  <section aria-label="concept-map-empty-state">`,
      `    <strong>${escapeHtml(shell.emptyStateTitle)}</strong>`,
      `    <p>${escapeHtml(shell.emptyStateBody)}</p>`,
      `  </section>`,
      `  <aside aria-label="map-territory-boundary">`,
      `    <p>The map is a working projection, not Reality.</p>`,
      `  </aside>`,
      `</section>`
    ].join("\n");
  }

  return [
    `<section data-shell="${shell.kind}" data-node-count="${shell.nodeCount}" data-edge-count="${shell.edgeCount}">`,
    `  <header>`,
    `    <p>${escapeHtml(shell.title)}</p>`,
    `    <h1>${escapeHtml(shell.subtitle)}</h1>`,
    `    <p>${escapeHtml(shell.emptyStateBody)}</p>`,
    `  </header>`,
    `  <section aria-label="concept-map-canvas">`,
    `    <div data-react-flow-ready="true">`,
    `      <p>React Flow-ready boundary</p>`,
    `      <p>${escapeHtml(String(shell.nodeCount))} nodes</p>`,
    `      <p>${escapeHtml(String(shell.edgeCount))} edges</p>`,
    `    </div>`,
    `  </section>`,
    `  <section aria-label="concept-map-nodes">`,
    `    <h2>Nodes</h2>`,
    `    <ul>`,
    ...nodeItems,
    `    </ul>`,
    `  </section>`,
    `  <section aria-label="concept-map-edges">`,
    `    <h2>Edges</h2>`,
    `    <ul>`,
    ...edgeItems,
    `    </ul>`,
    `  </section>`,
    `  <aside aria-label="map-territory-boundary">`,
    `    <p>The map is a working projection, not Reality.</p>`,
    `  </aside>`,
    `</section>`
  ].join("\n");
}
