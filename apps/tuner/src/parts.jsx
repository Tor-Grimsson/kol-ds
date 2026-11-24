import { useEffect, useState } from 'react'

/* What the app keeps: settings across reloads, H, a file read. The boards are kol-component's LogoSystem and LogoTuner. */

/* settings kept in this browser; a value saved under an old shape is dropped key by key, never trusted whole */
export function useStored(key, init) {
  const [v, setV] = useState(() => {
    try { const s = JSON.parse(localStorage.getItem(key) || 'null'); return s && typeof s === 'object' ? { ...init, ...s } : init } catch { return init }
  })
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(v)) } catch { /* private window: kept for the visit only */ } }, [key, v])
  return [v, setV]
}

/* H switches between the full board and the form alone, as on the canvas */
export function usePeek() {
  const [peek, setPeek] = useState(false)
  useEffect(() => {
    const down = (e) => { const t = e.target || {}; if ((e.key === 'h' || e.key === 'H') && !e.repeat && !e.metaKey && !e.ctrlKey && !e.altKey && !/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName || '') && !t.isContentEditable) setPeek((p) => !p) }
    window.addEventListener('keydown', down)
    return () => window.removeEventListener('keydown', down)
  }, [])
  return peek
}

/* a file read as the canvas read it: an image, and an SVG's own text beside it so its curves can be read */
export function readFile(file, done) {
  if (!file || !/^image\//.test(file.type)) return
  const reader = new FileReader()
  reader.onload = () => {
    const img = new Image()
    img.onload = () => {
      if (/svg/.test(file.type)) { const txt = new FileReader(); txt.onload = () => { img.__svg = txt.result; done(img, reader.result) }; txt.onerror = () => done(img, reader.result); txt.readAsText(file) } else done(img, reader.result)
    }
    img.src = reader.result
  }
  reader.readAsDataURL(file)
}
