# Plan — apps/mixer and apps/mixer-hub: kol-mirror on this repo's packages (BUILT — waits on his eye)

**Status:** built 2026-10-03 (§ D · § E), nothing published, no package changed. Scoped that morning, then cut the same day on his word. The first draft treated mirror like monitor — two apps, every route, pixel parity with the live site. He: the live site is **broken** (the viewframe only shows on a big screen), the whole site is in development, it is a completely different thing from monitor, and several of its tabs are development storage. So: **one app, the studio alone, his eye as the bar.**

**Source:** `~/dev/projects/kol-mirror/src` — read only, never edited from here.

## A. What the scope found

1. **The instrument** is a desk — channel strips, master out, routing matrix, master clock, generators — under a viewframe and a tape deck. Not a rack of modules. Route `/studio`, `pages/MirrorPlayground.jsx`.
2. **Live is not a reference.** At 1600×1000 on `mirror.kolkrabbi.io/studio` the viewframe is crushed to a stub and the tape deck is cut off (`_tmp/2026-10-03-mirror-live/studio-1600x1000.png`). It shows at about 3300×2000 (his 60% zoom).
3. **The rail is half development storage** — Expression, the Mixer sheet, Tape (ten deck designs), Fronts (twenty front ideas), Icons (the glyph sheet). None of it is the app as it ships, so there is no hub to copy.
4. **The studio reaches 99 of mirror's files**, plus 337 glyphs and 16 preset files read by glob. No file of it imports anything that is gone from today's packages. The one known break, `PageHeader` from kol-shell, is in five pages that are not copied.
5. **The jump** — theme ^0.128.0 → 0.165.0 · component ^0.163.0 → 0.239.0 · shell 0.40.0 → 0.61.0 · framework ^0.36.0 → 0.49.0 · icons 0.25.0 → 0.33.0 · media-client 0.3.2 → 0.4.0.
6. **Controls** — mirror imports neither kol-hardware nor kol-controls. Its `Button` · `Slider` · `Dropdown` · `Divider` · `ThemeToggleButton` are thin wrappers over the DS ones. Hand-built, nothing of the DS under them: `RotaryDial` · `QuantityInput` · `ColorPicker` · `ChannelMaster`.
7. **Assets** — everything in mirror's `public/` is already in the root `public/`, byte for byte, except 37 new files under `previews/` and one clash: `previews/modules/patch.png` differs from monitor's.
8. **Media** — the studio reads R2 through a same-origin `/media` proxy; this repo's `vercel.json` has no such rewrite.

## B. Decisions

