import { validateClaimContract } from "@avg/validation";

export interface HealthResponse {
  status: "ok";
  service: "avg-api";
}

export function health(): HealthResponse {
  return {
    status: "ok",
    service: "avg-api"
  };
}

export function validateClaimRequest(body: unknown) {
  return validateClaimContract(body);
}
