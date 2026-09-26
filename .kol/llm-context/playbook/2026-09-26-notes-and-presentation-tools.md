# Playbook — Notes and Presentation, as tools

> **Live work journal.** Append-only, newest at the bottom, real timestamps. One idea per line, no prose.
> Milestone logs: `session-log/`. Parent arc: `playbook/2026-09-26-the-hub.md`.

**Goal:** notes and presentations become TOOLS — each built alone first (`apps/<tool>` on the fixture, parts in a DS package), then mounted as rail tabs in `apps/media-shell`. The shell carries tools; it never grows them.

**Standing rules (non-negotiable):**
- A tool is built alone first (`apps/notes`, `apps/presentation`), then mounted — never grown inside a `-shell` app.
- Parts go in packages; apps hold fixture + wiring only (`07-apps-tier/01-tier-rules.md`).
- Tool in a shell = the same tool (memory `tool-in-shell-is-the-same-tool`): one home, both apps render it.
- Data is consumer-injected (client verbs); the fixture fakes them; no network.
- olina and kol-noter are reference only from this machine — read, never file or edit (memory `cloned-repos-are-reference-only`).
- One tool at a time, all the way through, before the next.

---

## What exists (read 2026-09-26)

**Notes**
- `@kolkrabbi/kol-notes` — RULED its own UI package (user, 2026-09-04); not built. D1 out, data injected.
- kol-noter intake — 51 components scored (31 pure · 16 props · 4 app); DS answered: pattern specs, ONE AT A TIME, inline-edit table first; waiting on kol-noter's go (`lobby/inbox/note-component-extraction-lead.md` 🟠). kol-noter not cloned here.
- kol-olina `apps/brand` — `pages/Notes.jsx` (230) + `pages/NoteEdit.jsx` (197) + `lib/notesStore.js` (57): title · markdown body · attachments · favourite; draft in localStorage, save to D1 via the media admin's Pages Function.
- DS today — `DocumentEditor` (markdown fields form, Write/Split/Preview, attach, drafts, `inline`), `CatalogPage`, `localDrafts`. media-shell's Notes tab is a stopgap on these (bucket text files).

**Presentation**
- kol-olina `apps/brand/src/components/loaders/decks/` (~4,000 lines) + `pages/SlideDeck{Edit,Manager,Templates,View}.jsx`:
  - `slideDoc.js` — the model: 1920×1080 stage, background, z-ordered layers `text | image | rule`, stage px; presets as data (fxr's compose model cut down).
  - `SlideRenderer` / `SlideThumb` / `SlideStage` (edit, snap) / `SlideInspector` / `useDeckHistory` / `layerOps` / `snap`.
  - `slideExport.js` — document → SVG → PNG (fonts embedded as base64 woff2; `var()` resolved first — fxr's pattern, two traps documented).
  - `deckStore.js` — three tiers: localStorage autosave · deck FILE (portable) · D1 save.
  - `DeckShell` (embla present mode), templates, manager.
- DS today — `ContentCard`/`ContentRow` `slide` variant, `CatalogPage preset="shelf"` (both from olina's /slide-deck); design-editor's compose model is the parent; `SelectionOverlay`, `LayerStack` in kol-component.

---

## Decisions (mine unless marked — flag any to overrule)

1. **Notes first, then Presentation.** Notes is small and half-exists in the DS; decks are ~4k lines. One at a time.
2. **Notes v1 source = olina's notes, not kol-noter.** kol-noter's patterns land later into the same package, one at a time, on their go. v1 does not wait on them.
3. **A note is a D1 ROW with a markdown body** (olina's model), not a bucket file. Attachments are media keys. → media-shell's Notes tab changes meaning from "text files in the bucket" to "notes". ⚠️ user call.
4. **Presentation = its own package, name proposed `@kolkrabbi/kol-deck`** (ARCHITECTURE §3 trigger: multiple consumers — olina, media-shell — own cadence). Not folded into design-editor (that is the fxr app, §4's build exception). ⚠️ name is the user's.
5. **Formats:** native deck file (`.deck.json`, olina's portable tier) · PNG per slide · PDF (the SVGs, one per page). **Not `.key`** — Keynote's bundle is proprietary and not writable in a browser. PPTX later, only if asked (needs a dependency).
6. **Anatomy grows a word:** an app is Shell + Hub + Tool(s) — media-shell is the first with several (`16-app-anatomy.md`).

---

## Phases

### Notes
- **N0 · read-through** — olina Notes/NoteEdit/notesStore line by line → gap list against DocumentEditor · CatalogPage · drafts. Out: what kol-notes adds vs what already ships.
- **N1 · `packages/notes`** (`@kolkrabbi/kol-notes`) — `NotesCatalog` (CatalogPage over notes: title · updated · favourite · tags) + `NoteEditor` (DocumentEditor-based: title, markdown, attachments via `MediaPicker`, favourite; draft/save tiers). Client contract: `listNotes · loadNote · saveNote · deleteNote · setFavourite`. Roster/taxonomy/demos/gates.
- **N2 · fixture** — a `notes` table in media-fixture's fake D1 + the verbs + seed notes; test.
- **N3 · `apps/notes`** — the tool alone on the fixture; `pnpm notes`; slug `/apps/notes`.
- **N4 · mount** — media-shell's Notes tab renders kol-notes (stopgap `Notes.jsx` → `_tmp/`).
- **N5 · later, separate** — kol-noter's patterns into kol-notes (table first) on their go; olina cutover when the user files it from the iMac.

### Presentation
- **P0 · read-through** — the olina deck folder in full → gap list against the DS (slide card/shelf, SelectionOverlay, LayerStack, snapping, history) and the fxr compose parent. Out: the package's file list, what is promoted to kol-component instead.
- **P1 · model + render** — `slideDoc` (model, presets, clone), `SlideRenderer`, `SlideThumb`, `slideExport` (SVG/PNG). Pure; checks for the model and the export traps.
- **P2 · editor** — `SlideStage` (select, move, resize, snap), `SlideInspector`, history, layer ops; DS parts reused, not copied.
- **P3 · deck** — manager (`CatalogPage preset="shelf"`), templates, present mode (`DeckShell`).
- **P4 · formats** — deck file load/save, PDF export, PNG per slide; client contract `listDecks · loadDeck · saveDeck · deleteDeck`.
- **P5 · fixture + `apps/presentation`** — fake `decks` table + seed deck (olina's credentials deck as the fixture); the tool alone; `pnpm presentation`.
- **P6 · mount** — media-shell gets a Presentations tab.
- **P7 · later** — olina cutover (retire its copies), filed by the user from the iMac.

### Verification (each phase)
- `pnpm validate` green · the tool alone clicked through live · the mounted tab identical to the tool alone (parity check first, unasked).

---
## Entries

[19:45 GMT · 2026-09-26] · setup · playbook created
  what → scope + phases for notes and presentation as tools   why → user: "scope and phase plan for notes and presentation"
  note → media-shell Library masthead now "Library" (HubHome `title`/`subtitle`) — the fix before this plan
