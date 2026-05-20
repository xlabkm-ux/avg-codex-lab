import { describe, expect, it } from "vitest";
import { validateAvgResponse } from "@avg/schemas";
import {
  renderDialogueMessageSurface,
  renderProjectSessionPage,
  renderStructuredResponseDetailsPanel,
} from "../src/index";

describe("first dialogue smoke path", () => {
  it("renders the minimal web dialogue flow end to end", () => {
    const shell = renderProjectSessionPage("project-7", "session-3");
    const messageSurface = renderDialogueMessageSurface("project-7", "session-3", [
      { id: "msg-1", role: "user", content: "raw thought" },
      { id: "msg-2", role: "assistant", content: "structured reply" },
    ]);
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
      risk_markers: ["no hidden claims", "explicit scope"],
      map_territory_boundary: "preserved",
      next_action: "continue with the next message",
      artifacts: ["session outline"],
    } as const;
    const details = renderStructuredResponseDetailsPanel(response);

    expect(validateAvgResponse(response).valid).toBe(true);
    expect(shell).toContain('data-shell="project-session-shell"');
    expect(messageSurface).toContain('data-surface="dialogue-message-surface"');
    expect(details).toContain('data-panel="structured-response-details-panel"');
    expect(shell).toContain("Project project-7");
    expect(messageSurface).toContain("raw thought");
    expect(details).toContain("A structured reply with explicit boundaries");
  });
});
