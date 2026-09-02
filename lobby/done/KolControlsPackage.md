# KolControlsPackage — the rack's hardware controls as a published KOL package

**Filed:** 2026-09-01 · from **kol-monitor** · kol-component 0.151.0 · kol-theme 0.121.0
**Kind:** proposal for a new package + inventory — not a defect
**User's words (2026-09-01):** *"make a controls package in the ds, and also take components from fxr and mirror … leds and the colors should stay, they are unique to this set … the modules and the composition should live locally, but the controls could be used elsewhere and be in a published package called controls … it's mainly about mixer strips, knobs and stuff specific to modules, mixers and synth hardware."*

## The finding

Monitor's rack is built from 12 panel controls in `src/modules/parametric/` plus the
jack, the rails and a touch value-sheet. Check 4 of the full-consumption greps has
flagged two of them (`Slider`, `Dropdown`) since 2026-08-30 as "share a name with a DS
component" — and the honest answer was never rename, and never swap them for the DS's
app atoms: a `kol-component` Slider is app chrome; a rack slider is a 2px track on a
24px-tall eurorack panel. They are a different TIER — instrument-panel hardware — and
kol-mirror (a CRT bezel, a transport/clock deck) and kol-fxr (editor controls) carry
the same tier as local forks today.

As of 2026-09-01 every one of these controls reads tokens, not literals
(`kol-monitor/.kol/llm-plan/12-module-inks-audit.md` — 230 raw inks → 0), so they are
liftable as they stand: the fg/oq ladder from kol-theme, plus one small hardware token
layer they bring with them.

## The ask

A new package, **`@kolkrabbi/kol-controls`** — hardware panel controls for
instruments (mixers, synths, racks, decks). Its own CSS layer (`kol-controls.css`:
the hardware + LED tokens below and the few rules a class cannot carry), consuming
kol-theme's ladder, icons through the `iconComponent` seam the DS Button already uses.
Modules, rack composition, routing and render loops stay in the consumers.

### Inventory — kol-monitor (source paths, all in `src/modules/`)

