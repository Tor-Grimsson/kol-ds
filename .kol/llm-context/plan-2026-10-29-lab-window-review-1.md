# Plan — Lab window, review 1 (Color Lab's column, borders)

**Raised:** 2026-10-29, the user's review of BrandLabToolWindow as built (apps/brand-lab). Points verbatim:
- *"this is the reference, you did not follow it"*, with three Adobe Color captures: the column, the hex's "Edit color" tooltip and its popover (`_tmp/2026-10-29-lab-window/1.png` · `2.png` · `3.png`).
- *"when you chose segmentedtoggle, does nothing tell you which version to use?? because you keep using the border BUT WE DONT USE BORDER, almost NEVER … segmentedtoggle is a valid componentn but 1. you over use it 2. DONT USE FUCKING BORDER unless I APPROVE it?"*
- On the fix: *"ADD things to /plan-shape"*.

**Status:** W1 and W2 built — 2026-10-29, checked in apps/brand-lab and the showcase. Nothing published; BrandLabToolWindow stays unpublished until his word. Open: his review.
**Shape:** W › phase › list.
**Laws carried:** no border without his approval (memory `no-borders-segmentedtoggle-sparingly`); a choice is a Dropdown or text tabs; find the shipped component first; one tone per rail; helper type on short labels only, no "·".
**How a phase closes:** acceptance line first, gates green, then Playwright against his own words and the reference captures.

## W1 — Color Lab's column is Adobe's

What the reference shows, read off the three captures: full-height columns with a hairline gap and square corners. Each column carries nothing but its controls: a vertical stack of plain glyphs at the top right (lock, edit tint, drag to reorder, delete), and the hex at the bottom left as a button, with copy at the bottom right. The hex button says "Edit color" on hover and opens the edit popover: title and format, a hex field, the saturation square, the hue strip, and a brightness strip with its number.

### 1.1 — The column's anatomy (ref 1) — ✅ built 2026-10-29
- Columns flush, a 2px gap in the ground, no radius. No role, no ratio and no "Locked" text on the column; those move to 1.4.
- Top right, always shown on the hovered column and kept for a locked one: lock or unlock, edit tint, drag handle (⋮⋮), delete. Plain glyphs in the column's ink (`IconFrame`, no button chrome), each with its tooltip.
- Bottom: the hex button left, the copy glyph right.
- **Acceptance:** at 1440 a five-colour palette shows five flush columns. Hovering one shows exactly the four top glyphs plus hex and copy, matching `1.png`, in light and dark.

### 1.2 — Hex opens "Edit color" (refs 2 and 3) — ✅ built 2026-10-29
- The hex is a button with an oq wash on hover and the tooltip "Edit color". It opens kol-component's `ColorPickerPopover` panel (saturation square, hue, the hex field), anchored to it. This needs a `trigger` seam on ColorPickerPopover in kol-component, so any node can open the same panel and none is rebuilt.
- The brightness strip with its number (ref 3) is added to the same panel, behind a prop, if the panel lacks one; nothing new outside it.
- **Acceptance:** clicking the hex opens the panel at the hex, a drag recolours the column live, and Escape closes it. The tooltip reads Edit color.

### 1.3 — Drag to reorder (the ⋮⋮ in ref 1) — ✅ built 2026-10-29
- Columns reorder by their handle, by drag or by the arrow keys on the focused handle. Whatever lands first is colour 1, the base, and the locks travel with their colours. Undo covers the move.
- **Acceptance:** dragging column 4 onto column 2 reorders the palette, the output table follows, and Undo puts it back.

### 1.4 — Where the check lives now — ✅ built 2026-10-29
- A third rail tab, **Check**, lists every colour as job, hex, ratio and grade on the ground. The status line keeps the count of colours below AA large, and the output table keeps the same columns.
- **Acceptance:** the Check tab lists every colour with its grade, and the status line agrees with it.

## W2 — No border unless he approves it

