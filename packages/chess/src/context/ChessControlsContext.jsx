// Sample games are consumer-provided via the `chessData` prop (no bundled dataset).
// Required: chessData.getSampleGames() → array of games (each with a .pgn).
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { Chess } from 'chess.js'
import buildMoveTree from '../utils/parsePgnTree'
import buildChessFromFen from '../utils/chessFen'

const ChessControlsContext = createContext(null)

const PIECE_LETTER = {
  pawn: 'p', rook: 'r', knight: 'n', bishop: 'b', queen: 'q', king: 'k'
}

const calculateCapturedPieces = (fen) => {
  if (!fen) return { white: [], black: [] }

  const startingPieces = {
    p: 8, r: 2, n: 2, b: 2, q: 1, k: 1
  }

  const currentPieces = { w: { p: 0, r: 0, n: 0, b: 0, q: 0, k: 0 }, b: { p: 0, r: 0, n: 0, b: 0, q: 0, k: 0 } }

  // Parse FEN board portion
  const boardPortion = fen.split(' ')[0]
  for (const char of boardPortion) {
    if (char === '/') continue
    if (!isNaN(char)) continue

    const color = char === char.toLowerCase() ? 'b' : 'w'
    const piece = char.toLowerCase()
    if (currentPieces[color][piece] !== undefined) {
      currentPieces[color][piece]++
    }
  }

  // Calculate captured pieces (what's missing from starting position)
  const captured = { white: [], black: [] }

  // Black captured white pieces (white pieces missing)
  for (const [piece, count] of Object.entries(startingPieces)) {
    const missing = count - currentPieces.w[piece]
    for (let i = 0; i < missing; i++) {
      captured.black.push(piece)
    }
  }

  // White captured black pieces (black pieces missing)
  for (const [piece, count] of Object.entries(startingPieces)) {
    const missing = count - currentPieces.b[piece]
    for (let i = 0; i < missing; i++) {
      captured.white.push(piece)
    }
  }

  return captured
}

const createSnapshotsFromPgn = (pgn) => {
  const bootstrap = new Chess()
  const positions = [
    {
      fen: bootstrap.fen(),
      move: null,
      ply: 0
    }
  ]

  if (!pgn) {
    return positions
  }

  const mainline = buildMoveTree(pgn)
  if (!mainline.length) {
    console.warn('[ChessControlsContext] Failed to parse PGN, reverting to start position.')
    return positions
  }

  const replay = new Chess()
  mainline.forEach((node, index) => {
    const move = replay.move(node.san, { sloppy: true })
    if (!move) {
      console.warn('[ChessControlsContext] Invalid SAN in PGN, stopping replay.', node.san)
      return
    }
    positions.push({
      fen: replay.fen(),
      move: {
        san: move.san,
        color: move.color,
        moveNumber: Math.ceil((index + 1) / 2),
        from: move.from,
        to: move.to
      },
      ply: index + 1
    })
  })

  return positions
}

/* SAN run with PGN move numbers — `3. Nc3 Nf6 4. Bb5` / `3... Nf6 4. Bb5` */
const formatSanLine = (moves, startPly) => {
  const parts = []
  moves.forEach((move, index) => {
    const ply = startPly + index
    const moveNumber = Math.ceil(ply / 2)
    if (ply % 2 === 1) parts.push(`${moveNumber}.`)
    else if (index === 0) parts.push(`${moveNumber}...`)
    parts.push(move.san)
  })
  return parts.join(' ')
}

