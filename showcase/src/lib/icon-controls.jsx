/**
 * Icon-page control primitives — ported verbatim from the brand app's
 * /icons page (apps/brand/src/pages/Icons.jsx). Kept in one place so the
 * inventory and variants pages share the exact same chrome.
 *
 * SegGroup/SegBtn is the minimal labelled segmented control (BG · SIZE ·
 * STYLE · GRID) — deliberately NOT SegmentedToggle, which is a filled pill
 * toggle for a different job. KeylineBg is the pixel-grid overlay.
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
  const stroke = bgLight ? 'rgba(0,0,0,0.10)' : 'rgba(255,255,255,0.12)'
  return (
    <svg className="absolute inset-0 h-full w-full" style={{ zIndex: 0 }} aria-hidden="true">
      <defs>
        <pattern id="kol-keyline" width="8" height="8" patternUnits="userSpaceOnUse">
          <path d="M8 0H0V8" fill="none" stroke={stroke} strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#kol-keyline)" />
    </svg>
  )
}
