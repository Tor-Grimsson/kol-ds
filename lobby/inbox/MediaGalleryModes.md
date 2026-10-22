---
component: MediaGalleryModes
source: user request in a kol-branding session (no consumer source — new component)
staged: 2026-10-21
status: draft
deps: [GalleryCarousel, MediaTileGallery, MediaViewer, SegmentedToggle]
---

# MediaGalleryModes

## Purpose
One media set, three ways to look at it, switched by the viewer. User's words (2026-10-21):
> "when you have a bunch of images a carousel is a nice viewing experience, unless you are looking for specific thing, then you might wanna grid or waterfall the images. maybe thats a ticket for ds, expand carousel functionality or create media viewer component with the features i described."

First consumer: kol-branding's brand guide — deck slides and branded-mockup sets, where the point is showing the work in a sequence (carousel) and finding one piece (grid / waterfall).

## Anatomy
```
section
├── header row: optional title · mode switch (Carousel | Grid | Waterfall)
└── body (one of)
    ├── carousel   — the GalleryCarousel shelf
    ├── grid       — MediaTileGallery layout="grid" (uniform tiles)
    └── waterfall  — masonry columns, each item at its own aspect
click any item → MediaViewer at that item, paged across the whole set
```

## Variants
- `mode`: carousel · grid · waterfall. The switch is hidden when `modes` has one entry.

## Props
| prop | type | default | controls |
|------|------|---------|----------|
| `items` | `[{ url, kind?: 'image'\|'video', alt?, caption?, aspect? }]` | `[]` | the media set (MediaViewer's shape + `aspect`) |
| `modes` | `('carousel'\|'grid'\|'waterfall')[]` | all three | which modes are offered |
| `mode` / `defaultMode` / `onModeChange` | string / string / fn | `'carousel'` | controlled or uncontrolled mode |
| `cols` | number | 3 | grid + waterfall column count (responsive down) |
| `title` | string | — | header label and alt fallback |

## Styling
- Mode switch: the existing `SegmentedToggle` (as used across KOL), not a new control.
- Carousel and grid reuse `GalleryCarousel` / `MediaTileGallery` styling as-is.
- Waterfall: CSS columns (`columns-*`, `break-inside-avoid`, gap matching the grid's), items keep their own aspect — no crop.
- Nothing app-specific to drop: there is no consumer source.

## States & interactions
- Mode change keeps the set and the item the viewer last opened.
- Items are buttons (keyboard: Enter/Space opens the viewer); carousel keeps its drag-vs-click guard.
- Viewer: arrows, Esc, backdrop close — MediaViewer's own behaviour.

## Dependencies
`GalleryCarousel`, `MediaTileGallery`, `MediaViewer`, `SegmentedToggle` — all in kol-component.

## Recreation notes
- Organism. Either a new `MediaGalleryModes` composing the three, or `mode` added to one of the existing two — DS agent's call; the ask is the switchable modes, not a name.
- Waterfall is the only new layout.
- Captions verbatim, no auto-casing.
