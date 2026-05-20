import { describe, expect, it } from "vitest";
import {
  appendMessage,
  createProject,
  createProjectSessionMessage,
  createSession,
  getMessage,
  getProject,
  getSession,
  health,
  validateClaimRequest
} from "../src/index";

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
});
