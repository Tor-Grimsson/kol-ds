import { Button } from '@kolkrabbi/kol-component'

/* Exporting `variants` puts a picker in the preview toolbar; the active one
 * arrives as the `variant` prop, so every size and shape below re-renders in
 * that variant instead of needing one demo file per variant. */
export const variants = ['primary', 'secondary', 'accent', 'outline', 'ghost', 'danger', 'grey']

export default function ButtonDemo({ variant = 'primary' }) {
  return (
    <>
      <Button variant={variant} size="sm">Small</Button>
      <Button variant={variant}>Medium</Button>
      <Button variant={variant} size="lg">Large</Button>
      <Button variant={variant} iconLeft="plus">With icon</Button>
      <Button variant={variant} iconOnly="settings-01" />
      <Button variant={variant} disabled>Disabled</Button>
    </>
  )
}

/* Index card: one canonical instance. */
export function Card() {
  return <Button variant="primary">Button</Button>
}
