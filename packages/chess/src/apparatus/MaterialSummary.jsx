import React from 'react'
import ChessPiece from '../ChessPiece.jsx'
import { BOARD_THEMES } from './ChessBoard'
import { useChessControls } from '../context/ChessControlsContext'

const PIECE_MAP = {
  p: 'pawn',
  r: 'rook',
  n: 'knight',
  b: 'bishop',
  q: 'queen',
  k: 'king'
}

const PIECE_VALUES = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 }

/**
 * MaterialSummary — the MATERIAL evaluation bar (tinted by the active board
 * theme) plus the per-side captured-piece rows with point totals. Reads
 * capturedPieces / boardTheme / pieceSet from context. Padding-free —
 * composer owns chrome via `className`.
 *
 * Extracted from AlternativeControlsMock (0.5.2).
 *
 * @param {string} className chrome from the composer
 */
export default function MaterialSummary({ className = '' }) {
  const { capturedPieces, boardTheme, pieceSet } = useChessControls()

  const boardColors = BOARD_THEMES[boardTheme] || BOARD_THEMES['green-white']

  // Calculate material advantage
  const materialEvaluation = (() => {
    const whitePieces = capturedPieces?.white || []
    const blackPieces = capturedPieces?.black || []

    const whiteValue = whitePieces.reduce((sum, piece) => sum + (PIECE_VALUES[piece] || 0), 0)
    const blackValue = blackPieces.reduce((sum, piece) => sum + (PIECE_VALUES[piece] || 0), 0)

    const diff = whiteValue - blackValue
    const percentage = Math.min(Math.max((diff + 15) / 30, 0), 1) * 100

    return { diff, percentage, advantage: diff > 0 ? 'white' : diff < 0 ? 'black' : 'equal' }
  })()

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {/* Material Evaluation Bar */}
      <div className="flex flex-col gap-2 flex-shrink-0">
        <div className="flex items-center justify-between">
          <span className="kol-helper-12 text-fg-80">MATERIAL</span>
          {materialEvaluation.advantage !== 'equal' && (
            <span className="kol-mono-10 text-fg-80">
              {materialEvaluation.advantage === 'white' ? '+' : ''}{materialEvaluation.diff}
            </span>
          )}
        </div>
        <div className="h-2 bg-fg-04 rounded-full overflow-hidden relative">
          <div
            className="absolute top-0 left-0 h-full transition-all duration-300"
            style={{ width: `${materialEvaluation.percentage}%`, backgroundColor: boardColors.light }}
          />
          <div
            className="absolute top-0 right-0 h-full transition-all duration-300"
            style={{ width: `${100 - materialEvaluation.percentage}%`, backgroundColor: boardColors.dark }}
          />
        </div>
      </div>

      <div className="flex flex-row gap-6 flex-shrink-0">
        {['white', 'black'].map((color) => {
          const pieces = capturedPieces?.[color] || []
          const materialValue = pieces.reduce((sum, piece) => sum + (PIECE_VALUES[piece] || 0), 0)

          return (
            <div key={color} className="flex flex-col gap-2 flex-1">
              <div className="flex items-center justify-between">
                <span className="kol-helper-10 text-fg-64">{color === 'white' ? 'WHITE' : 'BLACK'}</span>
                {materialValue > 0 && (
                  <span className="kol-mono-10 text-fg-80">+{materialValue}</span>
                )}
              </div>
              <div className="flex flex-wrap gap-1 min-h-[24px]">
                {pieces.map((piece, index) => (
                  <div key={`${color}-captured-${index}`} className="flex items-center justify-center">
                    <ChessPiece piece={PIECE_MAP[piece]} color={color === 'white' ? 'black' : 'white'} size="20px" pieceSet={pieceSet} />
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
