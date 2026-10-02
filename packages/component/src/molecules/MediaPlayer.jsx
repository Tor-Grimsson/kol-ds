import usePlayback from '../hooks/usePlayback.js'
import PlaybackBar, { clock } from './PlaybackBar.jsx'
import QuickLookFrame from './QuickLookFrame.jsx'
import FileIcon from '../atoms/FileIcon.jsx'
import { useCover } from './PlayTile.jsx'

/* taxonomy-ok: molecule — nests PlaybackBar + QuickLookFrame (relative) + FileIcon (atom). */

/**
 * MediaPlayer — Play a video or an audio file. the media, `PlaybackBar` and the `usePlayback` hook
 * as ONE player (user ruling 2026-10-02: *"I was referring to the two players in the quicklook in
 * media"*). It was four components — `VideoSheet` and `AudioSheet` (the Quick Look pair),
 * `AudioPreview` (its own transport) and `AudioPlayer` (the browser's strip) — and each is an
 * alias of this one now, on the retirement ledger.
 *
 * `variant` is what plays. `frame` is where: given, the player draws inside `QuickLookFrame` (the
 * Quick Look window — the bar docked in its footer); absent, it plays inline (*"why would media
 * player not just prop the window, its not called WINDOWmediaplayer"*).
 *
 *   video           the picture at its own ratio; click toggles play. Inline, the bar floats over
 *                   its bottom edge (inset 16, radius 12)
 *   audio           inline, the bar alone. In the window, Finder's layout: the artwork square (the
 *                   file's embedded ID3 cover; none → `FileIcon`) beside `Time: mm:ss`
 *
 * No native controls, no autoplay (Quick Look opens paused), `playsInline`.
 *
 * @param {'video'|'audio'} variant  what plays (default `video`)
 * @param {string}   src       the media URL
 * @param {string}   poster    video — the poster URL
 * @param {string}   ext       audio — the extension, for the no-cover icon
 * @param {Function} onMeta    ({ w, h, len }) => void once metadata lands (audio reports `len` only)
 * @param {Object}   frame     the window's header — `QuickLookFrame`'s title · meta · actions · onClose · nav · size
 * @param {'none'|'metadata'|'auto'} preload  the native preload hint (default `metadata`)
 * @param {string}   className inline only — the player's box (its width is the caller's)
 */
export default function MediaPlayer({ variant = 'video', src, poster, ext, onMeta, frame, preload = 'metadata', className = '' }) {
  const audio = variant === 'audio'
  const { ref, handlers, bar } = usePlayback((el) => onMeta?.(audio ? { len: el.duration } : { w: el.videoWidth, h: el.videoHeight, len: el.duration }))
  const cover = useCover(audio && frame ? src : null)
  const media = audio
    ? <audio ref={ref} src={src} preload={preload} {...handlers} />
    : <video ref={ref} src={src} poster={poster} playsInline preload={preload} className={frame ? 'kol-quicklook-media' : 'block w-full'} onClick={bar.onToggle} {...handlers} />

  if (frame) {
    return (
      <QuickLookFrame {...frame} footer={<PlaybackBar {...bar} docked />}>
        {media}
        {audio && (
          <div className="kol-quicklook-audio">
            <div className="kol-quicklook-art">
              {cover
                ? <img src={cover} alt="" className="w-full h-full object-cover" />
                : <FileIcon ext={ext} glyph="music-note" className="w-[52%]" />}
            </div>
            <span className="kol-mono-16 text-meta">Time: <b className="text-strong">{clock(bar.duration)}</b></span>
          </div>
        )}
      </QuickLookFrame>
    )
  }

  return (
    <div className={`relative ${className}`.trim()}>
      {media}
      <PlaybackBar {...bar} docked={audio} />
    </div>
  )
}

/**
 * @deprecated 2026-10-02 — use `<MediaPlayer variant="video" frame={…}>`. Drops when nobody imports it (04-retirements.md).
 * VideoSheet — the video in the Quick Look window. Same props.
 */
export function VideoSheet({ frame, ...props }) {
  return <MediaPlayer variant="video" frame={frame ?? {}} {...props} />
}

/**
 * @deprecated 2026-10-02 — use `<MediaPlayer variant="audio" frame={…}>`; `onDuration(seconds)` is `onMeta({ len })`. Drops when nobody imports it (04-retirements.md).
 * AudioSheet — audio in the Quick Look window.
 */
export function AudioSheet({ frame, onDuration, ...props }) {
  return <MediaPlayer variant="audio" frame={frame ?? {}} onMeta={onDuration && ((m) => onDuration(m.len))} {...props} />
}

/**
 * @deprecated 2026-10-02 — use `<MediaPlayer variant="audio">`; `onDuration(seconds)` is `onMeta({ len })`. Drops when nobody imports it (04-retirements.md).
 * AudioPreview — the inline audio player. Its own transport is the `PlaybackBar` now.
 */
export function AudioPreview({ onDuration, ...props }) {
  return <MediaPlayer variant="audio" onMeta={onDuration && ((m) => onDuration(m.len))} {...props} />
}

/**
 * @deprecated 2026-10-02 — use `<MediaPlayer variant="audio">`. Drops when nobody imports it (04-retirements.md).
 * AudioPlayer — the native audio strip with a label. The strip is the
 * `PlaybackBar` now; the label is the caller's to draw.
 */
export function AudioPlayer({ src, label, preload, className = '' }) {
  if (!src) return null
  return (
    <figure className={`kol-audio-player flex flex-col gap-3 ${className}`.trim()}>
      {label && <figcaption className="kol-mono-12 text-fg-48">{label}</figcaption>}
      <MediaPlayer variant="audio" src={src} preload={preload} />
    </figure>
  )
}
