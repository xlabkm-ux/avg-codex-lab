import { describe, expect, it } from "vitest";
import { projectClaimToMapNode } from "../src/index";

describe("claim graph projection", () => {
  it("preserves claim status, language mode and risks", () => {
    const projection = projectClaimToMapNode({
      id: "claim_001",
      statement: "AVG keeps maps separate from territory.",
      claim_status: "working_distinction",
      language_mode: "operational_description",
      risks: ["map_territory_confusion"]
    });

    expect(projection.node.coordinates.claim_status).toBe("working_distinction");
    expect(projection.node.coordinates.language_mode).toBe("operational_description");
    expect(projection.node.map_safety.known_risks).toContain("map_territory_confusion");
  });
});
