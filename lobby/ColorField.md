---
component: ColorField
source: kol-monorepo/apps/brand/src/editor/compose/inspectors/LayerInspector.jsx#L704-L775
date: 2026-07-03
status: draft
deps: [ColorSwatch, Input, Popover]
---

# ColorField

## Purpose
An inspector color control: a color swatch button + an inline hex input, with a palette-reference popover grid behind the swatch. The user can type a literal hex without opening anything, or click the swatch to pick a named palette reference (Primary / Secondary / Light / Dark / Accent / Background). It's the composed, DS-facing counterpart to the raw pickers — pure composition over `ColorSwatch` + `Input` + `Popover`, no color math. Reused 4× in the compose inspectors (layer Fill, layer Stroke, pattern Tile bg, …).

## Anatomy
```
<LabeledControl label={hideLabel ? null : label}>
  <div class="flex items-center gap-2">
    <button ref={popover.ref} {...getReferenceProps} aria-label={`${label}: ${subtitle}`} class="inline-flex items-center shrink-0">
      <ColorSwatch hex={resolved} size={32} showTransparent={isNone}
                   transparentTone={isStroke ? 'error' : 'warning'} hoverable={false}/>
    </button>
    <Input variant="ghost" size="sm" prefix="#" chars={6} uppercase
           value={resolved hex} onChange={→ onChange('#'+…)}/>
  </div>
  <PopoverPanel class="bg-surface-secondary border border-fg-08 rounded p-2 flex flex-col gap-2 shadow-lg" style={minWidth:200}>
    <div class="grid grid-cols-6 gap-1">
      {refs.map → <ColorSwatch hex={resolveColor(ref)} size="fill" selected={value===ref.value} title={ref.label} onClick={→ onChange(ref.value)+close}/>}
    </div>
  </PopoverPanel>
</LabeledControl>
```
`subtitle` (used in the swatch's `aria-label`): `'None'` when value is null, else the ref's label when it's a `palette:*` ref, else `resolved.toUpperCase()`.

## Variants
- **hideLabel** — drops the `LabeledControl` label (pass `label={null}`), for tight/inline placements.
- **isStroke** (`label === 'Stroke'`) — a value-derived variant: the swatch's transparent tone is `'error'` (red) for stroke vs `'warning'` (yellow) for everything else. In the DS this should be an explicit `transparentTone` prop, not inferred from the label string.
- Value kinds (not a prop, but three rendering paths): `null` → None (transparent swatch), `'palette:*'` → named reference (swatch shows resolved hex, subtitle shows the ref label), literal `'#RRGGBB'` → direct color.

## Props
| prop | type | default | controls |
|------|------|---------|----------|
| value | `string \| null` | — | current color: `null` (None), `'palette:<name>'` ref, or literal `#hex` |
| onChange | (value:string)=>void | — | fired with a `#hex` (typing) or a `'palette:<name>'` (grid click) |
| palette | object (name→hex map) | — | resolves `palette:*` refs to literal hex |
| label | string | `'Color'` | `LabeledControl` label + `aria-label` prefix |
| hideLabel | bool | `false` | suppress the label |

## States & interactions
- **Type hex** — the `Input` fires `onChange('#' + typed.replace(/^#/,'').toUpperCase())` on every keystroke; always emits an uppercase `#`-prefixed literal, replacing any palette-ref binding.
- **Pick palette ref** — clicking a grid swatch fires `onChange(ref.value)` (e.g. `'palette:accent'`) and closes the popover. The swatch shows the resolved hex; the input shows the resolved hex too (typing over it converts back to literal).
- **selected** — the active ref's grid swatch shows `ColorSwatch selected`.
- **Popover** — `usePopover({ placement:'bottom-start', offset:4 })`, opened by the swatch button; `panel={false} focus={false}`.
- **None** — `value == null` renders a transparent swatch (`showTransparent`) with the tone-coded checker; subtitle `'None'`.

## Styling
- **Tailwind:** `flex items-center gap-2` (row), `inline-flex items-center shrink-0` (swatch button), popover panel `bg-surface-secondary border border-fg-08 rounded p-2 flex flex-col gap-2 shadow-lg` + `minWidth:200`, grid `grid grid-cols-6 gap-1`.
- **KOL tokens:** via composed atoms — `ColorSwatch` (`size`, `showTransparent`, `transparentTone`, `selected`, `hoverable`), `Input` (`variant="ghost"`, `size="sm"`, `prefix`, `chars`, `uppercase`). Panel uses `surface-secondary`, `fg-08` border tokens.
- **Color math / drag:** none — this is composition, not a picker. All resolution is delegated to `resolveColor`.
- **App-specific bits to DROP:**
  - **`PALETTE_REFS`** (hardcoded list `[{value:'palette:primary',label:'Primary'}, …secondary, light, dark, accent, bg]` defined at LayerInspector L28-L34) → make it a **prop** (`refs: {value,label}[]`), defaulted or required. The DS component must not bake in this app's palette names.
  - **`resolveColor(value, palette)`** (imported from the editor's `../state`, L12) maps a `'palette:<name>'` ref + a palette object → literal hex, returning `null` for None. It's app state logic. DS options: accept a `resolve` function prop, OR require the consumer to pass already-resolved swatch entries (`{value, label, hex}[]`) so the component stays resolver-agnostic. Prefer the latter — keeps the DS free of the `palette:` string convention.
  - **`LabeledControl`** wrapper is an app inspector primitive. Replace with the DS labeled-field equivalent, or build label rendering into the component (respecting `hideLabel`).

## Dependencies
- **ColorSwatch** (DS) — the swatch button and every grid cell.
- **Input** (DS) — the inline hex field (`variant="ghost"`).
- **Popover** (DS) — `usePopover` + `PopoverPanel` for the palette grid.
- `resolveColor`, `PALETTE_REFS`, `LabeledControl` (app) — all dropped/parameterized per above.

## Recreation notes
- **Tier:** molecule — pure composition over three DS atoms/molecules. No new tokens, no math.
- **Controlled prop seam:** already controlled (`value`/`onChange`). Turn the two hidden app dependencies into explicit seams: `refs` (or resolved swatch entries) instead of `PALETTE_REFS`, and drop `resolveColor` in favor of pre-resolved entries; make `transparentTone` an explicit prop instead of inferring it from `label === 'Stroke'`.
- **Promote whole vs decompose:** promote whole — it's already a thin composition. Do not further decompose.
- **⚠ Dedupe risk — pair with `SwatchRow` (the "color input row" pair to reconcile):** `ColorField` and `SwatchRow` are both *swatch chip + `#` hex `Input`* rows. `ColorField` adds a palette-ref popover; `SwatchRow` adds a lock toggle + token-name column. Before building both as separate DS components, design **one** `ColorInputRow` (or `ColorField` with slots) that covers both — a swatch + hex core with optional trailing affordances (palette popover / lock+token). Flag both briefs together at review.
- **Text casing:** ref labels (`Primary`, `Stroke`, `None`, etc.) and the `label` prop are authored at the call site — no auto-casing in the component. The `.toUpperCase()` calls are on hex digit strings only (values, not copy); keep them.
