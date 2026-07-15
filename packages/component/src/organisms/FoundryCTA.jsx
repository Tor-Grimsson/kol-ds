import Button from '../atoms/Button.jsx'

/* taxonomy-ok: nests component's Button */

/**
 * FoundryCTA — the simple centered tier of the CTA-band family: a centered
 * column with a short rule line, a heading, a mono description, and one or
 * more Button actions. CtaGlobal is the editorial two-column closer of the
 * same family; this is the quiet mid-page tier (foundry pages, prints grid).
 *
 * Presentational — copy arrives as props and renders verbatim (no
 * text-transform; author strings in their final case). Actions with an
 * `href` render Button's anchor form; pass `onNavigate` for SPA routing —
 * same `(href, event)` seam contract as WorkListItem — or omit it for plain
 * anchors (external links, mailto:).
 *
 * @param {ReactNode} heading      band heading (kol-sans-heading-02)
 * @param {ReactNode} description  supporting line (kol-mono-14, dimmed)
 * @param {Object|Array} action    one {href, label, variant?, target?, rel?} or an array;
 *                                 variant 'secondary' renders Button's outline treatment,
 *                                 anything else the primary fill
 * @param {Function}  onNavigate   (href, event) => void — SPA-nav seam for internal links
 * @param {string}    className    extra classes on the section
 */
export default function FoundryCTA({
  heading,
  description,
  action,
  onNavigate,
  className = '',
}) {
  const actions = (Array.isArray(action) ? action : [action]).filter(Boolean)

  return (
    <section className={`w-full py-24 ${className}`.trim()}>
      <div className="max-w-[900px] mx-auto text-center space-y-8">
        <div className="w-32 h-px bg-fg-24 mx-auto" />

        {heading && <h2 className="kol-sans-heading-02 text-auto">{heading}</h2>}

        {description && (
          <p className="kol-mono-14 text-fg-64 max-w-[600px] mx-auto">{description}</p>
        )}

        {actions.length > 0 && (
          <div className={`pt-4 ${actions.length > 1 ? 'flex flex-col sm:flex-row gap-4 justify-center' : ''}`.trim()}>
            {actions.map((act, i) => (
              <Button
                key={i}
                variant={act.variant === 'secondary' ? 'outline' : 'primary'}
                size="md"
                href={act.href}
                target={act.target}
                rel={act.rel}
                onClick={onNavigate ? (e) => onNavigate(act.href, e) : undefined}
              >
                {act.label}
              </Button>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
