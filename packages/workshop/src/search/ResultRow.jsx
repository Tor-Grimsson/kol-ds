/**
 * @deprecated — use kol-component's `ContentRow` (variant `article`, `media={false}`). ResultRow was
 * minted 2026-09-30 for the search page while the design system already shipped its row; it
 * forwards to ContentRow and drops at 30 days on the retirement ledger. `variant` is ignored.
 */

import { useNavigate } from 'react-router-dom'
import { ContentRow } from '@kolkrabbi/kol-component'

/**
 * @deprecated — use kol-component's `ContentRow` (variant `article`, `media={false}`). ResultRow was
 * minted 2026-09-30 for the search page while the design system already shipped its row; it
 * forwards to ContentRow and drops at 30 days on the retirement ledger. `variant` is ignored.
 */
export default function ResultRow({ to, title, meta, description }) {
  const navigate = useNavigate()
  return (
    <ContentRow
      variant="article"
      media={false}
      href={to}
      onNavigate={(e) => { e.preventDefault(); navigate(to) }}
      eyebrow={meta}
      title={title}
      body={description}
    />
  )
}
