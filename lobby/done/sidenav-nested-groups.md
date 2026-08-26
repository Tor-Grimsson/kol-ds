# SideNav: render a nested `{ label, children }` group inside a category — the tree shape is the option, no prop

**Staged:** 2026-08-26 · from a kol-studio session
**Change:** kol-framework — `src/SideNav.jsx` (one walker, ~30 lines, reference attached) + `kol-framework.css` (one group-label rule) + the header comment's ruling re-scoped

---

## The problem, in one case

kol-studio moved off its inlined DS fork onto `@kolkrabbi/kol-framework` 0.23.0 today. Its Résumé category carried two sub-groups — **PDF** (Continuous · A4 · A4 Íslenska) and **Layouts** (Marginalia · Rail · Grid). The package's `SideNav` reads a category with `cat.pages ?? cat.children?.filter((c) => c.to)`: a nested `{ label, children }` node has no `to`, so both groups **and the six routes under them vanished from the rail, silently**. The consumer had to flatten them into `PDF · A4`-style leaves to keep the routes reachable — thirteen flat rows where there were nine plus two headers (`_assets/2026-08-26-sidenav-nested-groups/resume-hop-flattened.png`).

The cause is a ruling, not a bug. `SideNav.jsx`'s header says *"TWO LEVELS ONLY (elder ruling 2026-08-01). … The `#anchor` scroll-spied section layer is gone, and with it the group/section tree walkers."* That ruling was made **about the brand app's nav** (kol-website `apps/brand`, ported into the package 2026-08-09) and was inscribed as a law for every consumer. The user, on seeing the flattened rail, verbatim:

> "ok that is such a problem, sometimes Im talking about a specific thing and it gets applied as a literal fit-all rule, which isnt the case. its very hard to work in such uncertainty."

Killing the **scroll-spied `#anchor` section layer** was the ruling's substance. Nested **route** groups went with it as collateral.

## The fix

Bring back the group walker for route trees, and make the tree shape the opt-in:

- A category's children may contain `{ label, children: [{ to, label }, …] }` nodes. Such a node renders as a **non-routing group header** (the retired fork used `kol-sidenav-group kol-helper-10 text-subtle`, `text-emphasis` when a descendant is active) with its leaves indented one step under it. Groups may nest — the walker is recursive.
- A category whose children have no nested nodes renders **byte-for-byte as today**. The brand app's tree has none, so nothing there can move. No `nested` prop: an explicit flag would be a second way to say what the tree already says.
- Section anchors (`{ id }` leaves, scroll-spy) stay dead — that part of the 2026-08-01 ruling stands and is not reopened here.
- Re-scope the header comment: the ruling was the brand app's, about anchors; nested route groups are supported.

Reference implementation: `_assets/2026-08-26-sidenav-nested-groups/SideNav-inlined-kol-studio.jsx` — `GroupNode` (L69–92) and `ChildNode` (L94–112) are the walker; drop the `SectionLeaf`/`activeSectionId`/scroll-spy branches, keep the `child.children → GroupNode`, `child.to → RouteLeaf` dispatch. The group header rule lived in the fork's `kol-framework.css` as `.kol-sidenav-group`.

`hasActiveDescendant` should read the router (`useLocation` + the existing `isActive` prop), not a section id, so a group whose leaf is the current route lights up the same way a category does.

## Rejected alternative

- **A `nested` / `groups` prop on SideNav/AppShell** — adds surface for something the data already expresses, and every consumer that wants groups has to discover the flag. Rejected.
- **Consumer-side wrapper around SideNav** — a second nav implementation in a consumer is exactly the fork kol-studio just retired. Rejected.
- **Flattening with `Group · Leaf` labels** (what kol-studio ships today) — thirteen rows, the group name repeated on every leaf, and a copy change forced by chrome. It is the stopgap, not the answer.

## Definition of done

- [ ] `SideNav` renders a `{ label, children }` node inside a category as a group header + indented leaves; recursive
- [ ] A tree with no nested nodes renders identically to 0.23.0 (brand app unchanged — assert it in the showcase, not by reading)
- [ ] A group lights up (`text-emphasis`) when one of its leaves is the active route
- [ ] `.kol-sidenav-group` (or the successor name) rule in `kol-framework.css`, inside the components layer
- [ ] `SideNav.jsx` header re-scoped: the 2026-08-01 ruling killed anchors for the brand app; nested route groups are supported. Quote the user's 2026-08-26 sentence so the scoping has a source
- [ ] kol-framework version cited; kol-studio bumps, restores its two groups and drops the `PDF ·` / `Layouts ·` prefixes (📌 remainder there)

## ✅ RESOLUTION — 2026-08-26 · kol-framework@0.24.0 · kol-theme@0.52.1

`SideNav` renders a `{ label, children }` node inside a category as a non-routing group header (`.kol-sidenav-group kol-helper-10 text-subtle`, `text-emphasis` when a leaf beneath it is the current route) with its rows indented one `--kol-spacing-3` step, recursively; the active dot keeps its 0.875rem lead at every depth. The tree shape is the opt-in — no prop. `#anchor` leaves stay dropped. Asserted in the showcase, not by reading: the demo's flat tree renders byte-for-byte as 0.23.0 (aside outerHTML identical before and after the change); the demo now carries a `Chrome` group naming its own page — rendered lit, leaf active, group at 56px, leaves at 68px. Header re-scoped with the user's 2026-08-26 sentence quoted verbatim. Found on the way: the theme carried a dead elder `.kol-sidenav-group { padding: 4px 0 }` that outranked the framework's rule in the showcase — the showcase's `layer(components)` import lands framework chrome in a NESTED `components.components` layer, below every theme rule (pre-existing, not touched, flagged) — retired in theme 0.52.1 so one rule owns the box. The fork's `uppercase` on the group label does not return (type law).

**Remainder here:** none — kol-studio bump kol-framework to 0.24.0 and kol-theme to 0.52.1, restore the Résumé category's PDF and Layouts groups as `{ label, children }` nodes, drop the `PDF ·` / `Layouts ·` prefixes.

