---
component: ComboLab
source: kol-labs-monorepo/apps/generator/src/editor/modes/palette/ (ComboLab.jsx, PaletteCanvas.jsx, PaletteControls.jsx, layouts.jsx, palettes.js, pools.js, colorMath.js, state.jsx)
date: 2026-07-10
status: built
deps: [ViewToggle]
built:
  - packages/styleguide/src/ComboLab.jsx
  - packages/styleguide/src/comboLayouts.jsx
  - packages/styleguide/src/comboMath.js
---

# ComboLab

## Purpose
The 60 / 30 / 10 color-combination playground — the headline color specimen of the brand guide. Pick a layout, watch a role-palette (primary / secondary / light / dark / accent) applied across six geometries, toggle a logo into the slots, and hit Randomize to sweep new combinations. Includes the **Applied card** layout: the brand-application ("business card") mockup — a logo plate + surface + accent chips + bands. A live hex readout mirrors the active palette.

The monorepo original was an entire editor *mode* (an `EditorShell` with a canvas panel + a tool-properties rail wired to the compose store). This is the standalone, data-injected distillation: the same layout primitives + the same palette engine, driven by local `useState` and props.

## Anatomy
```
<div class="kol-combo-lab">
  <div class="kol-combo-controls">
    <Row label="Layout">   <ViewToggle options={layouts} .../></Row>
    <Row label="Palette">  <ViewToggle options={palettes} .../></Row>   // only if `palettes` given
    <Row label="Logo">     <ViewToggle variant="single" off/on .../></Row> // only if `logo` given
    <div class="kol-combo-footer">
      <button class="kol-combo-randomize kol-helper-10">↻ Randomize</button>
      <span class="kol-combo-footer-desc kol-helper-10 text-meta">{active.description}</span>
    </div>
  </div>

  <div class="kol-combo-stage-wrap">
    <div key={layoutId+colorsKey} class="kol-combo-stage-anim">
      <LayoutComponent palette={active} logo={logoOn ? logo : null}/>   // one of 6 primitives
    </div>
  </div>

  <div class="kol-combo-readout">
    {Primary/Secondary/Light/Dark/Accent → <SwatchRow chip + label + hex/>}
  </div>

  <p class="kol-combo-summary kol-helper-10 text-meta">
    {layout.label} × {palette.label} × {logoOn ? 'Logo' : 'No logo'}
  </p>
</div>
```

Layout primitives (`comboLayouts.jsx`, each `{ palette, logo }`), all built on the DS `.kol-combo-*` class contract:
- **RatioBar** (`ratio-603010`) — 3 slabs at flex 1 / 3 / 6 = 10 / 30 / 60.
- **Tower** — 4 stacked bands (primary logo band + secondary / light / dark).
- **QuadSplit** — 50 primary | (25 light / 25 dark) column, accent label.
- **CardRow** — 4 discrete cards in a `repeat(4,1fr)` grid.
- **StripeRow** — Method 01 (6/3/1 proportion bar) + Method 02 (split-row), neutral rule + accent border via `--stripe-rule` / `--stripe-accent` custom props.
- **AppliedCard** — the applied-brand mockup: logo plate (flex 2) + swatch column (surface + 2 accent chips + lg/sm bands).

## Variants
- **`palettes` given** — a Palette toggle row appears; Randomize picks a different named palette from the set.
- **`pool` given** (hex array) — Randomize *generates* a palette by sampling the pool via `comboMath` (`generatePalette` pool path + the chosen `mode`).
- **neither** — Randomize derives a fresh palette from the current primary (seed path). This is the default so Randomize always does something without any injected data.
- **`logo` given** — logo slots populate + a Logo on/off toggle appears; absent → no logo row, slots render nothing.
- **layout subset** — pass `layouts` (subset of `COMBO_LAYOUTS`) to limit the picker.

## Props
| prop | type | default | controls |
|------|------|---------|----------|
| palette | role-palette obj | `DEFAULT_PALETTE` | initial `{id,label,description?,primary,secondary,light,dark,accent}` |
| palettes | role-palette obj[] | — | named set; enables the Palette toggle + set-based randomize |
| layout | string (layout id) | first of `layouts` | initial layout |
| layouts | `{id,label}[]` | `COMBO_LAYOUTS` | which layouts the picker offers |
| logo | ReactNode | `null` | node dropped into logo slots; enables the Logo toggle |
| pool | string[] (hex) | — | sampled by generative randomize |
| mode | string (mode id) | `'random'` | generation mode (see `GENERATION_MODES`) |
| className | string | `''` | passthrough onto `.kol-combo-lab` |

## States & interactions
- **Layout pick** — `ViewToggle` sets `layoutId`; the stage key changes → `.kol-combo-stage-anim` replays its 260ms fade.
- **Palette pick** — sets `active` to the chosen named palette (only when `palettes` is passed).
- **Logo toggle** — `variant="single"` flips `logoOn`; slots receive the node or `null`.
- **Randomize** — always changes the layout (to a different one where possible) and the palette. Palette source: named set → generative pool → generative seed, in that order.
- **Readout** — 5 rows reflect `active`; hex is `.toUpperCase()`-d (value formatting, not copy casing).
- **Stage animation key** — `` `${layoutId}-${colorsKey}` `` where `colorsKey` is the 6 palette hexes joined, so both a layout change and a color change retrigger the fade.

