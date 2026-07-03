/**
 * Icon-page control primitives — ported verbatim from the brand app's
 * /icons page (apps/brand/src/pages/Icons.jsx). Kept in one place so the
 * inventory and variants pages share the exact same chrome.
 *
 * SegGroup/SegBtn is the minimal labelled segmented control (BG · SIZE ·
 * STYLE · GRID) — deliberately NOT SegmentedToggle, which is a filled pill
 * toggle for a different job. KeylineBg is the icon keyline guide (dashed
 * diagonals + keyline rects + circle on the 24×24 grid).
 */

export const SegBtn = ({ active, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    className={`kol-helper-12 px-2 py-1 rounded-sm transition-colors ${active ? 'text-fg-96' : 'text-fg-48 hover:text-fg-80'}`}
    style={{ background: active ? 'var(--kol-fg-04)' : 'transparent', border: 'none', cursor: 'pointer' }}
  >
    {children}
  </button>
)

export const SegGroup = ({ label, options, value, onChange }) => (
  <div className="flex items-center gap-2">
    <span className="kol-helper-10 text-fg-48" style={{ letterSpacing: 1 }}>{label}</span>
    <div className="flex items-center gap-1">
      {options.map((o) => (
        <SegBtn key={String(o.value)} active={value === o.value} onClick={() => onChange(o.value)}>
          {o.label}
        </SegBtn>
      ))}
    </div>
  </div>
)

export function KeylineBg({ bgLight }) {
  const diag = '#0A8DA4'
  const key  = bgLight ? '#CA3ABC' : '#F2D24B'
  return (
    <svg
      width="100%" height="100%" viewBox="0 0 24 24"
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      aria-hidden="true"
    >
      <g stroke={diag} strokeWidth="0.1" strokeDasharray="0.4 0.6" opacity="1" fill="none">
        <path d="M0 0 L24 24" />
        <path d="M24 0 L0 24" />
      </g>
      <g stroke={key} strokeWidth="0.1" strokeDasharray="0.4 0.6" opacity="1" fill="none">
        <rect x="4" y="2" width="16" height="20" rx="1" />
        <rect x="3" y="3" width="18" height="18" rx="1" />
        <rect x="2" y="4" width="20" height="16" rx="1" />
        <circle cx="12" cy="12" r="4" />
      </g>
    </svg>
  )
}
