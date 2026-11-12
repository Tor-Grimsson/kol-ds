# Plan — the float Figma file, made functional

**Raised:** 2026-11-12, the user on `◇ float--kol-ds-ui` (879P1yBsBPqpdGI5a5v2Y5). Points verbatim:
- P1 *"why does float need a icon page?"* (3:16)
- P2 *"why is everything in so many pages? timeline calendar charts etc?"*
- P3 *"why does no one share a header components, instead of this. it just seesm amateurish."*
- P4 *"why two frames practically showing the same?"* (sections `float` 13:1603 and `float2`)
- P5 *"you made ONE frame for labs? … why not in its own page with a little more consideration … show more views/states"*
- P6 *"make this file fucking FUNCTIONAL"*

**Status:** W1 + W2 BUILT 2026-11-12 (kol-figma-agent); W3 BUILT 2026-11-12 (3.2's float-file swap waits on his library publish); W4 BUILT 2026-11-12 (waits on his library publish); W5 open.
**Shape:** W › phase › list.
**Laws carried:** kol-figma skill (no wrapper frames, measure live code, library instances only, #1E1E1E canvases, page naming `➤　Chapter · 　　↳　page`, trash needs `_`); masters live in the library, an app's screens live with the app (01-file-setup.md); every round is its own page; one look-check per batch; Figma work runs on kol-figma-agent in the background, one agent at a time.
**How a phase closes:** measurable acceptance line first, the file audit at 0 errors / 0 unlinked, then a capture of each page checked against his points above.

## Why it is like this (one line each)

- P1, P2: W7 (2026-11-04) moved the float parts here from the library (whose ↳ Float chapter was emptied) and laid them out as apps/float's 13 `/parts` pages, one page per family. This file is their home.
- P3: each family page was drawn with its own title text. No header master was made.
- P4: `float2` is a second paste of the same 8 views. Nothing records why it exists.
- P5: Labs was briefed as one screen, not a page of states.

## W1 — Parts and views, each in one place (P1, P2, P6)

### 1.1 — The parts on one page — BUILT 2026-11-12 (↳ Parts 40:8923)
- His ruling 2026-11-12: the parts stay in this file (*"they actually were moved from library"*); then "One Parts page" picked, the Icons page out.
- The 12 family pages fold into one `　　↳　Parts` page, one section per family (Foundations, Controls, Fields, Menus, Chrome, Windows, Cards, Lists, Navigation, Charts, Calendar, Timeline), each section opening with the W2 header. Nothing in a family changes; only its page goes.
- The Icons page (3:16) shows kol-icons glyphs, which are the library's, not float parts. It goes to `_trash` with the `_` prefix.
- Acceptance: the parts sit on 1 page in 12 sections, and the master count before equals the count after; 0 icon-only page.

### 1.2 — One page per view — BUILT 2026-11-12 (40:8924–40:8931)
- Each apps/float view gets its own `　　↳　<view>` page: Labs, Editor, Workspace, Record, Metrics, Rails, plus any other route in `apps/float/src/App.jsx` VIEWS.
- The 8 frames in section `float` move to their view's page. `float2` is diffed against `float` frame by frame; whatever differs is reported, then `float2` goes to `_trash`.
- Acceptance: one page per VIEWS route (count equals the route count); 0 sections named `float2`; every frame is on the page of its route.

## W2 — One header master (P3)

### 2.1 — Page header — BUILT 2026-11-12 (library SectionText variant=float, no new master)
- Look in the library first for an existing page-header or doc-header master; use it if one exists. Otherwise build `FigmaPageHeader` once in the library: view name, route, one-line note, and the state count.
- Every view page starts with an instance of it, plus a state label above each frame, set in the same text style.
- Acceptance: every view page has exactly 1 header instance; 0 free text layers used as page titles; every state label uses one text style.

## W3 — Labs, properly (P5)

### 3.1 — The Labs page and its states — BUILT 2026-11-12 (11 frames in section 40:14657)
- Labs gets its own page. 34:8212 moves there as `01 · effect picked`.
- States, each measured live on :5216:
  - 02 · empty stage (no effect)
  - 03 · restore prompt (float modal)
  - 04 · catalog Rail collapsed to 72, with a section's rows open in the flyout
  - 05 · catalog Rail hidden, RailTrigger in the corner
  - 06 · params scrolled to the Output · File foot
  - 07 · the File tab
  - 08 · the transport dragged off its corner, with the params Rail at full height
  - 09 · an effect waiting for media (source card)
  - 10 · light theme
  - 11 · phone 390
- Acceptance: 11 frames; each within 2px of its live capture on every rail and row box; 0 unlinked; the artwork placeholder is the only drawn layer.

### 3.2 — The held Generate · Style · Animation strip — LIBRARY DONE 2026-11-12 (TabsRow xs tab3–tab6); swap BUILT 2026-11-12 in the float file (`_tmp/2026-11-12-float-labs/swap-held-tabsrow.js`)
- The xs float TabsRow master gets a three-tab variant, and the detached copy becomes an instance of it.
- Acceptance: 0 detached instances on the Labs page.

## W4 — Masters that disagree with the code

### 4.1 — Fix the library to match live — BUILT 2026-11-12 (waits on his library publish)
- Pressed float Button: grey in code, white in the master.
- NavRail float section row: glyph 18 in code, 13.5 in the master.
- NavRail footer: 78 tall in code, 70 in the master; "Light mode" is Inter 11, not JetBrains Mono 14.
- Acceptance: each of the three, as a master instance placed beside a live capture, measures within 1px and matches the live type; the library audit stays at 0 errors.

## W5 — Record it

### 5.1 — File setup doc — ✅ built 2026-11-12
- `docs/operations/10-figma/01-file-setup.md`: the float row says the float parts' home (one Parts page) and one page per view.
- Acceptance: the doc row matches the page list after W1.

## Order

W1 → W2 → W3 → W4 → W5, one kol-figma-agent at a time. W4 changes the library, so his library publish follows it.
