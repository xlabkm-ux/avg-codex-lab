export interface StaticEvalFixture {
  id: string;
  requiredBoundary: boolean;
}

export function fixtureRequiresBoundary(text: string): boolean {
  return text.includes("must_include_boundary: true");
}
