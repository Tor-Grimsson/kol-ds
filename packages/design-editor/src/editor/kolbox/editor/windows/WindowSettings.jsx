import { useState } from 'react'
import { ASPECTS, pack, setAppSetting, toggleDots, transport, useAppSettings, useBindDots, useComposeState } from '../engine.js'
import { ShortcutsList } from './WindowShortcuts.jsx'
import { STYLE_OPTIONS, useVariant } from '../../../variant.js'
import { Button, Dropdown, LabeledControl, ModalDialog, TabsRow, ToggleSwitch, Tooltip, LabeledControlSection } from '@kolkrabbi/kol-component'

/* Display settings, as the real AppSettings drawer with the editor's host section: Display, Defaults, Canvas,
   Transport, then the editor's own Canvas (Show grid); the reset foot. Every row reads and writes the engine's
   appSettings store (localStorage and the host's settings store), so a change outlives a reload. Display's Theme row picks
   the theme variant (kolcore, kolbox, minimal, folio; plan-2026-11-18-kolbox-system 8.2, W15), on every screen.
   Round 4, W12, the real hub's Settings rail (kol-shell HubSettingsRail over editor-hub AppLayout's rows): the tabs
   Settings, Shortcuts and About on every screen. view: the screen, the keymap's word for it ('editor' default, 'labs',
   or any other for a page with no chrome). On the editor the Settings tab keeps the editor's own rows above; elsewhere
   it is the hub's six (Defaults: Default aspect, Loop theme, Clip to frame, Modulation dots; Transport: Autoplay, Loop
   length) and the hub's reset. Shortcuts is the S sheet's keymap for the same view (WindowShortcuts' ShortcutsList);
   About is the hub's FXR text, its links and the colophon. The hub foot's dark and light toggle stays out.
   tab: the tab it opens on ('settings' default, 'shortcuts', 'about'). */
const ASPECT_OPTIONS = ASPECTS.map((a) => ({ value: a.id, label: a.label })).filter((o) => o.value !== 'custom')
const PREVIEW_RES_OPTIONS = [{ value: 'full', label: 'Full' }, { value: 'half', label: 'Half' }]
const LOOP_LENGTH_OPTIONS = [2, 4, 8, 12, 16].map((n) => ({ value: n, label: `${n} s` }))
/* the theme variant (plan-2026-11-18-kolbox-system 8.2): `data-theme-variant` on <html>, remembered for index.html's
   boot to stamp before first paint */
const THEME_OPTIONS = ['kolcore', 'kolbox', 'minimal', 'folio']
const setThemeVariant = (v) => {
  document.documentElement.dataset.themeVariant = v
  try { localStorage.setItem('kolbox-theme-variant', v) } catch { /* private window: this session only */ }
}
function ThemeChoice() {
  const [v, setV] = useState(() => THEME_OPTIONS.includes(document.documentElement.dataset.themeVariant) ? document.documentElement.dataset.themeVariant : 'kolbox')
  return <Choice label="Theme" options={THEME_OPTIONS} value={v} onChange={(n) => { setThemeVariant(n); setV(n) }} />
}

/* light or dark within the theme: `data-theme` on <html>, remembered as `kol-theme` for index.html's boot. `system`
   drops the attribute, so the theme package follows the OS (explicit beats system beats light). */
const MODE_OPTIONS = ['dark', 'light', 'system']
const setThemeMode = (m) => {
  const el = document.documentElement
  if (m === 'system') delete el.dataset.theme
  else el.dataset.theme = m
  try { localStorage.setItem('kol-theme', m) } catch { /* private window: this session only */ }
}
/* the editor's style (C3), shown only where these screens are the editor's kolbox style (`<DesignEditor variant>`), never
   in apps/kolbox: the engine's Style row, in kolbox's kit. The host reloads on a change. */
function useStyleRow() {
  const s = useAppSettings()
  if (useVariant() !== 'kolbox') return []
  return [['Style', <Choice label="Style" options={STYLE_OPTIONS} value={s.style ?? 'default'} onChange={(v) => setAppSetting('style', v)} />]]
}

function ModeChoice() {
  const [m, setM] = useState(() => document.documentElement.dataset.theme || 'system')
  return <Choice label="Mode" options={MODE_OPTIONS} value={m} onChange={(n) => { setThemeMode(n); setM(n) }} />
}
/* AppSettings' DEFAULTS, written back through setAppSetting by the reset foot; the hub's (SETTING_DEFAULTS) add its
   Modulation dots row's key */
