---
component: HlsVideo
source: kol-monorepo/apps/web/src/components/media/HlsVideo.jsx#L1-L48
date: 2026-07-03
status: draft
deps: []
---

# HlsVideo

## Purpose
A background/decorative HLS-streaming video atom. Wraps a native `<video>`, attaches an `.m3u8` stream via hls.js (with Safari-native HLS fallback), and locks the element down to be completely non-interactive. Used behind StudioHero, FeaturedCarousel, BentoCard, and HomeHero.

## Anatomy
```
<video>            ← the only element; ref-attached, HLS source wired in useEffect
```
Single leaf element. No wrapper, no children. Sizing/positioning is entirely delegated to the passed `className` (consumer decides `absolute inset-0 object-cover`, etc.).

## Variants
None (single form). Behavior forks only on playback source:
- **hls.js path** — when `Hls.isSupported()`: create `new Hls()`, `loadSource(src)`, `attachMedia(video)`; destroy on cleanup.
- **Safari-native path** — else if `video.canPlayType('application/vnd.apple.mpegurl')`: set `video.src = src` directly.
- Looping forks on `onEnded`: `loop` is `true` only when no `onEnded` handler is passed (a one-shot playthrough opts out of looping so its end event can fire).

## Props
| prop | type | default | controls |
|------|------|---------|----------|
| src | string | — | HLS manifest URL (`.m3u8`); effect re-runs on change |
| poster | string | — | native `poster` frame shown before playback |
| className | string | — | all layout/sizing/positioning (consumer-supplied) |
| onEnded | function | — | end-of-playback callback; also disables `loop` when present |
| ...props | — | — | spread onto `<video>` (last, can override) |

## Styling
- No Tailwind of its own — all visual/layout classes arrive via `className`.
- No KOL tokens referenced directly.
- Inline style: `style={{ pointerEvents: 'none' }}` — hard-locks the element from pointer interaction. Keep this.
- Hardening attributes (all intentional, keep verbatim): `autoPlay`, `muted`, `playsInline`, `controls={false}`, `disablePictureInPicture`, `disableRemotePlayback`, `controlsList="nodownload nofullscreen noremoteplayback"`, `onContextMenu` preventDefault. Source carries a big comment: these exist so the video is non-interactive on every device — do not strip them.
- **App-specific bits to DROP:** none. This atom is already app-agnostic (no fetch, no router, no consumer context). The only external coupling is the hls.js runtime dependency.

## States & interactions
No hover/active/selected/disabled/focus — it is deliberately inert (pointer-events none, no controls, context menu suppressed). Only lifecycle behavior: mount attaches stream, unmount destroys the hls.js instance; `src` change re-runs the attach effect.

## Dependencies
- **Runtime dep the DS must declare:** `hls.js` (`import Hls from 'hls.js'`) — a real npm package, not a DS internal. Add it to the component package's dependencies.
- No DS components composed.

## Recreation notes
- Tier: **atom**.
- Keep as a thin `<video>` wrapper; do not add controls, overlays, or fallback poster logic beyond the native `poster` attr.
- `src`, `poster`, `className`, `onEnded` stay as props; keep `...props` passthrough spread last so consumers can override.
- The `pointerEvents: 'none'` inline style and the full hardening attribute set are load-bearing — port them exactly.
- Preserve the `loop={!onEnded}` coupling.
- Effect cleanup must call `hls.destroy()`; guard both `!video` and `!src`.
- No text content, so no casing concerns.
- Declare `hls.js` as a peer/direct dependency and document that the DS bundle grows by hls.js size.
