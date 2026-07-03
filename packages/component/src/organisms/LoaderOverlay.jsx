import FullscreenOverlay from '../atoms/FullscreenOverlay.jsx'
import ColorLoader from './ColorLoader.jsx'

/**
 * LoaderOverlay — mounts a loading curtain over everything, dead center. A thin
 * composition: it wraps DS FullscreenOverlay for the fixed, top-`z`,
 * scroll-locking backdrop (replacing the app's hand-rolled `fixed inset-0 …
 * z-[100]` div and its `CursorProvider`), then renders `children` — or a
 * default ColorLoader — as the overlay content. Being mounted IS being visible;
 * the parent removes this element to dismiss.
 *
 * The default ColorLoader is a full-viewport `dismissOnClick` curtain whose
 * completion is wired to `onEnter`. A `fixed inset-0` box escapes
 * FullscreenOverlay's centered, `--kol-container-max`-width sheet so the loader
 * fills the screen. Pass `children` to drop that and mount anything else.
 *
 * @param {ReactNode}  children  overlay content; defaults to a full-screen ColorLoader
 * @param {() => void} onEnter   fired when the default ColorLoader completes/dismisses
 */
export default function LoaderOverlay({ children, onEnter }) {
  return (
    <FullscreenOverlay open>
      {children || (
        <div className="fixed inset-0">
          <ColorLoader onComplete={onEnter} dismissOnClick />
        </div>
      )}
    </FullscreenOverlay>
  )
}
