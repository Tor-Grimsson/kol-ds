---
component: TailwindContentSource
source: kol-monorepo/apps/web/src/index.css (consumer patch) → DS packaging concern
date: 2026-07-09
status: draft
deps: [kol-theme, kol-component, kol-framework, kol-dashboards, kol-chess, kol-workshop]
---

# Tailwind content-source requirement for @kolkrabbi UI packages

## Purpose
Not a component — a **packaging gap**. Every app that consumes an @kolkrabbi UI
package whose JSX uses Tailwind utility classes must manually tell its own Tailwind
build to scan that package's source, or the utilities never generate and the
component's layout collapses. This staged brief exists so the DS fixes it at the
source instead of every consumer re-discovering it the hard way.

## Affected packages
All @kolkrabbi packages that ship Tailwind-utility-dependent JSX (component counts
from the published `src/`):

| Package | JSX files | Uses utilities for |
|---|---|---|
| `@kolkrabbi/kol-workshop` | 13 | the whole shell grid/sidebar/toc layout |
| `@kolkrabbi/kol-component` | 142 | atoms/molecules/organisms internals |
| `@kolkrabbi/kol-framework` | 10 | AppShell/PageSection layout |
| `@kolkrabbi/kol-dashboards` | 21 | dashboard grid/card layout |
| `@kolkrabbi/kol-chess` | 15 | board/controls layout |

`kol-theme` (CSS-only) and `kol-icons` (SVG data) are unaffected — no utility JSX.

## Root cause
The packages ship **JSX that references Tailwind utility classes** (`grid-cols-[256px_minmax(0,1fr)]`,
`max-h-[calc(100vh-8rem)]`, `space-y-6`, `shrink-0`, `min-w-0`, …) but **no compiled
CSS for those utilities**. Tailwind generates utilities by scanning source for class
strings, and **Tailwind v4 ignores `node_modules` by default**. So a consumer's build
never sees the package JSX → never generates those classes → the class attributes are
present in the DOM but inert.

## Symptom (observed)
`kol-monorepo/apps/web` repointed its workshop onto `@kolkrabbi/kol-workshop`. The shell
rendered with its `shell-*` theme classes intact but **every layout utility missing**:
the 2/3-column grid collapsed to one full-width column, the 256px nav column lost its
width, sidebar group-counts flew to the far-right viewport edge, and content stacked
below the sidebar. Verified: `grep grid-cols-[256px_minmax(0,1fr)]` in the built CSS = **0
occurrences** before the fix.

## Current consumer patch
`apps/web/src/index.css` — five Tailwind v4 `@source` directives pointing at each
package's installed `src/`:

```css
@source "../node_modules/@kolkrabbi/kol-workshop/src";
@source "../node_modules/@kolkrabbi/kol-component/src";
@source "../node_modules/@kolkrabbi/kol-framework/src";
@source "../node_modules/@kolkrabbi/kol-dashboards/src";
@source "../node_modules/@kolkrabbi/kol-chess/src";
```

After adding them + rebuild, the utilities generate (verified: `256px_minmax(0,1fr)` = 2,
`calc(100vh-8rem)` = 1, `shrink-0` = 3). **Caveat:** HMR won't pick up newly-added
`node_modules` sources without a dev-server restart.

## Governing principle — shared ancestry CSS
You can't share styles peer-to-peer between packages; everything must descend from **one
shared ancestor CSS**. In KOL that ancestor is **`kol-theme`** — the tokens *and* the
component chrome (`shell-*`, `dash-*`, `chess-*`, `docs-*`) all live there, imported by
every package and every consumer. Tailwind utilities are the leaf layer that generates
**on top of** that shared ancestor, in the consumer's build. This is the lens for the
options below: whatever keeps a single ancestry wins.

## Decision (2026-07-09): each package owns its own CSS
Before today the monorepo consumed effectively **one** package, so `@source` was a single
invisible line. At 5 packages and climbing, the direction is decided: **each package
compiles and ships its own CSS**, so consumers just `@import` it — zero `@source`.

**Why this is safe (correcting an earlier worry):** in **Tailwind v4, `@theme` utilities
compile to `var(--kol-*)` references, not resolved values.** So a package can pre-compile
its utilities and the output still points at the shared `kol-theme` variables — the shared
ancestry holds, *provided every package builds against the same `@theme` token names*
(which they do, all sharing `kol-theme`). The v3-era "bakes hardcoded token values" risk
does not apply.

### Target
Each package runs Tailwind at publish time over its own `src/`, against the shared
`kol-theme` `@theme`, and ships one `kol-<pkg>.css` containing its chrome classes **and**
its layout utilities (all `var()`-referencing). Consumer imports it alongside `kol-theme`.
No `@source`, no `node_modules` scanning, no dev-server-restart footgun.

| | Ships | Consumer | Ancestry |
|---|---|---|---|
| Now (`@source`) | JSX only | scans `node_modules/src`, generates utilities | shared (kol-theme vars) |
| **Target (decided)** | `kol-<pkg>.css` | `@import` it | shared (kol-theme vars) |

### Cost
A per-package Tailwind build step (config + script) in each `packages/*`. That's the whole
price — and it's the right one at this package count.

## Recreation notes
- Tier: **build/packaging**, not a component. Lives in each package's build config, not
  `packages/component/src/*`.
- **Interim:** the monorepo's 5 `@source` lines are the **bridge** — keep them until each
  package ships its own CSS, then delete them (track that removal here).
- Do the packages in consume-order: `kol-workshop` (broke first) → `kol-component` →
  `kol-framework` → `kol-dashboards` → `kol-chess`.
- Footgun to kill with this: newly-added `node_modules` `@source` paths need a
  **dev-server restart** — self-contained CSS removes that entirely.
