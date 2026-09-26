# Playbook — D1, the rest of it: scope, report, plan

> **Live work journal.** Append-only, newest at the bottom, real timestamps. One idea per line, no prose.
> Milestone logs: `session-log/`. Previous round: `playbook/2026-09-25-media-d1-tags-editing.md`.

**Goal:** take the D1 pass from "the DS and the fixture can do it" to "olina runs it on real D1, per person", then build the features a metadata store makes possible.

**Standing rules (non-negotiable):**
- every verb optional — a client without it hides the feature
- the DS never talks to a database; servers are the consumer's, the client package is the seam
- a phase is done when it is running on olina, not when it is published
- one D1 write per deliberate act or pause — never per keystroke (free tier: 100k writes/day)

---
## Report — where D1 stands

**Done (kol-component 0.223.0 · kol-theme 0.149.0, 2026-09-25)**
- Contract written at the head of `MediaLibraryPages.jsx`: `setTags` · `readText` / `writeText` / `saveDraft` · `loadSettings` / `saveSettings`
- UI: tag chips + add field in the pane, Tags… / Add tags to N… menu items, Tags filter group, Tags column; Edit in pane + Quick Look, drafts, ⌘S, Revert; settings through the client
- Proved on `apps/media`'s in-memory fixture only

**Not done — the other half is all server and identity**
- olina has **no** routes for tags, text, drafts or settings; its D1 has `files` · `folders` · `notes` · `decks` · `events`, none of the new data
- `kol-media-client` 0.4.0 has none of the new verbs; olina's client is built on it
- olina's auth is **one shared admin password** (Basic auth, `functions/api/_middleware.js`) — the server cannot tell people apart, so "per-person" settings are per-browser and every `updated_by` column is null
- olina is on component 0.220.0 and still holds settings in `App.jsx` + localStorage

**Findings on what I scoped (and would change)**
- **Identity is the real blocker.** Personalisation, "who edited this", recents and favourites all need a person. Recommend Cloudflare Access (free to 50 users, same vendor, the Pages app already sits behind Cloudflare): the middleware reads `Cf-Access-Authenticated-User-Email`; the shared password stays as the fallback until Access is on.
- **Draft pause is too eager for D1.** 800 ms is a write per typing pause. Raise to 2 s + write on close for real clients; keep 800 for the fixture. Make it a prop.
- **No conflict check on save.** Two people editing one file: last save wins silently. `writeText(key, text, bucket, { ifMatch })` with the file's `updated` → 409 → "changed since you opened it" dialog.
- **No size cap on editing.** A 5 MB JSON would load into a textarea. Cap Edit at 1 MB; above it the button explains why.
- **Folder tags are missing** — the apps-tier ticket asked to "tag folders, make a smart system". Tags are files-only today.
- **Tag entry has no autocomplete** — every tag is retyped; typos fork the vocabulary. The page already holds every tag in the listing.
- **Settings are keyed by bucket only.** With identity they key by (person, bucket); with none, by bucket as now.
- **SVG is text** but opens read-only — add `image/svg+xml` to the editable kinds with a live preview beside it.

**The user/home/settings set (fxr · mirror · monitor → `kol-shell`) — useful, with one gap**
- `CatalogPage preset="shelf"` → the media **Home**: shelves for Recent, Favourites, Smart folders, Unsaved drafts. Same page the apps already use for decks and presets.
- `SettingsScaffold` → a full **Settings page** for person-level preferences (default view, default bucket, draft pause, upload conversion, theme) — tabs Preferences · Shortcuts (`SettingsShortcuts`, fed by the same array as `ShortcutsOverlay`, which olina already uses) · About (`SettingsLinks` / `SettingsColophon`). The drawer (`SettingsPanel`) stays for per-bucket view settings.
- `WalkthroughPanel` → first-run tour of tags, Edit and Quick Look.
- `AppShell` + `NavRail` → only if media grows past one page (Home · Browse · Settings); olina's media is one page today, so not yet.
- **The gap: no account component.** Nothing in the set says who is signed in. Needs one small DS piece — `AccountChip` (Avatar + name/email + sign-out) — for the rail's `bottomItems` and the settings masthead. Belongs in `kol-shell`, beside `SettingsScaffold`.

---
## Plan — phases in order

Order rule: server contract → client package → adoption → identity → features. Each later phase needs the one before it running.

**P0 · Decisions (you, ~15 min)**
- identity: Cloudflare Access (recommended) or keep the shared password and accept per-browser settings
- tags storage: `file_tags(file_id, tag)` table (recommended — indexable, one row per tag) or a JSON column on `files`
- smart folders: saved queries per person (recommended) or shared

