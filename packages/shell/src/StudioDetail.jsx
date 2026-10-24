import { useState } from 'react'
import { Button, Divider, SectionText, useMediaQuery } from '@kolkrabbi/kol-component'
import PageShell from './PageShell.jsx'

/* taxonomy-ok: organism — nests PageShell (relative) + kol-component's SectionText, Divider, Button */

/**
 * StudioDetail — A module's or a patch's own page. one page for the thing a Library card opens — a module, a
 * patch, a file — in every Studio app (plan home-library-detail-one-card 3.1, 2026-10-24; user, on the three
 * hand-written pages: *"why was this not designed for in rack-hub"* · *"what back is this"*).
 *
 * kol-monitor wrote it first (`ModuleDetailPage`, 2026-09-02), kol-mirror ported it, the rack-hub twin copied it
 * back, and each kept its own Back (a pill, a span), its own heading classes and its own button row. The page is
 * made here once, from DATA, and an app passes nothing it draws itself:
 *
 *   ‹ Back                      the eyebrow of the masthead — a TEXT LINK, never a Button (history back by default)
 *   Title / subtitle            `SectionText level="app"` (the app masthead, the DS's one)
 *   Description                 sentences
 *   Controls · Specifications   sections of rows — `{ kind?, label, value?, hint? }` or a text row
 *   Code                        the first lines, "View full source" opening the whole file in an overlay
 *   the preview                 the right column (a desk: 50 %; a phone: a 160 band above) — click to expand
 *   the actions                 `[{ label, onClick }]`, drawn as DS Buttons under a hairline
 *
 * The prose is `kol-mono-12` (line-height-bearing), the section labels `kol-helper-14` — kol-monitor's rungs, kept.
 *
 * @param {{ label?: string, onClick?: Function }} [back]  the eyebrow link; `onClick` defaults to `history.back()`
 * @param {ReactNode} title · subtitle   the masthead
 * @param {string|string[]} [description]  prose — a string is split into sentences, an array is drawn as given
 * @param {Array}  [sections]  `[{ label, rows: [{ kind?, label, value?, hint? }], text? }]` — `kind` (Knob · Input) in a
 *                             56 column, `label` in 72, `value` flexes, `hint` (a range, a signal) at the right edge;
 *                             a section with `text` (string | string[]) instead of rows draws paragraphs
 * @param {{ source: string, filename?: string, lines?: number }} [code]  the source; the page shows `lines` (5) and an
 *                             overlay with the whole file and its download
 * @param {ReactNode|{ src: string, alt?: string, contain?: boolean }} [preview]  the right column — an image (click
 *                             to expand) or the consumer's node (a rendered module front)
 * @param {Array}  [actions]   `[{ label, onClick, icon? }]` — the bottom row, DS `Button tone="grey" size="md"`
 * @param {{ title: string, subtitle?: string }} [notFound]  draw the not-found masthead instead of the page
 * @param {string} [className] on the shell
 */
