import { Badge } from '@kolkrabbi/kol-component'

/* Variants ramp inline; size rides the toolbar picker. */
export const sizes = ['sm', 'md', 'lg']

export default function BadgeDemo({ size = 'md' }) {
  return (
    <>
      <Badge variant="default" size={size}>Default</Badge>
      <Badge variant="secondary" size={size}>Secondary</Badge>
      <Badge variant="destructive" size={size}>Destructive</Badge>
      <Badge variant="outline" size={size}>Outline</Badge>
      <Badge variant="success" size={size}>Success</Badge>
      <Badge variant="warning" size={size}>Warning</Badge>
      <Badge variant="info" size={size}>Info</Badge>
    </>
  )
}
