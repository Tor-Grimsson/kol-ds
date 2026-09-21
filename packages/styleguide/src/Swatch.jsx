import { ColorSwatch } from '@kolkrabbi/kol-component'

/**
 * Swatch — the DOCUMENTED swatch: a specimen bar over its meta row (name, hex),
 * with an optional canonical-anchor dot.
 *
 * `ColorSwatch` (kol-component) is the chip alone — a fixed-size pressable atom
 * for paint bars and inspectors. A colour PAGE needs the specimen plus its label
 * and value, which is the form both brand apps had built locally
 * (`brand-book-mocks-two-consumers`, 2026-09-03: 23 lines, byte-identical in
 * kol-client-olina and kol-website). This composes the atom rather than
 * redrawing it, per the ticket.
 *
 * GEOMETRY IS CARRIED THROUGH. The forks wore `.kol-swatch` /
 * `.kol-swatch-chip` / `.kol-swatch-meta`, and those rules are real — they ship
 * in **`@kolkrabbi/kol-framework`** (`kol-framework.css`, the "Swatch / Ramp
 * (color specimens)" block), not in kol-theme: a 6px-gap column, a **96px-tall**
 * chip at radius 4, and a row-wrapped meta line on the baseline. They are
 * stragglers — `.kol-mood-tile-*` left that same block for
 * `kol-theme/kol-components-styleguide.css` on 2026-07-10 and these did not.
 *
 * So this component draws that geometry ITSELF rather than wearing the classes.
 * kol-framework is not a peer of kol-styleguide and must not become one — a
 * component whose look depends on another package's stylesheet being imported
 * is the defect `styleguide-barrel-is-unimportable` was filed about. A
 * consumer swapping its fork onto this gets the same render with no new
 * install, and `height` is the seam if a page wants a different specimen depth.
 *
 *   <Swatch hex="#131316" name="Ink" anchor />
 *
 * The hex is uppercased — that is value formatting, not a text-transform on
 * copy; `name` renders exactly as authored.
 *
 * @param {string} hex - The colour, e.g. '#131316' (required — it is both the paint and the printed value)
 * @param {ReactNode} name - Label beside the value; omitted, only the hex renders
 * @param {boolean} anchor - Mark this stop as the palette's canonical anchor — a difference-blended dot centred on the chip (default: false)
 * @param {number|string} height - Specimen depth, the forks' `.kol-swatch-chip` height (default: 96)
 * @param {string} className - Extra classes on the wrapper
 */
export default function Swatch({ hex, name, anchor = false, height = 96, className = '' }) {
  return (
    /* gap 6 — .kol-swatch */
    <div className={`flex flex-col ${className}`.trim()} style={{ gap: 6 }}>
      {/* .kol-swatch-chip: full column width, 96 tall, radius 4. ColorSwatch's
          'stretch' size fills this box, so the atom owns the paint and the
          frame while the specimen depth stays the page's decision. */}
      <div className="relative w-full" style={{ height }}>
        <ColorSwatch hex={hex} size="stretch" radius="sm" />
        {anchor && (
          <span
            aria-label="Canonical anchor"
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            {/* difference blend so the dot reads on any stop, light or dark —
                the forks' trick, kept verbatim */}
            <span
              className="block rounded-full"
              style={{ width: 10, height: 10, background: 'white', mixBlendMode: 'difference' }}
            />
          </span>
        )}
      </div>
      {/* .kol-swatch-meta: row, space-between, baseline, wrapping */}
      <div
        className="kol-helper-10 flex flex-row flex-wrap items-baseline justify-between"
        style={{ gap: '4px 12px' }}
      >
        {name && <span className="text-meta">{name}</span>}
        <span className="text-strong font-semibold">{hex.toUpperCase()}</span>
      </div>
    </div>
  )
}
