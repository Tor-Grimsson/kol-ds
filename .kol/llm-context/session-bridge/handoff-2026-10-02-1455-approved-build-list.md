# Handoff — 2026-10-02 14:55

## Goal of the current arc
The 2026-10-01 → 02 question round is BUILT (22 items, all gates clean, nothing published). A second, shorter round of questions followed and is ANSWERED IN FULL. What remains is one approved build list of eleven items. The user restarted the session before saying go. **Nothing on the list below has been started.**

## The approved build list — every item is ruled, none is built

The user's last word on it was "no /log-work-handoff, I'm restarting the session" in reply to "Go?". So: **read this, then ask him for go on this list. Do not re-ask any of it.**

1. **`MediaPlayer`** (kol-component, molecule). `variant="video"` or `variant="audio"` — the word is **variant**, not "kind". Optional `frame` prop: given, it draws inside `QuickLookFrame` (the Quick Look window); absent, it plays inline. It is `QuickLookFrame` + the media + `PlaybackBar`, driven by the `usePlayback` hook. `VideoSheet`, `AudioSheet`, `AudioPlayer` and `AudioPreview`'s own player all become it (aliases on the ledger). `AudioTile` · `VideoTile` · `formatLength` live in `AudioPreview.jsx` and are still used — they move to a file named for what is left.
   - This is the merge he ruled in round two and meant all along: *"I was never talking about hlsvideo when I was suggesting merging audio and video player, I was referring to the two players in the quicklook in media."* The earlier "MediaPlayer = AudioPlayer + HlsVideo" reading was the agent's error.
   - His words on the window: *"why would media player not just prop the window, its not called WINDOWmediaplayer."*
2. **`Slider`** gains `direction="vertical"` (standard look) and `variant="scrub"` (the thin track with the 4×28 pill knob, today `.kol-playback-scrub`). It is already usable bare: `label` is optional and `readout="none"` exists. Then the hand-drawn ranges move onto it:
   - `PlaybackBar` scrubber → `variant="scrub"`; `PlaybackBar` volume → `direction="vertical"`
   - `AudioPreview` volume → disappears into `MediaPlayer`
   - `MediaLibraryPages` row-size and tile-size sliders → `<Slider readout="none">`, same `slider-black` track already
   - foundry `FontViewerComponent` `SliderControl` → `Slider readout="value"`
   - `QuadrantSync` fade → `Slider`, WITH a visible change (it is the browser default tinted by `accentColor`; on Slider it takes the KOL track, colored via `--kol-slider-track`)
   - design-editor `AutoControls` → keeps its own row (a slider beside a field that takes a number or an expression like `sin(t)`); only its range part may become a bare `Slider`
   - His words: *"shouldnt the slider just prop the value and readout whatever so it can be used? … this is the fader issue all over again isnt it?"* — yes it was.
3. **`Knob`** is the survivor's NAME in kol-component, with `variant="dial"` (today's RotaryDial ring-and-disc) and `variant="panel"` (the rack knob merged in tonight). `RotaryDial` becomes the alias. His reason: *"knob being the more simple form, rotary dial being more of a variant."* Today the code is the other way round: `RotaryDial` with `variant="dial" | "panel"`, and kol-hardware's `Knob` is a deprecated wrapper over it — untangle that so there is one `Knob`.
4. **`apps/rack` and `apps/mixer`** — two small test-bed apps in the apps tier (like `apps/notes`, `apps/media`). Rack: a case with 1U AND 3U rows, modules with headers, labeled controls in BOTH row heights, the touch hold (`onHold`) opening `ParamSheet`. Mixer: a row of channel strips with their knobs and sliders and the same touch hold. No real audio or routing. The two showcase sets (`showcase/src/sets/rack.jsx`, `mixer.jsx`) then MOUNT the apps' entry files so set and app cannot drift (the pattern `showcase/src/previews/Notes.jsx` uses).
   - **NOT `apps/controls`** — he rejected that: *"controls is not about rack or mixer its about actual UI"*. It is the controls reference.
