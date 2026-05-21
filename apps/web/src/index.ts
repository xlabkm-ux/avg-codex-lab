import {
  cloneGraphSnapshot,
  createEmptyGraphSnapshot,
  type ClaimProjection,
  type GraphSnapshot
} from "@avg/graph";
import {
  validateAvgResponse,
  type AvgMapEdge,
  type AvgMapNode,
  type AvgStructuredResponse,
  type ValidationResult,
} from "@avg/schemas";
import type {
  AvgGroundedResponse,
  AvgRetrievalHit,
  ClaimExtractionReport,
  ExtractedClaimRecord,
  GroundedResponseCompositionReport,
} from "@avg/validation";
import { extractClaimsFromAvgResponse } from "@avg/validation";

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

export type WorkspaceStoragePort = Pick<
  Storage,
  "getItem" | "setItem" | "removeItem"
>;

export type WorkspaceLocalProjectInput = {
  projectTitle: string;
  sessionTitle?: string;
  projectId?: string;
  sessionId?: string;
  createdAt?: string;
};

export type DialogueMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export type StructuredDialogueStatus =
  | "empty"
  | "loading"
  | "ready"
  | "error"
  | "recovered";

export type StructuredDialogueError = {
  code:
    | "empty_raw_thought"
    | "invalid_structured_response"
    | "response_project_session_mismatch"
    | "dialogue_runtime_error";
  message: string;
  boundaryNotes: string[];
  validation?: ValidationResult;
};

export type StructuredDialogueSurfaceInput = {
  projectId: string;
  sessionId: string;
  rawThought?: string;
  messages?: DialogueMessage[];
  response?: unknown;
  isLoading?: boolean;
  error?: StructuredDialogueError;
  recoveredFrom?: StructuredDialogueError;
};

