---
title: Showcase recovery — audit findings and the quarantine roadmap
type: plan
status: active
updated: 2026-07-30
description: The 2026-07-30 showcase review, run to ground. Twenty-two defects traced to source with file and line, grouped into five root causes, then the quarantine-and-readmit roadmap — the sidebar empties, and each category is readmitted only against a written rule and a user check.
aliases:
  - showcase-recovery
  - quarantine-roadmap
tags:
  - domain/design-system
  - domain/workflow
  - pattern/app-shell
related:
  - "[[../documentation/04-compositions/02-shells|shells and rails]]"
  - "[[../documentation/03-components/02-placement|component placement]]"
  - "[[../documentation/01-foundations/04-layout-breakpoints|layout & breakpoints]]"
  - "[[SHIPPED-PACKAGES|shipped packages]]"
---

# Showcase recovery — audit findings and the quarantine roadmap

Every defect raised in the 2026-07-30 review, traced to a file and a line. Nothing here is a guess; where a cause was not found it says so.

The headline: **almost none of this is a missing feature.** The wordmark exists, the icons page exists, the components index exists, the width law exists, the rail law exists, the tag taxonomy exists. They are overridden, bypassed, or hash-randomised by code that was written next to them without reading them. That is why a roadmap rather than a bug list — the failure is a process one, and the fix has to be procedural.

## 1. What is actually wrong

### 1.1 The WORKSHOP wordmark was never deleted — it was overridden

`packages/workshop/src/shell/ShellLayout.jsx:127` still renders `<Asset name="wordmark-workshop">` as the package default, and the asset is present at `packages/brand/src/svg/wordmark-workshop.svg`, auto-registered by the glob in `packages/brand/src/svg/AssetLoader.jsx:17`.

The showcase passes its own `brand` node — `showcase/src/lib/ShellChrome.jsx:150` → `ShowcaseBrand` at `:88-99` — whose second mark is a typed `<span className="kol-mono-14 tracking-[0.2em]">KOL DS</span>` at `:95`. The comment above it claims "KOL DS has no drawn wordmark asset yet". A drawn wordmark did exist; it was the workshop one, and it was displaced by text that wraps to two lines in the header.

### 1.2 Tag colours are assigned by a string hash

`packages/workshop/src/engine/doc-helpers.js:86-94`:

```js
const TAG_COLORS = ['blue', 'teal', 'green', 'yellow', 'red', 'orange', 'purple', 'dark']
export const getTagColor = (tag) => {
  let hash = 0
  for (let i = 0; i < tag.length; i++) hash = ((hash << 5) - hash + tag.charCodeAt(i)) | 0
  return TAG_COLORS[Math.abs(hash) % TAG_COLORS.length]
}
```

`#domain/design-system` is yellow and `#domain/iconography` is green because of where their character sums land, not because they mean anything. A closed tag taxonomy with ten top-level namespaces already exists at `.kol/docs-framework/03-tag-taxonomy.md:23-37` — `project/ domain/ audience/ provider/ integration/ pattern/ brand/ editor/ archive/ framework/`. Colour belongs to the namespace; nothing consults it.

The chip fills themselves are palette tokens (`packages/theme/kol-components-molecules.css:284-301`, `var(--kol-palette-*)`) — but the **graph** re-implemented the palette as eight raw hexes at `packages/workshop/src/tags/TagGraph.jsx:123-133`. **Correction to my first pass:** I wrote that none of those were KOL palette values. They all were — `#3740D3` is `--kol-palette-blue`, `#66a44c` is green, `#ffe32e` is yellow. They are hand-typed transcriptions, correct the day they were written and frozen since, so a retuned palette would move every chip and leave the graph behind. Wrong diagnosis, real defect. The chip ink is also a hardcoded `#121215`, repeated seven times.

**Fixed 2026-07-30 evening.** `getTagColor` now resolves the tag's **namespace** against the taxonomy (`domain/` blue, `pattern/` purple, `provider/` orange, and so on), with the hash kept only as a fallback for tags outside it. The graph reads `var(--kol-palette-*)` instead of copies.

