# editor-chrome-review — sixteen findings from the user's own pass over the running editor, plus three rulings

**Filed:** 2026-09-03 ← **kol-fxr**
**Package:** `@kolkrabbi/design-editor` + `@kolkrabbi/kol-component` — both yours since today's move
**Origin:** the user, reviewing `localhost:5176/editor` himself. Ten screenshots; his words are quoted verbatim below.
**Routing note:** relayed through `kol-client-olina` by accident and forwarded to fxr. Nobody has touched anything.

I read every screenshot rather than route on the relay's summary, and checked the
source where a claim could be verified. Two of his diagnoses were slightly off and
are corrected inline — the *findings* are right in both cases.

---

## Three rulings, decided (these are answers, not questions)

| | ruling |
|---|---|
| **Accent** | **teal.** Yellow goes. The palette it comes from is Gruvbox: `#458488` is the aqua that already carries weight on his screen and reads as a real teal. `#83A598` is too desaturated (21%) to be an accent — it is a foreground. |
| **Guides** | **magenta**, separated from the accent on purpose. The sampled `#BA7799` is anti-aliased text and too dim for a 1px line; canonical Gruvbox pink `#D3869B` is the brightness a guide wants. |
| **Selected text field** | **white.** |

Why magenta was available: I sampled his terminal (2.46M px, 15,367 distinct
colours) and magenta + purple together account for a few hundred pixels, all
syntax highlighting. They carry no existing meaning. The current yellow accent
sits squarely in the orange/amber band the terminal already uses for active tabs
and warnings, which is the collision he was reacting to.

---

## The sixteen

### 🔴 Systemic

**1 · Close buttons only hit on the glyph.** His words: *"the close button, only
closes on icon - but should on whole container.. thats global targeting issues"*
— and he flagged it as bigger than one component. **Verified in source, twice:**
`color/PanelTabs.jsx:19` and `color/PaletteModal.jsx:143` are both
`className="text-oq-48 hover:text-emphasis"` with `style={{ lineHeight: 0 }}`
around a 12px glyph. No padding, so the hit target is 12×12 px. Anywhere a
dismiss glyph sits inside a larger header, the whole header cell should take the
press.

**2 · `fg-*` where `oq-*` belongs.** *"oq-* NOT fg-*"* — section dividers and
control borders are on the alpha ladder. Same law as the icon rule: alpha
composites twice where things overlap.

**3 · Missing the DS's own section vocabulary.** *"we are missing many
oppertunities for uppercase eyebrows section styles, labelled control,
labelledcontrolSection, etc."* The inspector's Position / Layout / Appearance /
Typography / Fill / Stroke are plain sentence-case headers, and their sub-labels
(Alignment, Position, Rotation, Dimensions) are bare text. `LabeledControlSection`
and the uppercase eyebrow exist and are unused here.

**4 · Tone and size are inconsistent across the inspector.** *"alot of tone
issues, and size mismatch.. ugly dropdown and unneccesary popover everwhere"*.

### 🟠 Component-level

**5 · AlignmentGrid is not a SegmentedToggle.** *"alignment isnt using
segmentedtoggle?"* — both alignment rows (Position and Typography) are bare icon
buttons. **This is the row already open on `editor-set-is-behind-its-source`,
and his reaction is the ruling that was missing:** two three-way strips, X and Y,
momentary, no selection state. The press treatment was the open design question —
he has now answered the shape, so build it as a stateless `SegmentedToggle` and
the press state is the cell's `:active`, not a new prop.

**6 · Dropdown panel is lighter than the bar it drops from.** *"wrong dropdown
relative to ui menu bg"*. Confirmed in the screenshot: the Templates panel is a
visibly lighter surface than the menu bar above it and the canvas behind it, so
the layering reads inverted — `surface-secondary` over `surface-primary` in dark.

**7 · The popover is ugly.** *"can we change it border oq-04 and background as
tone prop?"* — he confirmed this is the **Editor / Labs / Randomiser** list, not
the zoom chips. Border `oq-04`, background on a `tone` prop.

**8 · The toolbar icon row is off the ladder.** *"does icon row follow size
ladder? seems a bit big"*.

