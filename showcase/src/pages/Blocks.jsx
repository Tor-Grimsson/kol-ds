import DocLayout from '../lib/DocLayout.jsx'
import DocHeader, { DocSection } from '../lib/DocHeader.jsx'
import PreviewCard from '../lib/PreviewCard.jsx'
import { BLOCKS } from '../lib/blocks-registry.js'

/**
 * Blocks — composed KOL sections (shadcn model: between components and full
 * pages). Each block is a one-file composition: rendered live + its own
 * source in the Code tab.
 */

export default function Blocks() {
  const toc = BLOCKS.map((b) => ({ id: b.key, label: b.title }))
  return (
    <DocLayout wide toc={toc}>
      <DocHeader
        eyebrow="KOL · Blocks"
        title="Blocks"
        lede="Composed sections built from the published packages — bigger than a component, smaller than a page. Copy the source, keep the wiring."
      />
      {BLOCKS.map((b) => (
        <DocSection key={b.key} id={b.key} title={b.title} lede={b.description}>
          <PreviewCard entry={b} minH="min-h-[16rem]" />
        </DocSection>
      ))}
    </DocLayout>
  )
}
