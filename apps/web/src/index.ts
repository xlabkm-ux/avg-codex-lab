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

export type WorkspaceSurface =
  | "dialogue"
  | "documents"
  | "retrieval"
  | "claim-review"
  | "map"
  | "artifacts";

export type WorkspaceNavigationItem = {
  surface: WorkspaceSurface;
  label: string;
  active: boolean;
};

export type LocalProjectRecord = {
  id: string;
  title: string;
  accessMode: "browser_local";
  createdAt: string;
};

export type LocalSessionRecord = {
  id: string;
  projectId: string;
  title: string;
  createdAt: string;
};

export type WorkspaceState = {
  kind: "workspace-state";
  project: LocalProjectRecord;
  session: LocalSessionRecord;
  selectedSurface: WorkspaceSurface;
  contractVersion: "mvp-5";
  localOnly: true;
};

export type WorkspaceShell = {
  kind: "workspace-shell";
  title: string;
  project: LocalProjectRecord;
  session: LocalSessionRecord;
  selectedSurface: WorkspaceSurface;
  navigation: WorkspaceNavigationItem[];
  localOnlyLabel: string;
  localOnlyBoundary: string;
  resetLabel: string;
  createProjectLabel: string;
  openProjectLabel: string;
  technicalDetails: {
    projectId: string;
    sessionId: string;
    contractVersion: "mvp-5";
  };
  emptyStates: Record<WorkspaceSurface, { title: string; body: string }>;
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

const workspaceNavigationSurfaces: Array<Pick<WorkspaceNavigationItem, "surface" | "label">> = [
  { surface: "dialogue", label: "Dialogue" },
  { surface: "documents", label: "Documents" },
  { surface: "retrieval", label: "Retrieval" },
  { surface: "claim-review", label: "Claim Review" },
  { surface: "map", label: "Map" },
  { surface: "artifacts", label: "Artifacts" },
];

const workspaceEmptyStates: WorkspaceShell["emptyStates"] = {
  dialogue: {
    title: "No dialogue yet",
    body: "Start with a raw thought. AVG will keep scope, status, risk and boundary visible.",
  },
  documents: {
    title: "No local documents",
    body: "Register text or markdown as project-local evidence before using grounded retrieval.",
  },
  retrieval: {
    title: "No retrieval query",
    body: "Ask against registered project evidence; confidence is a risk signal, not proof.",
  },
  "claim-review": {
    title: "No claims to inspect",
    body: "Structured response claims will appear here with status, language mode and validation risk.",
  },
  map: {
    title: "No working map yet",
    body: "The concept map is a projection of session material, not Reality.",
  },
  artifacts: {
    title: "No artifacts generated",
    body: "Exports will preserve project id, session id, scope, risk markers and boundary notes.",
  },
};

function normalizeLocalTitle(value: string, fallback: string): string {
  const normalized = value.trim();

  return normalized.length > 0 ? normalized : fallback;
}

function stableLocalId(prefix: string, value: string): string {
  return `${prefix}-${normalizeLocalTitle(value, "untitled")
    .toLowerCase()
    .replaceAll(/[^a-z0-9]+/g, "-")
    .replaceAll(/^-|-$/g, "")
    .slice(0, 48)}`;
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

export function createLocalProjectRecord(
  title: string,
  options: { id?: string; createdAt?: string } = {},
): LocalProjectRecord {
  const normalizedTitle = normalizeLocalTitle(title, "Untitled project");

  return {
    id: options.id ?? stableLocalId("project", normalizedTitle),
    title: normalizedTitle,
    accessMode: "browser_local",
    createdAt: options.createdAt ?? "local-session",
  };
}

export function createLocalSessionRecord(
  projectId: string,
  title: string,
  options: { id?: string; createdAt?: string } = {},
): LocalSessionRecord {
  const normalizedTitle = normalizeLocalTitle(title, "Working session");

  return {
    id: options.id ?? stableLocalId("session", `${projectId}-${normalizedTitle}`),
    projectId,
    title: normalizedTitle,
    createdAt: options.createdAt ?? "local-session",
  };
}

export function createWorkspaceState(
  project: LocalProjectRecord,
  session: LocalSessionRecord,
  selectedSurface: WorkspaceSurface = "dialogue",
): WorkspaceState {
  if (session.projectId !== project.id) {
    throw new Error("Session project id must match the active project id.");
  }

  return {
    kind: "workspace-state",
    project,
    session,
    selectedSurface,
    contractVersion: "mvp-5",
    localOnly: true,
  };
}

export function createLocalWorkspaceState(
  projectTitle: string,
  sessionTitle = "Working session",
  options: {
    projectId?: string;
    sessionId?: string;
    createdAt?: string;
    selectedSurface?: WorkspaceSurface;
  } = {},
): WorkspaceState {
  const projectOptions: { id?: string; createdAt?: string } = {};
  const sessionOptions: { id?: string; createdAt?: string } = {};

  if (options.projectId !== undefined) {
    projectOptions.id = options.projectId;
  }

  if (options.sessionId !== undefined) {
    sessionOptions.id = options.sessionId;
  }

  if (options.createdAt !== undefined) {
    projectOptions.createdAt = options.createdAt;
    sessionOptions.createdAt = options.createdAt;
  }

  const project = createLocalProjectRecord(projectTitle, projectOptions);
  const session = createLocalSessionRecord(project.id, sessionTitle, sessionOptions);

  return createWorkspaceState(project, session, options.selectedSurface ?? "dialogue");
}

export function openLocalWorkspaceProject(
  project: LocalProjectRecord,
  session: LocalSessionRecord,
  selectedSurface: WorkspaceSurface = "dialogue",
): WorkspaceState {
  return createWorkspaceState(project, session, selectedSurface);
}

export function selectWorkspaceSurface(
  state: WorkspaceState,
  selectedSurface: WorkspaceSurface,
): WorkspaceState {
  return {
    ...state,
    selectedSurface,
  };
}

export function createWorkspaceShell(state: WorkspaceState): WorkspaceShell {
  return {
    kind: "workspace-shell",
    title: renderShellTitle(),
    project: state.project,
    session: state.session,
    selectedSurface: state.selectedSurface,
    navigation: workspaceNavigationSurfaces.map((item) => ({
      ...item,
      active: item.surface === state.selectedSurface,
    })),
    localOnlyLabel: "Local only",
    localOnlyBoundary:
      "This workspace is browser-local for MVP-5. It does not imply an account, shared workspace or production persistence.",
    resetLabel: "Reset local project",
    createProjectLabel: "New local project",
    openProjectLabel: "Open local project",
    technicalDetails: {
      projectId: state.project.id,
      sessionId: state.session.id,
      contractVersion: state.contractVersion,
    },
    emptyStates: workspaceEmptyStates,
  };
}

export function serializeWorkspaceState(state: WorkspaceState): string {
  return JSON.stringify(state);
}

export function parseWorkspaceState(serialized: string): WorkspaceState {
  const value = JSON.parse(serialized) as WorkspaceState;

  return createWorkspaceState(value.project, value.session, value.selectedSurface);
}

export function renderWorkspaceShell(state: WorkspaceState): string {
  const shell = createWorkspaceShell(state);
  const activeEmptyState = shell.emptyStates[shell.selectedSurface];
  const navItems = shell.navigation.map(
    (item) =>
      `      <button type="button" data-surface="${escapeHtml(item.surface)}" aria-current="${item.active ? "page" : "false"}">${escapeHtml(item.label)}</button>`,
  );

  return [
    `<main data-shell="${shell.kind}" data-project-id="${escapeHtml(shell.project.id)}" data-session-id="${escapeHtml(shell.session.id)}" data-local-only="true">`,
    `  <header aria-label="workspace-status">`,
    `    <p>${escapeHtml(shell.title)}</p>`,
    `    <h1>${escapeHtml(shell.project.title)}</h1>`,
    `    <p>${escapeHtml(shell.session.title)}</p>`,
    `    <strong>${escapeHtml(shell.localOnlyLabel)}</strong>`,
    `    <p>${escapeHtml(shell.localOnlyBoundary)}</p>`,
    `    <button type="button" data-action="create-project">${escapeHtml(shell.createProjectLabel)}</button>`,
    `    <button type="button" data-action="open-project">${escapeHtml(shell.openProjectLabel)}</button>`,
    `    <button type="button" data-action="reset-project">${escapeHtml(shell.resetLabel)}</button>`,
    `  </header>`,
    `  <nav aria-label="workspace-surfaces">`,
    ...navItems,
    `  </nav>`,
    `  <section aria-label="active-workspace-surface" data-active-surface="${escapeHtml(shell.selectedSurface)}">`,
    `    <h2>${escapeHtml(activeEmptyState.title)}</h2>`,
    `    <p>${escapeHtml(activeEmptyState.body)}</p>`,
    `  </section>`,
    `  <aside aria-label="workspace-detail">`,
    `    <h2>Details</h2>`,
    `    <p>Selected records, claims, citations, nodes, documents and artifacts will open here without clearing the active dialogue context.</p>`,
    `  </aside>`,
    `  <details>`,
    `    <summary>Technical details</summary>`,
    `    <dl>`,
    `      <div><dt>Project id</dt><dd>${escapeHtml(shell.technicalDetails.projectId)}</dd></div>`,
    `      <div><dt>Session id</dt><dd>${escapeHtml(shell.technicalDetails.sessionId)}</dd></div>`,
    `      <div><dt>Contract version</dt><dd>${escapeHtml(shell.technicalDetails.contractVersion)}</dd></div>`,
    `    </dl>`,
    `  </details>`,
    `</main>`,
  ].join("\n");
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
