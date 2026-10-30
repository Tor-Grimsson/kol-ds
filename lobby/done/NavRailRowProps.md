# NavRailRowProps — text case and icons on every rail row, as props, at every level

**Staged:** 2026-10-29 · from kol-website (record's rail, user: *"do these sub items: 1. prop text case? 2. accept icon?"* · *"this is exactly the kind of shit Im talking about costing us fucking roundtrips … be flexible. props are good. we use variants and presets to define how things ship, but props make things flexible."*)
**Files:** kol-component `organisms/NavRailSite.jsx` (what `NavRail variant="site"` and kol-framework's `SideNav` draw); kol-theme `kol-components-atoms.css` `.kol-sidenav-hop` (its `text-transform: uppercase`) and `.kol-sidenav-group` (the `uppercase` utility in the JSX).

## The problem
The site rail's case and icons are fixed by level:
- category rows are uppercase in the CSS;
- group labels are uppercase in the JSX;
- page rows print as written.

Only a category draws an icon. A page row, a group label or an action row ignores `icon`. record wants its Records sub-items (Education · Work · Awards …) in a different case and with icons, and there is no seam for either. The next app will want a different combination, so the fix is props at every level, not a new fixed look.

## The fix — props, with today's look as the default
- **Case:** a `case` prop on the rail, overridable per level and per node.
  - Values: `as-written` · `upper` · `lower` · `title` · `sentence`.
  - Rail-level props: `caseCategory`, `caseGroup`, `casePage`. Their defaults are today's: `upper`, `upper`, `as-written`.
  - Node-level: a `case` on any node wins over the level default.
  - Done in CSS (`text-transform`, plus a `::first-letter` for `sentence`) so the label stays the authored string for screen readers and search.
- **Icons:** `icon` on any node at any depth (page, group label, action row, nested child), drawn through the rail's `iconComponent` seam so custom registries work.
  - `iconSize` per level (default: 16 for a category, 12 for page and group rows), overridable per node.
  - Rows with and without icons align: a level where any row has an icon reserves the icon column for all its rows. Make that a rail prop, `alignIcons` (default `true`).
  - Collapsed rail: a page row's icon may show under its category; `collapsedIcons: 'category' | 'all'`, default `category` (today).
- **While you're in the row, the seams the next app will ask for** (optional, all default off):
  - `trailing` on any node: a count, a badge or a node, right-aligned (record's tab counts are the example).
  - `className` per node.
  - `title` per node (a tooltip when the label truncates).
  - `external: true`, which draws the external-link glyph and opens a new tab.
- Presets keep defining how a rail ships. These props only make each row overridable.

## Definition of done
- [ ] reference app: one site rail showing page rows in `upper` and `as-written`, page rows with icons beside ones without (aligned), a group label with an icon, and a `trailing` count; both themes, collapsed and open
- [ ] every rail in the estate renders unchanged with no new props passed
- [ ] published, versions named in the resolution


---

## Built — 2026-10-29 (publishes with kol-component 0.317.0, held for the user's review of BrandLabToolWindow)

- **Case:** `NavRail variant="site"` (kol-component `NavRailSite`, and so kol-framework's `SideNav`) takes `caseCategory`, `caseGroup` and `casePage`. The defaults are today's (upper, upper, as-written), and a `case` on any node wins. The values are as-written, upper, lower, title and sentence, done as CSS case utilities, so the label stays the authored string.
- **Icons:** `icon` on any node at any depth, through `iconComponent`. `iconSize` per level (`{ category: 16, group: 12, page: 12 }`) or per node. `alignIcons` (default on) reserves the icon column across a level. `collapsedIcons: 'category' | 'all'` (default category).
- **Per-node seams:** `trailing`, `className`, `title`, `external`.
- **Today's rail unchanged:** a row at its level's own look emits no new class, so a rail without the props renders as before. Site-hub's own rail was compared before and after: DOM, 28 rows of metrics and an element screenshot, all byte-identical.
- **Demo:** site-hub, "Mission log" on VOYAGER content.
  - Open: Overview is uppercase with a trailing 12, the other pages as written. Rows stay 18px, labels align at x=74 with or without an icon, and the group label carries an icon.
  - Collapsed (`collapsedIcons: 'all'`): the icon pages show under the category.
  - Checked in light and dark. Screenshots are in `_tmp/2026-10-29-navrail-props/`.
- **Docs:** 18-site-frame "Row props" table, and the inventory's NavRail row.

**Remainder at kol-website:** bump once published; record's Records sub-items take `casePage` / `case` and `icon`.
