import { IconFrame } from '@kolkrabbi/kol-component'

/* One instance per variant row; size rides the toolbar picker (2026-08-09
 * consistency ruling — no inline size ramps in previews). The variant picker
 * re-renders the single frame in each color set. */
export const variants = ['primary', 'secondary', 'accent', 'outline', 'ghost', 'nav', 'grey', 'danger']
export const tones = ['default', 'primary', 'secondary', 'inverted', 'outline', 'ghost', 'grey', 'sunken']
export const sizes = ['sm', 'md', 'lg', 'xs']

export default function IconFramePreview({ variant = 'primary', tone = 'default', size = 'md' }) {
  return <IconFrame name="settings-01" variant={variant} tone={tone} size={size} />
}

/* Index card: one canonical instance. */
export function Card() {
  return <IconFrame name="settings-01" variant="primary" size="md" />
}