### 1.3 The frontmatter panel is filtering for a foreign dialect

`packages/workshop/src/docs/DocsFrontmatter.jsx:17`:

```js
const FIELD_ORDER = ['title', 'category', 'date', 'tags', 'modified']
```

`category`, `date` and `modified` belong to the **workshop-sample** dialect (`showcase/src/pages/workshop-sample/0.0.1-getting-started.md`). No kol-docs vault document carries them. The filter at `:30` therefore admits `title` and `tags` and nothing else — hence two rows.

The parser is innocent: `packages/workshop/src/engine/frontmatter.js:6-41` keeps every key, and `build-inventory.js:36,49` attaches the whole object. So `type`, `status`, `updated`, `description`, `related`, `aliases`, `sources`, `verified` all arrive at the panel and are discarded at render. The framework requires the first five on every doc (`.kol/docs-framework/01-conventions.md:49-57`), and all 46 vault docs carry them.

**Three unrelated metadata dialects are live at once:**

| Surface | Shape | Where |
|---|---|---|
| Vault docs (46 `.md`) | kol-docs YAML — title/type/status/updated/tags/description/related/aliases/sources | `docs/**` |
| Component pages (66 `.mdx`) | `export const meta = { id, slug }` — nothing else | `showcase/src/docs/components/*.mdx` |
| Sets and Blocks (30 `.jsx`) | `meta = { title, description, category, featured }` | `showcase/src/{sets,blocks}/*.jsx` |

Sets and Blocks are **not markdown at all** — they are JSX modules whose registries read four fields (`sets-registry.js:16-30`, `blocks-registry.js:16-31`). That is why they show no frontmatter: there is none to show. The MDX pages show `id` and `slug` because that is genuinely all they carry — the one-shot codemod that generated them wrote a URL-identity schema and was never kept in `scripts/`.

### 1.4 The rail law exists and the code breaks it three ways

`docs/documentation/04-compositions/02-shells.md:78` states it plainly: *"the right TOC rail wears the LEFT tree's exact idiom — `shell-nav-item kol-mono-14` rows — and EVERY rail section label is the `kol-doc-eyebrow` voice."*

What actually renders in the right rail (`packages/workshop/src/docs/DocumentationReader.jsx`):

| Section | Row class | Left indent |
|---|---|---|
| On this page | `kol-mono-12` via `DocsToc.jsx:39-41` | 0 |
| Related | `shell-nav-item … kol-mono-14` at `:53` | 20px (`kol-components-workshop.css:202`) |
| Quick actions | `shell-sidebar-action kol-mono-14` at `:70-86` | 0 |
| Tags | `<Tag variant="naked">` | n/a |

Three row idioms in one rail, directly under a comment at `:50` that reads `{/* ONE rail voice (user law) */}`. That is the indent mismatch in the screenshots.

The left rail has its own split: group headers are `kol-helper-14` (500 weight, line-height 1, 0.06em tracking) and tree items are `kol-mono-14` (400 weight, 18px line-height, no tracking) — `ShellSidebar.jsx:106` and `:131`. The Showcase group shows mostly headers, the Components group mostly items, so the same component renders two type ramps side by side. A third branch at `ShellSidebar.jsx:78` gives the "Documentation" label `kol-helper-10 text-meta` instead of `kol-doc-eyebrow`, purely because that mount passes no `labelTo` (`ShellChrome.jsx:118`).

### 1.5 Nothing was deleted — a grid defect halves the page

`showcase/src/pages/Icons.jsx` and `showcase/src/pages/Components.jsx` both exist, are complete, and render. Verified live: `/icons` produces **165 icons across 26 groups**, `/components` produces **188 published components · 169 with live previews** across 16 sections. The roster parses **207 rows**. Routes are wired at `App.jsx:60-61`. The icons page still carries the size ramp (`Icons.jsx:25` — `[16, 20, 24, 32, 48, 64, 128]`), the keyline-grid overlay (`:99` → `icon-controls.jsx:11-31`) and the light/dark toggle (`:97`).

