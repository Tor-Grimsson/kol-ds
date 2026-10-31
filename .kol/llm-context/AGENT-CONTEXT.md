# kol-design-system — Agent Context

Current state, roadmap, gotchas, and contracts. Read with `ARCHITECTURE.md`.

## What this is

The maintenance home + npm host + showcase for the KOL design system. See `ARCHITECTURE.md` for the load-bearing decisions.

## Later — user ideas, not scheduled

- **Which rail a brand site wears** (2026-10-22, earmarked). `apps/brand-hub` is on `AppHub`, the app rail; `apps/site-hub` (2026-10-24) is the site rail's reference beside it, and `apps/shell` shows both rails on one set of pages. The specimens exist; the call is his, his session.
- **Phasing out Right Grotesk** (2026-10-31, parked). He wants to compare a replacement: Schibsted Grotesk or another Google face, and a plain system-like sans (Inter, Noto Sans, Montserrat, Red Hat Display/Text; Proxima Nova is Adobe Fonts, not Google). The tool already exists: the Figma library's `13-ui-font` sheet switches six fonts by the `ui-font` mode (Inter · Geist · IBM Plex Sans · Public Sans · Noto Sans · Montserrat) — add Schibsted Grotesk and Red Hat as modes there; the `type` collection's Right Grotesk / Schibsted modes switch every text style at once. A pick becomes a kol-theme `--kol-font-family-sans*` change and its own session.
- **Custom categories on the Group-by page** (2026-09-30). `/components/group-by` is where categories get defined, not just picked: any rule can be a category (e.g. *every atom whose name has "search"*), including user-made ones kept for the session and shown in the left rail. Its own session.

## 🏁 Current state (2026-10-31 evening — the Figma library from the code, metric on KOL, the Menu family)

