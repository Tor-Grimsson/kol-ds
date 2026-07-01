import { Textarea } from '@kolkrabbi/kol-component'

export default function TextareaDemo() {
  return (
    <div className="flex flex-col gap-3 w-full max-w-xs">
      <Textarea variant="filled" size="sm" placeholder="filled · sm" />
      <Textarea variant="ghost" size="sm" placeholder="ghost · sm" />
      <Textarea variant="outline" size="sm" placeholder="outline · sm" />
    </div>
  )
}
