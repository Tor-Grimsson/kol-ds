import { SettingsScaffold } from '@kolkrabbi/kol-shell'
import { LabeledControlSection, SettingsRow, ToggleSwitch } from '@kolkrabbi/kol-component'

export const frame = 620

const TABS = [
  { value: 'general', label: 'General', title: 'Settings', subtitle: 'How the app behaves' },
  { value: 'about', label: 'About', title: 'About', subtitle: 'Version and source' },
]

/* The settings page scaffold: a masthead, the filter row, then the scrolling body the app writes. */
export default function SettingsScaffoldPreview() {
  return (
    <SettingsScaffold
      tabs={TABS}
      renderContent={(tab) => (tab === 'general' ? (
        <LabeledControlSection title="Playback">
          <SettingsRow label="Loop"><ToggleSwitch checked onChange={() => {}} /></SettingsRow>
          <SettingsRow label="Autoplay"><ToggleSwitch checked={false} onChange={() => {}} /></SettingsRow>
        </LabeledControlSection>
      ) : <p className="kol-doc-body">Version 1.0</p>)}
    />
  )
}