| # | Point | Decision |
|---|---|---|
| B1 | scope | `apps/mixer` — the studio and what it reaches. `apps/mixer-hub` came back the same day, on his word, **on the DS's own hub** (§ E) and not as a copy of mirror's shell. No sketchbook tabs |
| B2 | the bar | his eye, at a size where the frame shows. A diff against live is a tool for spotting what the package jump changes, never a pass mark |
| B3 | the copy | mirror's files at mirror's own paths, so no import is rewritten. New here: `Standalone.jsx` (what mirror's shell gave the studio — the shortcuts sheet, Space, the frame budget, adaptive quality), `App.jsx` (a `MemoryRouter` around it), `mixer.css` |
| B4 | `patch.png` | monitor's stays; the 37 new previews are copied without overwriting. Proposed to him, not answered |
| B5 | media | the dev proxy in `vite.config.js`; no change to `vercel.json`. Proposed to him, not answered — on ui.kolkrabbi.io the media browser loads nothing |
| B6 | the viewframe break | mirror's own. The copy carries it as it is; not fixed here without his word |

## C. Build order

1. Move the invented `apps/mixer/src` to `_tmp/2026-10-03-mixer-testbed-invented/`.
2. Copy the studio's files; write the three new ones; dependencies; the `/media` proxy.
3. The 37 new previews into the root `public/previews/`.
4. Run it. Console clean on load; look at it beside live at the big size.
5. Register what changed: the showcase's Mixer set mounts `Standalone.jsx`, the app's row in `docs/operations/07-apps-tier/INDEX.md`, its line in `showcase/src/pages/Apps.jsx`.
6. Gates. Then his eye.

## D. Built — 2026-10-03

- **`apps/mixer`** — 451 of mirror's files at mirror's own paths (99 source files, 337 glyphs, 16 presets). New: `Standalone.jsx`, `App.jsx`, `mixer.css`, `index.css` in the workspace form. `pnpm mixer` (5195). The invented test bed is in `_tmp/2026-10-03-mixer-testbed-invented/`.
- **Against live** (`_tmp/2026-10-03-mixer-testbed/compare.mjs`, dark, live's 48px rail cut off): 3333×2025 differs 0.07% — the generator's noise and the frame counter; 2000×1215 and 1600×1000 differ 0.00%. So the package jump changes nothing visible in the studio, and the copy carries mirror's frame break exactly as live has it.
- **Console** clean on load and on H · S · F · E · P.
- **Edited in the copy** — four `Button variant="grey" | "primary"` → `tone=` (`PatchTableOverlay` ×2 · `MirrorSidebar` · `MobileStudio`): the deprecated alias, warned in the console and failed `validate:variants`. Before and after are pixel-identical. Mirror needs the same four when it bumps.
- **Registered** — the showcase's Mixer set mounts `Standalone.jsx`; `composition.json` regenerated; the app's row in the apps-tier index and its line on the Apps page.
- **Gates** — `validate:render mixer` clean; the app builds. Of the 32 default gates two fail:
  - `icon-ink`, 18 — icons in mirror's code inked on `fg`. **Waits on him:** for the rack he had them moved to `oq`; not done here without his word (a port is carried as it is).
  - `retirements`, 2 — `AppShell` and `BrandHero` in kol-framework turned 30 days old today. Not this work; the drop is the iMac's.
- **Not looked at** — the phone studio beyond the render gate's load at 390, recording and export, the media browser against R2, the shortcuts sheet's two rail rows (there is no rail here).

## E. mixer-hub — built 2026-10-03, on his word

He: *"what about mixer-hub?"* · *"expression is also in the generator right? same math?"* · *"did you use search tool and catalog tools?"* · *"check the codebase!"*. I had proposed copying mirror's hand-wired shell, its Expression page and its own module search without reading what ships. What ships:

| mirror hand-built | the DS has | used |
|---|---|---|
| `App.jsx` — AppShell, the rail order, S, the option-digit keys | kol-shell `AppStudio` (reference: `apps/studio`) | yes |
| Home and Library on `CatalogPage`, a grid drawn by hand | `HubHome` · `CatalogPage` slots, `toCard` | mirror's items and `toCard`; the cards are the DS's |
| Settings on `SettingsScaffold` | `HubSettings` — `content`, `tabs` (written for mirror's Performance) | yes |
| the Expression page, on its own copy of the compiler | kol-hardware `EnvelopeGenerator` on `./signal` — the one compiler written to replace four copies, mirror's among them | yes |
| ⌘K search drawn in `ModulePalette` | kol-component `ShellSearchOverlay` (the rack's wiring) | yes, in `apps/mixer` — the tool is one tool |

- **`apps/mixer-hub`** (`pnpm mixer-hub`, 5197): one new file, `App.jsx`, and twenty of mirror's. Home · Library · Create · Studio · Expression · Mixer · Tape · Fronts · Icons · Settings; the phone bar is the Hub's.
- **The three sketchbook tabs came back the same evening** (he: *"missing tabs tho in the hub?"*). Nothing ships for them — no icon sheet, no tape deck — so Tape, Fronts and Icons are mirror's pages as they are, mounted as the Studio's opt-in pages; Fronts and Icons wide-only, as in mirror. Each mirror page that handed its chrome to the Hub says so at its top.
- **In `apps/mixer`:** `StudioKeys` split out of `Standalone.jsx` so the Hub owns S; ⌘K is `ShellSearchOverlay`.
- **Checked:** every route at 1600×1000 and at 390 touch, console clean; ⌘K adds a module; one sheet on S; a Library expression card opens the generator on its expression; `validate:render` clean for both apps; both build. `apps/mixer` is still identical to live after the change.
- **Differs from mirror, by the Hub's rules:** the rail order (Library · Create · Studio · Expression · Mixer); RECENT · SAVED in caps; the studio on bare primary, without mirror's 2% wash; the list view one row per line.
- **Still mirror's own copy:** the desk's dials compile with `hooks/useExpressionValue.js`, not `./signal`. One seam (`compile`); mirror's helpers start at 0 where the engine's span min to max — the same when min is 0.
- **`icon-ink`** is at 26 with the hub's files. Same question, still his.

## F. For the bug round — a fresh session, on his word

He, 2026-10-03: *"you built it as is, but you didnt fix any of the bugs? should we add the missing tabs, then close this round and open a fresh for bug fixes?"* Both apps carry mirror as it is. Nothing below is fixed. What was seen while building, his to add to and order:

1. **The viewframe** is crushed to a stub and the tape deck is cut off below about 3300 wide (`/studio`). Mirror's own layout; live has it too.
2. **Icon ink** — 26 icons in mirror's code inked on `fg`; the gate wants `oq`. Waits on his word (the rack's were moved on his word).
3. **The desk's dials** compile with mirror's `hooks/useExpressionValue.js`, not kol-hardware `./signal`. One seam.
4. **The four hand-built controls** — `RotaryDial` · `QuantityInput` · `ColorPicker` · `ChannelMaster` — against `Knob variant="panel"`, kol-component's `QuantityInput`, `ChannelStrip`.
5. **The Mixer sheet's masthead says "Library"** — one header for both pages, mirror's.
6. **Create › Modules, list view:** the first row's title wraps to three lines ("Slit-Scan Camera").
7. **The Patch card** on the Mixer sheet shows monitor's `previews/modules/patch.png` (B4).
8. **Media** — no `/media` rewrite on the built copy, so its media browser loads nothing there (B5).
9. **The shortcuts sheet in `apps/mixer` alone** lists the two rail keys; there is no rail.
10. **The sketchbook tabs draw their own chrome** — Icons its search field and chips where `ContentFilters` ships, Tape its Run chip.
11. **`ModulePalette`'s search chrome** is no longer reached (⌘K is the search modal); the E shelf still is.
12. **Not checked:** a filter chip carried from one Library view into the next (the Library slot has no `key` reset; the Mixer sheet does), recording and export, the media browser against R2, real iOS Safari.

Then, his order of 2026-10-02: fxr labs, then the generator.
