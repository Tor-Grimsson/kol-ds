/**
 * BrandMark — a logo by id, for the brand tool. Two sources, in order:
 *
 *   1. `Logo` — the consumer's own mark component (`<Logo variant="wordmark" />`), e.g. an svgr
 *      loader. It wins when given, so an app that already renders its marks keeps that DOM.
 *   2. `sources` — `{ [id]: rawSvg }`. The markup is injected so `currentColor` cascades in; the
 *      same strings feed the Logos table's dimensions and recoloured downloads. The wrapper fills
 *      its box and the svg fills the wrapper, so a sized parent (a LogoCard layer) fits the mark
 *      and an unsized one takes its height from the viewBox.
 *
 * Neither holds the id → nothing renders (a missing mark is a gap, not a crash).
 */
export default function BrandMark({ id, Logo, sources, className = '', style, title }) {
  if (Logo) return <Logo variant={id} className={className} style={style} title={title} />
  const raw = sources?.[id]
  if (!raw) return null
  return (
    <span
      className={`kol-logo block w-full h-full [&>svg]:block [&>svg]:w-full [&>svg]:h-full ${className}`.trim()}
      style={style}
      role={title ? 'img' : undefined}
      aria-label={title || undefined}
      aria-hidden={title ? undefined : true}
      dangerouslySetInnerHTML={{ __html: raw }}
    />
  )
}
