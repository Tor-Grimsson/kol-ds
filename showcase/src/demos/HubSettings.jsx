import { LabeledControlSection, SettingsRow } from '@kolkrabbi/kol-component'
import { HubSettings } from '@kolkrabbi/kol-shell'

export const stage = 'full'

const SHORTCUTS = [
  { section: 'Navigate', items: [{ id: 'home', label: 'Home, then the rail', combo: '⌥ 1–9' }, { id: 'settings', label: 'Settings', combo: ',' }] },
  { section: 'Help', items: [{ id: 'sheet', label: 'Shortcuts sheet', combo: 'S' }] },
]

/* the Hub's Settings: SETTINGS · ABOUT · REPO, the app's own sections over the shortcuts —
 * the one array the S sheet shows — and the search reads the shortcuts */
export default function HubSettingsDemo() {
  return (
    <HubSettings
      app={{ name: 'Shell', about: 'The reference for the Hub.', links: [{ label: 'Design system', url: 'https://ui.kolkrabbi.io' }] }}
      shortcuts={SHORTCUTS}
      content={(
        <LabeledControlSection label="General">
          <SettingsRow label="Placeholder" align="fill"><span className="text-fg-32 kol-helper-12">The app's own sections</span></SettingsRow>
        </LabeledControlSection>
      )}
    />
  )
}
