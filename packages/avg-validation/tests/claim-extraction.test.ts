import { describe, expect, it } from "vitest";
import invalidResponseFixture from "../../../tests/fixtures/avg-response/invalid-missing-boundary.json";
import validResponseFixture from "../../../tests/fixtures/avg-response/valid.json";
import { extractClaimsFromAvgResponse } from "../src/index";

describe("claim extraction pipeline", () => {
  it("extracts schema-valid claim candidates from a structured AVG response", () => {
    const report = extractClaimsFromAvgResponse(validResponseFixture);

    expect(report.responseSchema.valid).toBe(true);
    expect(report.accepted).toBe(true);
    expect(report.claims.map((record) => record.sourceField)).toEqual([
      "summary",
      "scope",
      "next_action"
    ]);
    expect(report.claims[0].claim).toMatchObject({
      id: "claim_response_001_summary",
      statement: "This response keeps the distinction between map and territory clear.",
      claim_status: "boundary_statement",
      language_mode: "operational_description",
      scope: "MVP-1 dialogue slice.",
      risks: ["map_territory_boundary_preserved", "scope_explicit"],
      source_refs: ["response_001#summary"]
    });
    expect(report.claims[1].claim).toMatchObject({
      id: "claim_response_001_scope",
      statement: "Scope boundary: MVP-1 dialogue slice.",
      claim_status: "boundary_statement",
      language_mode: "operational_description",
      source_refs: ["response_001#scope"]
    });
    expect(report.claims[2].claim).toMatchObject({
      id: "claim_response_001_next_action",
      statement: "Approve the downstream API contract and compose the response payload.",
      claim_status: "operational_marker",
      language_mode: "operational_description",
      source_refs: ["response_001#next_action"]
    });
    expect(report.claims.every((record) => record.validation.accepted)).toBe(true);
  });

  it("stops extraction when the structured response is not schema valid", () => {
    const report = extractClaimsFromAvgResponse(invalidResponseFixture);

    expect(report.responseSchema.valid).toBe(false);
    expect(report.accepted).toBe(false);
    expect(report.claims).toEqual([]);
    expect(report.boundaryNotes[0]).toContain("Claim extraction stops");
  });
});
