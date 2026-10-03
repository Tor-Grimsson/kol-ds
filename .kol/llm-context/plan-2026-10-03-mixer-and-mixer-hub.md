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

1. **The viewframe** is crushed to a stub and the tape deck is cut off below about 3300 wide (`/studio`). Mirror's own layout; live has it too. **Fixed in the copy 2026-10-03, waits on his eye:** the desk was a fixed 669px at every window size; its box is now capped by default at half the window less its chrome (`SymphonyMixer.jsx` — a dragged rule still wins, double-click returns to the cap), and the monitor slides left by the overlap to clear the deck (`SymphonyViewport.jsx`). 1600×1000: frame 509×380, was 152×179. Unchanged from about 1350 tall and 1900 wide; still cramped under about 800 tall. Mirror has not been told. His next idea, for the logic pass: the mixer takes the whole view, the frame floats over it (draggable, resizable, hideable) and the deck becomes a module — as a second tab, to A/B against this.
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

## G. The bug round and Studio B — built 2026-10-03, waits on his eye

His rulings on § F, the same day: 1 yes · 2 "what does monitor do? follow that" · 3 yes · 4 yes · 5 yes · 6 yes · 7 yes · 8 ok · 9 "dont tell mirror anything yet". Then *"do everything in one go"*. Journal: `playbook/2026-10-03-mixer-bug-round-and-studio-b.md`. Nothing published; kol-mirror neither edited nor told.

| § F | Outcome |
|---|---|
| 1 viewframe | fixed (above) — this is Studio **A** |
| 2 icon ink | 26 sites on `oq`, same stop. Found on the way: kol-theme had no `hover:text-oq-*` — added (theme, Unreleased) |
| 3 dials on `./signal` | `useExpressionValue.compile` is the engine's. 42 of 42 comparable expressions identical at min 0 (`_tmp/2026-10-03-mixer-testbed/compile-parity.mjs`). Differs by design where a dial's min is not 0: TEMPO (10–400) and generator controls that start above zero |
| 4 hand-built controls | **Two of the pairings in § F were name matches, not twins.** `RotaryDial` → an adapter over `Knob variant="panel"`; it keeps the expression box and the modulation menu, which the DS knob does not have. `QuantityInput` → the DS **`Stepper`** (the DS `QuantityInput` is a display-only quantity picker), with the draft held in the adapter because `Stepper` rejects a typed digit below `min`. `ColorPicker` → its chip is the DS `ColorSwatch`; the RGBA popover stays, nothing ships for it. **`ChannelMaster` not swapped:** `ChannelStrip` is the channel CARD's frame, not this column's, and the DS vertical panel slider is a 60px rack fader with no scale — its two knobs came across with `RotaryDial`. Originals: `_tmp/2026-10-03-mixer-own-controls/` |
| 5 masthead | monitor has no separate module sheet (Modules · Patches are views of its Library, "Library / Modules and patches"). His 2026-09-02 split stands; the Mixer page now reads monitor's line |
| 6 three-line title | fixed in kol-component: a catalog row is one line, the detail gives way (`ContentText` `lead`) |
| 7 patch card | mirror's image is `mixer-patch.png` here |
| 8 media | mirror's own `/media/(.*)` rewrite in `vercel.json`; proven in dev (listing, proxy, canvas read-back), the rewrite itself needs a deploy |
| 9 rail keys | the standalone sheet drops them |
| 10 sketchbook chrome | Icons on `ContentFilters`. Tape left: its Run chip is text and it draws no icon |
| 11 dead search chrome | cut; original in `_tmp/2026-10-03-module-palette-search/` |
| 12 not checked | chip carry-over was real — fixed in `ContentFilters` (a chip the current groups do not offer does not filter). Media against R2 ✓ in dev. **Still not checked:** recording and export (scripted twice, never reached a take), real iOS Safari |

**Found while checking, fixed:** picking an FX unit or a one-per-desk module from ⌘K or the shelf threw `api.placeUnit is not a function` — the studio's palette api never had Create's verb. **Ruled the same day, in three steps** — *"picking an fx should load in the effects from the effects page"*, then *"it should go into a independednt fx module with inputs and outputs"*, then *"no preconfigured paths ever. just load the fx. the whole point is to patch yourself … think about a physical mixer, does it ever do anything on auto"*. Built: an FX pick puts ONE module on the desk (`FxModule`, moved from the hub into `apps/mixer`) with a real IN and a real OUT, both empty — no channel, bus or master slot is touched. The IN takes any OUT (a channel, a bus return, another module, itself — a one-frame loop); the OUT goes into a channel IN, another module's IN or a master slot. State `symphonyFxModules`, rules + check in `hooks/patchGraph.js` / `patchGraph.test.mjs`, engine `useFrameBuffer.processFxModules`. Two auto-routings I built or proposed on the way (append to a channel's chain; park on a preset FX bus) are gone. Ceilings: modules are not in undo or in a saved patch file; a module in a master slot draws at full level (the strip has no fader for it); Screen 2 and the patch table (P) do not list module cables. A one-per-desk module is already on the studio's desk, so its pick does nothing.

**Studio B** (`#/studio-b`, second rail tab): `arrangement="float"` — the desk fills the view, the monitor is a window (`FloatingFrame` on monitor's `useFloating`, copied; drag by the body, corner grip, V or `[Frame]` hides), the deck is a "Tape" module on the desk. Studio A renders as before. Not in B: Screen 2, a remembered window position. If B is kept: lift `useFloating` to a package.

**DS leads, not acted on:** `Stepper` cannot be typed into when `min` > 9 (it checks bounds per keystroke); kol-hardware's `ChannelStrip` is the twin of mirror's channel card (`Channel` in `SymphonyMixer.jsx`), which still draws its own.

**Gates:** 31 of 32 (`retirements` 2 — `AppShell` and `BrandHero`, the iMac's drop); `validate:render` clean for both apps, Studio B in its routes; both build; the showcase's Mixer set renders clean.