const DEFAULTS = { defaultAspect: '4:5', defaultTheme: 'kol', autoplay: false, clipToFrame: true, defaultLoopSeconds: 4 }
const HUB_DEFAULTS = { defaultAspect: '4:5', defaultTheme: 'kol', autoplay: false, clipToFrame: true, labsModDots: false, defaultLoopSeconds: 4 }
const resetTo = (defaults) => () => {
  for (const [k, v] of Object.entries(defaults)) setAppSetting(k, v)
  transport.setLoopSeconds(defaults.defaultLoopSeconds)
}

/* editor-hub AppLayout's APP, verbatim */
const APP = {
  name: 'FXR',
  about: 'A DOM/SVG design compositor — frames, layers, vector tools — with generative, kinetic-type and effects layers on the same engine, served through three chromes: the Editor, Labs, and the Randomiser. Ships as a standalone app and as the embeddable @kolkrabbi/design-editor library.',
  links: [
    { label: 'GitHub', url: 'https://github.com/Tor-Grimsson/kol-fxr' },
    { label: 'Kolkrabbi', url: 'https://fxr.kolkrabbi.io' },
    { label: 'Vercel', url: 'https://vercel.com/tor-grimssons-projects/kol-fxr' },
  ],
}
const TABS = [{ value: 'settings', label: 'Settings' }, { value: 'shortcuts', label: 'Shortcuts' }, { value: 'about', label: 'About' }]

const Switch = ({ label, on, onChange, disabled }) => (
  <span className="flex flex-1 justify-end"><ToggleSwitch variant="kolbox" aria-label={label} checked={!!on} onChange={onChange} disabled={disabled} /></span>
)
const Choice = ({ label, options, value, onChange }) => (
  <Dropdown variant="kolbox" ariaLabel={label} options={options} value={value} onChange={(v) => onChange(options.find((o) => String(o.value) === v)?.value ?? v)} className="flex-1" />
)
const Sections = ({ sections }) => sections.map(([title, rows], n) => (
  <LabeledControlSection variant="kolbox" key={`${title}-${n}`} label={title}>
    {rows.map(([label, control]) => <LabeledControl variant="kolbox" horizontal key={label} label={label} labelWidth={160}>{control}</LabeledControl>)}
  </LabeledControlSection>
))

/* the editor's own rows, as before; Show grid reads the compose state, so this part mounts only under its providers */
function EditorRows() {
  const s = useAppSettings()
  const dots = useBindDots()
  const { showGrid, toggleGrid } = useComposeState()
  const gen = pack('generators')
  const style = useStyleRow()
  return (
    <Sections sections={[
      ['Display', [
        ['Theme', <ThemeChoice />],
        ['Mode', <ModeChoice />],
        ...style,
        ['Preview resolution', <Choice label="Preview resolution" options={PREVIEW_RES_OPTIONS} value={s.previewRes} onChange={(v) => setAppSetting('previewRes', v)} />],
      ]],
      ['Defaults', [
        ['Default aspect', <Choice label="Default aspect" options={ASPECT_OPTIONS} value={s.defaultAspect} onChange={(v) => setAppSetting('defaultAspect', v)} />],
        ...(gen ? [['Loop theme', <Choice label="Loop theme" options={gen.THEME_OPTIONS} value={s.defaultTheme} onChange={(v) => setAppSetting('defaultTheme', v)} />]] : []),
        ['Clip to frame', <Switch label="Clip to frame" on={s.clipToFrame} onChange={(v) => setAppSetting('clipToFrame', v)} />],
        ['Modulation dots', <Switch label="Modulation dots" on={dots} onChange={(v) => { if (v !== dots) toggleDots() }} />],
      ]],
      ['Canvas', [
        ['Grab (C)', <Switch label="Grab (C)" on={s.grab} onChange={(v) => setAppSetting('grab', v)} />],
        ['Interactions', <Switch label="Interactions" on={s.interactions !== false} onChange={(v) => setAppSetting('interactions', v)} />],
        ['Zoom lock (Z)', <Switch label="Zoom lock (Z)" on={s.zoomLock} onChange={(v) => setAppSetting('zoomLock', v)} />],
      ]],
      ['Transport', [
        ['Autoplay', <Switch label="Autoplay" on={s.autoplay} onChange={(v) => setAppSetting('autoplay', v)} />],
        ['Loop length', <Choice label="Loop length" options={LOOP_LENGTH_OPTIONS} value={s.defaultLoopSeconds} onChange={(n) => { setAppSetting('defaultLoopSeconds', n); transport.setLoopSeconds(n) }} />],
      ]],
      /* the editor's host section: Show grid is compose state, not an app default */
      ['Canvas', [
        ['Show grid', <Switch label="Show grid" on={showGrid} onChange={toggleGrid} />],
      ]],
    ]} />
  )
}