**P1 · olina server (olina repo)**
1. `schema.sql`: `file_tags(file_id, tag, PK both)` · `drafts(file_id, person, text, updated_at)` · `user_settings(person, bucket, json, updated_at)` · `ALTER files ADD updated_at, updated_by`
2. routes beside `list.js`: `PUT /api/tags` · `GET/PUT /api/text` (reads R2 bytes, writes R2 + `files.size/updated`) · `PUT/DELETE /api/drafts` · `GET/PUT /api/settings`
3. `/api/list` joins tags (`group_concat`) and a `has_draft` flag for the caller
4. `events` rows for tag.set · file.edit · settings.save (intentions only)
- done when: every route answers under the password with `person = 'admin'`

**P2 · `kol-media-client` 0.5.0 (this repo)**
1. the six verbs over those routes, optional per bucket (`writable` buckets only)
2. `writeText` takes `{ ifMatch }`; 409 surfaces as a typed error
3. reference doc `docs/documentation/04-compositions/16-media-d1.md`: schema + route recipe (as `15-media-uploads.md` does for conversion)
- done when: a unit check against a mocked fetch passes

**P3 · DS hardening from the findings (this repo, component 0.224.0)**
1. `draftPause` prop (default 800) · Edit size cap 1 MB · SVG editable with side preview
2. conflict dialog on 409 · tag autocomplete from the listing's tags
- done when: proved on `apps/media` (fixture grows `ifMatch` + a conflict switch)

**P4 · olina adopts (olina repo)**
1. bump component 0.223+ / client 0.5.0; drop `App.jsx`'s settings state (as `apps/media` did)
2. verify on media.olina-productions.com: tag, filter, edit, draft across reload, settings across browsers
- file the lobby ticket at the START of P1, not now — it should carry the schema

**P5 · Identity**
1. Cloudflare Access on the media app; middleware sets `person` from the Access header, password as fallback
2. DS: `AccountChip` in `kol-shell` (Avatar · name · sign-out href); `updated_by` shown in the pane facts ("Edited by …")
3. settings re-keyed (person, bucket)

