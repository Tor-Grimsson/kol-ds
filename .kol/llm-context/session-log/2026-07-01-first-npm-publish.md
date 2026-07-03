---
title: First npm publish — @kolkrabbi/kol-* 0.1.0 live
type: log
status: archived
updated: 2026-07-01
description: Published all four @kolkrabbi/kol-* packages at 0.1.0 to npm and pushed the git tags. The last human-gated blocker is cleared — KOL is publicly installable.
tags:
  - domain/design-system
  - domain/distribution
repo: kol-design-system
related:
  - "[[session-log/2026-07-01-prove-external-install-npm-pack|install proof]]"
  - "[[session-log/2026-07-01-git-prep-security-scan-gitignore|git prep]]"
---

# Session: First npm publish — @kolkrabbi/kol-* 0.1.0 live

**Date:** 2026-07-01
**Agent:** Grim (Opus 4.8)
**Summary:** Gameplan step 4 — published `@kolkrabbi/kol-{theme,loader,component,framework}@0.1.0` to npm via `changeset publish`, pushed the four git tags. The last human blocker (npm auth) is cleared.

## What was done
- Deleted the staged changeset so the public debut is a clean **0.1.0** (not the minor-bumped 0.2.0).
- `pnpm release` → `changeset publish`. All four published; changesets created + `git push --follow-tags` pushed the four `@kolkrabbi/kol-*@0.1.0` tags.
- Added `.npmrc` to `.gitignore` (token-leak guard).

## Auth story (for next time / CI)
- First attempt E403'd: the account enforces **2FA on writes**, and `changeset publish` is non-interactive. Resolved by completing npm's **browser web-auth** prompt mid-publish.
- **CI implication:** because it needed a browser click, the token in use still enforces 2FA — CI (`release.yml`) will NOT work until an **Automation / Granular (2FA-bypass) token** is set as the `NPM_TOKEN` repo secret. Step 8 is not yet satisfiable with the current token.

## Known issues / follow-ups
- **Repo URL mismatch (baked into 0.1.0):** all four `package.json` `repository.url` = `github.com/kolkrabbi/kol-design-system`, but the real remote is **`github.com/Tor-Grimsson/kol-ds`**. npm "Repository" links on 0.1.0 404. Decide canonical home, then fix the fields (and the README/workflow refs) for the next version. No republish of 0.1.0.
- **Registry propagation:** at publish time the read endpoints still 404'd for the new packages (write confirmed by the CLI `+ pkg@version` + success list). Brand-new-package lag; confirm resolved at `npmjs.com/package/@kolkrabbi/kol-theme`.

## Update (same day) — CI proven, 0.1.1 shipped
Closed both follow-ups in one CI release: fixed `repository.url` ×4 (+ component README) and pushed it through the pipeline as **0.1.1**, which also proved CI end-to-end. Two setup snags, both fixed: GitHub Actions needed "Allow … create and approve pull requests" ON (to open the Version PR), and the `NPM_TOKEN` had to be a **Granular token with "Bypass 2FA" checked + R/W on `@kolkrabbi`** — a classic "Publish" token throws `EOTP` in CI. All four now live at **0.1.1** (verified). The release flow is now: `pnpm changeset` → push → merge the auto-opened Version PR.

## Next steps
- **Token hygiene (next rotation):** current `NPM_TOKEN` over-scoped with Organizations R/W → tighten to `No access` on Orgs. Granular tokens expire → rotate.
- `git pull` locally — the 0.1.1 version-bump commit is on `main` (remote), not local.
- Remaining gameplan: step 5 (showcase = `ladle build` vs polished catalog), step 6 (write the 4-point consumer contract into every package README).
