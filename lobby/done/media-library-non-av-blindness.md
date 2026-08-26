# MediaLibrary drops everything that isn't an image or a video

**Filed from:** kol-r2b2 (the bucket admin) · 2026-08-15
**Affects:** `packages/component/src/organisms/MediaLibrary.jsx`
**Severity:** the organism cannot be used over a real bucket without losing data

## The defect

`MediaLibraryProvider` hard-filters its objects before anything downstream sees them:

```js
const wanted = (o) =>
  accept === 'video' ? isVideo(o.contentType)
  : accept === 'image' ? isImage(o.contentType)
  : isImage(o.contentType) || isVideo(o.contentType)
```

`accept='all'` — the default, and the value every page consumer passes — still means
**"images OR videos"**. Everything else is silently discarded before `buildRows`.

Measured against the live `kolkrabbi` bucket (3443 objects) this drops:

| Dropped | Count |
|---|---|
| HLS playlists (`.m3u8`) | 80 |
| text / data (`.json`, `.yaml`, `.pgn`, `.csv`) | 135 |
| code (`.js`) | 1 |
| audio (in `kol-vault-media`) | 116 |

A brand book embedding `MediaBrowser` over that bucket sees a library that quietly
omits every video stream it holds.

## Fix

`accept` should widen, not gate. Suggested contract:

- `accept='all'` (default) → **everything**, no filter.
- `accept='image' | 'video' | 'audio'` → that kind only.
- `accept={['image','video']}` → an allow-list, for the picker's real use case
  (fxr's editor wants pickable media, which is what `accept` was built for).

The picker keeps its current behaviour by passing `['image','video']` explicitly.
Nothing that *browses* should filter by default.

## Rules to bring with it

kol-r2b2 wrote these against the same buckets; they belong in the package, not in a
consumer. Source: `kol-r2b2/src/lib/media.js` + `media.test.mjs` (all covered by tests).

**1. Kind detection by extension, not content type.** B2 returns
`application/octet-stream` for `.json`, `.pgn`, `.m3u8`, `.woff2`. Extension must win:

```
image · video · audio · text · code · playlist · font · archive · system · other
```

**2. Resolution-set grouping.** Art prints ship as `name-566/-1132/-1700/-2840.jpg` —
four files, one picture. Collapse to one entry whose preview is the **smallest**
variant. On the live bucket: **604 files → 197 cards**, and the card pulls 27 KB
instead of 718 KB (**26×**). Guards that matter: only images, width ≥ 100 (so
`2017-03.json` and `mood-05.jpg` aren't mistaken for variants), sets of ≥2 only.

**3. HLS segment folding.** 2012 `segment_NNN.ts` files (2.7 GB) read as 2012
separate videos in every count. Fold per folder into one row carrying the count and
total bytes. Real video count on that bucket goes **2051 → 39**.

**4. System files.** 118 `.DS_Store` / `.bzEmpty` — one per folder, in the way of
everything. Hide by default, **report the count**; never silently drop.

**5. Poster pairing.** Every video has a sibling `<name>.png`. Use it as the poster so
`preload="none"` still shows a frame — the current `posterSrc(url) = url#t=0.1` makes
the browser fetch the video to paint frame one, which on a 20.4 GB vault is the
single most expensive thing the component does.

## Missing component

**There is no audio component in the design system.** `kol-vault-media` holds 116
sound files; kol-r2b2 renders them with a bare `<audio controls>` because nothing
exists to reach for. That's the one kind still hand-rolled downstream.

## Not asking for

Write paths. Upload / rename / delete stay in kol-r2b2 — the package's read-only
stance is right and this filing doesn't touch it.

---

## Resolution — 🟢 closed 2026-08-15

Shipped in **`@kolkrabbi/kol-component@0.39.0`** (registry-verified). Every
rule in the filing landed, in one pass over `MediaLibrary.jsx`:

- **`accept` widens.** `'all'` (default) = everything; one kind filters to that
  kind; `accept={['image','video']}` is the new allow-list a picker passes.
  Flagged **BREAKING** in the changelog — it is a default flip, and a browse
  page that leaned on the old default now lists non-media objects.
- **Kind by extension** (`EXT_KIND`), header as fallback — the ten kinds as
  filed. `.ts` reads as an HLS segment, not TypeScript: this component browses
  object buckets, not source trees.
- **Resolution sets collapse** — `key` is the smallest variant (what the tile
  loads), `fullKey` the largest (what download and Copy URL hand over, which
  the filing didn't ask for but is the same bug pointed the other way). Guards
  as specified: images only, width ≥ 100, sets of ≥2.
- **HLS segments fold per folder** onto the first segment's real key, carrying
  count and total bytes — so the row still resolves and still sits in its own
  folder.
- **System files hidden with the count** reported in the path bar, at the foot
  where Finder puts it.
- **Poster pairing** — sibling `<name>.png|jpg|jpeg|webp` becomes the real
  `poster` and the video drops to `preload="none"`; the `#t=0.1` seek survives
  only as the fallback for videos with no sibling.

Three things the filing implied but didn't name, fixed in the same pass because
they are the same defect: non-paintable kinds now get a kind glyph instead of an
`<img>` pointed at a `.json`; the Kind filter group is **derived** from what the
bucket holds instead of the hard-coded `['image','video','folder']` that denied
the new kinds existed; and the lightbox pages only image/video, indexed against
that list — previously a search that narrowed the grid opened the wrong file.

Checked: the five rules assert green against the extracted source (kind
detection incl. octet-stream cases, accept widening, set folding with both
guards, HLS folding, poster pairing, system counting). 19 gates clean.

**Not built: the audio component.** The filing is right that nothing exists to
reach for, but minting a new component is a taxonomy call (atoms paint; where an
audio player sits in the ladder), and that is the user's ruling to make, not
work this ticket authorises. Audio objects now *arrive* — they render with the
`frequency` glyph and are pickable — which is the part that was data loss.

**Remainder here:** none.
