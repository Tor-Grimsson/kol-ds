import DocLayout from '../lib/DocLayout.jsx'
import DocHeader, { DocSection } from '../lib/DocHeader.jsx'
import PreviewCard from '../lib/PreviewCard.jsx'
import { SETS } from '../lib/sets-registry.js'

/**
 * Sets — full-apparatus KOL compositions (chess board, metrics dashboards…):
 * an app-like thing you drop in whole, distinct from a UI /blocks composition.
 * Each set is a one-file composition: rendered live + its own source in the
 * Code tab. Add a file under ../sets/ and it appears here.
 */

export default function Sets() {
  const toc = SETS.map((s) => ({ id: s.key, label: s.title }))
  return (
    <DocLayout wide toc={toc}>
      <DocHeader
        eyebrow="KOL · Sets"
        title="Sets"
        lede="Full-apparatus compositions — a whole board, a whole dashboard — assembled from the published packages. Bigger than a block: copy the set, keep the wiring."
      />
      {SETS.map((s) => (
        <DocSection key={s.key} id={s.key} title={s.title} lede={s.description}>
          <PreviewCard entry={s} minH="min-h-[16rem]" />
        </DocSection>
      ))}
    </DocLayout>
  )
}
