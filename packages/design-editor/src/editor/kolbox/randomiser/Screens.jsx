import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  effectHost, ensureWebcam, FILTERS, flatCategories, GENERATIVE_TREE, GROUP_ICONS, stillToDataUrl, transport, useLayerEdit,
} from './engine.js'
import { pickMedia } from '../editor/windows/WindowMediaPicker.jsx'
import Icon from '../ui/Icon.jsx'
import { Button, ModalShell } from '@kolkrabbi/kol-component'

/* The randomiser's full-screen cards (the real editor/mobile EntryScreen, CategoryScreen, EffectScreen and the
   randomiser's source picker), in kolbox's kit: the Labs start picker's card (app/LabsStartPicker.jsx), a PopoverShell on
   the dim, each row a Button with its glyph at both ends. 480 wide as kolbox's Modal, never wider than the window less
   16 a side, so it fits a phone. The real's rules: Escape closes a sheet (its onDismiss, else its Back), playback pauses
   while a sheet covers the stage and resumes if it was playing (useSheetChrome); the entry card has neither.
   The dim leaves the KOL mark reachable (it sits above it), as the real card leaves the hub's rail live. */
const WIDTH = 'min(var(--spacing-modal), calc(100vw - var(--spacing-4) * 2))'

function useSheetChrome(close) {
  const ref = useRef(close); ref.current = close
  useEffect(() => {
    /* the media picker or a menu over the card takes its own Escape */
    const onKey = (e) => { if (e.key === 'Escape' && document.querySelectorAll('[data-kolbox-overlay]').length <= 1) ref.current?.() }
    window.addEventListener('keydown', onKey)
    const wasPlaying = transport.isPlaying()
    transport.pause()
    return () => { window.removeEventListener('keydown', onKey); if (wasPlaying) transport.play() }
  }, [])
}

function ScreenCard({ title, children }) {
  return createPortal(
    <div data-kolbox-overlay="modal" className="fixed inset-0 z-50 flex flex-col items-center overflow-y-auto bg-dim p-4">
      <ModalShell variant="kolbox" title={title} aria-label={title ?? 'Randomiser'} width={WIDTH} aria-modal="true" className="my-auto max-h-none! shrink-0" data-randomiser-card="">
        <div className="flex flex-col gap-4 px-4 pb-4">{children}</div>
      </ModalShell>
    </div>,
    document.body,
  )
}

export const Row = ({ icon, label, tone = 'secondary', onClick }) => (
  <Button variant="kolbox" tone={tone} className="w-full justify-between!" iconLeft={icon} onClick={onClick}>
    {label}
    <Icon name={icon} />
  </Button>
)
const Rows = ({ children }) => <div className="flex flex-col gap-2">{children}</div>

/* the opening card: "Randomiser", Generate, Effects */
export function EntryScreen({ onGenerate, onEffects }) {
  return (
    <ScreenCard title="Randomiser">
      <Rows>
        <Row icon="refresh" label="Generate" onClick={onGenerate} />
        <Row icon="filter" label="Effects" onClick={onEffects} />
      </Rows>
    </ScreenCard>
  )
}

/* the ONE generator list (entry flow and the Generator button): the generators, then Insert image or video and Back */
export function CategoryScreen({ onPick, onInsert, onBack, onDismiss }) {
  useSheetChrome(onDismiss ?? onBack)
  return (
    <ScreenCard title="Pick a generator">
      <Rows>
        {GENERATIVE_TREE.map((entry) => {
          const icon = GROUP_ICONS[`gen:${entry.label}`] ?? 'square'
          return <Row key={entry.label} icon={icon} label={entry.label} onClick={() => onPick(entry)} />
        })}
      </Rows>
      <Rows>
        {onInsert && <Row icon="image" label="Insert image or video" tone="ghost" onClick={onInsert} />}
        {onBack && <Row icon="arrow-left" label="Back" tone="ghost" onClick={onBack} />}
      </Rows>
    </ScreenCard>
  )
}

/* Add effect: the categories, then a category's effects; Back unwinds one level, then closes */
export function EffectScreen({ layer, chain, onPick, onBack }) {
  const [catId, setCatId] = useState(null)
  useSheetChrome(onBack)
  const { engineHost } = effectHost(layer)
  const engineOk = engineHost && !chain.some((s) => s.def?.kind === 'engine')
  const categories = flatCategories(FILTERS.filter((f) => f.kind !== 'engine' || engineOk))
  const category = categories.find((c) => c.id === catId) ?? null
  return (
    <ScreenCard title={category ? category.label : 'Pick an effect'}>
      <Rows>
        {(category ? category.filters : categories).map((item) => (
          <Row key={item.id} icon={category ? 'filter' : 'chevron-right'} label={item.label} onClick={() => (category ? onPick(item.id) : setCatId(item.id))} />
        ))}
      </Rows>
      <Row icon="arrow-left" label="Back" tone="ghost" onClick={() => (category ? setCatId(null) : onBack())} />
    </ScreenCard>
  )
}

/* Effects' first step: the media it works on, From library (the kit's media picker), Upload or Camera, then Back,
   which unwinds the empty layer. The writes are the real useSourceInput's (LabsSourcePicker.jsx), as Labs' SourceCard
   makes them. A camera refused or missing says so under the rows, in the browser's words, and the step stays. */
export function SourceScreen({ layer, onBack }) {
  const { patch } = useLayerEdit(layer.id)
  const fileRef = useRef(null)
  const [camera, setCamera] = useState(null)
  useSheetChrome(onBack)
  const onCamera = () => {
    setCamera(null)
    const refused = (err) => setCamera(`Camera: ${err?.message || err?.name || 'not available'}`)
    try { ensureWebcam(layer.id).then(() => patch({ src: null, srcType: 'webcam' }), refused) } catch (err) { refused(err) }
  }
  const onFile = (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    if (file.type.startsWith('video/')) patch({ src: URL.createObjectURL(file), srcType: 'video' })
    else stillToDataUrl(file).then((src) => patch({ src, srcType: 'image' }))
  }
  return (
    <ScreenCard>
      <input ref={fileRef} type="file" accept="image/*,video/*" className="hidden" onChange={onFile} />
      <Rows>
        <Row icon="image" label="From library" onClick={() => pickMedia({ accept: ['image', 'video'], layerId: layer.id })} />
        <Row icon="upload" label="Upload" onClick={() => fileRef.current?.click()} />
        <Row icon="camera" label="Camera" onClick={onCamera} />
      </Rows>
      {camera && <p role="alert" className="text-help text-muted" data-camera-refused>{camera}</p>}
      <Row icon="arrow-left" label="Back" tone="ghost" onClick={onBack} />
    </ScreenCard>
  )
}
