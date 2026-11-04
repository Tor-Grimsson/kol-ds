# Plan — The Figma library mirrors the showcase

**Raised:** 2026-11-03, the user's review of the KOL Figma library (n48kE2bJtrFjl7wxst30xH) after the 36→6 page restructure. Points verbatim in the session: Foundations 1–2, Components 1–13, then *"this is the system we have built … I dont understand why we have to reinvent this in figma?? shoudnt there be some sort of overlap? … lets just figure this out properly ONCE"*.
**Status:** DRAFT — 2026-11-03. Nothing built. Open: all.
**Shape:** W › phase › list.
**Laws carried:**
- The showcase's nav data is the one structure: `showcase/src/nav/shell-nav.js`, `nav/classification.js`, `usage/composition.json`, `usage/api-tables.json`, `nav/page-sections.json`, and kol-component's folder tiers.
- A look or API change lands in Figma the same turn.
- Figma pages are #1E1E1E. A component on `_trash` is prefixed `_`.
- No borders without his approval. A new look goes on a labelled board before it is built.
- Right Grotesk text is edited by script only through the `type` → Schibsted swap, which is cleared afterwards.
- Never delete: retired masters go to `_trash`. Empty sections and pages may go.

**How a phase closes:** the measurable acceptance line first, then the gates (`pnpm validate:taxonomy` for code moves), then a Figma screenshot of every touched section, checked against his verbatim point. The showcase phases are checked with Playwright.

---

## W1 — One source: the export

### 1.1 — A manifest the layout script reads — ✅ built 2026-11-03 (408 rows = the showcase: 57 · 161 · 156 · 6 · 28)
- `scripts/extract-figma-manifest.mjs` joins the data into `showcase/src/usage/figma-manifest.json`. For every component it records name, package, tier, function, description, props, used by, nested text styles and the sets it belongs to.
- The data comes from the folder tiers, `classification.js` TIERS, `api-tables.json`, `descriptions.json`, `composition-index.json` and `styling.json`. Modules, template blocks, templates, apps and sets come from their registries.
- **Acceptance:** every component the showcase lists under Components has one manifest row with a tier other than `misc`, and the row count equals the showcase's component count.

### 1.2 — Map Figma masters to manifest rows — ✅ 2026-11-03: 86 matched; the 22 left are members (Menu*, Table*), Prose/List, AppShell (namesake), app-parts
- Match every COMPONENT/COMPONENT_SET on the library to a manifest row, by Code Connect mapping first and name second.
- **Acceptance:** an unmatched list is printed. Each entry is either matched, put on `_trash` (retired or no code twin) or marked as app-part, and zero entries are left unresolved.

## W2 — Page tree = the showcase's

### 2.0 — Preview page, approved before anything else moves — GATE
- A new page called `_preview` holds a working slice of the new layout, built with the same script the full run will use. It contains:
  - the Components page's opening columns, laid out horizontally;
  - four cards in the showcase look: Button, Input, Rail and List;
  - one Foundations sheet slice, the Tokens surface and shadow scales.
- No existing page is touched. The rest of W2–W5 waits for his yes on this page.
- **Acceptance:** `_preview` exists and every other page is byte-for-byte unchanged (the node count per page is the same before and after). He has said yes.

- ✅ built 2026-11-03 (page `_preview`, 323:87). Approved by the user (*"sure this looks alright"*) with two rulings:
  - **Radius 4** on cards, boxes and chips, never 8.
  - **The file is dark by default:** every page carries the `color` collection's Dark mode explicitly, and new pages get it too.

### 2.1 — Pages — ✅ built 2026-11-03 (Cover · Foundations · Icons · Components · Modules · Apps · Sets · _trash; 35 empty pages marked DELETE for the app)
- **Cover**
- **Foundations:** Tokens, Color, Typography, Tones, Opacity and Sizes.
- **Icons**
- **Components:** Atoms, Molecules, Organisms and Utilities.
- **Modules:** sections by category, Heroes through Toolbars.
- **Templates:** template blocks, then the templates, then the frames (AppShell, SiteLayout, WebsiteLayout, ShellLayout, AppHub, AppStudio, PageShell, Brand).
- **Apps:** sections by layer, Engine through Fixture. The current app screens and app-parts move here.
- **Sets:** instances only.
- **_trash**
- Guides stay in the showcase. Packages get no page; the package is a field on each card.
- **Acceptance:** the page list reads exactly as above, every page canvas is #1E1E1E, and no section named `_retired` or left empty exists anywhere.

