import { WIRE_COLORS } from '../../../mixer/src/components/hall-of-mirrors/wireColors.js'

/* a saved patch's cover — its channels as wires into the master (lifted from the retired LibraryPage, 2026-10-23) */
export function PatchThumb({ patch }) {
  const chans = (patch.data?.channels || []).filter((c) => c.variantId)
  const inputs = patch.data?.master?.inputs || []
  return (
    <svg viewBox="0 0 100 40" preserveAspectRatio="none" style={{ width: '100%', height: '100%', display: 'block' }}>
      {chans.map((c, i) => {
        const y = 8 + i * 10
        const patched = inputs.includes(i)
        return (
          <g key={i} opacity={patched ? 1 : 0.3}>
            <line x1="6" y1={y} x2="70" y2={y} stroke={WIRE_COLORS[i % WIRE_COLORS.length]} strokeWidth="2" vectorEffect="non-scaling-stroke" />
            <circle cx="6" cy={y} r="2.5" fill={WIRE_COLORS[i % WIRE_COLORS.length]} />
            {patched && <line x1="70" y1={y} x2="86" y2="20" stroke={WIRE_COLORS[i % WIRE_COLORS.length]} strokeWidth="1" opacity="0.6" vectorEffect="non-scaling-stroke" />}
          </g>
        )
      })}
      <rect x="86" y="12" width="8" height="16" fill="none" stroke="currentColor" strokeWidth="1" className="text-fg-32" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}
