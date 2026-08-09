---
title: Component taxonomy
type: reference
status: canonical
created: 2026-07-15
updated: 2026-08-09
verified: 2026-07-04
description: The tier axis and the function axis
aliases:
  - taxonomy
  - categories
  - component-categories
sources:
  - packages/component/src/index.js
  - showcase/src/lib/registry.js
  - scripts/validate-taxonomy.mjs
tags:
  - domain/components
  - audience/consumer
related:
  - "[[02-placement|component placement]]"
  - "[[01-inventory|component inventory]]"
  - "[[04-diamond-tier|diamond tier]]"
  - "[[05-control-chrome|control chrome law]]"
  - "[[03-taxonomy-audit-and-plan|taxonomy audit & plan]]"
---

# Component taxonomy — the two axes

Every KOL component is classified on **two independent axes**. They answer different questions and neither replaces the other:

| Axis | Answers | Used for |
|---|---|---|
| **Tier** | *How is this built?* — does it nest other KOL components? | Code placement (`src/<folder>/`), import discipline, the validator. |
| **Function** | *What does it do for a user?* | Finding a component ("I need an input"). |

A component has exactly one Tier **and** exactly one Function. `Slider` is a *molecule* (Tier) and an *input* (Function) at the same time. When you're browsing to find something, Function is what you want; when you're placing a new file or reasoning about composition, Tier is what you want.

---

## Tier

Which `packages/component/src/<folder>/` (or package) a component lives in. Decided by **judgment on what the component IS** — its anatomy and role, never its imports (2026-08-09 ruling, repealing the mechanical nesting test).

| Tier | Definition | Home |
|---|---|---|
| **Atom** | An **irreducible interface element** — one control, indicator, or content primitive. Its visible parts cannot be named as other KOL components. | `packages/component/src/atoms/` |
| **Molecule** | A **small assembly** — two or more nameable parts working as one unit: label + control, input + buttons, trigger + panel, a card, a row. | `packages/component/src/molecules/` |
| **Organism** | A **self-contained interface region** — a full bar, table, gallery, band, overlay surface, or manager. | `packages/component/src/organisms/` |
| **Utility** | **Purpose without a face** — a layout wrapper, a mechanism other components wear, a guard, a fallback state. Real exports with real consumers, but not interface elements. | `packages/component/src/utilities/` |
| **Framework** | App chrome and page structure — shells, navs, heroes, render-null behaviors. | `packages/framework/src/` |
| **Loader** | Name→asset resolvers (`Icon`, `Graphic`). **Not visual UI** — never listed as components; documented on `/docs/loaders`, galleries live on the Icons pages. | `kol-icons`, `graphics/` |
| **Hook** | Reusable behavior, no markup of its own (`usePrefersReducedMotion`, `useScrollSpy`). | `packages/component/src/hooks/` |

### KOL Tier IS real atomic — the import test is repealed (2026-08-09)

From 2026-07-04 to 2026-08-09 the tiers were derived from a **mechanical import test** ("does this file import another KOL component?"). That test filed by build accident, not by anatomy: a hand-rolled filter dropdown sat in Atoms because it imported nothing, while a one-line `Image` wrapper sat in Molecules because it imported a fallback. **User ruling, 2026-08-09: the categories were wrong.** The tiers now follow atomic design as it is actually meant:

- **The judgment test: could you rebuild it from other KOL components?** If its parts are nameable as KOL components — whether imported or hand-rolled — it is a molecule (or an organism, if it is a whole region). If not, it is an atom, however complex its internals.
- `DropdownTagFilter` hand-rolls a trigger, panel, and tag list — those parts ARE a Button, a Popover, and Tags, so it is a **molecule** regardless of importing none of them.
- `RotaryDial` and `CurveOverlay` decompose into nothing nameable — **atoms**, however hard they were to build.

Deliberate boundary calls, so they aren't relitigated:

