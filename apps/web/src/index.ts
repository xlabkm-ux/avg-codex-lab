import type { AvgStructuredResponse } from "@avg/schemas";

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
};

export type StructuredResponseDetailsPanel = {
  kind: "structured-response-details-panel";
  title: string;
  response: AvgStructuredResponse;
};

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
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
  };
}

export function renderDialogueMessageSurface(
  projectId: string,
  sessionId: string,
  messages: DialogueMessage[],
): string {
  const surface = createDialogueMessageSurface(projectId, sessionId, messages);

  if (surface.messages.length === 0) {
    return [
      `<section data-surface="${surface.kind}" data-project-id="${escapeHtml(surface.projectId)}" data-session-id="${escapeHtml(surface.sessionId)}">`,
      `  <p>${escapeHtml(surface.title)}</p>`,
      `  <strong>${escapeHtml(surface.emptyStateTitle)}</strong>`,
      `  <p>${escapeHtml(surface.emptyStateBody)}</p>`,
      `  <textarea placeholder="${escapeHtml(surface.composerPlaceholder)}"></textarea>`,
      `  <button type="button">${escapeHtml(surface.submitLabel)}</button>`,
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
    `  <textarea placeholder="${escapeHtml(surface.composerPlaceholder)}"></textarea>`,
    `  <button type="button">${escapeHtml(surface.submitLabel)}</button>`,
    `</section>`,
  ].join("\n");
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
