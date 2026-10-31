import { PageHeader } from '@kolkrabbi/kol-component'
import { ThemeToggle } from '@kolkrabbi/kol-framework'
import { PageShell } from '@kolkrabbi/kol-shell'
import Stylesheet from './Stylesheet.jsx'

/* THE TOOL FRAME AS A REFERENCE PAGE (apps/style's shape): PageShell, the title-only masthead with the theme on the
 * right, then the sheet — 2000 wide at most, height hugs its content. */
export default function App() {
  return (
    <PageShell className="gap-10 [--kol-page-header-mb:0]">
      <div className="mx-auto flex w-full max-w-[2000px] flex-col gap-10">
        <PageHeader title="STYLESHEET" actions={<ThemeToggle fill="none" label={false} size="sm" />} />
        <Stylesheet />
      </div>
    </PageShell>
  )
}
