import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { fixtureRequiresBoundary } from "../src/index";

describe("AI eval fixtures", () => {
  it("keeps metaphor-as-fact eval boundary requirement executable", () => {
    const fixture = readFileSync(new URL("../../../tests/ai-evals/claim-safety/metaphor-as-fact.yaml", import.meta.url), "utf8");

    expect(fixture).toContain("must_mark_metaphor: true");
    expect(fixtureRequiresBoundary(fixture)).toBe(true);
  });
});
