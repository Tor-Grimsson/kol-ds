---
component: MediaLibrary (variant="picker")
source: kol-component/src/organisms/MediaLibrary.jsx#L1081-L1118
staged: 2026-10-15
status: draft
deps: [CloseButton, FullscreenOverlay, MediaLibraryBrowse]
---

# Media picker — the × and the title

## Purpose
The picker card (`MediaLibrary variant="picker"`), as kol-mirror's rail Media opens it.

## What is wrong (user, 2026-10-15, on mirror's picker)
1. **The ×** — *"the close X is in the wrong place … you ever seen a close out button before?? here is one"*, pointing at the Display Settings drawer: the title left, the × ALONE at the far right of the title row, nothing beside it. The picker puts it in `headerTrailing`, after the bucket dropdown, the lock and the gear (`MediaPickerCloseOnTheHeaderRow`, kol-fxr 2026-10-10), so it reads as one more header control. The ask: the × at the card's top-right corner, on the title's line, apart from the controls — the drawer's shape.
2. **The title ink** — `LibraryHeader`'s `<h1>` (`mastheadTitleClass` → `kol-sans-display-03`) sets no colour, so it inherits from wherever the overlay portals. Mirror's `<body>` had none, and MEDIA rendered near-black on the dark card. Mirror now sets `text-fg-96` on its body; the DS should not depend on that — give the title `text-fg-96` (or the masthead role's ink).

## Recreation notes
Change in the organism, not per consumer. fxr's 10-10 complaint was the overlay's corner × floating ~100px above the header; the fix is a corner × aligned to the title row, not the × inside the control cluster.

## ✅ RESOLUTION — 2026-10-15 · kol-component@0.261.0

The picker's × left the control cluster: MediaLibraryBrowse onHeaderClose puts it alone at the far end of the title's row, the Display Settings drawer's shape. The header title takes text-fg-96, so it no longer inherits from the body it portals into. Verified in apps/media /picker, light and dark: × on the title's centre line at the card's edge, outside the cluster, closes the picker; title ink 96 on both cards; 0 console errors.

**Remainder here:** none — kol-mirror bump kol-component@0.261.0; the body text-fg-96 workaround can stay or go.

