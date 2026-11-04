import { Textarea } from '@kolkrabbi/kol-component'

export const stage = 'md'

/* ONE instance; variant and size ride the toolbar pickers (2026-09-30). */
export const variants = ['filled', 'outline', 'float']
export const sizes = ['sm', 'md', 'lg', 'xs']

export default function TextareaPreview({ variant = 'filled', size = 'sm' }) {
  /* float (float-everything W3 row 42): the note field on the sheet radius */
  if (variant === 'float') return <Textarea variant="float" placeholder="Add a note…" className="max-w-xs" />
  return <Textarea variant={variant} size={size} placeholder={variant} />
}

/* Index card: one canonical instance. */
export function Card() {
  return (
    <div className="w-full max-w-xs">
      <Textarea variant="filled" size="sm" placeholder="Textarea" />
    </div>
  )
}
