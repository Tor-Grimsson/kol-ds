import { FeaturedCarousel } from '@kolkrabbi/kol-component'

// Inline SVG stand-ins — no network, render anywhere.
const bg = (base, ring) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900"><rect width="1600" height="900" fill="${base}"/><circle cx="1150" cy="330" r="360" fill="none" stroke="${ring}" stroke-width="2"/><circle cx="1150" cy="330" r="220" fill="none" stroke="${ring}" stroke-width="2"/><line x1="0" y1="640" x2="1600" y2="640" stroke="${ring}" stroke-width="1"/></svg>`,
  )}`

const IMG_ITEMS = [
  {
    media: { src: bg('#1d1d21', '#6b6b74'), kind: 'image', alt: '' },
    title: 'Northern Signals',
    description: 'Image background, frosted glass panel, one CTA.',
    href: '#one',
    ctaLabel: 'Read more',
  },
  {
    media: { src: bg('#20242b', '#5a7a86'), kind: 'image', alt: '' },
    title: 'Cold Harbour',
    description: 'The second wide slide, centered over its media.',
    href: '#two',
    ctaLabel: 'Read more',
  },
  {
    media: { src: bg('#241f26', '#8a6b86'), kind: 'image', alt: '' },
    title: 'Drift',
    description: 'Prev/next and drag ride the shared kol-embla core.',
    href: '#three',
    ctaLabel: 'Read more',
  },
]

export const Default = () => (
  <FeaturedCarousel items={IMG_ITEMS} sectionLabel="Featured" />
)

// Timer autoplay for image slides + the progress bar across the track top.
export const Autoplay = () => (
  <FeaturedCarousel items={IMG_ITEMS} sectionLabel="Featured" autoPlay autoPlayInterval={4000} />
)

// Video slide. The .m3u8 src is intentionally dead — hls.js errors quietly and
// the poster frame holds the layer (offline/failed-stream behavior). Autoplay
// is off here on purpose: video-driven auto-advance waits on the stream's
// `ended` event, which a dead src never fires.
export const VideoSlide = () => (
  <FeaturedCarousel
    sectionLabel="Featured"
    items={[
      {
        media: {
          src: 'https://example.invalid/hls/master.m3u8',
          kind: 'video',
          poster: bg('#181c22', '#4a6a76'),
        },
        title: 'Streaming Frame',
        description: 'HLS video background via the HlsVideo atom; poster holds when the stream is unavailable.',
        href: '#video',
        ctaLabel: 'Watch',
      },
      ...IMG_ITEMS,
    ]}
  />
)

export const NoHeader = () => (
  <FeaturedCarousel items={IMG_ITEMS} showHeader={false} />
)

// renderTitle seam replaces the default title (foundry size-ramp / typeface
// coupling was dropped — the call site owns bespoke title rendering).
export const CustomTitle = () => (
  <FeaturedCarousel
    items={IMG_ITEMS}
    sectionLabel="Specimens"
    renderTitle={(item) => (
      <span className="kol-sans-display-02 text-emphasis block leading-none tracking-tight">
        {item.title}
      </span>
    )}
  />
)
