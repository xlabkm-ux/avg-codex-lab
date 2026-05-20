import { describe, expect, it } from "vitest";
import {
  appendMessage,
  createProject,
  createProjectSessionMessage,
  createMapDiffArtifact,
  createSession,
  getMessage,
  getProject,
  getSession,
  health,
  materializeMapSnapshot,
  validateClaimRequest
} from "../src/index";
import { createEmptyGraphSnapshot, projectClaimToMapNode } from "@avg/graph";

describe("api app smoke surface", () => {
  it("exposes health status", () => {
    expect(health()).toEqual({ status: "ok", service: "avg-api" });
  });

  it("validates claim request bodies through the contract validator", () => {
    const response = validateClaimRequest({
      id: "claim_001",
      statement: "This is a working API contract slice.",
      claim_status: "hypothesis",
      language_mode: "operational_description",
      scope: "MVP-0 smoke test.",
      risks: []
    });

    expect(response.accepted).toBe(true);
  });

  it("creates and links projects, sessions and messages in memory", () => {
    const project = createProject("Launch project");
    const session = createSession(project.id, "Kickoff");
    const message = appendMessage(session.id, "Start the dialogue.");

    expect(getProject(project.id)).toEqual(project);
    expect(getSession(session.id)).toEqual(session);
    expect(getMessage(message.id)).toEqual(message);
    expect(message.role).toBe("user");
  });

  it("creates a linked project/session/message slice in one call", () => {
    const record = createProjectSessionMessage("Research project", "Synthesis", "Capture the main idea.");

    expect(record.project.name).toBe("Research project");
    expect(record.session.projectId).toBe(record.project.id);
    expect(record.message.sessionId).toBe(record.session.id);
    expect(record.message.content).toBe("Capture the main idea.");
  });

  it("materializes map snapshots from projections and snapshots", () => {
    const projection = projectClaimToMapNode({
      id: "claim_010",
      statement: "Map diffs should preserve boundary metadata.",
      claim_status: "boundary_statement",
      language_mode: "operational_description",
      risks: ["boundary_loss"],
      source_refs: ["source_010"],
      scope: "Sprint 5 artifact surface"
    });

    const from = createEmptyGraphSnapshot();
    const to = materializeMapSnapshot(projection);
    const artifact = createMapDiffArtifact(from, projection);

    expect(to).toEqual({
      nodes: [projection.node],
      edges: projection.edges
    });
    expect(artifact.kind).toBe("map_diff");
    expect(artifact.from).toEqual(from);
    expect(artifact.to).toEqual(to);
    expect(artifact.diff.addedNodes).toEqual([projection.node]);
    expect(artifact.diff.addedEdges).toEqual(projection.edges);
  });
});
