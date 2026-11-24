# Plan — Figma scales: whole scales from code, and an icon mode that sizes

**Raised:** 2026-11-14, user. Points verbatim: *"there is so much randomness in the sizes. why is only 1.5 icon stroke size? or one panel border-w? why isnt there just available our spacing scale? same as fg oq scale?? or why is 64 highest padding, weird limit... etc stuff like this"*; *"make sure to import correctly and to order tokens in sequence in figma"*; *"doesnt make any sense like this.. SearchInput doesnt work with this for some reason, it just doesnt do anything to the icon.?"*; *"I also have the loader, and it has a dropdown, but it doesn nothing either"*.
**Status:** W1 and W2 built, 3.2 built — 2026-11-14, unpublished. Built already (2026-11-14): `tone/*` prefix on the 17 tone variables; `fg/06`, `oq/01`, `oq/40`, `oq/72` added to `theme`; collections `fg` (`fg/bg`) and `oq` (`oq/bg`), ten modes each (01 to 40, the plan's limit). Open: everything below.
**Shape:** W › phase › list.
**Laws carried:** copy the code, never choose a value; variables listed in sequence; the library is his to publish; nothing is deleted (a replaced variable is kept, `_` prefixed and hidden from publishing); a collection holds at most 10 modes; the API cannot reorder variables or modes, so order is set at creation.
**Home:** library `n48kE2bJtrFjl7wxst30xH`, variable collections `spacing`, `size`, `opacity`, `icon`; masters on Atoms and Molecules.
**How a phase closes:** acceptance line first, checked by a read-only script against code; one look at a master that uses the scale.

## W1 — Whole scales, in order

Cause: every variable was created the day one component needed one value. Nothing was laid down as a scale, so the lists are the leftovers of what got built: ten spacing steps ending at 64, no stroke widths, one opacity, and sizes that only exist as named one-offs.

### 1.1 — Spacing: the full 4px scale — ✅ built 2026-11-14 (34 steps in sequence; the ten old steps renamed `spacing-legacy/*`, bindings kept, each now pointing at its new step; rebinding layers off the legacy group is still open) (P: "why isnt there just available our spacing scale"; "why is 64 highest padding")
- One step per key of the scale code uses: 0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 72, 80, 96 (0 to 384px), value = key × 4.
- Created in that order as one group, so the list reads in sequence.
- The ten existing steps are rebound to the new ones wherever a layer uses them, then kept `_` prefixed and hidden from publishing.
- Acceptance: 34 steps, each value = key × 4; creation order equals numeric order; 0 layers on any master page still bound to an old step.

### 1.2 — The same steps for width and height — ✅ built 2026-11-14 (P: "same as fg oq scale")
- The spacing steps are scoped for gap, padding, width and height.
- Acceptance: every step carries all four uses; a frame's width can be bound to a step.

### 1.3 — Stroke width: a scale — ✅ built 2026-11-14 on my stops, for his review: `stroke/` 0, 0.5, 1, 1.5, 2, 3, 4 (P: "why is only 1.5 icon stroke size? or one panel border-w?")
- Proposed stops, from what code draws: 0, 0.5, 1, 1.5, 2, 3, 4.
- `tone/panel-border-w` and the `icon/stroke` values stay, pointing at the scale where a step matches.
- Acceptance: written once the stops are ruled.

### 1.4 — Opacity: a scale — ✅ built 2026-11-14 on my stops, for his review: 0, 01, 02, 04, 06, 08, 12, 16, 24, 32, 40, 48, 64, 72, 80, 88, 96, 100; `opacity/disabled` left at 50
- Proposed: the same stops as `fg` and `oq` (01 to 96), plus 0 and 100. `opacity/disabled` points at 48 or keeps 50 by his ruling.

### 1.5 — Named one-offs point at the scale — ✅ built 2026-11-14 (48 values now point at a step, 0 values changed; off the scale and left as numbers: content/* 1400 768 520 960 1800, ctl/sm 26, ctl/xs 22, rail-w 380 and 72, bp/* 640 to 1536, float/h-lg touch 52, float/ic 18, float/module-w 264 and 360, float/label-w 110, float/module-gap 18, float/list-row 34, float/window-w 562)
- `pad/*`, `gap/*`, `ctl/*`, `float/*` keep their names (masters bind them) and alias a scale step where their number is on the scale; the ones that are not (26, 22, 18, 110, 562…) are listed for his word, not forced.
- Acceptance: every named variable either aliases a step or is on the off-scale list; 0 named variables changed value.

## W2 — The icon mode sizes the icon

Cause, measured 2026-11-14: the `icon` collection holds one variable, `icon/stroke`. An icon's size comes from the `IconLoader` variant, and inside another component Figma takes a nested layer's width and height from the parent, so neither the `icon` mode nor the loader's own `size` dropdown can move the box (reproduced: `size` 18 → 24 inside `SearchInput`, box stays 18 × 18; the same swap on a loose `IconLoader` gives 24 × 24). In `SearchInput` the icon layer also pins its own mode, one layer below where he sets it.

### 2.1 — Prove it on a copy first — ✅ built 2026-11-14 (throwaways removed; `icon/size` added: 10, 12, 14, 16, 18, 20, 24, 40, 48)
- Add `icon/size` (10, 12, 14, 16, 18, 20, 24, 40, 48 per mode). A throwaway loader with width and height bound to it, nested in a throwaway component.
- Acceptance: on an instance of the throwaway component, changing the `icon` mode 18 → 24 and changing the nested variant 18 → 24 each give a 24 × 24 box. If either fails, stop and report; nothing real is touched.

### 2.2 — `IconLoader` binds its size — ✅ built 2026-11-14 (18 variants, 36 bindings, every variant still measures its size) (P: "I also have the loader, and it has a dropdown, but it doesn nothing either")
- Width and height of every `IconLoader` variant bound to `icon/size`; each variant keeps its mode pin.
- Acceptance: 18 variants, 36 bindings; a loose loader still measures its size in every variant.

### 2.3 — Pins: what the proof showed — ✅ built 2026-11-14 for `SearchInput` (P: "SearchInput doesnt work with this")
- Proof result: with size variants that pin their mode (as `IconLoader` has), a nested icon follows its own `size` dropdown and a mode set on the icon layer; a mode set on the parent component does NOT reach it. Dropping the pins from the variants would make the parent mode work, but then the `size` variants mean nothing. `IconLoader` keeps its variants and pins.
- `SearchInput`: the icon layers had a hard pin written on them, which also blocked the dropdown. They were reset so each takes its mode from its `IconLoader` variant (glyph, size, name and opacity kept; boxes 18 / 18 / 18 / 14 / 16 / 18 as before).
- Measured on a `SearchInput` instance: loader `size` 18 → 24 gives a 24 × 24 box and stroke 1.5; 18 → 14 gives 14 and 0.875; mode 40 on the icon layer gives 40 and 2.5; mode 24 on `SearchInput` itself leaves 18 (by design, above).
- Mistake on the way, fixed: clearing the pins first made every `SearchInput` icon 24; restored the same turn.
- Open: other masters whose icon layers carry a hard pin are not counted yet.

### 2.4 — Mode order — PARKED: Figma's default mode is always first
- The list is the default (24) then 10 to 48. A strict sequence makes 10 the default and shrinks every unpinned icon in every file.

## W3 — Lists ordered by relevance (P: "order also the colors tokens and styles based on relevance SURFACE is first. then fg then oq then other colors")

Read 2026-11-14: `theme` lists its groups in creation order, which happens to be alphabetical: accent, border, color, fg, fg-ab, fg-inverse, focus, oq, oq-ab, oq-inverse, palette, surface, tone, ui, glass, float, sheet, theme, editor. The library has no color styles; its styles are 15 text style folders and 2 effect style folders. The plugin API can reorder styles and style folders. It cannot reorder variables or variable groups: that order is creation order, or a drag in the variables panel.

### 3.1 — Color groups in `theme`: surface, fg, oq, then the rest — HIS DRAGS (the API cannot)
- Target order: `surface`, `fg`, `fg-inverse`, `fg-ab`, `oq`, `oq-inverse`, `oq-ab`, then `accent`, `border`, `focus`, `palette`, `color`, `tone`, `ui`, `glass`, `float`, `sheet`, `theme`, `editor`.
- Inside `fg` and `oq`: numeric order. Five sit at the bottom today: `fg/06`, `oq/01`, `oq/06`, `oq/40`, `oq/72`.
- Rebuilding the 163 `theme` variables in order instead is ruled out: other files bind them by key, and every binding in every file would break.
- Acceptance (checked by script after his drags): group order equals the target; `fg/*` and `oq/*` ascending.

### 3.2 — Text style folders by relevance — ✅ built 2026-11-14 on my order, for his review (`reader/*` renamed `folio/*`, `doc/*` renamed `workshop/*`)
- Proposed: the sets first (`article`, `site`, `research`, `reader` → `folio`, `doc` → `workshop`), then `sans`, `mono`, `serif`, `ui`, `card`, then the ones being folded (`prose`, `sheet`, `helper`, `table`, `float`).
- The API moves folders, so this one is mine to do once he rules.
- Acceptance: folder order equals the ruled order; 0 styles changed.

### 3.3 — From now on, order at creation
- Any new collection, group or scale is created in its final order (as `fg` and `oq` were), since it cannot be fixed afterwards by script.

## Order
2.1 → 2.2 → 2.3, then 1.1 → 1.2 → 1.5; 1.3, 1.4 and 3.2 after his rulings; 3.1 is his drags.
