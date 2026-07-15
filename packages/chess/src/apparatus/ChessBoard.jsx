import { useEffect, useMemo, useState } from 'react'
import { ChessPiece } from '../index.js'
import buildChessFromFen from '../utils/chessFen'

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
// no text-transform (casing law) — coordinate labels are authored in-case
const FILE_LABELS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
const PIECE_TYPE_MAP = {
  p: 'pawn',
  r: 'rook',
  n: 'knight',
  b: 'bishop',
  q: 'queen',
  k: 'king'
}

export const BOARD_THEMES = {
  'blue-gray': { light: '#E8EDF9', dark: '#B7C0D8' },
  'gray': { light: '#EFEFEF', dark: '#A6A6A6' },
  'green-white': { light: '#ffffff', dark: '#0a682a' },
  'olive': { light: '#EFEED2', dark: '#779557' },
  'dark': { light: '#4D4D51', dark: '#242427' },
  'brown': { light: '#F0D9B5', dark: '#B58863' }
}

const getSquareTone = (fileIndex, rankIndex) =>
  (fileIndex + rankIndex) % 2 === 0 ? 'light' : 'dark'

const getBoardSize = (size) => {
  if (size === 'fluid') return '100%'
  const sizeMap = {
    mobile: '384px',
    tablet: '520px',
    desktop: '760px'
  }
  return sizeMap[size] || size
}

const getPieceSize = (size) => {
  if (size === 'fluid') return '75%'
  const sizeMap = {
    sm: '44px',
    md: '64px',
    lg: '76px',
    mobile: '40px',
    tablet: '52px',
    desktop: '76px'
  }
  return sizeMap[size] || sizeMap.lg
}

/* Board input (brief 3.0). Two mutually exclusive entry points:
 *   interactive + onMove — click-to-move: tap a side-to-move piece, legal
 *     targets mark up, tap one → onMove({ from, to, promotion }). Illegal
 *     targets no-op. Legality comes from chess.js on the rendered fen, so
 *     the board never emits a move the position doesn't allow.
 *   onSquareClick — raw square reporting (edit mode): every click calls
 *     onSquareClick(coordinate, piece) and the selection UX is bypassed. */
