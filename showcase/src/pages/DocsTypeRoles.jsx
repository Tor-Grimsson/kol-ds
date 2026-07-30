import { useState } from 'react'
import { CodeBlock, Table } from '@kolkrabbi/kol-component'
import { DocHeader, DocSection, DocTable, DocFigure } from '@kolkrabbi/kol-workshop'
import { SegGroup } from '../lib/icon-controls.jsx'

/**
 * Docs · Type roles — PREVIEW (interactive, controls exposed) above,
 * SPECS (the full-recipe sheets) below. The kol-doc-* + kol-card-* role
 * sets and the components that ride them (2026-07-28 epic).
 */


/* Specimen row — small meta label above the thing rendered as itself. */
function Spec({ label, children }) {
  return (
    <div className="flex flex-col gap-1.5 border-b border-fg-04 pb-5">
      <span className="kol-helper-10 uppercase tracking-widest text-fg-48">{label}</span>
      {children}
    </div>
  )
}

/* ── Preview samples ─────────────────────────────────────────────────────── */

const CODE_SAMPLES = {
  jsx: `import { DocHeader } from '@kolkrabbi/kol-workshop'\n\n// the one page-header contract\nexport default function Page() {\n  return <DocHeader eyebrow="KOL · Docs" title="Type roles" />\n}`,
  css: `.kol-prose pre,\n.kol-doc-code {\n  /* one text definition — the reference voice */\n  font-size: 14px;\n  line-height: 1.6;\n}`,
  bash: `pnpm publish --no-git-checks   # OTP-free via the granular token\nnode scripts/validate-roster.mjs`,
  json: `{\n  "name": "@kolkrabbi/kol-component",\n  "version": "0.12.5",\n  "dependencies": { "react-syntax-highlighter": "^15.6.6" }\n}`,
}

const TABLE_COLUMNS = [
  { accessor: 'token', header: 'Token' },
  { accessor: 'value', header: 'Value' },
  { accessor: 'notes', header: 'Notes', className: 'kol-table-cell-meta' },
]
const TABLE_ROWS = [
  { id: '1', token: '--kol-text-body-01', value: '16px', notes: 'lede rung' },
  { id: '2', token: '--kol-text-body-02', value: '14px', notes: 'body rung' },
  { id: '3', token: '--kol-radius-sm', value: '4px', notes: 'THE radius' },
]

