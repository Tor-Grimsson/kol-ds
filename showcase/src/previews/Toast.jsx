import { Toast } from '@kolkrabbi/kol-component'

export const stage = 'hug'

/* kolbox's toast (plan-2026-11-18-kolbox-system W31.2 batch 4): one row, the message and one Link, on the floating surface */
export default function ToastPreview() {
  return <Toast message="Saved" action="Show in Files" onAction={() => {}} />
}
