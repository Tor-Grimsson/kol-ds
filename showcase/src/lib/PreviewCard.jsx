import { useState } from 'react'
import DemoStage from './DemoStage.jsx'

/**
 * PreviewCard — the standard Preview/Code card. Canvas is always the same
 * (centred, bg-fg-02, min-h); the demo's `stage` preset governs its width.
 * Code tab shows the demo file's own ?raw source. Used by component pages
 * and blocks — one card, everywhere.
 */
export default function PreviewCard({ entry, minH = 'min-h-[20rem]' }) {
  const [tab, setTab] = useState('preview')
  return (
    <div className="overflow-hidden rounded-[var(--kol-radius-md)] border border-fg-12">
      <div className="flex items-center gap-1 border-b border-fg-12 px-3 py-2">
        {['preview', 'code'].map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`kol-mono-12 rounded-[var(--kol-radius-sm)] px-3 py-1 capitalize transition-colors ${tab === t ? 'bg-fg-08 text-emphasis' : 'text-meta hover:text-emphasis'}`}
          >
            {t}
          </button>
        ))}
      </div>
      {tab === 'preview' ? (
        <div className={`flex ${minH} items-center justify-center bg-fg-02 p-10`}>
          {entry?.Component ? (
            <DemoStage entry={entry} />
          ) : (
            <span className="kol-mono-12 text-meta">no live preview — see usage below</span>
          )}
        </div>
      ) : (
        <pre className="kol-mono-12 overflow-x-auto whitespace-pre-wrap bg-fg-04 px-4 py-3 text-fg">
          {entry?.source || '// no source'}
        </pre>
      )}
    </div>
  )
}
