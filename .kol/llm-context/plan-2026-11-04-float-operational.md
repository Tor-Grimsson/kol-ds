# Plan — Float operational

**Raised:** 2026-11-04, the user, after plan-2026-11-04-float-set closed with gaps reported. Points verbatim: *"lets deal with every issue UNTIL you have finished your task!! the task is to get float oppeartional.. you have not done that..."*
**Status:** W1–W5 built — 2026-11-04 (kol-component 0.338.0 · kol-shell 0.103.0). Open: W6 + W7 (round 25, his ruling); his library publish.
**Shape:** W › phase › list.
**Laws carried:** a gap is fixed in its package, never in the view; version bump + CHANGELOG + docs in the same edit; publish mine (upig), git his; every code change mirrored to the Figma library the same round (kol-figma skill, kol-figma-agent in the background); float tokens + Inter; no borders; icons on oq; `variant` only; never delete (→ `_tmp/`); agents on Opus, check once at the end; visual calls go on the open-questions page, never decided by me.
**How a phase closes:** measurable acceptance line first, gates green, then Playwright against the live apps/float route (1600 × 1080, and 390 for no sideways scroll).

Sources: the agent reports of plan-2026-11-04-float-views and -float-set (playbooks `2026-11-04-float-views.md`, `2026-11-04-float-set.md`).

## W1 — The float chrome's missing seams (kol-shell)

### 1.1 — FloatLayout `bottom` slot
- A bottom Rail slot that runs under the content AND the inspector (record float's Task index dock + filter capsule, 9:14340); RecordFloat moves its dock into it.
- Acceptance: on `/#/views/record-float` the dock spans 64 → 1572 (1508 wide, ±4) at y 802 ±4; content and inspector end above it; no sideways scroll at 390.

### 1.2 — Transport desktop size
- AppFloatNav `transport` gets the desktop capsule the exploration draws (48 tall, 374 wide with timecode), shown inline on desktop instead of the phone pill; VisualEditor uses it.
- Acceptance: `/#/views/visual-editor` transport box 503·790 374×48 ±4.

### 1.3 — PropertyRail inspector tabs + active tab
- PropertyRail draws its tabs at the inspector size (xs, 26 tall) on float; the tab passed in `tab` is the lit one.
- Acceptance: tabs 26 tall on every float view's inspector; the `tab` value's chip is the lit one (DOM `aria-selected`).

## W2 — Windows that can sit in a page (kol-component)

### 2.1 — Dialog + ModalProvider `container`
- A portal-target prop so a Dialog / the useModal confirm can render inside a box (specimen pages, previews) instead of `<body>`.
- Acceptance: `/#/parts/windows` shows Dialog float (blocking and not) and the confirm inline, open, inside their Part boxes; 0 console errors; the default (no container) is unchanged.

## W3 — The gate that fights the float law

### 3.1 — `validate:variants` knows `tone="inverted"` is the float primary
- The float roles (primary = `inverted`) are legal on float Buttons; the gate stops flagging them, without allowlisting by file.
- Acceptance: `pnpm validate:variants` reports 0 hits in apps/float and in the float parts (ReadingNotes, GlobalActions, ContinueCard); a non-float misuse still fails (a fixture line proves it).

## W4 — The views carry their whole frame (apps/float)

### 4.1 — Workspace bar
- The workspace view passes its bar through `layout.bar`: the "Studio / Dashboard" crumb, the six page tabs (Tasks 5 … Links), New task — as 9:15449 draws.
- Acceptance: bar contents match the frame's text; bar 64 tall; nav at 72 on load.

### 4.2 — Record float eyebrow inside the bar gap
- The WORKSPACE / TASKS eyebrow sits in the 40 under the bar as drawn, so the canvas starts at y 140.
- Acceptance: canvas top 140 ±4.

## W5 — The Figma library catches up (kol-figma-agent, background)

### 5.1 — Masters the screens needed
- Float Button gets `tone` (inverted · secondary · ghost · danger); TopControlsBar gets start / end slots; EmptyState float master (the code's, not the exploration card); PropertyRail gets a `tab` property and a body slot; Card float a rows slot; `browser` and `star` on Icon masters; `bold` on Icon masters + `figma/icons/bold.figma.js`.
- Acceptance: each exists bound to variables, Code Connect published; audit 0 unlinked.

### 5.2 — Mirror W1–W4
- FloatLayout master gets the bottom slot; AppFloatNav transport the desktop size; PropertyRail the xs tabs; Dialog shown inline on the Windows page; the six screens + record float/workspace updated (New task inverted, bar contents, dock under the inspector, real text in the slots — no master sample text).
- Acceptance: screens ±4 of the live routes; 0 unlinked; no master sample text on any apps/float screen.

## W6 — Frame vs part sizes — TALK

The views miss the exploration by more than ±4 where a shipped part's own size differs. Each is a visual call — put on the open-questions page as live specimens (part as shipped vs the frame's size), his ruling per row; nothing changes before it:
- StatTiles float lg 143 vs 132 · TabsRow float tabs hug labels (719 vs 774) · Card float items under the head (Archive 100 vs 76) · LinkAddRow 106 vs 126 · quick add 36 vs 42 · Breadcrumb capsule 48 vs 44 · New task 116×36 vs 132×38 · filter capsule 540×36 vs 706×40 · IndexRow 28 vs 32 · type roles (38 vs 36/40/44, 18 vs 20, Inter vs mono labels) · the flags' square frame on round flags (DocumentLangMark).

## W7 — Rails view scope — TALK

- The plan said "every float rail in one view"; frame 9:14486 is one page (nav expanded + bottom Rail). Built as drawn; every NavRail state lives on `/#/parts/navigation`. His call: keep, or a second Rails board with every Rail state.

## Open — TALK

- W6, W7.
