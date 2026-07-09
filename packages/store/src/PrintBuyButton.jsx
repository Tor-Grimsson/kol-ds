import { Button } from '@kolkrabbi/kol-component'

/**
 * PrintBuyButton — the smart fulfillment CTA for a print. Renders the right
 * button(s) for whatever purchase paths the injected `print` carries: a
 * self-fulfilled link (`buyUrl`, e.g. Stripe), a print-on-demand link
 * (`printOnDemandUrl`). With no path configured it renders a disabled
 * "Coming Soon" — the safe default.
 *
 * Commerce-severed: the component holds NO hardcoded URLs. Every destination
 * (Stripe / POD / PayPal / mailto) enters through the consumer-built `print`
 * object, so the DS package ships no store-specific links. `buyUrl` supersedes
 * the monorepo's `stripePaymentLink` name (any URL works); `stripePaymentLink`
 * is still read as a fallback for existing catalogs.
 *
 * @param {Object}          print              product record
 * @param {string}          print.buyUrl       primary self-fulfilled checkout URL
 * @param {string}          print.stripePaymentLink  legacy alias for `buyUrl`
 * @param {string}          print.printOnDemandUrl    print-on-demand URL
 * @param {number}          print.price        price shown in the button label
 * @param {string}          print.currency     ISO 4217 (default 'EUR')
 * @param {'row'|'stack'}   layout             button layout direction (default 'row')
 * @param {'sm'|'md'|'lg'}  size               button size (default 'md')
 * @param {boolean}         showPrice          show the formatted price in the label (default true)
 * @param {string}          buyLabel           label for the primary button (default 'Buy')
 * @param {string}          podLabel           label for the POD button (default 'Order Print')
 * @param {string}          comingSoonLabel    label for the disabled default (default 'Coming Soon')
 * @param {string}          className          extra classes on the wrapper
 */
export default function PrintBuyButton({
  print,
  layout = 'row',
  size = 'md',
  showPrice = true,
  buyLabel = 'Buy',
  podLabel = 'Order Print',
  comingSoonLabel = 'Coming Soon',
  className = '',
}) {
  const {
    buyUrl,
    stripePaymentLink,
    printOnDemandUrl,
    price,
    currency = 'EUR',
  } = print ?? {}

  const primaryUrl = buyUrl || stripePaymentLink
  const hasPrimary = !!primaryUrl
  const hasPOD = !!printOnDemandUrl
  const hasAnyOption = hasPrimary || hasPOD

  const formatPrice = (amount) => {
    if (typeof amount !== 'number') return ''
    try {
      return new Intl.NumberFormat(currency === 'ISK' ? 'is-IS' : 'en-US', {
        style: 'currency',
        currency,
        maximumFractionDigits: 0,
      }).format(amount)
    } catch {
      return currency === 'ISK' ? `${amount} kr` : `${currency} ${amount}`
    }
  }

  const layoutClass = layout === 'stack' ? 'flex flex-col gap-3' : 'flex flex-row gap-3'

  // No purchase path configured → safe default.
  if (!hasAnyOption) {
    return (
      <div className={className}>
        <Button variant="secondary" size={size} disabled>
          {comingSoonLabel}
        </Button>
      </div>
    )
  }

  return (
    <div className={`${layoutClass} ${className}`}>
      {hasPrimary && (
        <Button
          variant="primary"
          size={size}
          href={primaryUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          {showPrice ? `${buyLabel} ${formatPrice(price)}`.trim() : buyLabel}
        </Button>
      )}

      {hasPOD && (
        <Button
          variant={hasPrimary ? 'secondary' : 'primary'}
          size={size}
          href={printOnDemandUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          {podLabel}
        </Button>
      )}
    </div>
  )
}
