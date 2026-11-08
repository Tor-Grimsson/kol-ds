import { SettingsFieldMap } from '@kolkrabbi/kol-component'

export const stage = 'sm'

/* the field drawn as a strip under the preview — his FIELD MAP */
export default function SettingsFieldMapPreview() {
  return (
    <div className="w-[248px] max-w-full">
      <SettingsFieldMap background="linear-gradient(90deg, var(--kol-oq-16), var(--kol-fg-96) 50%, var(--kol-oq-16))" left="Radial" right="Centre 0.50 / 0.50" />
    </div>
  )
}
