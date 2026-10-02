import { Letterhead } from '@kolkrabbi/kol-styleguide'
import { Asset } from '@kolkrabbi/kol-brand/svg'

export const stage = 'lg'

/* A brand-book mock wearing the KOL mark on the package's own default palette and brand info. */
export default function LetterheadPreview() {
  return <Letterhead mark={<Asset name="kol-logomark" title="Kolkrabbi" />} className="w-full"><p>Thank you for the visit last week. The proofs are enclosed.</p></Letterhead>
}
