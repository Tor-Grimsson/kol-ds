import { PriceDisplay } from '@kolkrabbi/kol-component'

export const stage = 'md'

export default function PriceDisplayDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-8">
      {/* Second-currency echo */}
      <PriceDisplay
        amount={220}
        currency="EUR"
        secondary={`(${new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'ISK', maximumFractionDigits: 0 }).format(33000)})`}
      />

      {/* Cost breakdown */}
      <PriceDisplay amount={220} currency="EUR" secondary="(€180 + €40 shipping)" />

      {/* Primary alone, non-default currency + locale */}
      <PriceDisplay amount={33000} currency="ISK" locale="is-IS" />
    </div>
  )
}
