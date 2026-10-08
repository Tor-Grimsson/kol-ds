# library-reader-for-a-hub-home — export the saved-library reader so a Hub Home can list presets

**Filed:** 2026-10-07 ← **kol-fxr**
**Package:** `@kolkrabbi/design-editor` (`core` entry)
**Origin:** kol-fxr moving onto `AppHub` (user ruling 2026-10-07), the bump to design-editor 0.21.0 · kol-shell 0.62.0 — your `2026-10-03-fxr-bump-notes.md` rehearsal, taken.

---

## The problem, in one case

`HubHome` takes `items` as data or `(view) => items`, evaluated in its own render. fxr's Home
shows two sets: RECENT = the three chromes (static) and SAVED = the presets in the editor's
library. Today `HomePage.jsx` reads them with `useGeneratorLibrary()` under its own
`GeneratorLibraryProvider`, mounted per visit, so it is always fresh.

On the Hub there is nowhere to put that provider:

- **Above `AppHub`** — it goes stale in the same tab. `Editor.jsx:80` mounts its own
  `GeneratorLibraryProvider` inside `EditorProviders`; a save there writes localStorage and the
  outer provider never hears of it (`LibraryProvider.jsx:290-296` listens to `storage`, which
  fires cross-tab only). Save a preset, go Home, SAVED shows the old list.
- **Keyed to remount on `/`** — remounts `AppShell` with it: rail state gone every time you go Home.
- **Inside `HubHome`** — a Hub page cannot know the editor's store; that is the wrong layer.

So fxr ships `AppHub` with Settings, the sheet and the rail from the Hub, and Home still on its
own `CatalogPage` — until the SAVED set can be read without a provider.

## The ask

Export the sanitised reader — `loadFromStorage` at `editor/library/LibraryProvider.jsx:222`, the
same function the provider seeds its state from, validators and migrations included — from the
`core` entry, as `loadLibrary()` or whatever name fits your vocabulary. Then:

```js
home={{ items: (view) => (view === 'recent' ? CHROMES : toCards(loadLibrary().preset)) }}
```

reads fresh on every `HubHome` render, and the shell tier mounts no library provider at all.
The shape of the ask is yours — a reader is the smallest thing that works; if the Hub should
instead take Home's items another way, say so and fxr follows.

## Rejected here

- **Reading `kol.editor.library.v3` in the host.** A copy of the storage key and none of the
  validators — the shim the 2026-08-09 ruling forbids (shipped components are the truth).
- **A provider-aware `HubHome`.** See above.

## Definition of done

- [ ] a reader exported from `@kolkrabbi/design-editor` (root and `core`) that returns the
      sanitised library — the `preset` slot's `{ id, name, layers, aspect, savedAt }` reachable
- [ ] published; fxr bumps, passes `home` to `AppHub`, retires `HomePage.jsx` to `_tmp/`
- [ ] verified in a browser: a preset saved in `/editor` appears on Home's SAVED in the same tab
      without a reload; `/` renders RECENT and SAVED with 0 console errors

## Addressed — 2026-10-07

`loadLibrary()` is exported from `@kolkrabbi/design-editor` (root and `core`) — the provider's
own `loadFromStorage`, under that name, validators and migrations included; `preset` carries
`{ id, name, layers, aspect, savedAt }` as stored.

`apps/editor-hub` (this repo's rehearsal of fxr) is on `AppHub` with it:
`home={{ items: (view) => (view === 'recent' ? CHROMES : savedCards()) }}` over `loadLibrary().preset`,
and no library provider at the shell tier. Checked in a browser
(`_tmp/2026-10-07-hub-home-check/check.mjs`, 1440×900): File → Save… in `/editor`, ⌥1 to Home in
the same tab (no reload), SAVED lists the preset; Settings and the S sheet are the Hub's; 0 console
errors.

Two things seen on the way — fxr's call:

- The Hub's `shortcutsKey` is off on the chrome routes in editor-hub (`shortcutsKey={inChrome ? null : 's'}`):
  the chromes bind S themselves (`kol:show-shortcuts`), and two window listeners on one key open two
  sheets. Same for `,` — AppShell's `settingsKey` off, the local `kol:open-settings` gesture kept so a
  chrome's drawer answers first.
- A saved preset's card draws the dashed MISSING plate, as the old `HomePage` did. `media: false` in
  `toCard` is "no cover" (kol-component 0.210.0, `content-card-needs-no-cover`).

**Shipped 2026-10-07 in design-editor 0.22.0.** Remainder for kol-fxr: bump, pass `home` to `AppHub`,
retire `HomePage.jsx`.

## Adopted — 2026-10-07 (kol-fxr)

design-editor 0.22.0 pinned; `home={{ items: (view) => view === 'recent' ? CHROMES : savedCards() }}`
over `loadLibrary().preset`, `HomePage.jsx` retired to `_tmp/`, saved cards `media: false`. Verified in a
browser on fxr: File → Save… in `/editor`, ⌥1 to Home in the same tab, SAVED lists the preset, no MISSING
plate, 0 console errors; every route re-walked at 1600×1000 and 390×844 touch.

- [x] reader exported — 0.22.0
- [x] fxr bumped, `home` on `AppHub`, `HomePage.jsx` retired
- [x] verified in a browser, same tab, 0 console errors

**One thing for your consumer notes, found on the way:** a host that lazy-loads
`@kolkrabbi/design-editor/style.css` beside its own Tailwind build gets two `@layer utilities` blocks, and
the lazily appended one is later in source — its `.hidden` beat fxr's `md:flex`, so kol-shell's
`CatalogPage` view strip went `display: none` on Home after one visit to `/editor`. fxr imports the
editor's stylesheet first in `index.css` now (before `tailwindcss`); the editor's bundle uses no
responsive variant, so nothing flips the other way. Your rehearsal could not see it: workspace source,
one Tailwind pass.
