import { describe, expect, it } from "vitest";
import { renderShellTitle } from "../src/index";

describe("web app smoke surface", () => {
  it("exposes a stable shell title", () => {
    expect(renderShellTitle()).toBe("AVG Codex Lab");
  });
});
