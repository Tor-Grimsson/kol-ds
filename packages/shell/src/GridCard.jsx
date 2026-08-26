/**
 * GridCard — A4-ratio card for catalog grids (monitor's full cut: expanded
 * 2×2 mode + previewFit). Preview clipped on top, label plate at bottom;
 * `variant="list"` renders the compact 36px row.
 *
 * Recreated from both repos with the shipped divergences fixed:
 * - the label plate's hardcoded `borderTop: rgba(255,255,255,0.06)` (a live
 *   light-theme bug in both apps) → `border-t border-fg-04`
 * - monitor's `textTransform: capitalize` on the list detail dropped (no
 *   auto-casing law — author the string in the case it should render)
 *
 * Preview fits: `.kol-shell-card-preview--{natural|compact|cover}` in
 * kol-theme. Grid geometry law (documented default, both source repos):
 * grid = `repeat(6, 1fr)` gap 24 · list = `repeat(4, 1fr)` gap 8.
 * Neighbour-hiding for `expanded` stays consumer-side.
 */
export default function GridCard({ title, detail, preview, expanded, expandedContent, onClick, variant, action, previewFit = 'natural' }) {
  if (variant === 'list') {
    return (
      <div
        onClick={onClick}
        className="flex items-center justify-between px-3 cursor-pointer bg-surface-tertiary hover:bg-fg-04 rounded border border-fg-04 transition-colors select-none"
        style={{ height: 36 }}
      >
        <span className="kol-helper-12 text-fg-64">{title}</span>
        {action || (detail && <span className="kol-helper-10 text-fg-32">{detail}</span>)}
      </div>
    )
  }

  return (
    <div
      onClick={onClick}
      className="bg-fg-04 hover:bg-surface-tertiary border border-fg-04"
      style={{
        borderRadius: 4, cursor: 'pointer',
        aspectRatio: expanded ? undefined : '1 / 1.41421',
        gridColumn: expanded ? 'span 2' : 'span 1',
        gridRow: expanded ? 'span 2' : 'span 1',
        position: 'relative', overflow: 'hidden',
        display: 'flex', flexDirection: expanded ? 'row-reverse' : 'column',
        transition: 'all 300ms var(--kol-ease-house)',
      }}
    >
      <div style={{
        overflow: 'hidden',
        position: 'relative',
        flex: expanded ? '0 0 50%' : 1,
        minHeight: 0,
        minWidth: 0,
      }}>
        <div className={`kol-shell-card-preview kol-shell-card-preview--${previewFit}`} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
          {preview}
        </div>
      </div>

      {expanded ? (
        <div style={{ flex: 1, padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', overflow: 'auto' }}>
          {expandedContent}
        </div>
      ) : (
        <div className="bg-surface-primary border-t border-fg-04" style={{ padding: '12px 16px', width: '100%' }}>
          <div className="text-fg-96 kol-helper-14" style={{ marginBottom: 4 }}>{title}</div>
          {detail && <div className="text-fg-32 kol-helper-8">{detail}</div>}
        </div>
      )}
    </div>
  )
}
