import { FullBleedHero, OverlayGlassPanel, Button } from '@kolkrabbi/kol-component'

export const meta = {
  title: 'Full-bleed hero',
  description: 'A landing hero: a frosted glass panel with eyebrow, title, lede and two actions over full-bleed cover media',
  category: 'hero',
  featured: true,
}
export const stage = 'full'

/* Inline cover art — a data-URI SVG so the block ships with zero network. */
const COVER = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#0E0E11"/>
        <stop offset="0.55" stop-color="#241a17"/>
        <stop offset="1" stop-color="#AD5038"/>
      </linearGradient>
      <radialGradient id="glow" cx="0.72" cy="0.28" r="0.85">
        <stop offset="0" stop-color="#F5C9B4" stop-opacity="0.5"/>
        <stop offset="1" stop-color="#F5C9B4" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="1600" height="900" fill="url(#bg)"/>
    <rect width="1600" height="900" fill="url(#glow)"/>
    <g fill="none" stroke="#FAFAFA" stroke-opacity="0.10" stroke-width="1.5">
      <circle cx="1180" cy="250" r="120"/>
      <circle cx="1180" cy="250" r="220"/>
      <circle cx="1180" cy="250" r="320"/>
      <path d="M0 640 C 360 560, 620 720, 940 620 S 1420 500, 1600 580"/>
      <path d="M0 720 C 360 640, 620 800, 940 700 S 1420 580, 1600 660"/>
    </g>
    <g fill="#FAFAFA" fill-opacity="0.08">
      <rect x="120" y="120" width="64" height="64" rx="6"/>
      <rect x="120" y="200" width="64" height="64" rx="6"/>
      <rect x="200" y="120" width="64" height="64" rx="6"/>
    </g>
  </svg>`,
)}`

export default function HeroFullBleed() {
  return (
    <FullBleedHero
      height="lg"
      align="start"
      overlayOpacity={20}
      media={{ src: COVER, kind: 'image', alt: 'Abstract studio cover artwork' }}
      panel={
        <OverlayGlassPanel align="start" maxWidth="max-w-xl" gap="gap-5">
          <p className="kol-helper-16 text-fg-64">Kolkrabbi Studio · Design engineering</p>
          <h1 className="kol-sans-display-01">Build interfaces that feel inevitable.</h1>
          <p className="kol-mono-14 text-fg-64">
            A composed component library, a live showcase and a shared vocabulary — so
            every screen your team ships already speaks the same language.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button variant="primary" size="lg" href="#get-started">Start building</Button>
            <Button variant="secondary" size="lg" href="#tour">Take the tour</Button>
          </div>
        </OverlayGlassPanel>
      }
    />
  )
}
