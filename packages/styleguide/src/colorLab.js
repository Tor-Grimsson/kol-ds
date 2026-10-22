/**
 * colorLab — the math behind ColorLab: one base color + a harmony rule → the whole palette.
 *
 * Carried from kol-atlas `components/graphics/ColorLab.jsx` (2026-10-20), its store lifted out
 * into a plain value so the lab is controlled and the result can be saved into a brand.
 *
 *   Palette   ten hues 36° apart at the base's saturation and lightness; blue-grey and grey ramps
 *             of ten steps, each from its own base (blue-grey follows the base hue while linked).
 *   Ramps     five steps per hue by the "Material Girl" blend: the base, Screen (lighter) and
 *             Multiply (darker) of the base over itself at 50%, applied once and twice.
 *   Slots     four brand slots, two dark and two light, picked from any swatch.
 *   Mix       60 / 30 / 10 by area, following Light · Secondary · Primary until a share has its own pick.
 */
import { generateHarmony, hexToHsl, hslToHex } from '@kolkrabbi/kol-component'

/* the twelve standard hue names, 30° apart; hues 36° apart never share one */
const HUE_NAMES = ['Red', 'Orange', 'Yellow', 'Chartreuse', 'Green', 'Spring', 'Cyan', 'Azure', 'Blue', 'Violet', 'Magenta', 'Rose']
export const hueName = (h) => HUE_NAMES[Math.round(h / 30) % 12]

const toRgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
const toHex = (rgb) => '#' + rgb.map((c) => Math.round(Math.min(1, Math.max(0, c)) * 255).toString(16).padStart(2, '0')).join('').toUpperCase()
const screen = (c) => c + 0.5 * (1 - (1 - c) ** 2 - c)
const multiply = (c) => c + 0.5 * (c * c - c)
export const rgbText = (hex) => `rgb(${toRgb(hex).map((c) => Math.round(c * 255)).join(', ')})`

/** five steps, 100 lightest … 500 darkest, the base at 300 */
export function blendRamp(hex) {
  const base = toRgb(hex)
  const s1 = base.map(screen), m1 = base.map(multiply)
  return [s1.map(screen), s1, base, m1, m1.map(multiply)].map(toHex)
}

/** ten steps of one hue and saturation, lightness 97 → 12 */
export const neutralRamp = (h, s) => Array.from({ length: 10 }, (_, i) => hslToHex(h, s, Math.round(97 - i * 9.5)).toUpperCase())

export const COLOR_SLOTS = ['Brand dark', 'Brand black', 'Light', 'Light 2']
export const COLOR_ROLES = ['Primary', 'Secondary', 'Light', 'Dark', 'Accent']
export const COLOR_MIX = [
  [6, '60% Neutral', 'Surface, page canvas.'],
  [3, '30% Secondary', 'Support. Blocks, containers, structural chrome.'],
  [1, '10% Primary', 'Signature. Brand moment, CTA, identity plate.'],
]

/** the lab's starting value; `slots` / `picks` null means "follow the derived default" */
export const DEFAULT_COLOR_LAB = {
  base: '#3D7FF0', harmony: 'analogous', blueBase: '#6B7A99', greyBase: '#808080', blueLinked: true,
  slots: null, picks: [null, null, null],
}

/** everything the lab draws, from its value */
export function deriveColorLab(value) {
  const v = { ...DEFAULT_COLOR_LAB, ...value }
  const { h, s, l } = hexToHsl(v.base)
  const hues = Array.from({ length: 10 }, (_, i) => { const hh = (h + i * 36) % 360; return { name: hueName(hh), hex: hslToHex(hh, s, l).toUpperCase() } })
  const nb = hexToHsl(v.blueBase), ng = hexToHsl(v.greyBase)
  const blueGrey = v.blueLinked ? neutralRamp(h, 20) : neutralRamp(nb.h, nb.s)
  const grey = neutralRamp(ng.h, ng.s)
  const slots = v.slots ?? [blueGrey[7], grey[9], grey[0], grey[1]]
  const roles = generateHarmony(v.base, v.harmony)
  const mix = [slots[2], roles[1], roles[0]].map((hex, i) => v.picks?.[i] ?? hex)
  const ramps = hues.map((x) => ({ ...x, steps: blendRamp(x.hex) }))
  return { ...v, h, s, l, hues, blueGrey, grey, slots, roles, mix, ramps }
}

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

/** the lab's result as CSS custom properties — one `:root` block, brand-prefixed */
export function colorLabCss(value, prefix = 'brand') {
  const c = deriveColorLab(value)
  const line = (name, hex) => `  --${prefix}-${name}: ${hex};`
  return [
    ':root {',
    ...COLOR_ROLES.map((r, i) => line(`role-${slug(r)}`, c.roles[i])),
    ...COLOR_SLOTS.map((r, i) => line(`slot-${slug(r)}`, c.slots[i])),
    ...COLOR_MIX.map(([, label], i) => line(`mix-${slug(label).replace(/^\d+-/, '')}`, c.mix[i])),
    ...c.ramps.flatMap((x) => x.steps.map((hex, i) => line(`${slug(x.name)}-${(i + 1) * 100}`, hex))),
    ...c.blueGrey.map((hex, i) => line(`blue-grey-${(i + 1) * 100}`, hex)),
    ...c.grey.map((hex, i) => line(`grey-${(i + 1) * 100}`, hex)),
    '}',
  ].join('\n')
}
