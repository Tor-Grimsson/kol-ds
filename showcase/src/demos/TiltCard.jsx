import { TiltCard } from '@kolkrabbi/kol-component'

export const stage = 'md'

const art = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 300"><rect width="500" height="300" fill="#1d1d21"/><circle cx="250" cy="150" r="90" fill="none" stroke="#8a8a94" stroke-width="1.5"/><line x1="0" y1="150" x2="500" y2="150" stroke="#3a3a41" stroke-width="1"/></svg>',
)}`

/* Hover the cards: `default` free-tilts toward the pointer; `grounded`
 * snaps to quantized zones, lags on a lazy spring, and only tilts back,
 * pivoting about its bottom edge. Coarse pointers and reduced-motion
 * users get the same cards, static. */
export default function TiltCardDemo() {
  return (
    <div className="flex flex-wrap gap-6">
      <TiltCard src={art} alt="Placeholder artwork" className="w-64 h-40 rounded-lg">
        <span className="absolute bottom-3 left-3 kol-mono-12" style={{ color: '#8a8a94' }}>
          default
        </span>
      </TiltCard>
      <TiltCard src={art} alt="Placeholder artwork" className="w-64 h-40 rounded-lg" variant="grounded">
        <span className="absolute bottom-3 left-3 kol-mono-12" style={{ color: '#8a8a94' }}>
          grounded
        </span>
      </TiltCard>
    </div>
  )
}
