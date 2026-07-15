import { PrintBuyButton } from '@kolkrabbi/kol-store'

export const stage = 'md'

/* Commerce-severed: every destination enters through the consumer-built
 * `print` object — the component ships no hardcoded URLs. Three states:
 * both purchase paths, a single self-fulfilled path, and no path at all
 * (the disabled "Coming Soon" safe default). */
const BOTH_PATHS = {
  buyUrl: 'https://buy.stripe.com/demo-hverfjall',
  printOnDemandUrl: 'https://printler.example/hverfjall',
  price: 180,
  currency: 'EUR',
}

const BUY_ONLY = {
  buyUrl: 'https://buy.stripe.com/demo-caldera',
  price: 24900,
  currency: 'ISK',
}

const NO_PATHS = {}

export default function PrintBuyButtonDemo() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <span className="kol-mono-12 text-fg-48">buyUrl + printOnDemandUrl — primary and secondary</span>
        <PrintBuyButton print={BOTH_PATHS} />
      </div>
      <div className="flex flex-col gap-2">
        <span className="kol-mono-12 text-fg-48">buyUrl only, ISK price, stacked layout</span>
        <PrintBuyButton print={BUY_ONLY} layout="stack" size="sm" className="max-w-40" />
      </div>
      <div className="flex flex-col gap-2">
        <span className="kol-mono-12 text-fg-48">no purchase path — safe default</span>
        <PrintBuyButton print={NO_PATHS} />
      </div>
    </div>
  )
}
