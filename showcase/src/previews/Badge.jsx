import { Badge } from '@kolkrabbi/kol-component'

/* Variants ramp inline; size rides the toolbar picker. */
export const variants = ['default', 'secondary', 'outline', 'success', 'warning', 'error', 'info', 'float']
export const sizes = ['md', 'xs', 'sm', 'lg']

export default function BadgePreview({ variant = 'default', size = 'md' }) {
  /* float (float-everything W2 row 18): the 26 count capsule */
  if (variant === 'float') return <><Badge variant="float">3 effects</Badge><Badge variant="float">12</Badge></>
  return (
    <>
      <Badge variant={variant} size={size}>Badge</Badge>
      <Badge variant={variant} size={size} icon="check">With icon</Badge>
      <Badge variant={variant} size={size}>12</Badge>
    </>
  )
}