1. **Single-value selection controls are atoms** — `SegmentedToggle`, `ViewToggle`, `ToggleBracket`. Their cells are options of ONE control (role=radiogroup), not Buttons.
2. **A real input beside real buttons is a molecule** — `Stepper`, `QuantityInput`, `SearchInput`: an Input visibly composed with adjuncts.
3. **One element with elaborate behavior is still an atom** — `RotaryDial`, `CurveOverlay`: a single control/canvas, however much it does. *(Reworded 2026-08-09 night — the original examples all left atoms the same day: `TiltCard` and `AsciiCursor` to utilities on the paints-and-stands law — fixed-position whole-viewport chrome fails "stands alone", the ExitPreview precedent — and `InteractiveImage` retired to `_tmp/` on zero consumers. The call itself stands: elaborateness never promotes.)*
4. **`Icon`/`Graphic` never affect tier** — loader infrastructure, invisible to the judgment.
5. **Imports still go downward only** — atoms never import molecules/organisms; molecules never import organisms; sideways is legal at every rung. This is the part that stays lint-enforced (`scripts/validate-taxonomy.mjs`); placement itself is authored, and the authored map lives in [[02-placement|component placement]].

### An atom PAINTS, and it stands alone (2026-08-09 ruling)

Atomic design is a design principle, not an invisible-helper principle — the user's words, and the second half of the same day's re-rule. Two tests, both mechanical, gate the visual tiers:

1. **The visual test — strip every child and every prop: does it paint?** If nothing renders, it is layout, behavior, or CSS — not an interface element. (`validate:taxonomy` enforces a source-text heuristic of this on `atoms/`.)
2. **The placement test — can it stand alone on a canvas and mean something?** A mark only ever applied *onto* another element, a mechanism other components *wear*, or a state another component *falls back to* is that component's member or servant — not its peer.

What fails either test but still earns its exports lives in **`utilities/`** — one folder, one sidebar group, deliberately not eight scattered homes (user ruling: *"group this together"*). Utilities sit outside the import ladder: any tier may import `utilities/`; `utilities/` may import atoms/hooks/graphics but never molecules or organisms — a mechanism stays primitive.

