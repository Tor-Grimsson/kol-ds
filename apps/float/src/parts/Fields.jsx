import { useEffect, useRef, useState } from 'react'
import {
  ColorField, FieldPair, InlineAddRow, Input, LabeledControl, LinkAddRow, PasswordInput, SearchInput, Textarea, ValueField,
  floatSurfaceClass,
} from '@kolkrabbi/kol-component'
import FamilyPage, { Part } from '../FamilyPage.jsx'

/* float-set W1 — family 3, Fields (24-float-system.md § The parts, by family). Each part sits on the page's float
 * material (`floatSurfaceClass`) and links to its showcase page. Layout glue only; every part is the shipped one. */
const Plate = ({ surface, className = '', children }) => (
  <div className={`${floatSurfaceClass(surface, true)} flex max-w-full flex-wrap items-center gap-4 rounded-[var(--kol-float-menu-r)] p-4 ${className}`}>{children}</div>
)

/* ColorField takes a hex string; read it off a theme token at runtime so the page holds no colour literal */
function useTokenHex(token) {
  const ref = useRef(null)
  const [hex, setHex] = useState('')
  useEffect(() => {
    const rgb = getComputedStyle(ref.current).color.match(/\d+(\.\d+)?/g)?.slice(0, 3) ?? []
    setHex(`#${rgb.map((n) => Math.round(+n).toString(16).padStart(2, '0')).join('')}`.toUpperCase())
  }, [token])
  return [hex, <span key={token} ref={ref} hidden style={{ color: `var(${token})` }} />]
}

export default function Fields() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('alex@kolkrabbi.io')
  const [q, setQ] = useState('')
  const [pw, setPw] = useState('correct-horse')
  const [note, setNote] = useState('')
  const [x, setX] = useState('1471')
  const [y, setY] = useState('516')
  const [bg, bgProbe] = useTokenHex('--kol-surface-primary')
  const [ink, inkProbe] = useTokenHex('--kol-fg-emphasis')
  return (
    <FamilyPage title="Fields" body="Where you type or read a value — the capsule on the float well.">
      {(surface) => (
        <>
          <Part name="Input states" slug="input">
            <Plate surface={surface} className="grid w-full max-w-2xl grid-cols-1 sm:grid-cols-2">
              <Input variant="float" placeholder="Scene name" value={name} onChange={(e) => setName(e.target.value)} width="100%" />
              <Input variant="float" value="Still in motion" onChange={() => {}} width="100%" />
              <Input variant="float" type="email" value="alex@" onChange={() => {}} error="Enter a valid email address." width="100%" />
              <Input variant="float" placeholder="Available after sign in" disabled width="100%" />
            </Plate>
          </Part>

          <Part name="LabeledControl" slug="labeled-control">
            <Plate surface={surface} className="w-80">
              <LabeledControl variant="float" label="Email" className="w-full">
                <Input variant="float" type="email" value={email} onChange={(e) => setEmail(e.target.value)} width="100%" />
              </LabeledControl>
            </Plate>
          </Part>

          <Part name="Textarea" slug="textarea">
            <Plate surface={surface} className="w-80"><Textarea variant="float" placeholder="Add a note…" value={note} onChange={(e) => setNote(e.target.value)} className="w-full" /></Plate>
          </Part>

          <Part name="SearchInput" slug="search-input">
            <Plate surface={surface} className="w-80"><SearchInput variant="float" value={q} onChange={(e) => setQ(e.target.value)} onClear={() => setQ('')} shortcutHint="⌘K" placeholder="Search scenes" /></Plate>
          </Part>

          <Part name="FieldPair" slug="field-pair">
            <Plate surface={surface} className="w-80">
              <FieldPair variant="float" size="sm" className="w-full" fields={[{ prefix: 'X', value: x, onChange: (e) => setX(e.target.value) }, { prefix: 'Y', value: y, onChange: (e) => setY(e.target.value) }]} />
            </Plate>
          </Part>

          <Part name="PasswordInput" slug="password-input">
            <Plate surface={surface} className="w-80"><PasswordInput variant="float" value={pw} onChange={(e) => setPw(e.target.value)} width="100%" /></Plate>
          </Part>

          <Part name="InlineAddRow" slug="inline-add-row">
            <Plate surface={surface} className="w-80"><InlineAddRow variant="float" label="New brief" onAdd={() => {}} className="w-full" /></Plate>
          </Part>

          <Part name="LinkAddRow" slug="link-add-row">
            <Plate surface={surface} className="w-full max-w-md"><LinkAddRow variant="float" title="kol-vault" href="#" onAdd={() => {}} className="w-full" /></Plate>
          </Part>

          <Part name="ColorField" slug="color-field">
            <Plate surface={surface} className="w-72 flex-col items-stretch">
              {bgProbe}{inkProbe}
              <ColorField label="Background" value={bg} />
              <ColorField label="Ink" value={ink} onClick={() => {}} />
            </Plate>
          </Part>

          <Part name="ValueField" slug="value-field">
            <Plate surface={surface}><ValueField icon="circle">Open</ValueField><ValueField size="sm">1920 × 1080</ValueField></Plate>
          </Part>
        </>
      )}
    </FamilyPage>
  )
}
