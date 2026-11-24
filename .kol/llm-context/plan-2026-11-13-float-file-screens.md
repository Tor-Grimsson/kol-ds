# Plan — float file screens: Labs, Randomiser, Record dashboard

**Raised:** 2026-11-13, chat. Points verbatim: *"ok so then do that now [W12 of plan-2026-11-12-one-header], and also build randomiser both mobile and desktop, relevant frames with relevant content. If you dont have components, then you just build it anyway not as components. Then Build record -dashboard from website in float https://www.figma.com/design/879P1yBsBPqpdGI5a5v2Y5/?node-id=40-8927 both styles"*
**Status:** CLOSED 2026-11-13 — phase log `docs/operations/09-phase-log/2026-11-13-float-file-screens.md`. W1, W2, W4–W9 built — 2026-11-13. Open: library masters (CalendarHeatmap, CalendarScale, StatTiles, card header, LineChart, RankedListRow share, RailFloat collapse-v body/footer, ReaderBar phone) so the plain-frame stand-ins can go back to instances.
**Shape:** W › phase › list.
**Laws carried:** kol-figma LAW.md (all rules; 17 — base components keep their names), measure from live code never by eye, never delete (old pages to `_trash` with a `_` name), clip content on, float rails 264/360, selection fg-12 / hover fg-04, icons oq never fg, no borders.
**How a phase closes:** measurable acceptance line first, audit 0, then a look-check against his words (one per W, at the end).

Figma file: `◇ float--kol-ds-ui` (879P1yBsBPqpdGI5a5v2Y5). All work by kol-figma-agent, one W at a time, in order.

## W1 — Float labs page rebuilt (= W12 of plan-2026-11-12-one-header, P16)

### 1.1 — Trash and rebuild ↳ Float labs (node 40:8925) — ✅ built 2026-11-13
- Spec and acceptance exactly as W12 in `plan-2026-11-12-one-header.md`.

## W2 — Randomiser, desktop and phone (P: "relevant frames with relevant content")

### 2.1 — ↳ Randomiser page — ✅ built 2026-11-13
- Source: `apps/randomiser` (port 5200) and `apps/editor` `/randomiser`, both `MobileView` from `packages/design-editor`. Measure at 1600×1000 and 390×844.
- Frames: entry card · Generate (empty, generated result, its controls open) · Effects (an effect applied, its controls open) · any sheet/settings it opens · light theme — each at desktop and phone.
- Library instances wherever a library component exists; where none does, the part is built as plain named frames (no new components), per his word.
- Acceptance: every frame's labels and values equal the live DOM's (script diff 0 missing, 0 extra); every frame has a desktop and a phone twin; audit 0, 0 unlinked; rail edges within 2px of live.

## W3 — Record dashboard from the website, both styles (node 40:8927) — SUPERSEDED by W5 (built as two stacked layouts; float was meant as one overlay view)

### 3.1 — Content from kol-website `apps/record` /dashboard
- Content = the website's six tabs (Tasks, Capture, Projects, Calendar, Metrics, Links) and what each shows (`kol-website/apps/record/src/pages/Dashboard.jsx` + `components/Dashboard*.jsx`), with fixture text from those components.
- Style A, tabs: layout measured from `apps/float` `/#/views/record-tabs` (one frame per tab, calendar in timeline · month · week · day).
- Style B, float: layout measured from `apps/float` `/#/views/record-float` (FloatLayout, filter capsule, task index, inspector), one frame per tab.
- Acceptance: 6 tabs × 2 styles present (+3 calendar views in A); each tab's headings and group names equal the website's (script diff 0); audit 0, 0 unlinked; library instances for every shipped part.

---

# Round 2 — 2026-11-13

