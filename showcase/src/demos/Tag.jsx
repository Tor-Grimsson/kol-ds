import { Tag } from '@kolkrabbi/kol-component'

/* Tag's three variants, per the chip law — both axes ride the toolbar pickers. */
export const variants = ['primary', 'secondary', 'inverse']
export const sizes = ['sm', 'md', 'lg']

export default function TagDemo({ variant = 'primary', size = 'sm' }) {
  return (
    <>
      <Tag variant={variant} size={size}>design</Tag>
      <Tag variant={variant} size={size}>system</Tag>
      <Tag variant={variant} size={size} hash={false}>plain</Tag>
      <Tag variant={variant} size={size} onRemove={() => {}}>removable</Tag>
    </>
  )
}
