import { useEffect, useState } from 'react'
import {
  bucketOptions, CANVAS_H, CANVAS_W, DEFAULT_BUCKET, isImageType, KOL_LOGO_NATURAL_DIMS, KOL_LOGO_VARIANTS, KolLogo, listMedia,
  mediaSrc, useComposeState,
} from '../engine.js'
import WindowPane from './WindowPane.jsx'
import { ButtonGroup, TreeRow } from '@kolkrabbi/kol-component'

/* Assets, as the real AssetsBody (compose/AssetsBody.jsx), in his words "its own window" (Figma plan W7): Logos with
   the list and grid views (list by default), a press inserts the logo as a shape at its natural size in the frame's
   middle; then Images, the first twelve images of the first store the media client lists, a press inserts a photo
   layer at the frame's full bounds. Images is not drawn while it loads empty or fails, as the real one. */
const THUMBS = 12
const VIEWS = [['list', 'list-bullet', 'List view'], ['grid', 'grid', 'Grid view']]
const Title = ({ children, actions }) => (
  <div className="flex h-6 items-center justify-between">
    <h3 className="text-section text-text">{children}</h3>
    {actions}
  </div>
)

function ImageThumbs() {
  const { addLayer } = useComposeState()
  const [state, setState] = useState({ status: 'loading', items: [], bucket: null })
  useEffect(() => {
    const ac = new AbortController()
    const bucket = bucketOptions()[0]?.value ?? DEFAULT_BUCKET
    listMedia('', { bucket, signal: ac.signal })
      .then((objs) => setState({ status: 'ready', bucket, items: objs.filter((o) => isImageType(o.contentType)).slice(0, THUMBS) }))
      .catch((e) => { if (e.name !== 'AbortError') setState({ status: 'error', items: [], bucket }) })
    return () => ac.abort()
  }, [])
  if (state.status === 'error' || (state.status === 'ready' && !state.items.length)) return null
  return (
    <section className="flex flex-col gap-2" data-assets-images>
      <Title>Images</Title>
      {state.status === 'loading' ? <p className="text-help text-muted">Loading…</p> : (
        <div className="grid grid-cols-3 gap-2">
          {state.items.map((o) => (
            <button key={o.key} type="button" title={o.key.split('/').pop()} onClick={() => addLayer('photo', { src: mediaSrc(o.key, state.bucket), fit: 'cover' })}
              className="flex flex-col gap-1 rounded-well p-1 text-left outline-none hover:bg-field focus-visible:outline-solid focus-visible:outline-1 focus-visible:outline-accent">
              <img src={mediaSrc(o.key, state.bucket)} alt="" loading="lazy" className="aspect-square w-full rounded-control object-cover" />
              <span className="truncate px-1 text-help text-text">{o.key.split('/').pop()}</span>
            </button>
          ))}
        </div>
      )}
    </section>
  )
}

export default function WindowAssets({ onClose }) {
  const { addLayer } = useComposeState()
  const [view, setView] = useState('list')
  const insertLogo = (variant) => {
    const dims = KOL_LOGO_NATURAL_DIMS[variant] ?? { w: 320, h: 320 }
    addLayer('shape', { variant, x: (CANVAS_W - dims.w) / 2, y: (CANVAS_H - dims.h) / 2, w: dims.w, h: dims.h })
  }
  const logo = (variant, cls) => <span className={`block text-text ${cls}`}><KolLogo variant={variant} className="block h-full w-full" /></span>
  return (
    <WindowPane title="Assets" name="assets" onClose={onClose}>
      <section className="flex flex-col gap-2" data-assets-logos>
        <Title actions={<ButtonGroup layout="joined" variant="kolbox" options={VIEWS.map(([v, icon, label]) => ({ icon, ariaLabel: label, pressed: view === v, onPress: () => setView(v) }))}/>}>Logos</Title>
        {view === 'grid' ? (
          <div className="grid grid-cols-2 gap-2">
            {KOL_LOGO_VARIANTS.map((v) => (
              <button key={v} type="button" onClick={() => insertLogo(v)} data-logo={v}
                className="flex flex-col gap-1 rounded-well p-1 text-left outline-none hover:bg-field focus-visible:outline-solid focus-visible:outline-1 focus-visible:outline-accent">
                <span className="flex aspect-square w-full rounded-control bg-field p-3">{logo(v, 'h-full w-full')}</span>
                <span className="truncate px-1 text-help text-text">{v}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="-mx-2 flex flex-col">
            {KOL_LOGO_VARIANTS.map((v) => (
              <TreeRow variant="kolbox" key={v} onClick={() => insertLogo(v)} data-logo={v}
                label={<span className="flex items-center gap-2">{logo(v, 'h-4 w-6 shrink-0')}<span className="truncate font-mono text-value">{v}</span></span>} />
            ))}
          </div>
        )}
      </section>
      <ImageThumbs />
    </WindowPane>
  )
}
