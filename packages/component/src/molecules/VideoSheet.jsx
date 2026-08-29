import usePlayback from '../hooks/usePlayback.js'
import PlaybackBar from './PlaybackBar.jsx'

/* taxonomy-ok: molecule — nests PlaybackBar (relative). */

/**
 * VideoSheet — the overlay for video: the frame with the QuickTime bar floating
 * over its bottom edge (`PlaybackBar`, inset 16, radius 12 — PlaybackBarAndAudioSheet,
 * kol-r2b2 2026-08-27). No native controls; click on the video toggles play;
 * `autoPlay`, `playsInline`, `preload="metadata"`. Aria-labels only.
 *
 * @param {string}   src     the video URL
 * @param {string}   poster  the poster URL
 * @param {Function} onMeta  ({ w, h, len }) => void once metadata lands — the overlay's facts
 */
export default function VideoSheet({ src, poster, onMeta }) {
  const { ref, handlers, bar } = usePlayback((el) => onMeta?.({ w: el.videoWidth, h: el.videoHeight, len: el.duration }))
  return (
    <div className="relative max-w-full">
      <video ref={ref} src={src} poster={poster} autoPlay playsInline preload="metadata" className="max-w-full max-h-[78vh] rounded" onClick={bar.onToggle} {...handlers} />
      <PlaybackBar {...bar} place="left-4 right-4 bottom-4 rounded-xl" />
    </div>
  )
}
