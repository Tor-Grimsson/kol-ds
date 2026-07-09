const LegendRow = ({ legends = [], wrap = false }) => {
  if (legends.length === 0) return null

  return (
    <div className={`flex items-center gap-3 ${wrap ? 'flex-wrap' : ''}`.trim()}>
      {legends.map((legend, idx) => (
        <div key={idx} className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full shrink-0"
            style={{ backgroundColor: legend.color || (idx === 0 ? 'var(--kol-palette-yellow)' : 'var(--kol-palette-purple)') }}
            aria-hidden="true"
          />
          <div className="flex flex-col">
            <span className="dash-caption text-fg-88">{legend.label}</span>
            {legend.detail && (
              <span className="dash-detail text-fg-64">{legend.detail}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default LegendRow
