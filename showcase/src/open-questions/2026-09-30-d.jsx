import { DocHeader, DocSection, usePageMeta } from '@kolkrabbi/kol-workshop'
import { Icon } from '@kolkrabbi/kol-icons'

/* Round 4 — the ten align / rotate / flip glyphs, redrawn (editor-chrome-review #14, 2026-09-30).
 * The agent redrew them while the user slept; the OLD drawings are inlined below so the two read
 * side by side at the size the inspector uses (16) and at 32. The old files are also kept at
 * `_tmp/2026-09-30-glyph-redraw-before/`. */
export const meta = {
  round: 4,
  date: '2026-09-30',
  title: 'Align, rotate, flip — redrawn',
  status: 'answered',
}

const NAMES = ["align-horizontal-left", "align-horizontal-center", "align-horizontal-right", "align-vertical-top", "align-vertical-center", "align-vertical-bottom", "rotate-left", "rotate-right", "flip-horizontal", "flip-vertical"]
const OLD = {
  "align-horizontal-left": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" width=\"24\" height=\"24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"6\" y=\"5\" width=\"13.5\" height=\"4.5\" rx=\"1\" /><rect x=\"6\" y=\"14.5\" width=\"9\" height=\"4.5\" rx=\"1\" /><path d=\"M4 3 V21\" /></svg>",
  "align-horizontal-center": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" width=\"24\" height=\"24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"6\" y=\"5\" width=\"12\" height=\"4.5\" rx=\"1\" /><rect x=\"9\" y=\"14.5\" width=\"6\" height=\"4.5\" rx=\"1\" /><path d=\"M12 3 V21\" stroke-dasharray=\"2 1.5\" /></svg>",
  "align-horizontal-right": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" width=\"24\" height=\"24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"4.5\" y=\"5\" width=\"13.5\" height=\"4.5\" rx=\"1\" /><rect x=\"9\" y=\"14.5\" width=\"9\" height=\"4.5\" rx=\"1\" /><path d=\"M20 3 V21\" /></svg>",
  "align-vertical-top": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" width=\"24\" height=\"24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"5\" y=\"6\" width=\"4.5\" height=\"13.5\" rx=\"1\" /><rect x=\"14.5\" y=\"6\" width=\"4.5\" height=\"9\" rx=\"1\" /><path d=\"M3 4 H21\" /></svg>",
  "align-vertical-center": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" width=\"24\" height=\"24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"5\" y=\"5\" width=\"4.5\" height=\"14\" rx=\"1\" /><rect x=\"14.5\" y=\"7.5\" width=\"4.5\" height=\"9\" rx=\"1\" /><path d=\"M3 12 H21\" stroke-dasharray=\"2 1.5\" /></svg>",
  "align-vertical-bottom": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" width=\"24\" height=\"24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"5\" y=\"4.5\" width=\"4.5\" height=\"13.5\" rx=\"1\" /><rect x=\"14.5\" y=\"9\" width=\"4.5\" height=\"9\" rx=\"1\" /><path d=\"M3 20 H21\" /></svg>",
  "rotate-left": "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M3.5 12a8.5 8.5 0 1 0 8.5-8.5c-2.5 0-4.8 1-6.4 2.7L3.5 8.3\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M3.5 3.5v4.8h4.8\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></svg>",
  "rotate-right": "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M20.5 12A8.5 8.5 0 1 1 12 3.5c2.5 0 4.8 1 6.4 2.7l2.1 2.1\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M20.5 3.5v4.8h-4.8\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></svg>",
  "flip-horizontal": "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M12 3.5V20.5\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-dasharray=\"0.1 4.15\"/><path d=\"M4 7.5L9.5 12L4 16.5V7.5Z\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M20 7.5L14.5 12L20 16.5V7.5Z\" fill=\"currentColor\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></svg>",
  "flip-vertical": "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M3.5 12H20.5\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-dasharray=\"0.1 4.15\"/><path d=\"M7.5 4L12 9.5L16.5 4H7.5Z\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M7.5 20L12 14.5L16.5 20H7.5Z\" fill=\"currentColor\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></svg>"
}

const cell = 'flex flex-col items-center gap-2 rounded border border-fg-08 p-3'

function Pair({ name }) {
  return (
    <div className={cell}>
      <div className="flex items-end gap-4">
        <span className="inline-flex flex-col items-center gap-1"><span className="inline-flex h-4 w-4 [&>svg]:h-4 [&>svg]:w-4" dangerouslySetInnerHTML={{ __html: OLD[name] }} /><span className="kol-mono-12 text-subtle">old</span></span>
        <span className="inline-flex flex-col items-center gap-1"><Icon name={name} size={16} /><span className="kol-mono-12 text-subtle">new</span></span>
      </div>
      <div className="flex items-end gap-4">
        <span className="inline-flex h-8 w-8 [&>svg]:h-8 [&>svg]:w-8" dangerouslySetInnerHTML={{ __html: OLD[name] }} />
        <Icon name={name} size={32} />
      </div>
      <span className="kol-mono-12 text-subtle">{name}</span>
    </div>
  )
}

export default function OpenQuestionsRound4() {
  usePageMeta({ tags: [], related: [] })
  return (
    <div className="flex flex-col gap-10 pb-24">
      <DocHeader
        eyebrow="Open questions · Round 4 · 2026-09-30"
        title="Align, rotate, flip — redrawn"
        lede="Old and new, at 16px (the inspector) and 32px. Bigger bars, a solid axis that never crosses a bar, a flip axis you can see, doubled arrowheads."
      />
      <DocSection id="glyphs" title="Glyphs">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {NAMES.map((n) => <Pair key={n} name={n} />)}
        </div>
        <p className="kol-doc-body">Keep the new drawings, or send your own — the old files are at <code>_tmp/2026-09-30-glyph-redraw-before/</code>, and reverting is copying them back.</p>
      </DocSection>
    </div>
  )
}
