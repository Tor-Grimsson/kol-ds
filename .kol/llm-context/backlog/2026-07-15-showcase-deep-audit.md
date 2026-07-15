# Showcase deep audit — 2026-07-15 (agent plan, not vault docs)

> **Status: open — awaiting phase-by-phase sign-off.** Findings + target architecture + 4-phase plan.
> Live execution journal: `../playbook/2026-07-15-showcase-truth-rebuild.md`.
> Surveyed: showcase/src (App, lib/registry+TopBar+component-docs+demos-registry, workshop/, sets/, usage/) · scripts/extract-*.mjs · scripts/validate-*.mjs.

**Method:** three parallel read-only sweeps (information architecture · data pipelines · presentation-vs-truth), synthesized. Constraint set by the owner: *nothing in the showcase is fixed except the base categories* (the Tier axis atoms/molecules/organisms + the closed Function set). Everything else was questioned.

## Verdict

The showcase's spine is healthy — zero orphan routes, single-sourced nav, one demo system, honest recipe framing on the Blocks/Sets index pages. Underneath it, the catalog is running on a **dead engine**: the roster derives from one frozen JSON whose miner points at nine deleted directories, so it can only rot; roughly **80 of 193 exported components never appear** (chess 14, dashboards 19, styleguide 14 — entire packages invisible); a **vendored fork** of two packages shadows the real ones (Home's "rendered live from the packages" banner is false — byte-identical today, drift-free by luck); and every hand-authored map in the registry fails **silent**, never loud. Nothing enforces any of it in CI. The site presents as "the shipped design system, documented"; it is actually the shipped DS **plus** a maintainer console (`/lobby` in the public TopBar, `/demo`), **plus** product-costumed demos, **plus** a half-migrated vendored fork.

## Findings — P0 (structural: the site lies or the machinery is dead)

| # | Finding | Evidence | Blast radius |
|---|---|---|---|
| P0-1 | **Usage miner's 9 consumer roots are all dead paths** (`kol-apparat/*`, `kol-monorepo` — repos renamed/moved to `kol-apps/*`). `walk()` swallows missing dirs, so a re-run "succeeds" and **overwrites** `usage-index.json` with an empty shell. The index is therefore frozen + hand-seeded and can never be regenerated. | `scripts/extract-usage.mjs:23-34,79` | The roster's root source is unreproducible; re-mining is forbidden by comment convention (`registry.js:229-232`) |
| P0-2 | **Miner enumerates only component + framework barrels** — chess/dashboards/content/store/styleguide/foundry exports are structurally invisible. ~80/193 exports have no roster row; even first-party `ButtonGroup` + `MediaTileGallery` (post-freeze exports) fell out. | `scripts/extract-usage.mjs:59-70` | Whole packages absent from `/components`; 34 demo files exist but render on no page |
| P0-3 | **Vendored fork shadows published packages.** `showcase/src/workshop/dashboards/` (20 files, byte-identical to `packages/dashboards` today) feeds Home's bento + 15 demos while the real package is installed and used for `MetricsDashboard` only — split-brain. `workshop/shell/` (9 files) has **materially drifted** from `kol-workshop` (package pulls ShellHeader/Drawer/SearchOverlay/Asset from other KOL packages; vendored copy doesn't). `workshop/vendor/` re-implements `SearchInput`/wordmarks/theme. | Home.jsx:9-25 · demos/Dash\*.jsx · diff vs packages/dashboards + packages/workshop | Home's "Rendered live from the packages" claim (Home.jsx:354) is **false**; drift is one edit away from visible lying |
| P0-4 | **Wrong install instructions on ~12 pages.** Frozen `pkg` attribution predates the package split: ArticleCard/WorkCard/StackHero/ParallaxShelf/… tagged `kol-component`, actually ship in `kol-content`; PriceDisplay/ProductDetailLayout/DiagonalMarqueeRiver actually in `kol-store`. | usage-index.json · ComponentPage.jsx:130 (`InstallBlock pkg`) | Users `pnpm add` the wrong package |
| P0-5 | **Nothing runs in CI.** No extract or validate script is wired into `build` or the release workflow; validators cover one package's folder hygiene + a 2-entry overlay. Every rot mode above emits zero signal. | package.json:7-19 · .github/workflows/release.yml · validate-taxonomy.mjs:18-19 | The audit's findings were all silent — and will silently recur without the gate below |

