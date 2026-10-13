import { useEffect, useRef } from 'react'
import Hls from 'hls.js'

/**
 * BackgroundVideo — A background video with no controls. the background/decorative HLS-streaming video. A single native
 * <video>: the effect attaches an .m3u8 stream via hls.js (Safari-native HLS
 * when hls.js isn't supported) and destroys the instance on unmount/src
 * change. Deliberately inert — pointer-events none plus the full hardening
 * attribute set (no controls, PiP, context menu, download, fullscreen, or
 * remote playback) keep it non-interactive on every device; do not strip
 * these without explicit approval. All layout/sizing arrives via `className`
 * (consumer decides `absolute inset-0 object-cover`, etc.).
 *
 * NAMED FOR WHAT IT IS FOR (user ruling 2026-10-01): it was `HlsVideo`, which says how it streams,
 * and it sat in atoms. It has no UI — nothing to operate — so it is a utility; `HlsVideo` is the
 * alias on the retirement ledger.
 *
 * @param {string}   src       HLS manifest URL (.m3u8); attach effect re-runs on change
 * @param {string}   poster    native poster frame shown before playback
 * @param {string}   className all layout/sizing/positioning (consumer-supplied)
 * @param {Function} onEnded   end-of-playback callback; its presence disables `loop`
 * @param {boolean}  active    plays only while true (default true) — an
 *   off-stage carousel slide pauses instead of autoplaying beside the
 *   active one (FeaturedCarouselFullWidth, 2026-08-26)
 * @param {Object}   hlsConfig hls.js config spread over `HLS_DEFAULTS`; read when `src` attaches
 *   (a changed object alone does not reload the stream)
 */
/* START WHERE THE PLAYER CAN SHOW IT (BackgroundVideoStartsAtLowestRendition, kol-website
 * 2026-10-13 — user: *"why is this video so low res? … its super long lag till you get good res?"*).
 * A bare `new Hls()` starts at the manifest's FIRST rendition (360p on every bucket master) on a
 * 500 kbps guess and only climbs after measured fragments, so a 640px card played upscaled 360p
 * until ABR caught up. Auto start level, a broadband guess until measured, and never above the
 * element's own size. The ticket's three keys plus `testBandwidth: false`. */
export const HLS_DEFAULTS = {
  startLevel: -1,
  /* without this, an auto start still loads its FIRST fragment at the lowest rendition to measure
   * bandwidth — measured 2026-10-13: 360 → 720 with it on, 720 from the first fragment with it off */
  testBandwidth: false,
  abrEwmaDefaultEstimate: 8_000_000,
  capLevelToPlayerSize: true,
}

export default function BackgroundVideo({ src, poster, className, onEnded, active = true, hlsConfig, ...props }) {
  const videoRef = useRef(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (active) video.play?.()?.catch?.(() => {})
    else video.pause()
  }, [active])

  useEffect(() => {
    const video = videoRef.current
    if (!video || !src) return

    if (Hls.isSupported()) {
      const hls = new Hls({ ...HLS_DEFAULTS, ...hlsConfig })
      hls.loadSource(src)
      hls.attachMedia(video)
      return () => hls.destroy()
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Safari native HLS support
      video.src = src
    }
  }, [src]) // eslint-disable-line react-hooks/exhaustive-deps -- hlsConfig is read at attach

  return (
    <video
      ref={videoRef}
      poster={poster}
      className={className}
      style={{ pointerEvents: 'none' }}
      autoPlay={active}
      loop={!onEnded}
      muted
      onEnded={onEnded}
      playsInline
      controls={false}
      disablePictureInPicture
      disableRemotePlayback
      controlsList="nodownload nofullscreen noremoteplayback"
      onContextMenu={(e) => e.preventDefault()}
      {...props}
    />
  )
}
