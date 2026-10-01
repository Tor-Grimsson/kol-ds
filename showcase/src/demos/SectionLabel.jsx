import { SectionLabel } from '@kolkrabbi/kol-component'

export const stage = 'sm'

export const sizes = ['md', 'sm', 'lg']

export default function SectionLabelDemo({ size = 'md' }) {
  return (
    <>
      <SectionLabel text="COLLECTIONS" size={size} />
      <SectionLabel text="FEATURED WORK" size={size} />
      <SectionLabel text="LATEST PRINTS" size={size} />
    </>
  )
}
