import { FullBleedHero, OverlayGlassPanel, Button } from '@kolkrabbi/kol-component'

export const meta = {
  title: 'Full-bleed hero',
  description: 'A landing hero: a frosted glass panel with eyebrow, title, lede and two actions over full-bleed cover media',
  category: 'hero',
  featured: true,
}
export const stage = 'full'

/* Real full-bleed cover from the KOL image library (the ASCII radar graphic,
 * served at /kol-images). */
const COVER = '/kol-images/radar-ascii.png'

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
