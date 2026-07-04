---
title: Component taxonomy — the two axes
type: reference
status: canonical
updated: 2026-07-04
verified: 2026-07-04
description: How KOL classifies components — the Tier axis (atom/molecule/organism/framework/loader/hook, a mechanical nesting test, deliberately not Brad Frost atomic) and the Function axis (a closed Material-style set), how they combine in the sidebar, and the one-page-per-component rule.
aliases:
  - taxonomy
  - categories
  - component-categories
sources:
  - packages/component/src/index.js
  - showcase/src/lib/registry.js
  - scripts/validate-taxonomy.mjs
tags:
  - domain/design-system
  - domain/conventions
related:
  - "[[02-placement|component placement]]"
  - "[[01-inventory|component inventory]]"
  - "[[04-taxonomy-audit-and-plan|taxonomy audit & plan]]"
---

# Component taxonomy — the two axes

Every KOL component is classified on **two independent axes**. They answer different questions and neither replaces the other:

| Axis | Answers | Used for |
|---|---|---|
| **Tier** | *How is this built?* — does it nest other KOL components? | Code placement (`src/<folder>/`), import discipline, the validator. |
| **Function** | *What does it do for a user?* | Finding a component ("I need an input"). |

A component has exactly one Tier **and** exactly one Function. `Slider` is a *molecule* (Tier) and an *input* (Function) at the same time. When you're browsing to find something, Function is what you want; when you're placing a new file or reasoning about composition, Tier is what you want.

---

## Axis 1 — Tier

Which `packages/component/src/<folder>/` (or package) a component lives in. Decided by a **mechanical nesting test**, enforced by `scripts/validate-taxonomy.mjs`.

| Tier | Test | Home |
|---|---|---|
| **Atom** | Nests **no** KOL component. Hand-rolled internals (buttons, chips, floating panels) don't disqualify it. | `packages/component/src/atoms/` |
| **Molecule** | Nests **at least one** KOL component. | `packages/component/src/molecules/` |
| **Organism** | A self-contained composed UI **region** — a full bar, table, or gallery — regardless of what it nests. A judgment tier. | `packages/component/src/organisms/` |
| **Framework** | App chrome and page structure — shells, navs, heroes, render-null behaviors. | `packages/framework/src/` |
| **Loader** | Name→asset resolvers (`Icon`, `Graphic`). **Not visual UI** — never listed as components; documented on `/docs/loaders`, galleries live on the Icons pages. | `kol-loader`, `graphics/` |
| **Hook** | Reusable behavior, no markup of its own (`usePrefersReducedMotion`, `useScrollSpy`). | `packages/component/src/hooks/` |

### KOL Tier is *not* Brad Frost atomic — on purpose

Brad Frost's atomic design ranks by **visual/conceptual complexity** (atoms = smallest UI bits, molecules = small functional groups, organisms = complex sections). That ranking is a judgment call, and judgment calls breed "is this an atom or a molecule" debates.

KOL replaces the judgment with **one mechanical, lint-enforceable question: does this file import another KOL component?** The consequences are deliberate and occasionally counter-intuitive:

- A visually trivial wrapper that reuses one component is a **molecule** — `Slider` nests `Input`, `ColorSwatch` nests `TransparentX`.
- A hand-built, genuinely complex control that reuses nothing is an **atom** — `RotaryDial`, `CurveOverlay`.

**The Tier tells you about build/import structure, not complexity or importance.** If that feels wrong while browsing, you're reaching for the Function axis — use it. Two rules keep the test honest:

1. **`Icon`/`Graphic` don't count as nesting.** They're loader infrastructure, so nesting one leaves an atom an atom (`Button`, `Tag`, `Stepper` stay atoms).
2. **Imports go downward only.** Atoms never import molecules/organisms; molecules may import atoms and sibling molecules. The validator enforces this.

### How the Tier axis shows in the sidebar

The "Atomic" sidebar grouping is the full Tier set, in this order:

`atoms · molecules · organisms · framework·chrome · framework·structure · framework·behavior · hooks · misc`

- **Framework is split three ways** for browsing — `chrome` (shell pieces: AppShell, SideNav, PortalFooter, ShellHeader, ThemeToggle, Layout), `structure` (heroes/sections: BrandHero, SubPageHero, PageSection), `behavior` (render-null utilities: ScrollToTop). *(Open question, tracked in the audit: do the heroes belong in atomic `organisms` instead of the framework tier?)*
- **Loaders are not a sidebar group.** `Icon`/`Graphic` are documented on `/docs/loaders`; their galleries stay on `/icons`.
- **`misc`** is a fallback bucket. It should stay empty — anything landing there is an unclassified component and a bug to fix, not a home.

---

## Axis 2 — Function

A **closed, Material-style set**. Every current and future component maps to exactly one. This is the axis you browse by.

| Function | For |
|---|---|
| **Action** | Triggers an operation — Button, ThemeToggle, ShapeDropdown. |
| **Input** | Captures a value — Input, Slider, Stepper, Toggle*, Dropdown, RotaryDial. |
| **Display** | Presents read-only content — Badge, Tag, Avatar, Table, ColorSwatch. |
| **Feedback** | Communicates state — EmptyState, ErrorBoundary. |
| **Navigation** | Moves between views — SideNav, TabsRow, DocsToc. |
| **Overlay** | Floats over content — Menu, Tooltip, Modal, FullscreenOverlay. |
| **Media** | Images/video/galleries — Image, Carousel, HlsVideo, MediaViewer. |
| **Structure** | Lays out regions — heroes, FeatureSplit, AssetGrid, EditorShell. |
| **Utility** | Non-visual helpers — hooks, cssVar resolvers. |

Closed means **new components slot into an existing Function** — you don't invent a new one. If nothing fits, that's a signal to reconsider the component, not to grow the set.

---

## How the axes combine in the sidebar

The component sidebar carries a persisted **`Atomic ⇄ Function`** toggle *(rolling out in Phase 2 — see [[04-taxonomy-audit-and-plan|the audit & plan]])*:

- **Function** (default) — groups by what components do. This is how people look for one.
- **Atomic** — groups by Tier, for when you're thinking about composition/build structure.

Whichever grouping is active, **each component page shows both**: its Tier as a badge and its Function as a chip. Neither axis is hidden; the toggle only changes the top-level nav spine.

---

## One page per *component*, not per *export*

A component's compositional **sub-parts and infrastructure sub-exports are members of one component, not peers.** They render inside the parent's page (one sidebar row), never as standalone entries:

- `Menu` → `Menu.Item`, `Menu.Divider`, `Menu.Nest` (the parts you compose inside a menu).
- `Popover` → `usePopover`, `PopoverPanel`, `Tooltip`.
- `Modal` → `ModalProvider`, `useModal`.
- `SpectrumControls` → `HueStrip`, `SBSquare`, `WheelTriangle`; `SwatchControls` → `SwatchStack`, `EyedropPick`.
- `Accordion` → `AccordionPanel`.

The rule: **if you'd only ever use it inside its parent, it's a member.** Grouping lives in a hand-authored overlay (`showcase/src/lib/component-groups.js`), never in the mined `usage-index.json`. *(Presentation is converging on this — see [[04-taxonomy-audit-and-plan|the audit & plan]].)*

---

## See also

- **Placing a new component file** → [[02-placement|component placement]] (the mechanical decision runbook + enforcement).
- **The current roster** → [[01-inventory|component inventory]].
- **Why this doc exists / what's changing** → [[04-taxonomy-audit-and-plan|taxonomy audit & plan]].
