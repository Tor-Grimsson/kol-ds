# kol-design-system — Agent Context

Current state, roadmap, gotchas, and contracts. Read with `ARCHITECTURE.md`.

## What this is

The maintenance home + npm host + showcase for the KOL design system. See `ARCHITECTURE.md` for the load-bearing decisions.

## Current state (2026-07-16)

- **🏁 MILESTONE: the website leg — four theme releases + three lobbies (2026-07-16, latest).** The DS side of the two-repo mandate is CLOSED: theme **0.9.2** (auto-dark deleted — **standing USER law: light-first until migration completion**; an agent-closed held-for-user ruling was overruled, lesson codified) → **0.9.3** (`.kol-prose` on the kol-opacity text roles) → **0.10.0** (**Display Tight tier** — `kol-display-lg/-section/-section-sm/-subsection`, lobbied verbatim, own token ladder) → **0.11.0** (fontviewer chrome; `--fv-*` conformance flagged in `packages/foundry/COMPONENTS.md`) · **component 0.12.0** (FoundryCTA, the centered tier of the two-variant CTA family) · **foundry 0.5.0** (fontviewer engine + GlyphItem at `./engine`). All user-pushed, consumer-verified; gates 5/5, roster 216; kol-specimen npm-deprecated (flag live). apps/web is zero-elder outside its workshop joint scope. Website ledger carry parked in `_tmp/DS-CHANGES-2.0.md`: 2.8/2.9/2.10. Capstone: `session-log/2026-07-16-MILESTONE-website-leg-publish-waves.md`.

- **✅ Chess 0.4.1 + theme 0.9.1 — palette pawns + amber sidelines (2026-07-15, night).** User live-testing brief 3.0 caught the mock-era palette (rook…rook mirror, NO pawn → removed pawns unrecoverable) → palette is now the six real piece types; armed cell = `.chess-palette--armed`; sideline notation moves = `.kol-btn.chess-notation-sideline` (theme-aware amber via color-mix). Published + consumer-verified same night. **▶ NEXT SESSION: the website leg** (user clearing context for it) — to-dos in `playbook/2026-07-15-two-repo-handoff.md`, noting theme is now **0.9.1** not the 0.8.0 the handoff says. Detail: `session-log/2026-07-15-chess-0-4-1-palette-amber.md`.

- **✅ SHIPPED-PACKAGES canon + 🔀 TWO-REPO MANDATE (2026-07-15, closing).** The package list was buried/scattered → **`docs/operations/SHIPPED-PACKAGES.md`** is now THE canonical table (15 packages + versions; wired one-click from docs front door, both indexes, 00-overview; release ritual step 6.0 = bump it every publish). **User mandate: the agent works kol-ds-ui + kol-website (`~/dev/projects/kol-website`) DIRECTLY — no more human-mediated `_tmp` ledgers.** Website/chess consumer to-dos + constraints live in `playbook/2026-07-15-two-repo-handoff.md` (boot the website's own agent context on entry; npm bumps gate on the user's push here). Batch cleared + gated, user pushing. Detail: `session-log/2026-07-15-shipped-packages-two-repo-mandate.md`.

- **✅ Label-family kill + icons-v1 completion + public-at-root law (2026-07-15, night, final leg).** User caught legacy `kol-label-mono-xs` in the article/work gallery blocks → the whole 7-class `.kol-label-*` family DELETED from the theme (2 package users migrated: SectionLabel — whose lg was a ghost `kol-heading-md` rendering 16px — and FeaturedCarousel; callers re-authored caps). His second catch: the six "missing" v1 icons all existed in the legacy trees → normalized in (panel-right, cut, library, pointer, type, foundation) + consumers restored to real semantics; **zero legacy-set warnings from packages** (v1 = living design language, v2 only on a language break — user can overrule). JetBrains true 400i/600i declared (consumers need the 2 woff2s on bump). **ONE `public/` at repo root = ARCHITECTURE §7** (showcase/workbench point via Vite `publicDir`). Gates green; **batch cleared, user pushing: component 0.11.0 · chess 0.3.0 · framework 0.5.0 · content 0.4.0 · theme 0.8.0 (⚠ removes kol-label-*) · icons 0.7.0 · foundry 0.4.2 · workshop 0.1.6.** Detail: `session-log/2026-07-15-label-family-kill-icons-v1-public-root.md`.

