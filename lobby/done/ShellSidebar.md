---
component: ShellSidebar
source: kol-monorepo/apps/web/src/components/shell/ShellSidebar.jsx#L1-L149
date: 2026-07-03
status: draft
deps: [SidebarMenuItem, Icon]
---

# ShellSidebar

## Purpose
The shell's collapsible left-rail navigation: a labelled header (collapse the whole tree) over a route-tree of expandable section groups, each listing its child links. Sections auto-expand when they contain the active route. Supports both controlled and uncontrolled collapse of the root. Feeds off the same `routes`/`basePath` contract as the header.

## Anatomy
```
<div class="space-y-4">
  <div class="shell-sidebar-toggle shell-sidebar-label" (justify-between, pr-1)>   ← label header
    {labelTo ? <Link to={labelTo} class="shell-sidebar-label">{label}</Link>
             : <button onClick={handleToggle}>{label}</button>}
    <button onClick={handleToggle} aria-label="Expand/Collapse {label}">
      <Icon name="stroke-chevron-down" size=10 class="stroke-[2.5] {navCollapsed?'':'rotate-180'}"/>
  {!navCollapsed &&
    <div class="space-y-4">{routes.map(route →
      <div class="shell-nav-group">
        <button class="shell-nav-group-header w-full text-left" onClick={handleSectionClick}>
          <span class="flex items-center gap-2">
            <svg class="h-3 w-3 {isExpanded?'rotate-90':''}">▸</svg>   ← inline chevron
            {route.label}
          <span class="shell-nav-group-count">({children.length})</span>?
        {isExpanded && children.length > 0 &&
          <div class="shell-nav-items">{children.map(child →
            <NavLink to={childPath} end class="shell-nav-item{ active}">
              <span class="shell-nav-item-title">{child.label}</span>
```
`getSectionRootPath` (L5-L17) + `getChildPath` (L19-L23) resolve targets against `basePath` (absolute paths pass through; empty → `basePath`).

## Variants
- **Controlled** (`collapsed` defined) — root collapse driven by parent via `onToggle`.
- **Uncontrolled** — internal `internalCollapsed` state, toggled locally.
- **Link-label vs button-label** — `labelTo` makes the header label a `Link` (clicking it also expands if collapsed, and fires `onNavigate`); without it the label is a plain collapse `<button>`.
- **Per-section expand/collapse** — each group independently open; groups with no children render header only (no count).

## Props
| prop | type | default | controls |
|------|------|---------|----------|
| routes | array | `[]` | section groups + their `children` links |
| basePath | string | `'/'` | base for path resolution |
| onNavigate | fn(e) | — | called when any link is clicked (drawer uses it to close) |
| label | string | `'Navigation'` | header label + a11y strings |
| labelTo | string | — | if set, header label becomes a `Link` to this path |
| collapsed | bool | — | controlled root-collapse (presence switches to controlled mode) |
| onToggle | fn | — | controlled toggle handler (paired with `collapsed`) |

## States & interactions
- **Root collapse:** header chevron rotates (`rotate-180` when expanded); `!navCollapsed` gates the whole group list.
- **Active-route:** `useLocation()` → `normalizedPath` (trailing slash stripped). Initial `collapsedSections` map (L36-L47) opens the section whose path matches/`startsWith` the active path; a `useEffect` (L49-L60) re-opens the active section on every navigation.
- **Section toggle:** `handleSectionClick` flips that section's entry in `collapsedSections`.
- **Child links:** `NavLink … end` → auto `active` class; `onClick={onNavigate}` for drawer auto-close.
- No focus-trap / scroll-hide (the parent's sticky column handles scroll).

## Styling
- Tailwind `space-y-4`; the rest is app CSS hooks: `shell-sidebar-toggle`, `shell-sidebar-label`, `shell-nav-group`, `shell-nav-group-header`, `shell-nav-group-count`, `shell-nav-items`, `shell-nav-item` (+ `.active`), `shell-nav-item-title`. Chevron via `Icon name="stroke-chevron-down"` (root) and a raw inline `<svg>` ▸ (per-group).
- Transitions: `transition-transform` on both chevrons.
- **App-specific bits to DROP / convert:**
  - **Re-roll of the row markup → compose the DS `SidebarMenuItem` atom.** The group header + child `NavLink` rows here duplicate what `SidebarMenuItem` already does (icon + label, collapsed state, `hasChildren`/`isExpanded`, `is-active`, router-aware NavLink-or-anchor). Rebuild each group as a `SidebarMenuItem hasChildren` and each child as a `SidebarMenuItem to=…`.
  - **react-router** `NavLink`/`Link`/`useLocation` (L2) — `SidebarMenuItem` already degrades to `<a>` outside a router; keep active-detection but let it come from the atom or an injected `isActive(path)`.
  - Inline per-group `<svg>` chevron — replace with an `Icon`.
  - The `shell-nav-*` CSS classes are app-owned; `SidebarMenuItem` brings its own `sidebar-menu-item` styling, so most of these disappear on reconciliation.

## Dependencies
- **@kol/ui:** `Icon` (and, on reconciliation, **`SidebarMenuItem`**).
- **react-router-dom:** `NavLink`, `Link`, `useLocation` — folded into `SidebarMenuItem` / an `isActive` seam.
- React `useState` / `useEffect`.

## Recreation notes
- Tier: **organism** (route-tree nav; part of the shell). The *rows* are the `SidebarMenuItem` molecule/atom — compose them.
- Prop seams to keep: `routes`, `basePath`, `label`, `labelTo`, `onNavigate`, `collapsed`/`onToggle` (keep the controlled+uncontrolled duality).
- **Reconcile:** do NOT re-emit `shell-nav-group*`/`shell-nav-item*` markup — map `routes` onto `SidebarMenuItem hasChildren` groups + `SidebarMenuItem` leaf links. This kills the duplicate row styling and the raw chevron SVG.
- Keep the auto-expand-active-section logic (initial map + navigation effect) — that behavior isn't in `SidebarMenuItem` and is the sidebar's real value-add.
- Active detection should not hard-depend on react-router; expose an `isActive(path)` prop (default = router-aware) so the DS sidebar works router-free.
