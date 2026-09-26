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
