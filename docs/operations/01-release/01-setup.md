---
title: Release setup
type: reference
status: active
created: 2026-08-01
updated: 2026-08-01
audience: internal
description: The one-time setup a release depends on
tags:
  - domain/release
  - audience/agency-internal
  - provider/npm
  - pattern/changesets-release
related:
  - "[[INDEX|release pipeline]]"
  - "[[02-shipped-packages|shipped packages]]"
---

# Release setup

Everything a release assumes is already true. Done once per repo; if a publish fails in a way that looks structural, it is almost always something here.

Already done for this repo. Listed so you can rebuild it (or set up a new repo) and know *why* each piece exists.

1. **npm org exists.** `@kolkrabbi` is an org on npmjs.com and you're a member with publish rights. Scoped packages can't publish to a scope you don't own.
2. **GitHub Actions may open PRs.** Repo **Settings → Actions → General → Workflow permissions**: "Read and write permissions" selected **and** "Allow GitHub Actions to create and approve pull requests" **checked**. Without this the Version PR step fails with *"GitHub Actions is not permitted to create or approve pull requests."* The `permissions:` block in `release.yml` is necessary but **not** sufficient — this repo toggle is the other half.
3. **`NPM_TOKEN` secret is a 2FA-bypass token.** Repo secret `NPM_TOKEN` = an npm **Granular Access Token** with **"Bypass two-factor authentication (2FA)" checked** and **Read and Write** on the `@kolkrabbi` scope (a classic **Automation** token works too). Set it with:
   ```text
   gh secret set NPM_TOKEN --repo Tor-Grimsson/kol-ds
   ```
   > A classic **"Publish"** token is the trap — it still demands a one-time password, so CI dies with `EOTP` (see §Troubleshooting). Automation / Granular-with-bypass are the only types that work headless.
4. **`release.yml` present** — `on: push` to `main`, running `changesets/action@v1` with `version: pnpm version-packages` and `publish: pnpm release`.
5. **Private packages are marked private.** `workbench` and `showcase` have `"private": true`, so `changeset publish` skips them. `showcase` is also in `.changeset/config.json` `ignore`.