## Findings — P1 (presentation: framing and dead chrome)

| # | Finding | Evidence | Verdict |
|---|---|---|---|
| P1-1 | TopBar search is a prop-less stub in sitewide chrome — implies site search that doesn't exist (the only dead control in real chrome; recipes' inert fixtures are by-design) | TopBar.jsx:60 | Wire to `ShellSearchOverlay` over the completed roster, or remove |
| P1-2 | `/sets` erases the product-vs-recipe boundary at browse level: showcase-local assemblies (stack-blog, work-portfolio) wear the same product voice/frame as genuinely-shipped organisms (MetricsDashboard). The LOCAL-PART tagging exists but is buried deep in the detail page's composition gallery | Sets.jsx:22-26 · CollectionPage.jsx:36,53,83 · stack-blog.jsx:11 | Surface provenance (packages used · local parts count · recipe/shipped badge) on cards + previews |
| P1-3 | Maintainer tooling on the public site: `/lobby` (repo-root work-queue wall) is a first-class TopBar item; `/demo` is a dated QA page; two overlapping workshop routes (`/workshop-preview` = drifted vendored shell + fake content, `/workshop-docs` = real package, unlinked) | TopBar.jsx:26 · App.jsx:49-57 · SidebarNav.jsx:28 | Dev-flag or delete `/lobby`+`/demo` from public nav; collapse workshop routes to ONE consuming the package |
| P1-4 | Foundations token tables claim "resolves live from the theme CSS" but Surface/State color rows and mono/helper type scales are hand-copied literals (match today; latent drift) | FoundationsColor.jsx:12,121 · data/color.js:127-143 · data/typography.js:98-112 | Route every cell through the existing LiveHex/LiveValue `getComputedStyle` path |
| P1-5 | Hand-authored one-liners rot: ThemeToggle's description omits today's light-first/system-following change; Button's lists wrong variant set; Icon's "341-icon" line is dead data | registry.js:17,158,168 | Derive descriptions from component JSDoc headers, same as the API scanner |

## Findings — P2 (hygiene)

| # | Finding | Evidence |
|---|---|---|
| P2-1 | `lib/LabeledSection.jsx` — zero importers, dead vendored file | grep: no consumers |
| P2-2 | 4 dead DESCRIPTIONS keys (ButtonGroup, MediaTileGallery, MenuPopover, GRAPHICS) — described but rosterless | registry.js:55,69 |
| P2-3 | `extract-composition.mjs` promises transitive walking of 7 domain packages but can only resolve component/framework/icons names; also carries a dead barrel path (`organisms/foundry/`) | extract-composition.mjs:32,73-78,124-125 |
| P2-4 | Home hero describes ~kol-component only, understating the 11-package surface the same page renders | Home.jsx:327-331 |
| P2-5 | `workshop/metrics/` fixtures are legitimate but filed inside the misleading `workshop/` vendored folder | Home.jsx:9 |

## Coverage matrix (2026-07-15)

Exported components per package barrel vs presentation surfaces. (193 counts sub-exports; the strict component count is 164 — same conclusion.)

```
PACKAGE    | exp|roster| demo| desc|api-gen|api-hand| meta
----------------------------------------------------------
component  |  99|    82|   89|   90|     77|      60|   97
framework  |  10|     7|    7|   10|      6|       9|   10
foundry    |  18|    11|   10|   11|      4|       2|   17
chess      |  14|     0|    7|    0|      0|       0|    0
dashboards |  19|     0|   15|    0|      0|       0|    0
content    |  12|    10|   10|   10|      0|       0|    0
store      |   7|     3|    3|    3|      0|       1|    0
styleguide |  14|     0|    8|    0|      0|       0|    0
icons      |   1|     0|    0|    0|      0|       1|    0
----------------------------------------------------------
TOTAL      | 193|   113|  149|  124|     87|      72|  124
```

## Target architecture — truthful by construction

