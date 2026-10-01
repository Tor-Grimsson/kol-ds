import { DocSection } from '@kolkrabbi/kol-workshop'

export const stage = 'lg'

/* An anchored section: the rule, the heading, an optional lede, then its content. */
export default function DocSectionDemo() {
  return (
    <DocSection title="Usage" lede="Import it from the package and pass a label.">
      <p className="kol-doc-body">The section's content goes here.</p>
    </DocSection>
  )
}
