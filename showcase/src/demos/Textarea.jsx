import { Textarea } from '@kolkrabbi/kol-component'

export const stage = 'md'

/* ONE instance; variant and size ride the toolbar pickers (2026-09-30). */
export const variants = ['filled', 'outline']
export const sizes = ['sm', 'md', 'lg', 'xs']

export default function TextareaDemo({ variant = 'filled', size = 'sm' }) {
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
