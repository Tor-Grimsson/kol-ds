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

This is the **runbook** for placing a new component file into its Tier. The Tier *definitions* (atom/molecule/organism/framework/loader/hook, and why KOL's tiers deliberately aren't Brad Frost atomic) live in [[00-taxonomy|the taxonomy doc]] — read that first if the terms are new. This doc is the mechanical decision procedure and the enforcement.

Every component gets exactly one location, decided by **structure, not vibes or complexity**. A new component slots into its tier and its alphabetical position — nothing else moves.

## The test

- **Atom** — nests no KOL component (`Icon`/`Graphic` don't count).
- **Molecule** — nests at least one KOL component.
- **Organism** — a self-contained composed region (bar, table, gallery), regardless of nesting.
- **Framework / Loader / Hook** — see the checklist below.

## Rules

1. **kol-icons `Icon`/`Graphic` are infrastructure, not components.** Nesting an Icon does NOT make an atom a molecule (Button, Stepper, Tag stay atoms).
2. **Downward-only imports.** Atoms never import molecules or organisms. Molecules may import atoms and sibling molecules. Enforced by `scripts/validate-taxonomy.mjs`.
3. **Structure beats complexity.** A hard-to-build component with no KOL nesting is still an atom (Popover/Tooltip); a trivial wrapper that nests one is a molecule (Image → AssetPlaceholder).
4. **Same-file nesting counts** but is invisible to the validator — mark the file with a `taxonomy-ok:` comment naming the reason (see Accordion).
5. **Organism is a judgment tier** for full regions. If you're debating atom vs molecule, structure decides; if you're debating molecule vs organism, ask "is this a self-contained section of an interface?"

## Decision checklist

1. Is it app chrome / page structure? → **framework** (`fw-chrome` / `fw-structure` / `fw-behavior`).
2. Does it resolve names to assets rather than render its own UI? → **loaders** (Docs page, not the components list).
3. Is it reusable behavior with no markup of its own? → **hooks**.
4. Is it a self-contained composed region (bar, table, gallery)? → **organism**.
5. Does it nest a KOL component (imports one, or same-file)? → **molecule**.
6. Otherwise → **atom**.

## Worked calls

Moves the backlog named, decided by rule 1 + the molecule test:

- **Badge, Pill, Tag → atoms** — nest nothing KOL (Icon doesn't count).
- **Section, SectionLabel, SegmentedToggle, ToggleBracket, ViewToggle, LabeledControl, DropdownTagFilter, QuantityInput, QuantityStepper, Popover (usePopover/PopoverPanel/Tooltip) → atoms** — same test, same result.
- **Slider → molecules** — nests `Input`. The rule cuts both ways: the same test that demotes Badge promotes Slider.
- **ColorSwatch → molecules** — nests `TransparentX`.
- **ContentFilters → organisms** — a full filter bar (search + tag groups + view modes).

The 8 ex-primitives (`primitives` is dead — it was never part of the atomic system):

- **AssetPlaceholder, ExitPreview, FullscreenOverlay → atoms** — nest nothing; overlay/link mechanics are hand-rolled internals.
- **CodeBlock → molecules** — nests the `CopyButton` atom (extracted 2026-07-02).
- **Image → molecules** — nests `AssetPlaceholder`.
- **Accordion → molecules** — nests `AccordionPanel` same-file (`taxonomy-ok:` comment carries the call).
- **Carousel → organisms** — a self-contained slider region (checklist step 4 beats "nests nothing").

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

`node scripts/validate-taxonomy.mjs` fails loud when:

- a component file sits outside the closed folder set (`atoms` / `molecules` / `organisms` / `graphics` / `hooks`),
- an atom imports from `molecules/` or `organisms/`,
- a molecule imports no KOL component and has no `taxonomy-ok:` exemption comment.

Run it after adding or moving any component. If it fights a genuinely correct placement, the rules get amended deliberately — [[00-taxonomy|the taxonomy doc]], this runbook, and the script move together.