**9 · The name field.** *"illegal input, not ds I dont think"*. **His diagnosis is
wrong but the finding is right** — it IS the DS `Input variant="ghost"`
(`shell/MenuTop.jsx:193`). The problem is that at rest it is not an input at all:
it renders as a plain `<span className="kol-helper-12 text-emphasis truncate
cursor-text">` and only swaps to the Input on click. So there is no affordance
until you have already guessed it is editable. That is a `ghost`-variant question,
not a hand-rolled-vs-DS one.

**10 · The Generative → Scanline list.** *"very buggy"* — a long grouped list. He
did not say in what way and I could not reproduce a specific defect from the
screenshot alone; needs him or a repro pass.

**11 · The transport bar.** *"so transport is wrong here"* — the Transport /
Output / File tab row sits directly above play · pause · `Loop / 4s` · stop ·
rewind, and the two rows read as different control families. He did not say what
"wrong" means. Note the transport is **app-tier by earlier ruling**, so the fix
may not be yours — flagging rather than assigning.

### 🟠 Added 2026-09-03, second pass

**14 · The alignment and transform GLYPHS are weak drawings.** *"alignement is not
great nor roation flip side flip up"* — separate from finding 5, which is about the
control. This is the marks themselves: the six align glyphs, and the rotate /
flip-horizontal / flip-vertical trio beside Rotation. He is reading them at 16px in
the inspector and they do not resolve.

**15 · A `tone="primary"` button greys on hover.** *"this button tone primary, has
werid hover state ... should not grey - should go deeper? go to primary or teriry or
oq-ab-* something"* — the full-width **Shape parameters** button under the
Parameters header. Hover currently lightens toward grey; it should go **deeper**,
not flatter. His candidates: a stronger primary, tertiary, or an `oq-ab-*` step.

**16 · Fill and Stroke are two separate boxes and should not be.** *"fill and
stroke are not seperate boxes!"* Screenshot: with nothing painted, `Fill` and
`Stroke` are **two full bordered sections, each empty, each holding one `+`** —
roughly 130px of inspector height between them carrying two buttons. They are one
paint control. The editor's own colour panel already treats them as a pair
(`SwatchStack` overlaps the fill and stroke chips deliberately, with a swap
arrow), so the inspector contradicts a model the same app already ships two
panels away.

### 🟢 Feature request, not a defect

**12 · Asset thumbnails.** *"in assets maybe show few bucket thumbnails? to drag
in as images"* — the Assets panel lists logomark / wordmark / lockup-hori /
lockup-vert as text rows. He wants bucket thumbnails, draggable onto the canvas.
`kol-media-client` already reaches three stores and ~7,900 files.

**13 · Accent + text field** — covered by the rulings above.

---

## What kol-fxr holds

Nothing. This repo has had no editor source since the move; every item above is in
`packages/design-editor` or `kol-component`. Filed because the review landed here
and the two corrected diagnoses would otherwise have cost you a wrong fix.

**Remainder here:** none.

---

## PROGRESS — 2026-09-03 · four of thirteen · component 0.205.0 · theme 0.144.0 · design-editor 0.5.0

| # | state | what shipped |
|---|---|---|
| **5 · AlignmentGrid** | **done** | Rebuilt on `SegmentedToggle`: two three-way strips, X and Y, `value={null}` so no cell is ever lit — the object's alignment is not a state this reads back, so the press IS the feedback. The press treatment is `.kol-seg-cell:active:not(.is-active)` in the theme, **not a new prop**: `tone` was the candidate and is the GROUND axis, which says nothing about a momentary press. The glyph rides the cell's `label` as a node, so `SegmentedToggle` needed no new prop either, and its size comes from the ADJACENT ladder rather than a number typed at the call site. **This closes the AlignmentGrid row on `editor-set-is-behind-its-source`** — the shape was ruled there, the press treatment was the hole, and he filled it |
| **7 · the popover** | **done** | `PopoverPanel` takes a `tone`, through the same `toneClass` every other control uses; unset, it paints `surface-secondary` exactly as before so nothing existing moves. Border is `oq-04` — and the OPAQUE ramp is right for the reason finding 2 gives: a floating panel overlaps what is under it, and an alpha hairline composites twice at every overlap |
| **1 · close buttons** | **done, both verified sites** | `PanelTabs` and `PaletteModal` were 12px glyphs at `lineHeight: 0` with no padding — 12×12 targets in 40px headers. Both are the DS `CloseButton` now, which carries the box. The minimise glyph beside one of them had the identical defect and is a DS `Button` with `iconComponent` so it keeps the editor's own drawing |
| **6 · dropdown lighter than its bar** | **half — the seam exists** | `.kol-popover` reads `--kol-tone-bg` before falling back, and `.kol-dd-panel` already did. So a menu bar that declares its tone now gets a panel that continues it instead of one lighter than itself. The remaining half is the editor PASSING that tone at its menu call sites — editor-side, not shipped |

