import { Link } from '@kolkrabbi/kol-component'

export const stage = 'hug'

/* kolbox's text action (plan-2026-11-18-kolbox-system W31.2): a toast's "Show in …", a share sheet's "Copy link" */
export default function LinkPreview() {
  return (
    <span className="flex items-center gap-3">
      <span className="kol-kolbox-help text-oq-80">File moved</span>
      <Link onClick={() => {}}>Show in folder</Link>
    </span>
  )
}
