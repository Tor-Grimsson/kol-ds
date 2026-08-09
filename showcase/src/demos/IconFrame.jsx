import { IconFrame } from '@kolkrabbi/kol-component'

/* One instance per variant row; size rides the toolbar picker (2026-08-09
 * consistency ruling — no inline size ramps in previews). The variant picker
 * re-renders the single frame in each colour set. */
export const variants = ['primary', 'secondary', 'accent', 'outline', 'ghost', 'nav', 'grey', 'danger']
export const sizes = ['sm', 'md', 'lg']

export default function IconFrameDemo({ variant = 'primary', size = 'md' }) {
  return <IconFrame name="settings-01" variant={variant} size={size} />
}

/* Index card: one canonical instance. */
export function Card() {
  return <IconFrame name="settings-01" variant="primary" size="md" />
}
