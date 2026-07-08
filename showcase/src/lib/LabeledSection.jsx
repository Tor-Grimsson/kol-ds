/**
 * LabeledSection — the generalized "labeled container" from apps/brand's
 * styleguide TypeSpecCard (E3 tier-1). A positioned corner label + top divider
 * + two columns: a meta list (key/value rows) on the left, a content slot on
 * the right. The brand original was type-spec-specific; this is content-agnostic
 * — use it for any labeled specimen (type, tokens, motion, spacing…).
 *
 * All layout is Tailwind inline (matching the source); the only descendant rule
 * — resetting <p> margins inside the content slot — is expressed as an arbitrary
 * variant, so there's no separate CSS file to keep in sync.
 *
 * Showcase-local for now; kol-component candidate once it has consumers.
 */
export default function LabeledSection({ label, meta = [], children }) {
  return (
    <div className="kol-labeled-section relative py-12 border-t border-fg-08">
      {label && (
        <span className="kol-labeled-section-label kol-helper-12 uppercase tracking-widest text-meta absolute top-4 left-0">
          {label}
        </span>
      )}
      <div className="kol-labeled-section-row grid grid-cols-1 gap-6 lg:grid-cols-[256px_minmax(0,1fr)] lg:gap-12 items-start pt-6">
        {meta.length > 0 && (
          <div className="kol-labeled-section-meta flex flex-col">
            {meta.map(([key, value]) => (
              <div
                key={key}
                className="grid grid-cols-[auto_minmax(0,1fr)] gap-4 items-baseline py-2 border-b border-[var(--kol-fg-04)] last:border-b-0"
              >
                <span className="kol-helper-10 text-meta">{key}</span>
                <span className="kol-helper-10 text-strong text-right [overflow-wrap:anywhere]">{value}</span>
              </div>
            ))}
          </div>
        )}
        <div className="kol-labeled-section-content min-w-0 [&_p]:mb-4 [&_p:last-child]:mb-0">
          {children}
        </div>
      </div>
    </div>
  )
}
