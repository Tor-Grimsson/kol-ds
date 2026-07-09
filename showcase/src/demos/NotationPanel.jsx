import { useState } from 'react'
import { NotationPanel } from '@kolkrabbi/kol-chess'

export const stage = 'md'

/* Inline SAN move list (Ruy Lopez, Berlin). NotationPanel is pure-props:
 * `notationPairs` in, `onSelectPly` out — no game engine, no context. */
const NOTATION_PAIRS = [
  { moveNumber: 1, white: { san: 'e4', ply: 1 }, black: { san: 'e5', ply: 2 } },
  { moveNumber: 2, white: { san: 'Nf3', ply: 3 }, black: { san: 'Nc6', ply: 4 } },
  { moveNumber: 3, white: { san: 'Bb5', ply: 5 }, black: { san: 'Nf6', ply: 6 } },
  { moveNumber: 4, white: { san: 'O-O', ply: 7 }, black: { san: 'Nxe4', ply: 8 } },
  { moveNumber: 5, white: { san: 'd4', ply: 9 }, black: { san: 'Nd6', ply: 10 } },
  { moveNumber: 6, white: { san: 'Bxc6', ply: 11 }, black: { san: 'dxc6', ply: 12 } },
]

export default function NotationPanelDemo() {
  const [activePly, setActivePly] = useState(5)
  return (
    <NotationPanel
      notationPairs={NOTATION_PAIRS}
      activePly={activePly}
      onSelectPly={setActivePly}
    />
  )
}
