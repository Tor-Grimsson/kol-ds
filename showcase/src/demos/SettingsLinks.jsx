import { SettingsLinks, SettingsColophon } from '@kolkrabbi/kol-shell'

export const stage = 'md'

export default function SettingsLinksDemo() {
  return (
    <div className="flex flex-col gap-8">
      <SettingsLinks links={[{ label: 'GitHub', url: 'https://github.com/Tor-Grimsson/kol-ds' }, { label: 'Kolkrabbi', url: 'https://kolkrabbi.io' }]} />
      <SettingsColophon year={2026} />
    </div>
  )
}
