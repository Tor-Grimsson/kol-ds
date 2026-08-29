---
component: WorkspaceSidebar
source: kol-fxr src/editor/labs/LabsNav.jsx · kol-monitor src/rack/ModuloSidebar.jsx · kol-mirror src/components/mirror/MirrorSidebar.jsx
staged: 2026-08-27
status: draft
deps: [SideNav, useDragResize, Tooltip, kol-sidenav-*]
---

# WorkspaceSidebarGeometry

> The inbox file vanished from every lobby while the DS was building it (2026-08-27, mid-session — not this agent's hand); this copy is the entry as read, verbatim, so the record stands.

## The ask

**One sidebar geometry for the three workspace apps.** User, 2026-08-27: *"I see these 3 as very similar things"* and *"I would rather all use the same geometry layout."* They are three independent hand-rolls of one idea today.

## The three

| repo | file | lines | collapses? |
|---|---|---|---|
| kol-fxr | `src/editor/labs/LabsNav.jsx` | 576 | yes |
| kol-mirror | `src/components/mirror/MirrorSidebar.jsx` | 543 | **no** |
| kol-monitor | `src/rack/ModuloSidebar.jsx` | 250 | **no** |

~1,370 lines doing one job. Only fxr's implements collapse — `useDragResize`, the `:root[data-sidenav]` contract, the `kol-sidenav-*` class vocabulary and Tooltips on collapsed rows. The other two cannot collapse at all.

## The tell

**kol-fxr's fork wears `SideNav`'s CSS classes but does not import `SideNav`** — the whole vocabulary, hand-applied to hand-rolled markup. That is a consumer saying *the geometry is right, the component will not take my content*.

## Why the component will not take it

`SideNav`'s leaves are `NavLink to={row.to}` — routes, only. All three of these rails **dispatch** rather than navigate. And routing them is not a free fix: labs syncs `?preset=` with `replace`, never push, because *"the back button should leave labs, not walk a preset history."*

**Ask 1: an action leaf.** `{ label, onSelect }` beside `{ label, to }`, so a dispatching rail can use the component.

## Ask 2 — the collapse rule that makes the transition seamless

The reference is the brand sidebar: collapsed, it is the same rows minus their words, because **every top-level row carries an icon**. A row with no icon does not shrink, it **disappears** (fxr's text-only section headers). The rule: *a row that can survive collapse has an icon; one that cannot is not a row, it is a label.*

## Origin

Filed from **kol-fxr**, whose fork is the largest and the only one that already implements the collapse contract.

## ✅ RESOLUTION — 2026-08-27 · kol-framework 0.30.0

`SideNav` is the one geometry: (1) ACTION LEAVES — `{ label, onSelect, active? }` beside `{ label, to }`, at any depth and as a category (`{ id, label, icon, onSelect, active? }`): a `<button>` lit by `active`, never a route, no history walked. (2) ROUTER-AGNOSTIC — pass `currentPath` and the rail never calls react-router: route leaves render `<a href>` and call `onNavigate(event, to)`; a router-free app mounts it. (3) THE COLLAPSE RULE — a top-level node with no icon (and no `to` / `onSelect`) is a LABEL: `.kol-sidenav-section`, the eyebrow over its `pages`, hidden on collapse while the icon rows beneath stay. Existing trees render unchanged. Documented in `04-compositions/02-shells.md`. 22 gates clean; the showcase builds; verified in source only.

**Remainder here:** none — kol-fxr: bump kol-framework 0.30.0 and put labs on `<SideNav navTree currentPath onNavigate>` — sections as icon-less label nodes over action rows (`onSelect: pick(preset)`, `active`), groups as `{ label, children }` — and retire `LabsNav.jsx` + `.kol-labs-eyebrow` to `_tmp/`; kol-monitor's `ModuloSidebar` and kol-mirror's `MirrorSidebar` swap in their own tickets.
