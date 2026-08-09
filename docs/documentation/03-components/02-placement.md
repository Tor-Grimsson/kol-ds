---
title: Component placement
type: reference
status: active
created: 2026-07-31
updated: 2026-08-09
description: The runbook for placing a new component
aliases:
  - component-placement
tags:
  - domain/components
  - audience/consumer
related:
  - "[[00-taxonomy|component taxonomy]]"
  - "[[03-taxonomy-audit-and-plan|taxonomy audit & plan]]"
  - "[review backlog](../../../.kol/llm-context/backlog/2026-07-02-review-backlog.md)"
  - "[execution plan](../../../.kol/llm-context/plan.md)"
---

# Component placement — where a new component goes

This is the **runbook** for placing a new component file into its Tier. The Tier *definitions* (atom/molecule/organism/framework/loader/hook, and the 2026-08-09 repeal of the import test) live in [[00-taxonomy|the taxonomy doc]] — read that first if the terms are new. This doc is the decision procedure, the authored map, and the enforcement.

Every component gets exactly one location, decided by **judgment on what it IS** — anatomy and role, never imports. A new component slots into its tier and its alphabetical position — nothing else moves.

## The test

**Could you rebuild it from other KOL components?**

- **Atom** — no: an irreducible element. One control, indicator, or content primitive; its parts are not nameable as KOL components.
- **Molecule** — yes: a small assembly of nameable parts working as one unit — whether it actually imports them or hand-rolls them.
- **Organism** — it is a whole region: a full bar, table, gallery, band, overlay surface, or manager.
- **Framework / Loader / Hook** — see the checklist below.

## Rules

1. **Imports are irrelevant to placement.** A hand-rolled trigger + panel + tag list is a molecule (`DropdownTagFilter`); a single dial importing nothing is an atom (`RotaryDial`) — and so is a single Image wrapper importing its fallback (`Image`).
2. **Downward-only imports.** Atoms never import molecules or organisms; molecules never import organisms; sideways is legal at every rung. Enforced by `scripts/validate-taxonomy.mjs` — the one mechanical residue.
3. **Single-value selection controls are atoms** — `SegmentedToggle`, `ViewToggle`, `ToggleBracket`. Cells are options of one control, not Buttons.
4. **A real input beside real buttons is a molecule** — `Stepper`, `QuantityInput`, `SearchInput`.
5. **One element with elaborate behavior is still an atom** — `AsciiCursor`, `InteractiveImage`, `TiltCard`.
6. **kol-icons `Icon`/`Graphic` are infrastructure, not components** — they never affect tier.
7. **If you're debating molecule vs organism**, ask "is this a self-contained section of an interface?" — a card is a molecule; the gallery of cards is an organism.

## Decision checklist

1. Is it app chrome / page structure? → **framework** (`fw-chrome` / `fw-structure` / `fw-behavior`).
2. Does it resolve names to assets rather than render its own UI? → **loaders** (Docs page, not the components list).
3. Is it reusable behavior with no markup of its own? → **hooks**.
4. Is it a self-contained region (bar, table, gallery, band, manager)? → **organism**.
5. Are its parts nameable as KOL components (imported OR hand-rolled)? → **molecule**.
6. Otherwise → **atom**.

## Re-sort map

The repeal (2026-08-09) re-judged all 93 kol-component files. 20 moved; the judgment per row:

| Move | Components | Why |
|---|---|---|
| atoms → molecules | `DocsToc` · `DropdownTagFilter` · `FullscreenOverlay` · `LabeledControl` · `QuantityInput` · `SearchInput` · `Section` · `Stepper` | Assemblies the import test couldn't see: nav-link cluster, trigger+panel+tags, scrim+sheet+close, label+control, input+buttons |
| molecules → atoms | `ColorSwatch` · `Image` · `PaletteHarmonyWheel` · `SelectionOverlay` | Single elements the import test had promoted: a chip, an image, a wheel control, selection chrome |
| molecules → organisms | `FramedMediaBand` · `ShellSearchOverlay` · `SpectrumControls` | Whole regions: a page band, the ⌘K search surface, the full color-picker apparatus |
| organisms → molecules | `BentoCard` · `Carousel` · `ErrorBoundary` · `LoaderOverlay` | Not regions: a card, a scroll mechanism, a fallback panel, an overlay+curtain pair |
| organisms → atoms | `AsciiCursor` | One canvas element, however elaborate its behavior |

Unmoved judgment anchors: `Button`/`Input`/`Tag`/`Popover` atoms · `Slider`/`Dropdown`/`Modal`/`FieldRow`/`ShellDrawer` molecules · `Table`/`ContentFilters`/`MediaLibrary`/`RecordManager` + the heroes/bands organisms.

Loaders verdict (C4): **Docs page**, not a components-list category — `Icon` + `Graphic` joined `DOCS_ONLY` in the showcase registry, documented on `/docs/loaders`, galleries unchanged on `/icons`.

