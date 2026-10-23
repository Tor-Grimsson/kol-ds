# AppCardDownloadClickBubbles

**Staged:** 2026-10-23 · from a kol-monitor session
**Change:** the `app` card's cover download control stops its click at the control (kol-component `AppItem.jsx`)

---

## The problem, in one case
Monitor's Home is `CatalogPage preset="app"` with `onClick: () => navigate(rack)` on every card and `download` from `toCard`. Pressing the download chip on the cover downloads the file AND opens the rack: `useAppItem` puts `<ActionButton … onAction={download} />` in `control` (`AppItem.jsx:89`) with nothing stopping the click, so it bubbles to the card's `onClick`. The plate's own controls already stop it (`AppItem.jsx:62`, `onClick={(e) => e.stopPropagation()}`); the cover control does not. Library hides it only because its card click draws nothing visible.

## The fix
Stop propagation on the cover download control, as the plate's column does — wrap it, or stop it in the `onAction` handler `useAppItem` builds. Same for the `app` row's download if it has the same path.

## Carry in kol-monitor (delete on ship)
`src/pages/HomePage.jsx` — `download: (e) => { e?.stopPropagation(); downloadPatch(p.file) }`.

## Definition of done
- [x] Download on an `app` card (and row) never fires the card's `onClick`
- [x] Published; kol-monitor's receipt names the version

## Resolution — 2026-10-22 · kol-component 0.294.0

- `useAppItem` builds the cover control with `onAction={(e) => { e?.stopPropagation(); return download(e) }}` — ActionButton calls `onAction` synchronously in its click handler, so the stop lands before the card sees it. The row has no download control.
- Verified in apps/catalog (App preset, a counting `onClick`): download → card clicks 0; card click → 1.
