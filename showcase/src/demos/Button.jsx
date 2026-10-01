import { Button } from '@kolkrabbi/kol-component'

/* Exporting `variants` puts a picker in the preview toolbar; the active one
 * arrives as the `variant` prop, so every size and shape below re-renders in
 * that variant instead of needing one demo file per variant. */
export const variants = ['primary', 'secondary', 'accent', 'outline', 'ghost', 'nav', 'danger', 'grey']
/* tone and size ride the toolbar too (W19, 2026-09-30 — user: "atom button had dropdown for variant,
 * to atom ne and size, now its back to only variant?"). Tone is the ground and wins over variant. */
export const tones = ['default', 'primary', 'secondary', 'inverted', 'outline', 'ghost', 'grey', 'sunken']
export const sizes = ['md', 'xs', 'sm', 'lg']

export default function ButtonDemo({ variant = 'primary', tone = 'default', size = 'md' }) {
  const p = { variant, tone, size }
  return (
    <>
      <Button {...p}>Button</Button>
      <Button {...p} iconLeft="plus">With icon</Button>
      <Button {...p} iconOnly="settings-01" />
      <Button {...p} disabled>Disabled</Button>
    </>
  )
}

/* Index card: one canonical instance. */
export function Card() {
  return <Button variant="primary">Button</Button>
}
