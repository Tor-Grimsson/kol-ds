# The preview pane crops any image wider than 16:9 or taller than 9:16

**Staged:** 2026-09-25 · from a kol-client-olina session
**Change:** `ImageFrame` in `MediaLibraryPages.jsx`; no new props

---

## The problem, in one case

kol-component 0.220.0, `apps/media`. Select `brand/logos/olina-wordmark.svg` (300×107, about
2.8:1) in any view and the preview pane shows a giant cropped "Olina" with the sides cut off. The
user: *"svg is not containing the graphic."* `olina-nav.svg` (300×27, about 11:1) is worse: the pane
shows two half letters.

## Why

`ImageFrame` (`MediaLibraryPages.jsx:199`) snaps the frame to the nearest of `RATIOS`
(`utilities/ratios.js`: 9:16, 3:5, 4:5, 1:1, 5:4, 5:3, 16:9) and fills it with
`className="w-full h-full object-cover"`. The nearest preset for anything wider than 16:9 (or
narrower than 9:16) is still 16:9 (or 9:16), so `object-cover` crops the difference. Photos sit near a
preset, so the crop is a few percent and nobody notices. Logos, banners, wordmarks and icons sit far
outside the ladder.

## The fix

`object-contain` for an image whose own ratio is outside the ladder (or always for vector
images, `image/svg+xml`), so the whole graphic shows inside the frame. Photos near a preset keep
`object-cover`. A file that reports no natural size (an SVG with only a `viewBox`) already falls to
`1 / 1`, which `contain` also handles.

## Definition of done

- [ ] `olina-wordmark.svg` (2.8:1) and `olina-nav.svg` (11:1) show whole in the preview pane, in columns, rows and grid.
- [ ] A photo close to a preset ratio previews exactly as before.
- [ ] The ratio snap and the frame's size do not change.

## ADDRESSED — 2026-09-25 · kol-component@0.221.0

`ImageFrame` keeps the ratio snap and the frame size. It draws `object-contain` for an SVG (`image/svg+xml`, from the first paint) or for an image whose own ratio is past the ladder's ends (wider than 16:9, taller than 9:16); photos near a preset keep `object-cover`. Both call sites (columns, and the rows / grid pane) pass the vector flag.

Proved live in `apps/media`: `logo.svg` → contain; `tt-07.jpg` (4:5) → cover in a 4 / 5 frame, as before; an 11:1 PNG swapped into the frame → contain in a 16 / 9 frame. The fixture has no wide SVG, so `olina-wordmark.svg` itself is yours to confirm.
