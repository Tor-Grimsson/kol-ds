import { EmailSignature } from '@kolkrabbi/kol-styleguide'
import { Asset } from '@kolkrabbi/kol-brand/svg'

export const stage = 'md'

/* A brand-book mock wearing the KOL mark on the package's own default palette and brand info. */
export default function EmailSignatureDemo() {
  return <EmailSignature mark={<Asset name="kol-logomark" title="Kolkrabbi" />} />
}
