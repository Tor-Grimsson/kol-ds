# CommandOverlayModes — the ⌘K modal as one overlay with modes, two-layer, page-aware

**Staged:** 2026-10-17 → kol-ds-ui · from kol-monitor · **a conversation as much as a build**

## The ask, in the user's words

> "can we make the modal more general then just search? bc search in the modal overlay is just one way of using
> the component right? add module would be another, shortcuts could be a third. etc? lets at least talk about
> that in the ticket" · "shortcuts could also use the 2 layer category system with back arrow" ·
> "shortcuts should probably be more context aware … im in dev, how can I cable lock here?"

## What exists

- `ShellSearchOverlay` already drills in: a row with `keepOpen` swaps the list (category → its items, a
  "← All" row back) — ShellSearchOverlayActionKeepsOpen, kol-fxr 2026-10-13. Monitor uses the flat form for
  ⌘K "add module".
- The Hub's shortcuts sheet (`S`) lists every section on every route. The keys themselves are route-local in
  monitor (C, O, P bind only on `/rack`), so on `/dev` the sheet lists keys that do nothing.

## 1 — Two layers with a real back control

- The first layer lists categories. Picking one opens its rows, and a **back arrow in the header** returns
  (plus Backspace on an empty field), instead of an "← All" row that scrolls away. Typing at either layer
  searches everything, grouped.
- Monitor's case: Generators · Math · Control · Display · Utility, plus 1U / 3U as a filter.

## 2 — One overlay, several modes (to discuss)

The overlay is a field plus a grouped list plus a footer of keys. Search is one use of it. Others:
- **add** — pick a module and it lands in the rack (monitor ⌘K today)
- **shortcuts** — the sheet as rows, grouped by section with the same back arrow; Enter runs the shortcut
- **go** — the rail's pages (the KOL site's ⌘K "Spaces")

Open questions for the KOL: one component with a `mode`, or `ShellSearchOverlay` generalised under a
neutral name (`CommandOverlay`)? Does `S` open the shortcuts mode of the same overlay, replacing the sheet?

## 3 — Page-aware

- Shortcut sections take `routes: ['/rack', '/create']`. The overlay or sheet shows the current route's
  sections first and the rest muted under "Elsewhere", never as if they work here.
- The same scope should drive which keys are bound, so the list and the behaviour come from one source.

## Acceptance

On monitor `/dev`: `S` shows App only, with Rack and Cables muted under Elsewhere. On `/rack`: ⌘K opens
categories, Generators → its modules, the back arrow returns, typing "noise" finds Noise from either layer.

## ✅ RESOLUTION — 2026-10-17 · kol-component@0.265.0

§1 and §3 shipped in kol-component 0.265.0 + kol-shell 0.65.0. Two layers: `ShellSearchOverlay onBack` / `backLabel` — a drill-in shows a back arrow in the field row (DS tooltip naming where it goes), Backspace on an empty field calls it, focus stays in the field; typing at either layer is your `results`, so "noise" finds Noise from both. Page-aware: shortcut sections take `routes: ['/rack']`; `ShortcutsOverlay currentPath` (AppHub passes it) shows this page's sections first and the rest muted under ELSEWHERE; `shortcutInScope(section, path)` is the same test for binding keys. Verified: Generators → modules → arrow back; on /dev the sheet shows App with Rack and Cables under ELSEWHERE, on /rack all live. §2 — one overlay with modes (CommandOverlay, `S` opening its shortcuts mode) — is held for the user's ruling in kol-ds-ui's plan (5.3).

**Remainder here:** none — kol-monitor bump kol-component@0.265.0 + kol-shell@0.65.0; drop the "← All" row for `onBack`; add `routes` to the Rack and Cables sections and bind their keys with `shortcutInScope`. §2 waits on the KOL ruling.