| Control | Source | What it is | Props | Tokens it reads |
|---|---|---|---|---|
| **Knob** | `parametric/Knob.jsx` | SVG rotary, sizes sm 24 · md 32 · lg 40 · xl 64; 270° sweep; drag ns (200px = range); ⌥-click → default; touch long-press → ParamSheet | `value onChange min max label variant(column·row·row-left·row-right) bipolar labelMinWidth size defaultValue` | cap `--monitor-hw-cap` · rim `--kol-fg-24` · needle `--monitor-hw-on-cap` · label `kol-helper-8 text-fg-32` |
| **Slider** | `parametric/Slider.jsx` | 2px track + 8px round thumb; horizontal (flex-1 + numeric readout) or vertical (fixed height); long-press → ParamSheet | `value onChange min max step label direction height` | track/fill `bg-fg-16` · thumb `bg-fg-72` · label + readout `text-fg-32` |
| **Toggle** | `parametric/Toggle.jsx` | LED-dot toggle, sm 8 · md 12; momentary, blink, long-press, forceLit | `value onChange label horizontal size padding momentary color onLongPress blink blinkPeriodMs forceLit` | dot `--monitor-led-red` (default) · label `text-fg-32` |
| **FlipToggle** | `parametric/FlipToggle.jsx` | 2/3-position rocker, horizontal or vertical, up to three labels | `value onChange positions direction labelA labelB labelC` | track `--monitor-hw-cap` + `--monitor-hw-cap-edge` · thumb `--monitor-hw-on-cap` · labels `text-fg-32` |
| **LED** | `parametric/LED.jsx` | 6 / 8px lamp; red · yellow · green · white · blue; optional hit pad (+5px) | `active color size onClick` | `--monitor-led-*` · white `--kol-fg-88` · off `--kol-fg-16` · glow `color-mix(led 40%)` |
| **IconButton** | `parametric/IconButton.jsx` | 1px-bordered icon key, radius 3, momentary pulse | `icon active onClick disabled title momentary iconSize` | active `--monitor-led-red` border + 15% fill · ink `--kol-fg-88` / `--kol-fg-32` · rest border `--kol-fg-08` |
| **Selector** | `parametric/Selector.jsx` | ‹ value › stepper over a list | `value options onChange` | arrows `text-fg-40` · value `text-fg-64` |
| **Dropdown** (panel) | `parametric/Dropdown.jsx` | `kol-helper-8` trigger + portalled option list | `value options onChange label` | trigger `text-fg-64 bg-fg-04 border-fg-08` · panel `bg-surface-primary border-fg-08` · option `text-fg-88 bg-fg-04` / `text-fg-48` — **compare with kol-component `Dropdown`; may collapse onto it** |
| **TextInput** (panel) | `parametric/TextInput.jsx` | commit-on-blur/Enter field | `value onChange onCommit placeholder className` | `bg-surface-primary text-fg-96` — **compare with kol-component `Input`; may collapse onto it** |
| **LabeledControl** | `parametric/LabeledControl.jsx` | label wrapper, 4 positions | `label horizontal labelPosition labelClass gap` | `text-fg-32` |
| **ModuleHeader** | `parametric/ModuleHeader.jsx` | Toggle + module name + edit-mode remove dot / bypass LED | `label isOn onToggle editMode onRemove onBypass bypassed` | name `kol-helper-10 text-fg-48` · dot `--monitor-led-yellow` · bypass `--monitor-led-blue` |
| **JackSocket / LabeledJack** | `utility/JackSocket.jsx` · `parametric/LabeledJack.jsx` | 3.5mm jack: ring (well) + hole + label; the ring's rim glows with the signal (hex + alpha, throttled rAF) | presentational: `type(in·out) size label labelPosition icon active color`; **routing (drag-to-patch, registry, pending cable) stays in the consumer** | well `--monitor-hw-well` · rest rim `--kol-fg-24` · hole rim `--monitor-hw-cap-edge` / `--monitor-hw-shade` · roles `--monitor-led-red` (out / cv) · `--kol-cv-attenuate` · `--kol-signal-input` |
| **RockerSwitch** | inside `utility/PowerModule.jsx:24-76` | I/O rocker, backlit paddle | `on onToggle` | housing `--monitor-hw-cap` + `-cap-edge` · paddle `--monitor-led-red` / `--monitor-hw-cap-edge` · glyph `--kol-color-ab-white` / `--monitor-hw-on-cap` |
| **ParamSheet** + `armLongPress` | `parametric/ParamSheet.jsx` · `hooks/armLongPress.js` | touch: hold a control 500ms (<6px slop) → full-width bottom sheet with the DS Slider; Esc / tap-outside closes | `label value min max step defaultValue onChange onClose` | plate `bg-surface-primary border-fg-08` at `--kol-z-modal` |
| Rail / case floor | `utility/Case.jsx` | the aluminium rail + screw holes + case floor | — | `--monitor-hw-rail` · `--monitor-hw-shade` · `--monitor-hw-case` — **composition, probably stays local; listed for the token layer** |

### The token layer (today in `kol-monitor/src/styles/monitor-overrides.css`)

