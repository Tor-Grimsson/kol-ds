import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@kolkrabbi/kol-component'
import ErrorBoundary from './ErrorBoundary.jsx'

/**
 * LandingWall — the landing page's card wall, for any kind (2026-10-01 — user: "can they have a
 * landing page when going from showcase landing page? so we can use this format to scroll through
 * components, blocks, apps, sets, packages").
 *
 * The wall is the landing's own: masonry columns sized by the wall's width (min card 20rem, cap 4
 * — viewport breakpoints cannot see the rails, 05-layout-systems § walls), a batch at a time with
 * Load more, and ONE column block per batch so a new batch lands under what is already read
 * instead of reshuffling it. `Tile` is the landing's labelled specimen frame; a kind may draw its
 * own card through `render`.
 *
 * @param {Array}    items    `[{ key, label, to, node }]`, or anything `render` understands
 * @param {Function} [render] `(item) => node` — the kind's own card in place of `Tile`
 * @param {number}   [batch]  cards per Load more (default 12)
 */
export function Tile({ label, to, className = '', style, children }) {
  return (
    <div className={`mb-5 break-inside-avoid overflow-hidden rounded border border-fg-08 bg-surface-primary p-4 ${className}`.trim()} style={style}>
      {to ? (
        <Link to={to} className="kol-helper-10 text-meta uppercase mb-3 block hover:text-emphasis hover:underline">
          {label}
        </Link>
      ) : (
        <p className="kol-helper-10 text-meta uppercase mb-3">{label}</p>
      )}
      <ErrorBoundary>{children}</ErrorBoundary>
    </div>
  )
}

export default function LandingWall({ items = [], render, batch = 12 }) {
  const [shown, setShown] = useState(batch)
  const card = (item) => (render
    ? <div key={item.key} className="mb-5 break-inside-avoid">{render(item)}</div>
    : <Tile key={item.key} label={item.label} to={item.to}>{item.node}</Tile>)
  return (
    /* the cards' own headings are sample content, not this page's outline */
    <div data-toc-skip>
      {Array.from({ length: Math.ceil(Math.min(shown, items.length) / batch) }, (_, b) => (
        <div key={b} className="gap-5 [columns:4_20rem]">
          {items.slice(b * batch, Math.min((b + 1) * batch, shown)).map(card)}
        </div>
      ))}
      {shown < items.length && (
        <div className="mt-4 flex justify-center">
          <Button onClick={() => setShown((n) => n + batch)}>Load more</Button>
        </div>
      )}
    </div>
  )
}
