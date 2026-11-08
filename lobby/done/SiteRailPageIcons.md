---
component: NavRailSite
source: kol-foundry/tools/kol-kerner/src/content/nav.js
staged: 2026-11-08
status: draft
deps: [NavRail, Icon]
---

# SiteRailPageIcons

**From:** kol-foundry · tools/kol-kerner (kol-hq session)

## The ask
Page rows in the site rail (`NavRail variant="site"`, kol-framework `SiteLayout` / `SideNav`) should take an icon the way
the app rail's rows do: the glyph in a column of its own, the label where a plain page row's label already sits. Today a
page icon adds glyph + 8px gap before the label, and with `alignIcons` (default true) every row at that level shifts 20px
right, Overview included. The user read it as broken: *"you fucked with the spacing and sub item size... its WRONG"*, and
then: *"ok but at least app rail has it, so if they can it cant be so much trouble?"* · *"send them a ticket if you neeed DS chagne"*.

## Current behaviour (kol-component 0.352.0)
- `NavRailSite.jsx` ~L352: `body(row)` puts a zero-height glyph slot + `gap-2` before the label. `alignIcons` reserves the
  widest glyph's width for every row at the level.
- Row height does not change. Horizontal position does (+12px glyph + 8px gap).
- No consumer uses page-row icons today: kol-branding, site-hub and the kol-ds-ui apps put icons on categories only
  (kol-ds-ui-93's survey, 2026-11-08).

## Wanted
- A page row with an icon keeps its label at the same x as a page row without one, at the same size and spacing.
- The glyph sits in the gutter column (where the active dot / the category icon column is), as the app rail lays out its
  row icons.
- A level that mixes iconed and plain rows stays aligned.
- Either the default for page-level icons, or a prop (e.g. `pageIcons="gutter"`). Today's look stays the default if a
  prop is chosen.

## Consumer use
kol-kerner, `SiteLayout navTree={NAV_TREE} pageWash="var(--kol-fg-02)" sideNav={{ casePage: 'upper' }}`.
The Blueprint category is flat, 14 page rows: Overview (no icon), then 13 chapters, each with its stage's icon
(`foundation`, `pen`, `letter-spacing`, `layers`, `package`).

## Acceptance
- In the 14-row Blueprint category, every label's left edge measures the same x with and without page icons (0px delta).
- The row height is unchanged.
- The glyph shows in the gutter, and the active dot still reads for the active row.

## ✅ RESOLUTION — 2026-11-08 · kol-component@0.353.0

NavRailSite pageIcons: 'gutter' hangs a page row's glyph in the gutter under the category glyph, so an iconed page row's label sits exactly where a plain one's does (measured: label x 55 for both, both 18px tall). 'inline' stays the default. Through SiteLayout: sideNav={{ pageIcons: 'gutter' }}.

**Remainder here:** none — kol-hq bump kol-component@0.353.0; sideNav={{ casePage: 'upper', pageIcons: 'gutter' }} and icon on each chapter page row.

