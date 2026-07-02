import { Textarea } from '@kolkrabbi/kol-component'

export const stage = 'md'

export default function TextareaDemo() {
  return (
    <>
      <Textarea variant="filled" size="sm" placeholder="filled · sm" />
      <Textarea variant="ghost" size="sm" placeholder="ghost · sm" />
      <Textarea variant="outline" size="sm" placeholder="outline · sm" />
    </>
  )
}