export type StructuredDialogueSurface = {
  kind: "structured-dialogue-surface";
  title: string;
  projectId: string;
  sessionId: string;
  rawThought: string;
  messages: DialogueMessage[];
  status: StructuredDialogueStatus;
  emptyStateTitle: string;
  emptyStateBody: string;
  loadingLabel: string;
  composerLabel: string;
  composerPlaceholder: string;
  submitLabel: string;
  responseDetails?: StructuredResponseDetailsPanel;
  claimReview?: ClaimReviewPanel;
  error?: StructuredDialogueError;
  recoveredFrom?: StructuredDialogueError;
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

export type ClaimReviewPanel = {
  kind: "claim-review-panel";
  title: string;
  responseId?: string;
  projectId?: string;
  sessionId?: string;
  accepted: boolean;
  responseSchema: ValidationResult;
  claims: ExtractedClaimRecord[];
  boundaryNotes: string[];
  emptyStateTitle: string;
  emptyStateBody: string;
};

export type GroundedRetrievalFlowStatus = "ready" | "missing_evidence";

export type GroundedRetrievalFlow = {
  kind: "grounded-retrieval-flow";
  title: string;
  projectId: string;
  sessionId: string;
  query: string;
  status: GroundedRetrievalFlowStatus;
  retrievalHits: AvgRetrievalHit[];
  retrievalConfidence: "none" | "low" | "medium" | "high";
  boundaryStatement: string;
  groundedResponse?: DialogueSurfaceGrounding;
  queryLabel: string;
  queryPlaceholder: string;
  submitLabel: string;
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

function formatResponseSchemaNotes(errors: ValidationResult["errors"]): string[] {
  if (errors.length === 0) {
    return [];
  }

  return errors.map((error) => {
    const location = error.instancePath.length > 0 ? error.instancePath : "/";
    return `AVG structured response schema violation at ${location} (${error.keyword}).`;
  });
}

function normalizeRawThought(value: string | undefined): string {
  return value?.trim() ?? "";
}

function createUserMessageFromRawThought(rawThought: string): DialogueMessage {
  return {
    id: "msg-1",
    role: "user",
    content: rawThought,
  };
}

function createAssistantMessageFromStructuredResponse(
  response: AvgStructuredResponse,
): DialogueMessage {
  return {
    id: response.message_id,
    role: "assistant",
    content: "Structured AVG response",
  };
}

function createInvalidStructuredResponseError(
  validation: ValidationResult,
): StructuredDialogueError {
  return {
    code: "invalid_structured_response",
    message:
      "AVG could not render the assistant output because it is not a valid structured response.",
    validation,
    boundaryNotes: [
      "The dialogue surface must not display invalid structured output as a normal assistant answer.",
      ...formatResponseSchemaNotes(validation.errors),
    ],
  };
}

function createProjectSessionMismatchError(
  response: AvgStructuredResponse,
  projectId: string,
  sessionId: string,
): StructuredDialogueError {
  return {
    code: "response_project_session_mismatch",
    message:
      "AVG could not render this structured response inside the active project/session.",
    boundaryNotes: [
      `Response project/session (${response.project_id}/${response.session_id}) does not match active project/session (${projectId}/${sessionId}).`,
      "Project/session drift must fail visibly so response details cannot cross workspace boundaries.",
    ],
  };
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

export const workspaceStateStorageKey = "avg.mvp5.workspace-state";

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

export function createWorkspaceStateFromInput(
  input: WorkspaceLocalProjectInput,
): WorkspaceState {
  return createLocalWorkspaceState(
    input.projectTitle,
    input.sessionTitle ?? "Working session",
    {
      ...(input.projectId !== undefined ? { projectId: input.projectId } : {}),
      ...(input.sessionId !== undefined ? { sessionId: input.sessionId } : {}),
      ...(input.createdAt !== undefined ? { createdAt: input.createdAt } : {}),
    },
  );
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

function isLocalProjectRecord(value: unknown): value is LocalProjectRecord {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const project = value as Partial<LocalProjectRecord>;

  return (
    typeof project.id === "string" &&
    typeof project.title === "string" &&
    project.accessMode === "browser_local" &&
    typeof project.createdAt === "string"
  );
}

function isLocalSessionRecord(value: unknown): value is LocalSessionRecord {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const session = value as Partial<LocalSessionRecord>;

  return (
    typeof session.id === "string" &&
    typeof session.projectId === "string" &&
    typeof session.title === "string" &&
    typeof session.createdAt === "string"
  );
}

function isWorkspaceSurface(value: unknown): value is WorkspaceSurface {
  return workspaceNavigationSurfaces.some((item) => item.surface === value);
}

function isSerializedWorkspaceState(value: unknown): value is WorkspaceState {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const state = value as Partial<WorkspaceState>;

  return (
    state.kind === "workspace-state" &&
    isLocalProjectRecord(state.project) &&
    isLocalSessionRecord(state.session) &&
    isWorkspaceSurface(state.selectedSurface) &&
    state.contractVersion === "mvp-5" &&
    state.localOnly === true
  );
}

export function parseWorkspaceState(serialized: string): WorkspaceState {
  const value = JSON.parse(serialized) as unknown;

  if (!isSerializedWorkspaceState(value)) {
    throw new Error("Serialized workspace state does not match the MVP-5 local contract.");
  }

  return createWorkspaceState(value.project, value.session, value.selectedSurface);
}

export function saveWorkspaceState(
  storage: WorkspaceStoragePort,
  state: WorkspaceState,
  key = workspaceStateStorageKey,
): WorkspaceState {
  storage.setItem(key, serializeWorkspaceState(state));

  return state;
}

export function loadWorkspaceState(
  storage: WorkspaceStoragePort,
  key = workspaceStateStorageKey,
): WorkspaceState | undefined {
  const serialized = storage.getItem(key);

  if (serialized === null) {
    return undefined;
  }

  try {
    return parseWorkspaceState(serialized);
  } catch {
    storage.removeItem(key);

    return undefined;
  }
}

export function resetWorkspaceState(
  storage: WorkspaceStoragePort,
  key = workspaceStateStorageKey,
): void {
  storage.removeItem(key);
}

export function createAndSaveWorkspaceState(
  storage: WorkspaceStoragePort,
  input: WorkspaceLocalProjectInput,
  key = workspaceStateStorageKey,
): WorkspaceState {
  return saveWorkspaceState(storage, createWorkspaceStateFromInput(input), key);
}

export function openSavedWorkspaceState(
  storage: WorkspaceStoragePort,
  fallback: WorkspaceState,
  key = workspaceStateStorageKey,
): WorkspaceState {
  return loadWorkspaceState(storage, key) ?? saveWorkspaceState(storage, fallback, key);
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

export function createStructuredDialogueSurface(
  input: StructuredDialogueSurfaceInput,
): StructuredDialogueSurface {
  const rawThought = normalizeRawThought(input.rawThought);
  const baseMessages = input.messages ?? [];
  const baseSurface = {
    kind: "structured-dialogue-surface" as const,
    title: renderShellTitle(),
    projectId: input.projectId,
    sessionId: input.sessionId,
    rawThought,
    emptyStateTitle: "No dialogue yet",
    emptyStateBody:
      "Submit a raw thought. AVG will render only a contract-shaped response with scope, status, risk and boundary details.",
    loadingLabel: "Structuring response",
    composerLabel: "Raw thought",
    composerPlaceholder: "Write the thought you want AVG to shape",
    submitLabel: "Submit thought",
  };

  if (input.error !== undefined) {
    return {
      ...baseSurface,
      messages: baseMessages,
      status: "error",
      error: input.error,
    };
  }

  if (input.isLoading === true) {
    return {
      ...baseSurface,
      messages:
        rawThought.length > 0 && baseMessages.length === 0
          ? [createUserMessageFromRawThought(rawThought)]
          : baseMessages,
      status: "loading",
    };
  }

  if (input.response === undefined) {
    return {
      ...baseSurface,
      messages: baseMessages,
      status: "empty",
    };
  }

  const validation = validateAvgResponse(input.response);

  if (!validation.valid) {
    return {
      ...baseSurface,
      messages:
        rawThought.length > 0 && baseMessages.length === 0
          ? [createUserMessageFromRawThought(rawThought)]
          : baseMessages,
      status: "error",
      error: createInvalidStructuredResponseError(validation),
    };
  }

  const response = input.response as AvgStructuredResponse;

  if (response.project_id !== input.projectId || response.session_id !== input.sessionId) {
    return {
      ...baseSurface,
      messages:
        rawThought.length > 0 && baseMessages.length === 0
          ? [createUserMessageFromRawThought(rawThought)]
          : baseMessages,
      status: "error",
      error: createProjectSessionMismatchError(response, input.projectId, input.sessionId),
    };
  }

  const messages =
    baseMessages.length > 0
      ? baseMessages
      : [
          ...(rawThought.length > 0 ? [createUserMessageFromRawThought(rawThought)] : []),
          createAssistantMessageFromStructuredResponse(response),
        ];

  return {
    ...baseSurface,
    messages,
    status: input.recoveredFrom === undefined ? "ready" : "recovered",
    responseDetails: createStructuredResponseDetailsPanel(response),
    claimReview: createClaimReviewPanel(response),
    ...(input.recoveredFrom !== undefined ? { recoveredFrom: input.recoveredFrom } : {}),
  };
}

export function submitRawThoughtToStructuredDialogue(
  projectId: string,
  sessionId: string,
  rawThought: string,
  response?: unknown,
): StructuredDialogueSurface {
  const normalizedThought = normalizeRawThought(rawThought);

  if (normalizedThought.length === 0) {
    return createStructuredDialogueSurface({
      projectId,
      sessionId,
      rawThought,
      error: {
        code: "empty_raw_thought",
        message: "AVG needs a raw thought before it can build a structured response.",
        boundaryNotes: [
          "Empty input is not a claim, concept, metaphor or model and should not enter the dialogue map.",
        ],
      },
    });
  }

  return createStructuredDialogueSurface({
    projectId,
    sessionId,
    rawThought: normalizedThought,
    response,
  });
}

export function renderStructuredDialogueSurface(
  input: StructuredDialogueSurfaceInput | StructuredDialogueSurface,
): string {
  const surface =
    "kind" in input && input.kind === "structured-dialogue-surface"
      ? input
      : createStructuredDialogueSurface(input);
  const messageItems = surface.messages.map(
    (message) =>
      `    <li data-message-id="${escapeHtml(message.id)}" data-message-role="${escapeHtml(message.role)}"><strong>${escapeHtml(message.role)}</strong><p>${escapeHtml(message.content)}</p></li>`,
  );
  const errorPanel =
    surface.error === undefined
      ? []
      : [
          `  <section aria-label="dialogue-error" data-error-code="${escapeHtml(surface.error.code)}">`,
          `    <h3>${escapeHtml(surface.error.message)}</h3>`,
          `    <ul>`,
          ...surface.error.boundaryNotes.map((note) => `      <li>${escapeHtml(note)}</li>`),
          `    </ul>`,
          `  </section>`,
        ];
  const recoveredPanel =
    surface.recoveredFrom === undefined
      ? []
      : [
          `  <aside aria-label="dialogue-recovered-state" data-recovered-from="${escapeHtml(surface.recoveredFrom.code)}">`,
          `    <strong>Recovered structured response</strong>`,
          `    <p>${escapeHtml(surface.recoveredFrom.message)}</p>`,
          `  </aside>`,
        ];
  const detailsPanel =
    surface.responseDetails === undefined
      ? []
      : [
          `  <section aria-label="structured-response-details">`,
          ...indentMarkup(
            renderStructuredResponseDetailsPanel(surface.responseDetails.response),
            "    ",
          ),
          `  </section>`,
        ];
  const claimReviewPanel =
    surface.claimReview === undefined
      ? []
      : [
          `  <section aria-label="dialogue-claim-review">`,
          ...indentMarkup(renderClaimReviewPanel(surface.claimReview), "    "),
          `  </section>`,
        ];

  return [
    `<section data-surface="${surface.kind}" data-project-id="${escapeHtml(surface.projectId)}" data-session-id="${escapeHtml(surface.sessionId)}" data-dialogue-status="${escapeHtml(surface.status)}">`,
    `  <header>`,
    `    <p>${escapeHtml(surface.title)}</p>`,
    `    <h2>Dialogue</h2>`,
    `  </header>`,
    `  <section aria-label="dialogue-thread">`,
    ...(messageItems.length > 0
      ? [`    <ol>`, ...messageItems, `    </ol>`]
      : [
          `    <strong>${escapeHtml(surface.emptyStateTitle)}</strong>`,
          `    <p>${escapeHtml(surface.emptyStateBody)}</p>`,
        ]),
    `  </section>`,
    ...(surface.status === "loading"
      ? [
          `  <section aria-label="dialogue-loading">`,
          `    <p>${escapeHtml(surface.loadingLabel)}</p>`,
          `  </section>`,
        ]
      : []),
    ...errorPanel,
    ...recoveredPanel,
    ...detailsPanel,
    ...claimReviewPanel,
    `  <section aria-label="dialogue-composer">`,
    `    <label>${escapeHtml(surface.composerLabel)}</label>`,
    `    <textarea placeholder="${escapeHtml(surface.composerPlaceholder)}">${escapeHtml(surface.rawThought)}</textarea>`,
    `    <button type="button" data-action="submit-raw-thought">${escapeHtml(surface.submitLabel)}</button>`,
    `  </section>`,
    `</section>`,
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
          `    <section aria-label="grounded-claim-review">`,
          ...indentMarkup(
            renderClaimReviewPanel(surface.groundedResponse.response),
            "      ",
          ),
          `    </section>`,
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

function isClaimExtractionReport(value: unknown): value is ClaimExtractionReport {
  return (
    typeof value === "object" &&
    value !== null &&
    "responseSchema" in value &&
    "claims" in value &&
    "accepted" in value &&
    "boundaryNotes" in value
  );
}

function isClaimReviewPanel(value: unknown): value is ClaimReviewPanel {
  return (
    typeof value === "object" &&
    value !== null &&
    "kind" in value &&
    value.kind === "claim-review-panel"
  );
}

function hasMapTerritoryRisk(record: ExtractedClaimRecord): boolean {
  return [
    record.claim.claim_status,
    record.claim.language_mode,
    ...record.claim.risks,
    ...record.validation.risks,
    ...record.riskAssessment.riskMarkers,
    ...record.riskAssessment.boundaryNotes,
  ].some((value) => value.includes("map_territory") || value.includes("territory"));
}

export function createClaimReviewPanel(
  input: unknown | ClaimExtractionReport,
): ClaimReviewPanel {
  const report = isClaimExtractionReport(input)
    ? input
    : extractClaimsFromAvgResponse(input);
  const response = !isClaimExtractionReport(input) && report.responseSchema.valid
    ? (input as AvgStructuredResponse)
    : undefined;

  return {
    kind: "claim-review-panel",
    title: "Claim review",
    ...(response !== undefined
      ? {
          responseId: response.id,
          projectId: response.project_id,
          sessionId: response.session_id,
        }
      : {}),
    accepted: report.accepted,
    responseSchema: report.responseSchema,
    claims: report.claims,
    boundaryNotes: [...report.boundaryNotes],
    emptyStateTitle: "No extracted claims",
    emptyStateBody:
      "Claim review waits for a schema-valid AVG response before treating summary, scope and next action as inspectable claims.",
  };
}

export function renderClaimReviewPanel(
  input: unknown | ClaimExtractionReport | ClaimReviewPanel,
): string {
  const panel =
    isClaimReviewPanel(input)
      ? input
      : createClaimReviewPanel(input);
  const boundaryNoteItems = panel.boundaryNotes.map(
    (note) => `    <li>${escapeHtml(note)}</li>`,
  );
  const claimItems = panel.claims.map((record) => {
    const repairItems = record.riskAssessment.repairSuggestions.map(
      (suggestion) => `        <li>${escapeHtml(suggestion)}</li>`,
    );
    const riskMarkerItems = record.riskAssessment.riskMarkers.map(
      (marker) => `        <li>${escapeHtml(marker)}</li>`,
    );
    const boundaryItems = [
      ...record.validation.boundaryNotes,
      ...record.riskAssessment.boundaryNotes,
    ].map((note) => `        <li>${escapeHtml(note)}</li>`);
    const sourceRefs = record.claim.source_refs ?? [];

    return [
      `    <li data-claim-id="${escapeHtml(record.claim.id)}" data-source-field="${escapeHtml(record.sourceField)}" data-claim-status="${escapeHtml(record.claim.claim_status)}" data-language-mode="${escapeHtml(record.claim.language_mode)}" data-risk-level="${escapeHtml(record.riskAssessment.riskLevel)}" data-validation-accepted="${escapeHtml(String(record.validation.accepted))}" data-should-repair="${escapeHtml(String(record.riskAssessment.shouldRepair))}" data-metaphor-only="${escapeHtml(String(record.claim.claim_status === "metaphor_only" || record.claim.language_mode === "metaphor"))}" data-map-territory-risk="${escapeHtml(String(hasMapTerritoryRisk(record)))}">`,
      `      <strong>${escapeHtml(record.sourceField)}</strong>`,
      `      <p>${escapeHtml(record.claim.statement)}</p>`,
      `      <dl>`,
      `        <div><dt>Scope</dt><dd>${escapeHtml(record.claim.scope ?? "not specified")}</dd></div>`,
      `        <div><dt>Claim status</dt><dd>${escapeHtml(record.claim.claim_status)}</dd></div>`,
      `        <div><dt>Language mode</dt><dd>${escapeHtml(record.claim.language_mode)}</dd></div>`,
      `        <div><dt>Risk level</dt><dd>${escapeHtml(record.riskAssessment.riskLevel)}</dd></div>`,
      `        <div><dt>Source refs</dt><dd>${escapeHtml(sourceRefs.length > 0 ? sourceRefs.join(", ") : "none")}</dd></div>`,
      `      </dl>`,
      `      <section aria-label="claim-risk-markers">`,
      `        <h4>Risk markers</h4>`,
      `        <ul>`,
      ...(riskMarkerItems.length > 0 ? riskMarkerItems : ["        <li>None</li>"]),
      `        </ul>`,
      `      </section>`,
      `      <section aria-label="claim-boundary-notes">`,
      `        <h4>Boundary notes</h4>`,
      `        <ul>`,
      ...(boundaryItems.length > 0 ? boundaryItems : ["        <li>No boundary notes</li>"]),
      `        </ul>`,
      `      </section>`,
      `      <section aria-label="claim-repair-suggestions">`,
      `        <h4>Repair suggestions</h4>`,
      `        <p>Scoped suggestions, not automatic truth.</p>`,
      `        <ul>`,
      ...(repairItems.length > 0 ? repairItems : ["        <li>No repair suggested</li>"]),
      `        </ul>`,
      `      </section>`,
      `    </li>`,
    ].join("\n");
  });

  return [
    `<section data-panel="${panel.kind}" data-claim-review-accepted="${escapeHtml(String(panel.accepted))}"${panel.responseId === undefined ? "" : ` data-response-id="${escapeHtml(panel.responseId)}"`}${panel.projectId === undefined ? "" : ` data-project-id="${escapeHtml(panel.projectId)}"`}${panel.sessionId === undefined ? "" : ` data-session-id="${escapeHtml(panel.sessionId)}"`}>`,
    `  <header>`,
    `    <h3>${escapeHtml(panel.title)}</h3>`,
    `    <p>Extracted claims are working map records, not Reality.</p>`,
    `  </header>`,
    `  <aside aria-label="claim-review-boundary">`,
    `    <strong>Repair suggestions are scoped edits, not automatic truth.</strong>`,
    `    <p>Metaphor-only and map/territory issues stay marked before any claim is reused.</p>`,
    `  </aside>`,
    `  <section aria-label="claim-review-boundary-notes">`,
    `    <h4>Report boundary notes</h4>`,
    `    <ul>`,
    ...(boundaryNoteItems.length > 0 ? boundaryNoteItems : ["    <li>No report-level boundary notes</li>"]),
    `    </ul>`,
    `  </section>`,
    `  <section aria-label="claim-review-list">`,
    `    <h4>Extracted claims</h4>`,
    ...(claimItems.length > 0
      ? [`    <ol>`, ...claimItems, `    </ol>`]
      : [
          `    <strong>${escapeHtml(panel.emptyStateTitle)}</strong>`,
          `    <p>${escapeHtml(panel.emptyStateBody)}</p>`,
        ]),
    `  </section>`,
    `</section>`,
  ].join("\n");
}

function retrievalConfidenceFromHits(
  hits: AvgRetrievalHit[],
): "none" | "low" | "medium" | "high" {
  return hits[0]?.confidence ?? "none";
}

export function createGroundedRetrievalFlow(
  projectId: string,
  sessionId: string,
  query: string,
  retrievalHits: AvgRetrievalHit[],
  report: GroundedResponseCompositionReport,
): GroundedRetrievalFlow {
  const groundedResponse =
    report.groundedResponse === undefined
      ? undefined
      : {
          response: report.groundedResponse.response,
          grounding: report.groundedResponse.grounding,
        };
  const retrievalConfidence =
    groundedResponse?.grounding.retrieval_confidence ?? retrievalConfidenceFromHits(retrievalHits);

  return {
    kind: "grounded-retrieval-flow",
    title: renderShellTitle(),
    projectId,
    sessionId,
    query: query.trim(),
    status: retrievalHits.length === 0 || retrievalConfidence === "none" ? "missing_evidence" : "ready",
    retrievalHits: retrievalHits.map((hit) => ({ ...hit })),
    retrievalConfidence,
    boundaryStatement:
      groundedResponse?.grounding.boundary_statement ??
      "No registered snippets matched this question, so AVG cannot ground the answer in project evidence.",
    ...(groundedResponse !== undefined ? { groundedResponse } : {}),
    queryLabel: "Grounded question",
    queryPlaceholder: "Ask against registered project documents",
    submitLabel: "Ask with evidence",
  };
}

export function renderGroundedRetrievalFlow(
  projectId: string,
  sessionId: string,
  query: string,
  retrievalHits: AvgRetrievalHit[],
  report: GroundedResponseCompositionReport,
): string {
  const flow = createGroundedRetrievalFlow(
    projectId,
    sessionId,
    query,
    retrievalHits,
    report,
  );
  const hitItems = flow.retrievalHits.map((hit) =>
    [
      `    <li data-retrieval-hit="true" data-snippet-id="${escapeHtml(hit.snippet_id)}" data-citation-id="${escapeHtml(hit.citation_id)}" data-document-id="${escapeHtml(hit.document_id)}" data-confidence="${escapeHtml(hit.confidence)}" data-score="${escapeHtml(String(hit.score))}">`,
      `      <strong>${escapeHtml(hit.source_label)}</strong>`,
      `      <dl>`,
      `        <div><dt>Snippet id</dt><dd>${escapeHtml(hit.snippet_id)}</dd></div>`,
      `        <div><dt>Citation id</dt><dd>${escapeHtml(hit.citation_id)}</dd></div>`,
      `        <div><dt>Confidence</dt><dd>${escapeHtml(hit.confidence)}</dd></div>`,
      `        <div><dt>Score</dt><dd>${escapeHtml(String(hit.score))}</dd></div>`,
      `      </dl>`,
      `      <blockquote>${escapeHtml(hit.matched_text)}</blockquote>`,
      `    </li>`,
    ].join("\n"),
  );
  const groundedPanel =
    flow.groundedResponse === undefined
      ? []
      : [
          `  <section aria-label="grounded-response-panel">`,
          `    <h3>Grounded response</h3>`,
          ...indentMarkup(
            renderGroundedResponseDetailsPanel(
              flow.groundedResponse.response,
              flow.groundedResponse.grounding,
            ),
            "    ",
          ),
          `  </section>`,
        ];

  return [
    `<section data-surface="${flow.kind}" data-project-id="${escapeHtml(flow.projectId)}" data-session-id="${escapeHtml(flow.sessionId)}" data-retrieval-status="${escapeHtml(flow.status)}">`,
    `  <header>`,
    `    <p>${escapeHtml(flow.title)}</p>`,
    `    <h2>Grounded retrieval</h2>`,
    `  </header>`,
    `  <section aria-label="grounded-question">`,
    `    <label>${escapeHtml(flow.queryLabel)}</label>`,
    `    <textarea placeholder="${escapeHtml(flow.queryPlaceholder)}">${escapeHtml(flow.query)}</textarea>`,
    `    <button type="button" data-action="ask-grounded-question">${escapeHtml(flow.submitLabel)}</button>`,
    `  </section>`,
    `  <aside aria-label="retrieval-boundary" data-retrieval-confidence="${escapeHtml(flow.retrievalConfidence)}">`,
    `    <strong>Retrieval confidence is a risk signal, not proof.</strong>`,
    `    <p>${escapeHtml(flow.boundaryStatement)}</p>`,
    `  </aside>`,
    `  <section aria-label="retrieval-hits">`,
    `    <h3>Retrieval hits</h3>`,
    `    <ul>`,
    ...(hitItems.length > 0
      ? hitItems
      : ["    <li>No registered snippets matched this question.</li>"]),
    `    </ul>`,
    `  </section>`,
    ...groundedPanel,
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
