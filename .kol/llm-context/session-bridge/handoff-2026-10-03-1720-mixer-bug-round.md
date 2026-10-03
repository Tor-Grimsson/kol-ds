# Handoff — 2026-10-03 17:20

## Goal of the current arc
kol-mirror rehearsed on this repo's packages, as two apps: `apps/mixer` (its studio alone) and `apps/mixer-hub` (kol-shell's `AppStudio` with mirror in its slots). Both are **built as they are — mirror's bugs carried, none fixed**. The next session is the **bug round**. His words: *"you built it as is, but you didnt fix any of the bugs? should we add the missing tabs, then close this round and open a fresh for bug fixes?"* then *"should we wait on publish and push and dive into the bug fixes? do a log work handoff?"*

The plan file is the full record: `.kol/llm-context/plan-2026-10-03-mixer-and-mixer-hub.md` — § D what `apps/mixer` is, § E what `apps/mixer-hub` is and what it reuses, **§ F the bug list**.

## Last actions taken (causal trail, newest first)
- Added mirror's three sketchbook tabs to the hub (Tape · Fronts · Icons) as `AppStudio` opt-in pages — mirror's pages as they are, because nothing ships for them (no icon sheet, no tape deck in the DS).
- Built `apps/mixer-hub` (`pnpm mixer-hub`, 5197) on `AppStudio`: Home and Library are the Hub's Catalogs fed mirror's items and `toCard`; Create is mirror's desk builder in the Create slot; Studio is imported from `apps/mixer/src`; Expression is kol-hardware's `EnvelopeGenerator` (not a copy of mirror's page); the Mixer sheet is a `CatalogPage`; Settings is `HubSettings` with mirror's Memory, Performance tab, About and links.
- In `apps/mixer`: ⌘K is kol-component's `ShellSearchOverlay` (the rack's wiring); `StudioKeys` split out of `Standalone.jsx` so the Hub owns S.
- Built `apps/mixer` (`pnpm mixer`, 5195): mirror's studio, 451 files copied at mirror's own paths. Pixel-identical to `mirror.kolkrabbi.io/studio` at three sizes — which means the package jump changes nothing visible, and that the copy carries mirror's broken viewframe exactly.
- Rewrote the plan twice on his corrections (see Working memory): first cut `mixer-hub`, then brought it back on the DS's own hub.
- The invented mixer test bed went to `_tmp/2026-10-03-mixer-testbed-invented/`. 37 preview images were added to the root `public/previews/` without overwriting.

## Current state / open decision points
- **Nothing published, no package changed.** Everything is in `apps/`, `showcase/` (the Mixer set mounts `apps/mixer/src/Standalone.jsx`; `Apps.jsx`; `composition.json` regenerated), `scripts/validate-render.mjs`, `docs/operations/07-apps-tier/INDEX.md`, root `package.json` and the lockfile. Publish waits for the bug round, where packages will move. Push is his.
- **Gates:** `validate:render` clean for both apps; both build. `pnpm validate` is 2 of 32 failing: `icon-ink` 26 (all in mirror's copied code) and `retirements` 2 (`AppShell` and `BrandHero` in kol-framework turned 30 days old on 2026-10-03 — not this work; the drop is the iMac's).
- **Unanswered, all his:**
  1. Icon ink — move mirror's 26 icons from `fg` to `oq` in the copy, as he ruled for the rack? Asked twice, not answered. Do not do it without his word.
  2. `previews/modules/patch.png` — monitor's and mirror's differ at one path; monitor's was kept (plan B4), so the Mixer sheet's Patch card shows monitor's image.
  3. `/media` — dev proxy only; no rewrite in this repo's `vercel.json`, so the built copy's media browser loads nothing (plan B5).
  4. **Where a fix to mirror's own code lives** — not asked yet. kol-mirror is a clone and is never edited from here. A fix can only land in the copy (`apps/mixer`, `apps/mixer-hub`) or in a package; getting it to mirror is a note or a lobby ticket. Ask before the first fix.
- **Not written:** notes for mirror's own bump (the `PageHeader` import, the `variant` → `tone` renames, what the Hub replaces). Only on his word.
- **This session has no session log and AGENT-CONTEXT was not touched** — this handoff and the plan file are the record.

## Next intended action
- Read plan § F (twelve items). **Ask him which bug first and where the fix lives; do not start on a guess.** He named one himself: the viewframe on `/studio` is crushed to a stub and the tape deck cut off below about 3300 wide — *"its actually currently broken. the viewframe doesnt show unless at big screens"*.
- Before proposing any fix, open the page and read the code it touches, and check what ships (see Working memory).

## Working memory not yet in AGENT-CONTEXT
- **I proposed without looking three times this session and he had to stop me each time.** Planned a pixel comparison against a live site I had not opened (it was broken). Proposed copying mirror's hand-wired shell, its Expression page and its own search when `AppStudio`, `EnvelopeGenerator` and `ShellSearchOverlay` ship. His words: *"really, did you look at mirror.kolkrabbi.io?"* · *"its complelety different then monitor, you get this right?"* · *"did you use search tool and catalog tools?"* · *"dude, check the codebase! … you also are supposed to follow yagni protocol! why am I telling you this?? dont you check?!"* Memory `find-the-shipped-component-first` now covers proposals and ports.
- **Mirror is not monitor.** Monitor was finished, so "match live" was a bar. Mirror is in development and broken; his eye is the bar, and a diff against live only shows what a change moves.
- **Same math, two copies.** The desk's dials still compile with mirror's `hooks/useExpressionValue.js`; the Expression page runs kol-hardware `./signal`. Mirror's helpers start at 0, the engine's span min to max — identical when min is 0. One seam (`compile`).
- **Mirror's `Button` · `Slider` · `Dropdown` · `Divider` are thin wrappers over the DS ones.** Hand-built with nothing of the DS under them: `RotaryDial` · `QuantityInput` · `ColorPicker` · `ChannelMaster`.
- **The Hub's rules win over mirror's where they differ:** rail order (Library · Create · Studio · then the pages), RECENT · SAVED in caps, the studio on bare primary without mirror's 2% wash, the list view one row per line.
- **Test kit:** `_tmp/2026-10-03-mixer-testbed/` — `compare.mjs` (mixer vs live, three sizes, the studio's keys), `hub.mjs` (every hub route, `TOUCH=1 W=390 H=844` for a phone), `hub-states.mjs` (⌘K, S, a Library card into the generator), `set.mjs` (the showcase's Mixer set, read off a showcase that is already running). They expect the app on 5295 (mixer) or 5297 (hub); start it, note the PID, kill only that PID. His own servers were up all session (showcase on 5394) and were never touched.
- The lobby watch was armed once at init, expired, and was not re-armed. The 17 inbox tickets were not touched this session.
