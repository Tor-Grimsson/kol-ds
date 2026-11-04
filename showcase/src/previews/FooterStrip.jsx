import { FooterStrip } from '@kolkrabbi/kol-shell'

/* counts at the start, meta at the end (the gap map's row 139) */
export const stage = 'full'

export default function FooterStripPreview() {
  return <FooterStrip start="5 open tasks" end={['Briefs', 'Todos', 'Other']} />
}
