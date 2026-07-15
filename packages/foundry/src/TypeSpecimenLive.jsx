import { useLayoutEffect, useRef, useState } from 'react'

/* taxonomy-ok: organism — self-measuring live specimen; owns getComputedStyle
 * I/O over rendered font samples. */

/**
 * TypeSpecimenLive — a self-measuring type specimen. One row per type class,
 * each rendering a live sample and reading its OWN `getComputedStyle` to print
 * the resolved typeface / weight / size / leading / tracking beside it. Because
 * the labels are measured off the real rendered element, they can never drift
 * from the CSS: retune a token and the specimen follows.
 *
 * Ported from the kol portfolio-kit's `TypeSpecimen` page and generalised for
 * the design system — the kit's hardcoded row list is now the consumer-injected
 * `specs` prop, and the PP-Right-Grotesk / JetBrains-Mono weight-name maps are
 * overridable props (defaulted to the kit's fonts). Casing is untouched: class
 * names and samples render verbatim.
 *
 * WHY IT EXISTS: `TypeSpecCard` is a STATIC data sheet — the consumer types the
 * metric tuples in by hand next to a sample. This component is its live cousin:
 * it MEASURES the sample, so there's nothing to type and nothing to keep in
 * sync. Richer, and honest by construction.
 *
 * @param {Object} props
 * @param {Array<{className:string, sample:React.ReactNode, label?:string}>} props.specs
 *   The rows. `className` is the type class to render + measure; `sample` is the
 *   live copy; `label` overrides the printed class name (defaults to className).
 * @param {string} [props.title] Optional header title (rendered verbatim).
 * @param {string} [props.description] Optional header description (verbatim).
 * @param {string} [props.sampleClassName] Extra class(es) on every sample element
 *   (default `text-emphasis` for a legible default color; pass '' to opt out).
 * @param {Object<number,string>} [props.sansWeightNames] weight→name for
 *   proportional faces (default PP Right Grotesk ramp).
 * @param {Object<number,string>} [props.monoWeightNames] weight→name for mono
 *   faces (default JetBrains Mono ramp).
 * @param {{mono:string, sans:string}} [props.typefaceNames] Friendly typeface
 *   labels chosen by the mono/proportional split (default RG / JetBrains).
 * @param {string} [props.className] Class(es) on the root <div>.
 */

const DEFAULT_SANS_WEIGHTS = { 100: 'Fine', 300: 'Light', 400: 'Regular', 500: 'Medium', 600: 'Dark', 700: 'Bold', 900: 'Black' }
const DEFAULT_MONO_WEIGHTS = { 400: 'Regular', 500: 'Medium', 600: 'SemiBold', 700: 'Bold' }
const DEFAULT_TYPEFACE_NAMES = { mono: 'JetBrains Mono', sans: 'Right Grotesk' }

/**
 * Read a computed-style object into a printable metric record. Exported so
 * consumers can reuse the exact same derivation in tests or custom rows.
 */
export function readMeta(cs, {
  sansWeightNames = DEFAULT_SANS_WEIGHTS,
  monoWeightNames = DEFAULT_MONO_WEIGHTS,
  typefaceNames = DEFAULT_TYPEFACE_NAMES,
} = {}) {
  const fam = cs.fontFamily.split(',')[0].replace(/["']/g, '').trim()
  const mono = /mono/i.test(fam)
  const typeface = mono ? typefaceNames.mono : typefaceNames.sans
  const width = /Narrow/.test(fam) ? 'Narrow' : /Compact/.test(fam) ? 'Compact' : mono ? 'Monospace' : 'Regular'
  const w = parseInt(cs.fontWeight, 10)
  const wname = (mono ? monoWeightNames : sansWeightNames)[w]
  const size = parseFloat(cs.fontSize)
  const lh = parseFloat(cs.lineHeight)
  const leading = Number.isNaN(lh) ? cs.lineHeight : `${+lh.toFixed(1)}px (${(lh / size).toFixed(2)}×)`
  const ls = parseFloat(cs.letterSpacing)
  const tracking = !ls ? '0' : `${cs.letterSpacing} (${(ls / size).toFixed(3)}em)`
  return { fam, typeface, width, weight: `${w}${wname ? ` ${wname}` : ''}`, size: `${+size.toFixed(1)}px`, leading, tracking }
}

function SpecimenRow({ className, sample, label, sampleClassName, metaConfig }) {
  const ref = useRef(null)
  const [m, setM] = useState(null)

  useLayoutEffect(() => {
    const measure = () => { if (ref.current) setM(readMeta(getComputedStyle(ref.current), metaConfig)) }
    measure()
    // Re-measure once webfonts land — line-height can resolve as `normal`
    // (font-dependent) before the face loads, which would print a stale leading.
    let cancelled = false
    if (typeof document !== 'undefined' && document.fonts?.ready) {
      document.fonts.ready.then(() => { if (!cancelled) measure() })
    }
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [className])

  return (
    <div className="flex flex-col gap-2 py-4 border-b border-fg-08">
      <div ref={ref} className={sampleClassName ? `${className} ${sampleClassName}` : className}>{sample}</div>
      {m && (
        <div className="kol-mono-10 text-meta flex flex-col gap-0.5">
          <span className="text-body">{label ?? className}</span>
          <span>{m.typeface} · {m.fam} · {m.width} · {m.weight}</span>
          <span>{m.size} · leading {m.leading} · tracking {m.tracking}</span>
        </div>
      )}
    </div>
  )
}

export default function TypeSpecimenLive({
  specs = [],
  title,
  description,
  sampleClassName = 'text-emphasis',
  sansWeightNames = DEFAULT_SANS_WEIGHTS,
  monoWeightNames = DEFAULT_MONO_WEIGHTS,
  typefaceNames = DEFAULT_TYPEFACE_NAMES,
  className = '',
}) {
  const metaConfig = { sansWeightNames, monoWeightNames, typefaceNames }
  return (
    <div className={`kol-type-specimen-live flex flex-col ${className}`}>
      {(title || description) && (
        <header className="mb-4">
          {title && <h2 className="kol-sans-heading-04 text-emphasis mb-3">{title}</h2>}
          {description && <p className="kol-sans-body-03 text-meta">{description}</p>}
        </header>
      )}
      {specs.map((s, i) => (
        <SpecimenRow
          key={s.className ? `${s.className}-${i}` : i}
          className={s.className}
          sample={s.sample}
          label={s.label}
          sampleClassName={sampleClassName}
          metaConfig={metaConfig}
        />
      ))}
    </div>
  )
}
