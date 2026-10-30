/**
 * comboLab — the math behind ComboLab: Color Lab's palette, combined. It generates nothing — the colours are Color Lab's
 * (BrandLabToolWindow, kol-atlas 2026-10-29: *"why would combo lab output palette and not the color lab?"*; one colour
 * engine for both, `colorLab.js`). It decides which palette colour plays each of the 60/30/10 composition's five parts,
 * and checks each part on the ground.
 *
 *   parts     primary · secondary · light · dark · accent. By default from the colours' jobs: primary the Accent,
 *             secondary the Dim, light the Ink, dark the Background, accent the Warm — the user reassigns any of them.
 *   check     each part on the light ground and on the dark one, ratio and grade.
 */
import { colorLab, contrastGrade, contrastRatio } from './colorLab.js'

export const COMBO_ROLES = ['primary', 'secondary', 'light', 'dark', 'accent']
const FROM_JOB = { primary: 'accent', secondary: 'dim', light: 'fg', dark: 'bg', accent: 'warm' }

/** the lab's starting value: the layout, the mark slot on or off, and any part reassigned (`assign: { part: colourIndex }`) */
export const DEFAULT_COMBO_LAB = { layout: 'applied-card', logo: false, assign: {} }

/** the combination from Color Lab's value (or its result) and the combo's own: `{ palette, parts, colors }` */
export function comboLab(value, color) {
  const v = { ...DEFAULT_COMBO_LAB, ...value }
  const c = color?.swatches ? color : colorLab(color)
  const indexOf = (part) => v.assign?.[part] ?? c.roleIdx[FROM_JOB[part]]
  const palette = Object.fromEntries(COMBO_ROLES.map((p) => [p, c.colors[indexOf(p)] ?? c.colors[0]]))
  const parts = COMBO_ROLES.map((p) => {
    const hex = palette[p]
    const onLight = contrastRatio(hex, palette.light), onDark = contrastRatio(hex, palette.dark)
    return { id: p, hex, index: indexOf(p), onLight, onDark, gradeLight: contrastGrade(onLight), gradeDark: contrastGrade(onDark) }
  })
  return { ...v, palette, parts, colors: c.colors }
}

/** the combination as CSS custom properties — `--<prefix>-combo-<part>` */
export function comboLabCss(value, color, prefix = 'brand') {
  const { palette } = comboLab(value, color)
  return [':root {', ...COMBO_ROLES.map((r) => `  --${prefix}-combo-${r}: ${palette[r]};`), '}'].join('\n')
}
