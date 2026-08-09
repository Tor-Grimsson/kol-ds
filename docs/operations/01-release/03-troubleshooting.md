---
title: Release troubleshooting
type: reference
status: active
created: 2026-08-01
updated: 2026-08-01
audience: internal
description: What breaks in a release, and the fix
tags:
  - domain/release
  - audience/agency-internal
  - provider/npm
  - pattern/changesets-release
related:
  - "[[INDEX|release pipeline]]"
  - "[[02-shipped-packages|shipped packages]]"
---

# Release troubleshooting

The failures this pipeline actually produces, the manual path when CI is down, and the maintenance the tokens need.

The real errors from bringing this online, and the fix for each:

| Symptom (in the Actions log) | Cause | Fix |
|---|---|---|
| `EOTP … requires a one-time password` | `NPM_TOKEN` is a classic **Publish** token (or a Granular one without "Bypass 2FA") | Regenerate as **Granular + Bypass 2FA** (or classic **Automation**); `gh secret set NPM_TOKEN`; re-run failed jobs |
| `GitHub Actions is not permitted to create or approve pull requests` | Repo toggle off | Settings → Actions → General → check "Allow GitHub Actions to create and approve pull requests" (§0.2) |
| `E403 Forbidden` on publish | Token lacks **Read/Write** on `@kolkrabbi`, or wrong scope selected | Fix the token's package/scope permission; re-set the secret |
| `ENEEDAUTH` | Token isn't reaching npm at all | Check the secret name is exactly `NPM_TOKEN` and `release.yml` wires `NODE_AUTH_TOKEN` |
| `pnpm install --frozen-lockfile` fails on the merge run | Version bump didn't refresh `pnpm-lock.yaml` | The Version PR normally updates it; if not, run `pnpm install` locally and commit the lockfile |

**Re-running:** after fixing a token/permission, you don't need a new commit — open the failed run → **Re-run jobs → Re-run failed jobs**. Versions are already bumped and unpublished, so the re-run's `changeset publish` finishes the job.

## Manual fallback

Publishing locally, bypassing CI:

```bash
npm login                 # or a token in ~/.npmrc via: npm config set //registry.npmjs.org/:_authToken=<TOKEN>
pnpm version-packages     # consume changesets → bump versions, rewrite workspace:* , write changelogs
git commit -am "Version packages"
pnpm release              # changeset publish; enter the OTP if 2FA prompts
git push --follow-tags
```

Skip `version-packages` (and delete the changeset) if you want to publish the current versions as-is.

## Maintenance notes

- **The token expires.** Granular tokens have a mandatory expiry — the release will start failing when it lapses. Rotate it (regenerate, re-set the secret).
- **Tighten the token on next rotation.** The current `NPM_TOKEN` also carries Organizations Read/Write (over-scoped). Least-privilege is Packages Read/Write on `@kolkrabbi` + Bypass 2FA, Organizations `No access`.