const ChessBoard = ({ fen, size = 'desktop', orientation = 'white', showPieces = true, lastMove = null, pieceSet = 'default', boardTheme = 'green-white', interactive = false, onMove = null, onSquareClick = null }) => {
  const { chess, boardState } = useMemo(() => {
    const instance = buildChessFromFen(fen)
    return { chess: instance, boardState: instance.board() }
  }, [fen])

  const [selectedSquare, setSelectedSquare] = useState(null)
  useEffect(() => { setSelectedSquare(null) }, [fen])

  const legalTargets = useMemo(() => {
    if (!interactive || !onMove || !selectedSquare) return new Map()
    try {
      return new Map(chess.moves({ square: selectedSquare, verbose: true }).map((move) => [move.to, move]))
    } catch { return new Map() /* kingless display positions can't generate moves */ }
  }, [interactive, onMove, selectedSquare, chess])

  const hasInput = Boolean(onSquareClick || (interactive && onMove))

  const handleSquareClick = (coordinate, squarePiece) => {
    if (onSquareClick) { onSquareClick(coordinate, squarePiece); return }
    if (!interactive || !onMove) return
    if (selectedSquare) {
      if (coordinate === selectedSquare) { setSelectedSquare(null); return }
      const move = legalTargets.get(coordinate)
      if (move) {
        setSelectedSquare(null)
        // ponytail: auto-queen; promotion picker when someone underpromotes
        onMove({ from: move.from, to: move.to, promotion: 'q' })
        return
      }
    }
    let turn = 'w'
    try { turn = chess.turn() } catch { /* keep default */ }
    setSelectedSquare(squarePiece && squarePiece.color === turn ? coordinate : null)
  }

  const isFluid = size === 'fluid'
  const boardPixelSize = getBoardSize(size)
  const piecePixelSize = getPieceSize(size)
  const squarePixelSize = isFluid ? '100%' : `${parseInt(boardPixelSize) / 8}px`
  const coordinatePaddingClass = size === 'mobile' ? 'p-1' : size === 'tablet' ? '!p-1.5' : 'p-2'
  const coordinateTypographyClass = size === 'mobile' ? 'kol-helper-8' : 'kol-helper-12'
  const rankIndices =
    orientation === 'white'
      ? [...Array(boardState.length).keys()]
      : [...Array(boardState.length).keys()].reverse()
  const fileIndices =
    orientation === 'white'
      ? [...Array(FILES.length).keys()]
      : [...Array(FILES.length).keys()].reverse()

  const filesForOrientation = orientation === 'white' ? FILES : [...FILES].reverse()
  const ranksForOrientation =
    orientation === 'white'
      ? [...Array(8).keys()].map((i) => 8 - i)
      : [...Array(8).keys()].map((i) => i + 1)

  const theme = BOARD_THEMES[boardTheme] || BOARD_THEMES['green-white']

  return (
    <div className="chess-board-wrapper">
      <div
        className={`chess-board${isFluid ? ' chess-board--fluid' : ''}`}
        style={isFluid ? undefined : { width: boardPixelSize, height: boardPixelSize }}
      >
        <div className="chess-board__grid">
          {rankIndices.map((rankIndex) =>
            fileIndices.map((fileIndex) => {
              const square = boardState[rankIndex][fileIndex]
              const tone = getSquareTone(fileIndex, rankIndex)
              const coordinate = `${FILES[fileIndex]}${8 - rankIndex}`
              const pieceType = square?.type ?? null
              const pieceColor = square?.color === 'b' ? 'black' : 'white'
              const pieceName = pieceType ? PIECE_TYPE_MAP[pieceType] : null

              const isLastMoveSquare = lastMove && (coordinate === lastMove.from || coordinate === lastMove.to)

              const squareClass =
                tone === 'light'
                  ? 'chess-square chess-square--light'
                  : 'chess-square chess-square--dark'

              const targetMove = legalTargets.get(coordinate)
              const inputClasses = [
                hasInput ? 'chess-square--interactive' : '',
                coordinate === selectedSquare ? 'chess-square--selected' : '',
                targetMove ? (square ? 'chess-square--target-capture' : 'chess-square--target') : ''
              ].filter(Boolean).join(' ')

              const highlightClass = isLastMoveSquare ? 'chess-square--highlighted' : ''

              const rankNum = 8 - rankIndex
              const fileLetter = FILE_LABELS[fileIndex]
              const isDarkSquare = tone === 'dark'
              const textColor = isDarkSquare ? 'text-white' : 'text-[#166534]'
              const isFirstRank = rankNum === 1
              const isFirstRankFromBlack = rankNum === 8
              const isAFile = fileIndex === 0

              const squareColor = tone === 'light' ? theme.light : theme.dark

              return (
                <div
                  key={coordinate}
                  className={`${squareClass} ${highlightClass} ${inputClasses}`}
                  data-square={coordinate}
                  style={{ backgroundColor: squareColor }}
                  onClick={hasInput ? () => handleSquareClick(coordinate, square) : undefined}
                >
                  {showPieces && pieceName ? (
                    <div className="relative z-10 flex items-center justify-center" style={{ width: squarePixelSize, height: squarePixelSize }}>
                      <ChessPiece piece={pieceName} color={pieceColor} size={piecePixelSize} pieceSet={pieceSet} />
                    </div>
                  ) : null}

                  {/* Coordinate labels - absolutely positioned to overlay on pieces */}
                  <div className="absolute inset-0 pointer-events-none">
                    {orientation === 'white' ? (
                      // White orientation labels
                      isFirstRank ? (
                        coordinate === 'a1' ? (
                          <div className={`${coordinatePaddingClass} flex justify-between w-full h-full`}>
                            <div className={`flex items-start text-white ${coordinateTypographyClass}`}>
                              <span>1</span>
                            </div>
                            <div className={`flex items-end text-white ${coordinateTypographyClass}`}>
                              <span>A</span>
                            </div>
                          </div>
                        ) : (
                          <div className={`${coordinatePaddingClass} flex justify-end items-end ${textColor} ${coordinateTypographyClass} w-full h-full`}>
                            <span>{fileLetter}</span>
                          </div>
                        )
                      ) : isAFile ? (
                        <div className={`${coordinatePaddingClass} flex justify-start items-start ${textColor} ${coordinateTypographyClass} w-full h-full`}>
                          <span>{rankNum}</span>
                        </div>
                      ) : null
                    ) : (
                      // Black orientation labels (flipped)
                      isFirstRankFromBlack ? (
                        coordinate === 'a8' ? (
                          <div className={`${coordinatePaddingClass} flex justify-between w-full h-full`}>
                            <div className={`flex items-start text-white ${coordinateTypographyClass}`}>
                              <span>8</span>
                            </div>
                            <div className={`flex items-end text-white ${coordinateTypographyClass}`}>
                              <span>A</span>
                            </div>
                          </div>
                        ) : (
                          <div className={`${coordinatePaddingClass} flex justify-end items-end ${textColor} ${coordinateTypographyClass} w-full h-full`}>
                            <span>{fileLetter}</span>
                          </div>
                        )
                      ) : isAFile ? (
                        <div className={`${coordinatePaddingClass} flex justify-start items-start ${textColor} ${coordinateTypographyClass} w-full h-full`}>
                          <span>{rankNum}</span>
                        </div>
                      ) : null
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}

export default ChessBoard