- **🚩 Sidenav epic — OPEN, waits on the USER's scoping doc.** He flagged the sidenav family as wrong/incomplete (2026-07-15); surface captured at `backlog/2026-07-15-sidenav-epic.md` — **don't redesign from the note alone.** (The rest of that ledger-2.0 session is closed/shipped — its "auto-dark RULED KEPT" line was **overruled by the user**, see the 0.9.2 entry above; detail: `session-log/2026-07-15-ledger-2.0-loop-sidenav-flag.md`.)



## Current state (2026-07-10)

- **📁 REPO MOVED/RENAMED → `~/dev/projects/kol-ds-ui`** (was `kol-apparat/kol-design-system`). Sibling source repos also renamed: design-editor→**kol-ds-fxr**, typefaces→**kol-ds-type**, and the client/brand repos live under `kol-apps/*` + `kol-website/`. (The broken-symlink install blocker was cleared 2026-07-15.)

- *(Older entries — the 07-15 brief-3.0 chess-interactivity arc (`session-log/2026-07-15-brief-3-board-input-sidelines.md`), the 07-15-late-evening preview-truth audit + website ledger + brief 2.0 (`session-log/2026-07-15-preview-truth-ledger-brief-2.0.md`), the 07-15-evening chess-DS-conformance + 100dvh stage arc (`session-log/2026-07-15-chess-conformance-stage.md`), the 🏁 showcase-truth-rebuild MILESTONE (roster-from-barrels, 3 CI gates, ⌘K — see `session-log/2026-07-15-MILESTONE-showcase-truth-rebuild.md`), the 07-15-morning raid-batch publish + ThemeToggle/theme-default fixes, the 07-10 overnight brand raid, and the 07-09 arc — trimmed per the 5-entry cap; see `session-log/2026-07-15-batch-publish-themetoggle-theme-default-fix.md`, `session-log/2026-07-10-overnight-brand-raid-buckets-abcd.md` and the 2026-07-09 session logs.)*

- **Deployed at https://ds.kolkrabbi.io (Vercel) — gotcha:** Root Directory = **repo root, NOT `showcase/`** (packages resolve via `workspace:*`, only from the workspace root). Preset Vite · build `pnpm build` · output `showcase/dist`. Detail: `session-log/2026-07-03-readme-overhaul-vercel-deploy.md`.
- **Live npm versions (2026-07-16, verified on the registry):** theme **0.11.0** · component **0.12.0** · foundry **0.5.0** · chess **0.5.0** (brief-4.0 archive all/month scopes) · framework **0.5.0** · content **0.4.0** · icons **0.7.0** · workshop **0.1.6**. Older tier: brand **0.1.2** · styleguide **0.1.0** · brand-template **0.2.0** · store **0.1.1** · dashboards/media-client/scrape **0.1.0**. Canonical table: `docs/operations/SHIPPED-PACKAGES.md`. Publish mode is still **push == publish** (zero changesets); local `pnpm publish --no-git-checks` also works OTP-free (granular token in `~/.npmrc`). **Recurring trap:** editing package source without bumping = same-version/different-content vs npm — always bump with the edit. New-package note: first publish can lag the registry read-path a few minutes (styleguide took ~4). `kol-loader@0.3.0` orphaned on npm — deprecate → kol-icons when ready.
- **Execution plan lives at `.kol/llm-context/plan.md`** (moved from `backlog/` on user instruction; all references repointed). Phases 0–6 executed; its banner items all closed (E3 2026-07-03, publishes long since shipped) — historical document, no open threads.

## Repo standup (2026-06-15)

Repo stood up and verified:

