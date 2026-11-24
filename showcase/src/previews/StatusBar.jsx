import { useState } from 'react'
import { Button, Dropdown, StatusBar } from '@kolkrabbi/kol-component'

export const stage = 'full'

/* a document's status bar (Folio on kolbox, 2026-11-22): the counts, then the format, the language, the zoom and the encoding */
export const variants = ['kolbox', 'folio']

const FORMATS = [{ value: 'md', label: 'Markdown' }, { value: 'rich', label: 'Text' }, { value: 'code', label: 'Code' }]
const LANGS = [{ value: 'js', label: 'JavaScript' }, { value: 'css', label: 'CSS' }, { value: 'py', label: 'Python' }]

export default function StatusBarPreview({ variant = 'kolbox' }) {
  const [format, setFormat] = useState('code')
  const [lang, setLang] = useState('js')
  const [zoom, setZoom] = useState(100)
  const left = '212 words      1204 characters      18 lines'
  if (variant === 'folio') return (
    <div className="w-full">
      <StatusBar variant="folio" left={left}>
        <Dropdown variant="folio" ariaLabel="Format" align="bottom-right" value={format} onChange={setFormat} options={FORMATS} />
        <Dropdown variant="folio" ariaLabel="Language" align="bottom-right" value={lang} onChange={setLang} options={LANGS} />
        <span className="flex items-center">
          <Button variant="folio" aria-label="Zoom out" onClick={() => setZoom((z) => z - 10)} className="w-[32px] justify-center px-0">−</Button>
          <span className="w-[48px] text-center tabular-nums">{zoom}%</span>
          <Button variant="folio" aria-label="Zoom in" onClick={() => setZoom((z) => z + 10)} className="w-[32px] justify-center px-0">+</Button>
        </span>
        <span style={{ color: 'var(--kol-folio-muted)' }}>{'UTF-8      LF'}</span>
      </StatusBar>
    </div>
  )
  return (
    <div className="w-full">
      <StatusBar left={left}>
        <Dropdown variant="kolbox" tone="grey" size="xs" ariaLabel="Format" value={format} onChange={setFormat} options={FORMATS} />
        <Dropdown variant="kolbox" tone="grey" size="xs" ariaLabel="Language" value={lang} onChange={setLang} options={LANGS} />
        <span className="flex items-center gap-1">
          <Button variant="kolbox" iconOnly="minus" aria-label="Zoom out" onClick={() => setZoom((z) => z - 10)} />
          <span className="w-10 text-center tabular-nums">{zoom}%</span>
          <Button variant="kolbox" iconOnly="plus" aria-label="Zoom in" onClick={() => setZoom((z) => z + 10)} />
        </span>
        <span className="text-oq-64">{'UTF-8      LF'}</span>
      </StatusBar>
    </div>
  )
}
