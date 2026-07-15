import { Textarea } from '@kolkrabbi/kol-component'

export const stage = 'md'

export default function TextareaDemo() {
  return (
    <>
      <Textarea variant="filled" size="sm" placeholder="filled · sm" />
      <Textarea variant="outline" size="sm" placeholder="outline · sm" />
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
