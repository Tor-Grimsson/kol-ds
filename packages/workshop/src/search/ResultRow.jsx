import { Link } from 'react-router-dom'

/**
 * ResultRow — one search result: a title, a meta line, an optional description, the whole row a
 * link (2026-09-30, open questions Round 2 — the user: *"I like both, is this a component? if it
 * is I would just have it available as variants … underline is more appealing currently"*).
 *
 * Two variants, each a complete pair — the wash needs its x padding, the underline must not have
 * one (Round 1: x padding without a wash was drawn wrong):
 *   `underline` (default) — no ground; the title underlines and the row inks up on hover
 *   `wash`                — x padding and a ground wash on hover
 *
 * @param {string}    to           the route the row opens
 * @param {ReactNode} title        the result's name (a highlighted node is fine)
 * @param {string}    [meta]       kind · category · space · date
 * @param {ReactNode} [description]
 * @param {'underline'|'wash'} [variant='underline']
 */
const VARIANTS = {
  underline: { row: 'group flex flex-col gap-1 py-3 opacity-80 hover:opacity-100 focus-visible:opacity-100', title: 'group-hover:underline underline-offset-4' },
  wash: { row: 'flex flex-col gap-1 px-3 py-3 hover:bg-fg-04', title: '' },
}

export default function ResultRow({ to, title, meta, description, variant = 'underline' }) {
  const v = VARIANTS[variant] ?? VARIANTS.underline
  return (
    <Link to={to} className={v.row}>
      <span className={`kol-doc-body text-emphasis ${v.title}`.trim()}>{title}</span>
      {meta && <span className="kol-helper-12 text-subtle">{meta}</span>}
      {description && <span className="kol-doc-body">{description}</span>}
    </Link>
  )
}
