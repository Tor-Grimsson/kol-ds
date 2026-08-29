import { FoundryTypefacePairing } from '@kolkrabbi/kol-foundry'

export const stage = 'full'

/* the faces render in their own families where the fonts are served; the
 * showcase serves Right Grotesk, so the names fall back to the sans */
export default function FoundryTypefacePairingDemo() {
  return <FoundryTypefacePairing />
}
