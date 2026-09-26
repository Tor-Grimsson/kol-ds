import { useRef, useState } from 'react'
import { Button, FullscreenOverlay, LabeledControlSection } from '@kolkrabbi/kol-component'
import { slideToPngBlob, deckToPdfBlob, deckToPptxBlob, saveBlob } from './slideExport.js'

/* taxonomy-ok: organism — FullscreenOverlay + LabeledControlSection as the deck's save / export / import sheet */

/**
 * DeckFile — save, export and import behind one sheet (kol-olina's brand decks; user 2026-09-03:
 * *"we rather have export import save load modal setup"*).
 *
 *   Save            — `onSave(slides)`, the consumer's database. Explicit, one write.
 *   PNG             — this slide, or every slide (2×).
 *   PDF             — the whole deck, a page per slide (the picture).
 *   PPTX            — the whole deck as editable slides for PowerPoint / Keynote.
 *   Deck file       — `.deck.json`, the document losslessly; Open reads one back.
 *
 * THREE TIERS, not competing: browser memory is the AUTOSAVE (every change, one browser), the deck
 * FILE is the portable copy, the DATABASE is the shared one. Every export runs SEQUENTIALLY — each
 * slide rasterises a full-size canvas.
 *
 * @param {boolean}  open · onClose
 * @param {string}   slug · name   the deck's key and title (file names use the slug)
 * @param {Array}    slides        `[{ id, doc }]`
 * @param {number}   active        the slide "this slide" means
 * @param {Function} onSave        (slides) => Promise — omit for no Save row
 * @param {Function} onImport      (slides) => void — replaces the deck (undoable in the editor)
 */
const stamp = () => new Date().toISOString().slice(0, 10)
export const DECK_FILE_KIND = 'kol.deck'
const KINDS = new Set([DECK_FILE_KIND, 'olina.deck'])

export default function DeckFile({ open, onClose, slug = 'deck', name, slides = [], active = 0, onSave, onImport }) {
  const [busy, setBusy] = useState(null)
  const [error, setError] = useState(null)
  const [done, setDone] = useState(null)
  const [progress, setProgress] = useState(null)
  const fileRef = useRef(null)

  const run = async (key, fn) => {
    setBusy(key); setError(null); setDone(null)
    try { await fn() } catch (err) { setError(err.message || String(err)) } finally { setBusy(null); setProgress(null) }
  }
  const none = !slides.length

  const save = () => run('save', async () => { await onSave(slides); setDone('Saved.') })
  const exportOne = () => run('one', async () => {
    saveBlob(await slideToPngBlob(slides[active].doc, 2), `${slug}-${String(active + 1).padStart(2, '0')}.png`)
  })
  const exportAll = () => run('all', async () => {
    for (let i = 0; i < slides.length; i += 1) {
      setProgress(`${i + 1}/${slides.length}`)
      saveBlob(await slideToPngBlob(slides[i].doc, 2), `${slug}-${String(i + 1).padStart(2, '0')}.png`)
    }
  })
  const exportPdf = () => run('pdf', async () => {
    saveBlob(await deckToPdfBlob(slides, { onProgress: (i, n) => setProgress(`${i + 1}/${n}`) }), `${slug}-${stamp()}.pdf`)
  })
  const exportPptx = () => run('pptx', async () => {
    saveBlob(await deckToPptxBlob(slides, { title: name ?? slug }), `${slug}-${stamp()}.pptx`)
  })
  const exportJson = () => run('json', async () => {
    const payload = { kind: DECK_FILE_KIND, version: 1, slug, name, exported: new Date().toISOString(), slides }
    saveBlob(new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }), `${slug}-${stamp()}.deck.json`)
  })
  const importJson = (file) => run('import', async () => {
    const parsed = JSON.parse(await file.text())
    /* validate before replacing — an unchecked import swaps the deck for whatever the file held */
    if (!KINDS.has(parsed?.kind) || !Array.isArray(parsed.slides)) throw new Error('Not a deck file.')
    if (!parsed.slides.every((s) => s?.doc && Array.isArray(s.doc.layers))) throw new Error('The file is a deck but its slides are malformed.')
    onImport?.(parsed.slides)
    onClose?.()
  })

  const label = (key, idle, working) => (busy === key ? (progress ? `${working} ${progress}` : `${working}…`) : idle)

  return (
    <FullscreenOverlay open={open} onClose={onClose}>
      <div className="w-[520px] max-w-[92vw] flex flex-col gap-5 p-6">
        <p className="kol-eyebrow text-fg-80">Deck file</p>

        {onSave && (
          <LabeledControlSection label="Save">
            <div className="flex items-center gap-2">
              <Button size="sm" variant="ghost" iconLeft="upload" disabled={!!busy} onClick={save}>{label('save', 'Save deck', 'Saving')}</Button>
              {done && <span className="kol-helper-10 text-fg-48">{done}</span>}
            </div>
          </LabeledControlSection>
        )}

        <LabeledControlSection label="Export">
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="ghost" iconLeft="download" disabled={!!busy || none} onClick={exportOne}>{label('one', 'PNG, this slide', 'Exporting')}</Button>
            <Button size="sm" variant="ghost" iconLeft="download" disabled={!!busy || none} onClick={exportAll}>{label('all', `PNG, all ${slides.length}`, 'PNG')}</Button>
            <Button size="sm" variant="ghost" iconLeft="download" disabled={!!busy || none} onClick={exportPdf}>{label('pdf', 'PDF, whole deck', 'PDF')}</Button>
            <Button size="sm" variant="ghost" iconLeft="download" disabled={!!busy || none} onClick={exportPptx}>{label('pptx', 'PPTX, whole deck', 'Building PPTX')}</Button>
            <Button size="sm" variant="ghost" iconLeft="file" disabled={!!busy} onClick={exportJson}>{label('json', 'Deck file (.deck.json)', 'Saving')}</Button>
          </div>
          <span className="kol-helper-10 text-fg-48">PPTX opens in PowerPoint and Keynote as editable slides, set in the fonts installed on that machine.</span>
        </LabeledControlSection>

        <LabeledControlSection label="Import">
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" iconLeft="folder" disabled={!!busy} onClick={() => fileRef.current?.click()}>{label('import', 'Open deck file', 'Reading')}</Button>
            <span className="kol-helper-10 text-fg-48">Replaces the slides in the editor.</span>
          </div>
          <input ref={fileRef} type="file" accept="application/json,.json" hidden
            onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ''; if (f) importJson(f) }} />
        </LabeledControlSection>

        {error && <p className="kol-mono-12 text-fg-64">{error}</p>}

        <div className="flex justify-end">
          <Button size="sm" variant="ghost" onClick={onClose}>Close</Button>
        </div>
      </div>
    </FullscreenOverlay>
  )
}
