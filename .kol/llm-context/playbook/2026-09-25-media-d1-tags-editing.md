# Playbook — media D1: tags, file editing, personalisation

> **Live work journal.** Append-only, newest at the bottom, real timestamps. One idea per line, no prose.
> Milestone logs: `session-log/`.

**Goal:** the media surface gets tags, text editing with drafts and per-person settings, over an optional client contract the fixture fakes in memory (standing in for olina's D1).

**Standing rules (non-negotiable):**
- every verb optional — a client without it hides the feature, nothing else changes
- apps/media stays provider-free; the fixture is the D1
- no UI component originates in the app; the DS ships it, the app wires it
- verify live in apps/media before calling a step done

---
## Entries

[21:46 GMT · 2026-09-25] · setup · playbook created
  what → initialised the live playbook   why → user go on the D1 plan (client contract · tags · editing · personalisation)

[21:48 GMT · 2026-09-25] · T1 contract · apps/media/src/fixture/{store,client,seed}.js ✓
  what → tags · drafts · writeText on the file record; list flags hasDraft, never carries text   why → a D1 row keyed by file id travels with rename/move/copy
  what → client verbs setTags · readText · saveDraft · writeText · loadSettings · saveSettings (all optional)
  note → copy keeps tags, drops the draft; SEED_TAGS gives the filter something at rest
  verify → store.test.mjs ✓ (fixture store ok · D1 fields ok)

[21:48 GMT · 2026-09-25] · T4 personalisation · MediaLibraryPages.jsx useBucketLibrary · App.jsx ~
  what → uncontrolled page + client.loadSettings → settings load per bucket, save through the client; null = reset
  before → App held settings + wrote localStorage   after → client pair wraps lib/settings.js, App owns none
  verify → pending live check

[23:33 GMT · 2026-09-25] · T2 tags · MediaLibraryPages.jsx TagEditor · ColumnBrowser.jsx renderDetails ✓
  what → preview pane chips (remove) + add field (Enter, comma list) in every view   why → the D1 plan item 2
  what → menu "Tags…" (one file, replace) · "Add tags to N…" (a set, append) · filter bar Tags group · rows Tags column under Fields
  note → rescue: a click in the pane counted as a background click and unpicked the file — details area stops pointer/click; ColumnBrowser root keys skip INPUT/TEXTAREA
  note → Tags header is a plain label (a file has several; nothing to sort by)
  verify → live apps/media: add · remove · prompt · filter BRAND 1 of 3 · rows column ✓

[23:33 GMT · 2026-09-25] · T4 personalisation ✓
  verify → rows view + Fields survive a reload through client.loadSettings ✓

[23:36 GMT · 2026-09-25] · T3 editing · MediaLibraryPages.jsx FileEditor · MediaInspector onEdit ✓
  what → Edit in the preview pane (+ "Unsaved draft") and in Quick Look's header, for markdown · json · yaml · text · code
  what → pause 800ms → client.saveDraft · ⌘S / Save → client.writeText (draft cleared) · Revert → draft dropped, file text back
  note → rescue: unmount flush read a stale `base` — moved to a ref; ⌘S moved from the textarea to a window listener (reopened editor had no focus)
  verify → live: draft survives close + reopen · ⌘S saves · pane re-renders the new text (URL changes → KindPreview refetches) · QL → Edit → Revert ✓

[23:37 GMT · 2026-09-25] · T5 ship ✓
  what → contract at the head of MediaLibraryPages.jsx · media plan § D1 marked done · changelogs
  note → headings gate caught a date in the new H2 — moved into the body
  verify → fixture self-check ✓ · 27 gates ✓ · published kol-theme 0.149.0 · kol-component 0.223.0 · app loads clean

──────────── MILESTONE: media D1 — tags · editing · personalisation ──────────── [23:37 GMT · 2026-09-25]
  changed: component (MediaLibraryPages, ColumnBrowser) · theme · apps/media (fixture, App) · 2 docs · build ✓
  log: not written yet — /log-work

[23:40 GMT · 2026-09-25] · round close · everything this round ✓
  verify → npm matches local: component 0.223.0 · theme 0.149.0 · controls 0.3.1 · dashboards 0.4.2 · no task servers left · 27 gates ✓
  what → AGENT-CONTEXT's queued coverage audit marked done (it would have sent the next session to redo it)
  note → decision: no adoption ticket filed to kol-olina yet — the D1 scoping playbook sequences it (server half first)
  next → playbook/2026-09-25-d1-scope-and-plan.md
