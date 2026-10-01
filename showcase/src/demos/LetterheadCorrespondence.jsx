import { LetterheadCorrespondence } from '@kolkrabbi/kol-styleguide'
import { Asset } from '@kolkrabbi/kol-brand/svg'

export const stage = 'lg'

/* A brand-book mock wearing the KOL mark on the package's own default palette and brand info. */
export default function LetterheadCorrespondenceDemo() {
  return <LetterheadCorrespondence mark={<Asset name="kol-logomark" title="Kolkrabbi" />} signature={<Asset name="kol-logomark" title="Kolkrabbi" />} fields={[{ label: 'Date', value: '1 October 2026' }, { label: 'Ref', value: 'KOL-0012' }]} className="w-full"><p>Thank you for the visit last week. The proofs are enclosed.</p></LetterheadCorrespondence>
}
