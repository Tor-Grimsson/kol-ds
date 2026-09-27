# Editor audit — KOL vs inline (item 13 of the editor review)

**Raised:** 2026-09-27 · **Scope:** `packages/design-editor/src` (366 files; the UI is `editor/`,
`settings/`) against `@kolkrabbi/kol-component` · `kol-shell` · `kol-icons` · the gates.
**Status:** read only. Nothing is fixed. Findings key to `2026-09-27-editor-review-findings.md` (#1–#13).

## 1. The same component twice

Twelve editor files share a name with a KOL export and import none of them. Most of the KOL
versions were LIFTED from this editor (`editor-panels-the-held-specs`, 2026-09-03 → 09-25), made
store-agnostic, and the editor never switched back. Similarity is code lines, comments stripped.

| Editor file | KOL | Similar | What it is | Move |
|---|---|---|---|---|
| `compose/PathNodeOverlay.jsx` | `atoms/PathNodeOverlay` | 99% | identical but for import paths | import KOL, delete the copy |
| `compose/CropOverlay.jsx` | `atoms/CropOverlay` | 99% | identical but for import paths | import KOL |
| `compose/inspectors/XYPad.jsx` | `atoms/XYPad` | 91% | **editor is ahead** — its strokes are `oq-*`, KOL's are `fg-*` (stroke law) | fix KOL's strokes, then import it |
| `shell/Canvas.jsx` (815) | `organisms/Canvas` (1039) | 84% | lifted, diverged both ways | diff, merge into KOL, import |
| `compose/inspectors/KeyframeEditor.jsx` | `organisms/KeyframeEditor` | 66% | KOL = decoupled lift | import KOL |
| `compose/inspectors/CurveEditor.jsx` | `organisms/CurveEditor` | 62% | KOL = decoupled lift | import KOL |
| `compose/LayerStack.jsx` (583) | `organisms/LayerStack` (509) | 42% | diverged; editor's has 8 raw `<button>`s | diff, merge, import |
| `params/TimelineDock.jsx` | `organisms/TimelineDock` | 25% | diverged far | diff first |
| `shell/panels/ToolPalette.jsx` (419) | `organisms/ToolPalette` (41 code lines) | 4% | KOL's is the decoupled A3 lift (items in, store out); editor still runs the coupled original, 9 raw `<button>`s | editor feeds `items` to KOL's |
| `compose/InspectorRail.jsx` | `molecules/InspectorRail` | 10% | KOL's is the decoupled A7 lift | import KOL |
| `EditorShell.jsx` | `utilities/EditorShell` | 10% | different jobs — KOL's is the two-rail frame, the editor's hosts it | check whether the editor's uses KOL's frame |
| `library/MediaPicker.jsx` (301) | `MediaPicker` (in `organisms/MediaLibrary`) | — | two pickers | diff |

Same job, different name:

| Editor | KOL | Similar | Note |
|---|---|---|---|
| `color/PanelTabs.jsx` | `TabsRow` | 36% | its docstring calls itself `TabsRow` — a copy |
| `compose/inspectors/Section.jsx` | `InspectorSection` | 43% | the inspector's divider |
| `params/TransportBar.jsx` (145) | `PlaybackBar` + `usePlayback` | 9% | a port of labs' transport, hand-built |
| `icons/EditorIcon.jsx` + `icons/svg/` (59 SVGs) | `kol-icons` `Icon` | — | **a second icon system**: its own loader, its own set (`flip-*`, `align-*`, `tool-*`, `layer-*`, `bool-*`, and duplicates of `check` `close` `trash` `lock` `plus` `download` `refresh` …) — outside every icon rule and gate |

Already right: `shell/ShortcutsOverlay` wraps kol-shell's; `settings/AppSettings` is built on
`SettingsPanel`; `AlignmentPanel` · `ColourPanel` · `StrokePanel` compose KOL atoms.

## 2. Your findings, traced

| # | Finding | Cause | Where it lands |
|---|---|---|---|
| 1 | Transport in core | `shell/panels/EditorFooter` (core) imports `params/TransportBar` | decision: transport chrome to the motion pack, or keep the clock and drop the chrome from core |
| 2 | Transport layout | `TransportBar` is inline (labs port); the footer's Transport · Output · File tabs are a default `SegmentedToggle` (outlined) | rebuild on `PlaybackBar` |
| 3 | Missing tooltips | **75 native `title=` attributes** in the editor; `Tooltip` exists. `validate-native-title` only scans component · framework · shell | swap to `Tooltip`; add design-editor to the gate |
| 4 | S for shortcuts | `S` is the estate's sheet key (AppHub, media, curves); in an editor the letters are tool keys | decision: the editor's sheet key |
| 5 | Flip icon asymmetric | editor's own `flip-h.svg` / `flip-v.svg`: the mirror line's `stroke-dasharray="0.1 4.2"` over a 17px line puts dots at 0 · 4.3 · 8.6 · 12.9 — the far end (17) gets none. `0.1 4.25` lands on both ends | fix the glyph, and move it to kol-icons |
| 6 | Constrain icon | `LayerInspector.jsx:669` — a raw `<button>` with an inline style, ink `var(--kol-fg-48)` on the WRAPPER (the icon inherits `fg`), a native `title`, glyph `constrain` | `Button iconOnly` · `oq` ink · a common glyph (lock); the gate misses wrapper ink (§3) |
| 7 | Settings X doesn't close | **Reproduced** (apps/editor `/core`): Esc and the scrim close the drawer, the X does not — the click hits the X (hit-tested), the drawer stays. It is `SettingsPanel` → `ShellDrawer`'s `CloseButton` → `onClose`, the same `onClose` Esc calls | not isolated yet — next step is the same drawer in media-shell, to split DS from editor |
| 8 | Browser focus ring | **KOL, not the editor**: `MenuItem`'s trigger (`molecules/MenuItem.jsx:50`) is a bare `<button>` with no `:focus-visible` rule, so the browser draws its default. `.kol-btn` has one (`--kol-focus-ring`). `MenuDropdownItem` / `Nest` the same | fix in kol-component `MenuItem` — every consumer gets it |
| 9 | Line-height / tracking glyphs small | `TextPanel.jsx:254` — `affordance={<Icon size={14} />}`, a hand-picked size (the sizes law: glyphs come off the ladder, never the call site) | size off `glyphSize` |
| 10 | Two alignments | object alignment (`AlignmentPanel`, `filled`) and text alignment (`TextPanel`, `tonal`) — both labelled "Alignment", same `align-*` glyphs, different toggle variants | text row: no label, text-align glyphs (Affinity's row) |
| 11 | Tones | 29 `SegmentedToggle`s in **five looks**: `filled` ×3, `tonal` ×3, default ×19, and `ghost` ×1 (KineticPanel) + `primary` ×3 (MobileOverlay) — those two are **not variants**, so they fall back to the outlined default (the outlined toggle you saw). Grounds: 8 `bg-*` classes + 5 inline `background:` vars, with alpha `fg-04` / `fg-08` grounds beside `surface-*`. `kol-editor.css` inks layer rows `fg-64` | one toggle variant for the editor; grounds from the tone set |
| 12 | Fill / stroke sections | `compose/inspectors/ColorField` (176, inline) · `color/StrokePanel` · `color/ColourPanel`; the red-shows-white wheel and the limited palette are behaviour — not traced in this pass | after the swap |
| 13 | Over-labelled | **62** labelled sections / controls across the inspectors; the canvas ratio is `LabeledControl label="Size"` (`CanvasInspector.jsx:41`); "Dimensions" twice | cut labels to where a control is ambiguous (tool frame rule 5) |

## 3. Why the gates let it through

| Gate | Gap |
|---|---|
| `validate-native-title` | scans `component` · `framework` · `shell` only — never design-editor (75 hits) |
| `validate-icon-ink` | checks the className of `<Icon>` · `<IconFrame>` · `<FileIcon>` only — not `<EditorIcon>`, and not ink inherited from a wrapper (the constrain button, 6 sites) |
| `validate-chrome` | component · framework · theme · workshop — not design-editor |
| (none) | nothing flags a `SegmentedToggle` variant that does not exist |

Raw `<button>`s in the editor: **65** (ToolPalette 9, LayerStack 8, LayerInspector 5, …).

## 4. Order (proposed, not started)

1. **KOL fixes every consumer gets:** `MenuItem` focus ring (#8), `XYPad` strokes, `SegmentedToggle` warns on an unknown variant (#11).
2. **Gates:** native-title and icon-ink over design-editor; icon-ink learns `EditorIcon` and wrapper ink.
3. **The swap, cheapest first:** PathNodeOverlay · CropOverlay · XYPad (identical) → KeyframeEditor · CurveEditor · InspectorRail · ToolPalette (decoupled lifts) → Canvas · LayerStack · TimelineDock (diff and merge).
4. **Icons:** fold `EditorIcon`'s set into kol-icons (fix flip on the way), retire the loader.
5. **The inspector pass** (#6 · #9 · #10 · #12 · #13) on KOL parts.
6. Decisions owed: #1 transport in core, #4 the sheet key.
