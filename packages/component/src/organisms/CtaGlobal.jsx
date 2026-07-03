/**
 * CtaGlobal — editorial two-column contact/CTA band: a large display wordmark
 * on the left (e.g. "/ CONNECT") and a right column of stacked
 * label-over-value rows — a prompt row ("WORKING ON A PROJECT?" / "SEND A
 * MESSAGE") and a contact row whose value is a `mailto:` link. The editorial
 * closer of the CTA-band family (FoundryCTA is the simple centered tier).
 * Columns sit side by side from `md` up and stack below — the source's
 * no-breakpoint two-column was a bug fixed on recreation.
 *
 * Presentational — all copy arrives as props (the source hard-coded every
 * string). The right column is internally a list of rows: the named
 * `promptLabel`/`heading` and `contactLabel`/`email` conveniences cover the
 * common case, `secondaryRows` slots extra rows between them. A row with an
 * `href` renders an `<a>`; without, a static heading. Empty rows emit no
 * nodes.
 *
 * Eyebrow, labels, and values render exactly as authored — the source's
 * `uppercase` classes were dropped per KOL casing rules; author strings in
 * their final case at the call site.
 *
 * @param {ReactNode} eyebrow       left-column display wordmark (kol-sans-display-01)
 * @param {ReactNode} promptLabel   prompt-row label (kol-helper-16)
 * @param {ReactNode} heading       prompt-row value (kol-sans-heading-01)
 * @param {ReactNode} contactLabel  contact-row label (kol-helper-16)
 * @param {string}    email         contact-row value + `mailto:` target; omit to drop the row
 * @param {{label: ReactNode, value: ReactNode, href?: string}[]} secondaryRows  extra right-column rows between prompt and contact
 * @param {string}    className     extra classes on the section
 */
export default function CtaGlobal({
  eyebrow,
  promptLabel,
  heading,
  contactLabel,
  email,
  secondaryRows = [],
  className = '',
}) {
  const rows = [
    ...(promptLabel || heading ? [{ label: promptLabel, value: heading }] : []),
    ...secondaryRows,
    ...(email ? [{ label: contactLabel, value: email, href: `mailto:${email}` }] : []),
  ]
  return (
    <section className={`w-full bg-auto ${className}`.trim()}>
      <div className="w-full py-10 flex flex-col md:flex-row items-start gap-12 overflow-hidden">
        <div className="flex-1 self-stretch text-auto kol-sans-display-01">{eyebrow}</div>
        <div className="flex-1 self-stretch pb-6 md:pt-32 flex flex-col justify-end items-start gap-12">
          {rows.map((row, i) => (
            <div key={i} className="self-stretch flex flex-col items-start gap-2">
              {row.label && <div className="text-auto kol-helper-16">{row.label}</div>}
              {row.href ? (
                <a
                  href={row.href}
                  className="text-auto kol-sans-heading-01 hover:opacity-70 transition-opacity"
                >
                  {row.value}
                </a>
              ) : (
                <div className="text-auto kol-sans-heading-01">{row.value}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
