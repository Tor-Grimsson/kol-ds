import { ChessPiece } from '@kolkrabbi/kol-chess'

export const stage = 'hug'

/* A handful of vector pieces from the default set — pure presentational,
 * driven only by `piece` / `color` props. */
const PIECES = [
  { piece: 'king', color: 'white' },
  { piece: 'queen', color: 'black' },
  { piece: 'knight', color: 'white' },
  { piece: 'bishop', color: 'black' },
  { piece: 'rook', color: 'white' },
]

export default function ChessPieceDemo() {
  return (
    <>
      {PIECES.map(({ piece, color }) => (
        <ChessPiece key={`${color}-${piece}`} piece={piece} color={color} size={72} />
      ))}
    </>
  )
}
