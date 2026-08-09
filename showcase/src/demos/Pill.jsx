import { Pill } from '@kolkrabbi/kol-component'

/* Both axes ride the toolbar pickers — five variants is Dropdown territory. */
export const variants = ['primary', 'secondary', 'outline', 'subtle', 'inverse']
export const sizes = ['sm', 'md', 'lg']

export default function PillDemo({ variant = 'primary', size = 'sm' }) {
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
