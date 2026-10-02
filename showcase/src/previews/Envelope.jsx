import { Envelope } from '@kolkrabbi/kol-styleguide'
import { Asset } from '@kolkrabbi/kol-brand/svg'

export const stage = 'lg'

/* A brand-book mock wearing the KOL mark on the package's own default palette and brand info. */
export default function EnvelopePreview() {
  return <Envelope mark={<Asset name="kol-logomark" title="Kolkrabbi" />} className="w-full" />
}
