import { useEffect, useMemo, useRef, useState } from 'react'
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
 *   interactive + onMove — THREE gestures onto one move: tap a side-to-move
 *     piece and tap a marked target · press it and drag onto the target
 *     (mouse, touch and pen, one pointer-event path) · tab to it and press
 *     Enter or Space. All three commit through the same `legalTargets` map →
 *     onMove({ from, to, promotion }). Illegal targets no-op. Legality comes
 *     from chess.js on the rendered fen, so the board never emits a move the
 *     position doesn't allow. Supply `dests` and that half is handed over —
 *     see below.
 *   onSquareClick — raw square reporting (edit mode): every click calls
 *     onSquareClick(coordinate, piece), and the selection UX AND the drag are
 *     both bypassed — `interactive` is false there, so no press arms.
 *
 * A square is a CONTROL — role, tab stop, `aria-label` ("e2, white pawn"),
 * `aria-pressed` for the selection. It was a bare div with an onClick, which
 * made the whole board unusable without a pointer.
 *
 * ── `dests` — LEGALITY FROM OUTSIDE (ChessBoardInputAndVariantSeam §3,
 * kol-chess 2026-08-31) ─────────────────────────────────────────────────────
 * `Map<from, to[]>` (a plain object works too) — the shape chessops'
 * `chessgroundDests()` already returns. Supply it and the board stops asking
 * chess.js anything: these squares can be picked up, those are their targets,
 * full stop. Omit it and nothing changes.
 *
 * This is the whole reason Chess960 and the variants were unreachable in
 * PRINCIPLE rather than merely unimplemented. The board was renderer AND rules
 * engine, so no prop, wrapper or CSS could reach the decision, and chess.js has
 * no castling in a 960 position and no variant rules to offer — the only
 * consumer-side route was forking the component.
 *
 * The seam is deliberately additive and the engine is NOT swapped. chess.js
 * stays the default so every current consumer is untouched, and a consumer that
 * wants chessops supplies dests FROM chessops rather than this package taking
 * the dependency for everyone. That makes the engine swap a later choice
 * instead of a precondition. */