- **packages/** — `@kolkrabbi/kol-{theme,loader,component,framework}`, re-split from the recent single-app source into the published 4-package topology. All publishable: `private:false`, `0.1.0`, `publishConfig.access:public`, peers declared, `workspace:*` for internal deps.
- **showcase/** — Vite app consuming the packages via `workspace:*`. Now a **shadcn-style docs presentation**: routes `/` (Home), `/components` (grouped overview grid), `/components/:slug` (per-component page — Preview/Code tabs + copy, install/import, mined usage, prev/next). Sidebar generated from a registry (`showcase/src/lib/registry.js`) that joins `usage-index.json` + live `DEMOS` + descriptions. New presentation files: `lib/ComponentPreview.jsx`, `lib/registry.js`, `pages/ComponentDoc.jsx`. *Not re-built/smoke-tested since this change — HMR-ready; validate live.*
- **Usage reference** — `scripts/extract-usage.mjs` mined 3762 files across 9 consumer roots → 52/55 components have real, attributed examples. Output in `docs/usage/*.md` + `showcase/src/usage/usage-index.json`.
- **Release infra** — changesets configured (`.changeset/`), CI publish workflow at `.github/workflows/release.yml`, initial changeset staged.
- **Benchmark** — `docs/benchmark/INDEX.md` (type: audit): full shadcn⇄KOL comparison + prioritized gaps. Headline: KOL is a design-tool system, shadcn a web-app system. Top KOL gaps — (1) no behavior/a11y primitive layer, (2) no `cn()`/`asChild`, (3) missing web-app staples (Tabs/Card/Alert/Toast/Skeleton/Progress/Dialog), (4) sRGB not OKLCH. KOL moat — opacity token scale, color/transparency + numeric-inspector controls, icon/graphic loaders, mined usage.

## Showcase (2026-07-01) — rebuilt as a shadcn-style docs site

The "does the hand-built showcase earn its keep?" question is effectively answered by investing in it: `showcase/` is now a **shadcn-style docs site** with ONE data-driven pipeline, not a bespoke per-page reimplementation. Architecture (see `session-log/2026-07-01-showcase-shadcn-rebuild`):

- **`lib/DocLayout.jsx`** — the shadcn chrome (top bar + component sidebar + centred content + TOC), shared by every component page.
- **`pages/ComponentPage.jsx`** — the generic component doc at `/components/:slug`, rendered from `registry` + `DEMOS` + `DOC_DATA`. No per-component page files.
- **`demos/*.jsx`** (45) + **`lib/demos-registry.js`** — the **one-file demo** model (shadcn): each demo rendered for Preview AND shown as its own `?raw` source for Code → can't drift. Replaced the old render + hand-typed `code`.
- **`lib/component-docs.js`** — `DOC_DATA` (usage/examples/api per component, props from real source). 43 entries.
- Pages: **Home** (shadcn hero + live bento wall), **Foundations** (live token reference on `.kol-grid`/`.kol-swatch`), **Icons**/**IconsVariants** (ported from the brand app — `SegGroup` + `ContentFilters`).
- **Deleted** the scaffolding (`demos.jsx`, `ComponentPreview`, `BadgeDoc`, `OneFileDemos`, `ComponentDoc`) + dead routes. Pages now: Home, Components, ComponentPage, Foundations, Icons, IconsVariants.

**Drift is now cornered to one file** — `component-docs.js` API tables (hand-authored). Everything else (previews, code, icon inventory) renders from source. Durable fix: generate API tables via `react-docgen`. **Path B / src-first (`migration/2026-06-18-src-first-restructure.md`) remains the open structural option** — the packages-outside-`src` boundary is the underlying driver, but the app-level fix (one page / one chrome / one demo system) removes the day-to-day drift.

**2026-07-02 — "one system, five parts"** (see `session-log/2026-07-02-one-system-five-parts`, after the earlier feedback sweep the same day): the showcase's presentation architecture, grounded in shadcn/Carbon/Material research. **(C) Demo stage contract** — `lib/DemoStage.jsx`; demos export `stage = 'hug'|'sm'|'md'|'lg'|'full'`, the stage owns layout, demos own only usage; all ~50 swept. **(D) Content contract** — `DocHeader`/`DocSection`/`ApiTable`/`PreviewCard`; PageSection retired from all showcase pages; `wide` = same centred column, higher cap. **(A) Flat taxonomy** — sidebar/index is flat A→Z (new components slot alphabetically, never reorder); closed function set (`action…utility`) as filter chips/badges only. **(B) Docs section** — `/docs/shell-and-layout`; `Layout`/`AppShell`/`ScrollToTop` are `DOCS_ONLY` (out of the components list), composition diagrammed, **SideNav renders live** (+ own component page). **(E) Blocks** — `/blocks` with 3 composed seeds (Inspector panel / Filter bar / Settings form), same one-file mechanics. Menus demo open via new `defaultOpen`; favicon scheme-aware; `docs/shells/01-reference-shells.md` logs both shells + blocks concept.