### 2.2 — Retired off the working pages (C3) — ✅ 2026-11-03 (old Rail + styleguide dumps → _trash; empty sections removed; scan finds none)
- The old Rail (14:9) and anything W1.2 marks as retired go to `_trash` with a `_` prefix. The two empty `_retired` sections are deleted.
- **Acceptance:** a scan of every page except `_trash` finds no node whose name or description starts with RETIRED, and every `_trash` master name starts with `_`.

### 2.3 — Foundations hold no masters (F1, F2) — ✅ 2026-11-03 (0 masters; ui-font sheet kept as the font comparison tool)
- The two 42,000px styleguide frames go to `_trash`. The ui-font frame becomes instances of its master.
- **Acceptance:** zero COMPONENT/COMPONENT_SET nodes on Foundations.

## W3 — The component card (C1, C2, C4, C5, C8, C13)

### 3.1 — Card look = the showcase's component page — ruled 2026-11-03
- Ruled by the user: the card copies the showcase component page (*"yes like showcase, duh"*). There is no board and no options. The set has no fill and sits in a preview box like the showcase's, with the eyebrow, name, description, props table, used-by and nested text styles around it.

### 3.1b — The preview is a labelled grid, never the raw set — ruled 2026-11-03
- The raw set (Button: 187 unlabelled boxes) is not shown. Each card's preview is a labelled matrix: the set's main axis as rows (variant), size as columns, then one small labelled row each for state (pressed, disabled), radius and icon-only. Every row and column is named.
- **Acceptance:** every preview cell sits under a column label and beside a row label, and no preview shows more than one unlabelled instance.

### 3.3 — Button's variants — TALK
- Whether nav, tab, tab-filled and accent all stay on Button is a code question, taken later. Figma shows what the code has until then.

### 3.2 — Cards, by script, horizontal — ✅ built 2026-11-03 (110 cards; 0 overlaps; no set fills; every section ≤ as tall as wide)
- Each master sits in an auto-layout card mirroring ComponentPage, filled from the manifest:
  - an eyebrow with tier and package, the name and the description
  - the set
  - the props table
  - "used by" and the nested text styles
- Each tier column runs left to right, the cards flow in auto-layout rows, and a column is never taller than its width.
- **Acceptance:** zero overlapping cards on any page (pairwise bounds check). No variant sits outside its set's bounds. Zero sets keep a surface fill, if 3.1 rules no fill. Every card's props rows equal its `api-tables.json` entry.

## W4 — Foundations sheets (C8, F1)

### 4.1 — Tokens sheet — ✅ built 2026-11-03
- Mirrors `/foundations/tokens`: the opacity and foreground scale, surface tiers, brand ramps, type scale, corner radius and shadow scale (elevation, from the 7 effect styles).
- **Acceptance:** one swatch per variable in the matching collection, and each one is bound to that variable, not a hex.

### 4.2 — Color, Tones, Opacity, Sizes sheets — ✅ built 2026-11-03 (Cream ramp / brand ramps beyond palette/* are not Figma variables yet — noted on the sheet)
- Each mirrors its showcase page section for section, in the order `page-sections.json` gives.
- **Acceptance:** each sheet's section headings equal `page-sections.json` for that route.

### 4.3 — Typography sheet: every text style by family — ✅ built 2026-11-03 (141/141, plus a Text styles sheet for the other families)
- Every text-style family (ui, prose, doc, sheet, mono, helper, sans, card, table, layout, serif) gets a ramp of live samples, each tagged with its class name and size/leading.
- **Acceptance:** all 141 text styles appear exactly once, each sample uses its style, and none is detached.

## W5 — Component fixes

### 5.1 — Rail drawn at fill height (C6) — ✅ 2026-11-03 (side roles 380×640, body fills)
- The side roles are drawn at 640 tall with the content area set to fill, so a resize stretches them like the code does. The bottom role is unchanged.
- **Acceptance:** the side variants are ≤ 640 tall, and resizing an instance to 1200 keeps the header at the top and grows the body.

