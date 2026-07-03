import { BentoCard } from '@kolkrabbi/kol-component'

const photo = (a, b) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="600" height="400" fill="url(#g)"/><circle cx="300" cy="200" r="120" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="1.5"/></svg>`,
  )}`

/* Image card: hover reveals scrim + text + CTA over the title; card tilts on
 * the shared useTilt springs. */
export const ImageCard = () => (
  <div className="w-96 h-72">
    <BentoCard
      src={photo('#3a2f6b', '#12101f')}
      title="Northern Signal"
      subtitle="Field recording"
      description="A generative score driven by aurora telemetry, rendered as a slow-moving light field."
      href="/work/northern-signal"
      buttonLabel="View project"
      onNavigate={(e) => e.preventDefault()}
    />
  </div>
)

/* External href → new-tab anchor (no onNavigate seam). */
export const ExternalCta = () => (
  <div className="w-96 h-72">
    <BentoCard
      src={photo('#0f3d3a', '#0a1512')}
      title="Tidal Index"
      subtitle="Data print"
      description="Ten years of harbour tide levels folded into a single riso-style plate."
      href="https://example.com"
      buttonLabel="Open"
    />
  </div>
)

/* No src → AssetPlaceholder fallback; tilt disabled. */
export const Placeholder = () => (
  <div className="w-96 h-72">
    <BentoCard title="Untitled" subtitle="Coming soon" enableTilt={false} />
  </div>
)

/* Heavier scrim, no CTA. */
export const OverlayHeavy = () => (
  <div className="w-96 h-72">
    <BentoCard
      src={photo('#5a2130', '#160a0e')}
      title="Ember Studies"
      subtitle="Motion"
      description="Loop tests for a title sequence — hover to read the notes."
      overlayOpacity={72}
    />
  </div>
)