### 2.1 — SegmentedToggle defaults to borderless — ✅ built 2026-10-29
- The default draws `tone="sunken"`, borderless. The shared stroke and dividers only draw when a page asks for them by name (`variant="outlined"`). No caller asks for it, so every SegmentedToggle in the repo (about 60, across apps, showcase, design-editor, dashboards, hardware, resume) is now borderless; any that should keep a border is his to name.
- **Acceptance:** the showcase's SegmentedToggle preview draws no border by default. A grep shows no bordered SegmentedToggle in apps, showcase or packages without `variant="outlined"`, and that list is in this plan for his ruling.

### 2.2 — The rule, written down — ✅ built 2026-10-29
- kol-component's SegmentedToggle docs (inventory row and the component's own doc) say: a choice is a Dropdown or text tabs first; a toggle that stays is borderless; a border needs his approval.
- **Acceptance:** the inventory row and the component doc both carry the sentence.

### 2.3 — The two page switches become text tabs — ✅ built 2026-10-29
- apps/brand-lab's page switch and apps/document's frame switch become `TabsRow look="text"`.
- **Acceptance:** neither page shows a SegmentedToggle; both switch pages as before.

## W3 — Review 2 (the same day)

Points verbatim: *"INK has more stops, why did you chose these? and what is this suppsoed to be? 'ink' tab?"* · *"why is the wheel so small? at least fill the available width and make the siderail resizable?"* · *"Drag to reorder doesnt show grab icon nor do you get any state indicating dragged state or position after you drop it"*.

### 3.1 — The Ink tab is the text ladder, named for what it is — ✅ built 2026-10-29
- The ladder lives in the contrast checker's rail (3.8) under **Text on the background**: the palette's Ink on its Background at every stop of KOL's fg ladder (01 to 96, then 100), each with its ratio and grade. The five named levels (emphasis, strong, lede, body, meta) are labelled on their stops, and `colorLabCss` still emits them by name.
- **Acceptance:** the Text tab lists 16 stops, the five named ones labelled, and every stop graded.

### 3.2 — The wheel fills the rail, and the rail resizes — ✅ built 2026-10-29
- The wheel takes the rail's full width and follows it. The rail gets the DS grab edge (`useDragResize` and `.kol-rail-grab`, as the workshop rails): a drag widens it between 240 and 480.
- **Acceptance:** at the default 280 the wheel is 248 wide; dragging the rail to 400 makes the wheel 368.

### 3.3 — Drag shows itself — ✅ built 2026-10-29
- The handle shows the grab cursor, and grabbing while it moves. The dragged column dims, and the column under the pointer shows an insertion bar on the side the colour will land. The dropped column carries a ring for a moment.
- **Acceptance:** during a drag the source is dimmed and the target has a 2px bar; after the drop the moved column is ringed and the order is right.

### 3.4 — Edit tint is seven steps, the colour in the middle (refs `8.png`, `9.png`) — ✅ built 2026-10-29
- Points verbatim: *"tints are 7, and overlay shows info"*. The ladder is seven OKLCH lightness steps of the colour's own hue and chroma, three lighter and three darker. The colour itself is step 4, outlined as the current one.
- Each step's tooltip reads Adobe's way: *Base color, 4 of 7, #EAF6AD*, giving the colour's job, the step and the hex.
- **Acceptance:** Edit tint shows 7 steps, the 4th is the column's colour and is outlined, and hovering a step shows its job, step and hex.

### 3.5 — Add a colour between colours (ref `10.png`) — ✅ built 2026-10-29
- Point verbatim: *"add color between colors"*. On the gap between two columns, hovering shows a round + with the tooltip "Add color left" or "Add color right". The new colour is the OKLCH midpoint of its two neighbours, inserted between them. Not drawn at eight colours.
- **Acceptance:** hovering a gap shows the +, a click inserts the midpoint there and the count goes up by one, and at eight colours no + shows.

