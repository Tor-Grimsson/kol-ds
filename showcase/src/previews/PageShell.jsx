import { PageShell } from '@kolkrabbi/kol-shell'

export const frame = 420

/* The page scaffold of an app: the gutter and the ground, the content yours. */
export default function PageShellPreview() {
  return (
    <PageShell>
      <h1 className="kol-doc-heading">A page</h1>
      <p className="kol-doc-body">Everything inside sits on the page ladder's gutter.</p>
    </PageShell>
  )
}
