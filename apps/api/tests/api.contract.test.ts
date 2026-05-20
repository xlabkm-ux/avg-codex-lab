import { describe, expect, it } from "vitest";
import validResponseFixture from "../../../tests/fixtures/avg-response/valid.json";
import invalidResponseFixture from "../../../tests/fixtures/avg-response/invalid-missing-boundary.json";
import { validateAvgResponse } from "@avg/schemas";

describe("api contract smoke path", () => {
  it("accepts the approved structured AVG response fixture", () => {
    expect(validateAvgResponse(validResponseFixture)).toMatchObject({
      valid: true,
      errors: []
    });
  });

  it("rejects a structured response missing the map-territory boundary marker", () => {
    const result = validateAvgResponse(invalidResponseFixture);

    expect(result.valid).toBe(false);
    expect(result.errors.some((error) => error.keyword === "required")).toBe(true);
  });
});
