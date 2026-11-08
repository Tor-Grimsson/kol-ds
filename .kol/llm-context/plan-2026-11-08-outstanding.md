# Plan — outstanding after 2026-11-08

**Raised:** 2026-11-08, the user in the main session: "you can do all outstanding at the same time, did you have a list?" Later: "rename icon to iconloader that is the fucking name." On ModalShell: "I dont see the point, do you?" Then: "take care to make sure the logic works out."
**Status:** DRAFT, 2026-11-08. 1.1 is in progress (the IconLoader rename agent is running).
**Shape:** W › phase › list.
**Laws carried:**
- Names he states are binding, and no rename happens without his word.
- A master is built from the parts its code renders.
- Never rm; retire to `_tmp/`.
- Never publish the Figma library; he does that.
- Figma work goes to kol-figma-agent.
- A published rename keeps the old name as an alias for 30 days.
**How a phase closes:** the measurable acceptance line first, then the gates go green, then Playwright or a Figma screenshot checked against his words. "The logic works out" is checked as a rule: every Figma part, its Code Connect file and its code export name the same thing.

## W1 — Figma and code names agree

### 1.1 — IconLoader is the name — ✅ built 2026-11-08
- `Icon` (packages/icons/src/Icon.jsx) becomes `IconLoader`: the file, the export and every use in this repo. `Icon` stays as an alias.
- `figma/IconLoader.figma.js` prints `<IconLoader … />`.
- Acceptance:
  - kol-icons exports `IconLoader`.
  - 0 imports of `Icon` from kol-icons remain in packages/, apps/ or showcase/.
  - validate-roster passes.
  - The new version is live on the registry.

### 1.2 — The other 21 pairs — TALK
Checked by me on 2026-11-08 against the Code Connect `// source=` lines and each master's Figma description. The agent's mapping was wrong on Modal, SplitButton, AppItemRail and List.

**No rename needed (14):**
- **Separate things, both real:** Modal is the useModal pop-ups and Dialog is the `Dialog` component.
- **CSS styles, not components:** Prose is `.kol-prose` and List is the `.kol-prose` list (`kol-typography.css`).
- **Pieces inside a parent:**
  - StatTile is one tile of `StatTiles`.
  - MoreSheet is kol-shell's `.kol-more-sheet-float`.
  - CalendarHead, CalendarEvent, CommandOverlayRow, TableRow, TableCell, CardTab, RankedListRow, CategoryPageToc, ShellNavRow, AppItemRail/row and SiteLayoutTocSlot are all drawn inside their parent component.

**Also pieces, on a second check (2):**
- **ShellNavSection:** kol-workshop's `RailSection.jsx`, an internal file of `ShellSidebar` that isn't exported.
- **AppItemRail:** the file rail that `AppItemMenuProvider` opens, which is `SettingsPanel variant="rail"`.
- So there are 0 real export pairs, and 1.2 closes with no renames. ✅ 2026-11-08

**Design only (1):**
- **SplitButton:** its description says "Designed — not in code yet". It is not `SplitToolButton`, which is a different single-trigger tool button.

Acceptance: both pairs carry his ruling here, and nothing is renamed before it.

## W2 — Modals on one shell

### 2.1 — ModalShell in code — ✅ built 2026-11-08 (kol-component 0.356.0, kol-theme 0.217.0; the Code Connect line goes with 2.2's Figma half)
- Figma's ModalShell is the shared modal base that QuickLookFrame, Dialog float and Modal float already sit on. The code has none: Modal.jsx exports `ModalProvider`, `useModal` and `Dialog`, and every overlay draws its own panel. This answers his Figma issue 52 ("modals not built on one modal").
- Build `ModalShell` in kol-component from the panel `ModalView` draws (Modal.jsx:136): the surface, radius, header slot, body and footer. `Dialog` renders through it.
- Acceptance:
  - kol-component exports `ModalShell` and `Dialog` renders it.
  - The Figma master's Code Connect points at it.
  - The modal radius is one value.
- Result: `ModalShell` (packages/component/src/molecules/ModalShell.jsx) exported; useModal's dialogs and every `Dialog` variant render it. Radius `--kol-radius-sm` = 4px, what Modal and Dialog wore; the float style's windows keep 28 (`float`) and the settings window 16 (`settings`). Gates: roster 693 clean, imports clean, foundations clean.

