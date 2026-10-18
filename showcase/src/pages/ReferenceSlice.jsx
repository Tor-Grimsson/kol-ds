import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { DocHeader, DocSection } from '@kolkrabbi/kol-workshop'
import ChapterHome from '../lib/ChapterHome.jsx'
import { useGraph, NodeTable } from './References.jsx'
import { KIND_SLICES, concernsOf, concernLabel, sliceHref } from '../lib/referenceTree.js'

/**
 * ReferenceSlice — one slice of the reference graph (2026-10-17): a kind (`/references/tokens`) or a
 * concern inside it (`/references/tokens/color`). A kind with concerns is a group: its home, its concern
 * pages, then its whole ranking. A leaf is its ranking alone.
 */
export default function ReferenceSlice({ slug }) {
  const { concern } = useParams()
  const { kind, label } = KIND_SLICES.find((k) => k.slug === slug)
  const { nodes, threshold } = useGraph()
  const rows = useMemo(() => nodes.filter((n) => n.kind === kind && (!concern || n.concern === concern)), [nodes, kind, concern])
  const concerns = concernsOf(kind)
  const ranked = (
    <DocSection id="ranked" title="Ranked">
      <NodeTable nodes={rows} threshold={threshold} title={concern ? concernLabel(concern) : label} caption={`${concern ? `${concernLabel(concern)} ` : ''}${label.toLowerCase()} ranked by weighted inbound`} />
    </DocSection>
  )

  if (!concern && concerns.length) {
    return (
      <ChapterHome home={`references-${slug}`} title="Concerns" noteHeader="Nodes"
        items={concerns.map(({ concern: c, count }) => ({ to: sliceHref(slug, c), label: concernLabel(c), note: String(count) }))}>
        <div className="mt-8">{ranked}</div>
      </ChapterHome>
    )
  }
  return (
    <>
      <DocHeader eyebrow={concern ? `References · ${label}` : 'References'} title={concern ? concernLabel(concern) : label}
        lede={`${rows.length} ${concern ? `${concern} ${label.toLowerCase()}` : label.toLowerCase()}, ranked by weighted inbound. ● marks a canon candidate (${threshold}★ and up).`} />
      <div className="mt-8">{ranked}</div>
    </>
  )
}
