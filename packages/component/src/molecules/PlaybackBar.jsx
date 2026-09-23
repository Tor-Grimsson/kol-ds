/* eslint-disable react-hooks/refs -- floating-ui's `refs.setReference` is a callback ref, as in the DS Tooltip */
import { useState } from 'react'
import IconFrame from '../atoms/IconFrame.jsx'
import { usePopover, PopoverPanel } from '../utilities/Popover.jsx'

/* taxonomy-ok: molecule — nests IconFrame (atom) + PopoverPanel (relative). */

/* mm:ss — the reference bar shows two-digit minutes (00:12 · 00:25) */
export const clock = (s) => `${String(Math.floor((s || 0) / 60)).padStart(2, '0')}:${String(Math.floor((s || 0) % 60)).padStart(2, '0')}`

const RATES = [1, 1.5, 2]

/**
 * PlaybackBar — the QuickTime bar, ruled against the reference (PlaybackBarAndAudioSheet,
 * kol-r2b2 2026-08-27; supersedes 0.107.0's strip): a frosted strip over media —
 * `bg-fg-ab-48 backdrop-blur-xl`, **radius 12** (`rounded-xl`, the user's
 * ruling on this surface — the 4px container law stands elsewhere), `h-16 px-8
 * gap-7` — white glyphs whatever the theme (`.kol-playback-bar`, kol-theme ≥0.75.0:
 * opacity .8, 1 on hover / focus-visible), the transport cluster (`skip-back-15` ·
 * play / pause · `skip-forward-15`, ghost IconFrames, gap-5), elapsed as `mm:ss`
 * (`kol-mono-16 tabular-nums`), a native range scrubber (2px track at white 40 %,
 * a 4 × 28 white pill knob — `.kol-playback-scrub`), the TOTAL length (not the
 * remaining), volume behind `speaker` (the vertical `slider-black` range in a
 * PopoverPanel), and `>>` (`chevrons-right`) cycling the speed 1 → 1.5 → 2.
 *
 * PRESENTATIONAL — the sheet owns the media element (`usePlayback`); this bar
 * never touches it. `place` positions it: floating over media (`left-4 right-4
 * bottom-4 rounded-xl`) or flush along a plate's bottom edge (`left-0 right-0
 * bottom-0`).
 *
 * @param {boolean}  playing
 * @param {number}   time      seconds elapsed
 * @param {number}   duration  seconds total
 * @param {number}   rate      playback speed (1)
 * @param {Function} onToggle
 * @param {Function} onSeek    (seconds) => void
 * @param {Function} onVolume  (0..1) => void
 * @param {Function} onRate    (rate) => void — omit to hide the speed control
 * @param {string}   place     the strip's position classes (see above)
 * @param {boolean}  docked    in a window's footer (`QuickLookFrame`, 2026-09-23): in flow, full
 *                             width, 48 tall, the 4px container radius (the 12 is the FLOATING bar's
 *                             ruling, not a window's), and the THEME's ink on an oq plate — it sits on the
 *                             window, not on media, so white glyphs would vanish in light; `place`
 *                             is ignored
 */
export default function PlaybackBar({ playing, time, duration, rate = 1, onToggle, onSeek, onVolume, onRate, place = 'left-4 right-4 bottom-4 rounded-xl', docked = false }) {
  const [volume, setVolume] = useState(100)
  const [open, setOpen] = useState(false)
  const pop = usePopover({ open, onOpenChange: setOpen, placement: 'top' })
  const nextRate = RATES[(RATES.indexOf(rate) + 1) % RATES.length]
  return (
    <div className={`kol-playback-bar flex items-center ${docked ? 'kol-playback-bar--docked relative w-full h-12 px-4 gap-5 rounded' : `h-16 px-8 gap-7 bg-fg-ab-48 text-ab-white absolute backdrop-blur-xl ${place}`}`}>
      {/* TARGETS YOU CAN HIT (user 2026-09-23: *"the click range around the icons is very small …
        * it should be easy to press pause and play"*). Play/pause is the big one (40px), the skips
        * 32px, and each glyph grows with its frame — at 16px the 15s numerals clogged. */}
      <div className="flex items-center gap-3">
        <IconFrame name="skip-back-15" variant="ghost" size="md" iconSize={22} onClick={() => onSeek(time - 15)} aria-label="Back 15 seconds" />
        <IconFrame name={playing ? 'pause' : 'play'} variant="ghost" size="lg" iconSize={24} onClick={onToggle} aria-label={playing ? 'Pause' : 'Play'} />
        <IconFrame name="skip-forward-15" variant="ghost" size="md" iconSize={22} onClick={() => onSeek(time + 15)} aria-label="Forward 15 seconds" />
      </div>
      <span className="kol-mono-16 tabular-nums opacity-80">{clock(time)}</span>
      <input type="range" className="kol-playback-scrub flex-1 min-w-0" min={0} max={duration || 0} step={0.1} value={time} onChange={(e) => onSeek(Number(e.target.value))} aria-label="Scrub" />
      <span className="kol-mono-16 tabular-nums opacity-80">{clock(duration)}</span>
      <span ref={pop.refs.setReference} {...pop.getReferenceProps()} className="inline-flex">
        <IconFrame name="speaker" variant={open ? 'secondary' : 'ghost'} size="md" onClick={() => {}} aria-label="Volume" />
      </span>
      <PopoverPanel popover={pop} className="p-2">
        <div className="w-6 h-24 flex items-center justify-center">
          <input
            type="range"
            min={0}
            max={100}
            value={volume}
            onChange={(e) => { const v = Number(e.target.value); onVolume?.(v / 100); setVolume(v) }}
            className="slider-black cursor-pointer w-24 -rotate-90"
            aria-label="Volume"
          />
        </div>
      </PopoverPanel>
      {onRate && (
        <span className="flex items-center gap-1">
          <IconFrame name="chevrons-right" variant="ghost" size="md" onClick={() => onRate(nextRate)} aria-label={`Playback speed ${rate}× — next ${nextRate}×`} />
          {rate !== 1 && <span className="kol-mono-12 tabular-nums opacity-80">{rate}×</span>}
        </span>
      )}
    </div>
  )
}
