# Plan — the ❖ 01 Buttons page

**Raised:** 2026-11-06, his review of ❖ 01 Buttons (library--kol-ds-ui, page 1138:88). Points verbatim: *"we are making the button component too big because its both float and the original"* · *"I dont think every field is in use"* · *"fully round buttons is only float, so I dont get why its listed in the regular button?"* · *"danger … would be a tone rather then a variant"* · *"we use tone for color bg right? so why do we need inverted variant … grey variant … nav? what is nav for?"* · *"you list float button as an example of regular button"* · *"in button float invisible icon"* · *"this uses text for icon?"* · *"these arent even button instances?"* · *"this is documentCapsule? not a button?"* · *"how does button float even make different tones?"* · *"DocumentCapsule is supposed to be float button right? and so it the tabsRow? … they should at least have been nested"* · *"incremental bullshit wasting the limited figma calls … SHAPE UP!"*
**Status:** W2 2.1–2.8 ✅ built 2026-11-07 (kol-theme 0.215.0, kol-shell 0.115.0, kol-component 0.345.0; Figma not published — his click). 2.9 parked. W1 1.1–1.4 ✅ built 2026-11-06 (kol-shell 0.114.0, design-editor 0.32.0; Figma not yet published — his click). 1.5, 1.6 parked. 1.1 ruled (mode) 2026-11-06. Built so far: the page, the split into Button and Button float, the trim to 144 + 24 variants, Stickers removed. Open: 1.1–1.4 (one Figma pass, after 1.4's code change), 1.5 and 1.6 parked.
**Shape:** W › phase › list.
**Laws carried:** a set shows only what the code uses (this repo holds every use — his ruling); tone is the ground (code `tone`, inherited from a `kol-tone-*` wrapper when unset) and is never a row in a set; `variant` in code is the role (nav, tab, bare, float), not a color; a component that nests `<Button>` in code nests the Button instance in Figma; In use holds only real instances of that page's set; masters moved, never recreated; ONE agent pass for 1.1–1.4, one check at the end; I verify every acceptance line on the screenshots myself before reporting.
**How a phase closes:** measurable acceptance line first; `audit.js` 0 errors on 1138:88; master count before = after; 0 unlinked instances in the file; then a legible screenshot I check against his verbatim points.

**Facts the plan rests on (checked 2026-11-06):**
- The Button master binds its fills to the `tone` variable collection (`tone/bg`, `tone/fg`, `tone/border`, `tone/pressed-*`). Button float does NOT — its fills bind `surface-*` and `oq-48`, which is why its tones were hand-painted and its icon vanished.
- Code Connect can only read component properties (`getEnum`, `getBoolean`, `getString`, `getInstanceSwap` …). It cannot read a variable mode set on an instance. So whichever axis is a mode is invisible to Code Connect.
- Code usage (564 `<Button>` tags): regular 462 — tones primary 139, ghost 99, inherit 70, grey 52, outline 19, inverted 12; `variant="nav"` 46; sizes sm 220, md 68, lg 54, xs 28; icon-only 181; disabled 61, quiet 57, pressed 38; `radius="full"` 4 (two library masters: FloatActionMenu, VariantsControl — lg · icon · inverted). Float 102 — tones ghost 41, inherit 16, secondary 15, inverted 14, primary 8, sunken 4, grey 3; sizes sm 32, md 27, lg 23; pressed 12, disabled 8, quiet 0; a count badge in TabsRow.
- DocumentCapsule's "✓ Saved" is a string in code (`status="✓ Saved"`, apps/float), not an icon.
- "New task" is TopControlsBar's `action`: `<Button variant="float" tone="inverted" size="lg" iconLeft="plus">`.

## W1 — Buttons page

### 1.1 — One color axis: tone is the instance's mode (P: "tone for color bg … why all these variants" · "how does button float make different tones") — ✅ built 2026-11-06
- Built: Button 66, float 18, 0 tone properties; 236 paints on tone/*, 45 outside by the code (nav ink oq-80, float count fg-64); 154/154 instances migrated; 0 unlinked of 6444 in the file; Code Connect published.
- Cause: the sets carried color as variant rows (tone × everything), so one choice became 144 copies; the float set painted its tones by hand instead of binding tone/*.
- **Ruled 2026-11-06 — mode.** Tone is the `tone` variable mode on the instance (Button 66 masters, Button float 18, the way every other toned control in the library works). Code Connect's snippet carries no `tone=`; the dev reads the instance's mode (unset tone in code = the wrapper's, the code's own default). The alternative — tone as a variant property, ~250 masters — was declined.
- Button = role (default, nav) × size (xs, sm, md, lg) × content (text, icon) × state (rest, quiet, pressed, disabled) = 64, plus 2 partial cells `shape=round` at lg · icon · rest and pressed (the two library masters' round button) = 66. nav stays the code's `variant="nav"` (the 2026-10-01 ruling kept it a variant), drawn as a role, not a tone.
- Button float = size (sm, md, lg) × content (text, icon) × state (rest, pressed, disabled) = 18. Plus a hidden `count` text after the label (boolean), TabsRow's badge. Booleans + swaps for iconLeft / iconRight stay.
- Every fill, ink and border on both sets binds to `tone/*` (bg, fg, border, pressed-bg, pressed-fg, hover where drawn); the float set is rebound from `surface-*` / `oq-*`. The `tone` collection's modes = the code's TONES (primary, secondary, inverted, outline, ghost, grey, faint, sunken); a missing mode is added from kol-theme's `.kol-tone-*` values (values flow from code, never improvised).
- Migration: every instance of either set in the file keeps its look — its old tone value becomes its `tone` mode, its old cell becomes the matching new cell. Nothing is trimmed from the collection.
- Code Connect: `figma/Button.figma.js` reads role · size · content · state (+ icon swaps) and emits `variant="nav"` for role nav, `pressed` / `disabled` / `quiet` for state, `radius="full"` for round; `figma/ButtonFloat.figma.js` reads size · content · state (+ count); neither emits `tone=`. Published.
- Acceptance: Button 66 masters, Button float 18; no property named tone on either set; 0 fills on either set bound outside `tone/*` (script); every former instance's `tone` mode = its old tone value (script, 100%); 0 unlinked; the doc frame's header line says *"Color: the instance's `tone` mode — in code `tone="…"` or a `kol-tone-*` wrapper"*.

### 1.2 — The float masters on this page nest Button float, as the code does (P: "they should at least have been nested" · "these arent even button instances") — ✅ built 2026-11-06
- Built: 0 loose button frames in DocumentCapsule, TabsRow float, GlobalActions, TopControlsBar (its tabs now a TabsRow float instance), Modal float footer.
- Cause: in code these are built from `<Button variant="float">`; in Figma they were drawn as loose frames.
- DocumentCapsule: back → Button float (ghost, sm, icon `arrow-left`). The name + ▾ is a plain `<button>` in code and stays drawn; `status` is text.
- TabsRow float: every tab → Button float (the row's `size`, text, iconLeft when the tab has one, `count` when it has one, state pressed = the lit tab).
- GlobalActions: undo, redo → Button float (ghost, sm, icon); Export → Button float (inverted, md, text); account → Button float (grey, md, icon `user`).
- TopControlsBar: search → Button float (ghost, lg, icon); Panels ▾ (PanelsRestore) → Button float (no tone, lg, text, iconRight `chevron-down`); New task → Button float (inverted, lg, text, iconLeft `plus`). This closes the "invisible icon": the nested instance carries the real `plus` at the float glyph size.
- Dialog (Modal, float footer): Cancel → Button float (ghost, md); OK → Button float (inverted, md).
- Acceptance: a script finds 0 loose button-shaped frames inside these five masters; every button in them is a Button float instance whose `tone` mode, size, content and state match the lines above (100%).

### 1.3 — In use is real instances (P: "float button as an example of regular button") — ✅ built 2026-11-06
- Built: Button: Modal bordered confirm's footer (2/2); Button float: TopControlsBar + GlobalActions (14/14).
- Button float's In use: TopControlsBar (capsule · tabs · search · Panels · New task) and GlobalActions — valid once 1.2 has nested them.
- Button's In use: the Dialog master's non-float footer (Cancel sm, no tone · OK inverted sm) if the master has a non-float variant; else EmptyState with its action nested as a Button instance. The report names which. No float part in Button's block.
- Acceptance: a script counts the buttons inside each In use block — 100% are instances of that page's set.

### 1.4 — "✓ Saved" becomes an icon in code, then in Figma (P: "this uses text for icon?") — decided for review — ✅ built 2026-11-06
- Built: kol-shell 0.114.0 `statusIcon`; Figma capsule = check icon + Saved in all 3 surfaces.
- The glyph is a text character in the code too (`status="✓ Saved"`). Fix at the source: DocumentCapsule draws `<Icon name="check" size={16} className="text-oq-64" />` before `status`; apps/float passes `status="Saved"`. kol-shell publish; the Figma capsule mirrors it (check icon instance + "Saved"). Lands BEFORE the Figma pass so the pass mirrors shipped code.
- Acceptance: DocumentCapsule's status in code and in Figma is an icon instance + text; visible in Light and Dark.

### 1.5 — Retire the unused Button props in code — PARKED: after 1.1 is built
- accent, tab-filled, variant danger (1 use), the hover-swap props, animateIcon (0 uses). Retire on the ledger; the Figma sets already omit them.

### 1.6 — The other float masters nest Button float — PARKED: own pass after 1.2 proves the method
- Same rule, same acceptance, for the library masters that nest `<Button variant="float">` in code and are not on this page: AccountForm, AppFloatNav, FloatActionMenu, PropertyRail, HubHome, ReaderBar, MoreSheet, RailDisplayControls, RailTrigger, ToolRail, WorkspaceStrips, CommandOverlay, NavRail float, ContentFilters float.

## W2 — Buttons page, round 2 (his review of the built page, 2026-11-06)

Points verbatim: *"why do all have border?"* · *"it doesnt really hold a button tho, just 2 icons wrapped in a button, the text is not coming from the button. nor is the status a component"* · *"Float has to account for top bottom left and right containers … i was just thinking search (even if opt in) would have a slot location"* · *"padding has 2 decimal places fraction? f.e. 11.76 … 15.12 and 18.48 why?"* · *"text isnt styled at all its just 12 13 14 at 100% line height?"* · *"the shadows [fx] display differently depending on if 'clip content' is on or off"* · *"Button/bare?"* · *"Close button? is that nested button?"* · *"should button group not live in this page as well?"* · *"v5 … button group, which also doubles as segmented toggle … Icon Button … is that like our iconframe? … split button … what is future proof? and whats best practice?"*

Facts (code, 2026-11-06): every `--kol-tone-border` is `transparent` except outline (oq-08). Float padding is `calc(height * 0.42)` → 11.76 · 15.12 · 18.48. Float type is 12 · 13 · 14, weight 500, line-height 1 (the code's own). DocumentCapsule's name ▾ is a hand-rolled `<button>`; kol-component already ships `MenuTrigger variant="float"` (a capsule, lit while its menu is open). CloseButton is `<Button variant="nav" iconOnly="x">` (IconFrame when unwashed). ButtonGroup is a layout wrapper (1 use); SegmentedToggle is the joined, one-selected control (77 uses) — v5's "Button group". IconFrame is a static frame, not a control (32 uses). SplitToolButton is the tool-palette split (1 use). FloatLayout already has the regions — nav left, bar top (TopControlsBar `start` · `center` · search · `end`), inspector right, `bottom`.

### 2.1 — The border is a wrong binding (P: "why do all have border?") — ✅ built 2026-11-07
- Built: strokes kept transparent at code size; a `border` layer's opacity bound to new `tone/border-opacity` (Figma ignores a colour variable's alpha); alpha 0 in every mode but outline; nav has no box.
- Rebind each set's stroke to `tone/border` so it resolves per mode as the code does: transparent for every tone but outline.
- Acceptance: in each tone mode, the stroke's resolved alpha = 0 for all tones except outline (script reads the bound variable per mode).

### 2.2 — Float values are tokens, not arithmetic (P: "11.76 … 15.12 … 18.48" · "text isnt styled") — decided for review — ✅ built 2026-11-07
- Built: `--kol-float-px-*` in kol-theme 0.215.0; Figma padding on spacing/3·4·5, 0 fractions; `float/button-sm·md·lg` on 9/9 labels.
- Code first: kol-theme float padding → `--kol-spacing-3 · 4 · 5` (12 · 16 · 20) instead of `height × 0.42`; publish kol-theme. Then Figma binds the float padding to those spacing variables.
- Figma gets three text styles `float/button-sm · md · lg` (font `font/float` = Inter — a role, not a mode; 12 · 13 · 14, weight 500, line-height 100%, the code's `--kol-float-t-*` trio) and Button float's label uses them.
- Acceptance: 0 fractional padding values on Button float (script); every Button float label carries a `float/button-*` style (script, 100%).

### 2.3 — DocumentCapsule's name is a menu trigger (P: "just 2 icons wrapped in a button, the text is not coming from the button") — ✅ built 2026-11-07
- Built: kol-shell 0.115.0; Figma: 1 MenuTrigger float per capsule variant, Saved + check on oq/64.
- Code first: the name ▾ becomes `MenuTrigger variant="float"` (it is a trigger that opens the capsule's menu; the type is the same 13 / 500); publish kol-shell. Figma: the name ▾ is a MenuTrigger float instance.
- The status stays a label (check Icon + text): one use, no component for it.
- Acceptance: DocumentCapsule contains 0 hand-drawn buttons in code (grep) and in Figma (script); its name ▾ is a MenuTrigger float instance.

### 2.4 — Clip content hides shadows (P: "shadows display differently depending on 'clip content'") — ✅ built 2026-11-07
- Built: 0 clipped frames holding a shadow; rule in the kol-figma skill.
- Every frame that holds a float has clip content off, on this page and in the masters of 1.2; the rule goes into the kol-figma skill.
- Acceptance: 0 frames with clip on that contain a node with a shadow effect, on 1138:88 and the 1.2 masters (script).

### 2.5 — The page holds the button family as the code has it (P: "Button/bare?" · "Close button? is that nested button?") — ✅ built 2026-11-07
- Built: Button/bare to _trash; CloseButton = 1 Button instance per size; SplitToolButton set 1179:1577.
- Button/bare → _trash (a pressable with no look; nothing to show).
- CloseButton is a preset of Button (role nav, content icon, `x`): its frame shows a Button instance with those values, no drawing of its own.
- Icon button = Button `content=icon` (one component in code, `iconOnly`); no separate set. IconFrame stays off this page: it is decoration — a span, not clickable, not focusable, not announced.
- SplitToolButton → its own frame here as the code ships it (the tool-palette split).
- Acceptance: CloseButton's frame holds 1 Button instance and 0 drawn glyph frames; no Button/bare on the page.

### 2.6 — ButtonGroup is one component: row, stack or joined (P: "button group CAN be segmented toggle … just by the fact it wraps multiple buttons") — ruled 2026-11-06 — ✅ built 2026-11-07
- Built: SegmentedToggle set renamed ButtonGroup in place (46 instances kept), row · stack · joined, joined cells from `.kol-seg*`; float joined matches the code side by side.
- Figma: one ButtonGroup set, `layout` = row · stack · joined, with a buttons slot (any Button / Button float instances, with or without icons). Joined + one item pressed = the segmented control.
- SegmentedToggle's look moves into ButtonGroup joined; the old SegmentedToggle set goes to _trash once its instances are swapped.
- Acceptance: ButtonGroup has the 3 layouts; 0 SegmentedToggle instances left in the file; the joined layout with one pressed item matches SegmentedToggle's code render (side-by-side screenshot).

### 2.7 — The code follows: SegmentedToggle becomes ButtonGroup joined — its own phase after 2.6 — ✅ built 2026-11-07
- Built: kol-component 0.345.0; 76 call sites moved, alias kept, five live controls pixel-identical.
- kol-component: ButtonGroup gains `layout="joined"` and a selected value (the segmented control); SegmentedToggle's 77 call sites move to it; SegmentedToggle retires on the ledger as an alias. Publish.
- Acceptance: 0 `<SegmentedToggle` in the repo (grep) except the alias; gates green; three call sites checked live against before.

### 2.8 — Split button, designed now (P: "whats the likelyhood of you remembering to create it when we need it?") — ruled 2026-11-06 — ✅ built 2026-11-07
- Built: frame 1181:989, 6 ButtonGroup instances, 0 drawn parts.
- A Split button frame on the page: ButtonGroup joined of a Button (the action) + a MenuTrigger chevron (the alternatives), Button and Button float, sm · md · lg.
- Its header says "designed, not in code yet" — no Code Connect until the code has it.
- Acceptance: the frame exists, every part is an instance (Button / MenuTrigger / ButtonGroup), 0 drawn parts.

### 2.9 — The float frame's slots, named — PARKED: belongs to the Layouts page, not Buttons
- FloatLayout and TopControlsBar already have the regions (left, top start · center · search · end, right, bottom). The Figma masters name each as a slot, search included as an opt-in slot.

## W3 — Open on the Buttons page (his review 2026-11-07) — PARKED: he moved on; pick up when the page is next opened

Points verbatim: *"SplitToolButton is new?"* · *"Split button has border and broken at lg"* · *"ButtonGroup seems very incomplete"*.

- **Split button:** a visible border around the joined pair, and at lg the chevron cell is misaligned (shorter than the action, offset). The joined container's stroke is not on the `tone/border-opacity` fix from 2.1.
- **ButtonGroup:** incomplete — joined float exists only at md (no sm, lg); row and stack only at md; no In use; the `buttons` slot is not shown with mixed content (icons, Button float, vertical stack of more than two).
- **SplitToolButton:** not new in code (molecules/SplitToolButton.jsx, the tool palette's split, 1 use) — new on this page only; its frame needs his look.
- **Leftovers:** one `_Button/bare` instance on Atoms › Controls (339:3442); 3 text-unstyled warnings on the page.
- The Atoms index is NOT maintained during the reorganisation (his ruling 2026-11-07).

## W4 — One "slot that opens its alternatives" — PARKED: another session (his call 2026-11-07); belongs with the Rails page

Raised: his question 2026-11-07 — the float tool rail (*"if we wanted to show different select modes, or shapes"*) and the nav rail (*"if you wanted to access sub children"*) do what SplitToolButton does.

- Today one idea is three implementations: `SplitToolButton` (kol-component, ToolPalette's fold of variants), `ToolRail`'s built-in `more` ▾ (kol-shell, the float tool rail's per-tool options), and `RailFlyout` (kol-shell, the collapsed NavRail's sub-items on hover).
- Direction: one component — a slot that shows its current item and opens its alternatives — with a default and a float look; ToolPalette, ToolRail and NavRail compose it. Code first, then Figma mirrors it.
- Acceptance (when picked up): the three call paths render through one component (grep: 0 private fold/flyout implementations left); the three rails look unchanged (screenshots before/after).
