---
component: MediaPreviewNativeRatio
source: kol-component/src/organisms/MediaLibraryPages.jsx#L265-L280 (0.317.0); call sites L1889, L2105
staged: 2026-10-30
status: draft
deps: [MediaLibrary, ImageFrame, nearestRatio]
---

# MediaPreviewNativeRatio

## Purpose
MediaLibrary's preview crops images. A file should show whole, at its own shape, in the preview pane and in Quick Look. Seen in kol-website's media app (media.kolkrabbi.io): `kol-artwork/kol-print/print-library/weissensee-certificate.jpg` loses its top and bottom.

## Anatomy
- `ImageFrame({ src, vector })`, starting at `MediaLibraryPages.jsx:268`
  - a wrapper div with `style={{ aspectRatio: frame.ratio }}`, `rounded overflow-hidden flex items-center justify-center`
  - an `img` with `w-full h-full`, plus `object-cover` or `object-contain`
- On load, `frame.ratio = nearestRatio(w, h)` (the preset ladder in `utilities/ratios.js`).
- `contain` applies only to vectors or to ratios past 16:9 or 9:16. Everything else gets `object-cover` inside the snapped preset, so anything off-preset loses its edges.

## Variants
- **native** (the new default): the frame takes the file's own ratio (`aspectRatio: w / h`) and the image shows whole (`object-contain`). Nothing is cropped.
- **preset** (today's behaviour): snap to `nearestRatio` and fill, kept for anyone who wants a tidy grid of frames.

## Props
| prop | type | default | controls |
|------|------|---------|----------|
| `previewFrame` | `'native' \| 'preset'` | `'native'` | how the preview pane and Quick Look frame an image |

Set on `MediaLibrary` and passed through to every `ImageFrame`, the same way the other preview settings travel.

## Styling
- Keep the wrapper as it is: `w-full rounded overflow-hidden flex items-center justify-center`.
- native: `style={{ aspectRatio: `${w} / ${h}` }}` and `object-contain`. Before load, keep today's `1 / 1` placeholder.
- A very tall image should cap at the pane's height (a `max-height` on the frame) rather than run off the pane. The pane already scrolls (`kol-column-browser-preview … overflow-y-auto`).

## States & interactions
None new. The loading placeholder stays square until `onLoad` reports the size.

## Dependencies
`nearestRatio` stays for `preset`.

## Recreation notes
- One component, one prop. Apply it to both call sites (`:1889`, the preview pane, and `:2105`, Quick Look / column) so the views agree.
- Grid tiles (`Thumb`, `MediaTile`) are not part of this. They stay `object-cover`, since a grid wants even cells.

## Definition of done
- [ ] `weissensee-certificate.jpg` (taller than its nearest preset) shows whole in the row pane, the column preview and Quick Look
- [ ] `previewFrame="preset"` reproduces today's look exactly
- [ ] published, version named in the resolution

---

## Also in this ticket — `,` opens MediaLibrary's settings (kol-website, 2026-10-30)

MediaLibrary keeps the settings drawer's open state inside itself (`MediaLibraryPages.jsx:1144`, `useState(false)`, with nothing passed in or out), so a consumer can't put the estate's settings key on it. AppHub already binds `,` (`kol-shell AppHub.jsx:249`, `settingsKey`); the media app is not on AppHub and has no way to do the same.

**Ask:** `settingsKey` on MediaLibrary (default `','`, the same guard as AppHub's: no modifiers, no repeat, not while typing) that toggles the drawer. Also add `settingsOpen` / `onSettingsOpenChange`, so a host can drive it.

- [ ] `,` opens and closes the settings drawer in the media app; Esc closes it
- [ ] not while typing in search or rename

---

## Resolution — 2026-10-30

🟢 `closed` — shipped in `@kolkrabbi/kol-component` **0.317.3** (registry live 2026-10-30); the CHANGELOG bullet sits under that heading. Built as below.

- `packages/component/src/organisms/MediaLibraryPages.jsx`
  - `ImageFrame({ src, vector, mode })` L265–286: `mode="native"` (default) sets `aspectRatio: w / h` on load and `object-contain`, `1 / 1` placeholder before load, `max-h-full` so a very tall frame caps at the media box (the pane's flex shrinks that box to what is left under the facts — a `60vh` cap was tried first and still ran past it). `mode="preset"` is the old branch verbatim (`nearestRatio` + cover, contain past the ladder's ends).
  - `useSettingsKey(key, on, toggle)` L288–304: AppHub's guard (no ⌘/Ctrl/⌥, no repeat, not in INPUT / TEXTAREA / SELECT / contentEditable).
  - `MediaLibraryBrowse` L1154–1162 (`previewFrame = 'native'`, `settingsKey = ','`, `settingsOpen`, `onSettingsOpenChange`), L1177–1180 (controlled drawer state; the key is off when `onOpenSettings` hands the gear to a host), both `ImageFrame` call sites L1925 (preview pane) and L2141 (column / Quick Look) take `mode={previewFrame}`.
  - `MediaLibraryLibrary` L3053–3068: the same three settings props (the drawer is on both pages); its key is off with `header={false}` (stacked under a browse page, whose key owns it).
- `packages/component/CHANGELOG.md`: one bullet under `0.317.3 — (UNPUBLISHED — his review)`.
- `docs/documentation/03-components/01-inventory.md`: the `MediaLibrary` row lists no props, so nothing to add there.
- The props reach `MediaLibrary` through its `...pageProps` spread and the explorer's, so no wrapper edit.

Verified in apps/media (vite on 5299, killed after) with Playwright. No fixture image is off-preset (all 4:5), so the preview `<img>` was fed a generated 600×1800 (1:3) and a 1000×1414 (A4, nearest preset 4:5) with TOP / BOTTOM bands, which re-fires the frame's `onLoad`:
- `_tmp/2026-10-30-media-preview-native/01-columns-native.png` — columns preview, 1:3 whole, both bands visible, frame 288×360 inside the 360 box.
- `02-quicklook-native.png` — Quick Look open over it; the column frame behind it stays native.
- `03-rows-native.png` — the rows preview pane, the same.
- `04-settings-key-open.png` — `,` opened the drawer; Esc closed it; with the tag field focused `,` typed a comma and opened nothing.
- `05-rows-preset-a4.png` — `previewFrame="preset"` passed once from App.jsx (reverted): 4 / 5 frame, `object-cover`, bands cropped — today's look. `06-rows-native-a4.png` — the same image native, whole.
- Gates: `validate:syntax` clean, `validate:relative-imports` clean.