**What makes them look blank is the shell's own grid.** `ShellLayout.jsx:87` declares the third (TOC) column only at `xl`, but `:48` renders `TocColumn` at `hidden lg:block`. Between **1024px and 1279px** there are three visible children in a two-column grid, so the TOC wraps to an implicit second row and `h-full` splits the height between rows. Measured at 1100×900 on `/components`: `grid-template-rows: 373px 373px` — the `<main>` gets 373px of a 900px window and the TOC sits below the nav rail. You see a header and a sliver.

It mounts on every page, including ones with no TOC, because `ShellLayout.jsx:78` does `hasToc = Boolean(effectiveTocContent)` — `defaultTocContent` is the `<AutoToc/>` *element*, which is always truthy even when `AutoToc` returns `null` (`ShellChrome.jsx:67`).

The sidebar rows are a **second, separate** defect: `SHELL_ROUTES` declares `icons` and `components` without a `children` array (`shell-nav.js:34-35`), and `ShellSidebar.jsx:104-108` makes a childless group header toggle-only. It spins a chevron (rendered unconditionally at `:110-114`) over a body that renders nothing (`:122`) and shows no count (`:117-119`). Three affordances promising a thing that does not exist — but they are not why the page looked empty.

Two live conditions worth knowing: `/components` logs `Encountered two children with the same key, 'atoms'`, and **four dev servers are running concurrently** (5323, 5324, 5325, 5326) — an old tab is a stale module graph.

### 1.6 Width: the shell itself has no frame

`packages/theme/kol-theme.css:75-88` states the law and names its own failure mode:

> ONE frame, three inner caps (chess law). Every page: `mx-auto max-w-shell` + the one padding rhythm, content LEFT-ANCHORED inside. … panel caps tables / code / framed panels … **a hardcoded `max-w-[Npx]` at a call site means this scale failed; file it, don't improvise it.**

`--kol-content-shell: 1800px` · `--kol-content-panel: 960px` · `--kol-content-column: 768px` · `--kol-content-measure: 65ch`. Restated in `01-foundations/04-layout-breakpoints.md:55-58`, `05-layout-systems.md:42`, `08-breakpoints/01-breakpoints.md:33-45` and `04-kol-ds-rules.md:49`. A canonical container class exists — `.kol-page`, `kol-framework.css:140-144` — and **zero showcase pages use it.**

**The root cause is one line.** `packages/workshop/src/shell/ShellLayout.jsx:186`:

```jsx
<div className="h-full w-full px-4 md:px-5 lg:px-6">
```

No `max-w`, no `mx-auto`, and Tailwind padding steps (16/20/24px) where the law specifies the ramp tokens (20/32/48px). Measured live at viewport 2200: grid **2152px**, main column **1576px**, page inset **24px** where the token says 48px. The frame is 352px past the 1800 law and grows without limit. The only capped path in the entire app is embed mode (`ShellChrome.jsx:137`) and `pages/Home.jsx:360`.

Everything downstream is a symptom of that:

| Surface | Capped? | Where |
|---|---|---|
| MDX doc tables | yes — panel | `mdx-components.jsx:60` |
| Component preview figure | yes — panel | `PreviewCard.jsx:28` |
| Foundations swatch grid | **no** | `Foundations.jsx:45-143` — bare fragment |
| Foundations colour tables | **no** | `FoundationsColor.jsx:109` — bare `<Table>` |
| Typography table | **no** | `FoundationsTypography.jsx:132` — bare `<Table>` |
| Components index | **no** | `Components.jsx:102` — 4-column waterfall across the full column |
| Block viewer | **no** | `BlockViewer.jsx:125` — measured 1574px |
| Collection landing | **no** | `CollectionLanding.jsx:124` hardcoded `px-5`, centred (breaks left-anchor); `:143` nests a *second* shell cap inside the shell's own column, so it can never bind |

