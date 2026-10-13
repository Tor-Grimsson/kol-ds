import { BackgroundVideo } from '@kolkrabbi/kol-component'

export const stage = 'md'

// A real stream — the estate's own home hero on the B2 CDN (360p · 480p · 720p · 1080p). It starts
// at the rendition the stage can show, not the manifest's first (BackgroundVideoStartsAtLowestRendition,
// 2026-10-13). The poster shows until the first frame.
const src = 'https://b2.kolkrabbi.io/website/hls-library/video-home/hero-dark/hls/master.m3u8'

const poster = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900"><rect width="1600" height="900" fill="#1d1d21"/><circle cx="800" cy="450" r="220" fill="none" stroke="#8a8a94" stroke-width="2"/><line x1="0" y1="450" x2="1600" y2="450" stroke="#3a3a41" stroke-width="2"/><line x1="800" y1="0" x2="800" y2="900" stroke="#3a3a41" stroke-width="2"/></svg>',
)}`

export default function BackgroundVideoPreview() {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded border border-fg-16">
      <BackgroundVideo src={src} poster={poster} className="absolute inset-0 h-full w-full object-cover" />
    </div>
  )
}