### 2.2 — Overlays onto the shell — ✅ 2026-11-08 (code and Figma)
- Move QuickLookFrame, the MediaLibrary modal, ShortcutsOverlay, DeckFile and DeckSettings onto `ModalShell` in code, then make their Figma masters ModalShell instances.
- Acceptance:
  - In code, each of the 5 renders `ModalShell`. ✅ 5 of 5: QuickLookFrame, MediaLibrary modal (and picker), ShortcutsOverlay (via SettingsPanel overlay), DeckFile, DeckSettings (kol-deck 0.4.0, now over the scrim); also design-editor 0.34.0's MediaPickerDialog and FilesDialog, which wore the media picker's panel. Playwright: 7 overlays + float/settings, light and dark, 0 console errors, every panel 4px (float 28, settings 16) — _tmp/2026-11-08-w2-modals/.
  - In Figma, each of the 5 nests a ModalShell instance.
  - Nesting check: 0 fakes.
- Figma ✅ 2026-11-08: ModalShell 1332:11693 = ModalShell.jsx — variant lift · bordered · float · settings, slots header · body · footer (+ showHeader/showFooter), panel pad/gap 0 (the caller's, set on each instance), radius sm 4 / float 28 / settings 16; toolbar slot, rules and the lift's oq-12 hairline gone. Nest it: Modal bordered/lift ×4 (pad 20 gap 16, 320), Modal float, Dialog lift (new, 420) · float · settings (880×656), QuickLookFrame default (body oq-02 640×400 = live 444) · float, SettingsPanel overlay → ShortcutsOverlay (LabeledControlSection instances, divided, rowGap 1), DeckFile 386 = live, DeckSettings 334 = live, MediaLibrary/modal (48/20/20). No design-editor dialog masters exist. ModalHeader 1625:8555 takes QuickLookHeader as `row=window` default/float (meta, nav, minimise, close); 6 instances swapped, `_QuickLookHeader` + its doc on _trash, 0 instances left. Code Connect: ModalShell, Dialog, ModalHeader, QuickLookHeader (→ ModalHeader) published. Nesting 0 fakes (Molecules 787, Organisms 899), invalid 0/0, audit 0 errors.

## W3 — Loose ends from W5 and the review fixes

### 3.1 — PageHero title gap
- In Figma, the gap under the hero title is drawn at 16, against 24 live.
- Acceptance: the PageHero master's gap measures 24, and the site variant of `markdown-page/document` comes within 4px of 3091 tall.
- ✅ built 2026-11-08 (gap): live h1 → lede is 24 (`.kol-prose-display` mb 24, measured on /library/artwork/poster-2027-field-season?variant=site); the 12 drawn under the title (the 16 is the label gap, live 16) is now 24 bound to `spacing/6` on PageHero 456:11766's SectionText stack and on `markdown-page/heading` site·h1 1743:15006 — hero stack 152 → 164 = live. Site variant 1728:14932 stays 3074 vs 3091 (17 short, NOT met): the live hero is a fixed 72dvh band with centred content, so the gap cannot change the total; the h1 band instance 1746:15326 re-centred to 328/368 (860 kept). The 17 is elsewhere and the 3091 source doc is not in voyager-fixture any more. PageHero master headline draws 56 vs live 80 — ✅ fixed in 2.2: the master now sits in breakpoint Desktop (text/prose-display 80/80 = live `.kol-prose-display` at 1600); site variant still 3074 vs 3091 (it already drew its h1 at 80; the 17 is not the hero). Audit 0 errors, nesting 0 fakes (56), invalid 0/0.

### 3.2 — Code Connect for DocumentFiles and DocumentMarkdown
- These are the files row and the markdown download that sit above a document page's body in all three styles (packages/styleguide/src/DocumentLibrary.jsx:84, :118). Figma masters: 1746:15815 and 1746:15816.
- Acceptance: both `figma/*.figma.js` files exist, and each one's example uses the code's real props (`row`, `assetsView`, `langMark`).
- ✅ built 2026-11-08: figma/DocumentFiles.figma.js (`row onOpen assetsView="label" langMark`) and figma/DocumentMarkdown.figma.js (`row`), imports from @kolkrabbi/kol-styleguide; published with `-f` (both live) — the full publish is blocked by SettingsRow.figma.js pointing at a variant (14:2).

### 3.3 — LinkPreview seen live
- The rebuilt LinkPreview (ContentMedia plus ContentText) only opens on hover, so no one has looked at it yet.
- Acceptance: a Playwright hover screenshot on `apps/document` matches the old layout (same width, image ratio and three text lines) with 0 console errors.
- ✅ checked 2026-11-08: /project, hover https://atlascloud.is/en → card 320 × 279 = master 917:25001 (320 × 279); media 318 × 167 (800:420) = master 318 × 167; text stack 110 pad 12 = master; title 16, text 48 (3-line clamp), site 10 = master. 0 console errors. Shots _tmp/2026-11-08-w3/linkpreview.png + linkpreview-card.png.
