import { colorLab, inkOn, tintLadder } from './colorLab.js'
import BlockSwatch from './BlockSwatch.jsx'

/* taxonomy-ok: organism — a colour exploration: one of four boards (palette · ramps · layouts · sheet) over a ColorLab value */

/**
 * LayoutColor — a colour exploration, drawn from a ColorLab value: the palette, each colour's ramp, the roles together as
 * ink-on-ground layouts, and the colour sheet. kol-atlas's identity lab (apps/lab c1-color.jsx, 2026-10-30), carried
 * class for class (LayoutGroup, 2026-10-31): the value is the prop, `--lab-text` is `font`, Atlas's copy and the Lab bar
 * are left out. The sheet's cells are `BlockSwatch variant="cell"`.
 *
 * @param {string} view   `palette` (default) · `ramps` · `layouts` · `sheet`
 * @param {Object} color  a ColorLab value (`DEFAULT_COLOR_LAB` shape: base, relation, count, seed, colors, locked)
 * @param {string} font   the face the sheet's names and values are set in (default the KOL sans)
 */
export default function LayoutColor({ view = 'palette', color, font = 'var(--kol-font-family-sans)', className = '' }) {
  const palette = colorLab(color)
  const View = VIEWS[view] ?? VIEWS.palette
  return <div className={className}><View palette={palette} font={font} /></div>
}

/* the readable ink on a field: the palette's ink or its background, whichever contrasts more */
const onOf = (roles) => (hex) => inkOn(hex, { dark: roles.bg, light: roles.fg }).ink

const Chip = ({ hex, className = 'h-24' }) => <div className={`w-full ${className}`} style={{ background: hex }} />

function ColorPalette({ palette: { swatches } }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
      {swatches.map((s) => (
        <div key={s.index} className="flex flex-col gap-2">
          <Chip hex={s.hex} className="h-40" />
          <p className="kol-mono-12 text-emphasis">{s.hex}</p>
          <p className="kol-mono-12 text-meta">{s.roleLabel}</p>
        </div>
      ))}
    </div>
  )
}

function ColorRamps({ palette: { swatches } }) {
  return (
    <div className="flex flex-col gap-6">
      {swatches.map((s) => (
        <div key={s.index} className="flex flex-col gap-2">
          <p className="kol-mono-12 text-meta">{s.index + 1} {s.roleLabel}</p>
          <div className="grid grid-cols-7">
            {tintLadder(s.hex).map((hex, i) => (
              <div key={i} className="flex flex-col gap-1">
                <Chip hex={hex} className="h-16" />
                <p className="kol-mono-12 text-meta">{hex}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

/* the roles together: ink on the background, the accent as a block and as a rule, dim and warm as fields */
function ColorLayouts({ palette: { roles } }) {
  const on = onOf(roles)
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="flex min-h-64 flex-col justify-between p-8" style={{ background: roles.bg, color: roles.fg }}>
        <p className="kol-mono-12" style={{ color: roles.accent }}>Accent</p>
        <p className="text-3xl">Ink on background</p>
      </div>
      <div className="flex min-h-64 flex-col justify-between p-8" style={{ background: roles.fg, color: roles.bg }}>
        <div className="h-1 w-16" style={{ background: roles.accent }} />
        <p className="text-3xl">Background on ink</p>
      </div>
      <div className="flex min-h-64 items-end p-8" style={{ background: roles.accent, color: on(roles.accent) }}>
        <p className="text-3xl">Accent</p>
      </div>
      <div className="grid min-h-64 grid-cols-2">
        <div className="flex items-end p-8" style={{ background: roles.dim, color: on(roles.dim) }}><p className="text-xl">Dim</p></div>
        <div className="flex items-end p-8" style={{ background: roles.warm, color: on(roles.warm) }}><p className="text-xl">Warm</p></div>
      </div>
    </div>
  )
}

/* ── sheet: the reference's colour sheet (Figma client--collections-all 1:48614), rebuilt on the value ──
 * light paper, padding 96, gap 64: the lead block (two tall roles, light over dark beside them), the ramp grid (each swatch's
 * tintLadder, light to dark, the swatch itself 4th), the ink levels as the neutral row. Each cell: name and number left, hex right. */
function ColorSheet({ palette: { swatches, roles, ink }, font }) {
  const on = onOf(roles)
  const roleHex = (id) => swatches.find((s) => s.role === id)?.hex ?? roles[id]
  const roleName = (id) => swatches.find((s) => s.role === id)?.roleLabel ?? id
  /* an ink level is the ink at an opacity (8-digit hex): it reads in the background's colour */
  const cell = (hex) => ({ hex, ink: hex.length > 7 ? roles.bg : on(hex), font })
  return (
    <div data-theme="light" className="mx-auto flex w-full max-w-[1200px] flex-col gap-16 bg-[var(--kol-surface-primary)] p-24">
      <div className="flex aspect-[1208/790] w-full overflow-hidden rounded-[4px]">
        <BlockSwatch variant="cell" lead className="flex-1" {...cell(roleHex('accent'))} name={roleName('accent')} />
        <BlockSwatch variant="cell" lead className="flex-1" {...cell(roleHex('warm'))} name={roleName('warm')} />
        <div className="flex flex-1 flex-col">
          <BlockSwatch variant="cell" lead className="flex-1" {...cell(roleHex('fg'))} name={roleName('fg')} />
          <BlockSwatch variant="cell" lead className="flex-1" {...cell(roleHex('bg'))} name={roleName('bg')} />
        </div>
      </div>
      <div className="flex w-full overflow-hidden rounded-[4px]">
        {swatches.map((s) => (
          <div key={s.index} className="flex min-w-0 flex-1 flex-col">
            {tintLadder(s.hex).map((hex, i) => <BlockSwatch variant="cell" key={i} {...cell(hex)} name={`${s.roleLabel} ${i + 1}`} />)}
          </div>
        ))}
      </div>
      {/* the ink levels are the ink at an opacity, so they sit on the background, as they are used */}
      <div className="flex w-full overflow-hidden rounded-[4px]" style={{ background: roles.bg }}>
        {ink.map((x) => <BlockSwatch variant="cell" key={x.id} className="min-w-0 flex-1" {...cell(x.hex)} name={`Ink ${x.id}`} />)}
      </div>
    </div>
  )
}

const VIEWS = { palette: ColorPalette, ramps: ColorRamps, layouts: ColorLayouts, sheet: ColorSheet }
export const LAYOUT_COLOR_VIEWS = Object.keys(VIEWS)