```css
/* hardware — theme-INVARIANT: a knob cap is black on a white panel too */
--monitor-hw-cap:      color-mix(in srgb, var(--kol-color-ab-black) 90%, transparent);
--monitor-hw-well:     color-mix(in srgb, var(--kol-color-ab-black) 95%, transparent);
--monitor-hw-shade:    color-mix(in srgb, var(--kol-color-ab-black) 40%, transparent);
--monitor-hw-cap-edge: color-mix(in srgb, var(--kol-color-ab-white) 16%, transparent);
--monitor-hw-on-cap:   color-mix(in srgb, var(--kol-color-ab-white) 72%, transparent);
--monitor-hw-rail:     linear-gradient(180deg, #8a8680 0%, #7a7670 50%, #6a6660 100%);
--monitor-hw-case:     #141414;
--monitor-cable-default: #f59e0b;
/* LEDs — the set's own emitters, deliberately NOT --kol-palette-* (user ruling) */
--monitor-led-red: #e74c3c;  --monitor-led-green: #2ecc71;  --monitor-led-yellow: #f1c40f;  --monitor-led-blue: #3b82f6;
/* jack roles */
--kol-signal-input: #4ade80;  --kol-cv-attenuate: #497DA2;
```
Rename on the way in (`--kol-ctl-*` or whatever the package's prefix is); the values
are the ruling. NB: the DS's `oq-ab` / `fg-ab` tiers flip with `[data-theme]` and could
not carry the cap — hence the `color-ab-black` / `-white` derivations.

### Candidates from the other consumers (their sessions inventory these)

- **kol-mirror** — `SymphonyViewport`'s Bezel + ControlStrip (the CRT bezel: four knobs driving CSS filters on the glass, a power cap) and `PlaybackModule` (LED well, ganged key deck, TEMPO). Both already ported into monitor's stage as `src/stage/StageBezel.jsx` · `StageClock.jsx`, so they are known to travel.
- **kol-fxr** — its editor controls; not seen from here.

### What is NOT asked

- Not a rename of monitor's files, not an adoption of the DS's app atoms in the rack (the 2026-08-30 ruling stands: churn for a checker's benefit).
- Not the modules, the registry, the rack, the routing, the render loop — instrument, stays local.

**Remainder here:** on publish — bump, replace `src/modules/parametric/*`, the jack's presentational half, `ParamSheet`/`armLongPress` and the token bindings with the package (retire the locals to `_tmp/`); THEN compare `TextInput` vs `Input` and panel `Dropdown` vs `Dropdown` with the package in hand and let some collapse onto the DS where they can. Check 4 closes by package boundary.

## ✅ RESOLUTION — 2026-09-01 · kol-controls@0.1.0

Published: @kolkrabbi/kol-controls 0.1.0, with the token layer in kol-theme 0.124.0 (kol-components-controls.css, in the umbrella; a core consumer imports it as a domain pack). Fifteen exports carried class-for-class from your inventory — Knob · Fader · Toggle · FlipToggle · LED · IconButton · Selector · PanelDropdown · TextInput · PanelLabel · ModuleHeader · JackSocket · LabeledJack · RockerSwitch · ParamSheet — plus armLongPress. Three renamed only where the name already lives in kol-component and the showcase cannot hold two: your Slider is Fader (the hardware word), Dropdown is PanelDropdown, LabeledControl is PanelLabel; everything else keeps its name and its props. Tokens renamed --monitor-* → --kol-ctl-* with the values exactly as ruled, --kol-signal-input / --kol-cv-attenuate under the same prefix, LEDs not on the palette as the user said. Consumer contexts became seams: ModuleHeader powered (your useCasePower), JackSocket takes active · pending · dimPending · cablesHidden · color (HEX — the glow still appends a hex alpha) · onPointerDown, and iconComponent on IconButton / LabeledJack; routing, the registry, the rack and the render loop stay with you. RockerSwitch is PowerModule's switch alone; Case rails stayed local, the rail/case/cable tokens ship. Verified in a real render: all six knob sizes drag against the resolved cap tokens; the jack rings show rest / active / pending / dim-pending / cv from the hex roles and the signal ring glows on the shared rAF; ParamSheet portals to body at z-modal with the DS Slider full-width and closes on Escape. 25 gates clean, and both tarballs checked for stray --monitor- tokens and consumer imports — none. Mirror's bezel / deck and fxr's controls are next candidates once their sessions inventory them.

**Remainder here:** none — kol-monitor bump kol-theme@0.124.0 + install kol-controls@0.1.0; replace src/modules/parametric/*, the jack's presentational half, ParamSheet/armLongPress and the --monitor-* bindings with the package (Slider→Fader, Dropdown→PanelDropdown, LabeledControl→PanelLabel; JackSocket gets its routing as props; ModuleHeader gets powered); retire the locals to _tmp/; then the TextInput-vs-Input and PanelDropdown-vs-Dropdown comparisons with the package in hand.