Points verbatim: *"dont put loose text items in sections. and I think it would be better if we aim for a 100vh 100vw so f.e. 1600x900 or whatever the average laptop res is. then I think we should do like in labs, FLOAT is overlay not stacked layout. we have to do something about the component renaming, for the scrillionth time!! I cant do it I need the fucking component to RETAIN its name so you know where the fuck it comes from. [black well card] what with the black background card, I dont get it. [Notes label] why is htis labeled control all of a sudden using uppercase? it seems you just did 2 versions but didnt understand the promt 1. tabs is just tabs, many view, but 2. is float All in on view hide show with toggling. so redo this. I also need [40:8931] metric dashboard in float FOLLOW metric data, multiple screens - same situation show me 2 versions ONE using toggles 100vh 100vw all same view. and then show me the standard version"*

## W4 — The guard: instance names, loose text, one viewport (P: renaming, loose text, 100vh)

Cause: the audit never checked an instance's layer name against its component, nor text sitting in a section, so agents renamed instances (`status`, `notes`, `kind`) and the audit passed.

### 4.1 — LAW 18–20 + audit checks — ✅ built 2026-11-13
- LAW 18: an instance's layer name equals its component (set) name. LAW 19: no loose text in sections. LAW 20: screens are 1440×900 fixed, clipped (100vw × 100vh).
- `audit.js` fails `instance-renamed` and `loose-text-in-section`.

### 4.2 — Sweep the float file — ✅ built 2026-11-13
- Every page of `◇ float--kol-ds-ui` (trash and stash excepted): reset every renamed instance to its component name; move loose section text into a frame (or SectionText). Float labs' `kind` text stand-ins on 04/05 stay text but sit in a named frame, not loose.
- Acceptance: audit `instance-renamed` 0 and `loose-text-in-section` 0 on every non-trash page.

## W5 — Record dashboard, redone (node 40:8927)

Causes: float was built as a stacked layout (FloatLayout with docked rails) instead of Labs' overlay; the default (non-float) LabeledControl was placed in a float rail, so its labels went uppercase; the code's `--kol-float-well` canvas (the darker box from the old 9:14340 mock) came along as a black card.

### 5.1 — Version 1, tabs: many views — ✅ built 2026-11-13
- One 1440×900 screen per tab (Tasks, Capture, Projects, Calendar timeline/month/week/day, Metrics, Links); TabsRow switches the view; content past the fold is cut by the frame.
- Content from the website (`kol-website/apps/record` Dashboard + components, board.json), as W3.
- Acceptance: 9 screens, each exactly 1440×900 and clipped; headings script-diff 0 against the website; 0 well/black canvas fills.

