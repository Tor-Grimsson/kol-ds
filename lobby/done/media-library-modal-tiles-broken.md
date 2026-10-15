# `MediaLibrary variant="modal"` renders broken — tiles and header

**Staged:** 2026-10-15 · from a kol-mirror session
**Change:** fix the `modal` variant's listing (`PickerShell` → `LibraryChrome`)

---

## The case

![[_assets/media-library-modal-tiles-broken.png|modal on mirror.kolkrabbi.io/library]]

kol-mirror mounted `<MediaLibrary variant="modal" … accept={['image','video']} />` (seen live on
mirror.kolkrabbi.io, a build before kol-component 0.257). In the grid view:

- tile titles render as big grotesk (`07.jpg` at `ContentCard` default's `kol-sans-heading-04`), far
  too loud for a filename
- the size (`358.2 KB`) collides with the copy icon on the meta line
- the `MEDIA LIBRARY` header title is near-invisible ink beside a white folder chip

Nothing in kol-mirror's CSS targets these classes — `src/styles/*` has no `kol-media-picker`,
`ContentCard` or `kol-sans-heading-*` rule — so the render is the DS's.

## The ask

Bring `modal` to the same standard as `picker` (the browse surface kol-fxr uses), or retire it into
`picker` if two picker variants is the fork the MediaLibrary header says it ends. Check it at the
current kol-component first — the screenshot predates 0.257.

kol-mirror has moved to `variant="picker"` (`src/App.jsx:254`), so nothing waits on this here.

## Done when

`modal` renders filenames, meta and header legibly with no collisions — or it is gone and `picker`
is the one modal. Nothing comes back to kol-mirror but the receipt.

## ✅ RESOLUTION — 2026-10-15 · kol-component@0.261.0

Fixed, not retired: MediaLibrary keeps modal's own grid | list on purpose. Modal's grid now renders MediaTile (preview over name) — picker's tile — instead of ContentCard default: small filenames, no size/copy collision. Click opens the lightbox (Use · Copy URL), double-click/Enter uses the file; list view unchanged. The header title was already legible at current code. Verified in apps/media /picker/b, light and dark.

**Remainder here:** none — kol-mirror none.

