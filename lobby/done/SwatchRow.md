---
component: SwatchRow
source: kol-monorepo/apps/brand/src/editor/compose/SwatchRow.jsx#L14-L54
date: 2026-07-03
status: draft
deps: [ColorSwatch, Input, Icon]
---

# SwatchRow

## Purpose
A single palette-slot editor row: a color chip that doubles as a lock toggle, a label, the resolved token name, and a `#` hex input. It's the row primitive of the compose Palette inspector — one per palette slot. Composes DS `ColorSwatch` + `Input` (+ an icon for the lock overlay) in a fixed 4-column grid.

## Anatomy
```
<div class="kol-swatch-row grid items-center gap-2 [opacity-30 pointer-events-none?] [is-unused?]"
     style={gridTemplateColumns:'24px 1fr 1fr 1fr'} aria-disabled={disabled||undefined}>

  <div class="group relative shrink-0" style={24×24}>                     ← col 1: chip + lock overlay
    <ColorSwatch hex={unused?null:hex} showTransparent={unused} size="stretch"
                 onClick={onToggleLock} aria-pressed={locked} title={locked?'Unlock':'Lock'}/>
    <span aria-hidden class="absolute inset-0 inline-flex items-center justify-center rounded-[2px]
          transition-opacity bg-fg-absolute-48 text-white pointer-events-none
          {locked ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}">
      <Icon name={locked?'lock':'unlock'} size={12}/>
    </span>
  </div>

  <span class="kol-helper-12 truncate {unused?'text-meta':'text-emphasis'}">{label}</span>       ← col 2: label
  <span class="kol-helper-10 truncate {unused?'text-subtle':'text-meta'}">{tokenName ?? ''}</span> ← col 3: token name

  <Input variant="filled" size="sm" prefix="#" chars={6} uppercase                                 ← col 4: hex
         value={(hex??'').replace(/^#/,'').toUpperCase()}
         onChange={→ onChangeHex('#'+…)} maxLength={6} class={unused?'opacity-50':''}/>
</div>
```
The lock overlay is a **sibling** absolute span (not inside the swatch) so the swatch's `overflow-hidden` clip doesn't cut it off.

## Variants
State-flag variants (all boolean props, additive):
- **disabled** — `opacity-30 pointer-events-none` + `aria-disabled`.
- **unused** — `is-unused` class; swatch goes transparent (`hex={null}`, `showTransparent`), label/token drop to muted tones (`text-meta`/`text-subtle`), input dims (`opacity-50`).
- **locked** — lock overlay pinned visible (`opacity-100`), swatch `aria-pressed`, title `Unlock`.
- **edited** — destructured in the signature but **currently unused in the render** (dead prop, or a hook for an "edited" affordance never wired). Flag it: either implement the visual or drop the prop in the DS.

## Props
| prop | type | default | controls |
|------|------|---------|----------|
| label | string | — | col-2 slot label |
| hex | `string \| null` | — | swatch color + hex input value |
| disabled | bool | — | dims row, blocks pointer, `aria-disabled` |
| unused | bool | — | `is-unused` muted styling, transparent swatch |
| locked | bool | — | lock overlay visible, `aria-pressed`, title |
| edited | bool | — | **currently unused** (see Variants) |
| onToggleLock | ()=>void | — | swatch click → lock/unlock |
| onChangeHex | (hex:string)=>void | — | hex input change, emits `#UPPER` |

## States & interactions
- **Lock toggle** — the whole `ColorSwatch` is the toggle: `onClick={onToggleLock}`, `aria-pressed={locked}`, title flips `Lock`/`Unlock`. Overlay is shown always when locked, on hover otherwise (`group-hover`).
- **Hex edit** — `Input onChange` strips a leading `#`, uppercases, re-prefixes `#`, and calls `onChangeHex`; `maxLength={6}`, `chars={6}`. Value is normalized the same way on the way in.
- **disabled** — pointer events off for the whole row.

## Styling
- **Tailwind:** `grid items-center gap-2` with explicit `gridTemplateColumns:'24px 1fr 1fr 1fr'`; `group relative shrink-0` chip cell; overlay `absolute inset-0 inline-flex items-center justify-center rounded-[2px] transition-opacity … pointer-events-none`; labels `kol-helper-12`/`kol-helper-10 truncate`.
- **KOL tokens:** `bg-fg-absolute-48` + `text-white` on the lock overlay; text tones `text-emphasis` / `text-meta` / `text-subtle`; type classes `kol-helper-12` / `kol-helper-10`.
- **App CSS:** `kol-swatch-row` and its `.is-unused` modifier are an app stylesheet class. Port the needed rules to Tailwind/DS tokens, or bring a `kol-swatch-row` recipe into the DS theme — don't leave the component depending on an app-only class.
- **Composed atoms:** `ColorSwatch` (`size="stretch"`, `showTransparent`, `hex`), `Input` (`variant="filled"`, `size="sm"`, `prefix="#"`, `uppercase`).
- **Color math / drag:** none — display + text input only.
- **App-specific bits to DROP:**
  - **`tokenNameFor(hex)`** (imported from `../modes/palette/pools`) maps a hex → the palette token name for col 3. App state. Make it an **optional prop** (`tokenName?: string`) or a **render-prop** (`renderTokenName?: (hex)=>ReactNode`); when absent, render the empty col (or collapse it).
  - **`EditorIcon`** (`lock`/`unlock`) → DS `Icon` or injected icon component (same seam as `EditorButton`/`SwatchControls`).

## Dependencies
- **ColorSwatch** (DS) — the chip + lock toggle surface.
- **Input** (DS) — the `#` hex field (`variant="filled"`).
- **Icon** (DS) — `lock`/`unlock` glyphs (replacing `EditorIcon`).
- `tokenNameFor`, `EditorIcon`, `kol-swatch-row` CSS (app) — dropped/parameterized/ported per above.

## Recreation notes
- **Tier:** molecule — a composed row, no new math.
- **Controlled prop seam:** already controlled (`onToggleLock`, `onChangeHex`). Add the `tokenName`/`renderTokenName` seam to replace `tokenNameFor`; decide the fate of the dead `edited` prop.
- **Promote whole vs decompose:** promote whole. The 4-column grid + lock-overlay-as-sibling is the point; don't split.
- **⚠ Dedupe risk — pair with `ColorField` (#3), the "color input row" pair to reconcile:** both are *swatch + `#` hex `Input`* rows. `SwatchRow` = lock toggle + token-name column (palette editing); `ColorField` = palette-ref popover (layer color assignment). Design **one** `ColorInputRow` core (swatch + hex) with optional trailing affordances rather than shipping two overlapping molecules. Review the two briefs together.
- **Text casing:** `label` and token names are authored/derived at the call site — no auto-casing in the component. The `.toUpperCase()` is on hex digits only (a value, not copy) — keep it; do not add it to `label`.
