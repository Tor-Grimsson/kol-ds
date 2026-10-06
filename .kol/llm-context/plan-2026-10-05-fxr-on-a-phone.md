# Plan — fxr on a phone: labs, the randomiser, the editor (OPEN)

**Raised:** 2026-10-05. The user, after looking at the live apps: *"fxr labs and randomiser in mobile is what I see the biggest problems with"* · *"nothing is really optimised responsive, or at least there are so many bugs"* · *"for labs the issue is that we have 2 siderails and its not optimal to interact with it on mobile"* · *"the editor breaks at a low breakpoints. shouldnt there be some protocol for that?"* · *"some sort of flow charty type planning? such that we dont go in circles"*.
**Status:** BUILT 2026-10-05, every stage on the recommendation, for his review — after *"so you are telling me you did tiny bit of the plan then stopped?"*. Unpublished. What each stage became is under its heading.

**Read with:** `backlog/2026-10-05-fxr-phone-findings.md` (the fourteen findings, numbered — cited below as F1…F14) and `docs/documentation/06-research/04-tools-on-a-phone.md` (the outside reading — cited as R1…R17).

## The goal

**Labs and the randomiser are usable on a phone, and no fxr screen breaks between 390 and 1440 wide.**

"Usable" is the research's word, not mine: one surface at a time (R5, R9), the stage never under the panel (R4), controls a thumb can hit (R12), layout chosen by the window (R1).

## The chart

One question per box. A yes starts that stage's build; nothing below a box is touched before its answer.

```
            ┌───────────────────────────────────────────────┐
            │ 1  Is the frame chosen by WIDTH?              │
            │    sheet below 640, rail from 640             │
            └───────────────┬───────────────────────────────┘
                 yes        │        no → the frame stays chosen by touch;
                            │             F6 and F12 close as "by design",
                            │             stages 2–4 still stand
              build stage 1 │
                            ├──────────────────────────────────────┐
                            ▼                                      ▼
   ┌─────────────────────────────────────────┐   ┌──────────────────────────────────┐
   │ 2  Is labs ONE surface?                 │   │ 5  What is the editor below 1024?│
   │    catalog in the sheet, one tab strip  │   │    a pane under the stage, or    │
   │    — answered on a specimen round       │   │    a "needs a wider window" note │
   └───────────────┬─────────────────────────┘   └───────────────┬──────────────────┘
        yes        │   no → labs keeps its drawer;                │
                   │        only the stacked tabs (F8) are fixed  │ build stage 5
     build stage 2 │                                              ▼
                   ▼                                    the gate's exemption for
   ┌─────────────────────────────────────────┐          the compositor is removed
   │ 3  Does the sheet get a second height?  │
   │    half and tall, both tools the same   │
   └───────────────┬─────────────────────────┘
        yes / no   │   either way the strip stops moving and
                   │   the randomiser's stage refits (F10)
     build stage 3 │
                   ▼
   ┌─────────────────────────────────────────┐
   │ 4  Labs' controls on a phone: 32 or 40? │
   │    32 is his own written ruling         │
   └───────────────┬─────────────────────────┘
                   ▼
              build stage 4  →  the goal is checked end to end
```

Why this order: 1 decides which layout every later stage is built in. 2 decides what is *in* labs' sheet, so 3 (how tall it is) and 4 (how big its rows are) cannot be measured before it. 5 needs only 1 and runs beside 2–4.

## Stage 1 — one frame rule

**Built 2026-10-05 on the recommendation, for his review — not on an answer from him.** After the chart he could not read: *"can you just fucking do something helpful"*. What was built is narrower than the question below: **a window under 768 gets the phone's frame, whatever the pointer** (`useNarrow`, `editor/mobile/device.js`). 768 and not 640 because it is the width kol-shell's `AppShell` already folds its own rail at — one fold for the shell and the tools. A touch device keeps the sheet at every width, so F12 (the tablet) is untouched, and from 768 a mouse still gets labs' two rails — open, they leave the stage 240px at 768 and 496px at 1024. Checked: `_tmp/2026-10-05-fxr-phone-walk/frame-narrow.mjs` (19), the five-bug kit (19), the 10-03 frame kit (14), `validate:render` on six apps. Unpublished. The render gate's widths are unchanged.

