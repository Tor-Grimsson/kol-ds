/**
 * AssetCard — frame wrapper for stationery / branded asset mocks.
 *
 * Just a backdrop with padding + caption above. The asset child renders at its
 * natural size, driven by the parent column width and its own aspect-ratio. No
 * scaling — content stays at intended proportions.
 *
 * Group items with similar aspects in the same grid row so heights align.
 * Extreme-aspect items (very tall or very wide) should go in their own row or
 * a full-width container.
 *
 * Lifted verbatim from the two brand apps (`brand-book-mocks-two-consumers`,
 * 2026-09-03) — the file was byte-identical in kol-client-olina and
 * kol-website, 25 lines each. Nothing here was client-specific, which is why
 * it is a straight carry-through: same elements, same classes, same order.
 * `backdrop` and `className` are the only additions.
 *
 *   <AssetCard caption="Business card">
 *     <div style={{ aspectRatio: '85 / 55' }}><BusinessCardFront … /></div>
 *   </AssetCard>
 *
 * Caption text is authored in the case it should render — the component applies
 * no text-transform beyond the `uppercase` the original carried.
 *
 * @param {ReactNode} caption - Label above the frame; omitted, no figcaption renders
 * @param {string} backdrop - CSS colour for the frame ground (default: the fg-04 wash)
 * @param {string} className - Extra classes on the <figure>
 * @param {ReactNode} children - The mock
 */
export default function AssetCard({ caption, backdrop, className = '', children }) {
  return (
    <figure className={className}>
      {caption && (
        <figcaption className="kol-helper-12 uppercase tracking-widest text-meta mb-3">
          {caption}
        </figcaption>
      )}
      <div
        className={`rounded-sm p-6 ${backdrop ? '' : 'bg-fg-04'}`.trim()}
        style={backdrop ? { background: backdrop } : undefined}
      >
        {children}
      </div>
    </figure>
  )
}
