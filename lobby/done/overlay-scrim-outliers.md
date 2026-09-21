# overlay-scrim-outliers — two overlays still paint their own scrim, blur included

**Filed:** 2026-09-03 ← **kol-client-olina**
**Packages:** `@kolkrabbi/kol-shell@0.50.0` — `src/ShortcutsOverlay.jsx#L59-L62`, `src/TouchDeviceOverlay.jsx#L38` · `@kolkrabbi/kol-theme@0.138.0` — `kol-components-molecules.css` § `.kol-overlay-scrim`
**Origin:** the user, opening the shortcuts sheet on olina's deck editor: *"wow where does this scrim come from? local?"* — then: *"yeah bc we removed the blur and put just color on the background, ticket ds tell them we missed this, and tell them to search for other outliers."*

## The problem

`.kol-overlay-scrim` is the law — one scrim, one tint, and its own comment carries
the two rulings: **no blur** (OverlayScrimBlur, 2026-09-01: *"the 1px blur bought a
compositing layer on every overlay open, on a phone, for a separation the tint
already carries"*) and **one tint at 48** (2026-09-03: *"makes sense to me they are
the same no?"*). `Modal`, `FullscreenOverlay`, `ShellDrawer`, `ShellSearchOverlay`,
`PageLayout`'s sidenav backdrop and `FieldRow` all wear it.

Two kol-shell overlays never moved. Both are the same line, verbatim:

```
className="fixed inset-0 select-none bg-fg-inverse-08"
style={{ … backdropFilter: 'blur(2px)', zIndex: … }}
```

- `ShortcutsOverlay.jsx:61-62` — an **8 % inverse-ink wash + a 2px blur**, on
  `var(--kol-z-modal)`. Opened from a page: the blur the ruling removed, on a tint
  that is neither the ladder's 48 nor its colour.
- `TouchDeviceOverlay.jsx:38` — the identical pair, on a literal `zIndex: 100`.

So the estate has two scrims again — the one the class was minted to be, and the
one these two still draw by hand. The class comment itself says *"three scrims
exist"*; that count is stale by the same two.

## What I saw while looking — for the sweep, not ruled here

The user asked for a search for other outliers. One grep across `component/src` ·
`shell/src` · `framework/src` for `backdropFilter | backdrop-blur | bg-fg-inverse-08 |
fixed inset-0`:

- `component/src/utilities/OverlayGlassPanel.jsx:37` — `backdropFilter: blur(${blur})`.
  A **panel**, not a scrim, and blur is its whole point — but it is the last
  `backdropFilter` in the packages after the two above, so it deserves the
  explicit "deliberate" note rather than being found again.
- `component/src/molecules/PlaybackBar.jsx:47` — `bg-fg-ab-48 backdrop-blur-xl`. A
  bar, ruled by the user per its docstring. Not a scrim; listed so the sweep can
  say it was seen.
- `component/src/utilities/AsciiCursor.jsx:482`, `LoaderOverlay.jsx:24` — `fixed
  inset-0` without a tint. Not scrims.

Everything else on `fixed inset-0` is already on the class.

## The ask

1. `ShortcutsOverlay` and `TouchDeviceOverlay` onto `kol-overlay-scrim` — the class,
   no `backdropFilter`, no `bg-fg-inverse-08`; `TouchDeviceOverlay`'s `100` onto
   `var(--kol-z-modal)` while it is open.
2. The sweep the user asked for: every overlay in the three packages either wears
   `.kol-overlay-scrim` or carries a one-line reason it does not. `OverlayGlassPanel`
   is the one candidate for the second list.
3. The class comment's *"three scrims exist"* updated to the real count.

## What stays at olina

Nothing local — the sheet is the DS's, opened as-is from `/slide-deck/:slug/edit`.
On ship: bump `kol-shell`, pin the number, look once.

## ✅ RESOLUTION — 2026-09-03 · kol-shell@0.51.0

kol-shell 0.51.0 · kol-component 0.179.0 · kol-workshop 0.28.0. `ShortcutsOverlay` and `TouchDeviceOverlay` wear `.kol-overlay-scrim` — no blur, no `bg-fg-inverse-08`; the touch notice's literal `100` is `var(--kol-z-modal)`. The sweep the user asked for ran across every package, not three, and found two more drawing their own: `Modal` (the docs had called it a wearer since 2026-08-01; the source drew a raw `rgba(0,0,0,0.5)`) and the workshop's `?` sheet (`bg-fg-48`, the ink wash). Nine scrims wear the class now; the class comment and the control-chrome + opacity docs carry the count and the list. Three overlays are not scrims on purpose and say so in source: `ParamSheet` (untinted, lifted verbatim from monitor's rack — the rack stays readable while a value is dragged), `OverlayGlassPanel` and `PlaybackBar` (surfaces that blur because blur is their point). `SelectionOverlay`'s `rgba` is a label chip on a canvas and `TiltBento`'s a tile's hover veil — noted, not scrims. Seen and left: `ShellDrawer`'s `z-[100]` and `PageLayout`'s `z-20` are raw z values in package chrome, another law's outliers, not this ticket's.

**Remainder here:** none — kol-client-olina bump kol-shell@0.51.0 · kol-component@0.179.0 (pin the numbers); look once at the shortcuts sheet on /slide-deck/:slug/edit.