### Not done, and why

- **2 · `fg-*` where `oq-*` belongs** — a real sweep across the editor's own stylesheet; it is mechanical but wide, and worth doing in one pass rather than beside four other changes.
- **3 · missing eyebrows / `LabeledControlSection`** and **4 · tone and size inconsistency** — the inspector's own composition, editor-side. `SettingsSections` (component 0.201.0) is the component to grab for the section anatomy; this is a rebuild of the inspector panels onto it.
- **8 · toolbar icon row off the ladder** · **9 · the ghost name field's rest affordance** — editor-side, both small, both wanting a look at the running thing rather than the source.
- **10 · "very buggy"** and **11 · "so transport is wrong here"** — you flagged both as unreproducible from a screenshot, and I agree; neither is guessable. The transport is app-tier by the earlier ruling.
- **12 · asset thumbnails** — a feature, and it wants the same call the mobile browser's thumbnails want (`ColumnBrowserMobileViews`, still-to-rule #1): where a thumbnail comes from when the store serves originals.

### The three rulings

`AlignmentGrid`'s press treatment is applied. **The accent and guide colours are NOT**, deliberately: `--kol-accent-primary` is bound to `var(--kol-color-yellow-300)` in `kol-framework/kol-brand-color.css` and labelled *"dominant identity color"* — it is KOLKRABBI'S BRAND ACCENT, not the editor's. Rebinding it turns every KOL surface in the estate teal, which is a brand decision and not one this ticket asked for. Scoping teal + magenta to `.kol-design-editor` is one small edit and I will make it on the word; changing the brand is the user's.

### Findings 14 · 15 · 16, and the finding-1 retraction

- **1 · retracted, and nothing needs undoing.** The two sites I changed were
  genuinely 12×12 targets in 40px headers, and they are the DS `CloseButton` and
  `Button` now — bigger target, DS component instead of a hand-rolled glyph,
  no behaviour lost. If he meant a different close button, that one is still
  unfound; this change stands on its own and is not a revert candidate.
- **14 · the align / rotate / flip GLYPHS are weak at 16px.** Not the control —
  the marks. These are shipped `kol-icon-set-v1` drawings
  (`align-horizontal-*`, `align-vertical-*`), so it is an icon-set job, and
  redrawing six marks is design work I will not improvise. Send drawings the way
  fxr sent the seven editor glyphs this morning and they get promoted the same
  day; otherwise it wants a proposal page.
- **15 · `tone="primary"` greys on hover — real, and the STOP is not decidable
  from the ticket.** Confirmed in the theme: primary's rest is
  `surface-secondary` and its hover is `--kol-oq-08`, and `oq-*` flips toward
  the INK — so in dark it lightens, which is the grey he is seeing. He is right
  that it should go deeper, and right that `oq-ab-*` is the family for it:
  `ab-*` flips toward the GROUND, in both themes, which is exactly "deeper".
  But *"should go deeper? go to primary or teriry or oq-ab-* something"* is him
  thinking aloud, not naming a stop — and this is the tone every primary button
  in the estate wears. **Name the stop and it ships in one line.**
- **16 · fill and stroke are one pair, not two boxes.** Decidable and I agree
  with the argument: `SwatchControls`' `SwatchStack` already models them as an
  overlapping pair with a swap arrow, two panels away in the same app, so the
  inspector contradicts a pairing the colour panel ships. Editor-side work in
  `packages/design-editor` — the inspector rebuild that findings 3 and 4 also
  want, which is why it belongs in that pass rather than beside it.

