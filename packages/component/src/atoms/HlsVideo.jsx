import { useEffect, useRef } from 'react'
import Hls from 'hls.js'

/**
 * HlsVideo — background/decorative HLS-streaming video atom. A single native
 * <video>: the effect attaches an .m3u8 stream via hls.js (Safari-native HLS
 * when hls.js isn't supported) and destroys the instance on unmount/src
 * change. Deliberately inert — pointer-events none plus the full hardening
 * attribute set (no controls, PiP, context menu, download, fullscreen, or
 * remote playback) keep it non-interactive on every device; do not strip
 * these without explicit approval. All layout/sizing arrives via `className`
 * (consumer decides `absolute inset-0 object-cover`, etc.).
 *
 * @param {string}   src       HLS manifest URL (.m3u8); attach effect re-runs on change
 * @param {string}   poster    native poster frame shown before playback
 * @param {string}   className all layout/sizing/positioning (consumer-supplied)
 * @param {Function} onEnded   end-of-playback callback; its presence disables `loop`
 */
export default function HlsVideo({ src, poster, className, onEnded, ...props }) {
  const videoRef = useRef(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video || !src) return

    if (Hls.isSupported()) {
      const hls = new Hls()
      hls.loadSource(src)
      hls.attachMedia(video)
      return () => hls.destroy()
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Safari native HLS support
      video.src = src
    }
  }, [src])

  return (
    <video
      ref={videoRef}
      poster={poster}
      className={className}
      style={{ pointerEvents: 'none' }}
      autoPlay
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