### 5.2 — Rail → organism — ruled 2026-11-03 (C6)
- Ruled by the user: Rail moves molecules → organisms in code (folder + `validate:taxonomy`), and Figma follows the manifest.

### 5.5 — ButtonGroup → molecule — ruled 2026-11-03
- Ruled by the user: *"button group paints buttons … its a molecule"*. It moves utilities → molecules in code, and the taxonomy doc's 2026-08-09 utilities list is amended.

### 5.6 — Module = the layer above organisms — ruled 2026-11-03, shape TALK
- Ruled by the user: no classic atomic ladder. The layer above organisms is called **Module**, his approved word, which means a layer and not a showcase example set. The page frames (AppShell, AppStudio, AppHub, SiteLayout and so on) go there.
- Ruled the same day (*"yes exactly"*): showcase modules that are one organism in a frame (color-picker, settings-form, inspector-panel) are dropped. Real arrangements (hero, footer, CTA, newsletter and so on) become Modules. Templates that are page frames become Modules, and the rest are gone through together (TALK). Written into `docs/documentation/03-components/00-taxonomy.md` § The ladder.

### 5.3 — List level 2 (C7) — ✅ 2026-11-03 (kind × level, level 2 indented 24)
- A `level=2` variant: indented 24, same marker, matching what `.kol-prose` renders for a nested list today.
- **Acceptance:** the List set holds kind × level (4 variants), and the level-2 indent is 24 relative to level 1.

### 5.4 — Per-level list markers — ruled no, 2026-11-03 (C7)
- Same symbol at every level. Level 2 is only the indent.

## W6 — Showcase: Controls set (C12)

### 6.1 — Controls is a real set — ✅ 2026-11-03 (stale data; regenerated — rail shows Controls (50) with Button, Dropdown, Menu)
- `scripts/extract-composition.mjs` gets a `controls` entry, so the set has children like every other set. Its members cover the app controls (Button, Dropdown, Menu family, toggles) as well as the hardware.
- **Acceptance:** with Playwright on `/library/sets/controls`, the rail lists children, and the member list includes Button, Dropdown and Menu.

### 6.2 — Templates that should not exist — TALK (C11)
- Which of the seven templates stay is his call, in the showcase, not in Figma.

## W8 — The ladder, in code and on the site (runs before W1)

### 8.1 — Code follows the ladder — ✅ built 2026-11-03 (AppShell left out: two packages share the name)
- Rail moves to organisms and ButtonGroup to molecules, both in kol-component's folders. The page frames (AppShell, AppStudio, AppHub, SiteLayout, WebsiteLayout, ShellLayout, PageShell) get the `modules` tier in `classification.js`.
- **Acceptance:** `validate:taxonomy` and `validate:roster` pass, and the showcase rail lists Modules under Components holding exactly those frames plus the arrangements from 8.2.

### 8.2 — Showcase modules restructured — ✅ 8 single-organism examples to _tmp 2026-11-03; the 15 arrangements stay as examples (ruled)
- Examples that are only one organism in a frame (color-picker, settings-form, inspector-panel and any other the scan finds) go to `_tmp/`. Arrangements (hero, footer, CTA, newsletter and so on) become the Modules group. Templates that are page frames move there too; the rest wait for the TALK in 6.2.
- **Acceptance:** no Modules entry renders a single organism alone (a script counts top-level KOL components per example; each one has ≥2 or is a frame), and the separate Composition › Modules chapter is gone.

### 8.3 — /components explains the ladder — ✅ built 2026-11-03
- The `/components` home gets a "The ladder" section like Shell & Layout's "The composition": the nested box diagram (Apps › Modules › Organisms › Molecules › Atoms, with Utilities beside the ladder), each box naming its rule and two examples. It reads from the same text as the taxonomy doc's § The ladder.
- **Acceptance:** Playwright on `/components` finds the section with 6 labelled boxes, Modules nested inside Apps and Atoms innermost, in light and dark, with no horizontal scroll at 390.

## W7 — Keep it mirrored

### 7.1 — Re-sync is one command — ✅ 2026-11-03 (pnpm figma:manifest + figma/scripts/kol-card.js, kol-sheet.js, README)
- `pnpm figma:manifest` regenerates the manifest. The layout script adds or moves cards for changed rows and never hand-places anything.
- **Acceptance:** after a new component is exported in code, one run puts its card in the right tier column with its props filled in.
