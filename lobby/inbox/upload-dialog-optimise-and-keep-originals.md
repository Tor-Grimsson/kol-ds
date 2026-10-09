# An upload asks "web-optimise raster images? keep originals?" in one KOL dialog, and kol-media-client does the conversion

**Staged:** 2026-10-09 · from a kol-website session
**Change:** two pieces, one ticket: toggles inside the `useModal` dialog (kol-component) + `prepareUpload` in kol-media-client

---

## The problem, in one case

kol-website's media app (`apps/media`, media.kolkrabbi.io) uploads every file byte for byte:
`functions/api/upload.js` is a plain `MEDIA_BUCKET.put` with a content type. The R2 bucket is 1.38 GB
in 433 files; `labs-render-examples/` alone is 1.09 GB in 415 files (~2.6 MB each), and every
thumbnail in the browser pulls the original.

Your own doc already has the answer: `docs/documentation/04-compositions/15-media-uploads.md` —
kol-client-olina's recipe (`kol-olina/apps/media/src/lib/upload.js`, `img-web-batch.sh` on a canvas).
It ends: *"If a second consumer takes the recipe unchanged, that is the signal to lift it into
`@kolkrabbi/kol-media-client` as a pure `prepareUpload(file)`."* kol-website is that second consumer.
But the user does not want it silent — he wants to be **asked** at upload.

## The fix

**1. kol-media-client — `prepareUpload(file, { optimise, keepOriginals })`**, olina's recipe lifted
as-is (slugged name · stills ≤2560 wide, never enlarged · quality 0.9→0.4 until ≤500 KB · an
already-web JPEG untouched · video / SVG / GIF / undecodable pass through · video thumb at 0.5s, 96px).
Returns the objects to put: `[{ key, blob }]` — the web copy, plus `original/<clean-name>` byte for
byte when `keepOriginals`. Pure; the consumer still does the put and the re-list. Plus a cheap
`isOptimisable(file)` so the consumer knows whether to ask at all.

- **Transparency:** olina flattens onto white. kol-website's R2 holds render output, where an alpha
  channel can be the point. Ask: a transparent PNG/WebP keeps its alpha (re-encoded as WebP, or left
  as PNG when it is already ≤2560 / ≤500 KB) rather than going to JPEG on white. Your call on the
  format; the ask is "don't silently flatten alpha".

**2. kol-component — toggles inside the `useModal` dialog.** The look the user means is the one
kol-fxr shows for "Password for the library sync:" — that is already your `useModal().prompt`
(`molecules/Modal.jsx`), so the **dialog exists; the toggle row does not.** `prompt` / `confirm` /
`alert` carry a title, an input and two buttons, nothing else. Ask: `confirm` takes
`options: [{ id, label, defaultValue }]`, rendered as `ToggleCheckbox` rows between the title and the
buttons, and resolves `{ ok, values: { [id]: boolean } }` when options are passed (plain boolean
otherwise — existing callers untouched). If a separate dialog kind is cleaner than widening
`confirm`, build that instead; the user was not sure it is in the DS at all.

What kol-website will then show on a drop that contains raster images:

```
Web-optimise raster images?
  [x] Optimise   (≤2560 px, ≤500 KB)
  [x] Keep originals   (original/<name>)
                       [Cancel] [Upload]
```

A drop with no raster images goes up without asking. The consumer remembers the last choice per
bucket and passes it back in as `defaultValue`.

## Not asked

- No upload inside the DS, no new media-page prop — both upload paths (`onDropFiles` and the
  consumer's own drop pool) are the consumer's, and both call the two pieces above.
- No CDN transforms, no video transcoding (olina's rulings stand).

## Done when

A kol-website drop of a 6 MB PNG with both toggles on puts `<folder>/<stem>.jpg` (or the alpha-safe
format) ≤500 KB and `<folder>/original/<name>.png` unchanged; with Optimise off, puts the file as-is;
a drop of one MP4 shows no dialog. kol-website consumes it the turn it returns.
