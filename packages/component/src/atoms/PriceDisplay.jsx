/**
 * PriceDisplay — baseline-aligned price line: a large primary amount beside a
 * small muted secondary note (a second-currency echo or a cost breakdown).
 * Formats `amount` via Intl.NumberFormat in whole units (prints are priced in
 * round numbers); `secondary` is authored at the call site, parens and all —
 * omit it to render the primary alone.
 *
 * Presentational — pure scalars in, formatted currency out. Seed atom for the
 * price/sale/edition family.
 *
 * @param {number}    amount    primary price, run through the currency formatter
 * @param {string}    currency  ISO 4217 code for `amount` (e.g. 'EUR', 'ISK')
 * @param {string}    locale    number-format locale
 * @param {ReactNode} secondary muted trailing note (omit to hide)
 */
export default function PriceDisplay({
  amount,
  currency = 'EUR',
  locale = 'de-DE',
  secondary,
}) {
  const formatted = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)

  return (
    <div className="flex flex-wrap items-baseline gap-3">
      <span className="kol-sans-heading-03">{formatted}</span>
      {secondary != null && <span className="kol-mono-12 text-fg-48">{secondary}</span>}
    </div>
  )
}
