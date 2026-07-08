import { Table } from '@kolkrabbi/kol-component'
import DocLayout from '../lib/DocLayout.jsx'
import DocHeader, { DocSection } from '../lib/DocHeader.jsx'
import { LiveValue } from '../lib/resolve-css-var.jsx'
import { TYPOGRAPHY_SECTIONS } from '../data/typography.js'

/**
 * FoundationsTypography — the KOL typography reference, ported from the brand
 * app's Reference.jsx. Data lives in src/data/typography.js (verbatim mirror
 * of the brand data file); TYPE_COLUMNS + section rendering are ported
 * faithfully. Sizes and families resolve live from the installed theme CSS —
 * no px values are duplicated here, only token paths.
 */

// ─── Ported cell primitives (Reference.jsx) ──────────────────────

const TokenName = ({ children }) => (
  <code className="kol-helper-12 text-emphasis">{children}</code>
)

// ─── Typography column factories ─────────────────────────────────
// Keyed by name. Data file (src/data/typography.js) references these
// via string keys on each table's `columns` field. JSX render funcs can't live
// in pure data files; this is the bridge.

const TYPE_COLUMNS = {
  family: [
    { accessor: 'token', header: 'Token', render: (r) => <TokenName>{r.token}</TokenName> },
    { accessor: 'role',  header: 'Role' },
    { accessor: 'cut',   header: 'Cut (live)', render: (r) => <span><LiveValue token={r.token} /></span> },
  ],
  sans: [
    { accessor: 'cls',    header: 'Class',  render: (r) => <TokenName>{r.cls}</TokenName> },
    { accessor: 'sample', header: 'Sample',
      render: (r) => <span className={r.cls.replace(/^\./, '')}>Sample {r.cls.split('-').slice(-2).join('-')}</span> },
    { accessor: 'size',   header: 'Size',   render: (r) => r.tokenName ? <LiveValue token={r.tokenName} /> : '—' },
    { accessor: 'family', header: 'Family' },
    { accessor: 'weight', header: 'Weight' },
  ],
  prose: [
    { accessor: 'role',   header: 'Role',  render: (r) => <TokenName>{r.role}</TokenName> },
    { accessor: 'class',  header: 'Class', render: (r) => <TokenName>{r.class}</TokenName> },
    { accessor: 'family', header: 'Family' },
    { accessor: 'weight', header: 'Weight' },
    { accessor: 'size',   header: 'Size (live)', render: (r) => r.tokenName ? <LiveValue token={r.tokenName} /> : '—' },
  ],
  mono: [
    { accessor: 'cls',    header: 'Class',  render: (r) => <TokenName>{r.cls}</TokenName> },
    { accessor: 'sample', header: 'Sample',
      render: (r) => <span className={r.cls.replace(/^\./, '')}>{r.cls.replace(/^\./, '')}</span> },
    { accessor: 'size',   header: 'Size',   render: (r) => `${r.size}px` },
    { accessor: 'weight', header: 'Weight' },
    { accessor: 'lh',     header: 'LH',     render: (r) => typeof r.lh === 'number' ? `${r.lh}px` : r.lh },
    { accessor: 'ls',     header: 'LS' },
  ],
  descriptors: [
    { accessor: 'name',   header: 'Name',   render: (r) => <TokenName>.text-{r.name}</TokenName> },
    { accessor: 'pct',    header: '%',      render: (r) => `${r.pct}%` },
    { accessor: 'sample', header: 'Sample',
      render: (r) => <span className={`text-${r.name} font-mono`}>The quick brown fox</span> },
    { accessor: 'token',  header: 'Token',  render: (r) => <TokenName>{r.token}</TokenName> },
    { accessor: 'role',   header: 'Use' },
  ],
  cuts: [
    { accessor: 'family',  header: 'Family',  render: (r) => <TokenName>{r.family}</TokenName> },
    { accessor: 'weights', header: 'Weights' },
    { accessor: 'use',     header: 'Use' },
  ],
}

// ─── Section renderer ────────────────────────────────────────────
// Ported from Reference.jsx's SystemSection; PageSection (brand chapter
// chrome) becomes DocSection (the docs-shell section contract). DocSection's
// column gap replaces the brand mt-8 spacing.

function SystemSection({ section, columnsDict }) {
  return (
    <DocSection id={section.id} title={section.title} lede={section.intro}>
      {section.reasoning && (
        <div className="kol-prose max-w-[65ch]">
          <p className="text-meta">{section.reasoning}</p>
        </div>
      )}
      {section.tables.map((t, i) => (
        <Table
          key={`${section.id}-${i}`}
          caption={t.caption}
          columns={typeof t.columns === 'string' ? columnsDict[t.columns] : t.columns}
          rows={t.rows}
          variant="simple"
        />
      ))}
    </DocSection>
  )
}

// ─── Page ────────────────────────────────────────────────────────

const TOC = TYPOGRAPHY_SECTIONS.map((s) => ({ id: s.id, label: s.title }))

export default function FoundationsTypography() {
  return (
    <DocLayout wide toc={TOC}>
      <DocHeader
        eyebrow="KOL · Foundations"
        title="Typography"
        lede="Three sans cuts and one mono: family tokens, sans atomic classes, the .kol-prose container, the two mono scales, the reading-hierarchy descriptors, and every cut loaded. Sizes and families resolve live from the theme CSS — no px values are duplicated here, only token paths."
      />

      {/* Typography — data-driven from src/data/typography.js. Each
       * section carries its own label, intro, reasoning prose, and tables
       * (with a string `columns` key that resolves to TYPE_COLUMNS above). */}
      {TYPOGRAPHY_SECTIONS.map((section) => (
        <SystemSection key={section.id} section={section} columnsDict={TYPE_COLUMNS} />
      ))}
    </DocLayout>
  )
}
