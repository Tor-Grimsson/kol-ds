# Session: three lobby tickets — DS tier as peers, nested theme scope, nested SideNav groups

**Date:** 2026-08-26
**Agent:** Grim (Haiku 4.5)
**Summary:** The whole queue closed in one run — two tickets at init plus one that
landed mid-session. Six packages published (workshop 0.23.0 · chess 0.7.0 ·
content 0.9.0 · foundry 0.6.0 · store 0.2.0 · theme 0.52.0→0.52.1 · framework
0.24.0), every claim rendered headless before it was written down. Also: the
font-folder case bug confirmed in this repo's git index and broadcast as a
bulletin; the user did the `git mv`.

## Changes Made

### Files Modified

**NestedDsDependencies → workshop 0.23.0 · chess 0.7.0 · content 0.9.0 · foundry 0.6.0 · store 0.2.0**
- five `package.json` — kol-component/theme/icons (+framework in workshop) moved
  from `dependencies` (0.x caret → pnpm nested a private stale copy: component
  0.39.0 under workshop, 0.8.0 under store) to `peerDependencies` with `>=`
  floors at 0.68.1 / 0.23.0 / 0.51.0 / 0.18.0; `workspace:^` in devDependencies
  (the kol-dashboards / kol-shell shape). Registry-verified on all five
- `00-overview/01-package-topology.md` §Dependencies — the rule stated

**nested-theme-scope → theme 0.52.0**
- `kol-base-tokens.css` — light surface block on `:root, :is([data-theme="light"], .light)`
- `kol-opacity.css` — fg ramp (three tiers) + eight roles on the three theme selectors
- `kol-opaque.css` — oq ramp, same (same freeze, not in the ticket)
- `kol-color.css` — `--kol-border-default` / `--kol-border-focus` /
  `--kol-focus-ring-quiet` moved out of `:root` into a themed block. **Accent
  family left `:root`-only on purpose** — kol-brand-color.css rebinds it at
  `:root`; a themed re-declaration would hand a branded app's nested pane the
  neutral ink accent
- `01-foundations/01-tokens.md` — the subtree law

**sidenav-nested-groups → framework 0.24.0 · theme 0.52.1**
- `framework/src/SideNav.jsx` — `rowsOf` / `leavesOf` / `renderRows`: a
  `{ label, children }` row renders as `.kol-sidenav-group kol-helper-10`
  (`text-subtle`, `text-emphasis` when a leaf beneath is the route) over its
  rows indented one `--kol-spacing-3` step, recursive; dot keeps its 0.875rem
  lead. Depth 0 carries no style — flat trees byte-identical. Header re-scoped
  with the user's 2026-08-26 sentence quoted verbatim; `#anchor` leaves stay dropped
- `kol-framework.css` — `.kol-sidenav-group` box rule beside hop/list
- `kol-components-atoms.css` — the elder's dead `.kol-sidenav-group { padding: 4px 0 }`
  retired (theme 0.52.1): it was outranking the framework rule in the showcase
- `showcase/src/demos/SideNav.jsx` — a `Chrome` group naming its own page, so
  the demo renders lit with its leaf active; `docs/components/SideNav.mdx` re-scoped

**Bookkeeping**
- `lobby/INDEX.md` — three closes via `lobby-close`, rows moved to Closed, queue → 0
- kol-website `lobby/outbox/NestedDsDependencies.md` — receipt via the tool
- kol-studio `lobby/outbox/{nested-theme-scope,sidenav-nested-groups}.md` —
  **hand-written, folder created**: kol-studio is not in the lobby registry
- `~/.dotfiles/…/LLM_RULES.md` BULLETIN — the font-folder `git mv` entry (user-invoked)
- Shipped-packages table, six changelogs (BREAKING flagged on the five)

### Features Added/Removed
- The DS tier is a peer in every domain package — one copy per consumer
- `data-theme` / `.light` / `.dark` on any element themes that subtree: surfaces,
  ink ramp, roles, oq, borders
- `SideNav` renders nested route groups; the tree shape is the opt-in, no prop

## Current State

### Working
- Nested theme measured headless against the raw theme (Playwright + cached
  headless shell 1234, `executablePath`, file:// page): before, a light pane in
  a dark root flipped NOTHING — surface included, the ticket's "surface flips"
  was the consumer's override; after, both directions correct, `.light` as a
  class too
- SideNav asserted in the showcase (task-scoped vite on 5199, killed): flat demo
  aside outerHTML identical before/after; nested group at 56px, leaves 68px,
  group lit, leaf active
- 20 gates clean on every publish; seven publishes registry-verified

### Known Issues
- **The showcase lands framework chrome in a NESTED `components.components`
  layer** (`@import … layer(components)` from index.css) — below every theme
  rule of equal specificity. Pre-existing, the reason the dead atoms rule won;
  not touched, the user's ruling
- `.bg-surface-inverse` re-declares fg-01…96 but not fg-72 or the roles, so
  `.text-body` inside an inverse panel is still root ink — same class of freeze,
  outside the ticket
- Same dependency class untouched: kol-framework → component/icons,
  kol-component → icons, kol-styleguide → its tier still `dependencies`
- kol-studio has no lobby and is not in the registry; receipts are hand-written
  there and `lobby-close` cannot place them
- `public/fonts/Right-Grotesk-Mono/` — capitalised, zero references, left as found

## Next Steps
1. kol-website: bump the five + delete `pnpm.overrides`; kol-studio: bump theme
   0.52.1 + framework 0.24.0, delete `kol-nested-theme.css`, restore its two
   nav groups — all 📌 theirs
2. Rule on the showcase's nested-layer import (§5 says the layered import is
   the contract; the nesting makes theme beat framework at equal specificity)
3. framework → component/icons as peers, with its next publish, if ruled
