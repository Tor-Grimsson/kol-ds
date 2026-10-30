import { useState } from 'react'
import ThemeToggle from '@kolkrabbi/kol-framework/src/ThemeToggle.jsx'
import { useTheme } from '@kolkrabbi/kol-framework/src/theme.js'
import { Button, LabeledControlSection, RailFoot, SettingsFooter, SettingsPanel, SettingsSections, TabsRow } from '@kolkrabbi/kol-component'
import SettingsLinks, { SettingsColophon } from './SettingsLinks.jsx'
import About from './About.jsx'

/* taxonomy-ok: organism — nests SettingsLinks / About (relative) + kol-component's SettingsPanel / SettingsSections / TabsRow */

/**
 * HubSettingsRail — The hub's settings rail. AppHub's rail tier, lifted out of AppHub as it was
 * (WorkshopSettingsRailAndBars, kol-hq 2026-10-29 — user: *"this should be implemented on workshop as well … I dont want
 * any reinventions"*), so kol-workshop's `ShellLayout` opens the same rail: Settings · Shortcuts · About · Docs, the
 * theme toggle and a live reset in the footer.
 *
 * @param {boolean}  open · onClose
 * @param {string}   title       default `Settings`
 * @param {Array}    sections    the Settings tab's rows (`SettingsSections` shape); omitted, there is no Settings tab and
 *                               no named tabs (AppHub's account-only rail)
 * @param {Object}   app         `{ name, about, links, docs }` — About draws from `about` + `links`, Docs from `docs`
 * @param {Array}    shortcuts   `[{ section, items: [{ id, label, combo }] }]` — the Shortcuts tab
 * @param {Object}   account     `{ content, sections, footer }` — the Account tab, first, while signed in; `footer: { label, onPress }`
 *                               is the rail's foot on that tab — a full-width md Button where the toggle and reset sit on the
 *                               other tabs (frame D2, HubSignedOutGutterAndSeams 2026-10-29)
 * @param {string}   tab · onTabChange   controlled tab (optional — the rail keeps its own otherwise)
 * @param {Function} onReset     the app's reset, after the theme goes back to the system
 */

/* THE TOGGLE'S PROPS ARE THE HUB'S — studio-hub's `fill="none" label={false} size="sm"`, nothing else */
export const hubThemeToggle = <ThemeToggle variant="button" fill="none" label={false} size="sm" tone="default" />

/* THE RAIL'S NAMED TABS — drawn here, from what the Hub already holds, so a consumer passes a word and no JSX */
const RAIL_TABS = {
  shortcuts: {
    label: 'Shortcuts',
    draw: ({ shortcuts }) => <SettingsSections divided sections={shortcuts.map((s) => ({ label: s.section, rows: (s.items ?? []).map((k, i) => ({ id: k.id ?? `${i}:${k.label}`, label: k.label, value: k.combo ?? k.keys })) }))} />,
  },
  about: {
    label: 'About',
    /* the links draw under About (SettingsRailDocsTab, kol-mirror 2026-10-24): Repo's list folds in here, so the row's
     * fourth word can be Docs and it stays one line */
    draw: ({ app }) => (
      <div className="flex flex-col gap-8">
        {app.about && <LabeledControlSection label={app.name}><About about={app.about} /></LabeledControlSection>}
        {app.links?.length > 0 && <LabeledControlSection label="Links"><SettingsLinks links={app.links} /></LabeledControlSection>}
        <SettingsColophon />
      </div>
    ),
  },
  docs: {
    label: 'Docs',
    /* an app's explanatory prose AS DATA — `app.docs: [{ label, paragraphs }]`, each a section in About's voice, out of
     * the settings sections' notes (user, on mirror's rail: *"settings are so overloaded with information that its hard to
     * navigate … we should just start a documentation tab for it"*). No JSX: `About` warns on a node */
    draw: ({ app }) => (
      <div className="flex flex-col gap-8">
        {app.docs.map((d, i) => <LabeledControlSection key={d.label ?? i} label={d.label}><About about={d.paragraphs ?? d.text} /></LabeledControlSection>)}
      </div>
    ),
  },
}

export default function HubSettingsRail({ open, onClose, title = 'Settings', sections, app = {}, shortcuts = [], account, tab: tabProp, onTabChange, onReset }) {
  const [ownTab, setOwnTab] = useState('settings')
  const theme = useTheme()
  const hasSettings = sections != null
  /* THE RAIL'S TABS, the same four on every hub: Settings · Shortcuts · About · Docs, the three from what the app already
   * passes — Repo's links sit under About since SettingsRailDocsTab, so the fourth word is the app's prose, `app.docs`,
   * drawn when it has any */
  const railTabs = hasSettings ? [
    ...(shortcuts.length ? [{ value: 'shortcuts', label: RAIL_TABS.shortcuts.label, named: RAIL_TABS.shortcuts }] : []),
    ...((app.about || app.links?.length) ? [{ value: 'about', label: RAIL_TABS.about.label, named: RAIL_TABS.about }] : []),
    ...(app.docs?.length ? [{ value: 'docs', label: RAIL_TABS.docs.label, named: RAIL_TABS.docs }] : []),
  ] : []
  /* the Account tab first, while signed in (SettingsAccountTab); then Settings and the Hub's named tabs */
  const tabs = [...(account ? [{ id: 'account', label: 'Account' }] : []), ...(hasSettings ? [{ id: 'settings', label: 'Settings' }] : []), ...railTabs.map((t) => ({ id: t.value, label: t.label }))]
  const want = tabProp ?? ownTab
  const tab = tabs.some((t) => t.id === want) ? want : tabs[0]?.id
  const setTab = onTabChange ?? setOwnTab
  /* reset, live everywhere: the theme back to the system, then the app's own */
  const reset = () => { theme.clear(); onReset?.() }

  return (
    /* THE RAIL tier — studio-hub's, the template (user 2026-10-24: *"In studio what kind of settings tier is there? ITS A
     * RAIL"*): `sections` in the rail, the theme toggle (the Hub's props) and reset in its footer; with tabs, a text
     * TabsRow under the header — never a page */
    <SettingsPanel
      open={open}
      variant="rail"
      title={title}
      onClose={onClose}
      /* the footer on every rail: the toggle, and a live reset — on the Account tab, `account.footer` instead: frame D2's
         full-width md Button in the rail's foot (HubSignedOutGutterAndSeams, kol-fxr 2026-10-29 — user: *"wrong button for
         sign out, wrong sizes"*; it was an outline sm chip at the end of the tab body) */
      footer={tab === 'account' && account?.footer
        ? <RailFoot><Button size="md" className="w-full" onClick={account.footer.onPress}>{account.footer.label}</Button></RailFoot>
        : <SettingsFooter onReset={reset}>{hubThemeToggle}</SettingsFooter>}
    >
      {/* the tab row wraps in the 380 rail — five tabs (Mirror's Performance beside the Hub's three) overran it */}
      {tabs.length > 1 && <TabsRow variant="text" size={12} tracked overflow="wrap" className="gap-x-6" tabs={tabs} value={tab} onChange={setTab} ariaLabel="Settings tabs" />}
      {tab === 'account'
        ? (
          <div className="flex flex-col gap-8">
            {account.content}
            {account.sections?.length > 0 && <SettingsSections sections={account.sections} divided />}
          </div>
        )
        : tab === 'settings'
          ? (sections?.length > 0 && <SettingsSections sections={sections} divided />)
          : railTabs.find((x) => x.value === tab)?.named?.draw({ app, shortcuts })}
    </SettingsPanel>
  )
}
