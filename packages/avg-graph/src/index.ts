import type { AvgClaim, AvgMapEdge, AvgMapNode } from "@avg/schemas";

export interface ClaimProjection {
  node: AvgMapNode;
  edges: AvgMapEdge[];
}

export function projectClaimToMapNode(claim: AvgClaim): ClaimProjection {
  return {
    node: {
      id: `node_${claim.id}`,
      type: "claim",
      label: claim.statement,
      coordinates: {
        access_mode: claim.source_refs && claim.source_refs.length > 0 ? "indirectly_accessible" : "unknown",
        language_mode: claim.language_mode,
        claim_status: claim.claim_status
      },
      map_safety: {
        known_risks: claim.risks
      }
    },
    edges: (claim.source_refs ?? []).map((sourceRef) => {
      const edge: AvgMapEdge = {
        id: `edge_${sourceRef}_${claim.id}`,
        type: "cites",
        from: sourceRef,
        to: `node_${claim.id}`,
        claim_status: claim.claim_status,
        constraints: ["source_ref_is_not_full_evidence"]
      };

      if (claim.scope) {
        edge.scope = claim.scope;
      }

      return edge;
    })
  };
}
