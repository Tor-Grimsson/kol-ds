# HubHomeBackReveal

**Staged:** 2026-10-24 · from a kol-monitor session
**Change:** `HubHome` forwards `backReveal` (a file's, or a page-level prop) — Home's cards turn with `flip-image` whatever the app asks

---

## The problem, in one case
AppCardWholeFlip (kol-component 0.301.0 · kol-shell 0.81.0) shipped `flip-card` as the whole-card turn and `flipped` / `backHover` on `CatalogPage` and `HubHome`. Monitor adopted it: its Library (`CatalogPage`, `toCard` returns `backReveal: 'flip-card'`) turns whole cards on `F` — measured, every card `data-back="flip-card"`. Its Home does not: `HubHome`'s file → card map (`HubHome.jsx` ~line 168–185) passes `back` but never `backReveal`, so every Home card is the default `flip-image` — the cover turning over a plate that stays, the treatment the user rejected (*"I dont like the flip on image only"*). The twin `apps/rack-hub` has the same gap (its Home measures `flip-image` too).

## The fix
Forward it: `backReveal: item.backReveal` in the map, and/or a page-level `backReveal` on `HubHome` (as `flipped` / `backHover` are) passed to every card. Monitor passes `home={{ …, backReveal: 'flip-card' }}`.

## Definition of done
- [x] Home's cards honour `backReveal`; monitor's Home turns whole cards on F
- [x] Published; kol-monitor's receipt names the version

## 🟢 CLOSED — 2026-10-24 · kol-shell 0.82.0 live

`HubHome` takes a page-level `backReveal` (`flip-image` · `flip-card` · `hover`) for every Home card; a file's own `backReveal` wins. Twin: rack-hub's Home and Library pass `flip-card`. Walk `_tmp/2026-10-24-home-back-reveal/walk.mjs` 5/5 (every card `flip-card` on both pages, `F` turns all whole, no page errors). Registry live. Receipt returned to kol-monitor's outbox.
