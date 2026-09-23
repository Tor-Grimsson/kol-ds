import usePlayback from '../hooks/usePlayback.js'
import PlaybackBar from './PlaybackBar.jsx'
import QuickLookFrame from './QuickLookFrame.jsx'

/* taxonomy-ok: molecule — nests PlaybackBar + QuickLookFrame (relative). */

/**
 * VideoSheet — video in the Quick Look window: the frame at the video's own aspect ratio, the
 * QuickTime bar docked in the window's footer (2026-09-23 — it floated over the picture, which
 * made video the one kind whose controls sat on the media). No native controls; click on the
 * video toggles play; no autoplay (user 2026-09-23 — Quick Look opens paused), `playsInline`, `preload="metadata"`.
 *
 * @param {string}   src     the video URL
 * @param {string}   poster  the poster URL
 * @param {Function} onMeta  ({ w, h, len }) => void once metadata lands — the window's facts
 * @param {Object}   frame   the window's header — `QuickLookFrame`'s title · meta · actions · onClose
 */
export default function VideoSheet({ src, poster, onMeta, frame }) {
  const { ref, handlers, bar } = usePlayback((el) => onMeta?.({ w: el.videoWidth, h: el.videoHeight, len: el.duration }))
  return (
    <QuickLookFrame {...frame} footer={<PlaybackBar {...bar} docked />}>
      <video ref={ref} src={src} poster={poster} playsInline preload="metadata" className="kol-quicklook-media" onClick={bar.onToggle} {...handlers} />
    </QuickLookFrame>
  )
}
