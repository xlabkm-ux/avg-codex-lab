import { describe, expect, it } from "vitest";
import { health, validateClaimRequest } from "../src/index";

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
});
