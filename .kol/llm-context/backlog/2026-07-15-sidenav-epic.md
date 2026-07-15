# Parked: the sidenav epic

Flagged 2026-07-15 (late night), user's words: the sidenav family is wrong and
**so incomplete it needs its own epic just to scope** — he could not enumerate
the problems in-line. Treat everything below as the *known surface*, not the list.

## What exists today (the surface to audit)

- **Blocks** (`showcase/src/blocks/`): `sidenav-docs.jsx` (grouped docs nav + search,
  featured) · `sidenav-kol.jsx` (icon hops + expanding page tree, featured) ·
  `sidenav-workshop.jsx` (collapsible sections + quick actions). All three are
  presentational recreations with local state.
- **Components:** `kol-framework` `SideNav` (router-coupled app chrome, `.kol-sidenav*`
  chrome) · `kol-workshop` `ShellSidebar`/`WorkshopSidebar` (`shell-sidebar-*` +
  `shell-nav-*` chrome) — two parallel families.
- **Open question from the interrupted thread:** why the sidenav variants aren't
  cross-listed/discoverable together (e.g. at `/blocks` sidenav category vs the
  SideNav component page vs the workshop shell docs) — the user asked
  "why aren't both listed at blocks/sidenav-docs" before flagging the whole family.

## Adjacent state (done, don't redo)

- Ledger-2.0 #2.6 shipped: rail keeps `kol-helper-10` scale, row rhythm unified
  with `shell-nav-group-header` (6px), untyped wrapper boxes typed (theme 0.8.0 +
  workshop 0.1.6).
- The nav/rail chrome split (`shell-nav-*` vs `shell-sidebar-*` vs `.kol-sidenav*`)
  is itself a redundancy candidate — three sidenav chrome families across two
  packages plus three presentational blocks.

## Next arc

User opens the epic; expect a scoping doc from him. Do NOT start redesigning
sidenavs from this note alone.