The 2026-08-09 re-file (13 members): from atoms — `AssetGrid` (paintless grid wrapper), `Popover` (positioning mechanism), `OverlayGlassPanel` (surface treatment), `TiltCard` (behavior wrapper), `AssetPlaceholder` (Image/Graphic's fallback state), `TransparentX` (decoration drawn onto a slot), `ExitPreview` (fixed-position chrome), `ProsePreview` (type specimen); from molecules — `ButtonGroup` (pure layout), `FullscreenOverlay` (the scrim+sheet mechanism five components wear), `LoaderOverlay` (slot pass-through), `ErrorBoundary` (guard); from organisms — `EditorShell` (slot frame). Kept after challenge: `MenuPopover` (renders a MenuItem — visual, on its own deprecation track) and the `Section`/`LabeledControl` pair (group header vs field label — different roles, near-identical JSX).

### How the Tier axis shows in the sidebar

**Ownership tiers (2026-07-30 ruling):** the atomic tiers (Atoms/Molecules/Organisms) belong to `kol-component` ONLY. Every flat package's components classify by OWNERSHIP — Workshop, Dashboards, Chess, Foundry, Styleguide, Content, Store are their own sidebar groups (a shell piece is not an "atom", a dashboard card is not a "molecule"). The hand-mapped `TIERS` table is retired for grouping. **Hooks are not components** — scripts with nothing to view; they carry no nav rows and no pages, and belong in documentation referenced from their owning component.

The "Atomic" sidebar grouping is the full Tier set, in this order:

`atoms · molecules · organisms · utilities · framework·chrome · framework·structure · framework·behavior · hooks · misc`

- **Framework is split three ways** for browsing — `chrome` (shell pieces: AppShell, SideNav, PortalFooter, ShellHeader, ThemeToggle, Layout), `structure` (heroes/sections: BrandHero, SubPageHero, PageSection), `behavior` (render-null utilities: ScrollToTop). *(Open question, tracked in the audit: do the heroes belong in atomic `organisms` instead of the framework tier?)*
- **Loaders are not a sidebar group.** `Icon`/`Graphic` are documented on `/docs/loaders`; their galleries stay on `/icons`.
- **`misc`** is a fallback bucket. It should stay empty — anything landing there is an unclassified component and a bug to fix, not a home.

---

## Function

A **closed, Material-style set**. Every current and future component maps to exactly one. This is the axis you browse by.

| Function | For |
|---|---|
| **Action** | Triggers an operation — Button, ThemeToggle, ShapeDropdown. |
| **Input** | Captures a value — Input, Slider, Stepper, Toggle*, Dropdown, RotaryDial. |
| **Display** | Presents read-only content — Badge, Tag, Avatar, Table, ColorSwatch. |
| **Feedback** | Communicates state — EmptyState, ErrorBoundary. |
| **Navigation** | Moves between views — SideNav, TabsRow. |
| **Wayfinding** | How a user moves through or re-slices a site — navigation, filtering, search, site chrome: ContentFilters, DropdownTagFilter, ShellSearchOverlay, ShellDrawer, DocsToc, AsciiCursor. |
| **Overlay** | Floats over content — Menu, Tooltip, Modal, FullscreenOverlay. |
| **Media** | Images/video/galleries — Image, Carousel, HlsVideo, MediaViewer, MediaTileGallery. |
| **Structure** | Lays out regions — heroes, FeatureSplit, AssetGrid, EditorShell. |
| **Utility** | Non-visual helpers — hooks, cssVar resolvers. |

Closed means **new components slot into an existing Function** — you don't invent a new one. If nothing fits, that's a signal to reconsider the component, not to grow the set.

*Amended 2026-07-09:* **Wayfinding** joined the set — the deliberate-amendment path, not an exception to closedness. Members: ContentFilters, DropdownTagFilter, ShellSearchOverlay, ShellDrawer, DocsToc, and AsciiCursor (site-chrome delight), plus the cross-package members WorkViewToggle (kol-content) and ShellHeader + PortalFooter (kol-framework) — the registry's `FUNCTION_MAP` carries all of them, cross-package included.

---

## Sidebar

The component sidebar carries a persisted **`Atomic ⇄ Function`** toggle *(rolling out in Phase 2 — see [[03-taxonomy-audit-and-plan|the audit & plan]])*:

- **Atomic** (default — user ruling 2026-07-30) — groups by Tier, the composition/build view.
- **Function** — groups by what components do; the opt-in browse axis.

Whichever grouping is active, **each component page shows both**: its Tier as a badge and its Function as a chip. Neither axis is hidden; the toggle only changes the top-level nav spine.

---

## Page rule

A component's compositional **sub-parts and infrastructure sub-exports are members of one component, not peers.** They render inside the parent's page (one sidebar row), never as standalone entries:

- `Menu` → `Menu.Item`, `Menu.Divider`, `Menu.Nest` (the parts you compose inside a menu).
- `Popover` → `usePopover`, `PopoverPanel`, `Tooltip`.
- `Modal` → `ModalProvider`, `useModal`.
- `SpectrumControls` → `HueStrip`, `SBSquare`, `WheelTriangle`; `SwatchControls` → `SwatchStack`, `EyedropPick`.
- `Accordion` → `AccordionPanel`.

The rule: **if you'd only ever use it inside its parent, it's a member.** Grouping lives in a hand-authored overlay (`showcase/src/lib/component-groups.js`), never in the mined `usage-index.json`. *(Presentation is converging on this — see [[03-taxonomy-audit-and-plan|the audit & plan]].)*

**Roster completeness (2026-07-15) — mechanical, CI-gated.** Every component in every package is on the roster with a Tier + Function — no omissions, enforced:

- **The roster derives from the package barrels** (`showcase/src/lib/roster.js` parses every `packages/*/src/index.js` at build time via `scripts/lib/parse-barrel.mjs`) — there is no generated roster file to go stale. `usage-index.json` is enrichment only (counts + real call-site examples).
- **Tier**: kol-component from its folders; kol-framework = `framework`; flat packages from the authored `TIERS` map in `showcase/src/lib/classification.js`.
- **Function**: `FUNCTIONS_BY_NAME` in the same file — no silent `display` default anywhere.
- **The gate**: `pnpm validate:roster` (wired into `build` + the release workflow) fails when any barrel export lacks a classification or a written exemption (`EXEMPT` / `DOCS_ONLY` / `DEPRECATED` / member overlay), when a classification key matches no live export, or when two packages export one name without a re-export ruling. Adding a component to any barrel either appears in the docs or breaks the build.
- **Prose from source (2026-07-15)**: the description on a component's page is its file's own JSDoc first sentence (`Name — sentence.` convention; `pnpm extract:descriptions`, regenerated every build). The `DESCRIPTIONS` map in `registry.js` is a fallback for components without a JSDoc header — fix the JSDoc, don't author the map.

---

## See also

- **Placing a new component file** → [[02-placement|component placement]] (the mechanical decision runbook + enforcement).
- **The current roster** → [[01-inventory|component inventory]].
- **Why this doc exists / what's changing** → [[03-taxonomy-audit-and-plan|taxonomy audit & plan]].
