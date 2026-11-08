import { SwatchTile } from '@kolkrabbi/kol-component'

/**
 * BlockSwatch — A documented color swatch (Swatch until 2026-10-31; the old name is an alias on the retirement ledger). the DOCUMENTED swatch: a specimen bar over its meta row (name, hex),
 * with an optional canonical-anchor dot.
 *
 * `ColorSwatch` (kol-component) is the chip alone — a fixed-size pressable atom
 * for paint bars and inspectors. A color PAGE needs the specimen plus its label
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
 *   <BlockSwatch hex="#131316" name="Ink" anchor />
 *
 * `variant="cell"` (2026-10-31, LayoutGroup — kol-atlas's colour sheet, class for class) is the sheet's cell: the colour
 * fills the box and the name and hex sit inside it, in `ink`, in the `font` face; `lead` is the tall lead cell.
 *
 * The hex is uppercased — that is value formatting, not a text-transform on
 * copy; `name` renders exactly as authored.
 *
 * @param {string} hex - The color, e.g. '#131316' (required — it is both the paint and the printed value)
 * @param {ReactNode} name - Label beside the value; omitted, only the hex renders
 * @param {boolean} anchor - Mark this stop as the palette's canonical anchor — a difference-blended dot centred on the chip (default: false)
 * @param {number|string} height - Specimen depth, the forks' `.kol-swatch-chip` height (default: 96)
 * @param {string} className - Extra classes on the wrapper
 * @param {string} variant - `chip` (default — the specimen over its meta row) · `cell` (the colour sheet's cell)
 * @param {boolean} lead - `cell` only: the lead cell — 24 in, larger type
 * @param {string} ink - `cell` only: the text colour on the colour (default 'currentColor')
 * @param {string} font - `cell` only: the face the name and hex are set in (default the KOL sans)
 */
export default function BlockSwatch({ hex, name, anchor = false, height = 96, className = '', variant = 'chip', lead = false, ink = 'currentColor', font = 'var(--kol-font-family-sans)' }) {
  if (variant === 'cell') return (
    <div className={`flex ${lead ? 'p-6' : 'h-20 items-center p-4'} ${className}`} style={{ background: hex, color: ink }}>
      <div className="flex w-full items-start justify-between gap-2 whitespace-nowrap leading-[1.1]" style={{ fontFamily: font }}>
        <span className={`font-semibold ${lead ? 'text-[18px] tracking-[-0.02em]' : 'text-[13.5px] tracking-[-0.02em]'}`}>{name}</span>
        <span className={lead ? 'text-[16px] tracking-[-0.02em]' : 'text-[12px] tracking-[-0.02em]'}>{hex.toUpperCase()}</span>
      </div>
    </div>
  )
  /* the chip form is kol-component's SwatchTile (2026-11-07) — the same geometry, now drawn in one place */
  return <SwatchTile hex={hex} name={name} anchor={anchor} height={height} className={className} />
}
