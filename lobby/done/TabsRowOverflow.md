# TabsRowOverflow — TabsRow handles a row wider than its column, for every look

**Staged:** 2026-10-29 · from kol-website (§4 of `DocumentLibraryAndBoardParts`, appended after that ticket was filed and closed without it — refiled whole here; user on every ticket: *"make the tickets flexible, I dont wanna have to send the same ticket more then once"*)
**Files:** `apps/record/src/pages/Dashboard.jsx` (the wrapper this ticket retires); kol-component `molecules/TabsRow.jsx`

## The problem
`TabsRow look="underline"` with six tabs is 394px wide; at 390 the page scrolls sideways (record's dashboard: Tasks · Capture · Projects · Calendar · Metrics · Links). The row has no overflow handling of its own, so every consumer that has more tabs than a phone holds wraps it in its own `overflow-x-auto` div — record does now.

## The fix
- `TabsRow` handles overflow itself, for every look (`underline`, `chip`, `text`; `stacked` already has its phone bar).
- `overflow` prop: `scroll` (default) — sideways, no scrollbar, the shared `.kol-scroll-fade` at the clipped edge(s), the active tab scrolled into view on change; or `wrap` — tabs wrap to a second line.
- Keyboard: the roving tabindex keeps the focused tab in view.

## Definition of done
- [ ] six underline tabs at 390 in the reference app: no page scroll, the row scrolls with a fade, the active tab in view, in both themes
- [ ] `overflow="wrap"` shown beside it
- [ ] published, version named in the resolution


---

## ✅ RESOLVED — 2026-10-29

Shipped **kol-component 0.316.0 · kol-theme 0.199.0 · kol-shell 0.89.1**.

- **`TabsRow overflow`** works for every look but `stacked`.
  - `scroll` is the default. It keeps one line that scrolls sideways with no scrollbar, and the clipped edge(s) fade through the new `.kol-scroll-fade--x`, driven by `useScrollFade(ref, enabled, 'x')`.
  - The active tab (`data-active`) is kept in view whenever it changes, arrow keys included. The scroller moves by its own `scrollLeft`, so the page never scrolls with it, and it shrinks inside a flex row (`min-width: 0`).
  - `wrap` breaks the tabs onto a second line.
- `HubSettingsRail` and apps/rails asked for `wrap` explicitly, because their rows wrapped through `className="flex-wrap"`. kol-mirror's StudioRail does the same with two tabs, so nothing changes for it, but `overflow="wrap"` is the word now.
- Walked on the showcase's TabsRow preview at 390, which has six tabs (record's) under `scroll` and `wrap` side by side:
  - no page overflow;
  - the row is 268 wide and scrolls 368, with Links active, scrolled into view and fading on the left;
  - pressing → to Tasks scrolled back with a fade on the right;
  - `wrap` drew two lines;
  - checked in light and dark.

**Remainder at kol-website:** bump; drop record's `overflow-x-auto` wrapper in `Dashboard.jsx`.
