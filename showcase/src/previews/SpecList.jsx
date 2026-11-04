import { SpecList } from '@kolkrabbi/kol-component'

export const stage = 'md'

const items = [
  { label: 'Edition', value: 'Limited (30)' },
  { label: 'Year', value: '2025' },
  { label: 'Category', value: 'Screen print' },
  { label: 'Sizes', value: 'A3, A2, A1' },
]

export const variants = ['default', 'float']

const BOOK = [
  { label: 'Author', value: 'Virginia Woolf' },
  { label: 'Genre', value: 'Fiction' },
  { label: 'Format', value: 'EPUB' },
  { label: 'Length', value: '297 pages' },
  { label: 'Status', value: 'Reading · 42%' },
]

export default function SpecListPreview({ variant = 'default' }) {
  /* float (W8 row 126): the info sheet under its heading */
  if (variant === 'float') return <div className="w-[400px] max-w-full"><SpecList variant="float" title="Book information" items={BOOK} /></div>
  return (
    <div className="w-full max-w-md">
      <SpecList items={items} framed />
    </div>
  )
}
