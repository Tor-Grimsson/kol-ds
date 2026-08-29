import { useEffect, useState } from 'react'
import { Icon } from '@kolkrabbi/kol-icons'
import usePlayback from '../hooks/usePlayback.js'
import PlaybackBar, { clock } from './PlaybackBar.jsx'
import { readCover } from '../utilities/id3.js'

/* taxonomy-ok: molecule — nests PlaybackBar (relative) + kol-icons' Icon. */

function useCover(src) {
  const [cover, setCover] = useState(null)
  useEffect(() => {
    let live = true
    readCover(src).then((url) => { if (live) setCover(url) }).catch(() => {})
    return () => { live = false }
  }, [src])
  return cover
}

/**
 * AudioSheet — audio in the overlay, ruled against the QuickTime audio reference
 * (PlaybackBarAndAudioSheet, kol-r2b2 2026-08-27), two variants:
 *
 *   cover  the same as VideoSheet — the artwork is the frame (`w-[min(78vh,100vw_-_10rem)]`,
 *          square), the bar floating over its bottom edge (inset 16, radius 12)
 *   sheet  the QuickTime window — a dark plate (`bg-fg-ab-88`, `min(100vw − 10rem, 1000px)`),
 *          the cover square left, `Time: mm:ss` beside it, the bar flush along the bottom
 *
 * Artwork = the file's embedded ID3 `APIC` cover (`readCover`); no cover → a light
 * square carrying the `music-note` glyph, the reference's. `autoPlay`; `onDuration`
 * for the overlay's facts. The `10rem` in the widths is the overlay's arrow gutter.
 *
 * @param {string}   src         the audio URL
 * @param {Function} onDuration  (seconds) => void once metadata lands
 * @param {'cover'|'sheet'} variant
 */
export default function AudioSheet({ src, onDuration, variant = 'cover' }) {
  const { ref, handlers, bar } = usePlayback((el) => onDuration?.(el.duration))
  const cover = useCover(src)
  const audio = <audio ref={ref} src={src} autoPlay preload="metadata" {...handlers} />
  const art = cover
    ? <img src={cover} alt="" className="w-full h-full object-cover" />
    : <div className="w-full h-full flex items-center justify-center bg-ab-white text-fg-ab-32"><Icon name="music-note" size={64} /></div>

  if (variant === 'sheet') return (
    <div className="relative w-[min(100vw_-_10rem,1000px)] rounded overflow-hidden bg-fg-ab-88">
      {audio}
      <div className="flex items-center gap-16 p-10 pb-24">
        <div className="w-[min(50vh,380px)] aspect-square shrink-0 overflow-hidden">{art}</div>
        <span className="kol-mono-16 text-ab-white"><span className="opacity-48">Time: </span><b className="opacity-80">{clock(bar.duration)}</b></span>
      </div>
      <PlaybackBar {...bar} place="left-0 right-0 bottom-0" />
    </div>
  )

  return (
    <div className="relative max-w-full">
      {audio}
      <div className="w-[min(78vh,100vw_-_10rem)] aspect-square rounded overflow-hidden">{art}</div>
      <PlaybackBar {...bar} place="left-4 right-4 bottom-4 rounded-xl" />
    </div>
  )
}
