# RentSecure-App CI Pipeline Plan

## Source of Truth

Mirror the stage-based, fast-fail structure from `RentSecureBE/.github/workflows/ci.yml`.
Adapt Python/Django jobs to the Expo/React Native/TypeScript stack.

---

## Stack Summary

- Runtime: Expo SDK ~57 (React Native 0.86, React 19)
- Language: TypeScript ~6.0 (strict mode enabled)
- Package manager: npm
- Test runner: Jest (bundled with Expo)
- Lint: ESLint via `expo lint`
- Bundler: Metro (via Expo)
- Deployment target: EAS Build / App Store / Play Store

---

## Proposed Stages

### Stage 1: Lint Fast (Fast-Fail)

Runs on every push and PR.

| Job              | Tool       | Command                                    |
| ---------------- | ---------- | ------------------------------------------ |
| `pre-commit`     | pre-commit | `npx pre-commit run --all-files`           |
| `lint-eslint`    | ESLint     | `npx expo lint`                            |
| `typecheck`      | TypeScript | `npx tsc --noEmit`                         |
| `prettier-check` | Prettier   | `npx prettier --check "src/**/*.{ts,tsx}"` |
| `npm-audit`      | npm audit  | `npm audit --audit-level=high`             |

### Stage 2: Tests

Runs in parallel after Stage 1 passes.

| Job         | Tool             | Notes                             |
| ----------- | ---------------- | --------------------------------- |
| `test`      | Jest             | Run all tests with coverage       |
| `e2e-smoke` | Detox / Expo E2E | Optional smoke test if configured |

### Stage 3: Security

Runs in parallel after Stage 1 passes.

| Job                 | Tool      | Notes                           |
| ------------------- | --------- | ------------------------------- |
| `trivy-fs`          | Trivy     | Filesystem vulnerability scan   |
| `semgrep`           | Semgrep   | OWASP + React Native / TS rules |
| `trivy-secrets`     | Trivy     | Secret scanning                 |
| `dependency-review` | GH Action | License + vuln check on PRs     |

### Stage 4: Build Verification

Runs after Stage 2 passes.

| Job                | Tool        | Notes                      |
| ------------------ | ----------- | -------------------------- |
| `web-build`        | Expo web    | Verify web export succeeds |
| `typecheck-bundle` | tsc + Metro | Optional bundle size check |

### Stage 5: Quality Gate

Aggregates results after Stages 2-4 pass.

| Job       | Tool              | Notes                                  |
| --------- | ----------------- | -------------------------------------- |
| `quality` | ESLint + coverage | Enforce coverage threshold (e.g., 70%) |

### Stage 6: Deploy Readiness

Runs after quality passes.

| Job                | Tool  | Notes                                   |
| ------------------ | ----- | --------------------------------------- |
| `deploy-readiness` | Shell | Verify `eas.json`, app config, env vars |

### Stage 7: Deploy

Runs only on push to main/master after deploy-readiness passes.

| Job      | Tool      | Notes                    |
| -------- | --------- | ------------------------ |
| `deploy` | EAS Build | Trigger production build |

---

## Reusable Workflows

- `.github/workflows/lint.yml` → `lint-fast` caller
- `.github/workflows/test.yml` → Jest runner
- `.github/workflows/security.yml` → Trivy, Semgrep, dependency-review
- `.github/workflows/security-deep.yml` → CodeQL, Scorecard, Trivy deep scan
- `.github/workflows/quality.yml` → Coverage aggregation + quality gate
- `.github/workflows/deploy-readiness.yml` → Config validation
- `.github/workflows/deploy.yml` → EAS production deploy
- `.github/workflows/sbom.yml` → SBOM generation + Grype/OSV scanning
- `.github/workflows/benchmark.yml` → Bundle size + build time benchmarks
- `.github/workflows/rollback.yml` → Mobile rollback procedure
- `.github/workflows/runtime-measurement.yml` → CI runtime measurement
- `.github/workflows/ci-metrics.yml` → CI metrics collection
- `.github/workflows/branch-protection-validator.yml` → Branch protection validation
- `.github/workflows/nightly.yml` → Nightly security deep scan
- `.github/workflows/weekly.yml` → Weekly SBOM, benchmark, rollback drill
- `.github/workflows/ci.yml` → Main orchestration

---

## Not Ported from RentSecureBE

- `django-check.yml` (no Django)
- `architecture.yml` / `import-linter` (no Python package architecture)
- `uml.yml` / `uml-validation.yml`
- `contract-tests.yml` (no DRF API contracts)
- `mutation.yml` (no Python mutation testing; could add StrykerJS later)
- `hypothesis.yml` (no Python Hypothesis)
- `migration-rollback.yml` (no DB migrations)
- `performance.yml` / `load-test.yml` (could add React Native perf tests later)
- `checkout-diagnostic.yml` (diagnostics utility)
- `architecture-guard.yml` (Python architecture guard)

---

## Additional Adaptations from RentSecureBE

- `security-deep.yml` — CodeQL for JS/TS, OpenSSF Scorecard, Trivy deep scan
- `sbom.yml` — npm SBOM via CycloneDX, Grype + OSV scanning
- `benchmark.yml` — Bundle size + build time measurement
- `rollback.yml` — EAS rollback procedure
- `runtime-measurement.yml` — CI runtime telemetry via GitHub API
- `ci-metrics.yml` — CI metrics summary + PR comment
- `branch-protection-validator.yml` — Validates branch protection rules
- `nightly.yml` — Nightly deep security scans
- `weekly.yml` — Weekly SBOM, benchmark, rollback drill

---

## File Layout

```
rentsecure-app/
  .github/
    workflows/
      ci.yml
      lint.yml
      test.yml
      security.yml
      security-deep.yml
      quality.yml
      deploy-readiness.yml
      deploy.yml
      sbom.yml
      benchmark.yml
      rollback.yml
      runtime-measurement.yml
      ci-metrics.yml
      branch-protection-validator.yml
      nightly.yml
      weekly.yml
    actions/
      setup-node/
        action.yml
```
