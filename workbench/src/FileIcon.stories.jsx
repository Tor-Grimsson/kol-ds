import { FileIcon } from '@kolkrabbi/kol-component'

const Row = ({ children }) => (
  <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-end' }}>{children}</div>
)

export const Kinds = () => (
  <Row>
    <FileIcon ext="wav" glyph="music-note" className="w-[96px]" />
    <FileIcon ext="json" glyph="code" className="w-[96px]" />
    <FileIcon ext="md" className="w-[96px]" />
    <FileIcon className="w-[96px]" />
  </Row>
)

/* the box sets the size; the label scales with the page, never on its own */
export const Sizes = () => (
  <Row>
    {[24, 48, 96, 160].map((w) => <div key={w} style={{ width: w }}><FileIcon ext="pdf" className="w-full" /></div>)}
  </Row>
)
