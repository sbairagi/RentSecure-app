# Security Audit Report — RentSecure Mobile

Generated: 2026-08-04

## Already Implemented

- ✅ **Harden Runner** — `step-security/harden-runner` with `egress-policy: block` in every job across all workflows.
- ✅ **SARIF upload gating** — Security scan results only uploaded for same-repo PRs in `security.yml`, `security-deep.yml`.
- ✅ **Concurrency** — `ci.yml`, `nightly.yml`, `weekly.yml` have concurrency groups.
- ✅ **Top-level permissions** — `ci.yml`, `runtime-measurement.yml`, `ci-metrics.yml`, `quality.yml` have explicit `permissions:` blocks.
- ✅ **Least-privilege per-job permissions** — `security.yml` and `security-deep.yml` apply `security-events: write`, `contents: read`, `actions: read` to scan jobs.
- ✅ **OIDC readiness** — `id-token: write` declared in `security-deep.yml`.
- ✅ **Dependabot** — `.github/dependabot.yml` configured for `npm` and `github-actions` ecosystems, `direct` dependencies only, weekly schedule.
- ✅ **Gitleaks allowlist** — `.gitleaks.toml` allowlists CI test key patterns and mobile build artifacts.
- ✅ **Pre-commit hooks** — `.pre-commit-config.yaml` and `lint.yml` job.
- ✅ **Secret handling** — `.env.example` documented; secrets denied in `.kilo/kilo.jsonc`.

## Missing

### Critical

| #   | Finding                                          | Risk | Files                          | Details                                                                               |
| --- | ------------------------------------------------ | ---- | ------------------------------ | ------------------------------------------------------------------------------------- |
| 1   | **No third-party action pins to commit SHAs**    | High | All workflow files             | Zero actions are pinned to immutable commit SHAs. Supply-chain risk via tag mutation. |
| 2   | **`deploy.yml` runs with placeholder EAS token** | High | `.github/workflows/deploy.yml` | If workflow triggers without valid `EAS_TOKEN`, build fails or leaks metadata.        |

### High

| #   | Finding                                 | Risk | Files                                 | Details                                                                      |
| --- | --------------------------------------- | ---- | ------------------------------------- | ---------------------------------------------------------------------------- |
| 3   | **Unverified remote script execution**  | High | `.github/workflows/security-deep.yml` | Scorecard and other tools fetched from remote without checksum verification. |
| 4   | **Mutable Docker tag in SBOM workflow** | High | `.github/workflows/sbom.yml`          | `ghcr.io/google/osv-scanner:latest` — mutable tag can be replaced.           |

### Medium

| #   | Finding                                                | Risk   | Files                                                                                                                                                                                                                      | Details                                                                                       |
| --- | ------------------------------------------------------ | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| 5   | **16 workflows without explicit `permissions:` block** | Medium | `.github/workflows/test.yml`, `sbom.yml`, `weekly.yml`, `benchmark.yml`, `nightly.yml`, `rollback.yml`, `deploy-readiness.yml`, `lint.yml`, `branch-protection-validator.yml`, `runtime-measurement.yml`, `ci-metrics.yml` | Default `GITHUB_TOKEN` scopes may include `packages: write`.                                  |
| 6   | **`GITHUB_TOKEN` leaked in error output**              | Medium | `.github/workflows/runtime-measurement.yml`                                                                                                                                                                                | If token unavailable, error prints exact `curl -H 'Authorization: token ...'` command to log. |

## Risk Level

Overall repository risk: **LOW** — All critical and high-risk findings should be remediated.

## Needs Improvement

- Consider pinning reusable internal actions (`.github/actions/*`) to specific commit SHAs if they are consumed outside this repository.
- Consider adding `eas.json` with production build profiles.
- Consider adding native `.gitignore` entries for Xcode/Android Studio caches if not already present.
