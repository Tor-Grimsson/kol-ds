import { Tower, DEFAULT_PALETTE } from '@kolkrabbi/kol-styleguide'
import { WORDMARK } from '../demo-data/wordmark.jsx'

export const stage = 'lg'

/* One combo layout on the default palette, the KOL wordmark in its logo slot. */
export default function TowerPreview() {
  return <Tower palette={DEFAULT_PALETTE} logo={WORDMARK} />
}