- **Published** kol-component 0.320–0.328 · kol-theme 0.202–0.209 · kol-dashboards 0.6.0–0.7.1 · kol-framework 0.68.0 · kol-shell 0.92–0.96 · kol-icons 0.54–0.55. The Menu* family (Menu, MenuTrigger, MenuPanel, MenuRow/Label/Divider/Flyout, MenuFilter/DatePicker/More; MenuDropdown* are aliases), Dropdown `variant="raised"`, Modal `variant` lift|bordered, Button `bare`, SectionText `variant` (was `level`) + `lede`, NavRail `variant="top"`, DocumentHeader, apps/metric (the reference dashboard, nine logged rounds).
- **Figma library** (n48kE2bJtrFjl7wxst30xH) built from the code, W1–W32 in `plan-2026-10-31-figma-library.md`: `ink-roles` collection (role = the node's mode), `tone` collection, breakpoint type sizes, 27-document-system, application pages, Code Connect on everything. **Rule: a look/API change lands in Figma the same turn** (memory). Log: `session-log/2026-10-31-figma-library-metric-rebuild-menu-family.md`.

## Current state (2026-10-31 — LayoutGroup, its Figma pages, HomeDockRound4)

- **Published** kol-framework 0.66.0 (DocumentIndex moved here, `variant="table"`) · kol-styleguide 0.19.0 (`./layout`: LayoutType with the `faces` UI-font view, LayoutColor, LayoutLogo, LayoutText, LayoutGuide; BlockType, BlockSwatch, CardLogo aliases; IconBrowser) · kol-shell 0.95.0 (dock: + off the surface, ··· in the pill opening the + card, slot hover). Figma pages 14–21 plus the layout-type and layout-color collections; the library is unpublished (his click). LayoutGroup and HomeDockRound4 are closed with receipts. Open: move the dock hover into TabsRow when kol-ds-ui-2d frees kol-component; Code Connect for the new components. Log: `session-log/2026-10-31-layout-group-figma-pages-home-dock.md`.

## Current state (2026-10-30 night — float rounds, sign-in over Home, GrowthLineStage)

- **Published** kol-component 0.317.7–0.319.0 · kol-theme 0.200.6 / 0.201.0 · kol-shell 0.91.0 / 0.91.1 · kol-foundry 0.15.0 · kol-growth 0.1.0 (new engine package): DocsToc rail children, TextPressure intro, provisional float (`variant="float"`, AppFloatNav, AccountForm, sign-in over Home), GrowthLineStage. Float style is still under review as artifacts (round 3 is the latest); FloatingStyleAndSignInDemos stays 🟠. Log: `session-log/2026-10-30-float-style-rounds-sign-in-and-growth-line.md`.

## Current state (2026-10-30 later — MediaLibrary Columns dock, the Get Info modal)

- **Published** kol-component 0.317.5 / 0.317.6 · kol-theme 0.200.5: ColumnBrowser `previewPlacement` (`dock` default in MediaLibrary), ⌘I as a Get Info modal in Quick Look's frame, the file preview capped at 32vh. ColumnPreviewDocked, MediaGetInfoModal, MediaGetInfoFileBody closed with receipts. Open: Type lab review; BrandLabToolWindow and ClaudeListIconSet wait for him. Log: `session-log/2026-10-30-media-library-columns-dock-and-get-info.md`.

## Current state (2026-10-30 — the Brand Lab to approval, the icon rounds, two website tickets)

- **Published** kol-icons 0.53.3–0.53.5 (lock/unlock, shuffle, the harmony set on Adobe's constructions, `color-wheel` · `color-palette` · `color-swatch` from Figma) · kol-theme 0.200.3 / 0.200.4 · kol-component 0.317.3 / 0.317.4 (TabsRow `variant` + `type="mono" | "sans" | "mono-light"`, the oq ink ladder, the plain Dropdown in ColorPickerPopover, MediaLibrary `previewFrame` · `settingsKey` · `infoKey` · `columnFolderInfo`) · kol-styleguide 0.18.3 / 0.18.4 (the contrast rail on SettingsSections, KOL vector forms on the stage, Combo and Lockup fixes). Log: `session-log/2026-10-30-brand-lab-review-icons-and-tickets.md`.
- **Rulings:** `variant` is the one word for a look (`look` and `preset` were agent drift); every icon round is BUILT by `~/.claude/skills/app-icon/bin/propose.cjs` with `"glyphs": true` from a spec (kol-icon skill `example-spec.json`), never drawn; a glyph fills one of the three keyline rectangles and a pair's parts never move between states but the one that opens; lobby tickets go to background agents, never the main thread; the Brand Lab's header is two groups — the four generators, then Guide and Export.
- **Open:** the Type lab review; BrandLabToolWindow closes when he calls the review done; ClaudeListIconSet waits for him.

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

*(Historical — the changeset queue was superseded by direct `pnpm publish`; see SHIPPED-PACKAGES for live versions.)* **8 changesets were staged (held):** the original 4 (loader icon-inventory, social icons, component `defaultOpen`, menu-unify) + 4 from the 2026-07-02 backlog execution (input-uncontrolled-fix, segmented-toggle-chrome, copy-button-atom, taxonomy-restructure). One batched publish when the user unparks it.

**(Closed) The 2026-07-02 backlog was EXECUTED in full** (`session-log/2026-07-02-backlog-execution-phases-0-6.md`): all A/B/C/D/E items closed or gated — showcase bugs fixed (versioned theme boot kills the dark leak for good), Input/Button/SegmentedToggle/CopyButton package fixes staged, `primitives` dissolved under the new `docs/taxonomy/01-component-placement.md` rules (`pnpm validate:taxonomy` green), D1/D2 render source-mined (`pnpm extract:docs`) + react-docgen API tables merged into ApiTable, brand Swatch ported (`showcase/src/lib/Swatch.jsx`), E3 scan reported (`.kol/llm-context/backlog/2026-07-02-brand-extraction-scan.md`), shell verdict recorded in `docs/shells/01-reference-shells.md`. *(That review pass and the changeset queue are moot — publishing moved to direct `pnpm publish` and every item shipped; see SHIPPED-PACKAGES.)* (E3 closed 2026-07-03 — LabeledSection ported to `showcase/src/lib/LabeledSection.jsx`, the other 22 candidates reasoned-rejected; blocks/sets split shipped — see the 2026-07-03 session log.) NB the systemic lesson SegmentedToggle taught: Tailwind never generates utilities from package sources — component chrome belongs in kol-theme CSS (`.kol-seg*` is the pattern).

## Workbench (2026-06-26) — isolated component dev, live

`workbench/` is a new **consumer-tier Ladle app** for developing components in isolation, stood up end-to-end. `pnpm workbench` serves it. Stories live in `workbench/src` and import the packages **by name** (`@kolkrabbi/*`) — packages untouched, nothing new in the published tarballs. **Decoupled from the Path A/B decision above**: depends only on the public specifiers, so it survives either outcome. Plan + worklog: `migration/2026-06-26-workbench-adoption.md`, `session-log/2026-06-26-workbench-ladle-standup.md`.

Toolchain: Ladle bundles **Vite 6** (repo is Vite 8) — isolated to the package, verified working with Tailwind v4 + React 19. New story **files** need a server restart to register (HMR handles edits). Opens in **dark** by default (matches KOL's `data-theme="dark"`). **Coverage: all 50 components / 125 stories** — every one verified rendering clean (full build + runtime sweep). Usage walkthrough: `workbench/01-using-the-workbench.md`; story convention: `workbench/README.md`. Stage is **centred**; `args`-driven **Controls (live prop knobs) not yet added** — next up.

## Hard blockers — all cleared (2026-07-01) 🎉

- **Published to npm** — `@kolkrabbi/kol-{theme,loader,component,framework}` are live at **0.1.1** (0.1.0 first-published manually, 0.1.1 via CI). Verified resolvable. KOL is publicly installable. (`session-log/2026-07-01-first-npm-publish.md`)
- **Version control + GitHub** — repo git-initialised, `.gitignore` hardened (`build/`, `.playwright-mcp/`, `.env*`, `.npmrc`), security scan clean, pushed. Fonts (~17 MB) tracked — LFS later if bloat bites.
- **CI release pipeline — proven end-to-end (2026-07-01).** `pnpm changeset` → push → merge the auto-opened "Version Packages" PR → CI publishes. 0.1.1 went out this way. *(Historical — superseded by direct `pnpm publish`; `release.yml` retired 2026-09-22.)*

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
