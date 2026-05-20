import { describe, expect, it } from "vitest";
import {
  createLocalProjectRecord,
  createLocalSessionRecord,
  createLocalWorkspaceState,
  createGroundedResponseDetailsPanel,
  createDialogueMessageSurface,
  createDialogueMessageSurfaceFromGroundedReport,
  createDialogueFlowPage,
  createConceptMapShell,
  createProjectSessionShell,
  createStructuredResponseDetailsPanel,
  createWorkspaceShell,
  openLocalWorkspaceProject,
  materializeConceptMapSnapshot,
  parseWorkspaceState,
  renderConceptMapShell,
  renderDialogueMessageSurface,
  renderDialogueMessageSurfaceFromGroundedReport,
  renderDialogueFlowPage,
  renderDialogueFlowPageFromGroundedReport,
  renderProjectSessionPage,
  renderWorkspaceShell,
  renderGroundedResponseDetailsPanel,
  renderStructuredResponseDetailsPanel,
  renderShellTitle,
  selectWorkspaceSurface,
  serializeWorkspaceState,
} from "../src/index";
import { validateAvgResponse } from "@avg/schemas";
import { projectClaimToMapNode } from "@avg/graph";
import { composeGroundedResponse } from "@avg/validation";

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

  it("creates browser-local workspace state for a project and session", () => {
    const state = createLocalWorkspaceState("Research map", "First pass", {
      projectId: "project-702",
      sessionId: "session-702",
      createdAt: "2026-05-20T10:00:00.000Z",
    });

    expect(state).toEqual({
      kind: "workspace-state",
      project: {
        id: "project-702",
        title: "Research map",
        accessMode: "browser_local",
        createdAt: "2026-05-20T10:00:00.000Z",
      },
      session: {
        id: "session-702",
        projectId: "project-702",
        title: "First pass",
        createdAt: "2026-05-20T10:00:00.000Z",
      },
      selectedSurface: "dialogue",
      contractVersion: "mvp-5",
      localOnly: true,
    });
  });

  it("opens an existing local project and prevents project/session drift", () => {
    const project = createLocalProjectRecord("Claim map", {
      id: "project-claim-map",
      createdAt: "2026-05-20T10:00:00.000Z",
    });
    const session = createLocalSessionRecord(project.id, "Review session", {
      id: "session-review",
      createdAt: "2026-05-20T10:00:00.000Z",
    });

    const state = openLocalWorkspaceProject(project, session, "documents");

    expect(state.selectedSurface).toBe("documents");
    expect(state.project.id).toBe("project-claim-map");
    expect(state.session.projectId).toBe("project-claim-map");
    expect(() =>
      openLocalWorkspaceProject(
        project,
        { ...session, projectId: "other-project" },
        "dialogue",
      ),
    ).toThrow("Session project id must match the active project id.");
  });

  it("creates a workspace shell with stable navigation and local-only boundary", () => {
    const state = createLocalWorkspaceState("Boundary work", "Map pass", {
      projectId: "project-boundary",
      sessionId: "session-map",
      selectedSurface: "map",
    });
    const shell = createWorkspaceShell(state);

    expect(shell.kind).toBe("workspace-shell");
    expect(shell.localOnlyLabel).toBe("Local only");
    expect(shell.localOnlyBoundary).toContain("browser-local");
    expect(shell.technicalDetails).toEqual({
      projectId: "project-boundary",
      sessionId: "session-map",
      contractVersion: "mvp-5",
    });
    expect(shell.navigation).toEqual([
      { surface: "dialogue", label: "Dialogue", active: false },
      { surface: "documents", label: "Documents", active: false },
      { surface: "retrieval", label: "Retrieval", active: false },
      { surface: "claim-review", label: "Claim Review", active: false },
      { surface: "map", label: "Map", active: true },
      { surface: "artifacts", label: "Artifacts", active: false },
    ]);
  });

  it("selects workspace surfaces without changing project/session identity", () => {
    const state = createLocalWorkspaceState("Artifact work", "Session notes", {
      projectId: "project-artifact",
      sessionId: "session-artifact",
    });
    const nextState = selectWorkspaceSurface(state, "artifacts");

    expect(nextState.selectedSurface).toBe("artifacts");
    expect(nextState.project.id).toBe("project-artifact");
    expect(nextState.session.id).toBe("session-artifact");
  });

  it("serializes and parses local workspace state", () => {
    const state = createLocalWorkspaceState("Local persistence", "Browser session", {
      projectId: "project-local",
      sessionId: "session-local",
      selectedSurface: "documents",
    });

    expect(parseWorkspaceState(serializeWorkspaceState(state))).toEqual(state);
  });

  it("renders the MVP-5 workspace shell as the first product screen", () => {
    const state = createLocalWorkspaceState("Structured thinking", "Opening pass", {
      projectId: "project-702",
      sessionId: "session-702",
      selectedSurface: "dialogue",
    });
    const page = renderWorkspaceShell(state);

    expect(page).toContain('data-shell="workspace-shell"');
    expect(page).toContain('data-project-id="project-702"');
    expect(page).toContain('data-session-id="session-702"');
    expect(page).toContain('data-local-only="true"');
    expect(page).toContain("Local only");
    expect(page).toContain("New local project");
    expect(page).toContain("Open local project");
    expect(page).toContain("Reset local project");
    expect(page).toContain('aria-label="workspace-surfaces"');
    expect(page).toContain("Dialogue");
    expect(page).toContain("Documents");
    expect(page).toContain("Retrieval");
    expect(page).toContain("Claim Review");
    expect(page).toContain("Map");
    expect(page).toContain("Artifacts");
    expect(page).toContain('data-active-surface="dialogue"');
    expect(page).toContain("scope, status, risk and boundary");
    expect(page).toContain("Technical details");
    expect(page).toContain("mvp-5");
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

  it("creates a dialogue message surface with grounded payload", () => {
    const response = {
      id: "response-8",
      project_id: "project-7",
      session_id: "session-3",
      message_id: "msg-3",
      summary: "Grounded summary with snippet citations",
      scope: "retrieval smoke path",
      claim_status: "boundary_statement",
      language_mode: "operational_description",
      validation_risk: "low",
      risk_markers: ["retrieval_grounded"],
      map_territory_boundary: "preserved",
      next_action: "review the cited snippets",
    } as const;
    const grounding = {
      citations: [
        {
          id: "cit_doc_001_001",
          document_id: "doc_001",
          snippet_id: "snip_doc_001_001",
          source_label: "Strategy notes",
          quoted_text: "This response keeps the distinction between map and territory clear.",
          relevance: "supporting",
        },
      ],
      grounded_claims: ["This response keeps the distinction between map and territory clear."],
      interpretations: ["AVG interprets the snippet as a retrieval boundary example."],
      unsupported_claims: ["The next action remains an inference until verified."],
      retrieval_confidence: "high",
      boundary_statement: "This answer is grounded only in registered project document snippets.",
    } as const;

    const surface = createDialogueMessageSurface(
      "project-7",
      "session-3",
      [{ id: "msg-1", role: "user", content: "raw thought" }],
      { response, grounding },
    );

    expect(surface.groundedResponse).toEqual({ response, grounding });
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

  it("renders a dialogue message surface with grounded payload inline", () => {
    const response = {
      id: "response-8",
      project_id: "project-7",
      session_id: "session-3",
      message_id: "msg-3",
      summary: "Grounded summary with snippet citations",
      scope: "retrieval smoke path",
      claim_status: "boundary_statement",
      language_mode: "operational_description",
      validation_risk: "low",
      risk_markers: ["retrieval_grounded"],
      map_territory_boundary: "preserved",
      next_action: "review the cited snippets",
    } as const;
    const grounding = {
      citations: [
        {
          id: "cit_doc_001_001",
          document_id: "doc_001",
          snippet_id: "snip_doc_001_001",
          source_label: "Strategy notes",
          quoted_text: "This response keeps the distinction between map and territory clear.",
          relevance: "supporting",
        },
      ],
      grounded_claims: ["This response keeps the distinction between map and territory clear."],
      interpretations: ["AVG interprets the snippet as a retrieval boundary example."],
      unsupported_claims: ["The next action remains an inference until verified."],
      retrieval_confidence: "high",
      boundary_statement: "This answer is grounded only in registered project document snippets.",
    } as const;

    const page = renderDialogueMessageSurface(
      "project-7",
      "session-3",
      [{ id: "msg-1", role: "user", content: "raw thought" }],
      { response, grounding },
    );

    expect(page).toContain('data-panel="grounded-response-details-panel"');
    expect(page).toContain('data-citation-id="cit_doc_001_001"');
    expect(page).toContain("Grounded response");
    expect(page).toContain("This answer is grounded only in registered project document snippets.");
  });

  it("creates and renders a dialogue surface from a grounded composition report", () => {
    const response = {
      id: "response-9",
      project_id: "project-7",
      session_id: "session-3",
      message_id: "msg-4",
      summary: "Grounded reply composed from retrieval hits",
      scope: "report bridge",
      claim_status: "boundary_statement",
      language_mode: "operational_description",
      validation_risk: "low",
      risk_markers: ["retrieval_grounded"],
      map_territory_boundary: "preserved",
      next_action: "review the report bridge",
    } as const;

    const report = composeGroundedResponse(response, [
      {
        snippet_id: "snip_doc_002_001",
        document_id: "doc_002",
        project_id: "project-7",
        score: 0.9,
        confidence: "high",
        citation_id: "cit_doc_002_001",
        matched_text: "The retrieval report stays grounded in snippet ids.",
        source_label: "Retrieval notes",
      },
    ]);

    expect(report.groundedResponse?.grounding.citations[0]?.snippet_id).toBe("snip_doc_002_001");

    const surface = createDialogueMessageSurfaceFromGroundedReport(
      "project-7",
      "session-3",
      [{ id: "msg-1", role: "assistant", content: "report bridge" }],
      report,
    );

    expect(surface.groundedResponse?.grounding.boundary_statement).toContain("grounded only");
    expect(renderDialogueMessageSurfaceFromGroundedReport("project-7", "session-3", [
      { id: "msg-1", role: "assistant", content: "report bridge" },
    ], report)).toContain('data-panel="grounded-response-details-panel"');
  });

  it("creates and renders a dialogue flow page from a grounded report", () => {
    const response = {
      id: "response-10",
      project_id: "project-7",
      session_id: "session-3",
      message_id: "msg-5",
      summary: "Flow page grounded response",
      scope: "page bridge",
      claim_status: "boundary_statement",
      language_mode: "operational_description",
      validation_risk: "low",
      risk_markers: ["retrieval_grounded"],
      map_territory_boundary: "preserved",
      next_action: "review the full page",
    } as const;
    const report = composeGroundedResponse(response, [
      {
        snippet_id: "snip_doc_003_001",
        document_id: "doc_003",
        project_id: "project-7",
        score: 0.88,
        confidence: "high",
        citation_id: "cit_doc_003_001",
        matched_text: "The page bridge keeps the dialogue flow grounded.",
        source_label: "Page notes",
      },
    ]);

    const page = createDialogueFlowPage(
      "project-7",
      "session-3",
      [{ id: "msg-1", role: "user", content: "raw thought" }],
      report.groundedResponse
        ? {
            response: report.groundedResponse.response,
            grounding: report.groundedResponse.grounding,
          }
        : undefined,
    );

    expect(page.kind).toBe("dialogue-flow-page");
    expect(page.messageSurface.groundedResponse?.grounding.citations[0]?.snippet_id).toBe("snip_doc_003_001");

    const rendered = renderDialogueFlowPageFromGroundedReport(
      "project-7",
      "session-3",
      [{ id: "msg-1", role: "user", content: "raw thought" }],
      report,
    );

    expect(rendered).toContain('data-page="dialogue-flow-page"');
    expect(rendered).toContain('data-panel="grounded-response-details-panel"');
    expect(rendered).toContain("Project project-7");
    expect(rendered).toContain("Session session-3");
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

  it("creates and renders a grounded response citation panel", () => {
    const response = {
      id: "response-8",
      project_id: "project-7",
      session_id: "session-3",
      message_id: "msg-3",
      summary: "Grounded summary with snippet citations",
      scope: "retrieval smoke path",
      claim_status: "boundary_statement",
      language_mode: "operational_description",
      validation_risk: "low",
      risk_markers: ["retrieval_grounded"],
      map_territory_boundary: "preserved",
      next_action: "review the cited snippets",
    } as const;
    const grounding = {
      citations: [
        {
          id: "cit_doc_001_001",
          document_id: "doc_001",
          snippet_id: "snip_doc_001_001",
          source_label: "Strategy notes",
          quoted_text: "This response keeps the distinction between map and territory clear.",
          relevance: "supporting",
        },
      ],
      grounded_claims: ["This response keeps the distinction between map and territory clear."],
      interpretations: ["AVG interprets the snippet as a retrieval boundary example."],
      unsupported_claims: ["The next action remains an inference until verified."],
      retrieval_confidence: "high",
      boundary_statement: "This answer is grounded only in registered project document snippets.",
    } as const;

    expect(createGroundedResponseDetailsPanel(response, grounding)).toEqual({
      kind: "grounded-response-details-panel",
      title: "AVG Codex Lab",
      response,
      grounding,
    });

    const page = renderGroundedResponseDetailsPanel(response, grounding);

    expect(page).toContain('data-panel="grounded-response-details-panel"');
    expect(page).toContain('data-citation-id="cit_doc_001_001"');
    expect(page).toContain('data-snippet-id="snip_doc_001_001"');
    expect(page).toContain("Grounded claims");
    expect(page).toContain("Unsupported claims");
    expect(page).toContain("This answer is grounded only in registered project document snippets.");
  });
});
