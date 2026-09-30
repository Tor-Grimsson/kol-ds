import { SectionHero } from '@kolkrabbi/kol-component'
import { heroBg, photo, splitFill, gradient } from '../lib/card-media.js'

export const meta = {
  title: 'Foot hero',
  description: 'Content pinned to the foot under a veil, with a card across the fold',
  category: 'hero',
  type: 'reference',
  status: 'active',
  updated: '2026-09-30',
  tags: ['domain/design-system', 'pattern/website-cards'],
}
export const stage = 'full'

export default function HeroEnd() {
  return (
    <SectionHero
      media={{ src: heroBg, kind: 'image', alt: '' }}
      height="80"
      veil
      justify="end"
      align="start"
      headline="Pinned to the foot"
      body="The veil under the text, and a node across the fold."
      foot={<div className="max-w-[var(--kol-content-measure)] rounded-[var(--kol-radius-sm)] border border-fg-08 bg-surface-primary p-6 kol-mono-12 text-body">The foot slot — pulled up by overlap.</div>}
    />
  )
}
