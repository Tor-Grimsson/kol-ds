import { useEffect, useRef, useState } from 'react';
import IconFrame from '../atoms/IconFrame.jsx';
import { readCover } from '../utilities/id3.js';

/* taxonomy-ok: molecule — nests IconFrame (atom). */

/**
 * AudioTile · VideoTile — kol-r2b2's tiles, promoted verbatim (ColumnBrowserMediaFacts
 * 2026-08-27; re-ruled the same day, PlayDiscAndVideoBar). Finder model (user ruling
 * 2026-08-27): the COLUMN gets a square tile over full-bleed artwork with ONE control —
 * the Finder play/pause disc (`.kol-play-disc`: round, hidden at rest, shown on hover of
 * `.kol-media-tile`) — `AudioTile` (artwork = the file's embedded ID3 cover, `readCover`) /
 * `VideoTile` (artwork = the poster; the media element is hidden — the tile never shows a
 * decoded video frame). Timeline + volume belong to the player, `MediaPlayer`.
 *
 * They lived in `AudioPreview.jsx` beside a player of the same name until 2026-10-02, when
 * that player became `MediaPlayer`; this file is what was left.
 *
 * @param {string}    src       the media URL
 * @param {string}    poster    VideoTile — the poster URL
 * @param {ReactNode} fallback  AudioTile — shown when the file carries no cover art (2026-09-23:
 *                              it was an empty square, so a WAV read as a missing file)
 */
export const formatLength = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

/* the file's embedded cover, or null — shared with MediaPlayer's audio window */
export function useCover(src) {
  const [cover, setCover] = useState(null);
  useEffect(() => {
    if (!src) return undefined;
    let live = true;
    readCover(src).then((url) => { if (live) setCover(url); }).catch(() => {});
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

export function AudioTile({ src, fallback = null }) {
  const ref = useRef(null);
  const [playing, setPlaying] = useState(false);
  const cover = useCover(src);
  return (
    <div className="kol-media-tile relative w-full aspect-square rounded overflow-hidden flex items-center justify-center">
      <audio ref={ref} src={src} preload="metadata" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)} />
      {cover ? <img src={cover} alt="" className="absolute inset-0 w-full h-full object-cover" /> : fallback && <div className="absolute inset-0 flex items-center justify-center">{fallback}</div>}
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
