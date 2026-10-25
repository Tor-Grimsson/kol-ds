# Plan — rails, his first review

**Raised:** 2026-10-25, his review of `apps/rails` (W1 · W2 of `plan-2026-10-25-rails.md`) with three screenshots: studio-hub's settings rail on ui.kolkrabbi.io as it was (380), monitor's rack with the bottom rail open, monitor's rack with the nav rail expanded and the patch table open. Points verbatim: *"monitor FUCKED UP with this … we need to fix the bottom rail so its not retarded"* · *"no one asked for this modules sholud not be there overlaid in the rail"* · *"why is H same as labs siderail and not the same as settings?"* · *"why is settings now less wide? it was fine before?"* · *"it used to be like this … what happened?"* · *"why do some have border and some do not?"* · *"bottom rail goes over navrail"*.
**Status:** W1 · 2.1 · 2.2 (the proposal) · W3 (ticket `RailRolesOnMonitor` filed) · W4 built 2026-10-25, for his review — `_tmp/2026-10-25-rail-roles/walk2.mjs` 27/27 (380 against studio-hub's, H = the settings shell, no edges, P · H · E stacking, the bottom rail at 48 and at 0 with the rail hidden, the site frame, the phone rule). His rulings taken: *"border off, but ship with opt in if they want"* (1.3), the monitor ticket (W3), *"show me bottom rail layout suggestion"* (2.2 proposed in `apps/rails`). What happened to the width: RailKit (2026-10-24, from monitor's *"settings is showing 380 wide and padding is totally different in the rail and the settings"*) made one width per tier and set the app tier to **320** with round 18 open; the settings rail reads that tier, so it narrowed. The border is this plan's predecessor (W3's pick, the edge on patch and page). Both are reversed here.
**Published 2026-10-25:** kol-theme 0.190.0 · kol-framework 0.56.0 · kol-component 0.302.0 (*"ok lets call it, its fine for now"*).
**Shape:** W › phase › list.
**Laws carried:** one shell for one job, never a variation per app; the Hub's settings rail is the yardstick (his screenshot); visual calls go on the open-questions page; only the repos he names get a ticket; no publish until he reviews.
**How a phase closes:** acceptance line first, gates green, then Playwright against his own words.

## W1 — One shell for every side rail

### 1.1 — The width is 380 again — ✅ built 2026-10-25 (P: *"why is settings now less wide? it was fine before?"*, *"it used to be like this"*)
- `--kol-rail-w-app` → 380. Round 18 closes on it: the settings rail is the 2026-08-27 width on every app; the site tier was already 380. The tiers keep their padding tokens; the width is one number.
- Monitor's patch table at 440 and fxr's inspector on the 264 · 320 ramp stay their adoption items — the DS number is 380.
- Acceptance: studio-hub's `,` rail measures 380 at 1440; round 18 marked answered with 380; `apps/rails` every side rail 380.

### 1.2 — The page rail IS the settings rail — ✅ built 2026-10-25 (P: *"why is H same as labs siderail and not the same as settings?"*)
- `role="page"` takes the settings rail's shell — the scrim, no edge, `RailHeader`, 380 — and its content is typed rows (`SettingsSections`), as the settings rail's is. The page rail is the page's settings; the only difference from `,` is whose rows they are and the key, H.
- fxr's inspector anatomy (tabs, 112 labels, the foot) leaves the page rail in `apps/rails`; it stays in the kit for the rail that is an inspector (labs), which is fxr's own.
- Acceptance: in `apps/rails`, H and `,` open rails that measure the same (width, padding, scrim, header) and differ only in title and rows.

### 1.3 — No border on any rail — ✅ built 2026-10-25, `edge` the opt-in on his word (P: *"why do some have border and some do not?"*)
- `edge` off on every role, desk and phone. Round 19 closes: the edge is out; a rail reads as a surface by the scrim (settings, page) or by its content against a live page (patch — monitor's own no-scrim ask, the rack behind it). Decided for review; the alternative in one line: the scrim on the patch rail too, and monitor's live-rack patching goes.
- Acceptance: no `[data-rail-role]` panel carries a border at 1440 or 390; round 19 marked answered.

## W2 — The bottom rail

### 2.1 — Beside the nav rail, by the role — ✅ built 2026-10-25 (P: *"bottom rail goes over navrail"*)
- `role="bottom"` measures the shell's rail (`.kol-shell-rail`) when it opens and follows it (ResizeObserver): the rail's left edge is the nav rail's right edge, on the desk; on a phone there is no rail and it is full width. In the package — monitor gets it on the bump, and `apps/rails` drops its `md:!left-[…]` class.
- Acceptance: `apps/rails` and `apps/rack-hub` at 1440 — the bottom rail's left edge is 48; with the rail hidden on `\`, 0; at 390, 0.

### 2.2 — The shape of the bottom rail — proposed in `apps/rails` 2026-10-25, his word pending (P: *"we need to fix the bottom rail so its not retarded"*)
- What the screenshot shows: no header, the × alone in the top-right, the Edit · Rack · Library side rail with its own collapse chevron, CASE and PARKED floating in empty height, nothing of the kit on it.
- My proposal, decided for his word: the bottom rail wears the kit like the side rails — `RailHeader` (the view's name, the case as subtitle) on the header line with the ×; the side rail inside at the kit's row style (`Button variant="nav"`), no chevron; the tier's padding; 30dvh default, resizable from its top edge as now. `apps/rails` shows it; monitor adopts it on the bump.
- He names what else is wrong on the screenshot before 2.2 is built.

## W3 — Monitor's side — ✅ filed 2026-10-25, `RailRolesOnMonitor` (P: *"no one asked for this modules sholud not be there overlaid in the rail"*, *"monitor FUCKED UP"*)
- The MODULES list in monitor's nav rail is monitor's `RackRailPanel`, portalled into the rail's opened width through the DS's `useRailSlot` (NavRailConsumerSlot, kol-shell 0.64.0 — his 2026-08-28 ruling: *"lets adjust the new rail to accept the same things"*). Nothing in the DS draws it; the slot stays (labs uses it).
- Ticket to kol-monitor, filed on his go: drop `RackRailPanel` from the rail slot (the modules live in the Library and Create); take `role="patch" | "page" | "bottom"` and `useRailKey` on the bump; the bottom rail beside the nav rail comes with 2.1.
- Acceptance: the ticket in kol-monitor's inbox with these three items; its receipt returns here.

## W4 — Docs and the record
- `19-rails.md`: the roles table (380, no edge, page = settings shell), round 18 and 19 answered; `Rail.mdx`; the changelog's Unreleased entry rewritten to what ships.
- Closes into `docs/operations/09-phase-log/` with the predecessor.
