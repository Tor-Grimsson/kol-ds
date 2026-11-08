# Plan — the modal system, code and Figma in sync

**Raised:** 2026-11-08, the user: "is the modal system in code and figma now perfect? in sync, using nested components aligned and good?" Then: "ok then deal with modal, and stop trying to solve other issues when its not fixed".
**Status:** DRAFT, 2026-11-08. ModalShell (kol-component 0.356.0) and the single ModalHeader (0.357.0) are built in code and Figma. Open: everything below.
**Shape:** W › phase › list.
**Laws carried:**
- A master is built from instances of the parts its code renders, and every frame maps to a real code element.
- Figma variants mirror the code's variants one to one.
- Never publish the Figma library; he does that.
- Never rm; never touch user-facing text.
- Scope is the modal system only: ModalShell, ModalHeader, Modal (useModal), Dialog, QuickLookFrame, DeckFile, DeckSettings, MediaLibrary/modal, SettingsPanel overlay, ShortcutsOverlay and DetailsOverlay.
**How a phase closes:** the measurable acceptance line first, then the gates go green, then Playwright on the live overlay and a Figma screenshot at readable zoom side by side. I check the result myself before reporting.

## W1 — Code: every overlay on ModalShell

### 1.1 — DetailsOverlay ✅ 2026-11-08
- Done: every modal panel in packages/ and apps/ is a `ModalShell`; grep finds 0 hand-drawn ones (`kol-overlay-panel` only in 2 comments). Moved: `DetailsOverlay` (lift, kol-dashboards 0.15.0); chess archive overlay (bordered, kol-chess 0.12.0); design-editor NewFileDialog, RollScopesDialog, the bake panel, LayerEffectsWindow and ColorModesWindow (bordered, design-editor 0.35.0); folio search, shortcuts, image picker, new document, commands and the Rich dialog (bordered on folio's paper and rule, app only). All published. Live captures in `_tmp/2026-11-08-modal-system/`, 11 panels × light and dark: 1 panel each, radius 4px, 0 console errors. NewFileDialog is mounted nowhere, so it has no capture. Gates: validate-roster, -imports and -foundations clean; showcase, metric, folio, editor and design-editor lib builds exit 0.
- Cause: kol-dashboards' `DetailsOverlay` still draws `kol-overlay-panel` itself, so it is the one overlay outside the shell.
- Move it onto `ModalShell` and keep its content as it is.
- Acceptance:
  - A grep of packages/ and apps/ finds 0 hand-drawn modal panels (`kol-overlay-panel` and similar); every modal panel is a `ModalShell`.
  - The Playwright capture of DetailsOverlay shows 1 panel, a 4px radius and 0 console errors, in light and dark.

## W2 — Figma: the masters are the code's parts

### 2.1 — Hand-drawn parts inside the masters ✅ 2026-11-08
- Done: drawn panels (fill + radius) in every modal master 0 (Dialog settings was 3, QuickLookFrame float 1). Dialog settings rebuilt to the Windows box at 880 (nav on a private `_DialogSection` lit/rest — Dialog's own tab button, the 2px marker inside it; SettingsFieldMap aside; Apply footer; nav 156 · body 450 · aside 248 = live); QuickLookFrame float = TabsRow float xs + LabeledControl float ×2 + ToggleSwitch float (260 vs live 262, the float switch master is 20 not 22); Dialog float = ExportWindow from LabeledControl float, Dropdown float, ToggleSwitch float, SummaryLine (506 vs 508). Wrapper frames with no DOM element: 0 (2 flattened in Dialog settings).
- Cause: some masters still hold drawn frames where the code renders components.
  - Dialog `settings` has 13 rounded boxes drawn by hand. In code these are SettingsRow, LabeledControl and its controls.
  - QuickLookFrame `float` has 1 drawn panel.
- Rebuild both from instances of the code's parts, measured from the live render.
- Acceptance: in every modal master, drawn frames with a fill and a radius = 0, and every control is an instance.

- Review round 2 (coordinator vs live, 2026-11-08): Dialog settings = live (SettingsGroup/Grid/Cell slots, segmented 50/50, SettingsSelect field, ramp 88·87fr·122fr·87fr, field-map caption, Dropdown float fills on the float well, ToggleSwitch float 22). Modal pop-ups: Input gains `outline` + `filled` (code's list; _Field outline border shown), prompt/form fields outline; ToggleCheckbox gains `hint` + `hintText` (the label span's ml-2 60% hint), options rows show it. Float headers: no − (code passes onClose only), the call's glyph. Captures: `_tmp/2026-11-08-modal-system/figma/cmp-*.png`.

### 2.2 — The variants match the code ✅ 2026-11-08
- Done: ModalShell variant lift·bordered·float·settings = code. ModalHeader variant default·float = code; lead icon·none added on the float window row (the code draws `icon` there). Dialog lift·bordered·float·settings = code (bordered new, 420×100 = live). Modal: `dialog` → `kind` prompt·confirm·alert·form × variant bordered·lift·float (the code's KNOWN) + `options` false·true on confirm (the toggle rows as a variant value) = 15 variants; bordered/lift heights = live exactly (100 · 142 · 160 · 184 · 98 · 140 · 158 · 182), float = live per content.
- Cause: the Figma variant sets were not taken from the code's variant lists.
  - Dialog is missing `bordered` (code: lift, bordered, float, settings).
  - Modal lost its `checkbox` option.
  - Modal's float row only has `confirm`.
- Read the variant props in Modal.jsx, ModalShell.jsx and ModalHeader.jsx, and make each Figma set carry exactly those values, no more and no fewer. Where a slot blocks a toggle (the checkbox), add it as a variant value instead.
- Acceptance: for each of the 4 components, the Figma variant values equal the code's list (a script compares the two).

### 2.3 — The Organisms half ✅ 2026-11-08
- Done: shell 1 · drawn 0 on all 4. Heights vs live: DeckFile 386/386, DeckSettings 334/334, SettingsPanel overlay 615/615 (RailHeader in its min-w-0 div, the preview's 3 LabeledControlSection of SettingsRow, SettingsFooter), MediaLibrary/modal 792 = 85vh at 932 (header/footer → ContentFilters + MediaLibrary/pathbar). Headers: none of the 4 draws ModalHeader in code (Deck* an eyebrow `p`, SettingsPanel RailHeader), Figma mirrors that.
- Cause: DeckFile, DeckSettings, MediaLibrary/modal and SettingsPanel sit on Organisms and were never checked after the shell work.
- Run the same check on them: one ModalShell instance as the panel, ModalHeader where the code draws a header, and 0 drawn panels. Fix any that fail.
- Acceptance:
  - Each of the 4 has shell = 1 and drawn panels = 0.
  - Its height is within 2px of live.

## W3 — The link between them

### 3.1 — Code Connect for the modal family ✅ 2026-11-08
- Done: figma/SettingsRow.figma.js → set 1693:8733 (example per type); Modal (kind × variant × options), Dialog (+ bordered), ModalHeader (float window icon only on lead=icon) rewritten; ModalShell, QuickLookFrame, DeckFile, DeckSettings, SettingsPanel unchanged and valid. Full `figma connect publish` exit 0, all 8 uploaded.
- Cause: the full Code Connect sync fails on `figma/SettingsRow.figma.js`, which points at a variant (14:2) instead of a component. That row is one Dialog `settings` uses.
- Point it at its component. Make sure ModalShell, ModalHeader, Dialog, Modal, QuickLookFrame, DeckFile, DeckSettings and SettingsPanel each have a `figma/*.figma.js` file whose example prints the code's real props.
- Acceptance:
  - The full Code Connect sync exits 0.
  - All 8 modal-family masters show a code example in Dev Mode.
