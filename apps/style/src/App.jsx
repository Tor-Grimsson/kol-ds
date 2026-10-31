import { PageHeader } from '@kolkrabbi/kol-component'
import { ThemeToggle } from '@kolkrabbi/kol-framework'
import { PageShell } from '@kolkrabbi/kol-shell'
import Style from './Style.jsx'

/* THE TOOL FRAME AS A REFERENCE PAGE (apps/overlays' shape): PageShell, the title-only masthead with its control on the
 * right, a list that scrolls. The list is Style.jsx — A beside B. */
export default function App() {
  return (
    <PageShell className="gap-10 [--kol-page-header-mb:0]">
      <PageHeader title="STYLE" actions={<ThemeToggle fill="none" label={false} size="sm" />} />
      <div className="mt-8"><Style /></div>
    </PageShell>
  )
}
