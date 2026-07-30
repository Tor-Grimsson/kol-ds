import { useState } from 'react'
import { CodeBlock } from '@kolkrabbi/kol-component'
import DemoStage from './DemoStage.jsx'

/**
 * PreviewCard — THE Preview/Code card. One chrome, every surface.
 *
 * This existed alongside `BlockViewer`, which reimplemented the same idea and
 * diverged on seven axes: 960 vs 1574px, radius 4 vs 8, `--kol-oq-08` vs
 * `border-fg-12`, authored `Preview`/`Code` vs lowercase strings CSS-capitalised,
 * `CodeBlock` vs a bespoke `<pre>`, and a toolbar the other didn't have. Two
 * cards, two answers to every question. They are now one component: this file
 * owns the frame, the seam, the radius, the tab bar and the code tab, and the
 * BODY is pluggable — a live demo here, a device-resizable iframe in blocks.
 *
 * The width cap is a PROP, not a fork. Component pages cap at `panel`; blocks
 * and sets cap at `shell`, because page-level compositions are shell-wide by
 * nature — the distinction this file's old comment already drew ("truly
 * shell-wide apparatus lives in Blocks/Sets, not on component pages"). Both
 * read the same scale; neither improvises a pixel value.
 *
 * min-h floor is 10rem: the old 20rem stage read as a void around one-row demos.
 */
const TABS = [
  { key: 'preview', label: 'Preview' },
  { key: 'code', label: 'Code' },
]

const CAPS = {
  panel: 'max-w-[var(--kol-content-panel)]',
  shell: 'max-w-[var(--kol-content-shell)]',
}

/** Vertical hairline between toolbar groups. */
export const ToolbarDivider = () => (
  <span className="mx-1 h-4 w-px shrink-0" style={{ backgroundColor: 'var(--kol-oq-08)' }} aria-hidden="true" />
)

export default function PreviewCard({
  entry,
  minH = 'min-h-[10rem]',
  cap = 'panel',
  /** toolbar caption, right of the tabs (blocks use the entry description) */
  description,
  /** right-aligned toolbar controls; receives the active tab so preview-only
   *  controls can hide on Code without a second toolbar */
  actions,
  /** replaces the centred demo canvas — blocks pass their iframe stage. Kept
   *  mounted across tab flips so the frame never reboots on a Code→Preview
   *  round trip (remounting it was the original slow-switch bug). */
  renderBody,
  children,
}) {
  const [tab, setTab] = useState('preview')

  return (
    <div className={`kol-doc-figure ${CAPS[cap] ?? CAPS.panel}`}>
      {/* seam law: opaque oq-08 (fg alpha brightens over tinted fills; 08 = the table wrapper's weight) */}
      <div className="flex items-center gap-2 border-b px-3 py-2" style={{ borderBottomColor: 'var(--kol-oq-08)' }}>
        <div className="flex items-center gap-1">
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
        {description && (
          <>
            <ToolbarDivider />
            <span className="kol-mono-12 min-w-0 truncate text-meta">{description}</span>
          </>
        )}
        {actions && <div className="ml-auto flex items-center gap-1">{actions(tab)}</div>}
      </div>

      {renderBody ? (
        /* hidden, not unmounted — see renderBody above */
        <div className={tab === 'preview' ? 'block' : 'hidden'}>{renderBody()}</div>
      ) : (
        tab === 'preview' && (
          <div className={`flex ${minH} items-center justify-center bg-fg-02 p-10`}>
            {entry?.Component ? (
              <DemoStage entry={entry} />
            ) : children || (
              <span className="kol-mono-12 text-meta">no live preview — see usage below</span>
            )}
          </div>
        )
      )}

      {tab === 'code' && (
        /* bare — the figure IS the frame; the block's own surface + padding
         * run edge-to-edge below the tab bar. ONE code idiom (user ruling
         * 2026-07-30): blocks used to render a hand-rolled <pre> here. */
        <CodeBlock bare code={entry?.source || '// no source'} language="jsx" />
      )}
    </div>
  )
}
