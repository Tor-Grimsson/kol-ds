---
title: Release pipeline
type: playbook
status: active
created: 2026-07-31
updated: 2026-08-01
audience: internal
description: How to ship a new package version
providers:
  - npm
  - GitHub Actions
  - Changesets
tags:
  - domain/release
  - audience/agency-internal
  - provider/npm
  - pattern/changesets-release
related:
  - "[[02-shipped-packages|shipped packages]]"
  - "[[../06-workflows/06-versioning-testing|versioning & testing]]"
  - "[[../06-workflows/05-distribution|distribution]]"
  - "[first publish log](../../../.kol/llm-context/session-log/2026-07-01-first-npm-publish.md)"
---

# The release pipeline

How a change to the KOL packages becomes a new version on npm. Once the one-time setup (§0) is in place, **every release is the same three moves: add a changeset → push → merge the auto-opened PR.** CI does the actual publishing; you never run `npm publish` by hand.

## The mental model

Three actors, each with one job:

- **Changesets** — you write a tiny markdown file declaring *"these packages, this bump, this summary."* It's a pending intent-to-release; nothing is versioned yet.
- **The Version PR** — CI reads pending changesets, bumps `package.json` versions, writes `CHANGELOG.md`s, refreshes the lockfile, and opens a PR with all of that. Merging it is your "yes, cut the release."
- **CI publish** — the merge lands the version bump on `main`; with no changesets left, CI runs `changeset publish`, which pushes anything not already on npm.

```text
edit code → pnpm changeset → push → [CI opens Version PR] → merge PR → [CI publishes] → live on npm
             (you)            (you)                          (you)
```

Repo: `github.com/Tor-Grimsson/kol-ds` · scope: `@kolkrabbi` · workflow: `.github/workflows/release.yml`

## 1. Make your change

Edit code as normal. Nothing release-specific here.

## 2. Add a changeset

From the repo root:

```bash
pnpm changeset
```

Interactive: pick the packages that changed, choose the bump for each (**patch** = fixes/metadata, **minor** = new features, **major** = breaking), and write a one-line summary. This writes a file under `.changeset/`.

- The summary becomes the CHANGELOG entry — write it for a consumer, not for yourself.
- You can hand-author the file instead of the prompt; it's just frontmatter (`"@kolkrabbi/kol-theme": patch`) + a summary body.
- Internal deps bump automatically: config `updateInternalDependencies: patch` means a package that depends on a bumped one gets a patch too.

## 3. Commit & push to main

```text
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

From the CLI, without leaving the terminal:

```text
gh pr list                             # find the PR number (first column, e.g. #5)
gh pr merge 5 --merge --delete-branch  # merge it; no '#' — that's a shell comment
```

- Use **`--merge`** (keep the release commit intact), not `--rebase`. `--squash` also works.
- **`--delete-branch`** removes the throwaway `changeset-release/main` head branch — it does **not** touch `main` (that's the base).
- No number = acts on the current branch's PR. If `gh pr list` opens a pager, quit it with **`q`**.

## 5. CI publishes — automatically

The merge lands the version-bump commit on `main`, which triggers `release.yml` again. This time there are no changesets, so the action runs `pnpm release` (`changeset publish`), which publishes every package whose local version isn't on npm yet, using `NPM_TOKEN`. Private packages are skipped.

You do nothing in this step — just watch the Actions run.

## 6. Verification

0. **Bump [[02-shipped-packages|SHIPPED-PACKAGES.md]]** — the canonical package/version table ships with the batch; update its versions as part of every publish.
1. **Actions run is green** — the second run (the merge commit) succeeded.
2. **Registry has the new version:**
   ```bash
   npm view @kolkrabbi/kol-theme version
   ```
   Brand-new packages/versions can 404 for a minute or two while the registry propagates — not a failure if the publish log said success.
3. **Sync local:** the Version PR commit lives on the remote, so your working tree is one commit behind.
   ```text
   git pull
   ```

## Elsewhere

| Page | What it holds |
|---|---|
| [[01-setup\|Release setup]] | The one-time prerequisites — tokens, repo settings, the CI workflow |
| [[02-shipped-packages\|Shipped packages]] | Every package and its version, updated by this ritual |
| [[03-troubleshooting\|Troubleshooting]] | What breaks, the manual fallback, token maintenance |
