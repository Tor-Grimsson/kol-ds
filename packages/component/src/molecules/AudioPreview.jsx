/* eslint-disable react-hooks/refs -- floating-ui's `refs.setReference` is a callback ref, not a ref read; the DS Tooltip wires it the same way */
import { useEffect, useRef, useState } from 'react';
import IconFrame from '../atoms/IconFrame.jsx';
import Slider from './Slider.jsx';
import { usePopover, PopoverPanel } from '../utilities/Popover.jsx';
import { readCover } from '../utilities/id3.js';

/* taxonomy-ok: molecule — nests IconFrame (atom) + Slider / PopoverPanel (relative). */

/**
 * AudioPreview · AudioTile · VideoTile — kol-r2b2's players, promoted verbatim
 * (ColumnBrowserMediaFacts 2026-08-27; the tiles re-ruled the same day,
 * PlayDiscAndVideoBar): players composed from DS parts (IconFrame · Slider ·
 * Popover) — the DS AudioPlayer is a native <audio controls>, whose one-row
 * layout can't be reshaped. Finder model (user ruling 2026-08-27): the COLUMN
 * gets a square tile over full-bleed artwork with ONE control — the Finder
 * play/pause disc (`.kol-play-disc`: round, hidden at rest, shown on hover of
 * `.kol-media-tile`) — `AudioTile` (artwork = the file's embedded ID3 cover,
 * `readCover`) / `VideoTile` (artwork = the poster; the media element is hidden
 * — the tile never shows a decoded video frame). Timeline + volume belong to
 * the OVERLAY / Quick Look — `AudioPreview` (play/pause · Slider seek with an
 * m:ss readout · volume behind `slider-01`, a vertical `slider-black` range in
 * a PopoverPanel, placement top; no title line — the name sits in the facts)
 * and `VideoSheet` (the QuickTime bar).
 *
 * @param {string}   src         the media URL
 * @param {string}   poster      VideoTile — the poster URL
 * @param {Function} onDuration  AudioPreview — (seconds) => void once metadata lands
 * @param {string}   className   AudioPreview — wrapper classes (the width is the consumer's)
 */
export const formatLength = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
const fmt = formatLength;

function useCover(src) {
  const [cover, setCover] = useState(null);
  useEffect(() => {
    let live = true;
    readCover(src).then((url) => { if (live) setCover(url); });
    return () => { live = false; };
  }, [src]);
  return cover;
}

/* One disc for both tiles — the ruled Finder play/pause. The theme's
 * `.kol-play-disc` paints it after the IconFrame variants, so nothing is restated here. */
function PlayDisc({ playing, onClick }) {
  return (
    <IconFrame name={playing ? 'pause' : 'play'} variant="secondary" size="lg" radius="full" onClick={onClick} aria-label={playing ? 'Pause' : 'Play'} className="relative kol-play-disc" />
  );
}

export function AudioTile({ src }) {
  const ref = useRef(null);
  const [playing, setPlaying] = useState(false);
  const cover = useCover(src);
  return (
    <div className="kol-media-tile relative w-full aspect-square rounded overflow-hidden flex items-center justify-center">
      <audio ref={ref} src={src} preload="metadata" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)} />
      {cover && <img src={cover} alt="" className="absolute inset-0 w-full h-full object-cover" />}
      <PlayDisc playing={playing} onClick={() => (playing ? ref.current.pause() : ref.current.play())} />
    </div>
  );
}

export function VideoTile({ src, poster }) {
  const ref = useRef(null);
  const [playing, setPlaying] = useState(false);
  return (
    <div className="kol-media-tile relative w-full aspect-square rounded overflow-hidden flex items-center justify-center">
      {/* Same as audio: the media element is hidden, the artwork (the poster) is the tile. */}
      <video ref={ref} src={src} playsInline preload="metadata" className={poster ? 'hidden' : 'absolute inset-0 w-full h-full object-cover'} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)} />
      {poster && <img src={poster} alt="" className="absolute inset-0 w-full h-full object-cover" />}
      <PlayDisc playing={playing} onClick={() => (playing ? ref.current.pause() : ref.current.play())} />
    </div>
  );
}

function useAudio(onDuration) {
  const ref = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const toggle = () => (playing ? ref.current.pause() : ref.current.play());
  const element = (src) => (
    <audio
      ref={ref}
      src={src}
      preload="metadata"
      onPlay={() => setPlaying(true)}
      onPause={() => setPlaying(false)}
      onEnded={() => setPlaying(false)}
      onTimeUpdate={(e) => setTime(e.target.currentTime)}
      onLoadedMetadata={(e) => { setDuration(e.target.duration); onDuration?.(e.target.duration); }}
    />
  );
  return { ref, playing, time, duration, toggle, element, setTime };
}

export default function AudioPreview({ src, className = '', onDuration }) {
  const { ref, playing, time, duration, toggle, element, setTime } = useAudio(onDuration);
  const [volume, setVolume] = useState(100);
  const [open, setOpen] = useState(false);
  const pop = usePopover({ open, onOpenChange: setOpen, placement: 'top' });

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {element(src)}
      <IconFrame name={playing ? 'pause' : 'play'} variant="ghost" size="sm" onClick={toggle} />
      <Slider
        className="flex-1"
        min={0}
        max={duration || 0}
        step={0.1}
        value={time}
        onChange={(v) => { ref.current.currentTime = v; setTime(v); }}
        formatValue={fmt}
        displayWidth={5}
      />
      <span ref={pop.refs.setReference} {...pop.getReferenceProps()} className="inline-flex">
        <IconFrame name="slider-01" variant={open ? 'secondary' : 'ghost'} size="sm" onClick={() => {}} />
      </span>
      <PopoverPanel popover={pop} className="p-2">
        {/* DS track class on a native range, turned upright: the one thing the DS Slider can't do. */}
        <div className="w-6 h-24 flex items-center justify-center">
          <input
            type="range"
            min={0}
            max={100}
            value={volume}
            onChange={(e) => { const v = Number(e.target.value); ref.current.volume = v / 100; setVolume(v); }}
            className="slider-black cursor-pointer w-24 -rotate-90"
            aria-label="Volume"
          />
        </div>
      </PopoverPanel>
    </div>
  );
}
