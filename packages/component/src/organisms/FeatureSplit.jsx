import SectionSplit from './SectionSplit.jsx'

/**
 * @deprecated 2026-08-26 — `FeatureSplit` is `SectionSplit` under its old name
 * (SectionSet). Same render, old prop names mapped: `kicker` → `label`,
 * `title` → `headline`, `titleSize` → `headlineSize`, `ctas` → `actions`,
 * `mediaAspect` → `ratio`, `flip` → `align="left"`. Kept as an alias so no
 * call site breaks; removed at the next major.
 */
export default function FeatureSplit({ kicker, title, titleSize, ctas, mediaAspect, flip = false, align, ...rest }) {
  return (
    <SectionSplit
      label={kicker}
      headline={title}
      headlineSize={titleSize}
      actions={ctas}
      ratio={mediaAspect}
      align={align ?? (flip ? 'left' : 'right')}
      {...rest}
    />
  )
}
