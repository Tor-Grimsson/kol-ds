// Sample games are consumer-provided via the `chessData` prop (no bundled dataset).
// Required: chessData.getSampleGames() → array of games (each with a .pgn).
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { Chess } from 'chess.js'
import buildMoveTree from '../utils/parsePgnTree'

const ChessControlsContext = createContext(null)

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
        moveNumber: Math.ceil((index + 1) / 2)
      },
      ply: index + 1
    })
  })

  return positions
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
  const [userVariations, setUserVariations] = useState([])
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
    setIsLoading(false)
  }, [selectedGame?.pgn])

  useEffect(() => {
    if (!isPlaying) return
    if (moveIndex >= snapshots.length - 1) {
      setIsPlaying(false)
      return
    }
    const timer = setTimeout(() => {
      setMoveIndex((index) => Math.min(index + 1, snapshots.length - 1))
    }, 900)

    return () => clearTimeout(timer)
  }, [isPlaying, moveIndex, snapshots.length])

  const goToStart = useCallback(() => setMoveIndex(0), [])
  const goToEnd = useCallback(() => setMoveIndex(snapshots.length - 1), [snapshots.length])
  const stepBackward = useCallback(
    () => setMoveIndex((index) => Math.max(index - 1, 0)),
    []
  )
  const stepForward = useCallback(
    () => setMoveIndex((index) => Math.min(index + 1, snapshots.length - 1)),
    [snapshots.length]
  )
  const togglePlayback = useCallback(() => {
    if (moveIndex >= snapshots.length - 1) {
      setMoveIndex(0)
    }
    setIsPlaying((value) => !value)
  }, [moveIndex, snapshots.length])

  const toggleOrientation = useCallback(
    () => setOrientation((value) => (value === 'white' ? 'black' : 'white')),
    []
  )

  const toggleEditMode = useCallback(() => {
    setIsEditMode((value) => !value)
  }, [])

  const handleSelectGame = useCallback((gameId) => {
    setSelectedGameId(gameId || null)
  }, [])

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
    setUserVariations([])
  }, [])

  const addUserVariation = useCallback((label, sanSequence = []) => {
    if (!sanSequence.length) return
    const sanitized = sanSequence
      .map((san) => san.trim())
      .filter(Boolean)
      .map((san, index) => ({
        san,
        ply: moveIndex + index + 1
      }))
    if (!sanitized.length) return
    setUserVariations((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        label: label || `Variation ${prev.length + 1}`,
        moves: sanitized
      }
    ])
  }, [moveIndex])

  const removeUserVariation = useCallback((id) => {
    setUserVariations((prev) => prev.filter((variation) => variation.id !== id))
  }, [])

  const getPgnWithUserVariations = useCallback(() => {
    const base = selectedGame?.pgn ?? ''
    if (!userVariations.length) return base
    const variationText = userVariations
      .map((variation) => `; ${variation.label}: ${variation.moves.map((move) => move.san).join(' ')}`)
      .join('\n')
    return `${base}\n\n${variationText}`.trim()
  }, [selectedGame?.pgn, userVariations])

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

  const activeFen = snapshots[moveIndex]?.fen
  const activeColor = useMemo(() => {
    if (!activeFen) return 'white'
    const parts = activeFen.split(' ')
    return parts[1] === 'b' ? 'black' : 'white'
  }, [activeFen])

  const lastMove = useMemo(() => {
    if (moveIndex === 0) return null
    const snapshot = snapshots[moveIndex]
    if (!snapshot?.move) return null

    // Parse the move to extract from/to squares
    // We need to use chess.js to get the move details
    const chess = new Chess()

    // Replay up to the previous position
    for (let i = 1; i < moveIndex; i++) {
      const move = snapshots[i]?.move
      if (move) {
        chess.move(move.san, { sloppy: true })
      }
    }

    // Make the last move to get from/to
    const moveObj = chess.move(snapshot.move.san, { sloppy: true })

    return moveObj ? { from: moveObj.from, to: moveObj.to } : null
  }, [snapshots, moveIndex])

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
    activeColor,
    loadEmptyPosition,
    userVariations,
    addUserVariation,
    removeUserVariation,
    getPgnWithUserVariations,
    moveTree,
    isEditMode,
    toggleEditMode,
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
