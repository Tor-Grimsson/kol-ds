import { Link, useParams } from 'react-router-dom'
import { DocHeader, DocSection } from '@kolkrabbi/kol-workshop'
import { Table } from '@kolkrabbi/kol-component'
import ChapterHome from '../lib/ChapterHome.jsx'
import PreviewCard from '../lib/PreviewCard.jsx'
import { TEMPLATES, HEADERS, templateHref, blockHref } from '../lib/templates-registry.js'
import { TEMPLATE_BLOCKS } from '../templates/blocks.jsx'

/**
 * Templates (W6, 2026-10-17) — Library › Composition › Templates: the home, one page per template, and the
 * Blocks a body is made of. A template page reads like a component page: the live preview, then its anatomy
 * (header · blocks), what it is built from and who uses it.
 */
const linkCls = 'kol-doc-body underline decoration-fg-16 underline-offset-4 hover:decoration-fg-64'
const BLOCK_BY_SLUG = Object.fromEntries(TEMPLATE_BLOCKS.map((b) => [b.slug, b]))

export function TemplatesHome() {
  return (
    <ChapterHome home="templates" title="Templates" noteHeader="Header"
      items={[...TEMPLATES.map((t) => ({ to: templateHref(t.slug), label: t.title, note: t.headers.map((h) => HEADERS[h].label).join(' + ') })),
        { to: '/templates/blocks', label: 'Blocks', note: `${TEMPLATE_BLOCKS.length} — what a body is made of` }]}>
      <DocSection id="headers" title="Headers">
        <Table width="column" caption="The header styles a template can carry"
          columns={[{ accessor: 'label', header: 'Header' }, { accessor: 'kind', header: 'From' }, { accessor: 'note', header: 'What it is' }]}
          rows={Object.entries(HEADERS).map(([id, h]) => ({ id, ...h }))} />
      </DocSection>
    </ChapterHome>
  )
}

export function TemplatePage() {
  const { slug } = useParams()
  const t = TEMPLATES.find((x) => x.slug === slug)
  if (!t) return <DocHeader title="Unknown template" lede={`No template named “${slug}”.`} />
  const entry = t.entry()
  return (
    <>
      <DocHeader eyebrow="Templates" title={t.title} lede={t.description} />
      <div className="mt-8 flex flex-col gap-10">
        <DocSection id="preview" title="Preview">
          {entry ? <PreviewCard entry={entry} cap="content" /> : <p className="kol-mono-12 text-meta">No preview yet.</p>}
        </DocSection>
        <DocSection id="anatomy" title="Anatomy">
          <Table width="column" caption={`${t.title}: header and blocks`}
            columns={[{ accessor: 'part', header: 'Part' }, { accessor: 'what', header: 'What', render: (r) => r.to ? <Link className={linkCls} to={r.to}>{r.what}</Link> : r.what }, { accessor: 'note', header: '' }]}
            rows={[...t.headers.map((h) => ({ id: `h-${h}`, part: 'Header', what: HEADERS[h].label, note: `${HEADERS[h].kind} — ${HEADERS[h].note}` })),
              ...t.blocks.map((b) => ({ id: `b-${b}`, part: 'Block', what: BLOCK_BY_SLUG[b].title, to: blockHref(b), note: BLOCK_BY_SLUG[b].description }))]} />
        </DocSection>
        <DocSection id="built-from" title="Built from">
          <ul className="flex flex-col gap-2">{t.builtFrom.map(([name, to]) => <li key={name}>{to ? <Link className={linkCls} to={to}>{name}</Link> : <span className="kol-doc-body">{name}</span>}</li>)}</ul>
        </DocSection>
        <DocSection id="used-by" title="Used by">
          <ul className="flex flex-col gap-2">{t.usedBy.map((u) => <li key={u} className="kol-doc-body">{u}</li>)}</ul>
        </DocSection>
      </div>
    </>
  )
}

export function BlocksHome() {
  return <ChapterHome home="templates-blocks" title="Blocks" noteHeader="What it is" items={TEMPLATE_BLOCKS.map((b) => ({ to: blockHref(b.slug), label: b.title, note: b.description }))} />
}

export function BlockPage() {
  const { slug } = useParams()
  const b = BLOCK_BY_SLUG[slug]
  if (!b) return <DocHeader title="Unknown block" lede={`No block named “${slug}”.`} />
  const usedIn = TEMPLATES.filter((t) => t.blocks.includes(slug))
  return (
    <>
      <DocHeader eyebrow="Templates · Blocks" title={b.title} lede={b.description} />
      <div className="mt-8 flex flex-col gap-10">
        <DocSection id="preview" title="Preview">
          <div className="kol-doc-figure p-6"><b.Preview /></div>
        </DocSection>
        <DocSection id="built-from" title="Built from">
          <ul className="flex flex-col gap-2">{b.builtFrom.map((x) => <li key={x} className="kol-doc-body">{x}</li>)}</ul>
        </DocSection>
        <DocSection id="used-in" title="Used in">
          {usedIn.length ? <ul className="flex flex-col gap-2">{usedIn.map((t) => <li key={t.slug}><Link className={linkCls} to={templateHref(t.slug)}>{t.title}</Link></li>)}</ul> : <p className="kol-doc-body text-meta">No template names this block yet.</p>}
        </DocSection>
      </div>
    </>
  )
}
