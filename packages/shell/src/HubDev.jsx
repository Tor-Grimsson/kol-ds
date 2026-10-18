import { useState } from 'react'
import { PageHeader, TabsRow } from '@kolkrabbi/kol-component'
import PageShell from './PageShell.jsx'

/* taxonomy-ok: organism — nests PageShell (relative) + kol-component's PageHeader / TabsRow */

const read = (key, fallback) => { try { return localStorage.getItem(key) ?? fallback } catch { return fallback } }
const write = (key, value) => { try { localStorage.setItem(key, value) } catch { /* private mode: the tab just resets */ } }

/**
 * HubDev — A hub's development page. The one rail row for everything that is not the app yet: experiments,
 * references, comparisons (CompareGridDevTab, kol-monitor 2026-10-17 — user: *"I would also maybe add
 * instructions for making the dev tab to the hub … localhost only using the </> icon"*). Each app had built
 * this page by hand and each read differently; this is the page made once, for reading.
 *
 * The shape: a small mono masthead with one line saying what the page is, the chip tabs on their own row under
 * it, then the tab's content at full width. Detail belongs in the
 * content's own toggles, not in more text here. The open tab is remembered per app.
 *
 * Rendered by `AppHub` / `AppStudio` from their `dev` prop, only on a dev server (`import.meta.env.DEV`),
 * at `/dev`, behind a `code` rail row after the app's own rows.
 *
 * @param {Array}  tabs        `[{ value, label, content }]`
 * @param {string} [title='Dev']
 * @param {string} [subtitle]  one line: what the page is
 * @param {string} [storageKey] where the open tab is remembered
 */
export default function HubDev({ tabs = [], title = 'Dev', subtitle = 'Experiments and reference, not the app', storageKey = 'kol-dev-tab' }) {
  const [stored, setStored] = useState(() => read(storageKey, tabs[0]?.value))
  const active = tabs.find((t) => t.value === stored) ?? tabs[0]
  const pick = (v) => { setStored(v); write(storageKey, v) }

  return (
    <PageShell className="gap-6">
      <PageHeader size="sm" voice="mono" title={title} subtitle={subtitle} />
      {tabs.length > 1 && (
        /* chip tabs — the ones ui.kolkrabbi.io's component pages use — and nothing between them and the
         * content (HubDevChrome, kol-monitor 2026-10-18 — user: *"why are we puttin sub description below the tabs?"*) */
        <TabsRow look="chip" tabs={tabs.map(({ value, label }) => ({ value, label }))} value={active?.value} onChange={pick} ariaLabel={title} />
      )}
      {active && <div className="min-w-0">{active.content}</div>}
    </PageShell>
  )
}
