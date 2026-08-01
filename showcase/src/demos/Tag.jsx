import { Tag } from '@kolkrabbi/kol-component'

/* Tag's three variants, per the chip law — the picker rides the toolbar. */
export const variants = ['primary', 'secondary', 'inverse']

export default function TagDemo({ variant = 'primary' }) {
  return (
    <>
      <Tag variant={variant}>design</Tag>
      <Tag variant={variant}>system</Tag>
      <Tag variant={variant} hash={false}>plain</Tag>
      <Tag variant={variant} onRemove={() => {}}>removable</Tag>
    </>
  )
}