export default function StudioDetail({ back, title, subtitle, description, sections = [], code, preview, actions = [], notFound, className = '' }) {
  const narrow = useMediaQuery('(max-width: 767px)')
  const [fullView, setFullView] = useState(false)
  const [codeView, setCodeView] = useState(false)
  if (notFound) {
    return (
      <PageShell className={className}>
        {/* the subtitle keeps the masthead on every other page's rung; the requested id is the one fact the reader is missing */}
        <SectionText level="app" headline={notFound.title} body={notFound.subtitle} />
      </PageShell>
    )
  }
  const goBack = back?.onClick ?? (() => window.history.back())
  const sentences = Array.isArray(description) ? description : typeof description === 'string'
    ? description.split('. ').filter(Boolean).map((s) => (s.endsWith('.') ? s : `${s}.`)) : []
  const lines = code?.source ? code.source.split('\n').slice(0, code.lines ?? 5).join('\n') : null
  const downloadSource = () => {
    const blob = new Blob([code.source], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = code.filename ?? 'source.txt'; a.click()
    URL.revokeObjectURL(url)
  }
  const image = preview && typeof preview === 'object' && 'src' in preview ? preview : null
  const heading = (label) => <h2 className="kol-helper-14 text-fg-80" style={{ marginBottom: 16 }}>{label}</h2>

  return (
    <PageShell mode={narrow ? 'scroll' : 'fixed'} className={className}>
      <SectionText
        level="app"
        /* ‹ Back — a text link in the eyebrow, history back; from Create it returns there, from Library to Library */
        eyebrow={<span onClick={goBack} className="kol-helper-12 text-fg-48 hover:text-fg-96 cursor-pointer select-none">‹ {back?.label ?? 'Back'}</span>}
        headline={title}
        body={subtitle}
      />
      <Divider className="mb-6" />

      <div className="flex" style={{ flexDirection: narrow ? 'column' : 'row', gap: narrow ? 24 : 48, flex: 1, minHeight: 0 }}>
        {/* the prose column */}
        <div className="flex flex-col justify-between" style={{ flex: 1, overflow: narrow ? 'visible' : 'auto', paddingTop: 4, paddingBottom: 4 }}>
          <div className="flex flex-col" style={{ gap: 32 }}>
            {sentences.length > 0 && (
              <div>
                {heading('Description')}
                <div className="flex flex-col" style={{ gap: 8 }}>
                  {sentences.map((s, i) => <div key={i} className="kol-mono-12 text-fg-48">{s}</div>)}
                </div>
              </div>
            )}
            {sections.map((sec) => (
              <div key={sec.label}>
                {heading(sec.label)}
                <div className="flex flex-col" style={{ gap: 8 }}>
                  {sec.text != null
                    ? (Array.isArray(sec.text) ? sec.text : [sec.text]).map((t, i) => <div key={i} className="kol-mono-12 text-fg-48">{t}</div>)
                    : (sec.rows ?? []).map((row, i) => (
                      /* kind · label · value · hint — below 768 the value takes its own line so the row never clips sideways */
                      <div key={i} className="flex" style={{ gap: 12, alignItems: 'baseline', flexWrap: narrow ? 'wrap' : 'nowrap' }}>
                        {row.kind != null && <span className="kol-mono-12 text-fg-32" style={{ width: 56, flexShrink: 0 }}>{row.kind}</span>}
                        <span className="kol-mono-12 text-fg-64" style={row.value != null ? { width: 72, flexShrink: 0 } : undefined}>{row.label}</span>
                        {row.value != null && <span className="kol-mono-12 text-fg-48" style={{ flex: narrow ? '1 1 100%' : 1 }}>{row.value}</span>}
                        {row.hint != null && <span className="kol-mono-12 text-fg-32" style={{ flexShrink: 0 }}>{row.hint}</span>}
                      </div>
                    ))}
                </div>
              </div>
            ))}
            {lines && (
              <div>
                {heading('Code')}
                <pre className="kol-mono-12 text-fg-32" style={{ margin: 0, overflow: 'hidden' }}>{lines}</pre>
                <span className="kol-helper-10 text-fg-48 hover:text-fg-96 cursor-pointer inline-block" style={{ marginTop: 8 }} onClick={() => setCodeView(true)}>View full source</span>
              </div>
            )}
          </div>

          {actions.length > 0 && (
            /* the row clears the phone bar or pill when the shell draws one (`--kol-shell-bar-clear`, StudioCreate's rule) */
            <div className="flex flex-col" style={{ gap: 16, marginTop: 32, paddingBottom: 'var(--kol-shell-bar-clear, 0px)' }}>
              <Divider />
              <div className="flex" style={{ gap: 12 }}>
                {actions.map((a) => <Button key={a.label} tone="grey" size="md" iconLeft={a.icon} onClick={a.onClick}>{a.label}</Button>)}
              </div>
            </div>
          )}
        </div>

        {/* the preview column */}
        {preview && (
          image ? (
            <div
              className="kol-detail-preview bg-surface-tertiary border border-fg-08 relative cursor-pointer overflow-hidden"
              onClick={() => setFullView(true)}
              style={{ flex: narrow ? '0 0 auto' : '0 0 50%', order: narrow ? -1 : 0, height: narrow ? 160 : undefined, borderRadius: 4, padding: narrow ? 12 : 24 }}
            >
              <img src={image.src} alt={image.alt ?? ''} className="size-full" style={{ objectFit: image.contain ? 'contain' : 'cover' }} />
              <div className="kol-detail-preview-overlay absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.6)', opacity: 0, transition: 'opacity 0.2s' }}>
                <span className="kol-helper-12 text-fg-64">{narrow ? 'Tap to expand' : 'Click to expand'}</span>
              </div>
            </div>
          ) : (
            <div style={{ flex: narrow ? '0 0 auto' : '0 0 50%', order: narrow ? -1 : 0, minWidth: 0 }}>{preview}</div>
          )
        )}
      </div>

      {fullView && image && (
        <div onClick={() => setFullView(false)} className="fixed inset-0 flex items-center justify-center cursor-pointer" style={{ zIndex: 'var(--kol-z-modal)', background: 'rgba(0,0,0,0.9)' }}>
          <span onClick={(e) => { e.stopPropagation(); setFullView(false) }} className="kol-helper-12 text-fg-48 hover:text-fg-96 absolute cursor-pointer" style={{ top: 24, right: 24 }}>Close</span>
          <img src={image.src} alt={image.alt ?? ''} style={{ maxWidth: '90vw', maxHeight: '90vh', objectFit: 'contain' }} />
        </div>
      )}
      {codeView && code?.source && (
        <div onClick={() => setCodeView(false)} className="fixed inset-0 flex items-center justify-center cursor-pointer" style={{ zIndex: 'var(--kol-z-modal)', background: 'rgba(0,0,0,0.9)' }}>
          <div className="absolute flex items-center" style={{ top: 24, right: 24, gap: 16 }}>
            <span onClick={(e) => { e.stopPropagation(); downloadSource() }} className="kol-helper-12 text-fg-48 hover:text-fg-96 cursor-pointer">Download</span>
            <span onClick={(e) => { e.stopPropagation(); setCodeView(false) }} className="kol-helper-12 text-fg-48 hover:text-fg-96 cursor-pointer">Close</span>
          </div>
          <pre onClick={(e) => e.stopPropagation()} className="kol-mono-12 text-fg-64" style={{ maxWidth: '85vw', maxHeight: '85vh', overflow: 'auto', padding: 32, margin: 0, cursor: 'text', userSelect: 'text' }}>{code.source}</pre>
        </div>
      )}
    </PageShell>
  )
}
