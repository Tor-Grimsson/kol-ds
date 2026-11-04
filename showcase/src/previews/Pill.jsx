import { Pill } from '@kolkrabbi/kol-component'

/* Both axes ride the toolbar pickers — five variants is Dropdown territory. */
export const variants = ['primary', 'secondary', 'outline', 'subtle', 'inverse', 'float']
export const sizes = ['sm', 'md', 'lg']

export default function PillPreview({ variant = 'primary', size = 'sm' }) {
  /* float (float-everything W2 row 20): the 28 status capsule with a value */
  if (variant === 'float') return <><Pill variant="float">Reading · 42%</Pill><Pill variant="float">Draft</Pill></>
  return (
    <>
      <Pill variant={variant} size={size}>Category</Pill>
      <Pill variant={variant} size={size}>Status word</Pill>
    </>
  )
}

/* Index card: one canonical instance. */
export function Card() {
  return <Pill>Primary</Pill>
}