## Membership

Everything above decides **where** a component goes. Nothing above asks **whether** it should ship. That gap is how `ExitPreview` — a router-aware escape hatch worn as CMS draft-mode chrome — passed cleanly as an atom and shipped in `@kolkrabbi/kol-component`: it nests no KOL component, so the placement test had no objection to make.

A component earns a place in a published package only if all three hold:

1. **Plural consumers.** It is used by two or more repos, or is plausibly reusable outside the one that birthed it. One app's chrome is that app's chrome.
2. **No app-specific assumptions.** No hardcoded routes, no CMS-mode semantics, no knowledge of one product's URL space. `ExitPreview` links to `/` and means "leave Sanity draft mode" — both are assumptions about a specific app.
3. **Renderable in isolation.** If its preview cannot show it, consumers cannot evaluate it. A component whose demo renders an empty box is telling you something.

Failing the test does not mean deletion — that is the maintainer's call, and removing a published export is a breaking change. It means the component is **flagged, not silently blessed**, and its page says so.

### The pass — 2026-08-09, all 239 exports

The full roster (239 exports across every package barrel) was read against the
three tests, evidence first: consumer counts from the mined usage index, demo
coverage, and a grep for app assumptions (hardcoded routes, CMS semantics,
product URLs). Verdicts, not restyling — nothing was removed.

**Flagged — 3** (each page says so; removal stays the owner's call):

| Component | Fails | Verdict |
|---|---|---|
| `ExitPreview` | 1 + 2 | The standing worked call below — flagged for removal, kept pending the owner's decision |
| `TagModeGate` | 1 | Orphaned export — its only mount was deleted by the ONE-search ruling (2026-08-01); the package still ships it |
| `AlternativeControlsMock` | 1 | A demo harness in a published API — it assembles the chess control apparatus for showing, not for consuming |

**Kept — 236.** The bulk resolve on grounds the evidence can cite:

- **Package-tier members** (chess · content · foundry · store · dashboards ·
  workshop · styleguide) pass as members of a package whose membership decision
  is already recorded in ARCHITECTURE §3 — a `PortableTextRenderer` greps as
  "CMS assumption" because rendering Sanity portable text **is the package's
  declared domain**, not an accident. The grep signal is definitional there.
- **Framework chrome** carries the Kolkrabbi footer URL by design — kol-framework
  is KOL's own shell; the brand is the product.
- **Zero-consumer rows younger than the mining** (`MediaLibrary` family,
  `InteractiveImage`, `FieldRow`, `StatusChip`, `RecordManager`, the rail
  family) pass on test 1's second clause — built from lobby briefs with named
  consumers waiting.
- **Hooks, providers and contexts** have no demo cards by design; test 3 reads
  "renderable in isolation", not "has a demo file".

**Demo gaps noted, not failed** (test 3 is about renderability):
`IconFrame` · `PopoverPanel` · the five color-tool molecules
(`EyedropPick`/`HueStrip`/`SBSquare`/`SwatchStack`/`WheelTriangle`, 5–6 apps
each) · `FieldRow`/`StatusChip`/`RecordManager` (born 2026-08-09).

**Twin-suspect for a future wave:** workshop ships `DocHeader` *and*
`DocsHeader`, `DocSection` *and* `DocsArticle` — two spellings that smell like
one thing. Not a membership fail; recorded so the next dedup arc finds it.

### The worked call — ExitPreview

Fails 1 and 2, and failed 3 until the demo was scoped. Its only in-repo consumer is `packages/framework/src/Layout.jsx`, gated on a `/site` route that does not exist here, so nothing renders it in the showcase but its own demo. **Verdict: flagged for removal, kept pending the owner's decision.**

Two real defects were fixed while there, both consequences of shipping app chrome as a DS atom:

- `position: fixed; bottom: 24px; left: 24px; z-index: 9999` is correct for a button floating over a client site and wrong everywhere else. Its demo card rendered EMPTY while a stray black × parked in the viewport corner — on `/components` too, where the index mounts every demo it scrolls past. The demo now establishes a containing block (`transform: translateZ(0)`); the component is untouched and still floats for real consumers.
- `text-transform: uppercase` on `.kol-exit-preview` broke the standing no-auto-casing law. Removed — the label is authored as `Exit` at the call site.

## Enforcement

Placement is **authored** — no script derives or second-guesses a tier. `node scripts/validate-taxonomy.mjs` fails loud on the two things that stay mechanical:

- a component file sits outside the closed folder set (`atoms` / `molecules` / `organisms` / `graphics` / `hooks`),
- an upward import: an atom importing from `molecules/`/`organisms/`, or a molecule importing from `organisms/`.

Run it after adding or moving any component. If it fights a genuinely correct placement, the rules get amended deliberately — [[00-taxonomy|the taxonomy doc]], this runbook, and the script move together.
