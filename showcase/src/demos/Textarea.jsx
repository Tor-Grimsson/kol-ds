import { Textarea } from '@kolkrabbi/kol-component'

export const stage = 'md'

/* Variants ramp inline; size rides the toolbar picker. */
export const sizes = ['sm', 'md', 'lg']

export default function TextareaDemo({ size = 'sm' }) {
  return (
    <>
      <Textarea variant="filled" size={size} placeholder="filled" />
      <Textarea variant="outline" size={size} placeholder="outline" />
    </>
  )
}

/* Index card: one canonical instance. */
export function Card() {
  return (
    <div className="w-full max-w-xs">
      <Textarea variant="filled" size="sm" placeholder="Textarea" />
    </div>
  )
}
