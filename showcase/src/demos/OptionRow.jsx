import { OptionRow } from '@kolkrabbi/kol-component'

export const stage = 'sm'

export default function OptionRowDemo() {
  return (
    <div className="kol-tone-grey flex flex-col w-full p-2">
      <OptionRow active icon="grid" label="Components" hint="every component, on the atomic ladder" />
      <OptionRow selected icon="folder" label="brand" />
      <OptionRow trail icon="folder" label="og" />
      <OptionRow icon="file" label="olina-productions-og.png" />
      <OptionRow size="sm" icon="file" label="size sm" />
    </div>
  )
}
