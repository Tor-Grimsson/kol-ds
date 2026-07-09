---
component: SwatchControls
source: kol-monorepo/apps/brand/src/editor/color/SwatchControls.jsx#L1-L142
date: 2026-07-03
status: draft
deps: [ColorSwatch, Icon]
---

# SwatchControls

## Purpose
The Photoshop-style top row of a color panel, in two hand-tuned pieces:

- **SwatchStack** — the overlapping fill + stroke paint chips (fill upper-left, stroke lower-right) with a swap-arrow and a "set to none" marker. The active paint renders on top.
- **EyedropPick** — an eyedropper icon button plus a small sample chip showing the currently sampled color.

Both are controlled and store-free. The file header carries the same "DO NOT refactor pieces to atoms — the look is intentional and matches the Ref design" caveat as SpectrumControls: specific shadows, pixel offsets and the slash gradient are tuned. **Promote each WHOLE.**

## Anatomy
**SwatchStack** (`activePaint` selects one of two DOM-order variants)
```
<div class="relative shrink-0" style={44×44}>
  <button data-id="stroke"|"fill" style={CHIP_BASE + STROKE_SLOT, background:strokeColor}/>  ← rendered FIRST
  <button data-id="fill"|"stroke" style={CHIP_BASE + FILL_SLOT,   background:fillColor}/>    ← ACTIVE, rendered SECOND (paints on top)
  <SwapButton/>       ← top-right, EditorIcon "swap" 16
  <NoneMarker/>       ← bottom-left, slash-circle → onClear
</div>
```
`activePaint === 'fill'` → order is [stroke, fill]; `'stroke'` → [fill, stroke]. Positions are identical in both variants — **only render order flips**, so the active chip wins the overlap. No `z-index`, no `transform`.

**EyedropPick**
```
<div class="flex items-start gap-1 shrink-0">
  <button aria-label="Eyedropper" title="Pick a color from the canvas" onClick={onPick}>
    <EditorIcon name="eyedrop" size={24}/>
  </button>
  <FramedSwatch shape="circle" size={16} color={sampleColor} style={marginTop:4}/>
</div>
```
Internal helpers: **SwapButton** (`onSwap`, `aria-label="Swap colors"`, `EditorIcon "swap" 16`, `left:28 top:0`, `text-fg hover:opacity-80`). **NoneMarker** (`onClick={onClear}`, `aria-label="Clear color"`, 10×10, red-slash gradient). **FramedSwatch** (`span`/`button`, background = color, circle or square, framed shadow).

## Variants
- **SwatchStack `activePaint`**: `'fill'` | `'stroke'` — swaps which chip is frontmost (via DOM order, not styling).
- **FramedSwatch `shape`**: `'square'` | `'circle'` (internal; the sample chip uses `circle`).

## Props
| prop | type | default | controls |
|------|------|---------|----------|
| **SwatchStack** | | | |
| fillColor | string (css color) | `'#FFFFFF'` | fill chip `background` |
| strokeColor | string (css color) | `'#000000'` | stroke chip `background` |
| activePaint | `'fill'` \| `'stroke'` | `'fill'` | which chip renders on top |
| onSwap | ()=>void | — | click either chip or the swap arrow |
| onClear | ()=>void | — | click the NoneMarker |
| **EyedropPick** | | | |
| sampleColor | string (css color) | — | sample chip `background` |
| onPick | ()=>void | — | eyedropper button click |

## States & interactions
- **Chip stacking** — purely DOM order: active paint is the second (topmost) sibling in the 22×22 overlap. Fixed slots: `FILL_SLOT {left:5, top:6}`, `STROKE_SLOT {left:15, top:16}`.
- **onSwap** — fires from either chip *or* the swap arrow (all three call the same handler). The app swaps fill↔active; the component just signals intent.
- **onClear** — the slash-circle NoneMarker signals "set active paint to none".
- **Eyedropper** — `onPick` is where the app invokes the browser `EyeDropper` API and samples the canvas. The header says the button is "disabled when EyeDropper API isn't supported," **but the source does not implement that gate** — support detection/disabling happens at the call site today. The DS version should own a `disabled` prop.
- **hover** — icon buttons dim to `opacity-80`.

## Styling
- **Tailwind:** `relative shrink-0` (stack wrapper), `flex items-start gap-1 shrink-0` (eyedrop wrapper), `text-fg hover:opacity-80` (icon buttons), `rounded-full overflow-hidden` (NoneMarker), `inline-block` (FramedSwatch).
- **KOL tokens:** `text-fg` on icon buttons; `NoneMarker` frame `boxShadow: '0 0 0 1px var(--kol-fg-32)'`. The chip/FramedSwatch frame uses a literal `'0 0 0 1px #000, 0 0 0 2px #505050'` double-ring (intentional, matches the Ref) — the same halo SpectrumControls' handles use.
- **Drag/geometry mechanics:** none — this is static chrome. The interesting mechanic is the **overlap-by-DOM-order** trick (active chip second = on top, no z-index).
- **Constants:** `CHIP_BASE` = `{position:absolute, 22×22, borderRadius:50%, boxShadow:doubleRing, border:none, padding:0, cursor:pointer}`. Slots as above. NoneMarker gradient: `linear-gradient(45deg, #fff 0 42%, #DC2626 42% 58%, #fff 58% 100%)` (red diagonal slash on white = "none").
- **App-specific bits to DROP:**
  - `import EditorIcon` + `<EditorIcon name="swap"|"eyedrop">` — the editor's icon registry. Route through DS `Icon` or an injected `iconComponent` seam (same reconciliation as `EditorButton`). `swap` and `eyedrop` glyphs must exist in / be added to the DS icon set.
  - The **`EyeDropper` API call and canvas sampling** live behind `onPick` — app logic, stays out of the DS. Add a real `disabled` prop for the unsupported case.
  - **`FramedSwatch` is a near-duplicate of DS `ColorSwatch`** (framed square/circle color chip). Don't port it — recompose the sample chip and the paint chips onto `ColorSwatch` where the framed look can be matched, keeping the tuned double-ring shadow.

## Dependencies
- **ColorSwatch** (DS) — what the internal `FramedSwatch` (and arguably the two paint chips) should collapse onto.
- **Icon** (DS) — replacement target for `EditorIcon` (`swap`, `eyedrop` glyphs).
- `EditorIcon` (app) — stays in the app; the icon-injection seam is the reconciliation.

## Recreation notes
- **Tier:** molecule. Two sibling molecules (`SwatchStack`, `EyedropPick`) in the same color-picker family as SpectrumControls.
- **Controlled prop seam:** already clean — `{fillColor, strokeColor, activePaint, onSwap, onClear}` and `{sampleColor, onPick}`. Add `disabled` to `EyedropPick`.
- **Promote whole, do not decompose** — the header's "no atom refactor" applies. The exception is `FramedSwatch`, which is redundant with `ColorSwatch` and should be replaced, not promoted.
- **Reconcile the frame shadow** with `ColorSwatch`: this file uses a `#000 / #505050` double-ring for chips and a `--kol-fg-32` single ring for the NoneMarker. Decide one token-based framed-chip treatment in the DS and apply it consistently.
- **Text casing:** no user-facing copy; the only strings are `aria-label`/`title` (`"Swap colors"`, `"Eyedropper"`, `"Pick a color from the canvas"`, `"Clear color"`) — keep verbatim, authored at the component (they are accessibility labels, not rendered UI copy).
