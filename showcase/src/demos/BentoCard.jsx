import { BentoCard } from '@kolkrabbi/kol-component'

export const stage = 'lg'

const photo = (a, b) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="600" height="400" fill="url(#g)"/><circle cx="300" cy="200" r="120" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="1.5"/></svg>`,
  )}`

/* Hover a card (fine pointer): the scrim + subtitle + description + CTA fade in
 * over the always-visible title, and the card tilts toward the pointer on
 * shared `useTilt` springs. Coarse-pointer or reduced-motion visitors get the
 * same cards, static and fully revealed. The last cell has no `src`, so it
 * falls back to AssetPlaceholder. */
export default function BentoCardDemo() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-[820px]">
      <BentoCard
        className="h-72"
        src={photo('#3a2f6b', '#12101f')}
        title="Northern Signal"
        subtitle="Field recording"
        description="A generative score driven by aurora telemetry, rendered as a slow-moving light field."
        href="/work/northern-signal"
        buttonLabel="View project"
        onNavigate={(e) => {
          e.preventDefault()
          console.log('SPA navigate →', e.currentTarget.getAttribute('href'))
        }}
      />
      <BentoCard
        className="h-72"
        src={photo('#0f3d3a', '#0a1512')}
        title="Tidal Index"
        subtitle="Data print"
        description="Ten years of harbour tide levels folded into a single riso-style plate."
        href="https://example.com"
        buttonLabel="Open"
      />
      <BentoCard
        className="h-72"
        src={photo('#5a2130', '#160a0e')}
        title="Ember Studies"
        subtitle="Motion"
        description="Loop tests for a title sequence — hover to read the notes."
        overlayOpacity={72}
      />
      <BentoCard className="h-72" title="Untitled" subtitle="Coming soon" enableTilt={false} />
    </div>
  )
}