Two dead hardcodes also survive: `DocumentationReader.jsx:379` `max-w-[1400px]` (the 1400 tier was killed at theme 0.11.22) and `TagModeOverlay.jsx:37` `max-w-[864px]`.

### 1.7 Two preview cards for one job

| | `PreviewCard.jsx` (57 lines) | `BlockViewer.jsx` (219 lines) |
|---|---|---|
| Used by | `/components/:slug`, every MDX doc | `/blocks/:slug`, `/sets/:slug`, both landings |
| Measured width | **960px** | **1574px** |
| Radius | 4px — the radius law | 8px `--kol-radius-md` — breaks it |
| Seam | `var(--kol-oq-08)` `:30` | `border-fg-12` `:125` |
| Tab labels | authored `Preview` / `Code` `:16-17` | lowercase strings + `capitalize` `:127-136` |
| Code tab | `<CodeBlock bare>` `:53` — the one-code-idiom | bespoke `<pre>` `:213` — contradicts it |
| Extras | none | description row, 3 device sizes, fullscreen, reload, source-path Button |

Same job, two implementations, two widths, two border tokens, two radii, two code renderers, two ways of casing a tab label. `PreviewCard`'s own header comment claims "one card, everywhere". His observation that only one instance is width-limited is exactly right, and it is the one that read the law.

Three further framed-preview chromes diverge again — `CollectionPage.jsx:38-55` (`border-fg-08`, radius-sm, `min-h-[96px]`), `Components.jsx:44-58` (`border-fg-12`, radius-sm, `max-h-56`), and a third tab-button idiom at `component-page-parts.jsx:112-119`. `PreviewCard` also applies the `.kol-doc-figure` *class* to a plain `<div>` instead of using the packaged `DocFigure` (`DocKit.jsx:61-68`), so that component's caption slot is unreachable.

### 1.8 ExitPreview

It is a `react-router` `Link` to `/` wearing CMS draft-mode chrome — `packages/component/src/atoms/ExitPreview.jsx`, twelve lines. It is an atom because the placement test is purely structural: *"Atom — nests no KOL component"* (`docs/documentation/03-components/02-placement.md:27`), and the 2026-07-02 sweep recorded the call explicitly at `:60`. So by the written rule it is correctly placed.

The rule is the wrong question. Nothing asks whether a Sanity preview escape hatch belongs in a **published design-system package** at all. That is a *membership* test, and the taxonomy has none — this roadmap adds one.

Its demo card looks empty because `packages/framework/kol-framework.css:486-490` gives it `position: fixed; bottom: 24px; left: 24px; z-index: 9999`. It escapes the preview card and lands in the corner of the viewport — the floating black `×` in the screenshots. Same rule carries `text-transform: uppercase` at `:502`, against the standing no-auto-casing law.

### 1.9 The node graph

It exists — `packages/workshop/src/tags/TagGraph.jsx`, d3 force-directed, mounted through `TagModeOverlay.jsx:126-135` → `TagModeGate.jsx:12` → `showcase/src/App.jsx:78`.

To reach it: open a vault doc at `/documentation/<id>`, click a tag pill, then click the polygon icon at the overlay's top-left. It is unreachable in practice because the gate wraps **only** `/documentation/:docId`, the graph button is gated on `hasFilters` so it is absent from the DOM until a tag is active (`TagModeOverlay.jsx:33,39`), and any route change closes tag mode (`TagModeContext.jsx:63-67`). There is no route, no nav entry and no shortcut.

### 1.10 The second search

`buildShellSearchItems` (`shell-nav.js:95-122`) feeds the ⌘K palette with components, surfaces and vault docs. The tag overlay ships its own unrelated "Search tags…" field (`TagModeOverlay.jsx`). Two search surfaces, neither aware of the other.

