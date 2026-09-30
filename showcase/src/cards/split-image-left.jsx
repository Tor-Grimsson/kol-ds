import { Button, SectionSplit } from '@kolkrabbi/kol-component'
import { heroBg, photo, splitFill, gradient } from '../lib/card-media.js'

export const meta = {
  title: 'Image left, text right',
  description: 'The media first, the text beside it',
  category: 'split',
  type: 'reference',
  status: 'active',
  updated: '2026-09-30',
  tags: ['domain/design-system', 'pattern/website-cards'],
}
export const stage = 'full'

export default function SplitImageLeft() {
  return (
    <SectionSplit
      align="left"
      label="THE FLEET"
      headline={<>Built to hold <em>course</em></>}
      body="An editorial pull: label, display headline and lede beside a cover-fit visual."
      actions={<><Button>Explore the fleet</Button><Button variant="secondary">Read the log</Button></>}
      media={<div className="absolute inset-0" style={splitFill} />}
      caption="FIG 01 — HARBOUR, REYKJAVÍK"
    />
  )
}
