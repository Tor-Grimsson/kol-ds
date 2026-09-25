---
title: Media uploads
type: reference
status: active
created: 2026-09-25
updated: 2026-09-25
description: Converting files on upload, and keeping originals
aliases:
  - media uploads
  - upload conversion
  - file conversion
sources:
  - packages/component/src/organisms/MediaLibraryPages.jsx
  - ~/dev/projects/kol-olina/apps/media/src/lib/upload.js
  - ~/.dotfiles/bin/img-web-batch.sh
tags:
  - domain/compositions
  - domain/content-pipeline
  - audience/consumer
related:
  - "[[../../operations/07-apps-tier/02-media-app-plan|media app plan]]"
  - "[[07-content-system|content system]]"
---

# Media uploads

The media set (`MediaLibraryBrowse` and its siblings in `kol-component`) **never uploads and never converts**. Desktop files dropped on a folder, and right-click → Upload…, arrive at the consumer as `onDropFiles(files, folderPath)` — every consumer's store and pipeline differ, so the conversion is the consumer's to write. This page records the one recipe in use, so the next consumer starts from it instead of from nothing. It is an **option**, not a law: take it whole, take part of it, or upload as-is.

## The recipe

kol-client-olina's, in production on media.olina-productions.com since 2026-09-18 (`apps/media/src/lib/upload.js`). It is studio16's `img-web-batch.sh`, run in the browser on a canvas.

| Step | What happens |
|---|---|
| Name | Slugged, extension kept — `*HERO.png` → `hero.png`, lower-case, `[a-z0-9_-]`, repeated dashes collapsed; an empty base becomes `file` |
| Still images | `jpeg · png · webp · avif · bmp · tiff · heic · heif` are re-encoded to one web JPEG |
| Width | ≤ **2560 px** wide, never enlarged |
| Background | Flattened onto **white** (a transparent PNG gets a white ground) |
| Weight | JPEG quality stepped **0.9 → 0.8 → 0.7 → 0.6 → 0.5 → 0.4** until the file is ≤ **500 KB** |
| Already web | A JPEG that is already ≤ 500 KB and ≤ 2560 wide goes up once, untouched |
| Pass-through | Video, SVG, GIF (animation), and anything the browser cannot decode (TIFF / HEIC in Chrome) go up once, as they are |
| Video thumb | One frame at 0.5 s, 96 px, as a JPEG data URL stored beside the file (olina keeps it in D1) — no image file in the bucket |

## Originals folder

The choice a consumer has to make. With it, a converted still becomes **two** objects:

- `<folder>/original/<clean-name>` — the upload, byte for byte
- `<folder>/<stem>.jpg` — the web copy, which is what the site links

olina keeps originals (the client's masters, and the only way back from a lossy step). A consumer that does not want them uploads the web copy alone and loses the source — decide per consumer, and write the choice into that repo's architecture doc. Pass-through files never get an `original/` copy: nothing was changed.

## Shell twins

The same numbers exist as scripts for batch work outside a browser, in `~/.dotfiles/bin`: `img-web-batch.sh` (the recipe above), `img-web.sh`, `img-web-thumb.sh`, `img-resize-1080.sh`, `vid-h264-web.sh`, `vid-h265-small-web.sh` and the other `img-*` / `vid-*` scripts. studio16 carries its own copies (`~/dev/studio16/scripts/`), which is where olina's thresholds were taken from.

## Standing rulings

From kol-client-olina, 2026-09-18 — theirs, recorded here as precedent, not as DS law:

- **Videos stay as uploaded.** ~20 MB was ruled fine; no transcode on upload.
- **Other sizes come from the CDN**, not from more files: Cloudflare image transformations on the same keys, if a thumbnail or a second width is ever needed.
- **Binaries stay in the bucket.** Nothing is uploaded as a CMS asset; documents link bucket URLs.

## New consumer

1. Wire `onDropFiles` (and `fileActions`) on the media page — the DS hands over the `FileList` and the bucket-relative folder.
2. Pick: the recipe, part of it, or as-is.
3. Pick: originals folder or not.
4. Re-list through `refreshKey` after the uploads land.

If a second consumer takes the recipe unchanged, that is the signal to lift it into `@kolkrabbi/kol-media-client` as a pure `prepareUpload(file)` that returns the objects to put — until then it lives in the consumer.