## 2. The five root causes

| # | Cause | Evidence |
|---|---|---|
| 1 | **Override instead of read** | the wordmark; both preview cards; three rail idioms under a "ONE rail voice" comment |
| 2 | **Dangling classes and foreign dialects** | `FIELD_ORDER` filtering for `category`/`date`/`modified`; tag classes that shipped before their CSS |
| 3 | **Improvised values where a scale exists** | hash-assigned tag colours; eight raw hexes in the graph; `#121215` ×7; uncapped tables |
| 4 | **Affordances that promise nothing** | childless group headers with chevrons and no navigation; a graph with no entry point |
| 5 | **No membership test** | placement decides *where* a component goes, never *whether* it belongs in a published package |

## 3. The roadmap — quarantine, then readmit against a rule

His instruction: *"remove everything from the sidebar into a quarantine zone, and reimport it based on RULES, one by one, asking me to check after each category import."*

That is the right shape, and it fits the machinery already here. The sidebar is not a hand-written list — `showcase/src/lib/roster.js:34-58` derives it from the package barrels at build time, and `classification.js` is the hand-authored layer `pnpm validate:roster` already checks for completeness. Quarantine is therefore **an admission gate on the derived roster**, not a file move: everything starts out, and a category comes back only when its rule is written and he has looked at it.

### Phase 0 — freeze and write the rules (no UI change)

Nothing renders differently. Four rule documents get written and approved before any readmission:

1. **Membership** — what earns a place in a published package. The test placement never asked. Settles ExitPreview.
2. **Rail** — one row idiom, one label voice, one indent, both rails. Supersedes the prose at `02-shells.md:78` with enforceable class names.
3. **Width** — which cap applies to which content kind, written as the wrapper each surface must use. The tokens exist; the mapping does not.
4. **Metadata** — one dialect. Either MDX and sets carry kol-docs frontmatter, or the panel is honest about carrying three schemas.

### Phase 1 — quarantine

The roster gains an explicit `admitted` set. Anything absent renders in a `/quarantine` holding page rather than the sidebar. The sidebar empties to the four rule docs and the quarantine page. Ugly and short-lived, and it is the only state where readmission means anything.

### Phase 2 — readmit, one category at a time

Order runs foundations-first because everything downstream references it:

| # | Category | Gate before it returns |
|---|---|---|
| 0 | **The shell frame** | `ShellLayout.jsx:186` gains the cap and the ramp; the `lg`/`xl` TOC-column mismatch fixed; `hasToc` stops being always-true. Nothing else can be judged until the frame is right. |
| 1 | Foundations (tokens, colour, type) | width rule applied; tables at panel; no page-local hexes |
| 2 | Icons | sidebar row navigates; size ramp and toggles verified live. **The icon *mode* toggle cannot return as-was** — the stroke/solid/svg sets were deleted and `Icon`'s `variant` prop removed at kol-icons 0.8.0; the legacy SVGs sit in `_tmp/legacy-icons/`, this machine only. |
| 3 | Documentation (vault) | frontmatter panel renders the real contract; tag colour by namespace |
| 4 | Components — atoms | membership test applied; each survivor named; each rejection given a reason |
| 5 | Components — molecules, organisms | same |
| 6 | Framework, workshop, and the flat packages | same |
| 7 | Blocks and Sets | one preview card; one metadata dialect |

**Each row stops for a check.** He looks, he says yes or no, and only then does the next one start. A rejected category goes back to quarantine with its reason written down, not quietly fixed.

### Phase 3 — enforce

Every rule from phase 0 gains a validator beside `validate-taxonomy` / `validate-roster` / `validate-groups`. A rule with no gate is folklore, and folklore is how this happened.

## 4. What this roadmap does not do

- It does not restyle anything before the rules are written. That is the loop being escaped.
- It does not delete components. Quarantine is reversible; deletion is his call, per category, with the reason recorded.
- It does not touch git. Branching, staging and commits stay his.