export const ChessControlsProvider = ({ children, externalGame = null, chessData }) => {
  const getSampleGames = chessData?.getSampleGames ?? (() => [])
  const defaultGames = useMemo(
    () => getSampleGames().filter((game) => Boolean(game?.pgn)),
    [getSampleGames]
  )

  const gamesWithExternal = useMemo(() => {
    if (!externalGame?.pgn) {
      return defaultGames
    }
    const remaining = defaultGames.filter((game) => game.id !== externalGame.id)
    return [externalGame, ...remaining]
  }, [defaultGames, externalGame])

  const [searchQuery, setSearchQuery] = useState('')
  const filteredGames = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) {
      return gamesWithExternal
    }
    return gamesWithExternal.filter((game) => {
      const haystack = [
        game.player?.username,
        game.opponent?.username,
        game.timeClass,
        game.timeControl,
        game.opening?.name
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return haystack.includes(query)
    })
  }, [gamesWithExternal, searchQuery])

  const [selectedGameId, setSelectedGameId] = useState(() => filteredGames[0]?.id ?? null)

  useEffect(() => {
    setSelectedGameId((prev) => {
      if (prev && filteredGames.some((game) => game.id === prev)) {
        return prev
      }
      return filteredGames[0]?.id ?? null
    })
  }, [filteredGames])

  /* A newly injected externalGame ACTIVATES (brief 2.0 §2.3): the archive
   * table / paste flow hands a game in expecting the BOARD to switch — the
   * old keep-prev rule above left it as just another dropdown row. */
  useEffect(() => {
    if (externalGame?.id) setSelectedGameId(externalGame.id)
  }, [externalGame])

  const selectedGame = useMemo(() => {
    if (!selectedGameId) {
      return filteredGames[0] ?? null
    }
    return filteredGames.find((game) => game.id === selectedGameId) ?? filteredGames[0] ?? null
  }, [filteredGames, selectedGameId])

  const [snapshots, setSnapshots] = useState(() =>
    createSnapshotsFromPgn(selectedGame?.pgn ?? null)
  )
  const [moveTree, setMoveTree] = useState(() => buildMoveTree(selectedGame?.pgn ?? null))
  const [moveIndex, setMoveIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [orientation, setOrientation] = useState(
    selectedGame?.playerColor === 'black' ? 'black' : 'white'
  )
  const [isEditMode, setIsEditMode] = useState(false)
  /* Sidelines (brief 3.0): board moves off the mainline branch here.
   * ponytail: flat, one level — each sideline hangs off a mainline ply and
   * carries its own prefix; a nested variation tree when analysis needs it.
   *   [{ id, parentPly, moves: [{ san, from, to, fen }] }]
   * The cursor is either the mainline (activeSideline null, snapshots[moveIndex])
   * or a sideline move (activeSideline = { id, index }). */
  const [sidelines, setSidelines] = useState([])
  const [activeSideline, setActiveSideline] = useState(null)
  const [editPlacement, setEditPlacement] = useState(null)
  const [pieceSet, setPieceSet] = useState('default')
  const [boardTheme, setBoardTheme] = useState('green-white') // Current default

  useEffect(() => {
    setOrientation(selectedGame?.playerColor === 'black' ? 'black' : 'white')
  }, [selectedGame?.playerColor])

  useEffect(() => {
    setIsLoading(true)
    const nextSnapshots = createSnapshotsFromPgn(selectedGame?.pgn ?? null)
    const nextMoveTree = buildMoveTree(selectedGame?.pgn ?? null)
    setSnapshots(nextSnapshots)
    setMoveTree(nextMoveTree)
    setMoveIndex(0)
    setIsPlaying(false)
    setSidelines([])
    setActiveSideline(null)
    setIsLoading(false)
  }, [selectedGame?.pgn])

  const activeLine = useMemo(
    () => (activeSideline ? sidelines.find((line) => line.id === activeSideline.id) ?? null : null),
    [activeSideline, sidelines]
  )

  const activeFen = activeLine
    ? activeLine.moves[activeSideline.index]?.fen
    : snapshots[moveIndex]?.fen

  const goToStart = useCallback(() => {
    setActiveSideline(null)
    setMoveIndex(0)
  }, [])
  const goToEnd = useCallback(() => {
    if (activeLine) {
      setActiveSideline({ id: activeLine.id, index: activeLine.moves.length - 1 })
      return
    }
    setMoveIndex(snapshots.length - 1)
  }, [activeLine, snapshots.length])
  const stepBackward = useCallback(() => {
    if (activeLine) {
      setActiveSideline((cursor) =>
        cursor.index > 0 ? { id: cursor.id, index: cursor.index - 1 } : null
      )
      return
    }
    setMoveIndex((index) => Math.max(index - 1, 0))
  }, [activeLine])
  const stepForward = useCallback(() => {
    if (activeLine) {
      setActiveSideline((cursor) => ({
        id: cursor.id,
        index: Math.min(cursor.index + 1, activeLine.moves.length - 1)
      }))
      return
    }
    setMoveIndex((index) => Math.min(index + 1, snapshots.length - 1))
  }, [activeLine, snapshots.length])

  const atLineEnd = activeLine
    ? activeSideline.index >= activeLine.moves.length - 1
    : moveIndex >= snapshots.length - 1

  useEffect(() => {
    if (!isPlaying) return
    if (atLineEnd) {
      setIsPlaying(false)
      return
    }
    const timer = setTimeout(() => stepForward(), 900)

    return () => clearTimeout(timer)
  }, [isPlaying, atLineEnd, stepForward])

  const togglePlayback = useCallback(() => {
    if (atLineEnd) {
      if (activeLine) setActiveSideline({ id: activeLine.id, index: 0 })
      else setMoveIndex(0)
    }
    setIsPlaying((value) => !value)
  }, [atLineEnd, activeLine])

  const toggleOrientation = useCallback(
    () => setOrientation((value) => (value === 'white' ? 'black' : 'white')),
    []
  )

  const toggleEditMode = useCallback(() => {
    setIsEditMode((value) => {
      if (value) setEditPlacement(null)
      return !value
    })
  }, [])

  const handleSelectGame = useCallback((gameId) => {
    setSelectedGameId(gameId || null)
  }, [])

  /* Mainline notation click — always lands back on the mainline. */
  const selectPly = useCallback((ply) => {
    setActiveSideline(null)
    setIsPlaying(false)
    setMoveIndex(ply)
  }, [])

  const goToSidelineMove = useCallback((id, index) => {
    const line = sidelines.find((candidate) => candidate.id === id)
    if (!line || !line.moves[index]) return
    setIsPlaying(false)
    setMoveIndex(line.parentPly)
    setActiveSideline({ id, index })
  }, [sidelines])

  const removeSideline = useCallback((id) => {
    setActiveSideline((cursor) => (cursor?.id === id ? null : cursor))
    setSidelines((prev) => prev.filter((line) => line.id !== id))
  }, [])

  /* Board input (brief 3.0): validate against the current position, then
   * either follow the line we're on or branch a sideline. Returns whether
   * the move landed — an illegal pair is a no-op. */
  const playMove = useCallback(({ from, to, promotion = 'q' }) => {
    if (!activeFen) return false
    const chess = buildChessFromFen(activeFen)
    let move
    try {
      move = chess.move({ from, to, promotion })
    } catch {
      return false
    }
    if (!move) return false
    const nextFen = chess.fen()
    const played = { san: move.san, from: move.from, to: move.to, fen: nextFen }
    setIsPlaying(false)

    if (!activeLine) {
      const nextSnapshot = snapshots[moveIndex + 1]
      if (nextSnapshot?.move?.san === move.san) {
        setMoveIndex(moveIndex + 1)
        return true
      }
      const existing = sidelines.find(
        (line) => line.parentPly === moveIndex && line.moves[0]?.san === move.san
      )
      if (existing) {
        setActiveSideline({ id: existing.id, index: 0 })
        return true
      }
      const id = crypto.randomUUID()
      setSidelines((prev) => [...prev, { id, parentPly: moveIndex, moves: [played] }])
      setActiveSideline({ id, index: 0 })
      return true
    }

    const cursorIndex = activeSideline.index
    const nextMove = activeLine.moves[cursorIndex + 1]
    if (nextMove?.san === move.san) {
      setActiveSideline({ id: activeLine.id, index: cursorIndex + 1 })
      return true
    }
    if (cursorIndex === activeLine.moves.length - 1) {
      setSidelines((prev) =>
        prev.map((line) =>
          line.id === activeLine.id ? { ...line, moves: [...line.moves, played] } : line
        )
      )
      setActiveSideline({ id: activeLine.id, index: cursorIndex + 1 })
      return true
    }
    /* Deviating mid-sideline: the flat model copies the shared prefix into a
     * fresh sideline instead of nesting. */
    const id = crypto.randomUUID()
    const prefix = activeLine.moves.slice(0, cursorIndex + 1)
    setSidelines((prev) => [...prev, { id, parentPly: activeLine.parentPly, moves: [...prefix, played] }])
    setActiveSideline({ id, index: cursorIndex + 1 })
    return true
  }, [activeFen, activeLine, activeSideline, sidelines, snapshots, moveIndex])

  const loadEmptyPosition = useCallback(() => {
    const emptyBoard = new Chess()
    emptyBoard.clear()
    setSnapshots([
      {
        fen: emptyBoard.fen(),
        move: null,
        ply: 0
      }
    ])
    setMoveTree([])
    setMoveIndex(0)
    setIsPlaying(false)
    setSelectedGameId(null)
    setSidelines([])
    setActiveSideline(null)
  }, [])

  /* Edit mode (brief 3.0): palette piece selected → place it (replacing any
   * occupant); nothing selected → clear the square. Editing collapses the
   * position to a single setup snapshot — it's a position editor, not a
   * game move. */
  const placePiece = useCallback((square) => {
    if (!activeFen) return
    const chess = buildChessFromFen(activeFen)
    if (editPlacement) {
      const placed = chess.put(
        { type: PIECE_LETTER[editPlacement.piece] ?? 'p', color: editPlacement.color === 'black' ? 'b' : 'w' },
        square
      )
      if (!placed) return
    } else {
      chess.remove(square)
    }
    setSnapshots([{ fen: chess.fen(), move: null, ply: 0 }])
    setMoveTree([])
    setMoveIndex(0)
    setIsPlaying(false)
    setSidelines([])
    setActiveSideline(null)
  }, [activeFen, editPlacement])

  /* Movetext rebuilt from state — sidelines land inline as PGN variations
   * after the mainline move they replace. */
  const getPgnWithVariations = useCallback(() => {
    const source = selectedGame?.pgn ?? ''
    if (!sidelines.length) return source
    const headers = source.match(/^\[[^\]]*\]\s*$/gm)?.join('\n') ?? ''
    const result = source.match(/(1-0|0-1|1\/2-1\/2|\*)\s*$/)?.[1] ?? ''
    const parts = []
    snapshots.forEach((snapshot) => {
      if (!snapshot.move) return
      if (snapshot.move.color === 'w') parts.push(`${Math.ceil(snapshot.ply / 2)}.`)
      parts.push(snapshot.move.san)
      sidelines
        .filter((line) => line.parentPly === snapshot.ply - 1)
        .forEach((line) => parts.push(`(${formatSanLine(line.moves, line.parentPly + 1)})`))
    })
    const lastPly = snapshots.length - 1
    sidelines
      .filter((line) => line.parentPly >= lastPly)
      .forEach((line) => parts.push(`(${formatSanLine(line.moves, line.parentPly + 1)})`))
    if (result) parts.push(result)
    const movetext = parts.join(' ')
    return headers ? `${headers}\n\n${movetext}` : movetext
  }, [selectedGame?.pgn, sidelines, snapshots])

  const notationPairs = useMemo(() => {
    const pairs = []
    snapshots.forEach((snapshot) => {
      if (!snapshot.move) return
      const moveNumber = Math.ceil(snapshot.ply / 2)
      const isWhiteMove = snapshot.move.color === 'w'
      if (!pairs[moveNumber - 1]) {
        pairs[moveNumber - 1] = {
          moveNumber,
          white: null,
          black: null
        }
      }
      pairs[moveNumber - 1][isWhiteMove ? 'white' : 'black'] = {
        san: snapshot.move.san,
        ply: snapshot.ply
      }
    })
    return pairs || []
  }, [snapshots])

  const activeColor = useMemo(() => {
    if (!activeFen) return 'white'
    const parts = activeFen.split(' ')
    return parts[1] === 'b' ? 'black' : 'white'
  }, [activeFen])

  /* from/to ride each move at creation (snapshots + sideline moves), so the
   * old replay-the-whole-game memo is gone. */
  const lastMove = useMemo(() => {
    if (activeLine) {
      const move = activeLine.moves[activeSideline.index]
      return move ? { from: move.from, to: move.to } : null
    }
    const move = snapshots[moveIndex]?.move
    return move?.from ? { from: move.from, to: move.to } : null
  }, [activeLine, activeSideline, snapshots, moveIndex])

  const capturedPieces = useMemo(() => {
    return calculateCapturedPieces(activeFen)
  }, [activeFen])

  const contextValue = {
    searchQuery,
    setSearchQuery,
    filteredGames,
    selectedGame,
    selectedGameId,
    setSelectedGameId: handleSelectGame,
    snapshots,
    moveIndex,
    setMoveIndex,
    selectPly,
    notationPairs,
    goToStart,
    goToEnd,
    stepBackward,
    stepForward,
    togglePlayback,
    isPlaying,
    isLoading,
    orientation,
    setOrientation,
    toggleOrientation,
    activeFen,
    activeColor,
    loadEmptyPosition,
    playMove,
    sidelines,
    activeSideline,
    goToSidelineMove,
    removeSideline,
    getPgnWithVariations,
    moveTree,
    isEditMode,
    toggleEditMode,
    editPlacement,
    setEditPlacement,
    placePiece,
    lastMove,
    capturedPieces,
    pieceSet,
    setPieceSet,
    boardTheme,
    setBoardTheme
  }

  return (
    <ChessControlsContext.Provider value={contextValue}>
      {children}
    </ChessControlsContext.Provider>
  )
}

export const useChessControls = () => {
  const context = useContext(ChessControlsContext)
  if (!context) {
    throw new Error('useChessControls must be used within a ChessControlsProvider')
  }
  return context
}

export { createSnapshotsFromPgn }
