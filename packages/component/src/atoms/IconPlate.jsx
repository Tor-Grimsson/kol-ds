/**
 * IconPlate — A glyph's specimen plate. The box IS the size: the ground, the keyline guide and the glyph
 * share one square, so a 20 plate is 20px and the guide's lines are the glyph's own grid (CompareGridDevTab,
 * kol-monitor 2026-10-17 — the icon gallery, the open-questions review and monitor's Dev tab each drew this
 * plate by hand, and only one of the three sized it right).
 *
 * The ground is a SPECIMEN ground, literal on purpose: a light or dark plate the app theme never touches,
 * so a glyph is judged on the same paper in either theme. The guide is the 24-unit keyline grid
 * (Material-style: dashed diagonals, the three keyline rectangles, the centre circle).
 *
 * The plate draws no glyph of its own — pass one as children, sized to the plate (`<Icon size={size} />`,
 * raw SVG markup, anything). `size="fill"` takes the parent's width and stays square.
 *
 * @param {number|'fill'} [size=24]       the plate's edge in px, or 'fill'
 * @param {'light'|'dark'} [ground='light']
 * @param {boolean} [guide=false]          the keyline grid behind the glyph
 */
export default function IconPlate({ size = 24, ground = 'light', guide = false, className = '', style, children, ...rest }) {
  const light = ground !== 'dark'
  const box = size === 'fill' ? { width: '100%', aspectRatio: '1 / 1' } : { width: size, height: size }
  return (
    <span
      {...rest}
      className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden ${className}`.trim()}
      style={{ ...box, background: light ? '#FFFFFF' : '#0E0E11', color: light ? '#0E0E11' : '#FFFFFF', ...style }}
    >
      {guide && <KeylineGuide light={light} />}
      {children}
    </span>
  )
}

/**
 * KeylineGuide — The 24-unit keyline grid. Fills its positioned parent; diagonals in teal, keylines in
 * magenta on a light ground and yellow on a dark one.
 *
 * @param {boolean} [light=true] which ground it is drawn on
 */
export function KeylineGuide({ light = true }) {
  const key = light ? '#CA3ABC' : '#F2D24B'
  return (
    <svg aria-hidden="true" width="100%" height="100%" viewBox="0 0 24 24" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      <g stroke="#0A8DA4" strokeWidth="0.1" strokeDasharray="0.4 0.6" fill="none">
        <path d="M0 0 L24 24" />
        <path d="M24 0 L0 24" />
      </g>
      <g stroke={key} strokeWidth="0.1" strokeDasharray="0.4 0.6" fill="none">
        <rect x="4" y="2" width="16" height="20" rx="1" />
        <rect x="3" y="3" width="18" height="18" rx="1" />
        <rect x="2" y="4" width="20" height="16" rx="1" />
        <circle cx="12" cy="12" r="4" />
      </g>
    </svg>
  )
}
