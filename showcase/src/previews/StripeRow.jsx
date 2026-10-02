import { StripeRow, DEFAULT_PALETTE } from '@kolkrabbi/kol-styleguide'

export const stage = 'lg'

/* The stripe layout on the default palette — it takes no logo. */
export default function StripeRowPreview() {
  return <StripeRow palette={DEFAULT_PALETTE} />
}