### 3.6 — Harmonies as tiles, Adobe's (ref `11.png`) — ✅ built 2026-10-29
- Point verbatim: *"they show harmonies like this, we have some of these as icons even?"*. No harmony glyph exists in kol-icons; the shipped drawing of a harmony is `PaletteHarmonyWheel`.
- The Relation dropdown becomes a row of tiles, one per relation. Each tile is the shipped wheel at tile size, drawing that harmony's dots off the current base and not interactive. The tile's tooltip is the harmony's name, and the chosen tile is selected. Monochromatic and Random keep the wheel with one dot, and Random rolls on pick.
- If he wants drawn glyphs instead (Adobe's grey ring and black dots), that is an icon-set job through /kol-icon, not this plan.
- **Acceptance:** the Generate tab shows one tile per relation with its name on hover; picking a tile regenerates the palette and marks that tile.

### 3.7 — Three sources as the rail's tabs (refs `12.png`, `13.png`, `14.png`) — ✅ built 2026-10-29
- Points verbatim: *"tabs for base color image and wheel"* · *"base color gives [the picker] · image allows upload · and color wheel is color wheel"*.
- The rail's tabs are **Base color · Image · Wheel**. Under every tab sit the harmony tiles (3.6) and the colour count.
  - **Base color:** the picker panel inline (kol-component `ColorPickerPopover inline`, the same panel): the hex with its swatch and the base's lock, the saturation square, the hue strip and the brightness strip with its number.
  - **Image:** an upload button and a drop area (sunken ground, no border). The image's palette is extracted to the colour count, the image shows with it, and colour 1 becomes the base.
  - **Wheel:** the harmony wheel at the rail's width.
- Check and Text leave the tabs for the contrast checker (3.8).
- **Acceptance:** three tabs; Base color edits the base live; an uploaded image gives a palette of the current count; the wheel moves the base.

### 3.8 — Contrast checker (ref `16.png`) — ✅ built 2026-10-29
- A header button, **Contrast checker** (`brightness` glyph). On: every column shows its job, ratio and grade on the ground, and the rail shows the Check list and the Text ladder. Off: the columns are bare again.
- **Acceptance:** the toggle shows and hides the grades on every column and swaps the rail to the check.

### 3.9 — Color blindness simulator (ref `15.png`) — ✅ built 2026-10-29
- A header button, **Color blindness simulator** (`eye-on` glyph), opens a menu: Normal vision, Protanopia, Deuteranopia, Tritanopia, Achromatopsia. The stage draws the palette as that vision sees it (display only; the values don't change), and the status line names the simulation.
- **Acceptance:** picking Deuteranopia recolours the columns, the hexes stay the real ones, and Normal vision restores them.

### 3.10 — Generate random, and the palette strip (refs `17.png`, `18.png`) — ✅ built 2026-10-29
- Point verbatim: *"randomise button and palette small"*.
- The roll becomes a labelled header button, **Generate random**, with the `refresh` glyph (kol-icons has no shuffle). It is borderless (no border without his approval), beside undo and redo.
- Under the columns, the palette as a small joined strip, one cell per colour in order: the palette at a glance, as Adobe's.
- **Acceptance:** the header reads Generate random and rolls the unlocked colours; the strip under the stage matches the columns' order and updates with them.

## W4 — Review 3 (refs `19.png` … `33.png`)

Points verbatim: *"just say Base and something is clipping"* · *"input is invisible, just set tone to sunken or dark or WHATEVER so you dont have to set it individually to ALL!!!"* · *"which mode? HEX HSL HSB GREYSCALE? like everything is missing?"* · *"the accessibility buttons should be its own thing window"* · *"Generate and copy can go to sidebar or space between on the right"* · *"4px rounding is missing"* · *"hover bg is gross and those are not icons … these are icons … they have tooltip overlays with name. I know we have some icons for this in DS.. you didnt even look?? it also indicates the mode 'Color harmonies:Custom'"* · *"you dont need a color count, you just add and remove from the swatch"* · *"dont need this info, only in accessibility window"*.

### 4.1 — "Base", and nothing clips — ✅ built 2026-10-29
- The tab reads **Base**. The clipping is TabsRow's scroller (kol-theme `.kol-tabs-scroll`, `overflow-y: hidden`) cutting the text tabs' ascenders; the fix is breathing room in the scroller for every tab row, not a lab override.
- **Acceptance:** the rail's tabs read Base · Image · Wheel, and no glyph is cut at any TabsRow.

### 4.2 — The picker's fields take the rail's tone — ✅ built 2026-10-29
- ColorPickerPopover forced `variant="filled"` on its hex Input; without a variant it takes the nearest `kol-tone-*` wrapper (the rail's sunken), and is filled where there is none (the popover). One rule, no per-control setting.
- **Acceptance:** the hex field reads against the rail in dark and light; the popover's field is unchanged.

### 4.3 — The picker has modes: HEX · RGB · HSB · Lab (refs 21, 22, 23) — ✅ built 2026-10-29
- A header row in the picker: its title ("Base" inline, "Edit color" in the popover) and a mode Dropdown. HEX: the hex field. RGB, HSB, Lab: three channel strips, each a gradient of that channel at the current colour with its thumb and its number. The saturation square and hue strip stay above, as Adobe's.
- **Acceptance:** each mode edits the colour live; switching mode keeps the colour; the numbers agree with the hex.

### 4.4 — Accessibility is its own window (refs 24, 25, 26) — ✅ built 2026-10-29
- The header's three glyphs switch what the window is: **Create palette**, **Contrast checker**, **Color blindness simulator**. The tool's name is the window's title.
- **Contrast checker:** the rail holds Foreground and Background (each a palette colour with its lightness strip), a swap, and the ratio with its grade. Below it is the Summary: Large text, Small text, and Graphics and UI, each with pass or fail at AA and AAA. The stage is a preview of text and a button in the foreground on the background. The text ladder sits under the Summary.
- **Color blindness simulator:** the stage is the palette, then one row per vision (Deuteranopia, Protanopia, Tritanopia, Achromatopsia), each colour as that vision sees it. A warning marks a colour that becomes too close to another (OKLab distance under a threshold). The rail carries "Color blind conflicts" with "Conflicts found" or "None".
- **Acceptance:** the three glyphs switch the window. The checker's numbers match `contrastRatio`, and the simulator's warnings appear exactly where two simulated colours collide.

### 4.5 — Generate random and Copy CSS in the rail's foot — ✅ built 2026-10-29
- They leave the header for the rail's foot (where the status line was), side by side. The header keeps the three view glyphs, undo and redo.
- **Acceptance:** the rail's foot shows both buttons on every source tab.

### 4.6 — 4px rounding on the palette — ✅ built 2026-10-29
- The columns as a group take the system's 4px radius at their outer corners, as the strip already does.
- **Acceptance:** the first column's left corners and the last's right corners are 4px round.

### 4.7 — Harmonies are the DS's icons, with the mode named — ✅ built 2026-10-29
- kol-icons ships `clr-anl` · `clr-comp` · `clr-mono` · `clr-tri` (signal set, `color`); I did not look. New in the same style, **for his review**: `clr-split` (split complementary), `clr-tet` (tetradic) and `clr-rnd` (custom: three scattered dots).
- The tiles are DS buttons (`Button variant="tab" iconOnly`, pressed when chosen): no improvised hover wash, a tooltip with each harmony's name. The label reads **Harmony: <name>**. A hand edit (tint, edit, add, delete, reorder) makes the palette **Custom**. Random leaves the tiles; Generate random rolls whatever is chosen.
- **Acceptance:** seven icon tiles with names on hover; the label tracks the choice and turns Custom on a hand edit.

### 4.8 — No colour count — ✅ built 2026-10-29
- The Colours stepper goes. The count is the swatches: + on a seam adds, delete removes (2 to 8).
- **Acceptance:** no count control in the rail.

### 4.9 — No status line in Color Lab — ✅ built 2026-10-29
- "5 colours, 1 below AA large" goes. The grades live only in the accessibility windows.
- **Acceptance:** the palette view shows no grade or status text.

## W5 — Review 4: the rail is the DS's rail (refs `34.png`, `35.png`, `36.png`)

Point verbatim: *"spacing is off here, why is the hex input so wide? look at fxr/labs … and look at seettings rail it uses labelled controls, has a nice background, and a nice controls tone. Can you not try to reference it?"*

### 5.1 — The lab rail wears the settings rail — ✅ built 2026-10-29
- The rail takes kol-component `Rail`'s own ground (`bg-surface-primary`) and padding (`--kol-pad-rail`), with no `kol-tone-*` wrapper, so every control takes the rail's default tone as the settings rail's do. Its width is the rail law's 380, dragged 320 to 560.
- Every lab's controls are `SettingsSections` rows (label left, control right, eyebrow sections, dividers): typed `choice` · `switch` · `slider` rows, the slider carrying its readout chip; `render` only where the DS has no word (text fields, the picker, the harmony tiles).
- **Acceptance:** the rail's ground, label voice, row rhythm and control tone match the settings rail side by side; no stacked LabeledControl remains in a lab rail.

### 5.2 — Colour rows are fxr labs' colour rows — ✅ built 2026-10-29
- The picker's top row is the labs colour row: swatch, label, the `#` hex field at six characters on the right, then the lock. The mode is its own row (`Mode`, a choice). The square and hue strip sit under them.
- **Acceptance:** the hex field is six characters wide and right-aligned; nothing in the row stretches.

## W6 — Review 5 (refs `39.png` to `52.png`) — ✅ built 2026-10-29

Points verbatim, in short: *"illegal color fg, should be oq-*"* · Generate and copy *"under the color, not siderail"* · filled tabs *"needs more gap"* · harmonies *"missing modes and doesnt use the space width. use bigger icons, and dont use background color … you are missing at least 2. just check color.adobe.com"* · *"this button on the way right to get fullscreen or overlay mode"* · *"does light tone or variant really make this hover state?"* · *"use icons for the tabs … lets try instead TabsRow"* · *"did you check the editor color panel"*.

### 6.1 — Harmonies — ✅
- Nine tiles across the rail's width (Adobe's Compound and Shades added, engine and `clr-cmpd` · `clr-shd` glyphs), 28px glyphs, no chip, opaque ink (oq-40 rest, oq-72 hover, oq-96 chosen).
- **Acceptance:** no fg on a glyph; nine tiles fill the width; Compound and Shades roll palettes.
### 6.2 — Generate random and Copy CSS under the palette, bottom right — ✅
### 6.3 — Filled chips gap 4 → 8px — ✅ (the lab rail no longer wears them)
### 6.4 — Maximize, far right of the header — ✅ the window over the page on the scrim; Escape or the button restores.
### 6.5 — View buttons take the tab state (soft chip), not nav's inverted fill — ✅
### 6.6 — Rail tabs are TabsRow underline with icons (Base eyedrop, Image, Wheel) — ✅ underline tabs take `icon`.
### 6.7 — The Base picker is the editor colour panel's shape — ✅ swatch, eyedropper, hex and lock on top; the mode a full-width Dropdown; hue strip over a 200px square; channels under it.

## W7 — Review 6 (refs `53.png` to `67.png`) — ✅ built 2026-10-29

Points verbatim, in short: *"are your pnpm dev servers all /dev-ip-host?"* · harmonies *"why do you put it on every page?"* · Image tab *"terrible use of space … look at reference … 'Don't have an image? Try one of ours' … link to r2 bucket … 'Media:R2B2'"* · the drop zone's default and hover (checker) · *"Contrast checker - why is it totally different from color lab?"* · *"if we are using TabsRow, why dont we make it a rule at top of each window?"* · *"wrong maximize icon"* · *"wrong tone on button and should just say randomise and is using wrong icon"* · *"Copy button is in every window in the same place except in ColorLab"* · the status *"say instead ratio or whatever … OR NOTHING"* · the header *"maybe uppercase"* · *"WRONG FILL COLOR IN ICONS"*.

### 7.1 — Every app's dev server on the network — ✅ `server.host: true` in all 27 app vite configs (26 were missing it).
### 7.2 — Harmonies under the Wheel tab only — ✅
### 7.3 — The Image tab is Adobe's — ✅ dashed zone, Upload your image, drag-and-drop line, the file line; the checker on hover and drag; four bucket photos with their palettes and the "Media: R2B2" link.
### 7.4 — The contrast checker and the simulator share Color Lab's window — ✅ tabs over the pair, the preview with the image, the palette small under every stage; the conflicts and the palette on the wheel.
### 7.5 — A TabsRow at the top of every rail — ✅ LabWindow's rule, one section or many.
### 7.6 — Maximize is `expand`; Randomise is `shuffle` on the nav rung; Copy CSS in the header — ✅
### 7.7 — No status line; the title uppercase (the settings heading); every icon in oq ink — ✅

## W8 — Review 7 (refs `68.png` to `79.png`) — ✅ built 2026-10-29

Shipped first on his word (*"just ship it so I can at least work in Atlas"*): icons 0.53.0 · theme 0.200.0 · component 0.317.0 · framework 0.65.0 · styleguide 0.18.0. Then, verbatim in short: the Base panel per Adobe's HEX · RGB · HSB · Lab (*"this component is only in hex"* — the field) · *"Locked and unlocked … almost impossible to see the difference"* · *"MISSING ELEMENTS"* · *"why does wheel page have this text style"* · the Image tab's *"terrible button that is wrong tone and terrible hover transition … way to many text styles … UNIFY"* · *"another TabsRow that looks more like this"*.

### 8.1 — The Base panel is Adobe's — ✅ label row with the mode at right; the one field (swatch · hex · lock) in HEX only; square then hue; the mode's channels; brightness ☀ in HEX and RGB.
### 8.2 — `unlock` reads open — ✅ redrawn, candidate.
### 8.3 — One text style in the rail — ✅ body-02 emphasis/meta everywhere; the Harmony row in it; Upload inverted; the checker fades on its own plane.
### 8.4 — TabsRow `size="md"` — ✅ sans body, 20px glyph, 48px row; the window's rails wear it.

## W9 — Review 8 — SUPERSEDED 2026-10-29 by `plan-2026-10-29-lab-window-review-8.md` (his ruling: *"you fucking IGNORED ALMOST WEVERYTHING ISAID"* — every point re-listed verbatim there, nothing closed)

Verbatim in short: the HEX trigger *"WRONG COLOR"* · the channel box *"BROKEN UI"* (ref 81, past the rail) · `unlock` *"did you even take it through keylines?!"* · Randomise *"WRONG BUTTON TONE"* · the md tabs *"the problem … was thickness and stroke … try public sans?"* · the file line *"smaller DONT BREAK LINE"* · `expand` *"TERRIBLE ICON"* · the Wheel tab's stray comment text · *"WHY DID YOU CHANGE THE STYLE HERE IT WAS PERFECT!!! I was saying why is it only used here"* · the preview *"show some forms that use the pallette"* · *"this is not DS?"*.

### 9.1 — The eyebrow is every label in the rail — ✅ (Harmony restored; Base, the checker's and the simulator's labels on it; the HEX trigger wears the same ink)
### 9.2 — The stray comment is gone; the channel box hugs its digits; the file line is smaller on one line — ✅
### 9.3 — `unlock` and `expand` through the keyline plate — ✅ candidates (plate: `_tmp/2026-10-29-lab-window/glyphs.html`)
### 9.4 — md tabs: medium weight, 2-stroke glyphs — ✅. Public Sans is not in the repo (the fonts on disk: Right Grotesk, Inter, JetBrains Mono); the DS sans stays. TALK: a neutral sans on a token is his call.
### 9.5 — The preview is the palette's forms with the DS Button — ✅
### 9.6 — Randomise's tone — see the measurement below.
