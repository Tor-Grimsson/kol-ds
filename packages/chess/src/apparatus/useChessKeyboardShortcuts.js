import { useEffect } from 'react'
import { useChessControls } from '../context/ChessControlsContext'

/**
 * useChessKeyboardShortcuts — the board's global keyboard map: ←/→ step,
 * Space toggles playback, Home/End jump, F flips orientation. Skips events
 * from inputs/textareas. Call once from whatever composes the rail.
 *
 * Extracted from AlternativeControlsMock (0.5.2).
 */
export default function useChessKeyboardShortcuts() {
  const {
    stepBackward,
    stepForward,
    togglePlayback,
    goToStart,
    goToEnd,
    toggleOrientation
  } = useChessControls()

  useEffect(() => {
    const handleKeyDown = (event) => {
      // Don't intercept if user is typing in an input
      if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
        return
      }

      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault()
          stepBackward()
          break
        case 'ArrowRight':
          event.preventDefault()
          stepForward()
          break
        case ' ':
          event.preventDefault()
          togglePlayback()
          break
        case 'Home':
          event.preventDefault()
          goToStart()
          break
        case 'End':
          event.preventDefault()
          goToEnd()
          break
        case 'f':
        case 'F':
          event.preventDefault()
          toggleOrientation()
          break
        default:
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [stepBackward, stepForward, togglePlayback, goToStart, goToEnd, toggleOrientation])
}
