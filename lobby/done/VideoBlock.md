---
component: VideoBlock
source: kol-monorepo/apps/web/src/components/prose/blocks/VideoBlock.jsx#L1-L55
date: 2026-07-03
status: draft
deps: [Image]
---

# VideoBlock

## Purpose
Renders a video inside an aspect-locked `figure` with an optional label and caption, for use inside `.kol-prose` long-form. Two modes are auto-selected from the input: an **embed** (YouTube / Vimeo, via `<iframe>`, parsed from a share URL) or a **file** (`<video>` element with poster/controls/autoplay/etc.). Currently keyed off a Sanity `value` object — that coupling must be dropped. The DS has **no video primitive**; the embed-URL parser is the reusable core. Recreate as `VideoFigure` (the figure shell) + `VideoEmbed`/player.

## Anatomy
- Helper `getEmbedUrl(url)`: YouTube (`youtube.com/watch?v=` | `youtu.be/`) → `https://www.youtube.com/embed/{id}`; Vimeo (`vimeo.com/{digits}`) → `https://player.vimeo.com/video/{id}`; else `null`.
- Guard: returns `null` when neither an embed src nor a file url resolves.
- `<figure className="kol-prose-figure">`
  - label (optional) `<div className="kol-caption-label">`
  - aspect box `border border-fg-08 rounded overflow-hidden aspect-[5/3]`
    - embed → `<iframe src allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="w-full h-full">`
    - file → `<video src poster controls controlsList="nodownload noplaybackrate noremoteplayback" autoPlay loop muted disablePictureInPicture disableRemotePlayback playsInline className="w-full h-full object-cover">`
  - caption (optional) `<figcaption className="kol-caption-text">`

## Variants
- **embed** (iframe, YouTube/Vimeo) vs **file** (native `<video>`) — selected automatically (embed wins when the URL parses).
- Aspect is fixed at `5/3` in the source.

## Props
Current input is a single Sanity `value` object — **DROP it, flatten to:**

| prop | type | default | controls | (from Sanity `value.*`) |
|------|------|---------|----------|----------|
| url | string | — | Embed source (YouTube/Vimeo) | `value.embedUrl` |
| file | string | — | Direct video file URL | `value.file.asset.url` \|\| `value.file.url` |
| poster | string | — | Video poster | `value.poster.asset.url` \|\| `value.poster.url` |
| label | string | — | Small label above the frame | `value.label` |
| caption | string | — | Caption below the frame | `value.caption` |
| aspect | string | `'5/3'` | Frame aspect ratio | (hardcoded `aspect-[5/3]`) |
| autoplay | boolean | `false` | Autoplay (forces `muted`) | `value.autoplay` |
| muted | boolean | `false` | Mute (forced true if autoplay) | `value.muted` |
| controls | boolean | `true` | Show controls (`!== false`) | `value.controls` |
| loop | boolean | `false` | Loop file playback | `value.loop` |

## Styling
- Classes: `kol-prose-figure`, `kol-caption-label`, `kol-caption-text` (prose CSS), `border-fg-08`, `rounded`, `aspect-[5/3]`, `object-cover`.
- Tokens: `border-fg-08`.
- **App-specific bits to DROP:** the `value` prop and its nested Sanity shapes (`value.file.asset.url`, `value.poster.asset.url`) → the flat props above. The hardcoded `aspect-[5/3]` → an `aspect` prop.

## States & interactions
- **File:** autoplay (mute forced when autoplay), loop, controls, `playsInline`; download / PiP / remote playback all disabled (`controlsList`, `disablePictureInPicture`, `disableRemotePlayback`).
- **Embed:** fullscreen allowed via iframe `allow`/`allowFullScreen`.
- Renders nothing when neither source resolves.

## Dependencies
None imported — raw `<iframe>` / `<video>`. A leaf. (Recreation reuses the shared `Figure` shell extracted from `ImageBlock`; DS `Image` is only relevant if a poster fallback is added.)

## Recreation notes
- Tier: **molecule**.
- Split into **`VideoFigure`** (the `figure` / label / aspect box / `figcaption` shell — the *same* shell `ImageBlock` needs, so extract one shared `Figure` primitive) + a **player core** that owns the embed-vs-file branch. `getEmbedUrl` is the reusable parser — keep it verbatim (it's the only real logic here).
- Take flat `{ url | file, poster, caption, label, aspect, autoplay, muted, controls, loop }`; drop the Sanity `value`. Default `aspect` to `5/3` but expose it.
- Text casing at call site: `label` / `caption` are content — render as authored, no transform.
