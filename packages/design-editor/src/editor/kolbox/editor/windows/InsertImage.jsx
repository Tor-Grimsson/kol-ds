import { useEffect, useRef } from 'react'
import { CANVAS_H, CANVAS_W, isTyping, matchCombo, shortcutById, useComposeState } from '../engine.js'

/* Insert image (round 3, 4.1), as the real ActionBar does it: the computer's file picker, then the picked image as a
   photo layer contained to 720 and centred in the frame (cover). The real one listens for `kol:insert-image`, fired by
   Tools › Insert image inside the menu's click so the picker keeps the press's activation; kolbox has no action bar,
   so this host listens in its place, mounted with the screen's windows. */
export const insertImage = () => window.dispatchEvent(new CustomEvent('kol:insert-image'))

export function InsertImageHost() {
  const { addLayer } = useComposeState()
  const fileRef = useRef(null)
  useEffect(() => {
    const on = () => fileRef.current?.click()
    /* its key (⇧⌘K, Figma's) here in the capture phase, so the search modal's ⌘K never takes it too */
    const key = (e) => {
      if (isTyping(e) || !matchCombo(e, shortcutById('insert-image').combo)) return
      e.preventDefault(); e.stopPropagation()
      on()
    }
    window.addEventListener('kol:insert-image', on)
    window.addEventListener('keydown', key, true)
    return () => { window.removeEventListener('kol:insert-image', on); window.removeEventListener('keydown', key, true) }
  }, [])
  const onPick = (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => {
        if (!img.naturalWidth || !img.naturalHeight) return
        const k = Math.min(1, 720 / img.naturalWidth, 720 / img.naturalHeight)
        const w = Math.round(img.naturalWidth * k), h = Math.round(img.naturalHeight * k)
        addLayer('photo', { src: reader.result, x: Math.round((CANVAS_W - w) / 2), y: Math.round((CANVAS_H - h) / 2), w, h, fit: 'cover' })
      }
      img.src = reader.result
    }
    reader.readAsDataURL(file)
  }
  return <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onPick} data-insert-image />
}
