import { ResultRow } from '@kolkrabbi/kol-workshop'

export const stage = 'md'

/* One row; the variant rides the toolbar picker (open questions Round 2, 2026-09-30). */
export const variants = ['underline', 'wash']

export default function ResultRowPreview({ variant = 'underline' }) {
  return (
    <div className="w-full border-t border-b border-fg-08">
      <ResultRow
        to="/documentation/16-app-anatomy"
        variant={variant}
        title="App anatomy"
        meta="doc · Documentation · docs · 2026-09-29"
        description="An app's six layers, engine to fixture"
      />
    </div>
  )
}
