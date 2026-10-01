import { OptionRow } from '@kolkrabbi/kol-component'

export const stage = 'sm'

export const sizes = ['md', 'xs', 'sm', 'lg']

export default function OptionRowDemo({ size = 'md' }) {
  return (
    <div className="kol-tone-grey flex flex-col w-full p-2">
      <OptionRow size={size} active icon="grid" label="Components" hint="every component, on the atomic ladder" />
      <OptionRow size={size} selected icon="folder" label="brand" />
      <OptionRow size={size} trail icon="folder" label="og" />
      <OptionRow size={size} icon="file" label="olina-productions-og.png" />
    </div>
  )
}
