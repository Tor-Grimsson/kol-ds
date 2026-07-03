import { HlsVideo } from '@kolkrabbi/kol-component'

export const stage = 'md'

// Live HLS playback needs a real .m3u8 stream URL and there is no reliable
// public one, so this demo renders the poster/fallback path: no `src`, no
// network — the effect early-returns and the native poster frame shows.
// Wire `src` to a stream to see actual playback.

const poster = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900"><rect width="1600" height="900" fill="#1d1d21"/><circle cx="800" cy="450" r="220" fill="none" stroke="#8a8a94" stroke-width="2"/><line x1="0" y1="450" x2="1600" y2="450" stroke="#3a3a41" stroke-width="2"/><line x1="800" y1="0" x2="800" y2="900" stroke="#3a3a41" stroke-width="2"/></svg>',
)}`

export default function HlsVideoDemo() {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded border border-fg-16">
      <HlsVideo poster={poster} className="absolute inset-0 h-full w-full object-cover" />
    </div>
  )
}
