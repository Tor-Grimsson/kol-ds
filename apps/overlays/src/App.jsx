import { PageHeader } from '@kolkrabbi/kol-component'
import { ThemeToggle } from '@kolkrabbi/kol-framework'
import { PageShell } from '@kolkrabbi/kol-shell'
import Overlays from './Overlays.jsx'

/* THE TOOL FRAME AS A REFERENCE PAGE (app anatomy § Tool frame — apps/controls' shape): PageShell, the title-only
 * masthead with its control on the right, a list that scrolls. The list is Overlays.jsx — the showcase's Overlays
 * set mounts the same file. */
export default function App() {
  return (
    <PageShell className="gap-10 [--kol-page-header-mb:0]">
      <PageHeader title="OVERLAYS" actions={<ThemeToggle fill="none" label={false} size="sm" />} />
      <div className="mt-8"><Overlays /></div>
    </PageShell>
  )
}
