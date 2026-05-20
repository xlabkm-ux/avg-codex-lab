import {
  type AvgClaim,
  type ClaimStatus,
  type LanguageMode,
  type ValidationResult,
  validateClaim
} from "@avg/schemas";

export interface ClaimValidationReport {
  schema: ValidationResult;
  accepted: boolean;
  status?: ClaimStatus;
  languageMode?: LanguageMode;
  risks: string[];
  boundaryNotes: string[];
}

export function validateClaimContract(value: unknown): ClaimValidationReport {
  const schema = validateClaim(value);

  if (!schema.valid) {
    return {
      schema,
      accepted: false,
      risks: ["schema_contract_violation"],
      boundaryNotes: ["Claim cannot enter the map until it satisfies the JSON Schema contract."]
    };
  }

  const claim = value as AvgClaim;
  const risks = new Set(claim.risks);
  const boundaryNotes: string[] = [];

  if (claim.language_mode === "metaphor" && claim.claim_status !== "metaphor_only") {
    risks.add("metaphor_as_fact");
    boundaryNotes.push("Metaphorical language must be marked as metaphor_only before it is treated as a map claim.");
  }

  if (claim.claim_status === "hypothesis" && !claim.scope) {
    risks.add("missing_scope");
    boundaryNotes.push("Hypotheses need an explicit scope so AVG does not present a working map as Reality.");
  }

  return {
    schema,
    accepted: risks.size === claim.risks.length,
    status: claim.claim_status,
    languageMode: claim.language_mode,
    risks: [...risks],
    boundaryNotes
  };
}
