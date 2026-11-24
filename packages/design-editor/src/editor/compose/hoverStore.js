import { useSyncExternalStore } from 'react'

/* The layer under the pointer, shared by the canvas and the Layers list so a hover on either lights both. */
let hover = null
const subs = new Set()
export const setHoverLayer = (id) => {
  if (id === hover) return
  hover = id
  subs.forEach((f) => f())
}
export const useHoverLayer = () => useSyncExternalStore((f) => { subs.add(f); return () => subs.delete(f) }, () => hover)