- **Goal:** both tools pick sheet or rail by the window's width, so a narrowed window, a tablet and a phone each get a layout made for that width.
- **His question:** is the frame chosen by width — sheet below 640 (`sm`), rail from 640 up?
- **What it changes:** today the frame is `isMobileDevice() && !wantsDesktop()` — touch, not width. Only the *layout* moves to width. What is truly about touch stays on the device check: no hover, a pick starts the clock, the chrome doors, the tablet's desktop opt-in.
- **Covers:** F6 (a narrowed window keeps the desk rails — the randomiser's stage at 126px, labs' two rails), F12 (a tablet gets the phone's sheet stretched).
- **Done when:** the render gate opens every fxr app at 390 · 640 · 768 · 1024 · 1440, with and without touch, and passes; at no width are there two rails beside a stage narrower than the rail.
- **Read first:** `mobile/device.js`, `mode.js` (the 2026-08-15 note on MODE against DEVICE), `LabsView`'s `data-touch`, `MobileOverlay`'s `rail`.

## Stage 2 — labs as one surface

**Built:** the catalog card in the sheet (`LabsCatalogCard`), open on an empty stage, `Catalog` in the header after; one catalog read twice (the rail's published rows). **Not done:** the one tab strip (F8) and dropping the drawer — the drawer stays, as the host's.

- **Goal:** on a phone you pick a source and tune it without leaving the sheet.
- **His question:** does labs' catalog move into its sheet as the first tab, with one tab strip in the randomiser's shape — on a specimen round, not in prose.
- **What it changes:** standalone labs loses its drawer; in the hub the hamburger lists the hub's pages only. `Gen · Style · Anim`, `▶ · Output · File` and the transport bar become one strip.
- **Covers:** F7 (two surfaces to get anything done — the "2 siderails"), F8 (three navigations stacked, two tabs lit at once).
- **Rulings it touches:** *"labs needs both sidebars"* (2026-09-01) — already overridden for the params side on 2026-10-05; this is the nav side. Kept unless he says otherwise: the hamburger top-right, nav from the left, in the hub.
- **Done when:** from an empty labs a preset is running without the drawer being opened; one tab is lit at a time, in every state.

## Stage 3 — one sheet behaviour

**Built:** both sheets rest at half or tall on a grabber (`SheetGrab`, tap cycles; no drag); the randomiser's sheet is one height on every tab and its stage refits above it. **Not done:** the three pickers still head every labs tab.

- **Goal:** the sheet behaves the same in both tools, and nothing moves under the thumb.
- **His question:** does the sheet get a second, taller rest (half and tall, with a grabber — R8)?
- **Built either way:** one sheet height per rest for every tab, so the strip holds its y (today the randomiser's is 332 · 140 · 188 · 236); the randomiser's stage refits above its sheet as labs' does; `Type · Category · Preset` appear once, not at the top of all three tabs.
- **Covers:** F9, F10.
- **Done when:** the tab strip's y is the same on every tab in both tools; the stage is never under the sheet; no control is repeated across tabs.

## Stage 4 — control sizes

**Decided:** his written ruling stands — 32 in labs' sheet. Nothing built. The loop-length finding was my measurement reading the inner `<input>`; the control is a `<label>` 32 or 40 tall, so there was no floor to clear.

- **Goal:** one answer, written down, for how big a control is in a phone sheet.
- **His question:** labs at 32 or 40? `kol-labs.css` holds it at `md` on his word (2026-09-01, re-held 2026-10-03); the randomiser is `lg`. R12 says 44 by default, 28 at the least.
- **No ruling needed:** the loop-length field is 10×18 in labs and 12×22 in the randomiser — under the repo's own 24 floor. It takes its row's height in either answer.
- **Covers:** F11.
- **Done when:** the answer is in `kol-labs.css`'s comment and in the sizes doc if it applies beyond labs; no pressable thing in either sheet is under 24.

## Stage 5 — the editor below 1024

**Built:** the note (`Editor.jsx`), with Labs and the randomiser as doors and "Open the editor anyway"; the render gate's allowance is deleted and the gate passes. The pane-under-the-stage layout is not built.

- **Goal:** the compositor is either usable or says plainly that it is not, at every width.
- **His question:** below 1024, do its two panels become one pane under the stage (R3, R4), or does it show a "needs a wider window" note as the touch overlay does?
- **Covers:** F13 (stage 80px at 768, gone by 480, the menu bar clipped).
- **Done when:** the render gate's written exemption — "the compositor has no phone layout yet" — is deleted and the gate passes.

## Loose — a yes or a no, no stage

- **The Effects picker's ink** (F1's remainder): its three doors are mid-grey on mid-grey and its Back is dark on black in the light theme. Proposed: a solid dark ground with the dark theme's ink.
- **`Colour` in the randomiser's roll cells** (F14): the ruling is *color*; it is copy, so it waits on his word.

## Already done

- `apps/generator` → `apps/randomiser`, with the old URL redirecting.
- F1–F5 fixed in source, unpublished: the picker and the sheet no longer overlap · the transport bar sits under the drawer · no tooltip on a tap (kol-component) · a section's name opens its children (kol-shell) · the hub's trigger is light over the randomiser.

## Not in this plan

- kol-mirror and the mixer — he works that in its own repo.
- kol-fxr's bump — its notes are `backlog/2026-10-03-fxr-bump-notes.md`; this plan changes what they will say, and they are updated when a stage ships.
- A real phone, export and recording — still unchecked; each stage's "done" is the gate and Playwright, and says so.
