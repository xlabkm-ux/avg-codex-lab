import { describe, expect, it } from "vitest";
import validClaimFixture from "../../../tests/fixtures/claims/valid.json";
import validResponseFixture from "../../../tests/fixtures/avg-response/valid.json";
import {
  classifyClaimRisk,
  extractClaimsFromAvgResponse,
  validateClaimContract
} from "../src/index";

describe("avg-validation public contract", () => {
  it("keeps claim validation reports schema-backed and boundary-aware", () => {
    const report = validateClaimContract(validClaimFixture);

    expect(report.schema.valid).toBe(true);
    expect(typeof report.accepted).toBe("boolean");
    expect(Array.isArray(report.risks)).toBe(true);
    expect(Array.isArray(report.boundaryNotes)).toBe(true);
    expect(report.status).toBe("hypothesis");
    expect(report.languageMode).toBe("operational_description");
  });

  it("keeps extracted claims annotated with risk assessments", () => {
    const report = extractClaimsFromAvgResponse(validResponseFixture);

    expect(report.responseSchema.valid).toBe(true);
    expect(report.claims.length).toBeGreaterThan(0);
    expect(report.claims[0]).toHaveProperty("riskAssessment");
    expect(report.claims[0].riskAssessment).toMatchObject({
      shouldRepair: expect.any(Boolean)
    });
  });

  it("returns a stable risk assessment shape for explicit metaphor claims", () => {
    const report = classifyClaimRisk({
      id: "claim_contract_001",
      statement: "The idea is a castle with hidden rooms.",
      claim_status: "metaphor_only",
      language_mode: "metaphor",
      risks: []
    });

    expect(report).toMatchObject({
      riskLevel: "high"
    });
    expect(Array.isArray(report.riskMarkers)).toBe(true);
    expect(Array.isArray(report.repairSuggestions)).toBe(true);
    expect(Array.isArray(report.boundaryNotes)).toBe(true);
  });
});
