# ShortcutsOverlaySections — the overlay needs a sectioned variant

**Staged:** 2026-08-15 · from **kol-fxr** (kol-design-editor)
**Nature:** action ticket. Close bar: kol-fxr renders its keymap through
`@kolkrabbi/kol-shell`'s `ShortcutsOverlay` with sections intact, and deletes
its local copy.

## The ask

`ShortcutsOverlay` takes ONE flat array — `[{ label, keys }]` — and renders a
single 2-column grid. kol-fxr's keymap is **sectioned** (Edit · Selection ·
Layer · Tools · View), and `state/keymap.js` already emits that shape via
`shortcutsBySection()`, which returns `[{ section, items }]`.

So the consumer cannot adopt the DS component without losing the grouping, and
has kept a 99-line local overlay instead. That local file is the thing this
ticket exists to delete.

Wanted: a **sectioned form** of the same component. Shape is the DS's call —
the obvious one is accepting either array form and grouping when it gets
`{ section, items }`, so every current caller is untouched.

## What kol-fxr looks like

- `src/editor/shell/ShortcutsOverlay.jsx` — 99 lines. Own scrim, own Esc
  listener, own panel markup, opened by a `kol:show-shortcuts` window event.
  Renders `shortcutsBySection()` grouped, each row `label` + `comboLabel(combo)`.
- The new settings page (`editor/home/SettingsView.jsx`, built today on
  `SettingsScaffold`) already renders the SAME array in the same sectioned
  shape — which is exactly the single-source pairing kol-shell's own
  `SettingsScaffold` docstring asks for.

## Not part of this ticket

`src/editor/labs/LabsShortcuts.jsx` is **not** a duplicate overlay and must not
be folded in. It is the "Animate any value" expression quick-doc — `EXAMPLES`
and `FUNCTIONS` mirroring what `params/expr.js`'s PRELUDE actually ships. Only
its 10-row `KEYS` array overlaps a keymap, and that is a kol-fxr-side problem.

## The deeper thing, flagged not asked

`keymap.js` is **not view-aware**. `LabsParams.jsx:26` binds `R` / `Shift+R` in
its own listener, so in labs those keys do something the keymap never hears
about — the keymap says `R → Rectangle tool` (`keymap.js:48`) while labs uses
`R → reset`. Both true, of different views, with nothing declaring it.

That is kol-fxr's to fix (a `views:` field beside the existing `section:`), and
it is why the settings page currently labels its list "the editor keymap"
rather than claiming to be universal. Noted here only so the DS knows a
sectioned overlay may later be asked for a per-view one.

## What stays in kol-fxr

- `shell/ShortcutsOverlay.jsx`, live until this ships.
- **On ship: adopt.** Delete the local overlay, feed `shortcutsBySection()`
  straight into the DS component, keep the `kol:show-shortcuts` event as the
  local open/close channel (the DS component is display-only by design and
  takes `onClose` — the consumer owns the state).

## ✅ RESOLUTION — 2026-08-15 · kol-shell@0.4.0

`ShortcutsOverlay` takes a SECTIONED array as well as the flat one, detected on shape: `[{section, items:[{label,keys}]}]` groups with headings, `[{label, keys}]` renders EXACTLY as before so no existing caller moves. ONE GRID, not nested ones — the headings span both columns (`gridColumn: 1 / -1`) so every keys cell stays on one axis; a grid per section would let each group compute its own column width and the keys would stagger down the panel. `keys` remains a display string and is still never bound: the component shows a keymap, it does not own one, so formatting a combo stays next to the binding. Adopted in kol-fxr the same run: the 99-line local overlay is now a ~30-line ADAPTER that owns only the open state and the `kol:show-shortcuts` window-event channel, mapping `shortcutsBySection()` into the DS shape; its Esc listener was dropped because the DS panel owns Esc and a second one would call onClose twice. Verified in a browser, not just compiled: S opens it, all six sections render (Edit · Selection · Layer · Tools · View · Color), the wrapper computes to `display: contents`, the heading resolves to `1 / -1` and its box matches the grid's full content width. 20 gates clean, registry-verified. NOT folded in: `LabsShortcuts.jsx` is the expression quick-doc, not a duplicate overlay. Also fixed by the swap: the local file's section titles used `uppercase tracking-widest`, against the no-text-transform law.

**Remainder here:** none — kol-fxr bump kol-shell >=0.4.0 — already done, adopted same-day.

