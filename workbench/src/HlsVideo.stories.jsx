import { HlsVideo } from '@kolkrabbi/kol-component'

// No reliable public HLS stream — stories exercise the poster/fallback path
// (no `src`, no network). Set `src` to a real .m3u8 URL to see playback.

const poster = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900"><rect width="1600" height="900" fill="#1d1d21"/><circle cx="800" cy="450" r="220" fill="none" stroke="#8a8a94" stroke-width="2"/><line x1="0" y1="450" x2="1600" y2="450" stroke="#3a3a41" stroke-width="2"/></svg>',
)}`

export const PosterFallback = () => (
  <div className="relative aspect-video w-[520px] overflow-hidden rounded border border-fg-16">
    <HlsVideo poster={poster} className="absolute inset-0 h-full w-full object-cover" />
  </div>
)

export const BackgroundFill = () => (
  <div className="relative h-64 w-[520px] overflow-hidden rounded border border-fg-16">
    <HlsVideo poster={poster} className="absolute inset-0 h-full w-full object-cover" />
    <p className="kol-mono-12 text-fg-48 absolute bottom-3 left-3">content sits above the inert video layer</p>
  </div>
)
