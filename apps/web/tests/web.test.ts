import { describe, expect, it } from "vitest";
import {
  createDialogueMessageSurface,
  createConceptMapShell,
  createProjectSessionShell,
  createStructuredResponseDetailsPanel,
  materializeConceptMapSnapshot,
  renderConceptMapShell,
  renderDialogueMessageSurface,
  renderProjectSessionPage,
  renderStructuredResponseDetailsPanel,
  renderShellTitle,
} from "../src/index";
import { validateAvgResponse } from "@avg/schemas";
import { projectClaimToMapNode } from "@avg/graph";

describe("web app smoke surface", () => {
  it("exposes a stable shell title", () => {
    expect(renderShellTitle()).toBe("AVG Codex Lab");
  });

  it("creates a minimal project/session shell", () => {
    const shell = createProjectSessionShell("project-7", "session-3");

    expect(shell).toEqual({
      kind: "project-session-shell",
      title: "AVG Codex Lab",
      projectId: "project-7",
      sessionId: "session-3",
      projectLabel: "Project project-7",
      sessionLabel: "Session session-3",
      promptLabel: "Raw idea",
      placeholder: "Enter the thought you want to shape",
      submitLabel: "Submit idea",
      emptyStateTitle: "Start a structured dialogue",
      emptyStateBody:
        "Open a project, choose a session and submit a raw thought to begin the AVG dialogue slice.",
    });
  });

  it("renders a deterministic project/session shell page", () => {
    const page = renderProjectSessionPage("project-7", "session-3");

    expect(page).toContain('data-shell="project-session-shell"');
    expect(page).toContain('data-project-id="project-7"');
    expect(page).toContain('data-session-id="session-3"');
    expect(page).toContain("Project project-7");
    expect(page).toContain("Session session-3");
    expect(page).toContain("Submit idea");
  });

  it("creates a minimal dialogue message surface", () => {
    const surface = createDialogueMessageSurface("project-7", "session-3", [
      { id: "msg-1", role: "user", content: "raw thought" },
      { id: "msg-2", role: "assistant", content: "structured reply" },
    ]);

    expect(surface).toEqual({
      kind: "dialogue-message-surface",
      title: "AVG Codex Lab",
      projectId: "project-7",
      sessionId: "session-3",
      messages: [
        { id: "msg-1", role: "user", content: "raw thought" },
        { id: "msg-2", role: "assistant", content: "structured reply" },
      ],
      emptyStateTitle: "No dialogue yet",
      emptyStateBody: "Submit a raw idea to start the conversation.",
      composerPlaceholder: "Write the next thought",
      submitLabel: "Send message",
    });
  });

  it("renders a deterministic dialogue message surface", () => {
    const page = renderDialogueMessageSurface("project-7", "session-3", [
      { id: "msg-1", role: "user", content: "raw thought" },
      { id: "msg-2", role: "assistant", content: "structured <reply>" },
    ]);

    expect(page).toContain('data-surface="dialogue-message-surface"');
    expect(page).toContain('data-project-id="project-7"');
    expect(page).toContain('data-session-id="session-3"');
    expect(page).toContain('data-message-id="msg-1"');
    expect(page).toContain('data-message-role="assistant"');
    expect(page).toContain("structured &lt;reply&gt;");
    expect(page).toContain("Send message");
  });

  it("creates a minimal structured response details panel", () => {
    const response = {
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
      artifacts: ["session outline"],
    } as const;

    expect(validateAvgResponse(response).valid).toBe(true);
    expect(createStructuredResponseDetailsPanel(response)).toEqual({
      kind: "structured-response-details-panel",
      title: "AVG Codex Lab",
      response,
    });
  });

  it("creates a minimal concept map shell", () => {
    const shell = createConceptMapShell();

    expect(shell).toEqual({
      kind: "concept-map-shell",
      title: "AVG Codex Lab",
      subtitle: "Concept map shell",
      emptyStateTitle: "No map yet",
      emptyStateBody:
        "Pass a validated graph projection or snapshot to render the first working map.",
      snapshot: { nodes: [], edges: [] },
      nodeCount: 0,
      edgeCount: 0,
    });
  });

  it("materializes concept map snapshots from projections", () => {
    const projection = projectClaimToMapNode({
      id: "claim-7",
      statement: "Maps should keep their boundary explicit.",
      claim_status: "boundary_statement",
      language_mode: "operational_description",
      risks: ["map_territory_confusion"],
      scope: "Sprint 5 shell",
    });

    expect(materializeConceptMapSnapshot(projection)).toEqual({
      nodes: [projection.node],
      edges: projection.edges,
    });
  });

  it("renders a deterministic concept map shell", () => {
    const projection = projectClaimToMapNode({
      id: "claim-8",
      statement: "Concept maps should be React Flow ready.",
      claim_status: "working_distinction",
      language_mode: "operational_description",
      risks: ["layout_drift"],
      source_refs: ["source-1"],
      scope: "Sprint 5 shell",
    });

    const renderedEmpty = renderConceptMapShell();
    const renderedPopulated = renderConceptMapShell(projection);

    expect(renderedEmpty).toContain('data-shell="concept-map-shell"');
    expect(renderedEmpty).toContain('data-node-count="0"');
    expect(renderedEmpty).toContain("No map yet");
    expect(renderedEmpty).toContain("The map is a working projection, not Reality.");

    expect(renderedPopulated).toContain('data-shell="concept-map-shell"');
    expect(renderedPopulated).toContain('data-node-count="1"');
    expect(renderedPopulated).toContain('data-edge-count="1"');
    expect(renderedPopulated).toContain("React Flow-ready boundary");
    expect(renderedPopulated).toContain("Concept maps should be React Flow ready.");
    expect(renderedPopulated).toContain("working_distinction");
    expect(renderedPopulated).toContain("source-1");
  });

  it("renders a deterministic structured response details panel", () => {
    const page = renderStructuredResponseDetailsPanel({
      id: "response-7",
      project_id: "project-7",
      session_id: "session-3",
      message_id: "msg-2",
      summary: "A structured reply with explicit boundaries",
      scope: "planning a dialogue slice",
      claim_status: "boundary_statement",
      language_mode: "operational_description",
      validation_risk: "low",
      risk_markers: ["no hidden claims", "explicit scope"],
      map_territory_boundary: "preserved",
      next_action: "continue with the next message",
      artifacts: ["session outline"],
    });

    expect(page).toContain('data-panel="structured-response-details-panel"');
    expect(page).toContain('data-response-id="response-7"');
    expect(page).toContain("A structured reply with explicit boundaries");
    expect(page).toContain("boundary_statement");
    expect(page).toContain("operational_description");
    expect(page).toContain("Map/territory boundary");
    expect(page).toContain("session outline");
  });
});
