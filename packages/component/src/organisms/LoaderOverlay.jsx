import FullscreenOverlay from '../atoms/FullscreenOverlay.jsx'

/**
 * LoaderOverlay — mounts a loading curtain over everything, dead center. A thin
 * composition: it wraps DS FullscreenOverlay for the fixed, top-`z`,
 * scroll-locking backdrop (replacing the app's hand-rolled `fixed inset-0 …
 * z-[100]` div and its `CursorProvider`), then renders `children` — or the
 * `loader` slot — as the overlay content. Being mounted IS being visible;
 * the parent removes this element to dismiss.
 *
 * The loader is a SLOT, not a built-in: inject a curtain (e.g. `<ColorLoader/>`
 * from `@kolkrabbi/kol-foundry`) via `loader` and wire its completion callback
 * yourself. The slot is mounted in a `fixed inset-0` box that escapes
 * FullscreenOverlay's centered, `--kol-container-max`-width sheet so the loader
 * fills the screen. Pass `children` instead to mount anything else, centered.
 * With neither, the loader slot renders nothing (the overlay still works).
 *
 * @param {ReactNode} children overlay content, centered (takes precedence)
 * @param {ReactNode} loader   full-screen loading curtain, e.g. foundry's ColorLoader
 */
export default function LoaderOverlay({ children, loader }) {
  return (
    <FullscreenOverlay open>
      {children || (loader ? <div className="fixed inset-0">{loader}</div> : null)}
    </FullscreenOverlay>
  )
}
