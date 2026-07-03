import { PriceDisplay } from '@kolkrabbi/kol-component'

export const CurrencyEcho = () => (
  <div style={{ width: 360 }}>
    <PriceDisplay
      amount={220}
      currency="EUR"
      secondary={`(${new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'ISK', maximumFractionDigits: 0 }).format(33000)})`}
    />
  </div>
)

export const Breakdown = () => (
  <div style={{ width: 360 }}>
    <PriceDisplay amount={220} currency="EUR" secondary="(€180 + €40 shipping)" />
  </div>
)

export const PrimaryOnly = () => (
  <div style={{ width: 360 }}>
    <PriceDisplay amount={33000} currency="ISK" locale="is-IS" />
  </div>
)
