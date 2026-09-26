# Handoff — 2026-09-26 19:57

## Goal of the current arc
The app anatomy made real: kol-shell's `AppHub` (Shell + Hub) around tools, with `apps/media-shell` as media inside the shell — identical to `apps/media`. Next: notes and presentation built as TOOLS first, then mounted as media-shell tabs.

## Last actions taken (causal trail, newest first)
- Plan written: `playbook/2026-09-26-notes-and-presentation-tools.md` (scope, N0–N5 notes, P0–P7 presentation, 4 decisions for the user).
- Library masthead says "Library" — `HubHome` takes `title`/`subtitle`.
- Page wash per route in media-shell: none on `/browse` (the tool's ground = apps/media's bare surface-primary), fg-02 on Library · Notes · Settings.
- One tool, two frames: DS `MediaLibraryExplorer` `keys` (B F R C G N, K→onKinds) + `phoneTabs`; media-fixture `useMediaTool` (drawer footer: theme chip · clear changes · file formats; FileFormats overlay; ⇧R) and `TOOL_SHORTCUTS`; both apps render it.
- Parity: `columnHeight: 'fill'` (measured) in the DS; per-bucket defaults moved apps/media → `media-fixture/defaults.js`; fixture drops stored `columnHeight`; apps/media's `lib/settings.js` ▣ `_tmp/2026-09-26-media-settings-module/`.
- media-shell rail: Browse `/` · Library `/library` (`AppHub homePath`) · Notes `/notes` (stopgap: Catalog of bucket text + `DocumentEditor inline`) · Settings. One settings system: `mediaSettingsSections` (DS export) drawn by the browse drawer, the Hub page and the Hub drawer over one per-bucket object.
- Native-title sweep + gate `validate-native-title` (28th); `Tooltip` `asChild`, empty-label passthrough, ambient tone (panel-bg), border oq-08, no shadow.
- Tones: `/foundations/tones` visualiser (surface × wash × tone), `13-tone-lookup.md` generated, control-chrome Tone table by depth, `Dropdown` `{ divider: true }`, ViewToggle selected chip fg-08 under a tone.
- AppHub + apps/shell built and reviewed (see the 2026-09-26 session log and `playbook/2026-09-26-the-hub.md`).

## Current state / open decision points
- **Nothing published.** kol-shell · kol-component · kol-theme carry the whole day (unpublished); gates 28/28 clean.
- **User decisions pending (notes/presentation plan):** (1) a note = D1 row with markdown body (changes media-shell's Notes tab meaning) · (2) package name `@kolkrabbi/kol-deck` · (3) formats deck.json + PDF + PNG, no .key, PPTX only if asked · (4) notes before presentation.
- **Open bug, held:** at 390 AppShell's drawer trigger (☰, fixed top-right) overlaps a page's top-right controls (tool header bucket/gear, Settings masthead). Shell-level, every Hub app.
- **Known quirks:** ⌥1 (mark) and ⌥2 (Browse row) both go to Browse; `SettingsChoice` outside a tone wrapper loses the open panel's top hairline (accepted).
- media-shell's `Notes.jsx` is a stopgap until kol-notes (N4 retires it to `_tmp/`).
- The DS smart-folder seam in `MediaLibraryPages` is dormant (fixture verbs removed); retiring it is a DS call for the user.

## Next intended action
- Get the user's four decisions, then start **N0**: read kol-olina `apps/brand/src/pages/Notes.jsx`, `NoteEdit.jsx`, `lib/notesStore.js` line by line → gap list vs DocumentEditor · CatalogPage · localDrafts. Append to the notes/presentation playbook.

## Working memory not yet in AGENT-CONTEXT
- kol-olina IS cloned at `~/dev/projects/kol-olina` (reference only); kol-noter is NOT on this machine (`~/dev/projects/kol-docs/kol-noter` absent).
- olina's deck code: `apps/brand/src/components/loaders/decks/` (slideDoc model, SlideRenderer/Thumb/Stage/Inspector, useDeckHistory, layerOps, snap, slideExport with the font + `var()` traps, deckStore three tiers, DeckShell present mode) + `pages/SlideDeck{Edit,Manager,Templates,View}.jsx`.
- The user's dev servers: 5175 media-shell, 5176 shell (theirs — never touch). Mine were 5184–5187, all closed. A running Vite caches package `exports` — new subpaths need a restart, so shared exports go through `media-fixture/wiring`.
- User preferences this session: talk plainly and briefly when they want dialogue; no rgb/pixel values in replies (classes and tokens only); parity between `apps/<tool>` and `-shell` is expected unasked (memory `tool-in-shell-is-the-same-tool`); clones are reference only (memory `cloned-repos-are-reference-only`).
- AGENT-CONTEXT's newest entry stops at the Hub/apps/shell/tones checkpoint; everything after (media-shell rebuild, parity, tooltips' tone, plan) lives in the two playbooks + this handoff — a `/log-work` would fold it in.
