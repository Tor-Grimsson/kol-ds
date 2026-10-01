import { Badge } from '@kolkrabbi/kol-component'

/* Variants ramp inline; size rides the toolbar picker. */
export const variants = ['default', 'secondary', 'outline', 'success', 'warning', 'error', 'info']
export const sizes = ['md', 'xs', 'sm', 'lg']

export default function BadgeDemo({ variant = 'default', size = 'md' }) {
  return (
    <>
      <Badge variant={variant} size={size}>Badge</Badge>
      <Badge variant={variant} size={size} icon="check">With icon</Badge>
      <Badge variant={variant} size={size}>12</Badge>
    </>
  )
}