export default function DocsTypeRoles() {
  const [lang, setLang] = useState('jsx')
  const [variant, setVariant] = useState('default')

  return (
    <>
      <DocHeader
        eyebrow="KOL · Docs"
        title="Type roles"
        lede="Preview first — components live, variants and options exposed. Specs below — the full recipe per role. kol-doc-* and kol-card-* ship in kol-theme; DocKit and CodeBlock ride them."
      />

      {/* ════ PREVIEW ════ */}

      <DocSection
        id="preview-code"
        title="Preview — CodeBlock"
        lede="The one authored-code apparatus, replicated from the elder reference: Prism oneDark highlighting, filename-or-language chip, 32px icon copy. Replicated 1:1 from the elder reference (oneDark, 14/1.6, 32px icon copy)."
      >
        <div className="flex items-center flex-wrap gap-6">
          <SegGroup label="LANG" options={['jsx', 'css', 'bash', 'json'].map((v) => ({ value: v, label: v.toUpperCase() }))} value={lang} onChange={setLang} />
        </div>
        {/* panel caps code — see kol-theme "Content widths" */}
        <div className="max-w-[var(--kol-content-panel)]">
          <CodeBlock language={lang} code={CODE_SAMPLES[lang]} />
        </div>
      </DocSection>

      <DocSection
        id="preview-table"
        title="Preview — Table"
        lede="The one table (kol-component), both variants. DocTable is a preset over it — fixed props columns, flush minimal, unframed."
      >
        <SegGroup label="VARIANT" options={[{ value: 'default', label: 'DEFAULT' }, { value: 'simple', label: 'SIMPLE' }]} value={variant} onChange={setVariant} />
        <Spec label={`Table · variant="${variant}"`}>
          <Table variant={variant} caption="Tokens" columns={TABLE_COLUMNS} rows={TABLE_ROWS} />
        </Spec>
        <Spec label="DocTable — the props preset (Table variant=simple + doc classes, unframed)">
          <DocTable
            rows={[
              { prop: 'eyebrow', type: 'string', def: '—', desc: 'Overline label above the title.' },
              { prop: 'title', type: 'string', def: '—', desc: 'The page H1.' },
              { prop: 'lede', type: 'string', def: '—', desc: 'Descriptive paragraph, 65ch cap.' },
            ]}
          />
        </Spec>
      </DocSection>

      <DocSection
        id="preview-kit"
        title="Preview — DocKit"
        lede="The composers, rendered whole. Frames here are page chrome for delimitation, not part of the components."
      >
        <Spec label="DocHeader — eyebrow + title + lede">
          <div className="rounded-[var(--kol-radius-sm)] border border-fg-08 p-6">
            <DocHeader
              eyebrow="KOL · Specimen"
              title="A page begins here"
              lede="The one page-header contract: eyebrow, heading, lede, fixed spacing — no page rolls its own."
            />
          </div>
        </Spec>
        <Spec label="DocSection — rule + anchored title + lede + content">
          <div className="rounded-[var(--kol-radius-sm)] border border-fg-08 p-6">
            <DocSection id="specimen-nested" title="An anchored section" lede="Top rule, section title, optional lede, then content.">
              <p className="kol-doc-body">Section content flows here.</p>
            </DocSection>
          </div>
        </Spec>
        <Spec label="DocFigure — framed container + caption">
          <DocFigure caption="DocFigure with its caption row.">
            <div className="flex min-h-24 items-center justify-center bg-fg-02 p-6">
              <span className="kol-doc-body">any content — image, video, live demo</span>
            </div>
          </DocFigure>
        </Spec>
      </DocSection>

      <DocSection
        id="preview-doc-roles"
        title="Preview — doc roles"
        lede="Every kol-doc-* text role rendered as itself, in reading order."
      >
        <Spec label="kol-doc-eyebrow · helper 10 caps">
          <span className="kol-doc-eyebrow">KOL · Design System</span>
        </Spec>
        <Spec label="kol-doc-heading · compact heading-03">
          <span className="kol-doc-heading">The quick brown fox jumps the lazy dog</span>
        </Spec>
        <Spec label="kol-doc-section-title · compact heading-04">
          <span className="kol-doc-section-title">Section title over running copy</span>
        </Spec>
        <Spec label="kol-doc-lede · sans body-01">
          <p className="kol-doc-lede">
            The lede sets the page in one or two sentences — big enough to read first, quiet enough to hand off to the body.
          </p>
        </Spec>
        <Spec label="kol-doc-body · sans body-02">
          <p className="kol-doc-body">
            Body copy one rung down, holding <code className="kol-doc-code-inline">inline code</code> without breaking rhythm.
          </p>
        </Spec>
        <Spec label="kol-doc-figure + kol-doc-caption">
          <figure className="kol-doc-figure">
            <div className="flex min-h-24 items-center justify-center bg-fg-02 p-6">
              <span className="kol-doc-body">framed content</span>
            </div>
            <figcaption className="kol-doc-caption border-t border-fg-08 px-4 py-2.5">Fig. 1 — the caption under a framed figure.</figcaption>
          </figure>
        </Spec>
        <Spec label="kol-doc-footer · mono 10/14, wrappable">
          <footer className="kol-doc-footer">
            Sources: kol-type-roles.css · updated 2026-07-28 · a footer can wrap across several lines without
            losing its rhythm because it rides the mono ramp, not the single-line helper ramp.
          </footer>
        </Spec>
      </DocSection>

      <DocSection
        id="preview-card-roles"
        title="Preview — card roles"
        lede="Each kol-card-* role as itself, then one sample card composed purely from the six."
      >
        <Spec label="kol-card-title · compact heading-05">
          <span className="kol-card-title">Card title over two comfortable lines</span>
        </Spec>
        <Spec label="kol-card-kicker · helper 12 caps">
          <span className="kol-card-kicker">Field notes</span>
        </Spec>
        <Spec label="kol-card-meta · helper 12">
          <span className="kol-card-meta">2026-07-28 · 6 min · 214 views</span>
        </Spec>
        <Spec label="kol-card-excerpt · mono 14/18, clamp 3">
          <p className="kol-card-excerpt" style={{ maxWidth: '42ch' }}>
            The excerpt voice is mono and quiet. It clamps at three lines by default, and a variant can change its
            depth with the clamp knob without ever re-picking the font stack — this fourth line proves the clamp.
          </p>
        </Spec>
        <Spec label="kol-card-value · mono 16 medium">
          <span className="kol-card-value">$1,240.00</span>
        </Spec>
        <Spec label="kol-card-tag · helper 10 caps">
          <span className="kol-card-tag">typography</span>
        </Spec>
        <Spec label="composed — all six roles, zero hand-picked classes">
          <div className="max-w-sm rounded-[var(--kol-radius-sm)] border border-fg-12 p-5 flex flex-col gap-3">
            <span className="kol-card-kicker">Field notes</span>
            <h3 className="kol-card-title">On monospace and the discipline of constraint</h3>
            <p className="kol-card-excerpt">
              Fixed grids force decisions early. The mono voice keeps card copy quiet and machine-flavored, and the
              clamp knob means a variant chooses its depth without re-picking a font stack.
            </p>
            <div className="flex items-center justify-between">
              <span className="kol-card-meta">2026-07-28 · 6 min</span>
              <span className="kol-card-value">$120</span>
            </div>
            <span className="kol-card-tag">typography</span>
          </div>
        </Spec>
      </DocSection>

      {/* ════ SPECS ════ */}

      <DocSection
        id="specs-doc"
        title="Specs — doc set (11 roles)"
        lede="The full recipe per role — the readable mirror of kol-type-roles.css. Furniture roles are twin-selectored with .kol-prose bare tags."
      >
        <DocTable
          rows={[
            { prop: '.kol-doc-eyebrow', type: 'mono · 10px/1 · 500 · ls 0.10em · uppercase', def: 'fg-meta', desc: 'Overline label above a title. Helper ramp — single-line only.' },
            { prop: '.kol-doc-heading', type: 'sans-compact · 32px (heading-03)/120% · 500', def: 'fg-emphasis', desc: 'Doc page H1 (the DocHeader contract).' },
            { prop: '.kol-doc-section-title', type: 'sans-compact · 24px (heading-04)/100% · 500', def: 'fg-emphasis', desc: 'Anchored section H2 (DocSection).' },
            { prop: '.kol-doc-lede', type: 'sans · 16px (body-01)/160% · 400 · ls 0.04em · max 65ch', def: 'fg-body', desc: 'Descriptive paragraph under a heading.' },
            { prop: '.kol-doc-body', type: 'sans · 14px (body-02)/160% · 400 · ls 0.04em', def: 'fg-body', desc: 'Doc running copy, one rung under the lede.' },
            { prop: '.kol-doc-code', type: 'mono · 14px/1.6 · 400 · pad 16/20 · r4', def: 'bg fg-04', desc: 'Code block text rule. Twin: .kol-prose pre. CodeBlock rides it.' },
            { prop: '.kol-doc-code-inline', type: 'mono · 0.875em · 400 · pad 0.1/0.35em · r4', def: 'bg fg-04', desc: 'Inline code. Twin: .kol-prose code.' },
            { prop: '.kol-doc-table', type: 'cells sans 14px/160% 400 · th mono 10px/1 400 ls 0.10em caps · value-cells mono 12px/16px', def: 'cells fg-body · th fg-meta', desc: 'Doc table classes. Twin: .kol-prose table.' },
            { prop: '.kol-doc-figure', type: 'border fg-12 · r4 · overflow hidden', def: '—', desc: 'Framed content container. Twin: .kol-prose figure.' },
            { prop: '.kol-doc-caption', type: 'mono · 12px/16px · 400 · ls 0.04em', def: 'fg-meta', desc: 'Figure caption. Twin: .kol-prose figcaption.' },
            { prop: '.kol-doc-footer', type: 'mono · 10px/14px · 400 · ls 0.04em · wrappable', def: 'fg-meta', desc: 'Closing chrome. Mono by law — helper is single-line only.' },
          ]}
        />
      </DocSection>

      <DocSection
        id="specs-card"
        title="Specs — card set (6 roles)"
        lede="The shared card text ramp — mono voice, compact sans titles, clamp knob."
      >
        <DocTable
          rows={[
            { prop: '.kol-card-title', type: 'sans-compact · 20px (heading-05)/125% · 500', def: 'fg-emphasis', desc: 'Card title.' },
            { prop: '.kol-card-kicker', type: 'mono · 12px/1 · 500 · ls 0.06em · uppercase', def: 'fg-64', desc: 'Label above the title. Single-line only.' },
            { prop: '.kol-card-meta', type: 'mono · 12px/1 · 500 · ls 0.06em', def: 'fg-48', desc: 'Date / author / counts line. Single-line.' },
            { prop: '.kol-card-excerpt', type: 'mono · 14px/18px · 400 · clamp var(--kol-card-excerpt-lines, 3)', def: 'fg-48', desc: 'Card copy; variant picks depth via the knob.' },
            { prop: '.kol-card-value', type: 'mono · 16px/22px · 500', def: 'fg-emphasis', desc: 'Price / stat value.' },
            { prop: '.kol-card-tag', type: 'mono · 10px/1 · 500 · ls 0.10em · uppercase', def: 'fg-48', desc: 'Tag chip text. Single-line.' },
          ]}
        />
      </DocSection>

      <DocSection
        id="specs-entry"
        title="Specs — one rule, two entry points"
        lede="Furniture roles are defined once and reached two ways: markdown/CMS output hits the .kol-prose tag selectors; authored markup hits the .kol-doc-* classes. Same rule, so they cannot drift."
      >
        <CodeBlock language="css" code={`.kol-prose pre,\n.kol-doc-code { /* one definition */ }\n\n.kol-prose table,\n.kol-doc-table { /* markdown tables + authored tables, same rule */ }`} />
        <p className="kol-doc-body">
          Everything is opt-in: the classes are inert until markup references them. Existing pages and cards keep
          their current stacks until a repo swaps.
        </p>
      </DocSection>
    </>
  )
}