**2026-07-02 later passes** (see `session-log/2026-07-02-review-fixes-and-monorepo-ports`): review fixes (selection restored via showcase opt-in over kol-framework's global `user-select:none`; **light theme default** via index.html boot script; TOC rail always reserved; **categories restored** in sidebar/index with A→Z within groups — flat-only was over-rotation; waterfall index with capped cards; Docs in TopBar; prev/next pager). **Menu family unified:** `MenuPopover` = deprecated alias of `MenuItem` (identical APIs; floating-ui implementation wins) + `/docs/menus` standards page. **Three monorepo ports, verbatim (imports-only adapted):** workshop shell → `/workshop-preview` (standalone chrome, ⌘K search, right-rail TOC + quick actions); chess board + pieces + CSS → Blocks (`chess.js` dep, showcase-local); brand-app color/typography reference → `/foundations/color` + `/foundations/typography` (live token tables). Chess apparatus + metrics dashboards deferred (context-entangled / live APIs). Packaging direction: chess ≠ kol-component; workshop shell → kol-framework candidate **after the shell comparison** (both shells now live side-by-side — that comparison is the next decision, then TopBar alignment).

⚠️ **8 unpublished changesets staged (held):** the original 4 (loader icon-inventory, social icons, component `defaultOpen`, menu-unify) + 4 from the 2026-07-02 backlog execution (input-uncontrolled-fix, segmented-toggle-chrome, copy-button-atom, taxonomy-restructure). One batched publish when the user unparks it.

**▶ PICK UP HERE — the 2026-07-02 backlog was EXECUTED in full** (`session-log/2026-07-02-backlog-execution-phases-0-6.md`): all A/B/C/D/E items closed or gated — showcase bugs fixed (versioned theme boot kills the dark leak for good), Input/Button/SegmentedToggle/CopyButton package fixes staged, `primitives` dissolved under the new `docs/taxonomy/01-component-placement.md` rules (`pnpm validate:taxonomy` green), D1/D2 render source-mined (`pnpm extract:docs`) + react-docgen API tables merged into ApiTable, brand Swatch ported (`showcase/src/lib/Swatch.jsx`), E3 scan reported (`.kol/llm-context/backlog/2026-07-02-brand-extraction-scan.md`), shell verdict recorded in `docs/shells/01-reference-shells.md`. **Waiting on the user:** review pass and unparking the 8-changeset publish. (E3 closed 2026-07-03 — LabeledSection ported to `showcase/src/lib/LabeledSection.jsx`, the other 22 candidates reasoned-rejected; blocks/sets split shipped — see the 2026-07-03 session log.) NB the systemic lesson SegmentedToggle taught: Tailwind never generates utilities from package sources — component chrome belongs in kol-theme CSS (`.kol-seg*` is the pattern).

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
- **Fonts are a consumer contract, not shipped** — the theme typography CSS references brand fonts at absolute `/fonts/…` paths. The packages do **not** bundle font files; the consuming app must serve them from `/fonts/`. This repo carries them in the root `public/fonts/` (~17 MB; ONE public at root per ARCHITECTURE §7 — apps point via Vite `publicDir`); a consumer without them falls back to system fonts. Noted in the theme README.

## Contracts

- Package public API = each package's `src/index.js` (or the theme barrel). Don't break exports without a changeset + major bump.
- `workspace:*` is replaced with the real version at publish time by changesets — never hand-write versions into internal deps.
- **Fonts** — served by the consumer at `/fonts/`, never bundled in `@kolkrabbi/kol-theme` (see Gotchas).