**P6 · Features a metadata store unlocks (pick in this order)**
1. **Favourites** — star on files and folders (`notes.favourite` pattern); a Favourites filter
2. **Recents** — from `events` (opened · edited · uploaded), per person
3. **Folder tags** — same table, folder ids; a folder's tags show on its row and in its preview
4. **Smart folders** — a saved filter (tags + kinds + query) listed above the folders; per person
5. **Home** — `CatalogPage preset="shelf"`: Recent · Favourites · Smart folders · Unsaved drafts
6. **Settings page** — `SettingsScaffold` tabs Preferences · Shortcuts · About; the drawer keeps per-bucket view
7. **Tag management** — rename / merge a tag across every file; counts per tag
8. **Version history for text** — keep the last N saved texts in D1; "Restore" in the editor
9. **Comments on a file** — a thread in the pane (reuses notes' markdown body)
10. **Walkthrough** — `WalkthroughPanel` first run: tags, Edit, Quick Look, shortcuts

**Deliberately not planned:** full-text search inside files (needs an index D1 isn't for) · real-time co-editing (ifMatch is enough for a small team) · per-file permissions (one team, one bucket).

---
## Entries

[23:41 GMT · 2026-09-25] · setup · playbook created
  what → scoped the rest of D1 from olina's schema, routes, auth, client and the kol-shell set   why → user asked for phases, order, critique, features and the shell-set fit
  note → finding: identity (one shared password) blocks every per-person feature — P5 unlocks P6
  note → finding: the server half (P1) and the client package (P2) do not exist yet; the DS half is ahead of both
  next → P0 decisions from the user

[00:40 GMT · 2026-09-26] · replan · user rulings supersede P0–P6 above
  ruling → olina is out of the plan; apps/media's fixture IS the imagined olina setup (bucket + D1)
  ruling → one user, ever — no identity, no conflicts, no AccountChip (P5 and the ifMatch item dropped)
  ruling → drafts live in browser memory; D1 holds only what must outlive a device (tags · favourites · recents · smart folders · settings)
  ruling → media + kol-shell is its own app and URL (apps/media-shell); apps/media stays the tool alone; apps/shell alone later
  ruling → no review until the whole plan is implemented; blocking calls are mine
  gap → document authoring (olina brand NoteEdit concept: title · markdown body · Write/Preview · attachments · new-doc page) was not in the plan — added as P4
  decision → a media feature must render in apps/media too; media-shell adds only shell composition (home · settings · rail)
  decision → fixture moves to a private workspace package apps/media-fixture: fake bucket + fake D1 as separate modules

## Plan v2 — phases in order (supersedes "Plan — phases in order")
  P1 · shared fixture → apps/media-fixture (bucket.js · d1.js · client.js) · apps/media unchanged in behaviour
  P2 · drafts to the browser → saveDraft out of the contract · DS keeps drafts in localStorage per bucket+key · hasDraft derived
  P3 · apps/media-shell → AppShell + NavRail (Home · Browse · Settings) · own dev script + port · /apps/media-shell slug
  P4 · document authoring → DS DocumentEditor replaces the textarea: New document (name + type) · .md frontmatter form (title · tags · date · description · custom keys) · Write / Preview / Split · attachments from the bucket · 1 MB cap · SVG edits as text with a live preview
  P5 · favourites + recents → star in pane + menu · Favourites filter · recents from a fake-D1 event log
  P6 · Home (media-shell) → CatalogPage shelf: Recent · Favourites · Tags · Unsaved drafts
  P7 · Settings page (media-shell) → SettingsScaffold: Preferences (default view · default bucket · theme) · Shortcuts · About
  P8 · smart folders + folder tags + tag autocomplete + tag rename/merge
  P9 · walkthrough → WalkthroughPanel first run
  P10 · ship → docs · changelogs · gates · publish · both apps verified end to end

[01:03 GMT · 2026-09-26] · P1–P10 · plan v2 implemented whole ✓
  P1 → apps/media-fixture: bucket.js (bytes · keys · folders · trash · permanent file ids) + d1.js (tags · favourites · folder rows · events · smart folders · settings) + client + useFixtureMedia wiring shared by both apps · self-check ✓
  P2 → drafts are browser memory: DS utilities/localDrafts; saveDraft out of the contract (BREAKING for 0.223 clients); a newer draft restores, follows rename/move
  P3 → apps/media-shell: AppShell + NavRail (Home · Browse · Settings), hash routes, pnpm media-shell (5175), /apps/media-shell slug + vercel rewrite + root build
  P4 → DS DocumentEditor: new doc (name + type) · md fields form · Write/Split/Preview · Attach (in-editor list) · SVG · 1 MB cap · name carries the title
  P5 → favourites (files + folders, star in pane + menu, filter group) · event log (opened · edited · created · uploaded)
  P6 → Home: Recent · Favourites · Smart folders · Unsaved drafts (opens the editor) · Tags · New document
  P7 → Settings: SettingsScaffold · Preferences (default view · default bucket · theme · drafts · clear changes) · Tags (rename = merge) · Shortcuts · About
  P8 → smart folders (chips, flat matches) · folder tags · tag suggestions · rename/merge · frontmatter tags merge into D1 tags on save
  P9 → first-run WalkthroughPanel, replay from About
  P10 → docs (apps-tier index · media plan § D1 · inventory) · changelogs · 27 gates ✓ · published kol-theme 0.150.0 · kol-component 0.224.0 · both apps build ✓
  note → rescues: tag field unpicked its file (details island); walkthrough collapsed in the overlay's hugging sheet (sized box); Home doc tiles rendered full-size text (FileIcon); a smart folder drew the level's folders (hidden); a stale Vite export cache on the old media server
  note → decision: retirements R3 fired today — the four elder kol-display-* classes dropped (BREAKING, theme 0.150.0), block quarantined to _tmp/2026-09-26-elder-display-classes/
  note → decision: Attach uses an in-editor list, not MediaLibrary's picker (the picker imports the page — a cycle)

──────────── MILESTONE: media D1 plan v2 ──────────── [01:03 GMT · 2026-09-26]
  changed: component (DocumentEditor · localDrafts · frontmatter pair · MediaLibraryPages) · theme · apps/media · apps/media-fixture (new) · apps/media-shell (new) · docs · build ✓
  review → pnpm media (5174) · pnpm media-shell (5175)

[14:25 GMT · 2026-09-26] · review + ruling · the app anatomy ✓
  ruling → four layers, named: Shell (frame) · Catalog (the ContentFilters PAGE, whole layout) · Hub (Home-as-Catalog · Settings · shortcuts · walkthrough) · Tool (the work area)
  ruling → an app = Shell + Hub + Tool, the Hub nests a Catalog; apps tier = apps/shell · apps/<tool> · apps/<tool>-shell; brand is a tool, not a second shell
  review → media-shell: walkthrough opt-in + X inside the card · smart folders out · Recent/Favourites as the view toggle · Home must BE a Catalog
  doc → docs/documentation/04-compositions/16-app-anatomy.md (draft; table refined against the real code)
  next → user clones monitor · mirror · fxr · kol-website; session restarts; read the overlap → define the Hub → apps/shell → review → media-shell rebuilt
