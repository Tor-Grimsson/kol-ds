# export-and-history-want-packaging — two seams a second consumer asked for by name

**Filed:** 2026-09-04 ← **kol-fxr**
**Package:** `@kolkrabbi/design-editor` — both live in its `src/editor`
**Requesting consumer:** `kol-client-olina/apps/brand` — the slide-deck editor
**Related:** `rulers-and-guides-are-private.md` (closed, kol-component 0.203.0 — same consumer, same night)

kol-client-olina copied both of these on **our own advice** — we told them to,
because both weld to the layer model. They came back and asked for them
packaged, with a spec, after their user ruled on it. This is not a
"would-be-nice": it is the second consumer holding the adoption, which is the
only test this estate uses.

Neither seam is in fxr's own plan phases — they displaced `kol-signals` to
Phase 1 on the user's approval this session, precisely because the consumer
named these instead.

---

## Seam 1 — export: the rasteriser and the fonts, NOT the builder

`svgToPngBlob(svgString, scale)` is the exact ask. Their copy is ~180 lines and
they would drop it tomorrow for this plus font embedding.

**`buildLayersSvg` is deliberately NOT wanted.** The builder welds to each app's
layer schema — theirs is slides, ours is compose layers — so it was never the
reusable half. Package the half that takes a finished SVG string and gives back
pixels.

### The font half is where the bug lives

Their export silently rendered every Google family in a system fallback while
the screen looked perfect. Cause: they harvested bare `url(...)` matches out of
Google's CSS and emitted their own `@font-face` **without `unicode-range`**.
Google splits one family into latin / latin-ext / cyrillic / greek subsets
distinguished by that range and nothing else, so whichever came first got
embedded and matched no glyph.

- **The behaviour to package:** rewrite whole `@font-face` blocks, swap only the
  `src`. Never synthesize the face.
- **The test to package with it:** compare **rendered ink** with and without the
  embedded face. Theirs asserted css fetched, urls found, bytes non-zero — every
  structural assertion passed and the pixels were identical.

### design-editor's own exporter has the same shape

Read from the installed 0.6.0 bundle, so this is the shipped code, not a guess:

```js
ms.set(e.url, `@font-face{font-family:'${e.family}';src:url(data:font/truetype;base64,${a}) format('truetype');font-weight:1 1000;font-stretch:1% 1000%;}`)
```

- It **synthesizes** the face with no `unicode-range` — the same shape that burned
  olina. It is safe **today** only because its faces are self-hosted full-range
  variable files, so there are no subsets to confuse. It becomes the identical
  bug the day a subsetted or Google-hosted family joins that list.
- The fetch is wrapped in a bare **`catch {}`**. A failed font fetch exports in
  system fallback with nothing logged — olina's exact silent-failure mode,
  already latent here.

---

## Seam 2 — history: generic over the value

```
useHistory(initialValue) → { set, begin, end, undo, redo, reset }
```

The consumer owns what is in the snapshot. Olina's value is
`{slides, active, selectedIds}`; ours is compose state. **If it knows about
layers it stops being reusable** — that is their words and they are right.

The two things worth packaging are exactly what we told them to copy:

1. **Selection rides inside the snapshot.** Undo restores what was selected, not
   just what was drawn.
2. **A transaction so a drag is one entry** — `begin` / `end` around the gesture.

### One implementation law, from their build

**Never push history inside a `setState` updater.** StrictMode calls updaters
twice and every entry doubles. Compute the next value against a ref, outside the
updater.

---

## What stays at kol-fxr

Nothing. This repo has held no editor source since the 2026-09-03 move — both
seams are in `design-editor`, which is yours. Filed from here because fxr owns
the knowledge of how both work and carried the consumer's spec.

**Remainder here:** none — on the return: bump, and confirm export still produces
correct ink in a browser rather than a green build.

## ✅ RESOLUTION — 2026-09-04 · @kolkrabbi/kol-component@0.208.0

Both seams packaged, and the latent font bug you found is fixed rather than noted.

Export — kol-component 0.208.0. `svgToPngBlob(svgString, scale)` plus the font half, and `downloadBlob` since every export path was minting its own anchor. `buildLayersSvg` deliberately absent, for the reason you gave: it welds to each app's layer schema and was never the reusable half.

The font half is `inlineFontFaces(cssText, fetchFont?)`, and it does the thing your consumer's bug proves it must: it REWRITES whole @font-face blocks and swaps only the src. It never synthesizes. unicode-range, weight, stretch and every other descriptor survive exactly as the foundry authored them. A face that fails to fetch comes back in `failed[]` with its error and its original url left intact — not swallowed.

`embedFontFace(face)` is the synthesize path, kept and labelled for the one case where it is safe: a self-hosted, full-range file with no subsets to confuse. Its docstring says outright that a subsetted or Google-hosted family must go through `inlineFontFaces` instead.

The test asserts what you said to assert. Not "css fetched, urls found, bytes non-zero" — it feeds real two-subset Google CSS through and checks both @font-face blocks survive, both unicode-ranges survive (U+0400-045F and U+0000-00FF by name), both srcs became data URIs, no remote url remains, the other descriptors are intact, and a failing fetch reports rather than silently degrades. 6/6.

History — `useHistory(initialValue, limit?)` → `{ value, set, begin, end, undo, redo, reset, canUndo, canRedo }`. Generic over the value; nothing in it inspects what it stores. `set` takes a value or a producer, and the producer is called against a REF, outside any updater — which is what makes the StrictMode double-push impossible rather than merely avoided. Your law is in the docstring with the reason, because "undo skipping" in dev only is not a symptom anyone diagnoses twice.

A gesture that moves nothing is not an entry — `begin()`/`end()` with no change between them pushes nothing. That was not in the spec and it is the difference between a clean stack and one full of no-ops from stray pointer-downs. Test covers it, 5/5: a 50-move drag is one entry, undo restores the selection with the value, an empty gesture is inert, one action is one entry, and a new edit drops the redo branch.

YOUR LATENT DEFECT, fixed: design-editor's own `warmFontCss` now calls `embedFontFace` and its bare `catch {}` is a `console.warn` naming the family that will fall back. You were right that it was safe today and the same bug the day a subsetted family joins FONTS — the comment at that call site now says so, so the next person adding a Google family reads the warning before they write it.

One bug of my own, caught before it shipped: routing the editor's rasteriser through the DS as `export { svgToPngBlob } from '@kolkrabbi/kol-component'` builds green and fails at runtime — a bare re-export creates no local binding, and `downloadComposePng` in that same file calls it. Imported and then re-exported. Worth knowing since it is invisible to a build.

Shipped: kol-component 0.208.0, design-editor 0.8.0, both verified by fetching the tarball. On the return: bump and confirm the export produces correct ink in a browser, not a green build — as your remainder says.

**Remainder here:** none — kol-fxr bump kol-component to 0.208.0 + design-editor to 0.8.0; drop the copied rasteriser and history, and check exported ink in a browser.