### 5.2 — Version 2, float: one view, panels toggled — ✅ built 2026-11-13
- One 1440×900 stage, Labs' model: NavRailFloat over the stage, each tab's content (Tasks, Capture, Projects, Calendar, Metrics, Links) a RailFloat window floating over it, shown/hidden by toggles in the nav; nothing docks or stacks.
- Screens: all windows hidden · each one shown alone (6) · a working set (Tasks + Calendar + Metrics) · one window collapse-v · phone not asked, not built.
- Every part its float variant (LabeledControl float: Inter 12, fg-64, no uppercase); windows 264 or 360.
- Acceptance: every screen 1440×900 clipped; 0 non-float variants where a float variant exists (script over instances' variant props); 0 uppercase text in LabeledControl labels; windows ∈ {264, 360}; audit 0.

### 5.3 — Trash the W3 screens — ✅ built 2026-11-13
- Both W3 sections go to `_trash` with `_` names.

## W6 — Metric dashboard in float (node 40:8931)

Source: `apps/metric` (DemoSeven with eight · nine · ten · eleven, data in `demo7/data.js`, `fixtures.json`, `data/repo-metrics.json`) — kol-website metric's /demo-11, the look he approved 2026-10-31. Its numbers and labels, never invented ones.

### 6.1 — Version 1, float toggles: one view — SUPERSEDED by 7.1 (empty stage)
- One 1440×900 stage; each metric section (top stats, charts, behaviours, tables…, as DemoSeven renders them) a RailFloat window over it, toggled from the nav; screens as 5.2 (all hidden · each alone · a working set · collapse-v).
- Acceptance: as 5.2, plus every number and label script-diff 0 against the live DemoSeven DOM.

### 6.2 — Version 2, standard — ✅ built 2026-11-13
- The dashboard as `apps/metric` renders it, as 1440×900 screens, one per scroll position or view (filter modal, date range, settings rail included where DemoSeven opens them).
- Acceptance: every screen 1440×900 clipped; text script-diff 0 against the live DOM per screen; library instances for every shipped part; audit 0.

## Order
W4.2 → W5 → W6. One kol-figma-agent at a time. Stand-ins (no component) stay plain named frames, synced later (his word). Nothing published.

---

# Round 3 — 2026-11-13

Points verbatim: *"in W6.1 · Metric — float there should always be a main view in the background the panels control! do it again correctly. aND YOU SKIPPED MOBILE!!!!! INCLUDE MOBILE!!!! and make also the FLOAT ebook reader in BOTH float style on a new page AND THE STYLE FROM RECORD ON KOL-WEBSITE"*

## W7 — Float always has a main view the panels control (P: "always a main view")

Cause: the float version was built as an empty stage with windows on it; the windows had nothing to act on.

### 7.1 — Metric float, redone (section 218:8084) — ✅ built 2026-11-13
- The full metric dashboard (as 6.2 renders it) is the main view behind every screen; the windows are its controls: range and compare, filters, sites, graph/metric pick, sections shown, settings. Each screen shows a window changing what the main view shows.
- Old 6.1 screens to `_trash` with `_` names.
- Acceptance: 0 screens with an empty stage; every window's control state matches the main view on the same screen (range, filter, metric: script-checked against the live DOM in that state); 1440×900 clipped; audit 0.

### 7.2 — Record float, same rule (section 215:13203) — ✅ built 2026-11-13
- Same fix: the record dashboard's main view (Tasks board) sits behind; the six windows toggle and drive it (tab content, filters, inspector).
- Acceptance: as 7.1.

## W8 — Mobile for both dashboards (P: "INCLUDE MOBILE")

### 8.1 — 390×844 twins — ✅ built 2026-11-13
- Every screen of 5.1, 7.2, 6.2 and 7.1 gets a phone twin at 390×844, measured from the live app at that width. On phone, float windows open as bottom Rails and the nav sits behind its trigger, as Labs does.
- Acceptance: every desktop screen has a phone twin (count equal per section); phone text script-diff 0 against the live DOM at 390; audit 0.

## W9 — Ebook reader, new page `↳ Reader`, two styles

### 9.1 — Style A, float — ✅ built 2026-11-13
- The reader on the KOL float parts: ReaderBar, ReadingContents rail (RailFloat), the prose page as main view; windows for contents, search, type settings.
- Source to measure: the KOL reader parts in `packages/shell` (ReaderBar) and the float file's ReadingContents; content from the record library.

### 9.2 — Style B, record on kol-website — ✅ built 2026-11-13
- As kol-website `apps/record` renders a library document (`/library/:collection/*`, LibraryDocument in FloatLayout overlay, Library contents and search). Read-only repo; run it if it renders without login, else read the code.

### 9.3 — States, both styles — ✅ built 2026-11-13
- Desktop 1440×900 and phone 390×844 each: reading · contents open · search open · settings/type open · end of chapter.
- Acceptance: every state in both styles at both sizes; text script-diff 0 against live; 1440×900 / 390×844 clipped; audit 0.

## Order
W7.1 → W7.2 → W8 → W9. No component → plain named frames (his word). Nothing published. Built only after his approval.

### 9.4 — Scope widened (2026-11-13): the whole ebook system — ✅ built 2026-11-13
His word: *"not just reader page tho, the entire float ebook system library reader writer etc, its multiple views !! i want it all"*.
- Every view of kol-website record's ebook system, both styles, desktop + phone: library (`/library`, shelf, tag, document), Folio (`/demo-3` library, reader, article, identity), writer (`/demo-4` shelf, new/edit FolioWrite, document). Main states per view.
- Acceptance: every route above present in both styles at both sizes; text script-diff 0 per screen; audit 0.
