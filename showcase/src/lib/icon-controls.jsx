/**
 * icon-controls — the shared gallery chrome for the /icons page: the SegGroup
 * BG · SIZE · GRID toggles and the KeylineBg keyline overlay (Material-style
 * paint-by-numbers: dashed diagonals + three keyline rounded-rects + center
 * circle on the 24×24 grid — yellow on dark, magenta on light). Ported
 * verbatim from the brand app (apps/brand/src/pages/Icons.jsx); restored
 * 2026-07-28 after the legacy-gallery cleanup deleted it while the v1 page
 * still consumed it.
 */
import { KeylineGuide } from '@kolkrabbi/kol-component'

/* the guide is the DS's now (kol-component `KeylineGuide`, 2026-10-17) — this name stays for the
 * pages that import it */
export const KeylineBg = ({ bgLight }) => <KeylineGuide light={bgLight} />

const SegBtn = ({ active, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    className={`kol-helper-12 px-2 py-1 rounded-sm ${active ? 'bg-fg-04 text-fg-96' : 'text-fg-48 hover:text-fg-80'}`}
    style={{
      border: 'none',
      cursor: 'pointer',
    }}
  >{children}</button>
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