5. **Icons** (kol-icon-set-interface):
   - `rotate-left` / `rotate-right`: redraw with a WIDER GAP in the arc (his reference, Image #5: an open arc with a clear break before the arrowhead; "its almost no gap in your suggestion")
   - text align: we have left · center · right (+ valign top · middle · bottom). ADD the four justify (justify left · center · right · all) and the two spine ones (toward / away from spine) — Affinity's nine (Image #6)
   - ADD space-evenly horizontal and vertical (distribute) — neither exists
   - `corner-down-left` (the return arrow): a SMALLER arrowhead, closer to lucide's
   - the other eight redrawn align/flip glyphs (Round 4) are approved: *"other than that I like the new icons"*
6. **`Kbd`**: the icon size follows the cap size (10 in `sm`, 12 in `md`). Today it is 12 in both, so in the small ⌘K cap the ⌘ is bigger than the K.
7. **"palette" → "search modal"** across code and docs. *"I want that, I hate palette, its a fucking stupid name."* Memory saved: `say-search-modal-never-palette`. Component is `ShellSearchOverlay`; there is also a Module `showcase/src/blocks/command-palette.jsx` and `palette-reference.jsx` (the latter is about COLOR palettes — leave color senses alone, as the demo → preview sweep left "demo data" alone).
8. **GitHub back in the header** — four icons: GitHub · search · settings · theme. (Round 3 had moved it into Settings › Links.)
9. **v1 icon set cleanup**: the set is already `kol-icon-set-interface` (renamed 2026-09-30). Stale: the `/icons/v1` route in `showcase/src/App.jsx`, `IconsGallery.jsx`, `showcase/src/docs/loaders.mdx`, `open-questions/2026-09-30-e.jsx`, `docs/documentation/INDEX.md`, `02-icons/INDEX.md`, `03-components/04-diamond-tier.md`. The three `KOL_ICON_SET_V1*` aliases drop on the ledger's schedule after the iMac estate scan — do NOT drop them from the MBP. The bulletin line in `LLM_RULES.md` ("icons are v1-only") is the shared symlinked file — his to change with `/bulletin`, never edited from here.
10. **Sidebar icon state + a Module to show it.** A third rail state beside visible and hidden: the sidebar collapses to a narrow strip of icons, one per group, and opens on hover. Built into the REAL rail (`ShellSidebar` / `RailSection` / `RailRow` — groups carry `icon` since tonight). Plus ONE NEW Module that mounts the real header and both real sidebars with placeholder content and nothing else, showing the three states: open · icons only · hidden. *"I wanted that icon state on the rails. even if we dont use it, I want to see it."* The existing `/modules/sidenav-workshop` is a hand-drawn imitation and will not show it; `/modules/shell-topbar` is the real `ShellHeader`.
11. **Mark the question rounds answered**: Rounds 3, 4, 5, 6 and 7 in `showcase/src/open-questions/` (`meta.status`). Round 7 (`2026-10-02.jsx`) is text-only and was not browser-checked.

**Closed without work, do not raise again:** primary button hover (*"lets deal with that later, skip for now"*) · editor on/off switches (they are `LabeledControl inline` + `ToggleSwitch`, confirmed, done) · the "COMPONENTS / ATOMS" path above titles (stays) · the hardware Icon Button, Close Button and Button `iconOnly` (nothing merges — Icon Button has a lit LED state) · component page sections vs shadcn (no change) · Fader/Slider, PanelLabel/LabeledControl (merged, accepted) · PanelDropdown (retired long ago).

## Last actions taken (causal trail, newest first)
- Second question pass answered one question at a time (audio → the rack apps → older rounds). Round 7 page written for it (`showcase/src/open-questions/2026-10-02.jsx`).
- Memory `say-search-modal-never-palette` written.
- `/kol-goal go` ran to completion: 22 boxes ticked, `status: done` (`.kol/llm-context/.active-goal-01aa05d0-….md`). Journal, every item with files and verification: `playbook/2026-10-01-review-round-2-goals.md`. Record: `docs/operations/09-phase-log/2026-10-02-question-round.md`.
- Built in that run (all unpublished): result row wash + kind glyph + path · preview stage on `.bg-surface-sunken` · knob bar = named dropdowns, capitalised labels · `MultiSelect` · `Dropdown { heading }` · tier moves (ChessBoard, ColorSwatch, ActionButton, RailSection, ClearspaceDiagram, RotaryDial, Knob, Fader → molecules) · Knob/Fader `onHold` in place of opening ParamSheet · `HlsVideo` → `BackgroundVideo` (utilities) · `ProfileAvatar` → `BrandAvatar` · Button's six tone-duplicate variants deprecated + 268 call sites → `tone` · hardware twins merged as `variant="panel"` (Fader → Slider, Knob → RotaryDial, PanelLabel → LabeledControl) · rails list page sections from `nav/page-sections.json` (`pnpm extract:sections`), Styles and Search lost their self-parent level · rail glyphs · foundations → Related docs · Rack and Mixer sets, `RackCase` · `RackRow` · `RackSlot` in kol-hardware · `LandingWall` on Modules/Sets/Apps/Packages · tier-home package checklist · graph files/orphans/filter/display (`indexGraph`) · demo → preview across the showcase code · framed tool previews from the apps' own entry files · `validate:gaps`, `validate:syntax` widened.

## Current state / open decision points
- **Nothing is published.** theme · component · workshop · hardware · search · shell · styleguide carry `## Unreleased` changelog entries. kol-hardware must peer on the kol-component that ships the panel variants. Publish only after his yes.
- **Gates at close:** all 32 default gates clean · `validate:gaps` clean on 1,115 pages (full crawl ≈ 35 min; `node scripts/validate-gaps.mjs /a /b` re-reads named pages) · `validate:rail-pages` clean · `validate:previews` 8 pages without a preview, each with a reason (VideoSheet, FontViewerComponent, FontViewerSection, ShellLayout, TagModeGate, RowMenuButton, CropOverlay, PathNodeOverlay).
- **Consumers:** monitor · mirror · fxr lose the touch sheet on Knob/Fader at their next bump until they pass `onHold`. Not filed anywhere yet.
- **Tags** (taxonomy session, tagging from the site): still parked for their own session.
- **Not built, by his later answers:** the items above. Item 1 supersedes the "retire AudioPlayer / AudioPreview" recommendation in `backlog/2026-10-01-component-audit.md` § 5 — they fold into `MediaPlayer` instead.
- Round 7's page still states the audio question in its old two-part form; item 11 marks it answered.

## Next intended action
- Run `/ag-init`, read this file, then say in a few lines that the eleven-item list is ready and ask for go. Nothing else first.

## Working memory not yet in AGENT-CONTEXT
- **How he wants to be talked to — every one of these was said in anger tonight:**
  - Answer the question he asked BEFORE doing anything. Starting work while he waits on an answer is the breach (*"you owe me a response, why are you starting work without it?"*).
  - Short. A block of text gets *"I'm not reading this"*. When he says he doesn't understand, re-say it as five plain bullets, not another paragraph.
  - Every question carries a recommendation and reads as a question (*"how is this yes or no? … why isnt there a recommendation?"*). When he wants them all, give them all in one list; when he says one at a time, wait for "next question".
  - Use HIS words and label any other: component = **variant**; "kind" is only the codebase's word for a file's type. No new words dropped in ("preset", "example", "kind") — *"what the fuck is wrong with using established words?"*
  - Never ask him to rule on something by a name he has not been shown. Explain what the thing is and where it shows first.
  - Open questions go ON THE SITE at `/development/open-questions`, not in the phase log or a backlog file (*"where are the questions"*, asked four times).
  - READ before answering. /rosa means read the files, then answer — he caught an answer given without reading (*"why are you answering without reading the files tho I gave you rosa"*). The Icon Button merge and the MediaPlayer/HlsVideo ruling were both wrong for the same reason.
  - His standing principle for all of it: *"trying to limit redundancy"*. A second component that does the same job is a variant or a prop of the first. Propose that first, every time.
- **The break tonight:** the Button codemod rewrote `variant='primary'` inside a double-quoted `code="…"` string in a showcase preview; the whole showcase (his dev server too) served a blank page until the gap scan exposed it. A codemod over JSX must not touch tags inside string literals; `validate:syntax` now covers showcase · workbench · apps.
- **Component URLs are kebab slugs** (`/components/multi-select`), not PascalCase.
- **Probe scripts** for a browser check without a long crawl: `_tmp/2026-10-01-gap-scan/probe.mjs <paths…>` (renders, console errors; `SHOT=<dir>` for screenshots) and `shot.mjs <path> <selector|-> <out.png> [dark]`. Both start the showcase on port 5397 and kill it. Screenshots from tonight: `_tmp/2026-10-01-gap-scan/shots/`.
- **Other scratch:** `_tmp/2026-10-01-button-variant-codemod.py`, `_tmp/2026-10-01-demo-to-preview.py`, `_tmp/2026-10-01-hardware-twins-merged/` (the three original hardware sources and their previews).
- **Names that are the agent's and he accepted ("names ok"):** `MultiSelect`, `BackgroundVideo`, `BrandAvatar`, `RackCase` · `RackRow` · `RackSlot`, `variant="panel"`. The rail and result-row glyph choices (`RAIL_ICONS` in `showcase/src/lib/ShellChrome.jsx`, `KIND_ICONS` in `pages/Search.jsx`) are the agent's picks, unreviewed.
- **Shortcuts he asked about:** `C` folds / expands every rail group · `\` hides / shows both rails · `[` left · `]` right.
- **The lobby watch** expired during the session and was not re-armed (memory: never re-arm). The inbox still holds 16 tickets, untouched tonight.
