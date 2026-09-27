# Plan — the app frame, and curves done properly

**Raised:** 2026-09-27 (user review of apps/curves against apps/media and mirror /expressions)
**Status:** done 2026-09-27 — A, B and C run as one ("can you do all of the plan?"). Unpublished:
kol-hardware 0.3.0 · kol-component 0.226.0 · kol-deck 0.1.1 (the user publishes).
**Related:** `plan-2026-09-27-deconstruction-roadmap.md` (track 3), `backlog/2026-09-27-editor-review-findings.md` (the same complaints about the editor)

---

## 0. The one sentence

Every `apps/<tool>` app invented its own page. The geometry already exists in kol-shell's
`PageShell`; write it down as the tool frame, then rebuild curves inside it, working like mirror's
page.

---

## 1. What the user said

- *"media just says media while curves shows 'apps tier' + Curves … with description no one really
  asked for … is there a rule? … what is the structural backbone of the media/apps?"*
- *"I dont like explanations in text when unnecessary, leave it for popovers/tooltips … be mindful
  of the general site pixel real estate and not just put in labels and text just to fill the space."*
- *"why wouldnt we use the padding that already has been established in f.e. shell or brand? …
  we should try to maintain consistency"*
- *"look at apps/media it uses 100vh and doesnt scroll, I feel like tools should when possible do
  that, we dont want to hide stuff below the fold when presenting tools."*
- On curves specifically:
  - the toggle and the input are different sizes;
  - the reference box re-invents mirror's;
  - the scope doesn't use the available height;
  - the page is too long, so put the popover and sheet behind a dropdown;
  - the view sliders are missing;
  - the ADSR has no sustain grabber, dragging release shows the next cycle, and cycle does nothing;
  - the references stay on the math generator in ADSR mode;
  - there's no timer or BPM.

---

## 2. The rule — the `apps/<tool>` frame (wave A: document it)

There was none. The app-anatomy doc said only "the tool alone, judged without chrome". This is
the rule, from what already exists:

