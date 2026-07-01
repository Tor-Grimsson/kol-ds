# kol-design-system — Agent Context

Current state, roadmap, gotchas, and contracts. Read with `ARCHITECTURE.md`.

## What this is

The maintenance home + npm host + showcase for the KOL design system. See `ARCHITECTURE.md` for the load-bearing decisions.

## Current state (2026-06-15)

Repo stood up and verified:

- **packages/** — `@kolkrabbi/kol-{theme,loader,component,framework}`, re-split from the recent single-app source into the published 4-package topology. All publishable: `private:false`, `0.1.0`, `publishConfig.access:public`, peers declared, `workspace:*` for internal deps.
- **showcase/** — Vite app consuming the packages via `workspace:*`. Now a **shadcn-style docs presentation**: routes `/` (Home), `/components` (grouped overview grid), `/components/:slug` (per-component page — Preview/Code tabs + copy, install/import, mined usage, prev/next). Sidebar generated from a registry (`showcase/src/lib/registry.js`) that joins `usage-index.json` + live `DEMOS` + descriptions. New presentation files: `lib/ComponentPreview.jsx`, `lib/registry.js`, `pages/ComponentDoc.jsx`. *Not re-built/smoke-tested since this change — HMR-ready; validate live.*
- **Usage reference** — `scripts/extract-usage.mjs` mined 3762 files across 9 consumer roots → 52/55 components have real, attributed examples. Output in `docs/usage/*.md` + `showcase/src/usage/usage-index.json`.
- **Release infra** — changesets configured (`.changeset/`), CI publish workflow at `.github/workflows/release.yml`, initial changeset staged.
- **Benchmark** — `docs/benchmark/INDEX.md` (type: audit): full shadcn⇄KOL comparison + prioritized gaps. Headline: KOL is a design-tool system, shadcn a web-app system. Top KOL gaps — (1) no behavior/a11y primitive layer, (2) no `cn()`/`asChild`, (3) missing web-app staples (Tabs/Card/Alert/Toast/Skeleton/Progress/Dialog), (4) sRGB not OKLCH. KOL moat — opacity token scale, color/transparency + numeric-inspector controls, icon/graphic loaders, mined usage.

## Open decision (2026-06-18) — does the hand-built showcase earn its keep?

Unresolved, and it gates all further showcase work. The host pages here keep drifting off-brand because they're a **parallel hand-built re-implementation** of a gallery the brand app already has. `kol-monorepo/apps/brand` is already the on-brand component gallery (PageSection / ContentFilters / `/components` + `/demo`), built on the same packages. This "source of truth" repo has a worse showcase than its own downstream consumer.

Two live paths — pick one before more showcase work:

- **Path A — consolidate onto the brand app.** This repo does its one non-redundant job (publish `@kolkrabbi/kol-*`); the brand app is the showcase. Kill or thin the hand-built showcase here. **Contradicts §6 — flag before acting.**
- **Path B — src-first restructure (user's current direction).** Keep the repo + showcase but move the DS into `src/` consumed via `@kolkrabbi/*` aliases, with `packages/` *generated* for npm. Removes the drift + `@source` friction at the root (Tailwind scans `src/` natively; host pages built against live local source like the brand app). Concrete plan: `../migration/2026-06-18-src-first-restructure.md`.

2026-06-18 session brought `Components`/`ComponentDoc`/`ComponentPreview` onto KOL classes + `PageSection`/`.kol-page` to stop the bespoke-Tailwind drift, but the user rejected the whole approach mid-fix. That work is real but **may be moot** under either path. Decide direction first — see `session-log/2026-06-18-*`.

## Workbench (2026-06-26) — isolated component dev, live

`workbench/` is a new **consumer-tier Ladle app** for developing components in isolation, stood up end-to-end. `pnpm workbench` serves it. Stories live in `workbench/src` and import the packages **by name** (`@kolkrabbi/*`) — packages untouched, nothing new in the published tarballs. **Decoupled from the Path A/B decision above**: depends only on the public specifiers, so it survives either outcome. Plan + worklog: `migration/2026-06-26-workbench-adoption.md`, `session-log/2026-06-26-workbench-ladle-standup.md`.

Toolchain: Ladle bundles **Vite 6** (repo is Vite 8) — isolated to the package, verified working with Tailwind v4 + React 19. New story **files** need a server restart to register (HMR handles edits). Opens in **dark** by default (matches KOL's `data-theme="dark"`). **Coverage: all 50 components / 125 stories** — every one verified rendering clean (full build + runtime sweep). Usage walkthrough: `workbench/01-using-the-workbench.md`; story convention: `workbench/README.md`. Stage is **centred**; `args`-driven **Controls (live prop knobs) not yet added** — next up.

## Hard blockers — all cleared (2026-07-01) 🎉

- **Published to npm** — `@kolkrabbi/kol-{theme,loader,component,framework}` are live at **0.1.1** (0.1.0 first-published manually, 0.1.1 via CI). Verified resolvable. KOL is publicly installable. (`session-log/2026-07-01-first-npm-publish.md`)
- **Version control + GitHub** — repo git-initialised, `.gitignore` hardened (`build/`, `.playwright-mcp/`, `.env*`, `.npmrc`), security scan clean, pushed. Fonts (~17 MB) tracked — LFS later if bloat bites.
- **CI release pipeline — proven end-to-end (2026-07-01).** `pnpm changeset` → push → merge the auto-opened "Version Packages" PR → CI publishes. 0.1.1 went out this way. **The release flow from here on is: add a changeset, push, merge the PR.**

### Loose ends / notes
- **Repo URL** — fixed + shipped in **0.1.1** (`repository.url` ×4 + component README now point at `github.com/Tor-Grimsson/kol-ds`). Only the orphaned **0.1.0** carries the old dead link.
- **CI setup gotchas (for reference / other repos):** required (a) repo Settings → Actions → "Allow GitHub Actions to create and approve pull requests" ON (else the Version PR can't be opened), and (b) `NPM_TOKEN` = a **Granular token with "Bypass 2FA" checked + Read/Write on `@kolkrabbi`** — a classic "Publish" token throws `EOTP` in CI.
- **Token cleanup (next rotation):** current `NPM_TOKEN` is over-scoped with Organizations Read/Write — tighten to `No access` on Orgs (packages R/W + bypass-2FA is all publishing needs). Granular tokens expire → rotation will be needed.

⚠️ **Local tree is behind `main`** — the "Version Packages" commit (0.1.1 bumps) is on GitHub, not local. `git pull` before new work.

## Gameplan (2026-06-26, updated 2026-07-01) — pick up here

Sequence: ~~**1.** workbench Controls (`args` knobs)~~ (still open, polish) → **2.** `git init` + `.gitignore` + commit + push ✅ **done (2026-07-01, on GitHub)** → **3.** prove external install: `npm pack` → fresh Vite app → render ✅ **done (2026-07-01) — clean** → **4.** real `changeset publish` ✅ **done (2026-07-01) — 0.1.0 live on npm** → **5.** showcase = `ladle build` vs a polished catalog (open fork; lean to the Ladle build) ← **next** → **6.** write the 4-point contract into every package README. The past consume-pain = KOL's unwritten **4-point consumer contract** (cascade order / `@source` at package `src` / React dedupe / fonts at `/fonts/`), now **proven** by the step-3 install test. Detail: `session-log/2026-07-01-prove-external-install-npm-pack.md`.

## Roadmap

- Migrate `kol-monorepo` and the ~25 consumer apps onto the published `@kolkrabbi/kol-*` versions (deprecate the local copies — §2).
- Deploy the showcase (GitHub Pages / Vercel).
- Expand live demos to overlay/menu/Table components (currently only ~25 of 55 have previews); add per-component **props/API tables** (data extractable from package source — see benchmark Rec 4).
- Act on benchmark recommendations: a11y baseline + shared behavior hooks; add `cn()`/tailwind-merge + `asChild`.

## Gotchas

- **Tailwind v4 `@source` is a hard consumer requirement** — KOL packages ship raw JSX, and Tailwind's auto-detection skips `node_modules`, so utility classes used *inside* KOL components never get generated unless the consumer adds `@source "../node_modules/@kolkrabbi/kol-*/src"` to their CSS. Without it the framework chrome (SideNav etc.) renders unstyled. The showcase's `index.css` carries this; it belongs in the package READMEs too (still undocumented there).
- **Cascade order** (§5) — never reorder the CSS imports.
- **Vite-only loader** — `import.meta.glob`; the packages assume a Vite consumer.
- **Re-mining usage** — re-run `node scripts/extract-usage.mjs` after consumer apps change; it reads sibling repos under `~/dev/projects` by absolute path (`ROOT_DEFS` in the script).
- **Showcase bundle is large** (~6.5 MB) — the loader eagerly globs all 341 icons for the gallery. Fine for the showcase; real consumers tree-shake what they import.
- **Fonts are a consumer contract, not shipped** — the theme typography CSS references brand fonts at absolute `/fonts/…` paths. The packages do **not** bundle font files; the consuming app must serve them from `/fonts/`. The showcase carries them in `showcase/public/fonts/` (~17 MB); a consumer without them falls back to system fonts. Noted in the theme README.

## Contracts

- Package public API = each package's `src/index.js` (or the theme barrel). Don't break exports without a changeset + major bump.
- `workspace:*` is replaced with the real version at publish time by changesets — never hand-write versions into internal deps.
- **Fonts** — served by the consumer at `/fonts/`, never bundled in `@kolkrabbi/kol-theme` (see Gotchas).