const ChessBoard = ({ fen, size = 'desktop', orientation = 'white', showPieces = true, lastMove = null, pieceSet = 'default', boardTheme = 'green-white', interactive = false, onMove = null, onSquareClick = null, dests = null }) => {
  const { chess, boardState } = useMemo(() => {
    const instance = buildChessFromFen(fen)
    return { chess: instance, boardState: instance.board() }
  }, [fen])

  const [selectedSquare, setSelectedSquare] = useState(null)
  useEffect(() => { setSelectedSquare(null) }, [fen])

  /* `dests` accepts a Map or a plain object — chessops hands back a Map, a
   * server hands back JSON, and making the consumer convert one into the other
   * is a chore with no upside. */
  const destsFor = (square) => {
    if (!dests || !square) return null
    const tos = typeof dests.get === 'function' ? dests.get(square) : dests[square]
    return Array.isArray(tos) ? tos : null
  }

  const legalTargets = useMemo(() => {
    if (!interactive || !onMove || !selectedSquare) return new Map()
    /* SUPPLIED LEGALITY WINS OUTRIGHT — it is not merged with chess.js and not
     * checked against it. A variant's rules are not a superset of standard
     * chess, so a board that consulted both would emit moves neither engine
     * agreed to. `{ from, to }` is the whole move: this board never had more
     * than that to hand `onMove` anyway. */
    if (dests) {
      const tos = destsFor(selectedSquare) ?? []
      return new Map(tos.map((to) => [to, { from: selectedSquare, to }]))
    }
    try {
      return new Map(chess.moves({ square: selectedSquare, verbose: true }).map((move) => [move.to, move]))
    } catch { return new Map() /* kingless display positions can't generate moves */ }
  }, [interactive, onMove, selectedSquare, chess, dests])

  /* WHAT CAN BE PICKED UP. With `dests` the authority is "does this square have
   * targets" — a variant may let you move a piece the side-to-move test would
   * refuse, and in a 960 position chess.js's own turn is not a safe proxy. */
  const canPick = (coordinate, squarePiece) => {
    if (dests) return (destsFor(coordinate)?.length ?? 0) > 0
    let turn = 'w'
    try { turn = chess.turn() } catch { /* keep default */ }
    return Boolean(squarePiece) && squarePiece.color === turn
  }

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
    setSelectedSquare(canPick(coordinate, squarePiece) ? coordinate : null)
  }

  /* ── DRAG-AND-DROP ──
   *
   * Click-to-move was the only input, which is workable on a desktop and wrong
   * on a phone: dragging a piece is the primary gesture on both lichess and
   * chess.com, and its absence is the first thing a player notices.
   *
   * POINTER events, not HTML5 drag-and-drop: `dragstart`/`drop` do not fire on
   * touch at all, so an HTML5 implementation would have added drag for exactly
   * the devices that already worked. Pointer events are one code path for
   * mouse, touch and pen.
   *
   * ⚠️ THE CLICK AFTER A SELECTING PRESS DOES NOT FIRE. Measured in Chromium on
   * this board: pressing a piece re-renders the square, React replaces the node
   * the mousedown landed on (the glyph's `<path>`), and a browser that cannot
   * find a common ancestor for mousedown and mouseup drops the `click` — the
   * event log for a first tap is pointerdown · mousedown · pointerup · mouseup
   * · lostpointercapture and no click at all. A second tap on an already-
   * selected square changes no state, nothing remounts, and the click DOES
   * fire. So the click is present or absent depending on whether the press
   * changed the board, and nothing may depend on it arriving.
   *
   * Hence: A PRESS ON YOUR OWN PIECE IS AUTHORITATIVE. pointerdown does the
   * whole selection toggle for that square — select, or deselect if it was
   * already selected — and pointerup commits the drag through `legalTargets`,
   * the same map the click path reads, so there is ONE legality lookup here.
   *
   * Every other square — empty, enemy, the target you are moving to — is left
   * entirely to `onClick`, which is why tap-to-move commits exactly as it did.
   *
   * `skipClickRef` swallows the click when it DOES arrive after a press we
   * already handled. It is reset at the top of every pointerdown rather than
   * only when consumed: a flag that is cleared by a click that may never come
   * is a latch, and a stale one eats the next real click — which is precisely
   * how the first version of this broke tap-to-deselect. */
  const dragFromRef = useRef(null)
  const skipClickRef = useRef(false)

  const handlePointerDown = (coordinate, squarePiece) => (event) => {
    skipClickRef.current = false
    if (!interactive || !onMove || onSquareClick) return
    /* a drag arms on a square that has somewhere to go, and nowhere else */
    if (!canPick(coordinate, squarePiece)) return
    /* capture so pointerup still reaches us when the finger leaves the square */
    event.currentTarget.setPointerCapture?.(event.pointerId)
    dragFromRef.current = coordinate
    /* the same toggle `handleSquareClick` applies to an own-piece square. Its
     * legal-target branch is not mirrored here: a target square never holds a
     * piece of the side to move, so this press can never be one. */
    setSelectedSquare(coordinate === selectedSquare ? null : coordinate)
    skipClickRef.current = true
  }

  const handlePointerUp = (event) => {
    const from = dragFromRef.current
    dragFromRef.current = null
    if (!from) return
    /* what is under the finger, which is not the element that captured it */
    const el = document.elementFromPoint(event.clientX, event.clientY)
    const to = el?.closest?.('[data-square]')?.getAttribute('data-square')
    if (!to || to === from) return
    const move = legalTargets.get(to)
    if (!move) return
    setSelectedSquare(null)
    // ponytail: auto-queen, same as the click path
    onMove({ from: move.from, to: move.to, promotion: 'q' })
    /* a completed drag consumes the click that follows it, if one follows */
    skipClickRef.current = true
  }

  const handleClick = (coordinate, squarePiece) => () => {
    if (skipClickRef.current) { skipClickRef.current = false; return }
    handleSquareClick(coordinate, squarePiece)
  }

  const isFluid = size === 'fluid'
  const boardPixelSize = getBoardSize(size)
  const piecePixelSize = getPieceSize(size)
  const squarePixelSize = isFluid ? '100%' : `${parseInt(boardPixelSize) / 8}px`
  /* FLUID sizes its coordinates from the SQUARE, not the prop
   * (ChessBoardFluidCoordinates, kol-chess 2026-08-26): the board is a
   * container and `.chess-coord--fluid` rides cqw (kol-theme ≥0.58.1) — at
   * 390 a 45px square carried desktop's 8px padding + 12px labels over the
   * rook. The prop-driven classes stay for the fixed sizes. */
  const coordinatePaddingClass = isFluid ? 'chess-coord--fluid' : size === 'mobile' ? 'p-1' : size === 'tablet' ? '!p-1.5' : 'p-2'
  const coordinateTypographyClass = isFluid ? '' : size === 'mobile' ? 'kol-helper-8' : 'kol-helper-12'
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
                  style={{ backgroundColor: squareColor, touchAction: hasInput ? 'none' : undefined }}
                  onClick={hasInput ? handleClick(coordinate, square) : undefined}
                  onPointerDown={hasInput ? handlePointerDown(coordinate, square) : undefined}
                  onPointerUp={hasInput ? handlePointerUp : undefined}
                  onPointerCancel={hasInput ? () => { dragFromRef.current = null } : undefined}
                  /* A SQUARE IS A CONTROL, so it is announced and reachable as
                   * one. It was a bare div with an onClick: invisible to a
                   * screen reader and unreachable by keyboard, which made the
                   * whole board unusable without a pointer. `aria-label` reads
                   * the square and its occupant; `aria-pressed` carries the
                   * selection the class already showed visually. */
                  role={hasInput ? 'button' : undefined}
                  tabIndex={hasInput ? 0 : undefined}
                  aria-label={
                    hasInput
                      ? `${coordinate}${pieceName ? `, ${pieceColor} ${pieceName}` : ', empty'}${targetMove ? ', legal move' : ''}`
                      : undefined
                  }
                  aria-pressed={hasInput ? coordinate === selectedSquare : undefined}
                  onKeyDown={
                    hasInput
                      ? (e) => {
                          if (e.key !== 'Enter' && e.key !== ' ') return
                          e.preventDefault()
                          handleSquareClick(coordinate, square)
                        }
                      : undefined
                  }
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
