import { useState } from 'react'
import { DocHeader, DocSection, usePageMeta } from '@kolkrabbi/kol-workshop'
import { Button, Kbd, ShellSearchOverlay } from '@kolkrabbi/kol-component'
import { Icon } from '@kolkrabbi/kol-icons'

/* Round 5 — the ⌘K search modal aimed at shadcn's (2026-09-30): an inset field, suggestions on an
 * empty query, group headings, tile rows, a footer that always says what Enter does, a body
 * that holds its height. The live ⌘K in this shell wears the same build. */
export const meta = {
  round: 5,
  date: '2026-09-30',
  title: 'Search modal — shadcn aim',
  status: 'answered',
}

/* lucide's drawings (ISC), inlined for the side-by-side only */
const LUCIDE = {
  'corner-down-left': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 4v7a4 4 0 0 1-4 4H4"/><path d="m9 10-5 5 5 5"/></svg>',
  command: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3"/></svg>',
}

function GlyphPair({ name }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded border border-fg-08 p-3">
      <div className="flex items-end gap-6">
        <span className="inline-flex flex-col items-center gap-1"><Icon name={name} size={32} /><span className="kol-mono-12 text-subtle">kol</span></span>
        <span className="inline-flex flex-col items-center gap-1"><span className="inline-flex h-8 w-8 [&>svg]:h-8 [&>svg]:w-8" dangerouslySetInnerHTML={{ __html: LUCIDE[name] }} /><span className="kol-mono-12 text-subtle">lucide</span></span>
      </div>
      <span className="kol-mono-12 text-subtle">{name}</span>
    </div>
  )
}

const SUGGESTIONS = ['Components', 'Blocks', 'Cards', 'Sets', 'Styles', 'Docs', 'Apps', 'Development']
  .map((label) => ({ id: label, label, icon: 'arrow-right', group: 'Spaces' }))

const INDEX = [
  { id: 'button', label: 'Button', group: 'Atoms' },
  { id: 'button-group', label: 'ButtonGroup', group: 'Molecules' },
  { id: 'input', label: 'Input', group: 'Atoms' },
  { id: 'search-input', label: 'SearchInput', group: 'Molecules' },
  { id: 'sizes', label: 'Sizes', group: 'Documentation', hint: 'one height per size — 22 · 26 · 32 · 40' },
]

export default function OpenQuestionsRound5() {
  usePageMeta({ tags: [], related: [] })
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const results = query ? INDEX.filter((i) => i.label.toLowerCase().includes(query.toLowerCase())) : []
  return (
    <div className="flex flex-col gap-10 pb-24">
      <DocHeader
        eyebrow="Open questions · Round 5 · 2026-09-30"
        title="Search modal — shadcn aim"
        lede="Open it empty, then type “button”. Same build as ⌘K in this shell."
      />
      <DocSection id="search-modal" title="Search modal">
        <div>
          <Button onClick={() => setOpen(true)}>Open search modal</Button>
        </div>
        <ShellSearchOverlay
          open={open}
          onClose={() => { setOpen(false); setQuery('') }}
          query={query}
          onQueryChange={setQuery}
          results={results}
          suggestions={SUGGESTIONS}
          enterLabel={`All results for “${query.trim()}”`}
          onSelect={() => {}}
        />
        <p className="kol-doc-body">Keep, or name what to change — field, headings, row height, footer, body height.</p>
      </DocSection>
      <DocSection id="glyphs" title="Key-cap glyphs">
        <div className="flex flex-wrap gap-4">
          <GlyphPair name="corner-down-left" />
          <GlyphPair name="command" />
        </div>
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-2 kol-helper-12 text-fg-48"><Kbd icon="corner-down-left" />Go to page</span>
          <Kbd size="sm" icon="command">K</Kbd>
        </div>
        <p className="kol-doc-body">New in kol-icon-set-interface, drawn to the set's 1.5 stroke; lucide at its own 2. Keep, or send your own.</p>
      </DocSection>
    </div>
  )
}
