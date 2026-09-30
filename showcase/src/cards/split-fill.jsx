import { SectionSplit } from '@kolkrabbi/kol-component'
import { heroBg, photo, splitFill, gradient } from '../lib/card-media.js'

export const meta = {
  title: 'Full-bleed split',
  description: 'The media covers its half edge to edge, the text centred beside it',
  category: 'split',
  type: 'reference',
  status: 'active',
  updated: '2026-09-30',
  tags: ['domain/design-system', 'pattern/website-cards'],
}
export const stage = 'full'

export default function SplitFill() {
  return (
    <SectionSplit
      align="right"
      fill
      height="full"
      label="THE FLEET"
      headline={<>Built to hold <em>course</em></>}
      body="fill releases the bounded frame — the media covers its half edge to edge."
      media={<div className="absolute inset-0" style={splitFill} />}
    />
  )
}