The property that ends the audit cycle: **every claim the showcase makes is either derived from package source at build time, or gated by a CI check that fails when it drifts.** Hand-authoring survives only where it's validated for completeness — absence is an error, never a default.

1. **Roster = the barrels.** A build-time enumerator parses every `packages/*/src/index.js`; the union IS the roster. Usage mining demotes to optional enrichment (fix `ROOT_DEFS` → `kol-apps/*`; missing root = hard error, not silent skip). The frozen JSON stops being load-bearing.
2. **The completeness gate (CI).** Every enumerated export must resolve to a roster row OR appear on a written exemption list (`DOCS_ONLY` · `DEPRECATED` · `MEMBER_OF` · named non-component allowlist). Anything else = red build. Wired into `pnpm build` + the release workflow. This one check converts all ~80 current silent omissions — and every future one — into unmergeable failures.
3. **Tier + Function required, all packages.** `validate:taxonomy` widens from `packages/component/src` to every package; every roster entry needs an explicit tier and function — no silent `'display'` default. Base categories unchanged (owner-fixed).
4. **No vendored copies, enforced.** Delete `showcase/src/workshop/{shell,vendor,dashboards}`; move `workshop/metrics` fixtures to `demos/_fixtures/`. CI grep: showcase demos/sets/blocks/pages import KOL components only via `@kolkrabbi/*` specifiers. Home + 15 demos repoint to `kol-dashboards`; one workshop route, consuming the package.
5. **Provenance rendered, not implied.** Set/block cards carry a derived badge (packages used · local-part count · recipe vs shipped-organism) sourced from `composition.json` — after `extract-composition` learns to resolve all package barrels (its EXPORT_MAP joins the same enumerator as #1).
6. **Prose and tokens from source.** Descriptions extracted from component JSDoc headers (DESCRIPTIONS map becomes an override layer, validated: an override for a nonexistent component = error). Every Foundations cell reads `getComputedStyle` — a literal hex/px in `data/*.js` is a lint error.
7. **Chrome is honest.** TopBar search wired to `ShellSearchOverlay` over the complete roster (the DS already ships the overlay) — or absent. `/lobby` + `/demo` behind a dev flag. Fix `InstallBlock` pkg attribution from the enumerator (P0-4 falls out automatically).

## Phased plan (each phase gated on sign-off)

| Phase | Scope | Kills |
|---|---|---|
| **1. Enumerator + gate ✅ EXECUTED 2026-07-15** | `scripts/lib/parse-barrel.mjs` (shared parser) · `showcase/src/lib/roster.js` (barrels→roster via Vite raw glob) · `classification.js` (TIERS/FUNCTIONS_BY_NAME/EXEMPT, 4-agent sweep) · `scripts/validate-roster.mjs` gated into `pnpm build` + release.yml · registry rewired (USAGE→enrichment, UNMINED deleted, pkg attribution from barrels → P0-4 fixed early) · ROOT_DEFS→`kol-apps`+`kol-website` with hard-fail, re-mined (158 components with real usage) · roster 113→185, misc=0 | P0-1, P0-2, P0-4, P0-5 |
| **2. De-fork ✅ EXECUTED 2026-07-15** | Vendored `showcase/src/workshop/` deleted (shell 9 + vendor 5 + dashboards 21 files) · Home + 15 demos → `@kolkrabbi/kol-dashboards` · metrics fixtures → `src/data/metrics/` · `/workshop-preview` deleted, `/workshop-docs` is THE route (sidebar repointed) · dead `lib/LabeledSection.jsx` deleted · new `validate:imports` gate in build + release.yml | P0-3, P1-3 (workshop half), P2-1, P2-5 |
| **3. Attribution + prose** | pkg attribution from enumerator · JSDoc-derived descriptions · live token cells | P0-4, P1-4, P1-5, P2-2, P2-4 |
| **4. Provenance + search** | Set/block provenance badges (needs composition fix, P2-3) · wire TopBar search · de-nav `/lobby`/`/demo` | P1-1, P1-2, P1-3 (nav half) |

Audits decay; when the plan executes, findings tables get struck through per phase and this doc moves to `status: superseded` with the invariants promoted into `03-components/00-taxonomy.md` and a new `00-overview` pipeline reference.
