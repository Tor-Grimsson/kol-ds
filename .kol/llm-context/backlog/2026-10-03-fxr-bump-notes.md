# kol-fxr's bump — what the rehearsal found

**From:** `apps/editor-hub` (2026-10-03): kol-fxr's `src/` — `App` · `AppLayout` · `HomePage` · `LibraryPage` · `SettingsPage`, nine files, copied from the reference clone — on this repo's packages, with every chrome read from design-editor's source. fxr is on design-editor 0.10.0 · kol-component 0.212.0 · kol-theme 0.145.0 · kol-shell 0.56.0 · kol-framework 0.44.0 · kol-icons 0.27.0; here it runs design-editor 0.19.0 · component 0.239.0 · theme 0.165.0 · shell 0.61.0 · framework 0.49.0 · icons 0.33.0, plus what is unreleased.

**How it was checked:** every route and 25 states screenshotted here and on `fxr.kolkrabbi.io` at the same viewport and diffed pixel by pixel (threshold 12/255), at 1600×1000 and at 390×844 on a touch device. Scripts and screenshots: `_tmp/2026-10-03-fxr-labs-testbed/` (`hub-compare.mjs` · `touch-probe.mjs` · `rail-probe2.mjs` · `console.mjs`, output in `cmp/` and `cmp-phone/`). They expect editor-hub on 5398: `pnpm --filter editor-hub exec vite --port 5398 --strictPort --host 127.0.0.1`.

`apps/editor-hub` builds, and the built app was opened under its `/apps/editor-hub/` base with a clean console. Nothing was sent to kol-fxr. No ticket filed, the clone not edited.

## 1. Edits fxr needs

| Where | Edit | Why |
|---|---|---|
| `package.json` | design-editor 0.19.0 needs kol-component ≥0.227.0 · kol-theme ≥0.154.0 · kol-icons ≥0.29.0 · kol-shell ≥0.51.0 | its peer ranges — everything bumps together |
| `HomePage.jsx` (×3) · `LibraryPage.jsx` (×2) | `<Button variant="grey">` → `tone="grey"`; Library's Delete, `variant="outline"` → `tone="outline"` | deprecated aliases — they work, and warn in the console |
| `SettingsPage.jsx` — the picker `className="w-40"` | widen it (`w-48`) on a phone | the touch rung types it at 16px: "Open a chro…" |

No hard break. Every route loads with a clean console on the new packages; nothing fxr imports has moved.

## 2. Fixed in the design system for this bump (unreleased)

- **Rail icons blank on `/editor` and `/randomiser`** (kol-icons). An `<Icon>` that rendered before the icon chunk landed could stay blank for good; under fxr's Suspense boundary the lazy chrome held the gap open, so the whole rail lost its icons on those two routes. Live fxr does not show it — it would have arrived with the bump.
- **Labs' and the randomiser's segmented strips read as bare text** (design-editor). The sync of 2026-09-27 set every `SegmentedToggle` in the editor to `filled` — in the labs skin that removed the group shell and dividers the user ruled on 2026-09-01, and it left the randomiser's roll-scope strip (Geometry · Spacing · Field · Mark …) with no button shape at all. Fourteen strips in `labs/` · `mobile/` · the labs-skin branches of `AutoControls` and `LoopFields` are the default look again, as fxr draws them. The editor's own inspector is untouched.
- **Labs' phone drawer outgrew itself** (design-editor, `kol-labs.css`). The touch rung (kol-theme 0.158.0) lifted every control in the drawer to 16px type in a 36px box; the drawer was ruled the `md` rung on 2026-09-01 (14 / 18 in 32). "Scanline" truncated and a row fell off the fold. The drawer opts out, the same way the rack's hardware panels do. After it: every control in the drawer measures what live measures.
- **Labs' Loops row did nothing** (design-editor). Its first page is a nested group with no pick of its own, so the rail row had nothing to run. Live fxr has the dead row today; it opens Loops here.

## 3. Result on the new packages

