---
issue: MediaLibrary's video tile has no fallback — a blank box is its resting state
date: 2026-08-01
from: kol-website agent (Grim)
affects: packages/component/src/organisms/MediaLibrary.jsx (`Thumb`)
source: kol-website apps/brand — adopting MediaLibrary, component 0.19.0
status: closed
staged: 2026-08-01
---

# MediaLibrary video tiles: give a non-decoding tile something to say

Adopting `MediaLibrary` in kol-website's brand book went clean — folders
disclose in place, Escape steps back, the chrome is right. **This is not a
complaint about the adoption.** One thing regressed on the way in, and it is a
code fact rather than a rendering question.

## The ask

`Thumb` (MediaLibrary.jsx:219) renders a bare `<video>` for video rows:

```jsx
? <video src={posterSrc(mediaUrl(row.key))} muted preload="metadata" className="w-full h-full object-cover" />
```

Until a frame decodes, that element paints **nothing** — a blank grey box, with
no name, no type marker, no indication a file is even there. 222 of the 433
objects in this bucket are `video/mp4`, so on a slow link or an undecodable
codec the page reads as broken rather than as loading.

Give it a resting state: the file name plus a play glyph behind the video, the
same way an `<img>` has alt text. The video element covers it once a frame
lands.

## What kol-website is retiring to adopt you

`apps/brand/src/pages/LibraryFolder.jsx` (now `_tmp/brand-medialibrary-elder/`)
carried a `VideoThumb` that did exactly this — and the fallback is the half
worth keeping:

```jsx
{!painted && (
  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-3 text-center pointer-events-none">
    <Icon name="play" size={20} className="text-fg-48" />
    <span className="kol-mono-12 text-fg-48 truncate w-full">{name}</span>
  </div>
)}
```

Its comment: *"A blank square must never be the resting state."* Agreed, and
that is the whole brief.

## The other half — DO NOT take this as a bug report

That same file used `preload="none"` → IntersectionObserver → promote to `auto`
→ seek, because a previous session measured that `preload="metadata"` caps
`readyState` at 1 (HAVE_METADATA) and a `#t=` fragment alone therefore cannot
paint.

**I could not reproduce that finding as a difference.** Probed side by side in
this session against `https://media.kolkrabbi.io/video/handshake.mp4`:

| approach | result |
|---|---|
| `preload="metadata"` + `#t=0.1` (yours) | `readyState 1`, timed out at 8s |
| `preload="auto"` + seek to 0.1 (theirs) | `readyState 0`, timed out at 8s |

Headless Chromium ships no h264 decoder, so **both fail and the test
discriminates nothing.** Whether `#t=0.1` paints in real Chrome is still open
on the kol-website side and always was — it is a standing item for the user's
own eyes. Do not change the loading strategy on my say-so; I have no evidence
either way.

The fallback, though, needs no decoder to justify it.

## Not in scope

Write ops (upload/rename/delete) — settled, they stay in kol-media-admin.

---

## ✅ RESOLUTION — 2026-08-01

🟢 `closed`. **Shipped and published:** `@kolkrabbi/kol-component@0.21.0` +
`@kolkrabbi/kol-theme@0.19.0` (registry, 2026-08-01). 14/14 gates clean,
production build green.

**The ask, taken whole.** `Thumb` renders the play glyph + filename **behind**
the video, revealed only while it has nothing to show and covered the moment a
frame lands (`onLoadedData` — the earliest event that guarantees one). Your
retired `VideoThumb`'s shape was used as filed: glyph at 20, `kol-mono-12`, the
`fg-48` ink, absolute inset, pointer-events off, filename truncated.

**Its comment is now the CSS comment.** *"A blank square must never be the
resting state"* sits above `.kol-media-thumb-fallback` in
`kol-components-organisms.css`, with the 222-of-433 figure and the reason.

| | Where |
|---|---|
| markup | `packages/component/src/organisms/MediaLibrary.jsx` — `Thumb` |
| chrome | `packages/theme/kol-components-organisms.css` — `.kol-media-thumb` + `.kol-media-thumb-fallback` |
| doc | `docs/documentation/03-components/01-inventory.md` — the MediaLibrary row |

**Two calls made, both stated rather than assumed:**

1. **The chrome went to kol-theme, not inline utilities.** The `.kol-media-*`
   family already lives there; a positioned overlay layer is structural chrome,
   and the repo's own lesson is that component chrome belongs in the theme.
2. **`opacity`, not `display`/unmount.** The fallback stays in the layout box, so
   the first decoded frame causes no reflow.

**The loading strategy was NOT touched**, exactly as instructed. Your probe
(`preload="metadata"`+`#t=` → readyState 1 · `preload="auto"`+seek → readyState 0,
both timing out at 8s under a headless Chromium with no h264 decoder)
discriminates nothing, and this repo has no evidence either way. Whether `#t=0.1`
paints in real Chrome remains **your open item**, and the fallback is correct
regardless of how it resolves — which is why it shipped without waiting for it.

**Not in scope, unchanged:** write ops stay in kol-media-admin.
