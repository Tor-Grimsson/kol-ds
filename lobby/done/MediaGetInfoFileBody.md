---
component: MediaGetInfoFileBody
source: kol-component 0.317.5 — the ⌘I Get Info modal (MediaGetInfoModal), file case
staged: 2026-10-30
status: draft
deps: [MediaInspector, KindPreview]
---

# MediaGetInfoFileBody

## Purpose
Two gaps in the ⌘I modal on a file, seen in kol-website's media app (kol-component 0.317.5, `kol-video/video/asmr-sharp.mp4`, Columns view):
1. The small preview the MediaGetInfoModal spec asked for, under General, is not drawn.
2. The modal keeps the Quick Look height, so the facts sit at the top and about 60% of the box below them is empty.

The folder case is right and stays as it is.

## Anatomy
Header bar → head row (glyph · name · size · Modified) → General facts → **small preview** (image or video poster at the modal's width, its own ratio) → end. The modal hugs its content (`height: auto`, capped at the viewport).

## Props
None.

## Definition of done
- [ ] ⌘I on a file: the small preview under the facts, at its own ratio
- [ ] the modal's height follows its content; no empty band under the last row
- [ ] published, version named in the resolution

## Resolution — 2026-10-30

🟢 `closed` — shipped in `@kolkrabbi/kol-component` **0.317.6** (registry live 2026-10-30). Built as below.

## Built — 2026-10-30

- Cause: `asmr-sharp.mp4` is 1080 × 1920. At the modal's full width the reel ran about 750px, so the body hit its 88vh cap and scrolled, and the band under the facts was the video itself with no frame painted (`preload="metadata"`, no poster). The frame already hugs; nothing in `QuickLookFrame` or kol-theme changed.
- `packages/component/src/organisms/MediaLibraryPages.jsx` L621–628 (`GetInfoModal`'s preview): the image or video is the modal's width at its own ratio, capped at 32vh (`block max-w-full max-h-[32vh] w-auto h-auto mx-auto rounded`), so the window ends at the preview; the video loads at `${url}#t=0.1`, which paints a frame under `preload="metadata"`.
- The folder case, the frame CSS and Space's Quick Look viewer are untouched.

Verified on apps/media at :5299 (Playwright, 1280×720 and 1440×900), screenshots in `_tmp/2026-10-30-get-info-file-body/`:
- `01-before-video-cmd-i.png` — before: the preview at full width, body scrolling at the cap.
- `02-video-cmd-i-720/900.png` — `optic-reaction.mp4` ⌘I: frame painted (readyState 4), 230 / 288px preview, window 608 / 666px with no scroll (scrollHeight = clientHeight), 17px under the last row.
- `04-image-cmd-i-720/900.png` — `tt-07.jpg` ⌘I: 184×230 / 230×288 at its 4:5, window 612 / 670px, no scroll.
- `03-…` / `05-…-space-quicklook` — Space on the same files: 634 / 792px windows, identical to before the change.
- `06-folder-cmd-i-720/900.png` — `02-products/` ⌘I: 266px, as before.

Gate: `validate:syntax` clean.