/* the hub's six (editor-hub AppLayout useSettings), in its order */
function HubRows() {
  const s = useAppSettings()
  const gen = pack('generators')
  const style = useStyleRow()
  return (
    <Sections sections={[
      ['Display', [
        ['Theme', <ThemeChoice />],
        ['Mode', <ModeChoice />],
        ...style,
      ]],
      ['Defaults', [
        ['Default aspect', <Choice label="Default aspect" options={ASPECT_OPTIONS} value={s.defaultAspect} onChange={(v) => setAppSetting('defaultAspect', v)} />],
        ...(gen ? [['Loop theme', <Choice label="Loop theme" options={gen.THEME_OPTIONS} value={s.defaultTheme} onChange={(v) => setAppSetting('defaultTheme', v)} />]] : []),
        ['Clip to frame', <Switch label="Clip to frame" on={s.clipToFrame} onChange={(v) => setAppSetting('clipToFrame', v)} />],
        ['Modulation dots', <Switch label="Modulation dots" on={s.labsModDots} onChange={(v) => setAppSetting('labsModDots', v)} />],
      ]],
      ['Transport', [
        ['Autoplay', <Switch label="Autoplay" on={s.autoplay} onChange={(v) => setAppSetting('autoplay', v)} />],
        ['Loop length', <Choice label="Loop length" options={LOOP_LENGTH_OPTIONS} value={s.defaultLoopSeconds} onChange={(n) => { setAppSetting('defaultLoopSeconds', n); transport.setLoopSeconds(n) }} />],
      ]],
    ]} />
  )
}

/* the hub's About tab: the app's name over its text, Links, then the colophon (SettingsColophon) */
function About() {
  return (
    <div data-window="about">
      <LabeledControlSection variant="kolbox" label={APP.name}><p className="font-mono text-value text-muted">{APP.about}</p></LabeledControlSection>
      <LabeledControlSection variant="kolbox" label="Links">
        {APP.links.map((l) => (
          <LabeledControl variant="kolbox" horizontal key={l.label} label={l.label}>
            <a href={l.url} target="_blank" rel="noopener noreferrer" className="min-w-0 font-mono text-value break-all text-text hover:underline">{l.url}</a>
          </LabeledControl>
        ))}
      </LabeledControlSection>
      <LabeledControlSection variant="kolbox">
        <span className="flex flex-col font-mono text-value text-muted"><span>Kolkrabbi Vinnustofa</span><span>{new Date().getFullYear()}</span></span>
      </LabeledControlSection>
    </div>
  )
}

export default function WindowSettings({ onClose, view = 'editor', tab: first = 'settings' }) {
  const [tab, setTab] = useState(first)
  const editor = view === 'editor'
  return (
    <ModalDialog variant="kolbox"
      open
      onClose={onClose}
      title={editor ? 'Display settings' : 'Settings'}
      /* one height for the three tabs, so a tab never moves the window (the media picker's, the tallest window kolbox has) */
      className="h-modal-generator-height"
      footer={<Tooltip variant="kolbox" label="Reset to defaults"><Button variant="kolbox" iconOnly="refresh" aria-label="Reset to defaults" onClick={resetTo(editor ? DEFAULTS : HUB_DEFAULTS)}/></Tooltip>}
    >
      <div className="shrink-0 px-4 pb-2"><TabsRow variant="kolbox" tabs={TABS} value={tab} onChange={setTab} className="w-full" /></div>
      <div data-window="settings" data-tab={tab}>
        {tab === 'settings' ? (editor ? <EditorRows /> : <HubRows />) : tab === 'shortcuts' ? <ShortcutsList view={view} /> : <About />}
      </div>
    </ModalDialog>
  )
}