| Route | 1600×1000 | 390×844 touch |
|---|---|---|
| `/` Home (grid, Saved) | 0.000% | lands on the randomiser, as live |
| `/library` | 0.000% | the touch rung (§ 4.5) |
| `/settings` (options, shortcuts, about) | 0.07% — § 4.3 | the touch rung, and the picker (§ 1) |
| `/labs` — empty, a generator, Style, Animation, an effect page, both rails open | 0.17–0.22% — all of it the transport footer (§ 4.1) | drawer 0.7%; the stage plays, so its frames differ |
| `/randomiser` | § 4.2 | the generator sheet 1.0% |
| `/editor` | 0.6% — the editor review's own changes (§ 4.4) | no phone layout, parked |

## 4. What the bump visibly changes (the user's eye)

1. **Labs' transport footer.** Transport · Output · File runs the full width in three equal cells (it hugged its labels); play | pause is a wider strip with the active one filled white. Both from the user's editor review of 2026-09-27 (design-editor 0.16.0). `cmp/crop-labs-scanline-1280-880.png`.
2. **The randomiser opens on Generate · Effects**, not on the generator list, and the list has a Back. The user's ruling of 2026-09-29 (design-editor 0.17.0). `cmp/pair-randomiser.png`.
3. **Settings — the masthead cluster** (chrome picker · theme · gear) sits at the right edge. On live it sits against the subtitle. `cmp/stack-settings.png`.
4. **The editor** — the inspector as panes, the menu-bar frame name at `md`, redrawn tool glyphs: the editor review, 0.13.0–0.19.0.
5. **Phones — every app-chrome control is bigger** (the touch rung): the rail's rows, the Catalog's filter row, Settings' dropdowns. Labs' drawer and the randomiser sheet keep their own sizes.
6. **Home's LIST view** — a row is one line, title then a truncated detail. On live the detail runs over the title. `cmp/stack-home-list.png`.
7. **The upload glyph** is the redrawn one (arrow into a bar).

8. **Added 2026-10-05 — labs on a phone is a bottom sheet.** No top bar, no right drawer: the params sit along the bottom, half the display at most, with the stage whole above; the title collapses them to a pill. `_tmp/2026-10-03-fxr-labs-testbed/frame/sheet-phone-1.png`.
9. **Added 2026-10-05 — the randomiser at a desk is a right rail**, labs' own width and insets, with `sm` controls. It was the phone sheet across the window. `frame2/sheet-desk-a.png`.
10. **Added 2026-10-05 — the transport's play | pause and stop | rewind cells are squares again**, so the loop field is wider. On labs' phone footer, Output and File are closed until tapped.

## 5. fxr's own, not the bump's

- **The randomiser's media picker** (From library · Upload · Camera) is a scrim over the whole view: on a light theme its labels are near-invisible over the grey stage, and the hovered pane covers the sheet. Identical on live. `shots/insert-sheet.png`.
- **The lazy chromes do not split.** `App` wraps each chrome in `lazy()` so the shell tier stays light, but `App`, `AppLayout` and all three pages also import helpers from the same `@kolkrabbi/design-editor` entry statically — the bundler says so on every build, and the whole editor rides the first load. A light entry for the helpers (mode table, library store, settings sections) would fix it; that is a package change, not done here.
- ~~The generator's collapsed row runs off a 390 screen~~ — live has it; fixed here 2026-10-05, arrives with the bump.
- **Home's New File** does nothing, and the walkthrough is one placeholder step — fxr's own notes say so.

## 6. Leads, not acted on

- ~~fxr's Home · Library · Settings are the slots `AppStudio` ships (kol-shell).~~ **Ruled 2026-10-07: fxr is on `AppHub`, not `AppStudio`** — `AppHub` passes `items` straight through, so labs' rows inserted under Labs ride as they do today; `AppStudio` builds the rail from its slots and has no seam for them, and its Library · Create · Use shape is monitor's, not fxr's. Home's SAVED set reads `loadLibrary()` (design-editor 0.22.0, `library-reader-for-a-hub-home`); `apps/editor-hub` is on it the same way. Keep the local ⌥-digit handler — `navKeys` numbers the rows as given, and labs' inserted rows would shift ⌥5–9 on that route.
- `apps/controls` — all three of its pages now have a live app: the parametric set in `apps/rack`, the compositions in `apps/rack` and `apps/mixer`, the app controls and panel formats in `apps/editor-hub` and `apps/panels`.

## 7. Not rehearsed

- Export, record and batch export; the output window beside a live editor; MIDI, gamepad and audio input.
- Real iOS Safari: the touch runs were Chromium with a touch pointer.
