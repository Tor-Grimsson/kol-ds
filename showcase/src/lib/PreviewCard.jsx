import { useState } from 'react'
import { CodeBlock } from '@kolkrabbi/kol-component'
import DemoStage from './DemoStage.jsx'

/**
 * PreviewCard — the standard Preview/Code card. Canvas is always the same
 * (centred, bg-fg-02, min-h); the demo's `stage` preset governs its width.
 * Code tab shows the demo file's own ?raw source through THE CodeBlock (one
 * code idiom, user ruling 2026-07-30). Used by component pages and blocks —
 * one card, everywhere.
 *
 * min-h floor is 10rem (2026-07-30): the old 20rem stage read as a void
 * around one-row demos; tall demos still grow past the floor naturally.
 */
const TABS = [
  { key: 'preview', label: 'Preview' },
  { key: 'code', label: 'Code' },
]

export default function PreviewCard({ entry, minH = 'min-h-[10rem]', children }) {
  const [tab, setTab] = useState('preview')
  /* ONE frame width (2026-07-30, revised same day): the figure ALWAYS caps at
   * the panel token — stage-full demos fill the panel, not the shell. The
   * stage-conditional cap made sibling pages disagree on geometry (the exact
   * inconsistency the user keeps flagging); truly shell-wide apparatus lives
   * in Blocks/Sets, not on component pages. */
  return (
    <div className="kol-doc-figure max-w-[var(--kol-content-panel)]">
      {/* seam law: opaque oq-08 (fg alpha brightens over tinted fills; 08 = the table wrapper's weight) */}
      <div className="flex items-center gap-1 border-b px-3 py-2" style={{ borderBottomColor: 'var(--kol-oq-08)' }}>
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`kol-mono-12 rounded-[var(--kol-radius-sm)] px-3 py-1 transition-colors ${tab === t.key ? 'bg-fg-08 text-emphasis' : 'text-meta hover:text-emphasis'}`}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tab === 'preview' ? (
        <div className={`flex ${minH} items-center justify-center bg-fg-02 p-10`}>
          {entry?.Component ? (
            <DemoStage entry={entry} />
          ) : children || (
            <span className="kol-mono-12 text-meta">no live preview — see usage below</span>
          )}
        </div>
      ) : (
        /* bare — the figure IS the frame; the block's own surface + padding
         * run edge-to-edge below the tab bar */
        <CodeBlock bare code={entry?.source || '// no source'} language="jsx" />
      )}
    </div>
  )
}
