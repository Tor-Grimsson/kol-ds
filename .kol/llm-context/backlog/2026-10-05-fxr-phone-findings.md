# Labs and the randomiser on a phone — findings (2026-10-05)

Logged, not acted on. His words: *"nothing is really optimised responsive, or at least there are so many bugs. overlapping icons from the chrome to the siderail"* · *"for labs the issue is that we have 2 siderails and its not optimal to interact with it on mobile"* · *"the editor breaks at a low breakpoints"*.

Read against `docs/documentation/06-research/04-tools-on-a-phone.md` (row numbers below are that page's). One fix per finding; every fix is a proposal until he says yes.

**How it was read.** The live build (ui.kolkrabbi.io/apps — `labs`, `generator`, `editor-hub`), Playwright, 390×844 with touch for the phone, 390 and 768 without touch for a narrowed desktop window, 768×1024 with touch for a tablet. Every state screenshotted and every control's box measured. Kit and shots: `_tmp/2026-10-05-fxr-phone-walk/` (`walk.mjs` · `extra.mjs` · `nav.mjs` · `out/`). Not read: a real phone, export, recording.

## Bugs

**1–5 fixed 2026-10-05, in source, not published.** kol-component (tooltip) · kol-shell (`NavRail`) · design-editor (the other three); each has an `## Unreleased` changelog entry. Checked by `_tmp/2026-10-05-fxr-phone-walk/verify.mjs` — 19 checks on a phone and at a desk, all passing — and `validate:render` on labs · randomiser · editor-hub · editor · panels · shell.

1. **Randomiser › Effects: the media picker and the sheet draw on top of each other.** The picker's three doors (From library · Upload · Camera) are washed out behind a scrim, and its Back button lands on top of the sheet's `Add effect` / `Randomize` row. Shot: `rand-effects-00-effects.png`.
   Fix: the picker is the top layer and the sheet is hidden while it is open. **Done.**
   **Still open, not touched:** the picker's three doors are oq-48 — mid-grey — on the mid-grey the scrim makes of the empty stage, and its Back is dark ink on black. Unreadable in the light theme, with or without the sheet behind. Proposed: the picker on the randomiser stands on a solid dark ground with the dark theme's ink (`data-theme="dark"` on its wrapper, the scrim swapped for the surface). His yes first — it changes how a surface looks.
2. **Labs: the transport bar draws over the open nav drawer.** With the drawer and its scrim up, the bar still sits across the bottom of both (y 787–844). Shot: `labs-phone-06-toggle-navigation.png`. This is the chrome-over-siderail overlap.
   Fix: the drawer and its scrim sit above the transport bar. **Done.**
3. **Hover tooltips fire on a tap and stay.** "Transport" hangs over `Save to file`; "Generative" hangs off the drawer's edge over the stage. Shots: `labs-phone-05-transport.png` · `nav-2-chevron.png`.
   Fix: no tooltips on a coarse pointer. **Done — in kol-component, so every app gets it on its next bump:** a tooltip no longer opens on touch anywhere.
4. **Labs nav: tapping a category's name closes the drawer and loads nothing.** The 36px chevron at the row's far end is what opens its children. Measured: tap at the word → drawer closed, URL unchanged; tap at the chevron → children open. The icon at the row's start was not tapped.
   Fix: in labs' catalog the whole row opens its children — a category there has no page to go to. **Done — in kol-shell's `NavRail`**, whose own contract already said a section is not a destination; a row without `sub` navigates as before. Live fxr has the same dead press.
5. **Hub randomiser: the hamburger and its ✕ are dark ink on the black stage surround** — close to invisible. Shot: `hub-rand-phone-02-scanline.png`.
   Fix: over the randomiser the icon takes the light ink. **Done.** Live fxr has the same dark-on-black.
6. **A narrowed desktop window keeps the desk rails** — the frame is chosen by touch, not width (the research's row 1 says the opposite). At 390 wide the randomiser's rail is 264 and its stage 126; `Transport` is clipped in the tab strip and the title runs into `Start over`. Labs keeps a 48px strip on the right, and from 768 a 48px rail on the left as well — the two side rails. Shots: `rand-narrow-01-scanline.png` · `labs-narrow-00-open.png` · `labs-mid-00-open.png`.
   **Partly done 2026-10-05:** under 768 a window gets the phone's frame, mouse or touch (design-editor, unpublished). Still as it was: labs' two rails from 768 with a mouse, and the desk rail's `Transport` tab, which is cut by about 8px at any width (four `sm` cells in 232px).
   Fix: choose the frame by width. Sheet below 640 (`sm`, the nearest KOL step to Android's 600), rail from 640 up. This replaces the "below 1024" I said in chat — the rail fits beside the stage from about 640; 1024 is only the editor's floor.

## Usage

7. **Two surfaces to get anything done in labs.** It opens on an empty stage and an empty sheet; the only way in is the hamburger in the top corner, then a two-level drawer whose child rows sit on a 28px pitch. The randomiser opens on a centred chooser of full-width 40px doors. Research rows 5, 6: one list-or-detail at a time; a tab bar before a sidebar.
   Fix: labs' catalog moves into its sheet as the first tab, and the empty state is that tab open — one surface, no drawer. In the hub the hamburger stays, for the hub's own pages only. **Built 2026-10-05 as a card in the sheet (`LabsCatalogCard`), on the recommendation; the drawer stays.**
8. **Labs' sheet stacks three navigations.** `Gen · Style · Anim` on top, `▶ · Output · File` at the foot, a transport bar under that. With File open, `Anim` still reads as selected above it; with Output open the top strip is gone. The randomiser does the same job with one strip (`Generate · Effects · Transport · Output`). Shots: `labs-phone-03-output.png` · `labs-phone-05-transport.png`.
   Fix: one strip for labs in the randomiser's shape. (The known leftover — "the two tools' tab sets still differ".)
9. **Labs' sheet is a 313px window onto up to 1,223px of controls** (Style: four screens of scrolling), with no taller rest. `Type · Category · Preset` repeat at the top of Gen, Style and Anim and take three of the six visible rows. Research row 8: two rest heights and a grabber.
   Fix: a second, taller rest for the sheet, and the three pickers leave the tabs for the header's own menu (`Scanline · Drift ⌄`). **Tall rest built 2026-10-05 (`SheetGrab`); the pickers are as they were.**
10. **The randomiser's sheet changes height with every tab** — 332 · 140 · 188 · 236 — so the tab strip moves between y 568 and y 711 under the thumb, and on Generate the sheet covers the bottom third of the stage. Labs' stage refits above its sheet; this one does not.
    Fix: one sheet height for every tab, and the stage refits above it. (The known leftover.) **Built 2026-10-05.**
11. **Every control is under Apple's 44.** Labs: segmented cells 30, dropdowns 32, footer 36, zoom buttons 25×26, the loop-length field 10×18. Randomiser: 38–40, the loop-length field 12×22. All but the two loop fields clear the repo's 24 floor. Sliders are the exception — their hit box is 264×44. Research rows 12, 13.
    Fix: the phone frame takes the `lg` rung (40) throughout, and the loop-length field takes its row's height. No new number — 40 is the ladder's top.
    **Withdrawn in part 2026-10-05:** the loop-length field is a `<label>` 32 or 40 tall; my measure read the inner `<input>`. **And this runs against a written ruling.** `kol-labs.css` holds labs' touch rail at `md` on purpose (2026-09-01, "consistency!!"; re-held 2026-10-03, "as fxr runs it"). The randomiser is already `lg`. So for labs this is his call to reopen, not a bug.
12. **A tablet gets the phone's sheet stretched.** At 768 with touch the sheet is 720×512 and a dropdown is 566 wide. Research row 4: at medium width the pane sits beside the stage.
    Fix: falls out of 6 — from 640 up the panel is the rail.

## The editor

13. **The compositor has no layout below 1024.** Two side panels fixed at 320: at 768 the stage is 80px wide, by 480 it is gone, the menu bar is clipped and the hub's hamburger sits on top of it. The render gate exempts it in writing ("no phone layout yet — parked with the editor rulings") and opens no width between 390 and 1440. Shots: `_tmp/2026-10-03-fxr-labs-testbed/review-1005/editor-*.png`.
    Fix: its own job, after labs and the randomiser. The shape the research gives it is rows 3 and 4 — one supporting pane, under the stage when narrow. **Built 2026-10-05 as the small half: a note in the compositor's place under 1024, with doors to Labs and the randomiser; the gate's allowance deleted.**

## Small

14. The randomiser's roll cell reads `Colour`; the ruling is *color* (2026-09-30). Copy — his word before it changes.

## Order I would build in

Bugs 1–5 first (small, no rulings needed) · then 6 with 12 · then 10 and 11 · then 8 and 9 · 7 after a specimen round · 13 last. The render gate gains 768 and 1024 without touch when 6 lands.

## His review, 2026-10-06 — and what was built on it (decided on the recommendation, for review)

His points: both rails closed on first load with an empty right strip · no way in ("what is the user doing in here") · the three-column media picker · shortcuts not the standard look · at 50%: rails uneven, upload broken, unaligned rows, Color beside Colour · the phone grabber not draggable · too many labels and folded things · zoom chips → a shortcut. He also asked whether the reference apps were looked at — they were not.

Built: the entry card (four sections, Modulation stays on the rail) · the source card · no empty rail, a pick opens it · labs' fold at 1024 · S → the standard sheet (labs' card to `_tmp/2026-10-06-labs-shortcuts-card/`) · zoom keys · chips as the strip, source strip gone, label column 112 · grabber drags · Colour → Color. **M** was never disabled: it flips the modulation-dots setting; the scanline preset has no modulatable parameter, so nothing showed. Then built: enter mode (`NavRail sections="enter"`, labs' hosts only) · pickers on Generate only · the footer's ▶ folded into its strip.
