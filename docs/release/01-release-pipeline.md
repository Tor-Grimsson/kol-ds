---
title: The release pipeline
type: playbook
status: active
updated: 2026-07-01
audience: internal
description: How to ship a new version of the @kolkrabbi/kol-* packages — the Changesets → Version PR → CI-publish loop, plus the one-time setup and the errors that bite.
providers:
  - npm
  - GitHub Actions
  - Changesets
tags:
  - domain/design-system
  - domain/workflow
  - provider/npm
  - pattern/changesets-release
related:
  - "[[06-versioning-testing|versioning & testing]]"
  - "[[05-distribution|distribution]]"
  - "[[2026-07-01-first-npm-publish|first publish log]]"
---

# The release pipeline

How a change to the KOL packages becomes a new version on npm. Once the one-time setup (§0) is in place, **every release is the same three moves: add a changeset → push → merge the auto-opened PR.** CI does the actual publishing; you never run `npm publish` by hand.

## The mental model

Three actors, each with one job:

- **Changesets** — you write a tiny markdown file declaring *"these packages, this bump, this summary."* It's a pending intent-to-release; nothing is versioned yet.
- **The Version PR** — CI reads pending changesets, bumps `package.json` versions, writes `CHANGELOG.md`s, refreshes the lockfile, and opens a PR with all of that. Merging it is your "yes, cut the release."
- **CI publish** — the merge lands the version bump on `main`; with no changesets left, CI runs `changeset publish`, which pushes anything not already on npm.

```
edit code → pnpm changeset → push → [CI opens Version PR] → merge PR → [CI publishes] → live on npm
             (you)            (you)                          (you)
```

Repo: `github.com/Tor-Grimsson/kol-ds` · scope: `@kolkrabbi` · workflow: `.github/workflows/release.yml`

## 0. Prerequisites — one-time setup

Already done for this repo. Listed so you can rebuild it (or set up a new repo) and know *why* each piece exists.

1. **npm org exists.** `@kolkrabbi` is an org on npmjs.com and you're a member with publish rights. Scoped packages can't publish to a scope you don't own.
2. **GitHub Actions may open PRs.** Repo **Settings → Actions → General → Workflow permissions**: "Read and write permissions" selected **and** "Allow GitHub Actions to create and approve pull requests" **checked**. Without this the Version PR step fails with *"GitHub Actions is not permitted to create or approve pull requests."* The `permissions:` block in `release.yml` is necessary but **not** sufficient — this repo toggle is the other half.
3. **`NPM_TOKEN` secret is a 2FA-bypass token.** Repo secret `NPM_TOKEN` = an npm **Granular Access Token** with **"Bypass two-factor authentication (2FA)" checked** and **Read and Write** on the `@kolkrabbi` scope (a classic **Automation** token works too). Set it with:
   ```
   gh secret set NPM_TOKEN --repo Tor-Grimsson/kol-ds
   ```
   > A classic **"Publish"** token is the trap — it still demands a one-time password, so CI dies with `EOTP` (see §Troubleshooting). Automation / Granular-with-bypass are the only types that work headless.
4. **`release.yml` present** — `on: push` to `main`, running `changesets/action@v1` with `version: pnpm version-packages` and `publish: pnpm release`.
5. **Private packages are marked private.** `workbench` and `showcase` have `"private": true`, so `changeset publish` skips them. `showcase` is also in `.changeset/config.json` `ignore`.

## 1. Make your change

Edit code as normal. Nothing release-specific here.

## 2. Add a changeset

From the repo root:

```
pnpm changeset
```

Interactive: pick the packages that changed, choose the bump for each (**patch** = fixes/metadata, **minor** = new features, **major** = breaking), and write a one-line summary. This writes a file under `.changeset/`.

- The summary becomes the CHANGELOG entry — write it for a consumer, not for yourself.
- You can hand-author the file instead of the prompt; it's just frontmatter (`"@kolkrabbi/kol-theme": patch`) + a summary body.
- Internal deps bump automatically: config `updateInternalDependencies: patch` means a package that depends on a bumped one gets a patch too.

## 3. Commit & push to main

```
git add .
git commit -m "Describe the change"
git push
```

The push triggers `release.yml`.

## 4. Merge the "Version Packages" PR

CI sees the pending changeset and opens a PR titled **"Version Packages"** (author: `github-actions`). Open it and confirm it:

- bumps the versions you expect,
- consumes the changeset file (deletes it),
- generates/updates the `CHANGELOG.md`s.

**Merge it.** This is the point of no return — merging is the decision to cut the release.

## 5. CI publishes — automatically

The merge lands the version-bump commit on `main`, which triggers `release.yml` again. This time there are no changesets, so the action runs `pnpm release` (`changeset publish`), which publishes every package whose local version isn't on npm yet, using `NPM_TOKEN`. Private packages are skipped.

You do nothing in this step — just watch the Actions run.

## 6. Verification

1. **Actions run is green** — the second run (the merge commit) succeeded.
2. **Registry has the new version:**
   ```
   npm view @kolkrabbi/kol-theme version
   ```
   Brand-new packages/versions can 404 for a minute or two while the registry propagates — not a failure if the publish log said success.
3. **Sync local:** the Version PR commit lives on the remote, so your working tree is one commit behind.
   ```
   git pull
   ```

## Troubleshooting

The real errors from bringing this online, and the fix for each:

| Symptom (in the Actions log) | Cause | Fix |
|---|---|---|
| `EOTP … requires a one-time password` | `NPM_TOKEN` is a classic **Publish** token (or a Granular one without "Bypass 2FA") | Regenerate as **Granular + Bypass 2FA** (or classic **Automation**); `gh secret set NPM_TOKEN`; re-run failed jobs |
| `GitHub Actions is not permitted to create or approve pull requests` | Repo toggle off | Settings → Actions → General → check "Allow GitHub Actions to create and approve pull requests" (§0.2) |
| `E403 Forbidden` on publish | Token lacks **Read/Write** on `@kolkrabbi`, or wrong scope selected | Fix the token's package/scope permission; re-set the secret |
| `ENEEDAUTH` | Token isn't reaching npm at all | Check the secret name is exactly `NPM_TOKEN` and `release.yml` wires `NODE_AUTH_TOKEN` |
| `pnpm install --frozen-lockfile` fails on the merge run | Version bump didn't refresh `pnpm-lock.yaml` | The Version PR normally updates it; if not, run `pnpm install` locally and commit the lockfile |

**Re-running:** after fixing a token/permission, you don't need a new commit — open the failed run → **Re-run jobs → Re-run failed jobs**. Versions are already bumped and unpublished, so the re-run's `changeset publish` finishes the job.

## Manual fallback (CI down / first bootstrap)

Publishing locally, bypassing CI:

```
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
