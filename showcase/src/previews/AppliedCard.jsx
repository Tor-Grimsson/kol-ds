import { AppliedCard, DEFAULT_COMBO_LAB } from '@kolkrabbi/kol-styleguide'
import { WORDMARK } from '../demo-data/wordmark.jsx'

export const stage = 'lg'

/* One combo layout on the default palette, the KOL wordmark in its logo slot. */
export default function AppliedCardPreview() {
  return <AppliedCard palette={DEFAULT_COMBO_LAB} logo={WORDMARK} />
}
