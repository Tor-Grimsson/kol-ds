/* THE LAB — the generators a brand is MADE with, shipped together under one name system (BrandLabToolGaps, kol-atlas
 * 2026-10-29 — the user: *"the group of those tools that generate should ship together with combolab and logo lockup
 * generator, and have unified name system"*). `@kolkrabbi/kol-styleguide/lab`; the main barrel exports the same names.
 *
 *   <X>Lab          the generator's UI, controlled by one value
 *   <x>Lab(value)   everything it draws, from the value
 *   <x>LabCss(…)    the result as CSS custom properties
 *   DEFAULT_<X>_LAB where it starts
 *
 *   type     TypeLab · typeLab · typeLabCss · DEFAULT_TYPE_LAB
 *   colour   ColorLab · colorLab · colorLabCss · DEFAULT_COLOR_LAB
 *   combo    ComboLab · comboLab · comboLabCss · DEFAULT_COMBO_LAB
 *   lockup   LockupLab · lockupLab · DEFAULT_LOCKUP_LAB (a branded house's parts and lockup types; BrandLockup draws one)
 *
 * ONE WINDOW (BrandLabToolWindow, 2026-10-29): every lab draws in LabWindow — QuickLookFrame, a tabbed rail of
 * LabeledControls, the stage, and the output (a table, then the CSS) under it. ONE COLOUR ENGINE: Color Lab and Combo
 * Lab both run on colorLab.js (kol-fxr's — OKLCH, base is colour 1, 2–8 colours, jobs by look, lock and roll). */
export { default as LabWindow, LabOutput, useLabValue } from './LabWindow.jsx'
export { default as TypeLab } from '../TypeLab.jsx'
export { typeLab, typeLabCss, DEFAULT_TYPE_LAB, TYPE_RATIOS, TYPE_STEPS, TYPE_ROLES, TYPE_FACES, TYPE_CASES, TYPE_INKS } from '../typeLab.js'
export { default as ColorLab } from '../ColorLab.jsx'
export {
  colorLab, colorLabCss, rollColorLab, DEFAULT_COLOR_LAB, COLOR_ROLES, COLOR_RELATIONS, INK_LEVELS, TEXT_STOPS,
  generateColors, assignRoles, tintLadder, midColor, simulateCvd, CVD_TYPES, paletteFromPixels, seededRng, oklchToHex, hexToOklch, contrastRatio, contrastGrade, inkOn, blendRamp,
} from '../colorLab.js'
export { default as ComboLab } from '../ComboLab.jsx'
export { comboLab, comboLabCss, DEFAULT_COMBO_LAB, COMBO_ROLES } from '../comboLab.js'
export { default as LockupLab, BrandLockup } from '../LockupLab.jsx'
export { lockupLab, DEFAULT_LOCKUP_LAB, LOCKUP_PARTS, LOCKUP_TYPES, LOCKUP_SHAPES, LOCKUP_CASES, LOCKUP_GRID, LOCKUP_SUB_PRESETS } from '../lockupLab.js'
export { default as Lockup, LOCKUP_SCALES } from '../Lockup.jsx'
