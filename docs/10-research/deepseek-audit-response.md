# DeepSeek Audit Response

## Scope

This note records which audit claims were confirmed against the repository state on
2026-05-20 and which were not supported by the codebase.

## Confirmed

- Root Prettier and ESLint configuration files were missing.
- A root `tsconfig.json` entry point was missing, although package-level TypeScript
  configs already extended `tsconfig.base.json`.
- Several dependency versions are no longer latest according to `pnpm outdated --recursive`.

## Not Confirmed

- The repository does have CI workflows: `.github/workflows/ci.yml` and
  `.github/workflows/ai-evals.yml`.
- The repository does have a lockfile: `pnpm-lock.yaml`.
- Runtime dependencies are not absent across the workspace. They are declared at package
  boundaries, for example `@avg/schemas` depends on `ajv`, `@avg/validation` depends on
  `@avg/schemas`, and `@avg/api` depends on `@avg/validation`.
- The project is not only documentation. It contains a minimal vertical slice for schemas,
  claim validation, graph projection, API smoke behavior, and tests.

## Decision

Do not add runtime dependencies only to satisfy a generic audit recommendation. Add runtime
dependencies when a package has an implementation that uses them.

Do not change `tsconfig.base.json` from `ES2022`/`Bundler` to `ESNext`/`NodeNext` without a
runtime migration decision. The current settings pass typecheck and are compatible with the
present package implementations.

Treat dependency upgrades as a separate maintenance task because the latest versions include
major upgrades for TypeScript, ESLint, Vitest, Zod, and `@types/node`.

## Follow-Up Candidates

- Add TypeScript-aware ESLint with `typescript-eslint` if linting beyond `tsc --noEmit` becomes
  a quality gate.
- Plan dependency upgrades package-by-package and run the full quality suite after each batch.
- Expand the graph validator proof of concept with eval fixtures before scaling architecture.
