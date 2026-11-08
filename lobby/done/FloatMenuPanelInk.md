---
component: FloatMenuPanelInk
source: kol-component@0.339.0 molecules/Menu.jsx (`variant="float"`, `.kol-menu-panel--float`) — kol-website apps/record/src/App.jsx (the bar's ··· menu)
staged: 2026-11-04
status: draft
deps: [Menu, MenuPanel, MenuRow, float surface tokens]
---

# FloatMenuPanelInk — Menu variant="float" draws its rows in the ground's ink on the opposite ground

## The case
record's top bar: `<Menu variant="float" align="end" items={[Sign in, Search ⌘K]} trigger={… Button variant="float" tone="inverted" iconOnly="more" …} />`. The panel portals to `<body>` as `div.kol-popover-float.kol-menu-panel.kol-menu-panel--float`.
- Dark theme (`html[data-theme=dark]`): panel background `rgb(250,250,250)`, row colour `rgba(250,250,250,0.88)` — white on white, the rows are invisible (only the icons and the ⌘K cap show).
- Light theme: the panel paints dark (`#121215`) and the rows dark — same failure, inverted.

## Also on his screen (light theme)
The trigger, `Button variant="float" tone="inverted" size="lg" iconOnly="more"`, reads as a mid-grey circle over the Home photo, not the solid black float button of his mocks (proxy--components 256:17746, top right). The inverted float button should be the solid ink circle with the float shadow on any ground.

## The ask
The float panel and its rows read from ONE pair: if `--kol-menu-panel--float` paints the inverted float surface, its rows (label, icon, kbd, hover lift) take the inverted ink; if it is meant to sit on the theme's float surface, the panel background follows the theme. Either way: label contrast ≥ 4.5:1 in both themes, checked with `Menu variant="float"` portalled to body (no inverted ancestor).

## Recreation notes
- Consumer writes no override meanwhile; bumps when it ships.

## Built

kol-component 0.340.1 (2026-11-04). A float Menu no longer copies the trigger's `--kol-tone-panel-*` onto its portalled panel: the panel is the theme's float surface (`--kol-surface-secondary`, the float shadow), the rows keep theme ink (fg-88, the fg-16 lift, icons oq-88). That is the same pair as RailTrigger's card, the search modal and the float Dropdown (which already pins panel-bg on its trigger). Checked portalled to body with an inverted float trigger: label contrast 12.3:1 light, 13.2:1 dark. The trigger (`Button variant="float" tone="inverted"`) measured solid at rest in light (rgb 18,18,21); the mid-grey is its hover (`--kol-tone-hover-bg` oq-inverse-40), unchanged here. FloatActionMenu (kol-shell 0.107.0) is the corner record wanted.

## ✅ RESOLUTION — 2026-11-04 · kol-component@0.340.1

Menu variant="float" no longer copies the trigger's --kol-tone-panel-* onto its portalled panel: the panel is the theme's float surface (surface-secondary, the float shadow) under its theme-ink rows (fg-88, the fg-16 lift, icons oq-88), the pair RailTrigger's card, the search modal and the float Dropdown already use. Label contrast with an inverted float trigger, portalled to body: 12.3:1 light, 13.2:1 dark. The inverted float trigger is solid at rest; its mid-grey is the tone's hover (oq-inverse-40), unchanged.

**Remainder here:** none — kol-website bump kol-component ≥0.340.1; no override needed.

