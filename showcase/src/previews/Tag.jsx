import { Tag } from '@kolkrabbi/kol-component'

/* Tag's three variants, per the chip law — both axes ride the toolbar pickers. */
export const variants = ['primary', 'secondary', 'inverse', 'float']
export const sizes = ['sm', 'md', 'lg', 'xs']

export default function TagPreview({ variant = 'primary', size = 'sm' }) {
  /* float (float-everything W2 row 17): the 26 capsule — rest · selected · removable · with a count */
  if (variant === 'float') {
    return (
      <>
        <Tag variant="float" size={size} onClick={() => {}}>Video</Tag>
        <Tag variant="float" size={size} active onClick={() => {}}>Selected</Tag>
        <Tag variant="float" size={size} onRemove={() => {}}>Soft glow</Tag>
        <Tag variant="float" size={size} onClick={() => {}} count={5}>All tasks</Tag>
      </>
    )
  }
  return (
    <>
      <Tag variant={variant} size={size}>design</Tag>
      <Tag variant={variant} size={size}>system</Tag>
      <Tag variant={variant} size={size} hash={false}>plain</Tag>
      <Tag variant={variant} size={size} onRemove={() => {}}>removable</Tag>
    </>
  )
}