---

## PROGRESS 2 — 2026-09-04 · finding 2 · `@kolkrabbi/design-editor@0.12.0`

**2 · `fg-*` where `oq-*` belongs — done.** 79 `border-fg-*` across 35 files are
`border-oq-*`, step for step. The swap is deliberately invisible on a plain
ground — `oq` is the same ink at the same stop, flattened onto the surface
rather than laid over it — and correct at every seam, which is the whole point:
an alpha border composites twice wherever two of them overlap. **Text was not
touched.** The rule is about strokes; ink does not overlap itself.

This row was filed as "editor-side" back when editor-side meant kol-fxr's repo.
It became this repo's the day the editor moved in, and it is the first of the
four that were parked for that reason.

**A stale comment corrected on the way through.** `EditorFooter`'s `TOGGLE_FIX`
claimed `border-fg-04` "never gets generated" because Tailwind does not scan
node_modules. That was never true: `.border-fg-*` and `.border-oq-*` are both
STATIC rules in kol-theme (`kol-opacity.css` / `kol-opaque.css`, imported into
the components layer), so nothing generates them and nothing can fail to. Only
the arbitrary bracket value needs naming. Left as it was, the comment would have
taught the next reader to name every ladder class they used.

Checked: no stroke on the alpha ladder anywhere in the package, only rungs that
exist, text untouched, and both ladders confirmed static.

**Still open:** 3 + 4 (the inspector's own composition, onto `SettingsSections`
— a rebuild, and the one place here I would rather have his eyes than guess),
8 + 9 (small, editor-side, now ours), 14 (six align/rotate/flip marks — icon-set
design work, wants drawings or a proposal page), 15 (the `tone="primary"` hover
STOP — his ruling), 16. 10 + 11 stay unreproducible; 12 is a feature that wants
the same thumbnail-source call the mobile browser wanted.

## PROGRESS 3 — 2026-09-04 · findings 8 + 9 · `@kolkrabbi/design-editor@0.13.0`

**8 · the tool row is on the ladder — done.** It was 36px buttons with 22px
glyphs. **22 is not a glyph size; it is the smallest PINNED SQUARE** (22 · 26 ·
32 · 40) being used as one, while the SOLO glyph ladder is 12 · 16 · 20 · 24 —
so the row was off the ladder in both axes at once. Now `md`: a 32px square with
a 20px glyph read FROM the ladder rather than typed, so the two cannot drift
apart again. The previous comment said the numbers were matched to a reference
screenshot, which is exactly how a toolbar ends up at a size that exists nowhere
else in the estate. **This is a deliberate geometry change**, in the direction
his *"seems a bit big"* points — flagged rather than slipped in.

**9 · the name field — done, and his diagnosis stays wrong in an instructive
way.** It IS the DS `Input`; the defect was that it only became one on click and
rendered as a plain `<span>` at rest, so there was no affordance until you had
already guessed it was editable. One control now, always an `Input`, with
`onCommit` carrying the entire contract — commit on blur or Enter, restore on
Escape, and the draft RE-SNAPS to `value` afterwards, so a rejected rename falls
back to the last good name rather than lingering. Two pieces of state and the
span/input dance are gone with it.

### What is left, and every one of them is his

- **3 + 4 + 16 are ONE pass, not three items.** The inspector's section
  vocabulary (uppercase eyebrows, `LabeledControlSection`), its tone/size
  inconsistency, and fill+stroke being two bordered boxes where the app's own
  `SwatchStack` already models them as an overlapping pair — all three are the
  same rebuild of the inspector onto `SettingsSections`. It is the one piece
  here I would rather he looked at than have me guess, because it is a
  composition call and there are a dozen panels riding on it.
- **14** — six align/rotate/flip marks that read weak at 16px. Icon-set design
  work; wants drawings or a proposal page, not improvisation.
- **15** — the `tone="primary"` hover STOP. His ruling.
- **10 + 11** stay unreproducible from a screenshot. **12** is a feature, and it
  wants the same thumbnail-source call the mobile browser wanted.
