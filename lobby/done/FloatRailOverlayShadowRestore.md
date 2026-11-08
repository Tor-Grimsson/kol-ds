---
component: FloatRailOverlayShadowRestore
source: kol-shell@0.104.0 FloatLayout · RailTrigger · kol-component@0.338.1 NavRailFloat — kol-website apps/record/src/App.jsx (record on FloatLayout)
staged: 2026-11-04
status: draft
deps: [FloatLayout, NavRailFloat, RailTrigger, PanelsRestore]
---

# FloatRailOverlayShadowRestore — the float rail floats, wears its shadow, and comes back from its card

## Purpose
record runs on `FloatLayout` (the user's mocks, proxy--components 256:17746). Three things he hit in the first hour, all in the frame:

## 1. Restore from the card
*"ok I opened the rail and now I cant get it back? … should be here or?"* — with the rail hidden, RailTrigger's card lists the nav rows but nothing brings the rail back; only Panels ⌄ (top right) does, which he did not find.
- Ask: the card gets a "Show navigation" row (at its foot, or a panel-left button beside its ×) that restores the rail as it was (`lastShown`, the same path as Panels ⌄).

## 2. The rail's shadow
*"why does shadow disappear when expanded?"* — the hidden state's pill and card carry the float shadow; `NavRailFloat` expanded (280) and collapsed (72) are flat on `surface-secondary`.
- Ask: the rail wears the same float shadow as the pill and card, in both widths.

## 3. Floating, not pushing
*"the Floating NAV isnt floating, its pushing the layout"* — `FloatLayout` lays the rail out beside the content (`flex gap-6`), so opening or collapsing it resizes the page.
- Ask (the general thing): a prop on `FloatLayout`, e.g. `railMode="overlay" | "push"` (default as today, `push`). `overlay`: the rail is positioned over the content (fixed/absolute at the frame's 24 inset, its shadow from 2), the content keeps the full width; collapse/expand/hide never move the page. The top bar and Panels ⌄ keep their places.

## 4. The flyout's title opens its section
*"library isnt clickable in Float, so you cant get to the overview page?"* — on the 72 rail, a section's hover flyout (RailFlyout) draws its title (icon · label) as plain text; the section's own page (`item.to ?? item.path`, the overview) is unreachable from the card.
- Ask: the flyout's title row is a link to the section's own page when the item has `to` (the same seam NavRailFloat's expanded row already reads), lit when that page is current.

## Recreation notes
- One release for all three; record bumps and passes `railMode="overlay"`. No local stopgap meanwhile.
- Filed alongside `RailShortcutsAllFrames` (the `\` / `⇧\` keys) — separate asks, same frame.

## Built
2026-11-04 — kol-shell 0.105.0 · kol-component 0.339.0 (one release with RailShortcutsAllFrames).
1. **Restore from the card** — RailTrigger `onRestore`: a **Show navigation** row at the card's foot brings the rail back as it was; FloatLayout passes `lastShown` (the Panels ⌄ path). The card also stopped drawing a blank row for a nav `{ heading }`.
2. **The rail's shadow** — NavRailFloat wears `--kol-shadow-float` (the pill's and the card's token) at 280 and 72.
3. **Floating, not pushing** — FloatLayout `railMode="push" | "overlay"`, default `push`. `overlay`: the rail is absolute at the frame's 24 inset over the content, the content keeps its full width, expand/collapse/hide never move the page; the top bar and Panels ⌄ stay put, the hidden state's RailTrigger sits over the bar's start.
- Files: packages/shell/src/FloatLayout.jsx, packages/shell/src/RailTrigger.jsx, packages/component/src/organisms/NavRailFloat.jsx; docs 11-shell-system, 24-float-system; api-tables.
- Consumer (record): bump, pass `railMode="overlay"`.

## ✅ RESOLUTION — 2026-11-04 · kol-shell@0.105.0 · kol-component@0.339.0

FloatLayout railMode="push" | "overlay" (default push): overlay floats the rail over the content at the 24 inset, so expand, collapse and hide never move the page; the top bar and Panels ⌄ stay put. RailTrigger's card ends on a Show navigation row (onRestore) that brings the rail back at lastShown. NavRailFloat wears --kol-shadow-float at 280 and 72.

**Remainder here:** none — kol-website bump kol-shell@0.105.0 + kol-component@0.339.0; pass railMode="overlay" on record's FloatLayout.

