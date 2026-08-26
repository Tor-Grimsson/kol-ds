import { Icon } from '@kolkrabbi/kol-icons'

/**
 * EmblaNav — THE prev/next pair for an embla carousel.
 *
 * WHY IT EXISTS. Three components hand-wrote the same
 * `.kol-embla-btn border border-fg-16 hover:border-fg-32 text-auto` string with
 * their own aria labels, and two of them used the literal text glyphs `‹` and
 * `›` as the arrows — in a design system that ships a chevron icon set. The
 * FeaturedCarousel reconciliation (2026-08-15) found the consumer's fork had
 * built its own `CarouselNavigation` for precisely that reason: it wanted real
 * icons. Rather than fold that file in beside three copies of the markup, the
 * markup became one component. Same failure RailSection fixed for rails — a
 * class is vocabulary, not grammar.
 *
 * MediaViewer keeps its own chips deliberately: they are absolutely positioned
 * over an inverse-tier scrim, which is a different control, not this one.
 *
 * @param {Function} onPrev · @param {Function} onNext
 * @param {boolean}  [canPrev=true] · @param {boolean} [canNext=true]  disabled state
 * @param {number}   [size=16]      chevron size
 * @param {'stack'|'inline'} [placement='stack']  `inline` drops the top gap and
 *   the end-alignment for a header row; `stack` sits under the viewport
 * @param {string}   [prevLabel='Previous'] · @param {string} [nextLabel='Next']
 */
export default function EmblaNav({
  onPrev,
  onNext,
  canPrev = true,
  canNext = true,
  size = 16,
  placement = 'stack',
  prevLabel = 'Previous',
  nextLabel = 'Next',
  className = '',
}) {
  const btn = 'kol-embla-btn border border-fg-16 hover:border-fg-32 text-auto'

  return (
    <div
      className={`kol-embla-controls ${placement === 'inline' ? 'is-inline' : ''} ${className}`.trim()}
    >
      <button type="button" className={btn} aria-label={prevLabel} onClick={onPrev} disabled={!canPrev}>
        <Icon name="chevron-left" size={size} />
      </button>
      <button type="button" className={btn} aria-label={nextLabel} onClick={onNext} disabled={!canNext}>
        <Icon name="chevron-right" size={size} />
      </button>
    </div>
  )
}