## Styling
- **DS classes (reused verbatim, not re-invented):** `.kol-combo-lab`, `-controls`, `-row` / `-row-label` / `-row-controls`, `-footer` / `-footer-desc`, `-randomize`, `-stage-wrap`, `-stage-anim`, `-readout`, `-swatch-row` / `-swatch-chip` / `-swatch-label` / `-swatch-hex`, `-summary`; the stage set `-stage` / `-frame` / `-slab(+--end/--between)` / `-label` / `-number` / `-logo`, `-stage--{fill,ratio,tower,quad,card-row,stripe-row,applied}`, `-quad-col`, `-card(+--end/--between)`, `-stripe-*`, `-applied-*`. Shipped today from `packages/framework/kol-framework.css` (the `.kol-combo-*` cluster), destined for `packages/theme/kol-components-styleguide.css`.
- **Type (inline, DS scale):** `kol-helper-10` (row labels, footer desc, randomize, summary), `kol-helper-12` (readout label/hex). NB: the monorepo/kol-client used `kol-helper-xs-2` / `kol-helper-xxs` and `text-lede` / `text-auto` — the first two do **not** exist in this DS (scale is `kol-helper-{8,10,12,14,16,20}`) and `text-lede` does not exist (only a stale mention in a framework comment). Mapped to `kol-helper-10/12`, `text-emphasis`, `text-meta`, `text-auto` (all confirmed present).
- **Color (inline):** the only inline colors are the palette's literal hex applied as `background` / `color` in the layout primitives — content, not chrome. `fgOn(bg)` picks a legible ink per slot. Lab chrome colors come from the class layer (`--kol-fg-*` tokens).
- **No auto text-transform authored:** the reused `.kol-combo-label` / `-number` / `-stripe-method` / `-swatch-hex` classes carry their own baked casing (faithful port of the DS-shipped contract); no `uppercase` utility is added to any string this component authors.

## Dependencies
- **ViewToggle** (`@kolkrabbi/kol-component`) — the layout / palette / logo pickers (`variant="text"` + `variant="single"`).
- **comboLayouts.jsx** (new, this package) — the 6 stage primitives + `LAYOUT_COMPONENTS` + `COMBO_LAYOUTS`.
- **comboMath.js** (new, this package) — `generatePalette`, `fgOn`, `hexToHsl`/`hslToHex`, `GENERATION_MODES`.

## Severed couplings (monorepo → DS)
| dropped | was | replaced with |
|---|---|---|
| `EditorShell` + `PALETTE_REGISTRY` + `LayerStack` | ComboLab.jsx *was* an editor-mode shell mounting canvas + rail panels | a self-contained composed component |
| `useComposeState` | pool/mode/colors/locks/bgOn/randomize/save lived in the compose store | local `useState` (`layoutId`, `active`, `logoOn`) + props |
| `usePaletteState` (state.jsx) | layoutId / logoId / seedColor context provider | local `useState` |
| `Canvas` (PaletteCanvas.jsx) | pan/zoom/aspect editor canvas | `.kol-combo-stage-wrap` + `.kol-combo-stage-anim` (DS classes) |
| `useGeneratorLibrary` + `useNavigate` | Save-to-library + Send-to-compose buttons | dropped (app workflow, not a specimen) |
| `Dropdown` / `Section` / `SwatchRow` (compose) / aspect controls | editor rail chrome | `ViewToggle` + local `Row` / `SwatchRow` using DS classes |
| `KolLogo` import (layouts.jsx) | hard brand-logo component in `LogoSlot` | `logo` **prop** — a consumer-injected React node |
| `resolveCssVar` + `pools.js` (`POOLS`, `RAMP`, `TOKEN_NAMES`) | live-resolved brand ramps from the CSS-var cascade | dropped — duplicates the DS token layer; palettes/`pool` are injected as literal hex |
| `BRAND` config (`LOGOS`) | brand name/logo metadata | dropped — logo is a node, palettes carry their own labels |
| `data-reveal` attributes | scroll-reveal hooks (start `opacity:0`, need the host's IntersectionObserver) | dropped — would render the lab invisible in any host without the observer |
| slide layouts (`slide-layouts.jsx` → `SlideDeck`) | 3 typographic slides spread into `LAYOUT_COMPONENTS` | dropped — gated (demos/sets/blocks), depends on the SlideDeck loader |

## Recreation notes
- **Tier:** organism — a self-contained composed region (controls + stage + readout) over one DS atom (`ViewToggle`) and two local helper modules.
- **Controlled seam:** currently uncontrolled (local state, initialised from props). If a host needs to drive it, add `layout`/`onLayoutChange` + `palette`/`onPaletteChange` controlled pairs; the internals already funnel through `setLayoutId` / `setActive`.
- **Palette shape is the contract:** every layout reads `{primary, secondary, light, dark, accent}`. `generatePalette` returns a 6th `bg` slot (kept on generated palettes as `.bg`) — unused by the readout, available to a host that wants a backdrop.
- **Text casing:** role labels (`Primary` …) and control labels (`Layout`, `Palette`, `Logo`, `No logo`, `Randomize`) are authored at call sites in their display case; `.toUpperCase()` is applied only to hex value strings.
- **Where the CSS should live:** the `.kol-combo-*` rules currently sit in `kol-framework.css`; `kol-components-styleguide.css` is the intended home per its own header. No CSS was added or moved by this build — the existing cluster already covers every class used here (see "CSS gaps" in the handoff: none).
