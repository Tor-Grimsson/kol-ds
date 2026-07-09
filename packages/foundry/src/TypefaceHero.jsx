import { Pill } from '@kolkrabbi/kol-component'
import { Button } from '@kolkrabbi/kol-component'

/* taxonomy-ok: organism — nests Pill + Button (relative imports); a full
 * page-hero region rendering live in the specimen's own font-family. */

/**
 * TypefaceHero — the specimen hero for a typeface page: a centered stack of
 * category pill → giant display name rendered in the typeface's OWN fontFamily
 * → in-family description → download / view-specimen CTAs → an optional
 * licensing caption. Data-driven from one `typeface` object; the giant name is
 * the live font-family preview (arbitrary loaded font, inline `fontFamily`, not
 * a fixed KOL type class — only the size stops are Tailwind).
 *
 * Router-decoupled: the monorepo source called `useNavigate(specimenLink)`;
 * here the "View Specimen" CTA takes an `href` and/or `onSpecimenClick` callback
 * so the DS never depends on a router. CTA copy + the license note are
 * prop-driven (license default off), and `displayName` falls back to
 * `id`/`fontFamily` when the config omits it.
 *
 * Text casing: displayName, category, description and CTA/license strings render
 * verbatim as authored — no text-transform.
 *
 * @param {Object} props
 * @param {Object} props.typeface - Config: { displayName?, id?, fontFamily, fontStyle?, category?, description?, specimenLink? }.
 * @param {string} props.downloadHref - Optional href for the "Download font" CTA.
 * @param {string} props.downloadLabel - Download CTA label (default 'Download font').
 * @param {string} props.specimenLabel - View-specimen CTA label (default 'View Specimen').
 * @param {Function} props.onSpecimenClick - Handler for the view-specimen CTA (receives the event).
 * @param {string} props.licenseNote - Licensing caption; omit to hide.
 */
const TypefaceHero = ({
  typeface = {},
  downloadHref,
  downloadLabel = 'Download font',
  specimenLabel = 'View Specimen',
  onSpecimenClick,
  licenseNote,
}) => {
  const { displayName, id, fontFamily, fontStyle, category, description, specimenLink } = typeface
  const name = displayName || id || fontFamily
  const isItalic = fontStyle === 'italic'

  const handleSpecimenClick = (e) => {
    if (onSpecimenClick) {
      e.preventDefault()
      onSpecimenClick(e)
    }
  }

  return (
    <section className="py-48 md:py-72 flex flex-col justify-center text-center items-center overflow-hidden">
      <div className="flex flex-col items-center gap-2 max-w-[1400px]">
        {category && (
          <div className="pb-5 flex flex-col items-center gap-2">
            <Pill variant="subtle">{category}</Pill>
          </div>
        )}

        <div className="pb-16 flex flex-col items-center gap-0">
          <h1
            className={`text-[64px] leading-[100%] md:text-[128px] font-semibold ${
              isItalic ? 'italic' : ''
            } text-auto transition-colors duration-300`}
            style={{ fontFamily }}
          >
            {name}
          </h1>

          {description && (
            <p
              className={`text-xl font-semibold ${
                isItalic ? 'italic' : ''
              } text-auto transition-colors duration-300`}
              style={{ fontFamily }}
            >
              {description}
            </p>
          )}
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button variant="primary" href={downloadHref}>
              {downloadLabel}
            </Button>
            <Button
              variant="outline"
              href={specimenLink}
              onClick={onSpecimenClick ? handleSpecimenClick : undefined}
            >
              {specimenLabel}
            </Button>
          </div>

          {licenseNote && (
            <p className="kol-mono-12 text-auto pt-4 transition-colors duration-300" style={{ opacity: 0.64 }}>
              {licenseNote}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}

export default TypefaceHero
