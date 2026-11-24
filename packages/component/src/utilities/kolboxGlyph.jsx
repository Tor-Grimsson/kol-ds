import { IconLoader } from '@kolkrabbi/kol-icons'

/* kolbox's glyph (plan-2026-11-18-kolbox-system W31.2 batch 4): your icons by the set's own name, 16 with the stroke lift
 * (`.kol-kolbox-icon`); every chevron 12 with the dock chevron's stroke (`.kol-kolbox-chevron`), whatever size is asked
 * (28.6, his "chevrons too big"). The package's kolbox parts draw it; not in the index: apps/kolbox reaches it as
 * `@kolkrabbi/kol-component/utilities/kolboxGlyph` for its loose glyphs (plan-2026-11-19-kolbox-whats-left C9.2). */
export default function KolboxGlyph({ name, size = 16, className = '' }) {
  const chevron = name?.startsWith('chevron-')
  return <IconLoader name={name} size={chevron ? 12 : size} className={`${chevron ? 'kol-kolbox-chevron' : 'kol-kolbox-icon'} shrink-0 ${className}`} />
}
