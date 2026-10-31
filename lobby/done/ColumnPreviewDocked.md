---
component: ColumnPreviewDocked
source: kol-component/src/organisms/ColumnBrowser.jsx (0.317.4) — Preview L389–440, the preview column ~L1100–1110; MediaLibraryPages.jsx rows/grid pane ~L1915–1951, L2214
staged: 2026-10-30
status: draft
deps: [ColumnBrowser, MediaLibrary]
---

# ColumnPreviewDocked

## Purpose
In MediaLibrary, Rows and Grid dock the preview pane at the right edge of the frame, at a fixed width. Columns places it inline, straight after the last open column, so it moves left and right as folders open and close. Seen in kol-website's media app (media.kolkrabbi.io/#kol-video/), across the three views. The user wants Columns to match Rows and Grid, and both behaviours kept as a prop.

## Anatomy
- Rows / Grid: list or wall `flex-1`, then `.kol-column-browser-preview` (fixed `previewWidth`) pinned right, with a divider.
- Columns: the columns scroll horizontally, and `Preview` renders as the next flex child (`width={widthOf('preview')}`). With few columns open, it sits mid-frame and leaves empty space to its right.

## Variants
- **dock** (the new default for MediaLibrary): the column strip is `flex-1 min-w-0` and scrolls inside itself. The preview pane sits outside the strip, pinned right at the same width and divider as Rows and Grid. Its resize handle still works.
- **inline** (today's behaviour): the preview is the column after the last one.

## Props
| prop | type | default | controls |
|------|------|---------|----------|
| `previewPlacement` | `'dock' \| 'inline'` | `'inline'` on ColumnBrowser (unchanged for other consumers); MediaLibrary passes `'dock'` by default | where the Columns preview sits |

MediaLibrary forwards the prop as `previewPlacement`, so a host can choose either.

## Styling
Reuse the Rows/Grid pane exactly: the same `.kol-column-browser-preview` width source (`previewWidth` / `columnWidths.preview`), the same divider and padding. No new tokens.

## States & interactions
- Nothing picked: the docked pane is empty, the same as Rows and Grid today.
- A picked folder shows its facts (`columnFolderInfo`); a picked file shows its preview.
- Resizing the pane writes `columnWidths.preview`, as now.

## Dependencies
ColumnBrowser only; MediaLibrary passes the prop through.

## Recreation notes
One prop on ColumnBrowser and its passthrough on MediaLibrary. With `previewPlacement="inline"` the render stays byte-identical to 0.317.4.

## Definition of done
- [ ] media's Columns view: the preview pane is pinned right at the Rows/Grid width, with the columns scrolling to its left
- [ ] `previewPlacement="inline"` reproduces today's look exactly
- [ ] other ColumnBrowser consumers are unchanged unless they pass the prop
- [ ] published, version named in the resolution

## Resolution — 2026-10-30

🟢 `closed` — shipped in `@kolkrabbi/kol-component` **0.317.5** with `@kolkrabbi/kol-theme` **0.200.5** (registry live 2026-10-30). Built as below.

## Built — 2026-10-30

- `packages/component/src/organisms/ColumnBrowser.jsx`
  - L529–532 — `previewPlacement = 'inline'` (JSDoc L81).
  - L997–1012 — the pane (`SelectionPreview` · `Preview` · the folder pane) and the column strip as one `strip(cls, after)`; inline renders exactly the 0.317.4 tree (same classes, no new attributes; outerHTML length identical in the showcase before and after a dock round-trip).
  - L1115–1131 — `dock`: the strip `flex-1 min-w-0` scrolls on its own; the pane sits in a `border-l` box pinned right at `widthOf('preview')`, empty (the Rows/Grid reserved div) until something is shown; its resize handle sits on the pane's left edge (drag left widens) and writes `columnWidths.preview`.
  - L852 — the scroll-to-end effect also runs on a placement change.
- `packages/component/src/organisms/MediaLibraryPages.jsx` L1274–1277, L2232 — `MediaLibraryBrowse previewPlacement = 'dock'`, forwarded to ColumnBrowser (MediaLibrary passes it through `pageProps`).
- `packages/theme/kol-components-molecules.css` L1861–1865 — `.kol-column-browser-strip--dock`: the last grab pill stays inside its line, so the strip does not scroll 2px past the last column and that column's edge and the divider are one line.
- `showcase/src/previews/ColumnBrowser.jsx` — an Inline · Dock toggle.

Verified on apps/media at :5299 (Playwright, 1440×900), screenshots in `_tmp/2026-10-30-get-info-docked/`:
- `01-columns-docked-empty.png` — nothing picked: the docked pane empty at the right edge, divider in place.
- `03-columns-file-docked.png` — `img/02-products/tt-07.jpg`: pane pinned right (pane right 1391 = frame right), columns scrolled to its left, one divider line.
- `03b-columns-pane-resized.png` — the pane's handle dragged 100px left: 320 → 420, stored as `columnWidths.preview: 420`.
- `10-showcase-inline.png` / `11-showcase-dock.png` — the showcase ColumnBrowser preview in both placements.

Gates: `validate:syntax` clean, `validate:relative-imports` clean.