| # | Rule | Source |
|---|---|---|
| 1 | **Frame:** the tool mounts inside `<PageShell mode="fixed">`: `width="bleed"` (the app tier), padding `--kol-shell-page-pad` (= `--kol-pad-section-x`, the one page-content ladder, 20→48px), 100vh, overflow hidden, the body flexing to fill | kol-shell `PageShell` · `.kol-shell-page--fixed`; apps/shell already uses it |
| 2 | **One geometry, alone or in the shell:** the page a tool gets in `apps/<tool>` is the page it gets inside `apps/<tool>-shell` | memory: *tool in shell is the same tool* |
| 3 | **Masthead:** the tool's own title only, display voice (MEDIA, CURVES), with its controls on the right. No eyebrow, no subtitle, no description | apps/media |
| 4 | **Viewport:** the tool fits the viewport; nothing sits below the fold. A secondary surface (a reference, a sheet) opens from the masthead instead of stacking down the page | apps/media · mirror /expressions |
| 5 | **Text:** no explanatory copy on the page. Usage and explanations go in the `S` shortcuts sheet (the DS `ShortcutsOverlay`) or tooltips. Labels only where a control would be ambiguous without one | user, repeated (editor findings #10 · #13) |
| 6 | **Rhythm:** space between units (`gap-10` class), none inside them; one control height per row | apps/media's `gap-10` ruling (2026-08-27) · `09-sizes` |

**Where it's written:**
- `docs/documentation/04-compositions/16-app-anatomy.md` gets a new **Tool frame** section with the table above.
- `docs/operations/07-apps-tier/01-tier-rules.md` § Shape gets one line pointing to it.

---

## 3. Curves, rebuilt (wave B)

### The page
- `<PageShell mode="fixed">`; masthead **CURVES** on the left; on the right the `Equation | ADSR`
  toggle and a **Reference** dropdown (Panel · Popover · Sheet). No eyebrow or subtitle.
- **Body:** a row that fills the rest of the height.
  - **Left:** the scope box. The scope takes every pixel left over; the controls sit under it.
  - **Right:** the reference panel, 320px and full height (when the dropdown says Panel).
- **Popover:** EX / REF in the masthead. **Sheet:** an overlay. Neither stacks down the page.
- **`S`:** the shortcuts sheet, carrying the Usage notes.

### Carried from mirror, class for class (nothing invented)
- **Boxes:** an eyebrow (`kol-helper-12 text-fg-48 uppercase`, 24px) above each box; the box is
  `bg-surface-secondary border border-oq-08 rounded-4` (mirror has `fg-08`; the stroke law makes
  it `oq-08`).
- **Reference box:** TabsRow in its head, `px-4 border-b`; the body is `p-4`, scrolling inside.
- **Scope controls:**
  - Fit · Collapse · Reset;
  - a divider;
  - Min · Max · Sec · Ofs;
  - **X · Y · Scale zoom sliders** (dropped by mistake last time).
- **One control height:** the toggle, the expression input and the number fields share one size rung.

### Timing
- **Transport row:** play/pause and **BPM**.
- `t` counts beats. At 60 BPM a beat is a second, so every existing expression reads the same.
- Sec is the window in beats.

### ADSR, fixed
- **Four handles:**
  - A: attack time;
  - D: decay time;
  - **S, its own handle** at the end of the hold: sideways = how long the gate holds, up/down = the level;
  - R: release time.
- **Single pass:** the scope draws one pass and never wraps, so dragging R can't show the next
  cycle. The window holds while dragging and refits on release.
- **Cycle off = one shot:** the playhead runs once and stops, and **Trigger** fires it again.
  Cycle on loops.
- **Hold** becomes an envelope parameter (seconds the gate stays open). `envelopeAt` already takes it.

### The reference follows the mode
- **Panel, popover and sheet** all show the current mode's data: expression sections in Equation;
  presets, stages and timing in ADSR.

### Where it lands
- `kol-hardware`:
  - `SignalScope`: zoom X/Y, a `loop` flag plus a `trigger` counter for one-shot, and fill height;
  - `EnvelopeGenerator`: the layout above, with its controls exposed so the app arranges the page;
  - `SignalReference`: the mirror box.
- The app composes the page; no UI originates in it.
- **Verify:** at 1440 and 390; the gates; the signal test; `pnpm curves`. Then publish kol-hardware.

---

## 4. Conform the other apps (wave C — per app, on the user's go)

| App | Today | To the frame |
|---|---|---|
| media | `breakpoint-padding` + `--kol-container-max` (the site tier's cap) | PageShell fixed · bleed |
| controls | `max-w content-shell` + `px-4 md:px-8`, eyebrow + subtitle, scrolls | a reference page, not a tool: the masthead rule applies; whether it may scroll is the user's call |
| brand · notes · presentation · editor | each its own | audit, then conform |

---

## 5. Verification

- [x] The anatomy doc carries the Tool frame table; tier rules point to it
- [x] curves: no page scroll at 1440 × 900 and 390 × 844; masthead = CURVES + toggle + Reference
- [x] curves: no eyebrow or subtitle, and no explanatory copy on the page; Usage lives in `S`
- [x] curves: the four ADSR handles; one-shot vs cycle; Trigger; BPM changes the speed
- [x] curves: the reference follows the mode in all three shapes
- [ ] 28 gates · the signal test · the deploy build · kol-hardware published — all but the publish

## 6. Done notes (2026-09-27)

- **The masthead needed a DS fix.** `PageHeader`'s actions with no subtitle stacked UNDER the title,
  against its own docstring; `SectionText` now puts them on the title's row and wraps on a phone.
- **Rulings taken, not asked:** controls is a reference page, so it keeps the frame but scrolls;
  brand (a book) and editor (its own full-window chrome) stay as they are; the Notes / Decks lists
  go title-only through `media-fixture/wiring`, leaving the packages' olina defaults alone; below
  lg the curves Panel falls back to the EX / REF popovers.
- **Timing:** BPM scales the scope's clock (60 = one unit a second); the expression engine is
  unchanged. Hold is seconds at sustain, default 1, so old envelopes draw the same.
- **Known, not this plan's:** the deck editor's toolbar overlaps itself at 390 (it did before —
  the responsive pass over the non-brand apps is still open).
