import { DocHeader, DocSection, usePageMeta } from '@kolkrabbi/kol-workshop'
import { TABS, docSource, assetUrl } from 'document-fixture'
import { MarkdownPage } from '@kolkrabbi/kol-framework'

/* Round 23 — the document page's body face (plan-2026-10-28-document W4). RULED 2026-10-28: Public Sans, like the
 * reference (*"I already said Public Sans!!! like the fucking reference"*). kol-theme 0.194.0 sets `.kol-sheet`'s `--body`
 * to Public Sans and declares the face from `/fonts/public-sans/`; the round's own override and the Google Fonts link
 * are gone — both specimens now read from the theme. Kept as the record of the two faces side by side. */
export const meta = {
  round: 23,
  date: '2026-10-28',
  title: 'The document page: KOL’s sans or Public Sans for the body',
  status: 'decided',
}

const PROJECT = TABS.find((t) => t.id === 'project')

function Sheet({ face }) {
  return (
    <div data-face={face} className="relative overflow-auto rounded border border-fg-08 bg-surface-primary" style={{ height: 760 }}>
      <MarkdownPage source={docSource(PROJECT.file)} numbered linkNotes toc={false} assetUrl={(name) => assetUrl(PROJECT.file, name)} />
    </div>
  )
}

export default function OpenQuestionsRound23() {
  usePageMeta({ tags: [], related: [] })
  return (
    <div className="flex flex-col gap-10 pb-24">
      {/* B was the round's override; since the ruling A and B are one face, B's label says which the theme ships */}
      <style>{`[data-face="kol"] .kol-sheet { --body: var(--kol-font-family-sans); }`}</style>
      <DocHeader
        eyebrow="Open questions · Round 23 · 2026-10-28"
        title="The document page: KOL’s sans or Public Sans for the body"
        lede="kol-atlas's Project page through MarkdownPage (apps/document), the same markup twice. Left: the body in KOL's sans, as the sheet shipped before the ruling. Right: Public Sans, kol-atlas's setting and the theme's since 0.194.0; headings, numbers and meta lines are the same in both. Ruled 2026-10-28: Public Sans, like the reference."
      />
      <DocSection id="faces" title="The two faces">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <div className="flex flex-col gap-3">
            <p className="kol-mono-12 text-meta m-0">A · KOL’s sans (before the ruling)</p>
            <Sheet face="kol" />
          </div>
          <div className="flex flex-col gap-3">
            <p className="kol-mono-12 text-meta m-0">B · Public Sans (ruled — the theme ships this)</p>
            <Sheet face="public" />
          </div>
        </div>
      </DocSection>
    </div>
  )
}
