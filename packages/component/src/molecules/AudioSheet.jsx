import { useEffect, useState } from 'react'
import usePlayback from '../hooks/usePlayback.js'
import PlaybackBar, { clock } from './PlaybackBar.jsx'
import QuickLookFrame from './QuickLookFrame.jsx'
import FileIcon from '../atoms/FileIcon.jsx'
import { readCover } from '../utilities/id3.js'

/* taxonomy-ok: molecule — nests PlaybackBar + QuickLookFrame (relative) + FileIcon (atom). */

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
 * AudioSheet — audio in the Quick Look window, Finder's layout (user 2026-09-23, the reference
 * shot): the artwork square left, `Time: mm:ss` beside it, the QuickTime bar docked in the
 * window's footer. Artwork = the file's embedded ID3 `APIC` cover (`readCover`); no cover →
 * `FileIcon`, the same page the tile shows. The `cover` / `sheet` variants are gone — there is
 * one window now, and it is the sheet.
 *
 * @param {string}   src         the audio URL
 * @param {string}   ext         the extension, for the no-cover icon
 * @param {Function} onDuration  (seconds) => void once metadata lands
 * @param {Object}   frame       the window's header — `QuickLookFrame`'s title · meta · actions · onClose
 */
export default function AudioSheet({ src, ext, onDuration, frame }) {
  const { ref, handlers, bar } = usePlayback((el) => onDuration?.(el.duration))
  const cover = useCover(src)
  return (
    <QuickLookFrame {...frame} footer={<PlaybackBar {...bar} docked />}>
      <audio ref={ref} src={src} preload="metadata" {...handlers} />
      <div className="kol-quicklook-audio">
        <div className="kol-quicklook-art">
          {cover
            ? <img src={cover} alt="" className="w-full h-full object-cover" />
            : <FileIcon ext={ext} glyph="music-note" className="w-[52%]" />}
        </div>
        <span className="kol-mono-16 text-meta">Time: <b className="text-strong">{clock(bar.duration)}</b></span>
      </div>
    </QuickLookFrame>
  )
}
