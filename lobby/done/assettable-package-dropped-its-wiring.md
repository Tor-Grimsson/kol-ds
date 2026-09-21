# assettable-package-dropped-its-wiring — the package `AssetTable` cannot replace the consumer it was ported from

**Filed:** 2026-09-03 ← **kol-client-olina**
**Package:** `@kolkrabbi/kol-styleguide@0.3.0` — `src/AssetTable.jsx`
**Origin:** `apps/brand`'s styleguide retirement. This is the one file that could not go onto the package for a reason other than absence.

## The problem

The port is honest about what it dropped — its docstring says so:

> *All app-specific wiring is dropped: the `import.meta.glob` SVG harvesting, the KolLogo / Graphic loaders, the ink-token toggle, the fullscreen overlay, and the `Blob` recolour-and-download.*

The trouble is that list is not app-specific wiring, it is **what the table is
for**. The consumer table's five columns are Preview · Name · Path · Color ·
Download, where:

- **Preview** is a zoom button — click opens the asset in a `FullscreenOverlay` at the currently-selected ink;
- **Color** shows the live token (`--kol-surface-on-primary` / `--kol-surface-primary`) and toggles per row;
- **Download** recolours the raw SVG (`currentColor` → the resolved token) into a `Blob` and downloads *that*, so a white mark downloads white.

The package table's columns are Preview · Name · Format · Dimensions ·
Download, with `href` or `onDownload` as a plain seam. It renders a manifest.
It cannot render a mark you can recolour and take.

## The ask

Two ways, and the second is the DS answer if the first is too much surface:

1. **Put the seams back as props** — `previewOnZoom` (a node + click handler), an `inkToken` column driven by a consumer-supplied token pair, and `onDownload(row, resolvedInk)` so the recolour stays the consumer's but the column is the DS's. The `Blob` and the `import.meta.glob` genuinely are app code and should stay out.
2. **Or say the package table is a different component** — a manifest table, not an asset browser — and name that in the docstring so the next consumer does not attempt the retirement and revert it, as this one did.

Either is fine. What is not fine is a port that reads as a replacement and
silently loses three behaviours.

## Consumer status

Fork kept: `apps/brand/src/components/styleguide/AssetTable.jsx`, 194 lines,
annotated with this ticket's name. kol-website's brand app carries the same
component at 218 lines (74 lines of diff — client data plus drift), so this is
a two-consumer file too; it is filed separately from
`brand-book-mocks-two-consumers` because the ask is a regression, not a gap.

## ✅ RESOLUTION — 2026-09-03 · @kolkrabbi/kol-styleguide@0.4.0

Option 1, the seams are back. The three behaviours the port dropped are props now; the Blob and the import.meta.glob stay yours, as the ticket says they should.

- inkTokens={{ ink, surface }} — a token pair turns on the Color column and the per-row toggle dot. The table owns the state (which is why the column and the dot can agree), the row's preview paints in the live token, and off-ink rows get the bg-fg-04 wash your fork drew so a paper-coloured mark stays visible.
- onPreviewZoom(row, resolvedInk) — supplied, the preview cell becomes the zoom button with cursor-zoom-in. You open your own FullscreenOverlay at the ink you are handed. The DS does not own the overlay: your comment about FullscreenOverlay owning scrim/Escape/focus-trap is exactly right and it is already a kol-component export.
- row.onDownload(row, resolvedInk) — the second argument is the COMPUTED colour, not the token, so `raw.replace(/currentColor/gi, ink)` works without you resolving it. The old one-arg call still works.

Also added row.previewWidth (your previewWidthFor, as row data) and a Path column that renders when any row carries `path`. Format and Dimensions still always show — that was existing behaviour and no ticket asked for it to change, so your fork's five columns and the package's are now both expressible.

The docstring that bragged about dropping all this is rewritten and names this ticket, so the next consumer reads what it is before attempting the retirement.

Shipped in @kolkrabbi/kol-styleguide@0.4.0, verified from the published tarball. The showcase's own Asset manifest section now drives it with inkTokens + onPreviewZoom, so the seams are exercised in-repo rather than only claimed.

**Remainder here:** none — kol-client-olina bump kol-styleguide to 0.4.0 and retire the 194-line fork onto it.

