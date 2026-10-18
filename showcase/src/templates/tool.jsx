/* TOOL — the tool itself, full bleed: no masthead, no page padding, the rail beside it (AppStudio's `use`:
 * monitor's rack, the editor's canvas) */
export const stage = 'full'

export default function ToolTemplate() {
  return (
    <div className="flex w-full" style={{ height: 360 }}>
      <div className="w-12 shrink-0 border-r border-fg-08 flex flex-col items-center gap-3 py-3">
        {[0, 1, 2, 3].map((i) => <span key={i} className="block w-5 h-5 rounded bg-fg-08" />)}
      </div>
      <div className="flex-1 flex items-center justify-center bg-surface-primary">
        <span className="kol-mono-12 text-meta">the tool fills this area — edge to edge</span>
      </div>
    </div>
  )
}
