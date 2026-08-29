import SectionCards from './SectionCards.jsx'

/**
 * @deprecated 2026-08-26 — `FeaturesCardSection` is `SectionCards` under its
 * old name (SectionSet). Old prop names mapped: `headerLabel` → `headline`,
 * `headerDescription` → `body`, `ctas` → `actions`, `ctasClassName` →
 * `actionsClassName`. Alias kept; removed at the next major.
 */
export default function FeaturesCardSection({ headerLabel, headerDescription, ctas, ctasClassName, ...rest }) {
  return (
    <SectionCards
      headline={headerLabel}
      body={headerDescription}
      actions={ctas}
      actionsClassName={ctasClassName}
      {...rest}
    />
  )
}
